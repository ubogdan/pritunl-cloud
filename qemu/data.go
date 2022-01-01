package qemu

import (
	"time"

	"github.com/pritunl/pritunl-cloud/database"
	"github.com/pritunl/pritunl-cloud/disk"
	"github.com/pritunl/pritunl-cloud/hugepages"
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

func initHugepage(virt *vm.VirtualMachine) (err error) {
	if !virt.Hugepages {
		return
	}

	err = hugepages.UpdateHugepagesSize()
	if err != nil {
		return
	}

	return
}

func writeOvmfVars(virt *vm.VirtualMachine) (err error) {
	if !virt.Uefi {
		return
	}

	ovmfVarsPath := paths.GetOvmfVarsPath(virt.Id)
	ovmfVarsPathSource, err := paths.FindOvmfVarsPath(virt.SecureBoot)
	if err != nil {
		return
	}

	err = utils.ExistsMkdir(paths.GetOvmfDir(), 0755)
	if err != nil {
		return
	}

	err = utils.Exec("", "cp", ovmfVarsPathSource, ovmfVarsPath)
	if err != nil {
		return
	}

	return
}

func writeService(virt *vm.VirtualMachine) (err error) {
	unitPath := paths.GetUnitPath(virt.Id)

	qm, err := NewQemu(virt)
	if err != nil {
		return
	}

	output, err := qm.Marshal()
	if err != nil {
		return
	}

	err = utils.CreateWrite(unitPath, output, 0644)
	if err != nil {
		return
	}

	err = systemd.Reload()
	if err != nil {
		return
	}

	return
}

func Destroy(db *database.Database, virt *vm.VirtualMachine) (err error) {
	vmPath := paths.GetVmPath(virt.Id)
	unitName := paths.GetUnitName(virt.Id)
	unitPath := paths.GetUnitPath(virt.Id)
	sockPath := paths.GetSockPath(virt.Id)
	// TODO Backward compatibility
	sockPathOld := paths.GetSockPath(virt.Id)
	guestPath := paths.GetGuestPath(virt.Id)
	// TODO Backward compatibility
	guestPathOld := paths.GetGuestPathOld(virt.Id)
	pidPath := paths.GetPidPath(virt.Id)
	// TODO Backward compatibility
	pidPathOld := paths.GetPidPathOld(virt.Id)
	ovmfVarsPath := paths.GetOvmfVarsPath(virt.Id)

	logrus.WithFields(logrus.Fields{
		"id": virt.Id.Hex(),
	}).Info("qemu: Destroying virtual machine")

	exists, err := utils.Exists(unitPath)
	if err != nil {
		return
	}

	if exists {
		vrt, e := GetVmInfo(db, virt.Id, false, true)
		if e != nil {
			err = e
			return
		}

		if vrt != nil && vrt.State == vm.Running {
			shutdown := false

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
					}).Warn(
						"qemu: Failed to send shutdown to virtual machine")
				}

				time.Sleep(500 * time.Millisecond)
			}

			if err != nil {
				logrus.WithFields(logrus.Fields{
					"id":    virt.Id.Hex(),
					"error": err,
				}).Error("qemu: Power off virtual machine error")
				err = nil
			} else {
				for i := 0; i < settings.Hypervisor.StopTimeout; i++ {
					vrt, err = GetVmInfo(db, virt.Id, false, true)
					if err != nil {
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
			}
		}

		err = systemd.Stop(unitName)
		if err != nil {
			return
		}
	}

	time.Sleep(3 * time.Second)

	err = NetworkConfClear(db, virt)
	if err != nil {
		return
	}

	for i, dsk := range virt.Disks {
		ds, e := disk.Get(db, dsk.GetId())
		if e != nil {
			err = e
			if _, ok := err.(*database.NotFoundError); ok {
				err = nil
				continue
			}
			return
		}

		if i == 0 && ds.SourceInstance == virt.Id {
			err = disk.Delete(db, ds.Id)
			if err != nil {
				if _, ok := err.(*database.NotFoundError); ok {
					err = nil
					continue
				}
				return
			}
		} else {
			err = disk.Detach(db, dsk.GetId())
			if err != nil {
				return
			}
		}
	}

	err = utils.RemoveAll(vmPath)
	if err != nil {
		return
	}

	err = utils.RemoveAll(unitPath)
	if err != nil {
		return
	}

	err = utils.RemoveAll(sockPath)
	if err != nil {
		return
	}

	// TODO Backward compatibility
	err = utils.RemoveAll(sockPathOld)
	if err != nil {
		return
	}

	err = utils.RemoveAll(guestPath)
	if err != nil {
		return
	}

	// TODO Backward compatibility
	err = utils.RemoveAll(guestPathOld)
	if err != nil {
		return
	}

	err = utils.RemoveAll(pidPath)
	if err != nil {
		return
	}

	// TODO Backward compatibility
	err = utils.RemoveAll(pidPathOld)
	if err != nil {
		return
	}

	err = utils.RemoveAll(paths.GetInitPath(virt.Id))
	if err != nil {
		return
	}

	err = utils.RemoveAll(paths.GetLeasePath(virt.Id))
	if err != nil {
		return
	}

	err = utils.RemoveAll(unitPath)
	if err != nil {
		return
	}

	err = utils.RemoveAll(ovmfVarsPath)
	if err != nil {
		return
	}

	store.RemVirt(virt.Id)
	store.RemDisks(virt.Id)
	store.RemAddress(virt.Id)
	store.RemRoutes(virt.Id)

	return
}

func Cleanup(db *database.Database, virt *vm.VirtualMachine) {
	logrus.WithFields(logrus.Fields{
		"id": virt.Id.Hex(),
	}).Info("qemu: Stopped virtual machine")

	err := NetworkConfClear(db, virt)
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"id":    virt.Id.Hex(),
			"error": err,
		}).Error("qemu: Failed to cleanup virtual machine network")
	}

	time.Sleep(3 * time.Second)

	store.RemVirt(virt.Id)
	store.RemDisks(virt.Id)

	return
}
