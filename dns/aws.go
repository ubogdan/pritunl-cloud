package dns

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/route53"
	"github.com/dropbox/godropbox/errors"
	"github.com/pritunl/pritunl-cloud/database"
	"github.com/pritunl/pritunl-cloud/errortypes"
	"github.com/pritunl/pritunl-cloud/secret"
	"github.com/pritunl/pritunl-cloud/settings"
)

type Aws struct {
	sess        *session.Session
	sessRoute53 *route53.Route53
	cacheZoneId map[string]string
}

func (a *Aws) Connect(db *database.Database,
	secr *secret.Secret) (err error) {

	if secr.Type != secret.AWS {
		err = &errortypes.ApiError{
			errors.Wrap(err, "acme: Secret type not AWS"),
		}
		return
	}

	a.cacheZoneId = map[string]string{}

	a.sess, err = session.NewSession(&aws.Config{
		Region: aws.String(secr.Region),
		Credentials: credentials.NewStaticCredentials(
			secr.Key, secr.Value, ""),
	})
	if err != nil {
		err = &errortypes.ApiError{
			errors.Wrap(err, "acme: AWS session error"),
		}
		return
	}

	a.sessRoute53 = route53.New(a.sess)

	return
}

func (a *Aws) DnsZoneFind(domain string) (zoneId string, err error) {
	domain = extractDomain(domain)

	zoneId = a.cacheZoneId[domain]
	if zoneId != "" {
		return
	}

	input := &route53.ListHostedZonesInput{}

	result, err := a.sessRoute53.ListHostedZones(input)
	if err != nil {
		err = &errortypes.ApiError{
			errors.Wrap(err, "acme: AWS route53 zone lookup error"),
		}
		return
	}

	for _, zone := range result.HostedZones {
		if matchDomains(*zone.Name, domain) {
			zoneId = *zone.Id
			break
		}
	}

	if zoneId == "" {
		err = &errortypes.ApiError{
			errors.Wrap(err, "acme: AWS route53 zone not found"),
		}
		return
	}

	a.cacheZoneId[domain] = zoneId

	return
}

func (a *Aws) DnsTxtGet(db *database.Database, domain string) (
	vals []string, err error) {

	vals = []string{}

	zoneId, err := a.DnsZoneFind(domain)
	if err != nil {
		return
	}

	input := &route53.ListResourceRecordSetsInput{
		HostedZoneId:    aws.String(zoneId),
		StartRecordName: aws.String(domain),
		StartRecordType: aws.String("TXT"),
	}

	result, err := a.sessRoute53.ListResourceRecordSets(input)
	if err != nil {
		err = &errortypes.ApiError{
			errors.Wrap(err, "acme: AWS route53 record set error"),
		}
		return
	}

	for _, recordSet := range result.ResourceRecordSets {
		if recordSet.Type != nil && *recordSet.Type == "TXT" &&
			recordSet.Name != nil && matchDomains(*recordSet.Name, domain) {

			for _, record := range recordSet.ResourceRecords {
				if record.Value != nil {
					vals = append(vals, *record.Value)
				}
			}
		}
	}

	return
}

func (a *Aws) DnsTxtUpsert(db *database.Database,
	domain, val string) (err error) {

	zoneId, err := a.DnsZoneFind(domain)
	if err != nil {
		return
	}

	input := &route53.ChangeResourceRecordSetsInput{
		ChangeBatch: &route53.ChangeBatch{
			Changes: []*route53.Change{
				{
					Action: aws.String("UPSERT"),
					ResourceRecordSet: &route53.ResourceRecordSet{
						Name: aws.String(domain),
						Type: aws.String("TXT"),
						TTL:  aws.Int64(int64(settings.Acme.DnsAwsTtl)),
						ResourceRecords: []*route53.ResourceRecord{
							{
								Value: aws.String(val),
							},
						},
					},
				},
			},
			Comment: aws.String("Pritunl update TXT record"),
		},
		HostedZoneId: aws.String(zoneId),
	}

	_, err = a.sessRoute53.ChangeResourceRecordSets(input)
	if err != nil {
		err = &errortypes.ApiError{
			errors.Wrap(err, "acme: AWS route53 record set error"),
		}
		return
	}

	return
}

