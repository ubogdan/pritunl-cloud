package ahandlers

import (
	"github.com/dropbox/godropbox/container/set"
	"github.com/gin-gonic/gin"
	"github.com/pritunl/mongo-go-driver/bson/primitive"
	"github.com/pritunl/pritunl-cloud/database"
	"github.com/pritunl/pritunl-cloud/datacenter"
	"github.com/pritunl/pritunl-cloud/demo"
	"github.com/pritunl/pritunl-cloud/event"
	"github.com/pritunl/pritunl-cloud/utils"
)

type datacenterData struct {
	Id                  primitive.ObjectID   `json:"id"`
	Name                string               `json:"name"`
	MatchOrganizations  bool                 `json:"match_organizations"`
	Organizations       []primitive.ObjectID `json:"organizations"`
	PublicStorages      []primitive.ObjectID `json:"public_storages"`
	PrivateStorage      primitive.ObjectID   `json:"private_storage"`
	PrivateStorageClass string               `json:"private_storage_class"`
	BackupStorage       primitive.ObjectID   `json:"backup_storage"`
	BackupStorageClass  string               `json:"backup_storage_class"`
}

func datacenterPut(c *gin.Context) {
	if demo.Blocked(c) {
		return
	}

	db := c.MustGet("db").(*database.Database)
	data := &datacenterData{}

	dcId, ok := utils.ParseObjectId(c.Param("dc_id"))
	if !ok {
		utils.AbortWithStatus(c, 400)
		return
	}

	err := c.Bind(data)
	if err != nil {
		utils.AbortWithError(c, 500, err)
		return
	}

	dc, err := datacenter.Get(db, dcId)
	if err != nil {
		utils.AbortWithError(c, 500, err)
		return
	}

	dc.Name = data.Name
	dc.MatchOrganizations = data.MatchOrganizations
	dc.Organizations = data.Organizations
	dc.PublicStorages = data.PublicStorages
	dc.PrivateStorage = data.PrivateStorage
	dc.PrivateStorageClass = data.PrivateStorageClass
	dc.BackupStorage = data.BackupStorage
	dc.BackupStorageClass = data.BackupStorageClass

	fields := set.NewSet(
		"name",
		"match_organizations",
		"organizations",
		"public_storages",
		"private_storage",
		"private_storage_class",
		"backup_storage",
		"backup_storage_class",
	)

	errData, err := dc.Validate(db)
	if err != nil {
		utils.AbortWithError(c, 500, err)
		return
	}

	if errData != nil {
		c.JSON(400, errData)
		return
	}

	err = dc.CommitFields(db, fields)
	if err != nil {
		utils.AbortWithError(c, 500, err)
		return
	}

	event.PublishDispatch(db, "datacenter.change")

	c.JSON(200, dc)
}

func datacenterPost(c *gin.Context) {
	if demo.Blocked(c) {
		return
	}

	db := c.MustGet("db").(*database.Database)
	data := &datacenterData{
		Name: "New Datacenter",
	}

	err := c.Bind(data)
	if err != nil {
		utils.AbortWithError(c, 500, err)
		return
	}

	dc := &datacenter.Datacenter{
		Name:                data.Name,
		MatchOrganizations:  data.MatchOrganizations,
		Organizations:       data.Organizations,
		PublicStorages:      data.PublicStorages,
		PrivateStorage:      data.PrivateStorage,
		PrivateStorageClass: data.PrivateStorageClass,
		BackupStorage:       data.BackupStorage,
		BackupStorageClass:  data.BackupStorageClass,
	}

	errData, err := dc.Validate(db)
	if err != nil {
		utils.AbortWithError(c, 500, err)
		return
	}

	if errData != nil {
		c.JSON(400, errData)
		return
	}

	err = dc.Insert(db)
	if err != nil {
		utils.AbortWithError(c, 500, err)
		return
	}

	event.PublishDispatch(db, "datacenter.change")

	c.JSON(200, dc)
}

func datacenterDelete(c *gin.Context) {
	if demo.Blocked(c) {
		return
	}

	db := c.MustGet("db").(*database.Database)

	dcId, ok := utils.ParseObjectId(c.Param("dc_id"))
	if !ok {
		utils.AbortWithStatus(c, 400)
		return
	}

	err := datacenter.Remove(db, dcId)
	if err != nil {
		utils.AbortWithError(c, 500, err)
		return
	}

	event.PublishDispatch(db, "datacenter.change")

	c.JSON(200, nil)
}

func datacenterGet(c *gin.Context) {
	db := c.MustGet("db").(*database.Database)

	dcId, ok := utils.ParseObjectId(c.Param("dc_id"))
	if !ok {
		utils.AbortWithStatus(c, 400)
		return
	}

	dc, err := datacenter.Get(db, dcId)
	if err != nil {
		utils.AbortWithError(c, 500, err)
		return
	}

	c.JSON(200, dc)
}

func datacentersGet(c *gin.Context) {
	db := c.MustGet("db").(*database.Database)

	dcs, err := datacenter.GetAll(db)
	if err != nil {
		utils.AbortWithError(c, 500, err)
		return
	}

	c.JSON(200, dcs)
}
