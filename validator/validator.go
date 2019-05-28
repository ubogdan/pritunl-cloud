package validator

import (
	"net/http"
	"time"

	"github.com/dropbox/godropbox/container/set"
	"github.com/pritunl/mongo-go-driver/bson/primitive"
	"github.com/pritunl/pritunl-cloud/audit"
	"github.com/pritunl/pritunl-cloud/database"
	"github.com/pritunl/pritunl-cloud/errortypes"
	"github.com/pritunl/pritunl-cloud/event"
	"github.com/pritunl/pritunl-cloud/policy"
	"github.com/pritunl/pritunl-cloud/user"
)

func ValidateAdmin(db *database.Database, usr *user.User,
	isApi bool, r *http.Request) (deviceAuth bool,
	secProvider primitive.ObjectID, errAudit audit.Fields,
	errData *errortypes.ErrorData, err error) {

	if !usr.ActiveUntil.IsZero() && usr.ActiveUntil.Before(time.Now()) {
		usr.ActiveUntil = time.Time{}
		usr.Disabled = true
		err = usr.CommitFields(db, set.NewSet("active_until", "disabled"))
		if err != nil {
			return
		}

		event.PublishDispatch(db, "user.change")

		errAudit = audit.Fields{
			"error":   "user_disabled",
			"message": "User is disabled from expired active time",
		}
		errData = &errortypes.ErrorData{
			Error:   "unauthorized",
			Message: "Not authorized",
		}
		return
	}

	if usr.Disabled {
		errAudit = audit.Fields{
			"error":   "user_disabled",
			"message": "User is disabled",
		}
		errData = &errortypes.ErrorData{
			Error:   "unauthorized",
			Message: "Not authorized",
		}
		return
	}

	if usr.Administrator != "super" {
		errAudit = audit.Fields{
			"error":   "user_not_super",
			"message": "User is not super user",
		}
		errData = &errortypes.ErrorData{
			Error:   "unauthorized",
			Message: "Not authorized",
		}
		return
	}

	if !isApi {
		policies, e := policy.GetRoles(db, usr.Roles)
		if e != nil {
			err = e
			return
		}

		for _, polcy := range policies {
			errData, err = polcy.ValidateUser(db, usr, r)
			if err != nil || errData != nil {
				return
			}
		}

		for _, polcy := range policies {
			if polcy.AdminDeviceSecondary {
				deviceAuth = true
			}

			if !polcy.AdminSecondary.IsZero() && secProvider.IsZero() {
				secProvider = polcy.AdminSecondary
			}
		}
	}

	return
}

func ValidateUser(db *database.Database, usr *user.User,
	isApi bool, r *http.Request) (deviceAuth bool,
	secProvider primitive.ObjectID, errAudit audit.Fields,
	errData *errortypes.ErrorData, err error) {

	if !usr.ActiveUntil.IsZero() && usr.ActiveUntil.Before(time.Now()) {
		usr.ActiveUntil = time.Time{}
		usr.Disabled = true
		err = usr.CommitFields(db, set.NewSet("active_until", "disabled"))
		if err != nil {
			return
		}

		event.PublishDispatch(db, "user.change")

		errAudit = audit.Fields{
			"error":   "user_disabled",
			"message": "User is disabled from expired active time",
		}
		errData = &errortypes.ErrorData{
			Error:   "unauthorized",
			Message: "Not authorized",
		}
		return
	}

	if usr.Disabled {
		errAudit = audit.Fields{
			"error":   "user_disabled",
			"message": "User is disabled",
		}
		errData = &errortypes.ErrorData{
			Error:   "unauthorized",
			Message: "Not authorized",
		}
		return
	}

	if !isApi {
		policies, e := policy.GetRoles(db, usr.Roles)
		if e != nil {
			err = e
			return
		}

		for _, polcy := range policies {
			errData, err = polcy.ValidateUser(db, usr, r)
			if err != nil || errData != nil {
				return
			}
		}

		for _, polcy := range policies {
			if polcy.UserDeviceSecondary {
				deviceAuth = true
			}

			if !polcy.UserSecondary.IsZero() && secProvider.IsZero() {
				secProvider = polcy.UserSecondary
			}
		}
	}

	return
}