func (a *Aws) DnsTxtDelete(db *database.Database,
	domain, val string) (err error) {

	zoneId, err := a.DnsZoneFind(domain)
	if err != nil {
		return
	}

	input := &route53.ChangeResourceRecordSetsInput{
		ChangeBatch: &route53.ChangeBatch{
			Changes: []*route53.Change{
				{
					Action: aws.String("DELETE"),
					ResourceRecordSet: &route53.ResourceRecordSet{
						Name: aws.String(domain),
						Type: aws.String("TXT"),
						TTL:  aws.Int64(int64(settings.Acme.DnsAwsTtl)),
						ResourceRecords: []*route53.ResourceRecord{
							{
								Value: aws.String(val),
							},
						},
					},
				},
			},
			Comment: aws.String("Pritunl delete TXT record"),
		},
		HostedZoneId: aws.String(zoneId),
	}

	_, err = a.sessRoute53.ChangeResourceRecordSets(input)
	if err != nil {
		err = &errortypes.ApiError{
			errors.Wrap(err, "acme: AWS route53 record set error"),
		}
		return
	}

	return
}

func (a *Aws) DnsAGet(db *database.Database, domain string) (
	vals []string, err error) {

	vals = []string{}

	zoneId, err := a.DnsZoneFind(domain)
	if err != nil {
		return
	}

	input := &route53.ListResourceRecordSetsInput{
		HostedZoneId:    aws.String(zoneId),
		StartRecordName: aws.String(domain),
		StartRecordType: aws.String("A"),
	}

	result, err := a.sessRoute53.ListResourceRecordSets(input)
	if err != nil {
		err = &errortypes.ApiError{
			errors.Wrap(err, "acme: AWS route53 record set error"),
		}
		return
	}

	for _, recordSet := range result.ResourceRecordSets {
		if recordSet.Type != nil && *recordSet.Type == "A" &&
			recordSet.Name != nil && matchDomains(*recordSet.Name, domain) {

			for _, record := range recordSet.ResourceRecords {
				if record.Value != nil {
					vals = append(vals, *record.Value)
				}
			}
		}
	}

	return
}

func (a *Aws) DnsAUpsert(db *database.Database,
	domain, val string) (err error) {

	zoneId, err := a.DnsZoneFind(domain)
	if err != nil {
		return
	}

	input := &route53.ChangeResourceRecordSetsInput{
		ChangeBatch: &route53.ChangeBatch{
			Changes: []*route53.Change{
				{
					Action: aws.String("UPSERT"),
					ResourceRecordSet: &route53.ResourceRecordSet{
						Name: aws.String(domain),
						Type: aws.String("A"),
						TTL:  aws.Int64(int64(settings.Acme.DnsAwsTtl)),
						ResourceRecords: []*route53.ResourceRecord{
							{
								Value: aws.String(val),
							},
						},
					},
				},
			},
			Comment: aws.String("Pritunl update A record"),
		},
		HostedZoneId: aws.String(zoneId),
	}

	_, err = a.sessRoute53.ChangeResourceRecordSets(input)
	if err != nil {
		err = &errortypes.ApiError{
			errors.Wrap(err, "acme: AWS route53 record set error"),
		}
		return
	}

	return
}

