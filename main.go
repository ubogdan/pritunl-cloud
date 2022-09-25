package main

import (
	"flag"
	"fmt"
	"time"

	"github.com/pritunl/pritunl-cloud/cmd"
	"github.com/pritunl/pritunl-cloud/constants"
	"github.com/pritunl/pritunl-cloud/logger"
	"github.com/pritunl/pritunl-cloud/requires"
)

const help = `
Usage: pritunl-cloud COMMAND

Commands:
  version           Show version
  mongo             Set MongoDB URI
  set               Set a setting
  unset             Unset a setting
  start             Start node
  clear-logs        Clear logs
  default-password  Get default administrator password
  reset-password    Reset administrator password
  disable-policies  Disable all policies
  mtu-check         Check and show instance MTUs
  backup            Backup local data
`

func Init() {
	logger.Init()
	requires.Init(nil)
}

func InitLimited() {
	logger.Init()
	requires.Init([]string{"ahandlers", "uhandlers"})
}

func main() {
	defer time.Sleep(500 * time.Millisecond)

	flag.Usage = func() {
		fmt.Printf(help)
	}

	flag.Parse()

	switch flag.Arg(0) {
	case "start":
		for _, arg := range flag.Args() {
			if arg == "--debug" {
				constants.Production = false
			} else if arg == "--debug-web" {
				constants.DebugWeb = true
			}
		}

		Init()
		err := cmd.Node(false)
		if err != nil {
			panic(err)
		}
		return
	case "version":
		fmt.Printf("pritunl-cloud v%s\n", constants.Version)
		return
	case "mongo":
		logger.Init()
		err := cmd.Mongo()
		if err != nil {
			panic(err)
		}
		return
	case "reset-id":
		logger.Init()
		err := cmd.ResetId()
		if err != nil {
			panic(err)
		}
		return
	case "default-password":
		InitLimited()
		err := cmd.DefaultPassword()
		if err != nil {
			panic(err)
		}
		return
	case "reset-password":
		InitLimited()
		err := cmd.ResetPassword()
		if err != nil {
			panic(err)
		}
		return
	case "disable-policies":
		InitLimited()
		err := cmd.DisablePolicies()
		if err != nil {
			panic(err)
		}
		return
	case "mtu-check":
		InitLimited()
		err := cmd.MtuCheck()
		if err != nil {
			panic(err)
		}
		return
	case "set":
		InitLimited()
		err := cmd.SettingsSet()
		if err != nil {
			panic(err)
		}
		return
	case "unset":
		InitLimited()
		err := cmd.SettingsUnset()
		if err != nil {
			panic(err)
		}
		return
	case "clear-logs":
		InitLimited()
		err := cmd.ClearLogs()
		if err != nil {
			panic(err)
		}
		return
	case "backup":
		InitLimited()
		err := cmd.Backup()
		if err != nil {
			panic(err)
		}
		return
	case "dhcp4-server":
		err := cmd.Dhcp4Server()
		if err != nil {
			panic(err)
		}
		return
	case "dhcp6-server":
		err := cmd.Dhcp6Server()
		if err != nil {
			panic(err)
		}
		return
	case "ndp-server":
		err := cmd.NdpServer()
		if err != nil {
			panic(err)
		}
		return
	}

	fmt.Printf(help)
}
