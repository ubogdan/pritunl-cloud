package alert

import (
	"github.com/pritunl/pritunl-cloud/database"
	"github.com/pritunl/pritunl-cloud/errortypes"
)

type Resource struct {
	Resource string `json:"resource" bson:"resource"`
	Level    int    `json:"level" bson:"level"`
	Value    int    `json:"value" bson:"value"`
}

func (s *Resource) Validate(db *database.Database) (
	errData *errortypes.ErrorData, err error) {

	switch s.Resource {
	default:
		errData = &errortypes.ErrorData{
			Error:   "alert_resource_name_invalid",
			Message: "Alert resource name is invalid",
		}
		return
	}

	switch s.Level {
	case Low, Medium, High:
		break
	default:
		errData = &errortypes.ErrorData{
			Error:   "alert_resource_level_invalid",
			Message: "Alert resource level is invalid",
		}
		return
	}

	return
}
