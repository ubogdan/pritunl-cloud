package router

import (
	"crypto/tls"
	"crypto/x509"
	"strings"

	"github.com/sirupsen/logrus"
	"github.com/dropbox/godropbox/container/set"
	"github.com/dropbox/godropbox/errors"
	"github.com/pritunl/pritunl-cloud/balancer"
	"github.com/pritunl/pritunl-cloud/certificate"
	"github.com/pritunl/pritunl-cloud/database"
	"github.com/pritunl/pritunl-cloud/errortypes"
	"github.com/pritunl/pritunl-cloud/node"
)

type Certificates struct {
	selfCert  *tls.Certificate
	domainMap map[string]*tls.Certificate
}

func (c *Certificates) Init() (err error) {
	if c.domainMap == nil {
		c.domainMap = map[string]*tls.Certificate{}
	}

	if c.selfCert == nil {
		err = c.loadSelfCert()
		if err != nil {
			return
		}
	}

	return
}

func (c *Certificates) loadSelfCert() (err error) {
	certPem, keyPem, err := node.SelfCert()
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"error": err,
		}).Error("router: Web server self certificate error")
		return
	}

	keypair, err := tls.X509KeyPair(certPem, keyPem)
	if err != nil {
		err = &errortypes.ReadError{
			errors.Wrap(
				err,
				"router: Failed to load self certificate",
			),
		}
		logrus.WithFields(logrus.Fields{
			"error": err,
		}).Error("router: Web server self certificate error")
		return
	}

	c.selfCert = &keypair

	return
}

func (c *Certificates) GetCertificate(info *tls.ClientHelloInfo) (
	cert *tls.Certificate, err error) {

	name := strings.ToLower(info.ServerName)
	for len(name) > 0 && name[len(name)-1] == '.' {
		name = name[:len(name)-1]
	}

	cert = c.domainMap[name]
	if cert == nil {
		cert = c.selfCert
	}

	return
}

func (c *Certificates) Update(db *database.Database,
	balncs []*balancer.Balancer) (err error) {

	loaded := set.NewSet()
	certificates := []*certificate.Certificate{}

	nodeCerts := node.Self.Certificates
	if nodeCerts != nil {
		for _, certId := range nodeCerts {
			if loaded.Contains(certId) {
				continue
			}
			loaded.Add(certId)

			cert, e := certificate.Get(db, certId)
			if e != nil {
				if _, ok := e.(*database.NotFoundError); ok {
					cert = nil
					e = nil
				} else {
					err = e
					return
				}
			}

			if cert != nil {
				certificates = append(certificates, cert)
			}
		}
	}

	for _, balnc := range balncs {
		for _, certId := range balnc.Certificates {
			cert, e := certificate.Get(db, certId)
			if e != nil {
				if _, ok := e.(*database.NotFoundError); ok {
					cert = nil
					e = nil
				} else {
					err = e
					return
				}
			}

			if cert != nil {
				if cert.Organization != balnc.Organization ||
					loaded.Contains(certId) {

					continue
				}
				loaded.Add(certId)

				certificates = append(certificates, cert)
			}
		}
	}

	domainMap := map[string]*tls.Certificate{}
	for _, cert := range certificates {
		keypair, e := tls.X509KeyPair(
			[]byte(cert.Certificate),
			[]byte(cert.Key),
		)
		if e != nil {
			err = &errortypes.ReadError{
				errors.Wrap(e, "router: Failed to load certificate"),
			}
			logrus.WithFields(logrus.Fields{
				"error": err,
			}).Error("router: Web server certificate error")
			err = nil
			continue
		}
		tlsCert := &keypair

		x509Cert := tlsCert.Leaf
		if x509Cert == nil {
			var e error
			x509Cert, e = x509.ParseCertificate(tlsCert.Certificate[0])
			if e != nil {
				continue
			}
		}
		if len(x509Cert.Subject.CommonName) > 0 {
			domainMap[x509Cert.Subject.CommonName] = tlsCert
		}
		for _, san := range x509Cert.DNSNames {
			domainMap[san] = tlsCert
		}
	}

	c.domainMap = domainMap

	return
}
