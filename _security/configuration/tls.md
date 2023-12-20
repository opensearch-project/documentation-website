---
layout: default
title: Configuring TLS certificates
parent: Configuration
nav_order: 15
redirect_from:
  - /security-plugin/configuration/tls/
---

# Configuring TLS certificates

TLS is configured in `opensearch.yml`. Certificates are used to secure transport-layer traffic (node-to-node communication within your cluster) and REST-layer traffic (communication between a client and a node within your cluster). TLS is optional for the REST layer and mandatory for the transport layer.

You can find an example configuration template with all options on [GitHub](https://github.com/opensearch-project/security/blob/main/config/opensearch.yml.example).
{: .note }


## X.509 PEM certificates and PKCS \#8 keys

The following tables contain the settings you can use to configure the location of your PEM certificates and private keys.


### Transport layer TLS

Name | Description
:--- | :---
`plugins.security.ssl.transport.pemkey_filepath` | Path to the certificate's key file (PKCS \#8), which must be under the `config` directory, specified using a relative path. Required.
`plugins.security.ssl.transport.pemkey_password` | Key password. Omit this setting if the key has no password. Optional.
`plugins.security.ssl.transport.pemcert_filepath` | Path to the X.509 node certificate chain (PEM format), which must be under the `config` directory, specified using a relative path. Required.
`plugins.security.ssl.transport.pemtrustedcas_filepath` | Path to the root CAs (PEM format), which must be under the `config` directory, specified using a relative path. Required.


### REST layer TLS

Name | Description
:--- | :---
`plugins.security.ssl.http.enabled` | Whether to enable TLS on the REST layer. If enabled, only HTTPS is allowed. Optional. Default is `false`.
`plugins.security.ssl.http.pemkey_filepath` | Path to the certificate's key file (PKCS \#8), which must be under the `config` directory, specified using a relative path. Required.
`plugins.security.ssl.http.pemkey_password` | Key password. Omit this setting if the key has no password. Optional.
`plugins.security.ssl.http.pemcert_filepath` | Path to the X.509 node certificate chain (PEM format), which must be under the `config` directory, specified using a relative path. Required.
`plugins.security.ssl.http.pemtrustedcas_filepath` | Path to the root CAs (PEM format), which must be under the `config` directory, specified using a relative path. Required.


## Keystore and truststore files

As an alternative to certificates and private keys in PEM format, you can instead use keystore and truststore files in JKS or PKCS12/PFX format. For the Security plugin to operate, you need certificates and private keys.

The following settings configure the location and password of your keystore and truststore files. If you want, you can use different keystore and truststore files for the REST and the transport layer.


### Transport layer TLS

Name | Description
:--- | :---
`plugins.security.ssl.transport.keystore_type` | The type of the keystore file, JKS or PKCS12/PFX. Optional. Default is JKS.
`plugins.security.ssl.transport.keystore_filepath` | Path to the keystore file, which must be under the `config` directory, specified using a relative path. Required.
`plugins.security.ssl.transport.keystore_alias: my_alias` | Alias name. Optional. Default is the first alias.
`plugins.security.ssl.transport.keystore_password` | Keystore password. Default is `changeit`.
`plugins.security.ssl.transport.truststore_type` | The type of the truststore file, JKS or PKCS12/PFX. Default is JKS.
`plugins.security.ssl.transport.truststore_filepath` | Path to the truststore file, which must be under the `config` directory, specified using a relative path. Required.
`plugins.security.ssl.transport.truststore_alias` | Alias name. Optional. Default is all certificates.
`plugins.security.ssl.transport.truststore_password` | Truststore password. Default is `changeit`.


### REST layer TLS

Name | Description
:--- | :---
`plugins.security.ssl.http.enabled` | Whether to enable TLS on the REST layer. If enabled, only HTTPS is allowed. Optional. Default is false.
`plugins.security.ssl.http.keystore_type` | The type of the keystore file, JKS or PKCS12/PFX. Optional. Default is JKS.
`plugins.security.ssl.http.keystore_filepath` | Path to the keystore file, which must be under the `config` directory, specified using a relative path. Required.
`plugins.security.ssl.http.keystore_alias` | Alias name. Optional. Default is the first alias.
`plugins.security.ssl.http.keystore_password` | Keystore password. Default is `changeit`.
`plugins.security.ssl.http.truststore_type` | The type of the truststore file, JKS or PKCS12/PFX. Default is JKS.
`plugins.security.ssl.http.truststore_filepath` | Path to the truststore file, which must be under the `config` directory, specified using a relative path. Required.
`plugins.security.ssl.http.truststore_alias` | Alias name. Optional. Default is all certificates.
`plugins.security.ssl.http.truststore_password` | Truststore password. Default is `changeit`.


## Configuring node certificates

OpenSearch Security needs to identify requests between the nodes in the cluster. It uses node certificates to secure these requests. The simplest way to configure node certificates is to list the Distinguished Names (DNs) of these certificates in `opensearch.yml`. All DNs must be included in `opensearch.yml` on all nodes. Keep in mind that the Security plugin supports wildcards and regular expressions:

```yml
plugins.security.nodes_dn:
  - 'CN=node.other.com,OU=SSL,O=Test,L=Test,C=DE'
  - 'CN=*.example.com,OU=SSL,O=Test,L=Test,C=DE'
  - 'CN=elk-devcluster*'
  - '/CN=.*regex/'
```

If your node certificates have an Object ID (OID) identifier in the SAN section, you can omit this configuration.


## Configuring admin certificates

Admin certificates are regular client certificates that have elevated rights to perform administrative tasks. You need an admin certificate to change the Security plugin configuration using [`plugins/opensearch-security/tools/securityadmin.sh`]({{site.url}}{{site.baseurl}}/security/configuration/security-admin/) or the REST API. Admin certificates are configured in `opensearch.yml` by stating their DN(s):

```yml
plugins.security.authcz.admin_dn:
  - CN=admin,OU=SSL,O=Test,L=Test,C=DE
```

For security reasons, you can't use wildcards or regular expressions here.


## (Advanced) OpenSSL

The Security plugin supports OpenSSL, but we only recommend it if you use Java 8. If you use Java 11, we recommend the default configuration.

To use OpenSSL, you must install OpenSSL, the Apache Portable Runtime, and a Netty version with OpenSSL support matching your platform on all nodes.

If OpenSSL is enabled, but for one reason or another the installation does not work, the Security plugin falls back to the Java JCE as the security engine.

Name | Description
:--- | :---
`plugins.security.ssl.transport.enable_openssl_if_available` | Enable OpenSSL on the transport layer if available. Optional. Default is true.
`plugins.security.ssl.http.enable_openssl_if_available` | Enable OpenSSL on the REST layer if available. Optional. Default is true.

{% comment %}
1. Install [OpenSSL 1.1.0](https://www.openssl.org/community/binaries.html) on every node.
1. Install [Apache Portable Runtime](https://apr.apache.org) on every node:

  ```
  sudo yum install apr
  ```
{% endcomment %}


## (Advanced) Hostname verification and DNS lookup

In addition to verifying the TLS certificates against the root CA and/or intermediate CA(s), the Security plugin can apply additional checks on the transport layer.

With `enforce_hostname_verification` enabled, the Security plugin verifies that the hostname of the communication partner matches the hostname in the certificate. The hostname is taken from the `subject` or `SAN` entries of your certificate. For example, if the hostname of your node is `node-0.example.com`, then the hostname in the TLS certificate has to be set to `node-0.example.com`, as well. Otherwise, errors are thrown:

```
[ERROR][c.a.o.s.s.t.opensearchSecuritySSLNettyTransport] [WX6omJY] SSL Problem No name matching <hostname> found
[ERROR][c.a.o.s.s.t.opensearchSecuritySSLNettyTransport] [WX6omJY] SSL Problem Received fatal alert: certificate_unknown
```

In addition, when `resolve_hostname` is enabled, the Security plugin resolves the (verified) hostname against your DNS. If the hostname does not resolve, errors are thrown:


Name | Description
:--- | :---
`plugins.security.ssl.transport.enforce_hostname_verification` | Whether to verify hostnames on the transport layer. Optional. Default is true.
`plugins.security.ssl.transport.resolve_hostname` | Whether to resolve hostnames against DNS on the transport layer. Optional. Default is true. Only works if hostname verification is also enabled.


## (Advanced) Client authentication

With TLS client authentication enabled, REST clients can send a TLS certificate with the HTTP request to provide identity information to the Security plugin. There are three main usage scenarios for TLS client authentication:

- Providing an admin certificate when using the REST management API.
- Configuring roles and permissions based on a client certificate.
- Providing identity information for tools like OpenSearch Dashboards, Logstash, or Beats.

TLS client authentication has three modes:

* `NONE`: The Security plugin does not accept TLS client certificates. If one is sent, it is discarded.
* `OPTIONAL`: The Security plugin accepts TLS client certificates if they are sent, but does not require them.
* `REQUIRE`: The Security plugin only accepts REST requests when a valid client TLS certificate is sent.

For the REST management API, the client authentication modes has to be OPTIONAL at a minimum.

You can configure the client authentication mode by using the following setting:

Name | Description
:--- | :---
plugins.security.ssl.http.clientauth_mode | The TLS client authentication mode to use. Can be one of `NONE`, `OPTIONAL` (default) or `REQUIRE`. Optional.


## (Advanced) Enabled ciphers and protocols

You can limit the allowed ciphers and TLS protocols for the REST layer. For example, you can only allow strong ciphers and limit the TLS versions to the most recent ones.

If this setting is not enabled, the ciphers and TLS versions are negotiated between the browser and the Security plugin automatically, which in some cases can lead to a weaker cipher suite being used. You can configure the ciphers and protocols using the following settings.

Name | Data type | Description
:--- | :--- | :---
`plugins.security.ssl.http.enabled_ciphers` | Array | Enabled TLS cipher suites for the REST layer. Only Java format is supported.
`plugins.security.ssl.http.enabled_protocols` | Array | Enabled TLS protocols for the REST layer. Only Java format is supported.
`plugins.security.ssl.transport.enabled_ciphers` | Array | Enabled TLS cipher suites for the transport layer. Only Java format is supported.
`plugins.security.ssl.transport.enabled_protocols` | Array | Enabled TLS protocols for the transport layer. Only Java format is supported.

### Example settings

```yml
plugins.security.ssl.http.enabled_ciphers:
  - "TLS_DHE_RSA_WITH_AES_256_CBC_SHA"
  - "TLS_DHE_DSS_WITH_AES_128_CBC_SHA256"
plugins.security.ssl.http.enabled_protocols:
  - "TLSv1.1"
  - "TLSv1.2"
```

Because it is insecure, the Security plugin disables `TLSv1` by default. If you need to use `TLSv1` and accept the risks, you can still enable it:

```yml
plugins.security.ssl.http.enabled_protocols:
  - "TLSv1"
  - "TLSv1.1"
  - "TLSv1.2"
```


## (Advanced) Disabling client initiated renegotiation for Java 8

Set `-Djdk.tls.rejectClientInitiatedRenegotiation=true` to disable secure client initiated renegotiation, which is enabled by default. This can be set via `OPENSEARCH_JAVA_OPTS` in `config/jvm.options`.

## (Advanced) Using encrypted password settings for SSL

The default insecure SSL password settings have been deprecated. In order to use the secure alternative of these settings users can use their alternative forms. Specifically, users can append the `_secure` suffix to the SSL settings. The resulting secure alternatives are:

* plugins.security.ssl.http.pemkey_password_secure
* plugins.security.ssl.http.keystore_password_secure
* plugins.security.ssl.http.keystore_keypassword_secure
* plugins.security.ssl.http.truststore_password_secure
* plugins.security.ssl.transport.pemkey_password_secure
* plugins.security.ssl.transport.server.pemkey_password_secure
* plugins.security.ssl.transport.client.pemkey_password_secure
* plugins.security.ssl.transport.keystore_password_secure
* plugins.security.ssl.transport.keystore_keypassword_secure
* plugins.security.ssl.transport.server.keystore_keypassword_secure
* plugins.security.ssl.transport.client.keystore_keypassword_secure
* plugins.security.ssl.transport.truststore_password_secure

These settings allow for the use of encrypted passwords in the settings.
