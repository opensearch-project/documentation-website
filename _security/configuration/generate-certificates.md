---
layout: default
title: Generating self-signed certificates
parent: Configuration
nav_order: 20
redirect_from:
  - /security-plugin/configuration/generate-certificates/
---

# Generating self-signed certificates

If you don't have access to a certificate authority (CA) for your organization and want to use OpenSearch for non-demo purposes, you can generate your own self-signed certificates using [OpenSSL](https://www.openssl.org/){:target='\_blank'}.

You can probably find OpenSSL in the package manager for your operating system.

On CentOS, use Yum:

```bash
sudo yum install openssl
```

On macOS, use [Homebrew](https://brew.sh/){:target='\_blank'}:

```bash
brew install openssl
```


## Generate a private key

The first step in this process is to generate a private key using the `openssl genrsa` command. As the name suggests, you should keep this file private.

Private keys must be of sufficient length to be secure, so specify `2048`:

```bash
openssl genrsa -out root-ca-key.pem 2048
```

You can optionally add the `-aes256` option to encrypt the key using the AES-256 standard. This option requires a password.


## Generate a root certificate

Next, use the private key to generate a self-signed certificate for the root CA:

```bash
openssl req -new -x509 -sha256 -key root-ca-key.pem -out root-ca.pem -days 730
```

The default `-days` value of 30 is only useful for testing purposes. This sample command specifies 730 (two years) for the certificate expiration date, but use whatever value makes sense for your organization.

- The `-x509` option specifies that you want a self-signed certificate rather than a certificate request.
- The `-sha256` option sets the hash algorithm to SHA-256. SHA-256 is the default in later versions of OpenSSL, but earlier versions might use SHA-1.

Follow the prompts to specify details for your organization. Together, these details form the distinguished name (DN) of your CA.


## Generate an admin certificate

To generate an admin certificate, first create a new key:

```bash
openssl genrsa -out admin-key-temp.pem 2048
```

Then convert that key to PKCS#8 format for use in Java using a PKCS#12-compatible algorithm (3DES):

```bash
openssl pkcs8 -inform PEM -outform PEM -in admin-key-temp.pem -topk8 -nocrypt -v1 PBE-SHA1-3DES -out admin-key.pem
```

Next, create a certificate signing request (CSR). This file acts as an application to a CA for a signed certificate:

```bash
openssl req -new -key admin-key.pem -out admin.csr
```

Follow the prompts to fill in the details. You don't need to specify a challenge password. As noted in the [OpenSSL Cookbook](https://www.feistyduck.com/books/openssl-cookbook/){:target='\_blank'}, "Having a challenge password does not increase the security of the CSR in any way."

If you generate TLS certificates and have enabled hostname verification by setting `plugins.security.ssl.transport.enforce_hostname_verification` to `true` (default), be sure to specify a common name (CN) for each certificate signing request (CSR) that matches the corresponding DNS A record of the intended node.

If you want to use the same node certificate on all nodes (not recommended), set hostname verification to `false`. For more information, see [Configure TLS certificates]({{site.url}}{{site.baseurl}}/security/configuration/tls/#advanced-hostname-verification-and-dns-lookup).

Now that the private key and signing request have been created, generate the certificate:

```bash
openssl x509 -req -in admin.csr -CA root-ca.pem -CAkey root-ca-key.pem -CAcreateserial -sha256 -out admin.pem -days 730
```

Just like the root certificate, use the `-days` option to specify an expiration date of longer than 30 days.


## (Optional) Generate node and client certificates

Similar to the steps in [Generate an admin certificate](#generate-an-admin-certificate), you will generate keys and CSRs with new file names for each node and as many client certificates as you need. For example, you might generate one client certificate for OpenSearch Dashboards and another for a Python client. Each certificate should use its own private key and should be generated from a unique CSR with matching SAN extension specific to the intended host. A SAN extension is not needed for the admin cert because that cert is not tied to a specific host.

To generate a node or client certificate, first create a new key:

```bash
openssl genrsa -out node1-key-temp.pem 2048
```

Then convert that key to PKCS#8 format for use in Java using a PKCS#12-compatible algorithm (3DES):

```bash
openssl pkcs8 -inform PEM -outform PEM -in node1-key-temp.pem -topk8 -nocrypt -v1 PBE-SHA1-3DES -out node1-key.pem
```

Next, create the CSR:

```bash
openssl req -new -key node1-key.pem -out node1.csr
```

For all host and client certificates, you should specify a subject alternative name (SAN) to ensure compliance with [RFC 2818 (HTTP Over TLS)](https://datatracker.ietf.org/doc/html/rfc2818). The SAN should match the corresponding CN so that both refer to the same DNS A record.
{: .note }

Before generating a signed certificate, create a SAN extension file which describes the DNS A record for the host:

```bash
echo 'subjectAltName=DNS:node1.dns.a-record' > node1.ext
```

Generate the certificate:

```bash
openssl x509 -req -in node1.csr -CA root-ca.pem -CAkey root-ca-key.pem -CAcreateserial -sha256 -out node1.pem -days 730 -extfile node1.ext
```


## Sample script

If you already know the certificate details and don't want to specify them interactively, use the `-subj` option in your `root-ca.pem` and CSR commands. This script creates a root certificate, admin certificate, two node certificates, and a client certificate, all with an expiration dates of two years (730 days):

```bash
#!/bin/sh
# Root CA
openssl genrsa -out root-ca-key.pem 2048
openssl req -new -x509 -sha256 -key root-ca-key.pem -subj "/C=CA/ST=ONTARIO/L=TORONTO/O=ORG/OU=UNIT/CN=root.dns.a-record" -out root-ca.pem -days 730
# Admin cert
openssl genrsa -out admin-key-temp.pem 2048
openssl pkcs8 -inform PEM -outform PEM -in admin-key-temp.pem -topk8 -nocrypt -v1 PBE-SHA1-3DES -out admin-key.pem
openssl req -new -key admin-key.pem -subj "/C=CA/ST=ONTARIO/L=TORONTO/O=ORG/OU=UNIT/CN=A" -out admin.csr
openssl x509 -req -in admin.csr -CA root-ca.pem -CAkey root-ca-key.pem -CAcreateserial -sha256 -out admin.pem -days 730
# Node cert 1
openssl genrsa -out node1-key-temp.pem 2048
openssl pkcs8 -inform PEM -outform PEM -in node1-key-temp.pem -topk8 -nocrypt -v1 PBE-SHA1-3DES -out node1-key.pem
openssl req -new -key node1-key.pem -subj "/C=CA/ST=ONTARIO/L=TORONTO/O=ORG/OU=UNIT/CN=node1.dns.a-record" -out node1.csr
echo 'subjectAltName=DNS:node1.dns.a-record' > node1.ext
openssl x509 -req -in node1.csr -CA root-ca.pem -CAkey root-ca-key.pem -CAcreateserial -sha256 -out node1.pem -days 730 -extfile node1.ext
# Node cert 2
openssl genrsa -out node2-key-temp.pem 2048
openssl pkcs8 -inform PEM -outform PEM -in node2-key-temp.pem -topk8 -nocrypt -v1 PBE-SHA1-3DES -out node2-key.pem
openssl req -new -key node2-key.pem -subj "/C=CA/ST=ONTARIO/L=TORONTO/O=ORG/OU=UNIT/CN=node2.dns.a-record" -out node2.csr
echo 'subjectAltName=DNS:node2.dns.a-record' > node2.ext
openssl x509 -req -in node2.csr -CA root-ca.pem -CAkey root-ca-key.pem -CAcreateserial -sha256 -out node2.pem -days 730 -extfile node2.ext
# Client cert
openssl genrsa -out client-key-temp.pem 2048
openssl pkcs8 -inform PEM -outform PEM -in client-key-temp.pem -topk8 -nocrypt -v1 PBE-SHA1-3DES -out client-key.pem
openssl req -new -key client-key.pem -subj "/C=CA/ST=ONTARIO/L=TORONTO/O=ORG/OU=UNIT/CN=client.dns.a-record" -out client.csr
echo 'subjectAltName=DNS:client.dns.a-record' > client.ext
openssl x509 -req -in client.csr -CA root-ca.pem -CAkey root-ca-key.pem -CAcreateserial -sha256 -out client.pem -days 730 -extfile client.ext
# Cleanup
rm admin-key-temp.pem
rm admin.csr
rm node1-key-temp.pem
rm node1.csr
rm node1.ext
rm node2-key-temp.pem
rm node2.csr
rm node2.ext
rm client-key-temp.pem
rm client.csr
rm client.ext
```


## Add distinguished names to opensearch.yml

You must specify the distinguished names (DNs) for all admin and node certificates in `opensearch.yml` on all nodes. Using the certificates from the sample script above, part of `opensearch.yml` might look like this:

```yml
plugins.security.authcz.admin_dn:
  - 'CN=A,OU=UNIT,O=ORG,L=TORONTO,ST=ONTARIO,C=CA'
plugins.security.nodes_dn:
  - 'CN=node1.dns.a-record,OU=UNIT,O=ORG,L=TORONTO,ST=ONTARIO,C=CA'
  - 'CN=node2.dns.a-record,OU=UNIT,O=ORG,L=TORONTO,ST=ONTARIO,C=CA'
```

But if you look at the `subject` of the certificate after creating it, you might see different formatting:

```
subject=/C=CA/ST=ONTARIO/L=TORONTO/O=ORG/OU=UNIT/CN=node1.dns.a-record
```

If you compare this string to the ones above, you can see that you need to invert the order of elements and use commas rather than slashes. Enter this command to get the correct string:

```bash
openssl x509 -subject -nameopt RFC2253 -noout -in node.pem
```

Then copy and paste the output into `opensearch.yml`.


## Add certificate files to opensearch.yml

This process generates many files, but these are the ones you need to add to each node:

- `root-ca.pem`
- (Optional) `admin.pem`
- (Optional) `admin-key.pem`
- (Optional) `node1.pem`
- (Optional) `node1-key.pem`

For most users, the `admin.pem` and `admin-key.pem` files only need to be added to the nodes you plan to run the `securityadmin` script or reload certificates from. For information about how to use the `securityadmin` script, see [Applying changes to configuration files]({{site.url}}{{site.baseurl}}/security/configuration/security-admin/). If you intend to run the `securityadmin` script directly from a node, that node will need to have a copy of `admin.pem` and `admin-key.pem` on it.

On one node, the security configuration portion of `opensearch.yml` might look like this:

```yml
plugins.security.ssl.transport.pemcert_filepath: node1.pem
plugins.security.ssl.transport.pemkey_filepath: node1-key.pem
plugins.security.ssl.transport.pemtrustedcas_filepath: root-ca.pem
plugins.security.ssl.transport.enforce_hostname_verification: false
plugins.security.ssl.http.enabled: true
plugins.security.ssl.http.pemcert_filepath: node1.pem
plugins.security.ssl.http.pemkey_filepath: node1-key.pem
plugins.security.ssl.http.pemtrustedcas_filepath: root-ca.pem
plugins.security.authcz.admin_dn:
  - 'CN=A,OU=UNIT,O=ORG,L=TORONTO,ST=ONTARIO,C=CA'
plugins.security.nodes_dn:
  - 'CN=node1.dns.a-record,OU=UNIT,O=ORG,L=TORONTO,ST=ONTARIO,C=CA'
  - 'CN=node2.dns.a-record,OU=UNIT,O=ORG,L=TORONTO,ST=ONTARIO,C=CA'
```

For more information about adding and using these certificates in your own setup, see [Configuring basic security settings]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/docker/#configuring-basic-security-settings) for Docker, [Configure TLS certificates]({{site.url}}{{site.baseurl}}/security/configuration/tls/), and [Client certificate authentication]({{site.url}}{{site.baseurl}}/security/configuration/client-auth/).

## OpenSearch Dashboards

For information on using your root CA and a client certificate to enable TLS for OpenSearch Dashboards, see [Configure TLS for OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/tls/).
