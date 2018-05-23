package uhandlers

import (
	"github.com/gin-gonic/gin"
	"github.com/pritunl/pritunl-cloud/authorizer"
	"github.com/pritunl/pritunl-cloud/csrf"
	"github.com/pritunl/pritunl-cloud/database"
	"github.com/pritunl/pritunl-cloud/demo"
	"github.com/pritunl/pritunl-cloud/utils"
)

type csrfData struct {
	Token         string `json:"token"`
	Theme         string `json:"theme"`
	OracleLicense bool   `json:"oracle_license"`
}

func csrfGet(c *gin.Context) {
	db := c.MustGet("db").(*database.Database)
	authr := c.MustGet("authorizer").(*authorizer.Authorizer)

	usr, err := authr.GetUser(db)
	if err != nil {
		utils.AbortWithError(c, 500, err)
		return
	}

	token, err := csrf.NewToken(db, authr.SessionId())
	if err != nil {
		utils.AbortWithError(c, 500, err)
		return
	}

	oracleLicense := usr.OracleLicense
	if demo.IsDemo() {
		oracleLicense = true
	}

	data := &csrfData{
		Token:         token,
		Theme:         usr.Theme,
		OracleLicense: oracleLicense,
	}
	c.JSON(200, data)
}
