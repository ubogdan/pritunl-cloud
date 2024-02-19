package cloudinit

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"mime/multipart"
	"net"
	"net/textproto"
	"os"
	"path"
	"strings"
	"text/template"

	"github.com/dropbox/godropbox/errors"
	"github.com/pritunl/mongo-go-driver/bson/primitive"
	"github.com/pritunl/pritunl-cloud/authority"
	"github.com/pritunl/pritunl-cloud/database"
	"github.com/pritunl/pritunl-cloud/errortypes"
	"github.com/pritunl/pritunl-cloud/instance"
	"github.com/pritunl/pritunl-cloud/node"
	"github.com/pritunl/pritunl-cloud/paths"
	"github.com/pritunl/pritunl-cloud/settings"
	"github.com/pritunl/pritunl-cloud/utils"
	"github.com/pritunl/pritunl-cloud/vm"
	"github.com/pritunl/pritunl-cloud/vpc"
	"github.com/pritunl/pritunl-cloud/zone"
)

const metaDataTmpl = `instance-id: %s
local-hostname: %s`

const userDataTmpl = `Content-Type: multipart/mixed; boundary="%s"
MIME-Version: 1.0

%s`

const netConfigTmpl = `version: 1
config:
  - type: physical
    name: {{.Iface}}
    mac_address: {{.Mac}}{{.Mtu}}
    subnets:
      - type: static
        address: {{.Address}}
        netmask: {{.Netmask}}
        network: {{.Network}}
        gateway: {{.Gateway}}
        dns_nameservers:
          - {{.Dns1}}
          - {{.Dns2}}
      - type: static
        address: {{.Address6}}
        gateway: {{.Gateway6}}
`

const netConfig2Tmpl = `version: 2
ethernets:
  {{.Iface}}:
    match:
      macaddress: {{.Mac}}{{.Mtu}}
    addresses:
      - {{.Address}}
      - {{.Address6}}
    gateway4: {{.Gateway}}
    gateway6: {{.Gateway6}}
    nameservers:
      addresses:
        - {{.Dns1}}
        - {{.Dns2}}
`

const netMtu = `
    mtu: %d`

const cloudConfigTmpl = `#cloud-config
hostname: {{.Hostname}}
ssh_deletekeys: false
{{if eq .RootPasswd ""}}disable_root: true{{else}}disable_root: false{{end}}
ssh_pwauth: no
write_files:{{.WriteFiles}}
growpart:
    mode: auto
    devices: ["/"]
    ignore_growroot_disabled: false
runcmd:
  - [ sysctl, -w, net.ipv4.conf.eth0.send_redirects=0 ]
  - 'chmod 600 /etc/ssh/*_key'
  - [ systemctl, restart, sshd ]{{if .RunScript}}
  - [ /etc/cloudinit_script ]{{else}}{{end}}
users:
  - name: root
    {{if eq .RootPasswd ""}}lock-passwd: true{{else}}lock-passwd: false
    passwd: {{.RootPasswd}}
    hashed_passwd: {{.RootPasswd}}{{end}}
  - name: cloud
    groups: adm, video, wheel, systemd-journal
    selinux-user: staff_u
    sudo: ALL=(ALL) NOPASSWD:ALL
    lock-passwd: {{.LockPasswd}}
    ssh-authorized-keys:
{{range .Keys}}      - {{.}}
{{end}}`

const cloudBsdConfigTmpl = `#cloud-config
hostname: {{.Hostname}}
ssh_deletekeys: false
{{if eq .RootPasswd ""}}disable_root: true{{else}}disable_root: false{{end}}
ssh_pwauth: no
write_files:{{.WriteFiles}}
runcmd:
  - [ sysctl, net.inet.ip.redirect=0 ]
  - [ ifconfig, vtnet0, inet6, {{.Address6}}/64 ]
  - [ route, -6, add, default, {{.Gateway6}} ]{{if .RunScript}}
  - [ /etc/cloudinit_script ]{{else}}{{end}}
users:
  - name: root
    {{if eq .RootPasswd ""}}lock-passwd: true{{else}}lock-passwd: false
    passwd: {{.RootPasswd}}
    hashed_passwd: {{.RootPasswd}}{{end}}
  - name: cloud
    groups: cloud, wheel
    sudo: ALL=(ALL) NOPASSWD:ALL
    lock-passwd: {{.LockPasswd}}
    ssh-authorized-keys:
{{range .Keys}}      - {{.}}
{{end}}`

var (
	cloudConfig    = template.Must(template.New("cloud").Parse(cloudConfigTmpl))
	cloudBsdConfig = template.Must(template.New("cloud_bsd").Parse(
		cloudBsdConfigTmpl))
	netConfig  = template.Must(template.New("net").Parse(netConfigTmpl))
	netConfig2 = template.Must(template.New("net2").Parse(netConfig2Tmpl))
)

type netConfigData struct {
	Iface        string
	Mac          string
	Mtu          string
	Address      string
	AddressCidr  string
	Netmask      string
	Network      string
	Gateway      string
	Address6     string
	AddressCidr6 string
	Gateway6     string
	Dns1         string
	Dns2         string
}

