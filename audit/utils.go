package audit

import (
	"context"
	"github.com/pritunl/mongo-go-driver/bson"
	"github.com/pritunl/mongo-go-driver/bson/primitive"
	"github.com/pritunl/mongo-go-driver/mongo/options"
	"github.com/pritunl/pritunl-cloud/agent"
	"github.com/pritunl/pritunl-cloud/database"
	"github.com/pritunl/pritunl-cloud/settings"
	"github.com/pritunl/pritunl-cloud/utils"
	"net/http"
	"time"
)

func Get(db *database.Database, adtId string) (
	adt *Audit, err error) {

	coll := db.Audits()
	adt = &Audit{}

	err = coll.FindOneId(adtId, adt)
	if err != nil {
		return
	}

	return
}

func GetAll(db *database.Database, userId primitive.ObjectID,
	page, pageCount int64) (audits []*Audit, count int64, err error) {

	coll := db.Audits()
	audits = []*Audit{}

	count, err = coll.Count(context.Background(), &bson.M{
		"u": userId,
	})
	if err != nil {
		err = database.ParseError(err)
		return
	}

	page = utils.Min64(page, count/pageCount)
	skip := utils.Min64(page*pageCount, count)

	cursor, err := coll.Find(context.Background(), &bson.M{
		"u": userId,
	}, &options.FindOptions{
		Sort: &bson.D{
			{"$natural", -1},
		},
		Skip:  &skip,
		Limit: &pageCount,
	})
	if err != nil {
		err = database.ParseError(err)
		return
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		adt := &Audit{}
		err = cursor.Decode(adt)
		if err != nil {
			err = database.ParseError(err)
			return
		}

		audits = append(audits, adt)
	}

	err = cursor.Err()
	if err != nil {
		err = database.ParseError(err)
		return
	}

	return
}

func New(db *database.Database, r *http.Request,
	userId primitive.ObjectID, typ string, fields Fields) (
	err error) {

	if settings.System.Demo {
		return
	}

	agnt, err := agent.Parse(db, r)
	if err != nil {
		return
	}

	adt := &Audit{
		User:      userId,
		Timestamp: time.Now(),
		Type:      typ,
		Fields:    fields,
		Agent:     agnt,
	}

	err = adt.Insert(db)
	if err != nil {
		return
	}

	return
}
