package device

import (
	"crypto/ecdsa"
	"crypto/x509"
	"time"

	"github.com/dropbox/godropbox/container/set"
	"github.com/dropbox/godropbox/errors"
	"github.com/pritunl/mongo-go-driver/bson/primitive"
	"github.com/pritunl/pritunl-cloud/database"
	"github.com/pritunl/pritunl-cloud/errortypes"
	"github.com/pritunl/pritunl-cloud/u2flib"
	"github.com/pritunl/pritunl-cloud/utils"
)

type Device struct {
	Id           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	User         primitive.ObjectID `bson:"user" json:"user"`
	Name         string             `bson:"name" json:"name"`
	Type         string             `bson:"type" json:"type"`
	Mode         string             `bson:"mode" json:"mode"`
	Timestamp    time.Time          `bson:"timestamp" json:"timestamp"`
	Disabled     bool               `bson:"disabled" json:"disabled"`
	ActiveUntil  time.Time          `bson:"activeactive_until_until" json:"active_until"`
	LastActive   time.Time          `bson:"last_active" json:"last_active"`
	Number       string             `bson:"number" json:"number"`
	U2fRaw       []byte             `bson:"u2f_raw" json:"-"`
	U2fCounter   uint32             `bson:"u2f_counter" json:"-"`
	U2fKeyHandle []byte             `bson:"u2f_key_handle" json:"-"`
	U2fPublicKey []byte             `bson:"u2f_public_key" json:"-"`
}

func (d *Device) Validate(db *database.Database) (
	errData *errortypes.ErrorData, err error) {

	d.Name = utils.FilterStr(d.Name, 32)

	if len(d.Name) == 0 {
		errData = &errortypes.ErrorData{
			Error:   "device_name_missing",
			Message: "Device name is required",
		}
		return
	}

	if len(d.Name) > 22 {
		errData = &errortypes.ErrorData{
			Error:   "device_name_invalid",
			Message: "Device name is too long",
		}
		return
	}

	switch d.Mode {
	case Secondary:
		if d.Type != U2f {
			errData = &errortypes.ErrorData{
				Error:   "device_type_invalid",
				Message: "Device type is invalid",
			}
			return
		}
		break
	case Phone:
		if d.Type != Call && d.Type != Message {
			errData = &errortypes.ErrorData{
				Error:   "device_type_invalid",
				Message: "Device type is invalid",
			}
			return
		}

		if len(d.Number) == 10 {
			d.Number = "+1" + d.Number
		}

		if len(d.Number) < 10 {
			errData = &errortypes.ErrorData{
				Error:   "device_number_invalid",
				Message: "Device phone number invalid",
			}
			return
		}

		break
	default:
		errData = &errortypes.ErrorData{
			Error:   "device_mode_invalid",
			Message: "Device mode is invalid",
		}
		return
	}

	return
}

func (d *Device) MarshalRegistration(reg *u2flib.Registration) (err error) {
	pubPkix, err := x509.MarshalPKIXPublicKey(&reg.PubKey)
	if err != nil {
		err = &errortypes.ParseError{
			errors.Wrap(err, "device: Failed to marshal device public key"),
		}
		return
	}

	d.U2fRaw = reg.Raw
	d.U2fKeyHandle = reg.KeyHandle
	d.U2fPublicKey = pubPkix

	return
}

func (d *Device) UnmarshalRegistration() (
	reg u2flib.Registration, err error) {

	pubKeyItf, err := x509.ParsePKIXPublicKey(d.U2fPublicKey)
	if err != nil {
		err = &errortypes.ParseError{
			errors.Wrap(err, "device: Failed to parse device public key"),
		}
		return
	}

	pubKey, ok := pubKeyItf.(*ecdsa.PublicKey)
	if !ok {
		err = &errortypes.ParseError{
			errors.Wrap(err, "device: Device public key invalid type"),
		}
		return
	}

	reg = u2flib.Registration{
		KeyHandle: d.U2fKeyHandle,
		PubKey:    *pubKey,
	}

	return
}

func (d *Device) Commit(db *database.Database) (err error) {
	coll := db.Devices()

	err = coll.Commit(d.Id, d)
	if err != nil {
		return
	}

	return
}

func (d *Device) CommitFields(db *database.Database, fields set.Set) (
	err error) {

	coll := db.Devices()

	err = coll.CommitFields(d.Id, d, fields)
	if err != nil {
		return
	}

	return
}

func (d *Device) Insert(db *database.Database) (err error) {
	coll := db.Devices()

	_, err = coll.InsertOne(db, d)
	if err != nil {
		err = database.ParseError(err)
		return
	}

	return
}
