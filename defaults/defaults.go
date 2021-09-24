package defaults

import (
	"fmt"
	"math/rand"

	"github.com/dropbox/godropbox/errors"
	"github.com/pritunl/mongo-go-driver/bson"
	"github.com/pritunl/mongo-go-driver/bson/primitive"
	"github.com/pritunl/pritunl-cloud/authority"
	"github.com/pritunl/pritunl-cloud/database"
	"github.com/pritunl/pritunl-cloud/datacenter"
	"github.com/pritunl/pritunl-cloud/errortypes"
	"github.com/pritunl/pritunl-cloud/event"
	"github.com/pritunl/pritunl-cloud/firewall"
	"github.com/pritunl/pritunl-cloud/organization"
	"github.com/pritunl/pritunl-cloud/storage"
	"github.com/pritunl/pritunl-cloud/vpc"
	"github.com/pritunl/pritunl-cloud/zone"
)

func initStorage(db *database.Database) (err error) {
	stores, err := storage.GetAll(db)
	if err != nil {
		return
	}

	if len(stores) == 0 {
		store := &storage.Storage{
			Name:     "pritunl-images",
			Type:     storage.Public,
			Endpoint: "images.pritunl.com",
			Bucket:   "stable",
			Insecure: false,
		}

		errData, e := store.Validate(db)
		if e != nil {
			err = e
			return
		}

		if errData != nil {
			err = &errortypes.ApiError{
				errors.Newf(
					"defaults: Storage validate error %s",
					errData.Message,
				),
			}
			return
		}

		err = store.Insert(db)
		if err != nil {
			return
		}

		event.PublishDispatch(db, "storage.change")
	}

	return
}

func initOrganization(db *database.Database) (
	defaultOrg primitive.ObjectID, err error) {

	orgs, err := organization.GetAll(db)
	if err != nil {
		return
	}

	if len(orgs) == 0 {
		org := &organization.Organization{
			Name:  "org",
			Roles: []string{"org"},
		}

		errData, e := org.Validate(db)
		if e != nil {
			err = e
			return
		}

		if errData != nil {
			err = &errortypes.ApiError{
				errors.Newf(
					"defaults: Organization validate error %s",
					errData.Message,
				),
			}
			return
		}

		err = org.Insert(db)
		if err != nil {
			return
		}

		defaultOrg = org.Id

		event.PublishDispatch(db, "organization.change")
	} else {
		for _, org := range orgs {
			if defaultOrg.IsZero() || org.Name == "org" {
				defaultOrg = org.Id
			}
		}
	}

	return
}

func initDatacenter(db *database.Database) (err error) {
	dcs, err := datacenter.GetAll(db)
	if err != nil {
		return
	}

	if len(dcs) == 0 {
		stores, e := storage.GetAll(db)
		if e != nil {
			err = e
			return
		}

		publicStorages := []primitive.ObjectID{}
		for _, store := range stores {
			if store.Endpoint == "images.pritunl.com" &&
				store.Bucket == "stable" {

				publicStorages = append(publicStorages, store.Id)
				break
			}
		}

		dc := &datacenter.Datacenter{
			Name:           "us-west-1",
			PublicStorages: publicStorages,
		}

		errData, e := dc.Validate(db)
		if e != nil {
			err = e
			return
		}

		if errData != nil {
			err = &errortypes.ApiError{
				errors.Newf(
					"defaults: Datacenter validate error %s",
					errData.Message,
				),
			}
			return
		}

		err = dc.Insert(db)
		if err != nil {
			return
		}

		event.PublishDispatch(db, "datacenter.change")
	}

	return
}

func initZone(db *database.Database) (err error) {
	zones, err := zone.GetAll(db)
	if err != nil {
		return
	}

	if len(zones) == 0 {
		dcs, e := datacenter.GetAll(db)
		if e != nil {
			err = e
			return
		}

		zne := &zone.Zone{
			Name:        "us-west-1a",
			NetworkMode: zone.Default,
		}

		for _, dc := range dcs {
			if zne.Datacenter.IsZero() || dc.Name == "us-west-1" {
				zne.Datacenter = dc.Id
			}
		}

		errData, e := zne.Validate(db)
		if e != nil {
			err = e
			return
		}

		if errData != nil {
			err = &errortypes.ApiError{
				errors.Newf(
					"defaults: Zone validate error %s",
					errData.Message,
				),
			}
			return
		}

		err = zne.Insert(db)
		if err != nil {
			return
		}

		event.PublishDispatch(db, "zone.change")
	}

	return
}