type cloudConfigData struct {
	Hostname   string
	RootPasswd string
	LockPasswd string
	WriteFiles string
	RunScript  bool
	Address6   string
	Gateway6   string
	Keys       []string
}

func getUserData(db *database.Database, inst *instance.Instance,
	virt *vm.VirtualMachine, initial bool, addr6, gateway6 net.IP) (
	usrData string, err error) {

	authrs, err := authority.GetOrgRoles(db, inst.Organization,
		inst.NetworkRoles)
	if err != nil {
		return
	}

	trusted := ""
	principals := ""
	authorizedKeys := ""
	writeFiles := []*fileData{}

	data := cloudConfigData{
		Keys:     []string{},
		Hostname: strings.Replace(inst.Name, " ", "_", -1),
		Address6: addr6.String(),
		Gateway6: gateway6.String(),
	}

	if inst.RootEnabled {
		data.RootPasswd, err = utils.GenerateShadow(inst.RootPasswd)
		if err != nil {
			return
		}
	}

	if !initial {
		data.LockPasswd = "false"
	} else {
		data.LockPasswd = "true"
	}

	owner := ""
	if virt.CloudType == instance.BSD {
		owner = "root:wheel"
	} else {
		owner = "root:root"
	}

	if virt.CloudType == instance.BSD {
		resolvConf := ""

		if inst.IsIpv6Only() {
			resolvConf += fmt.Sprintf("nameserver %s\n",
				settings.Hypervisor.DnsServerPrimary6)
			resolvConf += fmt.Sprintf("nameserver %s\n",
				settings.Hypervisor.DnsServerSecondary6)
		} else {
			resolvConf += fmt.Sprintf("nameserver %s\n",
				settings.Hypervisor.DnsServerPrimary)
			resolvConf += fmt.Sprintf("nameserver %s\n",
				settings.Hypervisor.DnsServerSecondary)
		}

		writeFiles = append(writeFiles, &fileData{
			Content:     resolvConf,
			Owner:       owner,
			Path:        "/etc/resolv.conf",
			Permissions: "0644",
		})
	}

	if inst.CloudScript != "" {
		data.RunScript = true
		writeFiles = append(writeFiles, &fileData{
			Content:     inst.CloudScript,
			Owner:       owner,
			Path:        "/etc/cloudinit_script",
			Permissions: "0755",
		})
	}

	for _, authr := range authrs {
		switch authr.Type {
		case authority.SshKey:
			for _, key := range strings.Split(authr.Key, "\n") {
				data.Keys = append(data.Keys, key)
				authorizedKeys += key + "\n"
			}
			break
		case authority.SshCertificate:
			trusted += authr.Certificate + "\n"
			principals += strings.Join(authr.Roles, "\n") + "\n"
			break
		}
	}

	if trusted == "" {
		trusted = "\n"
	}
	if principals == "" {
		principals = "\n"
	}

	writeFiles = append(writeFiles, &fileData{
		Content:     trusted,
		Owner:       owner,
		Path:        "/etc/ssh/trusted",
		Permissions: "0644",
	})
	writeFiles = append(writeFiles, &fileData{
		Content:     principals,
		Owner:       owner,
		Path:        "/etc/ssh/principals",
		Permissions: "0644",
	})
	writeFiles = append(writeFiles, &fileData{
		Content:     authorizedKeys,
		Owner:       "cloud:cloud",
		Path:        "/home/cloud/.ssh/authorized_keys",
		Permissions: "0600",
	})

	data.WriteFiles, err = generateWriteFiles(writeFiles)
	if err != nil {
		return
	}

	items := []string{}

	output := &bytes.Buffer{}

	var templ *template.Template
	if virt.CloudType == instance.BSD {
		templ = cloudBsdConfig
	} else {
		templ = cloudConfig
	}

	err = templ.Execute(output, data)
	if err != nil {
		err = &errortypes.ParseError{
			errors.Wrap(err, "cloudinit: Failed to exec cloud template"),
		}
		return
	}
	items = append(items, output.String())

	buffer := &bytes.Buffer{}
	message := multipart.NewWriter(buffer)
	for _, item := range items {
		header := textproto.MIMEHeader{}

		header.Set("Content-Transfer-Encoding", "base64")
		header.Set("MIME-Version", "1.0")

		if strings.HasPrefix(item, "#!") {
			header.Set("Content-Type",
				"text/x-shellscript; charset=\"utf-8\"")
		} else {
			header.Set("Content-Type",
				"text/cloud-config; charset=\"utf-8\"")
		}

		part, e := message.CreatePart(header)
		if e != nil {
			err = &errortypes.ParseError{
				errors.Wrap(e, "cloudinit: Failed to create part"),
			}
			return
		}

		_, err = part.Write(
			[]byte(base64.StdEncoding.EncodeToString([]byte(item)) + "\n"))
		if err != nil {
			err = &errortypes.WriteError{
				errors.Wrap(err, "cloudinit: Failed to write part"),
			}
			return
		}
	}

	err = message.Close()
	if err != nil {
		err = &errortypes.WriteError{
			errors.Wrap(err, "cloudinit: Failed to close message"),
		}
		return
	}

	usrData = fmt.Sprintf(
		userDataTmpl,
		message.Boundary(),
		buffer.String(),
	)

	return
}

