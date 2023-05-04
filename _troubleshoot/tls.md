---
layout: default
title: Troubleshoot TLS
nav_order: 15
---

# TLS troubleshooting

This page includes troubleshooting steps for configuring TLS certificates with the Security plugin.


---

#### Table of contents
- TOC
{:toc}


---


## Validate YAML

`opensearch.yml` and the files in `config/opensearch-security/` are in the YAML format. A linter like [YAML Validator](https://codebeautify.org/yaml-validator) can help verify that you don't have any formatting errors.


## View contents of PEM certificates

You can use OpenSSL to display the content of each PEM certificate:

```bash
openssl x509 -subject -nameopt RFC2253 -noout -in node1.pem
```

Then ensure that the value matches the one in `opensearch.yml`.

For more complete information on a certificate:

```bash
openssl x509 -in node1.pem -text -noout
```


### Check for special characters and whitespace in DNs

The Security plugin uses the [string representation of Distinguished Names (RFC1779)](https://www.ietf.org/rfc/rfc1779.txt) when validating node certificates.

If parts of your DN contain special characters (e.g. a comma), make sure you escape it in your configuration:

```yml
plugins.security.nodes_dn:
  - 'CN=node-0.example.com,OU=SSL,O=My\, Test,L=Test,C=DE'
```

You can have whitespace within a field, but not between fields.

#### Bad configuration

```yml
plugins.security.nodes_dn:
  - 'CN=node-0.example.com, OU=SSL,O=My\, Test, L=Test, C=DE'
```

#### Good configuration

```yml
plugins.security.nodes_dn:
  - 'CN=node-0.example.com,OU=SSL,O=My\, Test,L=Test,C=DE'
```


### Check certificate IP addresses

Sometimes the IP address in your certificate is not the one communicating with the cluster. This problem can occur if your node has multiple interfaces or is running on a dual stack network (IPv6 and IPv4).

If this problem occurs, you might see the following in the node's OpenSearch log:

```
SSL Problem Received fatal alert: certificate_unknown javax.net.ssl.SSLException: Received fatal alert: certificate_unknown
```

You might also see the following message in your cluster's master log when the new node tries to join the cluster:

```
Caused by: java.security.cert.CertificateException: No subject alternative names matching IP address 10.0.0.42 found
```

Check the IP address in the certificate:

```
IPAddress: 2001:db8:0:1:1.2.3.4
```

In this example, the node tries to join the cluster with the IPv4 address of `10.0.0.42`, but the certificate contains the IPv6 address of `2001:db8:0:1:1.2.3.4`.


### Validate certificate chain

TLS certificates are organized in a certificate chain. You can check with `keytool` that the certificate chain is correct by inspecting the owner and the issuer of each certificate. If you used the demo installation script that ships with the Security plugin, the chain looks like:

#### Node certificate

```
Owner: CN=node-0.example.com, OU=SSL, O=Test, L=Test, C=DE
Issuer: CN=Example Com Inc. Signing CA, OU=Example Com Inc. Signing CA, O=Example Com Inc., DC=example, DC=com
```

#### Signing certificate

```
Owner: CN=Example Com Inc. Signing CA, OU=Example Com Inc. Signing CA, O=Example Com Inc., DC=example, DC=com
Issuer: CN=Example Com Inc. Root CA, OU=Example Com Inc. Root CA, O=Example Com Inc., DC=example, DC=com
```

#### Root certificate

```
Owner: CN=Example Com Inc. Root CA, OU=Example Com Inc. Root CA, O=Example Com Inc., DC=example, DC=com
Issuer: CN=Example Com Inc. Root CA, OU=Example Com Inc. Root CA, O=Example Com Inc., DC=example, DC=com
```

From the entries, you can see that the root certificate signed the intermediate certificate, which signed the node certificate. The root certificate signed itself, hence the name "self-signed certificate." If you're using separate keystore and truststore files, your root CA can most likely in the truststore.

Generally, the keystore contains client or node certificate and all intermediate certificates, and the truststore contains the root certificate.


### Check the configured alias

If you have multiple entries in the keystore and you are using aliases to refer to them, make sure that the configured alias in `opensearch.yml` matches the one in the keystore. If there is only one entry in the keystore, you do not need to configure an alias.


## View contents of your keystore and truststore

In order to view information about the certificates stored in your keystore or truststore, use the `keytool` command like:

```bash
keytool -list -v -keystore keystore.jks
```

`keytool` prompts for the password of the keystore and lists all entries. For example, you can use this output to check for the correctness of the SAN and EKU settings.


## Check SAN hostnames and IP addresses

The valid hostnames and IP addresses of a TLS certificates are stored as `SAN` entries. Check that the hostname and IP entries in the `SAN` section are correct, especially when you use hostname verification:

```
Certificate[1]:
Owner: CN=node-0.example.com, OU=SSL, O=Test, L=Test, C=DE
...
Extensions:
...
#5: ObjectId: 2.5.29.17 Criticality=false
SubjectAlternativeName [
  DNSName: node-0.example.com
  DNSName: localhost
  IPAddress: 127.0.0.1
  ...
]
```


## Check OID for node certificates

If you are using OIDs to denote valid node certificates, check that the `SAN` extension for your node certificate contains the correct `OIDName`:

```
Certificate[1]:
Owner: CN=node-0.example.com, OU=SSL, O=Test, L=Test, C=DE
...
Extensions:
...
#5: ObjectId: 2.5.29.17 Criticality=false
SubjectAlternativeName [
  ...
  OIDName: 1.2.3.4.5.5
]
```


## Check EKU field for node certificates

Node certificates need to have both `serverAuth` and `clientAuth` set in the extended key usage field:

```
#3: ObjectId: 2.5.29.37 Criticality=false
ExtendedKeyUsages [
  serverAuth
  clientAuth
]
```


## TLS versions

The Security plugin disables TLS version 1.0 by default; it is outdated, insecure, and vulnerable. If you need to use `TLSv1` and accept the risks, you can enable it in `opensearch.yml`:

```yml
plugins.security.ssl.http.enabled_protocols:
  - "TLSv1"
  - "TLSv1.1"
  - "TLSv1.2"
```


## Supported ciphers

TLS relies on the server and client negotiating a common cipher suite. Depending on your system, the available ciphers will vary. They depend on the JDK or OpenSSL version you're using, and  whether or not the `JCE Unlimited Strength Jurisdiction Policy Files` are installed.

For legal reasons, the JDK does not include strong ciphers like AES256. In order to use strong ciphers you need to download and install the [Java Cryptography Extension (JCE) Unlimited Strength Jurisdiction Policy Files](https://www.oracle.com/technetwork/java/javase/downloads/jce8-download-2133166.html). If you don't have them installed, you might see an error message on startup:

```
[INFO ] AES-256 not supported, max key length for AES is 128 bit.
That is not an issue, it just limits possible encryption strength.
To enable AES 256 install 'Java Cryptography Extension (JCE) Unlimited Strength Jurisdiction Policy Files'
```

The Security plugin still works and falls back to weaker cipher suites. The plugin also prints out all available cipher suites during startup:

```
[INFO ] sslTransportClientProvider:
JDK with ciphers [TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256, TLS_DHE_RSA_WITH_AES_128_CBC_SHA256,
TLS_DHE_DSS_WITH_AES_128_CBC_SHA256, ...]
```
