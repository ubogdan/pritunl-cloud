package qemu

import (
	"time"

	"github.com/pritunl/pritunl-cloud/cloudinit"
	"github.com/pritunl/pritunl-cloud/constants"
	"github.com/pritunl/pritunl-cloud/database"
	"github.com/pritunl/pritunl-cloud/instance"
	"github.com/pritunl/pritunl-cloud/paths"
	"github.com/pritunl/pritunl-cloud/qmp"
	"github.com/pritunl/pritunl-cloud/qms"
	"github.com/pritunl/pritunl-cloud/settings"
	"github.com/pritunl/pritunl-cloud/store"
	"github.com/pritunl/pritunl-cloud/systemd"
	"github.com/pritunl/pritunl-cloud/utils"
	"github.com/pritunl/pritunl-cloud/vm"
	"github.com/sirupsen/logrus"
)

func PowerOn(db *database.Database, inst *instance.Instance,
	virt *vm.VirtualMachine) (err error) {
	unitName := paths.GetUnitName(virt.Id)

	if constants.Interrupt {
		return
	}

	logrus.WithFields(logrus.Fields{
		"id": virt.Id.Hex(),
	}).Info("qemu: Starting virtual machine")

	err = utils.ExistsMkdir(settings.Hypervisor.RunPath, 0755)
	if err != nil {
		return
	}

	err = cloudinit.Write(db, inst, virt, false)
	if err != nil {
		return
	}

	err = writeOvmfVars(virt)
	if err != nil {
		return
	}

	err = writeService(virt)
	if err != nil {
		return
	}

	err = systemd.Start(unitName)
	if err != nil {
		return
	}

	err = Wait(db, virt)
	if err != nil {
		return
	}

	if virt.Vnc {
		err = qmp.VncPassword(virt.Id, inst.VncPassword)
		if err != nil {
			return
		}
	}

	err = NetworkConf(db, virt)
	if err != nil {
		return
	}

	store.RemVirt(virt.Id)
	store.RemDisks(virt.Id)

	return
}

func PowerOff(db *database.Database, virt *vm.VirtualMachine) (err error) {
	unitName := paths.GetUnitName(virt.Id)

	if constants.Interrupt {
		return
	}

	logrus.WithFields(logrus.Fields{
		"id": virt.Id.Hex(),
	}).Info("qemu: Stopping virtual machine")

	logged := false
	for i := 0; i < 10; i++ {
		err = qmp.Shutdown(virt.Id)
		if err == nil {
			break
		}

		if !logged {
			logged = true
			logrus.WithFields(logrus.Fields{
				"instance_id": virt.Id.Hex(),
				"error":       err,
			}).Warn("qemu: Failed to send shutdown to virtual machine")
		}

		time.Sleep(500 * time.Millisecond)
	}

	shutdown := false
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"id":    virt.Id.Hex(),
			"error": err,
		}).Error("qemu: Power off virtual machine error")
		err = nil
	} else {
		for i := 0; i < settings.Hypervisor.StopTimeout; i++ {
			vrt, e := GetVmInfo(virt.Id, false, true)
			if e != nil {
				err = e
				return
			}

			if vrt == nil || vrt.State == vm.Stopped ||
				vrt.State == vm.Failed {

				if vrt != nil {
					err = vrt.Commit(db)
					if err != nil {
						return
					}
				}

				shutdown = true
				break
			}

			time.Sleep(1 * time.Second)

			if (i+1)%15 == 0 {
				go func() {
					qmp.Shutdown(virt.Id)
					qms.Shutdown(virt.Id)
				}()
			}
		}
	}

	if !shutdown {
		logrus.WithFields(logrus.Fields{
			"id": virt.Id.Hex(),
		}).Warning("qemu: Force power off virtual machine")

		err = systemd.Stop(unitName)
		if err != nil {
			return
		}
	}

	err = NetworkConfClear(virt)
	if err != nil {
		return
	}

	time.Sleep(3 * time.Second)

	store.RemVirt(virt.Id)
	store.RemDisks(virt.Id)

	return
}

func ForcePowerOffErr(virt *vm.VirtualMachine, e error) (err error) {
	unitName := paths.GetUnitName(virt.Id)

	if constants.Interrupt {
		return
	}

	logrus.WithFields(logrus.Fields{
		"instance_id": virt.Id.Hex(),
		"error":       e,
	}).Error("qemu: Force power off virtual machine")

	go qmp.Shutdown(virt.Id)
	go qms.Shutdown(virt.Id)

	time.Sleep(15 * time.Second)

	err = systemd.Stop(unitName)
	if err != nil {
		return
	}

	err = NetworkConfClear(virt)
	if err != nil {
		return
	}

	time.Sleep(3 * time.Second)

	store.RemVirt(virt.Id)
	store.RemDisks(virt.Id)

	return
}

func ForcePowerOff(virt *vm.VirtualMachine) (err error) {
	unitName := paths.GetUnitName(virt.Id)

	if constants.Interrupt {
		return
	}

	logrus.WithFields(logrus.Fields{
		"instance_id": virt.Id.Hex(),
	}).Warning("qemu: Force power off virtual machine")

	go qmp.Shutdown(virt.Id)
	go qms.Shutdown(virt.Id)

	time.Sleep(10 * time.Second)

	err = systemd.Stop(unitName)
	if err != nil {
		return
	}

	err = NetworkConfClear(virt)
	if err != nil {
		return
	}

	time.Sleep(3 * time.Second)

	store.RemVirt(virt.Id)
	store.RemDisks(virt.Id)

	return
}
