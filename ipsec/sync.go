package ipsec

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/Sirupsen/logrus"
	"github.com/dropbox/godropbox/container/set"
	"github.com/dropbox/godropbox/errors"
	"github.com/pritunl/mongo-go-driver/bson/primitive"
	"github.com/pritunl/pritunl-cloud/database"
	"github.com/pritunl/pritunl-cloud/errortypes"
	"github.com/pritunl/pritunl-cloud/interfaces"
	"github.com/pritunl/pritunl-cloud/link"
	"github.com/pritunl/pritunl-cloud/node"
	"github.com/pritunl/pritunl-cloud/settings"
	"github.com/pritunl/pritunl-cloud/utils"
	"github.com/pritunl/pritunl-cloud/vm"
	"github.com/pritunl/pritunl-cloud/vpc"
)

var (
	syncLock = utils.NewMultiTimeoutLock(1 * time.Minute)
)

func syncStates(vc *vpc.Vpc) {
	accquired, lockId := syncLock.LockOpen(vc.Id.Hex())
	if !accquired {
		return
	}
	defer syncLock.Unlock(vc.Id.Hex(), lockId)

	db := database.GetDatabase()
	defer db.Close()

	vcNet, err := vc.GetNetwork()
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"vpc_id": vc.Id.Hex(),
			"error":  err,
		}).Error("ipsec: Failed to get ipsec link network")
		return
	}

	netAddr, err := vc.GetIp(db, vpc.Gateway, vc.Id)
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"vpc_id": vc.Id.Hex(),
			"error":  err,
		}).Error("ipsec: Failed to get ipsec link local IPv4 address")
		return
	}

	netAddr6 := vc.GetIp6(netAddr)
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"vpc_id": vc.Id.Hex(),
			"error":  err,
		}).Error("ipsec: Failed to get ipsec link local IPv6 address")
		return
	}

	netCidr, _ := vcNet.Mask.Size()

	err = networkConf(db, vc, netAddr.String(), netAddr6.String(), netCidr)
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"vpc_id":        vc.Id.Hex(),
			"local_address": netAddr.String(),
			"error":         err,
		}).Error("ipsec: Failed to configure ipsec link network")
		networkConfClear(vc.Id)
		return
	}

	pubAddr := ""
	pubAddr6 := ""
	for i := 0; i < 3; i++ {
		pubAddr, pubAddr6, err = syncAddr(vc)
		if err != nil {
			return
		}

		if pubAddr6 != "" {
			break
		}

		time.Sleep(500 * time.Millisecond)
	}

	if pubAddr == "" && pubAddr6 == "" {
		logrus.WithFields(logrus.Fields{
			"vpc_id":          vc.Id.Hex(),
			"local_address":   netAddr.String(),
			"public_address":  pubAddr,
			"public_address6": pubAddr6,
		}).Error("ipsec: Failed to get IP address for ipsec link")
		return
	}

	states := link.GetStates(vc.Id, vc.LinkUris,
		netAddr.String(), pubAddr, pubAddr6)
	hsh := md5.New()

	names := set.NewSet()
	for _, stat := range states {
		for i := range stat.Links {
			names.Add(fmt.Sprintf("%s-%d", stat.Id, i))
		}
		io.WriteString(hsh, stat.Hash)
	}

	newHash := hex.EncodeToString(hsh.Sum(nil))

	link.HashesLock.Lock()
	curHash := link.Hashes[vc.Id]
	link.HashesLock.Unlock()

	if newHash != curHash {
		logrus.WithFields(logrus.Fields{
			"vpc_id": vc.Id.Hex(),
		}).Info("ipsec: Deploying IPsec state")

		err = deploy(vc.Id, states)
		if err != nil {
			logrus.WithFields(logrus.Fields{
				"vpc_id": vc.Id.Hex(),
				"error":  err,
			}).Error("ipsec: Failed to deploy state")
			return
		}

		link.HashesLock.Lock()
		link.Hashes[vc.Id] = newHash
		link.HashesLock.Unlock()
	}

	resetLinks, err := link.Update(vc.Id, names)
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"vpc_id":          vc.Id.Hex(),
			"local_address":   netAddr.String(),
			"public_address":  pubAddr,
			"public_address6": pubAddr6,
		}).Info("ipsec: Failed to get status")
	}

	if resetLinks != nil && len(resetLinks) != 0 {
		logrus.WithFields(logrus.Fields{
			"vpc_id": vc.Id.Hex(),
		}).Warning("ipsec: Disconnected timeout restarting")

		err = deploy(vc.Id, states)
		if err != nil {
			logrus.WithFields(logrus.Fields{
				"vpc_id": vc.Id.Hex(),
				"error":  err,
			}).Error("ipsec: Failed to deploy state")
			return
		}
	}
}

func removeNamespace(vcId primitive.ObjectID) {
	accquired, lockId := syncLock.LockOpen(vcId.Hex())
	if !accquired {
		return
	}
	defer syncLock.Unlock(vcId.Hex(), lockId)

	err := stop(vcId)
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"vpc_id": vcId.Hex(),
			"error":  err,
		}).Error("ipsec: Failed to stop ipsec")
		return
	}

	err = networkConfClear(vcId)
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"vpc_id": vcId.Hex(),
			"error":  err,
		}).Error("ipsec: Failed to clear network state")
		return
	}

	namespace := vm.GetLinkNamespace(vcId, 0)
	namespacePth := fmt.Sprintf("/etc/netns/%s", namespace)
	os.RemoveAll(namespacePth)
}