func getNetData(db *database.Database, inst *instance.Instance,
	virt *vm.VirtualMachine) (netData string, addr6, gateway6 net.IP,
	err error) {

	if len(virt.NetworkAdapters) == 0 {
		err = &errortypes.NotFoundError{
			errors.Wrap(err, "cloudinit: Instance missing network adapters"),
		}
		return
	}

	adapter := virt.NetworkAdapters[0]

	if adapter.Vpc.IsZero() {
		err = &errortypes.NotFoundError{
			errors.Wrap(err, "cloudinit: Instance missing VPC"),
		}
		return
	}

	if adapter.Subnet.IsZero() {
		err = &errortypes.NotFoundError{
			errors.Wrap(err, "cloudinit: Instance missing VPC subnet"),
		}
		return
	}

	zne, err := zone.Get(db, node.Self.Zone)
	if err != nil {
		return
	}

	vc, err := vpc.Get(db, adapter.Vpc)
	if err != nil {
		return
	}

	vcNet, err := vc.GetNetwork()
	if err != nil {
		return
	}

	addr, gatewayAddr, err := vc.GetIp(db, inst.Subnet, inst.Id)
	if err != nil {
		return
	}

	cidr, _ := vcNet.Mask.Size()

	addr6 = vc.GetIp6(addr)
	gateway6 = vc.GetGatewayIp6(addr)

	dns1 := ""
	dns2 := ""
	if inst.IsIpv6Only() {
		dns1 = settings.Hypervisor.DnsServerPrimary6
		dns2 = settings.Hypervisor.DnsServerSecondary6
	} else {
		dns1 = settings.Hypervisor.DnsServerPrimary
		dns2 = settings.Hypervisor.DnsServerSecondary
	}

	data := netConfigData{
		Mac:          adapter.MacAddress,
		Address:      addr.String(),
		AddressCidr:  fmt.Sprintf("%s/%d", addr.String(), cidr),
		Netmask:      net.IP(vcNet.Mask).String(),
		Network:      vcNet.IP.String(),
		Gateway:      gatewayAddr.String(),
		Address6:     addr6.String(),
		AddressCidr6: addr6.String() + "/64",
		Gateway6:     gateway6.String(),
		Dns1:         dns1,
		Dns2:         dns2,
	}

	if virt.CloudType == instance.BSD {
		data.Iface = "vtnet0"
	} else {
		data.Iface = "eth0"
	}

	data.Mtu = fmt.Sprintf(netMtu, instance.GetInstanceMtu(
		node.Self.JumboFrames || node.Self.JumboFramesInternal,
		zne.NetworkMode == zone.VxlanVlan,
	))

	output := &bytes.Buffer{}

	if settings.Hypervisor.CloudInitNetVer == 2 {
		err = netConfig2.Execute(output, data)
	} else {
		err = netConfig.Execute(output, data)
	}
	if err != nil {
		err = &errortypes.ParseError{
			errors.Wrap(err, "cloudinit: Failed to exec cloud template"),
		}
		return
	}

	netData = output.String()

	return
}

func Write(db *database.Database, inst *instance.Instance,
	virt *vm.VirtualMachine, initial bool) (err error) {

	tempDir := paths.GetTempDir()
	metaPath := path.Join(tempDir, "meta-data")
	userPath := path.Join(tempDir, "user-data")
	netPath := path.Join(tempDir, "network-config")
	initPath := paths.GetInitPath(inst.Id)

	defer os.RemoveAll(tempDir)

	err = utils.ExistsMkdir(paths.GetInitsPath(), 0755)
	if err != nil {
		return
	}

	err = utils.ExistsMkdir(tempDir, 0700)
	if err != nil {
		return
	}

	netData, addr6, gateway6, err := getNetData(db, inst, virt)
	if err != nil {
		return
	}

	usrData, err := getUserData(db, inst, virt, initial, addr6, gateway6)
	if err != nil {
		return
	}

	metaData := fmt.Sprintf(metaDataTmpl,
		primitive.NewObjectID().Hex(),
		strings.Replace(inst.Name, " ", "_", -1),
	)

	err = utils.CreateWrite(metaPath, metaData, 0644)
	if err != nil {
		return
	}

	if !virt.DhcpServer {
		err = utils.CreateWrite(netPath, netData, 0644)
		if err != nil {
			return
		}
	}

	err = utils.CreateWrite(userPath, usrData, 0644)
	if err != nil {
		return
	}

	args := []string{
		"-output", initPath,
		"-volid", "cidata",
		"-joliet",
		"-rock",
		"user-data",
		"meta-data",
	}

	if !virt.DhcpServer {
		args = append(args, "network-config")
	}

	_, err = utils.ExecCombinedOutputLoggedDir(
		nil, tempDir,
		"genisoimage",
		args...,
	)
	if err != nil {
		return
	}

	err = utils.Chmod(initPath, 0600)
	if err != nil {
		return
	}

	return
}