func initVpc(db *database.Database, defaultOrg primitive.ObjectID) (
	err error) {

	if defaultOrg.IsZero() {
		return
	}

	vcs, err := vpc.GetAll(db, &bson.M{})
	if err != nil {
		return
	}

	if len(vcs) == 0 {
		netNum := 100 + rand.Intn(100)
		vc := &vpc.Vpc{
			Name:         "vpc",
			Organization: defaultOrg,
			Network:      fmt.Sprintf("10.%d.0.0/16", netNum),
			Subnets: []*vpc.Subnet{
				&vpc.Subnet{
					Name:    "primary",
					Network: fmt.Sprintf("10.%d.1.0/24", netNum),
				},
			},
		}

		errData, e := vc.Validate(db)
		if e != nil {
			err = e
			return
		}

		if errData != nil {
			err = &errortypes.ApiError{
				errors.Newf(
					"defaults: VPC validate error %s",
					errData.Message,
				),
			}
			return
		}

		err = vc.Insert(db)
		if err != nil {
			return
		}

		event.PublishDispatch(db, "vpc.change")
	}

	return
}

func initFirewall(db *database.Database, defaultOrg primitive.ObjectID) (
	err error) {

	if defaultOrg.IsZero() {
		return
	}

	fires, err := firewall.GetAll(db, &bson.M{})
	if err != nil {
		return
	}

	if len(fires) == 0 {
		fire := &firewall.Firewall{
			Name:         "instance",
			Organization: defaultOrg,
			NetworkRoles: []string{
				"instance",
			},
			Ingress: []*firewall.Rule{
				&firewall.Rule{
					SourceIps: []string{
						"0.0.0.0/0",
						"::/0",
					},
					Protocol: "tcp",
					Port:     "22",
				},
			},
		}

		errData, e := fire.Validate(db)
		if e != nil {
			err = e
			return
		}

		if errData != nil {
			err = &errortypes.ApiError{
				errors.Newf(
					"defaults: Firewall validate error %s",
					errData.Message,
				),
			}
			return
		}

		err = fire.Insert(db)
		if err != nil {
			return
		}

		event.PublishDispatch(db, "firewall.change")
	}

	return
}

func initAuthority(db *database.Database, defaultOrg primitive.ObjectID) (
	err error) {

	if defaultOrg.IsZero() {
		return
	}

	authrs, err := authority.GetAll(db, &bson.M{})
	if err != nil {
		return
	}

	if len(authrs) == 0 {
		authr := &authority.Authority{
			Name:         "instance",
			Type:         authority.SshKey,
			Organization: defaultOrg,
			NetworkRoles: []string{
				"instance",
			},
		}

		errData, e := authr.Validate(db)
		if e != nil {
			err = e
			return
		}

		if errData != nil {
			err = &errortypes.ApiError{
				errors.Newf(
					"defaults: Authority validate error %s",
					errData.Message,
				),
			}
			return
		}

		err = authr.Insert(db)
		if err != nil {
			return
		}

		event.PublishDispatch(db, "authority.change")
	}

	return
}

func Defaults() (err error) {
	db := database.GetDatabase()
	defer db.Close()

	err = initStorage(db)
	if err != nil {
		return
	}

	defaultOrg, err := initOrganization(db)
	if err != nil {
		return
	}

	err = initDatacenter(db)
	if err != nil {
		return
	}

	err = initZone(db)
	if err != nil {
		return
	}

	err = initVpc(db, defaultOrg)
	if err != nil {
		return
	}

	err = initFirewall(db, defaultOrg)
	if err != nil {
		return
	}

	err = initAuthority(db, defaultOrg)
	if err != nil {
		return
	}

	return
}