func SyncStates(vpcs []*vpc.Vpc) (err error) {
	if interfaces.HasExternal() {
		return
	}

	db := database.GetDatabase()
	defer db.Close()

	curVpcs := set.NewSet()
	curNamespaces := set.NewSet()
	curVirtIfaces := set.NewSet()
	curExternalIfaces := set.NewSet()
	sync := []*vpc.Vpc{}

	for _, vc := range vpcs {
		if vc.LinkUris == nil || len(vc.LinkUris) == 0 {
			continue
		}

		if vc.LinkNode != node.Self.Id &&
			time.Since(vc.LinkTimestamp) < time.Duration(
				settings.Ipsec.LinkTimeout)*time.Second {

			continue
		}

		held, err := vc.PingLink(db)
		if err != nil {
			logrus.WithFields(logrus.Fields{
				"error": err,
			}).Error("ipsec: Failed to update link timestamp")
			continue
		}

		if !held {
			continue
		}

		curVpcs.Add(vc.Id)
		curNamespaces.Add(vm.GetLinkNamespace(vc.Id, 0))
		curVirtIfaces.Add(vm.GetLinkIfaceVirt(vc.Id, 0))
		curVirtIfaces.Add(vm.GetLinkIfaceVirt(vc.Id, 1))
		curExternalIfaces.Add(vm.GetLinkIfaceExternal(vc.Id, 0))

		sync = append(sync, vc)
	}

	for _, vc := range sync {
		go syncStates(vc)
	}

	iterfaces, err := utils.GetInterfaces()
	if err != nil {
		return
	}

	for _, iface := range iterfaces {
		if len(iface) != 14 || !strings.HasPrefix(iface, "y") {
			continue
		}

		if !curVirtIfaces.Contains(iface) {
			utils.ExecCombinedOutputLogged(
				nil,
				"ip", "link", "del", iface,
			)
			interfaces.RemoveVirtIface(iface)
		}
	}

	namespaces, err := utils.GetNamespaces()
	if err != nil {
		return
	}

	for _, namespace := range namespaces {
		if len(namespace) != 14 || !strings.HasPrefix(namespace, "x") {
			continue
		}

		if !curNamespaces.Contains(namespace) {
			_, err = utils.ExecCombinedOutputLogged(
				nil,
				"ip", "netns", "del", namespace,
			)
			if err != nil {
				return
			}
		}
	}

	items, err := ioutil.ReadDir("/etc/netns")
	if err != nil {
		err = &errortypes.ReadError{
			errors.Wrap(err, "deploy: Failed to read run directory"),
		}
		return
	}

	for _, item := range items {
		namespace := item.Name()

		if !item.IsDir() || len(namespace) != 14 ||
			!strings.HasPrefix(namespace, "x") {

			continue
		}

		if !curNamespaces.Contains(namespace) {
			vcPth := filepath.Join("/etc/netns", namespace, "vpc.id")
			vcExists, e := utils.Exists(vcPth)
			if e != nil {
				err = e
				return
			}

			if vcExists {
				vcIdByt, e := ioutil.ReadFile(vcPth)
				if err != nil {
					err = &errortypes.ReadError{
						errors.Wrap(e, "ipsec: Failed to read vpc id"),
					}
					return
				}

				vcId, e := primitive.ObjectIDFromHex(
					strings.TrimSpace(string(vcIdByt)))
				if e != nil {
					err = &errortypes.ParseError{
						errors.Wrap(e, "ipsec: Failed to parse vpc id"),
					}
					return
				}

				go removeNamespace(vcId)
			}
		}
	}

	items, err = ioutil.ReadDir("/var/run")
	if err != nil {
		err = &errortypes.ReadError{
			errors.Wrap(err, "deploy: Failed to read run directory"),
		}
		return
	}

	for _, item := range items {
		name := item.Name()

		if item.IsDir() || len(name) != 27 ||
			!strings.HasPrefix(name, "dhclient-z") {

			continue
		}

		iface := name[9:23]

		if !curExternalIfaces.Contains(iface) {
			pth := filepath.Join("/var/run", item.Name())

			pidByt, e := ioutil.ReadFile(pth)
			if e != nil {
				err = &errortypes.ReadError{
					errors.Wrap(e, "ipsec: Failed to read dhclient pid"),
				}
				return
			}

			pid, e := strconv.Atoi(strings.TrimSpace(string(pidByt)))
			if e != nil {
				err = &errortypes.ParseError{
					errors.Wrap(e, "ipsec: Failed to parse dhclient pid"),
				}
				return
			}

			exists, _ := utils.Exists(fmt.Sprintf("/proc/%d/status", pid))
			if exists {
				utils.ExecCombinedOutput("", "kill", "-9", strconv.Itoa(pid))
			} else {
				os.Remove(pth)
			}
		}
	}

	return
}
