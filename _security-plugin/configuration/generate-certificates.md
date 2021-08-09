---
layout: default
title: Generate Certificates
parent: Configuration
nav_order: 11
redirect_from: /security/configuration/generate-certificates/
---

# Generate certificates

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

The first step in this process is to generate a private key using the `genrsa` command. As the name suggests, you should keep this file private.

Private keys must be of sufficient length to be secure, so specify `2048`:

```bash
openssl genrsa -out root-ca-key.pem 2048
```

You can optionally add the `-aes256` option to encrypt the key using the AES-256 standard. This option requires a password.


## Generate a root certificate

Next, use the key to generate a self-signed certificate for the root CA:

```bash
openssl req -new -x509 -sha256 -key root-ca-key.pem -out root-ca.pem -days 30
```

Change `-days 30` to 3650 (10 years) or some other number to set a non-default expiration date. The default value of 30 days is best for testing purposes.

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

Finally, generate the certificate itself:

```bash
openssl x509 -req -in admin.csr -CA root-ca.pem -CAkey root-ca-key.pem -CAcreateserial -sha256 -out admin.pem -days 30
```

Just like the root certificate, use the `-days` option to specify an expiration date of longer than 30 days.


## (Optional) Generate node and client certificates

Follow the steps in [Generate an admin certificate](#generate-an-admin-certificate) with new file names to generate a new certificate for each node and as many client certificates as you need. Each certificate should use its own private key.

If you generate node certificates and have `plugins.security.ssl.transport.enforce_hostname_verification` set to `true` (default), be sure to specify a common name (CN) for the certificate that matches the hostname of the intended node. If you want to use the same node certificate on all nodes (not recommended), set hostname verification to `false`. For more information, see [Configure TLS certificates]({{site.url}}{{site.baseurl}}/security-plugin/configuration/tls#advanced-hostname-verification-and-dns-lookup).


### Sample script

```bash
# Root CA
openssl genrsa -out root-ca-key.pem 2048
openssl req -new -x509 -sha256 -key root-ca-key.pem -out root-ca.pem -days 30
# Admin cert
openssl genrsa -out admin-key-temp.pem 2048
openssl pkcs8 -inform PEM -outform PEM -in admin-key-temp.pem -topk8 -nocrypt -v1 PBE-SHA1-3DES -out admin-key.pem
openssl req -new -key admin-key.pem -out admin.csr
openssl x509 -req -in admin.csr -CA root-ca.pem -CAkey root-ca-key.pem -CAcreateserial -sha256 -out admin.pem -days 30
# Node cert
openssl genrsa -out node-key-temp.pem 2048
openssl pkcs8 -inform PEM -outform PEM -in node-key-temp.pem -topk8 -nocrypt -v1 PBE-SHA1-3DES -out node-key.pem
openssl req -new -key node-key.pem -out node.csr
openssl x509 -req -in node.csr -CA root-ca.pem -CAkey root-ca-key.pem -CAcreateserial -sha256 -out node.pem -days 30
#Client cert
openssl genrsa -out client-key-temp.pem 2048
openssl pkcs8 -inform PEM -outform PEM -in client-key-temp.pem -topk8 -nocrypt -v1 PBE-SHA1-3DES -out client-key.pem
openssl req -new -key client-key.pem -out client.csr
openssl x509 -req -in client.csr -CA root-ca.pem -CAkey root-ca-key.pem -CAcreateserial -sha256 -out client.pem -days 30
# Cleanup
rm admin-key-temp.pem
rm admin.csr
rm node-key-temp.pem
rm node.csr
rm client-key-temp.pem
rm client.csr
```

If you already know the certificate details and don't want to specify them as the script runs, use the `-subj` option in your `root-ca.pem` and CSR commands:

```bash
openssl req -new -key node-key.pem -subj "/C=CA/ST=ONTARIO/L=TORONTO/O=ORG/OU=UNIT/CN=node1.example.com" -out node.csr
```


## Get distinguished names

If you created admin and node certificates, you must specify their distinguished names (DNs) in `opensearch.yml` on all nodes:

```yml
plugins.security.authcz.admin_dn:
  - 'CN=ADMIN,OU=UNIT,O=ORG,L=TORONTO,ST=ONTARIO,C=CA'
plugins.security.nodes_dn:
  - 'CN=node1.example.com,OU=UNIT,O=ORG,L=TORONTO,ST=ONTARIO,C=CA'
  - 'CN=node2.example.com,OU=UNIT,O=ORG,L=TORONTO,ST=ONTARIO,C=CA'
```

But if you look at the `subject` of the certificate after creating it, you might see different formatting:

```
subject=/C=CA/ST=ONTARIO/L=TORONTO/O=ORG/OU=UNIT/CN=node1.example.com
```

If you compare this string to the ones in `opensearch.yml` above, you can see that you need to invert the order of elements and use commas rather than slashes. Enter this command to get the correct string:

```bash
openssl x509 -subject -nameopt RFC2253 -noout -in node.pem
```

Then you can copy and paste the output into `opensearch.yml`:

```
subject= CN=node1.example.com,OU=UNIT,O=ORG,L=TORONTO,ST=ONTARIO,C=CA
```


## Configure certificates

This process generates many files, but these are the ones you need to add to your cluster configuration:

- `root-ca.pem`
- `admin.pem`
- `admin-key.pem`
- (Optional) `each-node-cert.pem`
- (Optional) `each-node-key.pem`

For information about adding and using these certificates in your own setup, see [Docker security configuration]({{site.url}}{{site.baseurl}}//opensearch/install/docker-security/) and [Configure TLS certificates]({{site.url}}{{site.baseurl}}/security-plugin/configuration/tls/).


## Run securityadmin.sh

After configuring your certificates and starting OpenSearch, run `securityadmin.sh` to initialize the security plugin:

```
./securityadmin.sh -cd {{site.url}}{{site.baseurl}}/securityconfig/ -icl -nhnv -cacert {{site.url}}{{site.baseurl}}/config/root-ca.pem -cert {{site.url}}{{site.baseurl}}/config/admin.pem -key {{site.url}}{{site.baseurl}}/config/admin-key.pem
```

For more information about what this command does, see [Apply configuration changes]({{site.url}}{{site.baseurl}}/security-plugin/configuration/security-admin/).
{: .tip }

If you use Docker, see [Bash access to containers]({{site.url}}{{site.baseurl}}/opensearch/install/docker#bash-access-to-containers).


## OpenSearch Dashboards

Depending on your settings in `opensearch_dashboards.yml`, you might need to add `root-ca.pem` to your OpenSearch Dashboards node. You have two options: disable SSL verification or add the root CA.

- Disable SSL verification:

  ```yml
  opensearch.ssl.verificationMode: none
  ```

- Add the root CA:

  ```yml
  opensearch.ssl.certificateAuthorities: ["/usr/share/opensearch-dashboards/config/root-ca.pem"]
  opensearch.ssl.verificationMode: full
  ```