func (a *Aws) DnsADelete(db *database.Database,
	domain, val string) (err error) {

	zoneId, err := a.DnsZoneFind(domain)
	if err != nil {
		return
	}

	input := &route53.ChangeResourceRecordSetsInput{
		ChangeBatch: &route53.ChangeBatch{
			Changes: []*route53.Change{
				{
					Action: aws.String("DELETE"),
					ResourceRecordSet: &route53.ResourceRecordSet{
						Name: aws.String(domain),
						Type: aws.String("A"),
						TTL:  aws.Int64(int64(settings.Acme.DnsAwsTtl)),
						ResourceRecords: []*route53.ResourceRecord{
							{
								Value: aws.String(val),
							},
						},
					},
				},
			},
			Comment: aws.String("Pritunl delete A record"),
		},
		HostedZoneId: aws.String(zoneId),
	}

	_, err = a.sessRoute53.ChangeResourceRecordSets(input)
	if err != nil {
		err = &errortypes.ApiError{
			errors.Wrap(err, "acme: AWS route53 record set error"),
		}
		return
	}

	return
}

func (a *Aws) DnsAAAAGet(db *database.Database, domain string) (
	vals []string, err error) {

	vals = []string{}

	zoneId, err := a.DnsZoneFind(domain)
	if err != nil {
		return
	}

	input := &route53.ListResourceRecordSetsInput{
		HostedZoneId:    aws.String(zoneId),
		StartRecordName: aws.String(domain),
		StartRecordType: aws.String("AAAA"),
	}

	result, err := a.sessRoute53.ListResourceRecordSets(input)
	if err != nil {
		err = &errortypes.ApiError{
			errors.Wrap(err, "acme: AWS route53 record set error"),
		}
		return
	}

	for _, recordSet := range result.ResourceRecordSets {
		if recordSet.Type != nil && *recordSet.Type == "AAAA" &&
			recordSet.Name != nil && matchDomains(*recordSet.Name, domain) {

			for _, record := range recordSet.ResourceRecords {
				if record.Value != nil {
					vals = append(vals, *record.Value)
				}
			}
		}
	}

	return
}

func (a *Aws) DnsAAAAUpsert(db *database.Database,
	domain, val string) (err error) {

	zoneId, err := a.DnsZoneFind(domain)
	if err != nil {
		return
	}

	input := &route53.ChangeResourceRecordSetsInput{
		ChangeBatch: &route53.ChangeBatch{
			Changes: []*route53.Change{
				{
					Action: aws.String("UPSERT"),
					ResourceRecordSet: &route53.ResourceRecordSet{
						Name: aws.String(domain),
						Type: aws.String("AAAA"),
						TTL:  aws.Int64(int64(settings.Acme.DnsAwsTtl)),
						ResourceRecords: []*route53.ResourceRecord{
							{
								Value: aws.String(val),
							},
						},
					},
				},
			},
			Comment: aws.String("Pritunl update AAAA record"),
		},
		HostedZoneId: aws.String(zoneId),
	}

	_, err = a.sessRoute53.ChangeResourceRecordSets(input)
	if err != nil {
		err = &errortypes.ApiError{
			errors.Wrap(err, "acme: AWS route53 record set error"),
		}
		return
	}

	return
}

func (a *Aws) DnsAAAADelete(db *database.Database,
	domain, val string) (err error) {

	zoneId, err := a.DnsZoneFind(domain)
	if err != nil {
		return
	}

	input := &route53.ChangeResourceRecordSetsInput{
		ChangeBatch: &route53.ChangeBatch{
			Changes: []*route53.Change{
				{
					Action: aws.String("DELETE"),
					ResourceRecordSet: &route53.ResourceRecordSet{
						Name: aws.String(domain),
						Type: aws.String("AAAA"),
						TTL:  aws.Int64(int64(settings.Acme.DnsAwsTtl)),
						ResourceRecords: []*route53.ResourceRecord{
							{
								Value: aws.String(val),
							},
						},
					},
				},
			},
			Comment: aws.String("Pritunl delete AAAA record"),
		},
		HostedZoneId: aws.String(zoneId),
	}

	_, err = a.sessRoute53.ChangeResourceRecordSets(input)
	if err != nil {
		err = &errortypes.ApiError{
			errors.Wrap(err, "acme: AWS route53 record set error"),
		}
		return
	}

	return
}
