---
layout: default
title: Configuring TLS certificates
parent: Configuration
nav_order: 35
has_children: true
has_toc: false
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
`plugins.security.ssl.transport.pemkey_filepath` | Path to the certificate's key file (PKCS \#8). Relative paths are resolved against the `config` directory. Required.
`plugins.security.ssl.transport.pemkey_password` | The key password. Omit this setting if the key has no password. Optional.
`plugins.security.ssl.transport.pemcert_filepath` | Path to the X.509 node certificate chain (PEM format). Relative paths are resolved against the `config` directory. Required.
`plugins.security.ssl.transport.pemtrustedcas_filepath` | Path to the root certificate authorities (CAs) (PEM format). Relative paths are resolved against the `config` directory. Required.


### REST layer TLS

Name | Description
:--- | :---
`plugins.security.ssl.http.enabled` | Whether to enable TLS on the REST layer. If enabled, only HTTPS is allowed. Optional. Default is `false`.
`plugins.security.ssl.http.pemkey_filepath` | Path to the certificate's key file (PKCS \#8). Relative paths are resolved against the `config` directory. Required.
`plugins.security.ssl.http.pemkey_password` | The key password. Omit this setting if the key has no password. Optional.
`plugins.security.ssl.http.pemcert_filepath` | Path to the X.509 node certificate chain (PEM format). Relative paths are resolved against the `config` directory. Required.
`plugins.security.ssl.http.pemtrustedcas_filepath` | Path to the root CAs (PEM format). Relative paths are resolved against the `config` directory. Required.


## Keystore and truststore files

As an alternative to certificates and private keys in PEM format, you can instead use keystore and truststore files in JKS or PKCS12/PFX format. For the Security plugin to operate, you need certificates and private keys.

The following settings configure the location and password of your keystore and truststore files. If you want, you can use different keystore and truststore files for the REST and the transport layer.


### Transport layer TLS

Name | Description
:--- | :---
`plugins.security.ssl.transport.keystore_type` | The type of the keystore file, `JKS` or `PKCS12/PFX`. Optional. If not set, the type is detected from the file contents.
`plugins.security.ssl.transport.keystore_filepath` | Path to the keystore file. Relative paths are resolved against the `config` directory. Required.
`plugins.security.ssl.transport.keystore_alias` | The alias name of the keystore. Optional. Default is the first alias.
`plugins.security.ssl.transport.keystore_password` | The password for the keystore file. Optional. Default is `changeit`.
`plugins.security.ssl.transport.keystore_keypassword` | The password for the private key in the keystore. If not set, `keystore_password` is used. Optional.
`plugins.security.ssl.transport.truststore_type` | The type of the truststore file, `JKS` or `PKCS12/PFX`. Optional. If not set, the type is detected from the file contents.
`plugins.security.ssl.transport.truststore_filepath` | Path to the truststore file. Relative paths are resolved against the `config` directory. Required.
`plugins.security.ssl.transport.truststore_alias` | The alias name of the truststore. Optional. Default is all certificates.
`plugins.security.ssl.transport.truststore_password` | Truststore password. Default is `changeit`.

### REST layer TLS

Name | Description
:--- | :---
`plugins.security.ssl.http.enabled` | Whether to enable TLS on the REST layer. If enabled, only HTTPS is allowed. Optional. Default is `false`.
`plugins.security.ssl.http.keystore_type` | The type of the keystore file, JKS or PKCS12/PFX. Optional. If not set, the type is detected from the file contents.
`plugins.security.ssl.http.keystore_filepath` | Path to the keystore file. Relative paths are resolved against the `config` directory. Required.
`plugins.security.ssl.http.keystore_alias` | The alias name of the keystore. Optional. Default is the first alias.
`plugins.security.ssl.http.keystore_password` | The password for the keystore file. Optional. Default is `changeit`.
`plugins.security.ssl.http.keystore_keypassword` | The password for the private key in the keystore. If not set, `keystore_password` is used. Optional.
`plugins.security.ssl.http.truststore_type` | The type of the truststore file, JKS or PKCS12/PFX. Optional. If not set, the type is detected from the file contents.
`plugins.security.ssl.http.truststore_filepath` | Path to the truststore file. Relative paths are resolved against the `config` directory. Required.
`plugins.security.ssl.http.truststore_alias` | The alias name of the truststore. Optional. Default is all certificates.
`plugins.security.ssl.http.truststore_password` | The password for the truststore. Default is `changeit`.


## Separate client and server certificates for transport layer TLS

By default, transport layer TLS certificates need to be configured as both the client (`TLS Web Client Authentication`) and server (`TLS Web Server Authentication`) in the certificate's `Extended Key Usage` section because the nodes using the TLS certificates assume the responsibility of serving and receiving the communication requests internally.
If you want to use separate certificates for the client and server, add the `plugins.security.ssl.transport.extended_key_usage_enabled: true` setting to `opensearch.yml`. Next, configure the settings outlined in the [separate client and server X.509 PEM certificates and PKCS #8 keys]({{site.url}}{{site.baseurl}}/security/configuration/tls/#separate-client-and-server-x509-pem-certificates-and-pkcs-8-keys) or [separate client and server keystore and truststore files]({{site.url}}{{site.baseurl}}/security/configuration/tls/#separate-client-and-server-keystore-and-truststore-files) sections.

### Separate client and server X.509 PEM certificates and PKCS #8 keys

Name | Description
:--- | :---
`plugins.security.ssl.transport.server.pemkey_filepath` | The path to the server certificate's key file (PKCS \#8). Relative paths are resolved against the `config` directory. Required.
`plugins.security.ssl.transport.server.pemkey_password` | The server key password. Omit this setting if the key has no password. Optional.
`plugins.security.ssl.transport.server.pemcert_filepath` | The path to the X.509 node server certificate chain (PEM format). Relative paths are resolved against the `config` directory. Required.
`plugins.security.ssl.transport.server.pemtrustedcas_filepath` | The path to the root CAs (PEM format). Relative paths are resolved against the `config` directory. Required.
`plugins.security.ssl.transport.client.pemkey_filepath` | The path to the client certificate's key file (PKCS \#8). Relative paths are resolved against the `config` directory. Required.
`plugins.security.ssl.transport.client.pemkey_password` | The client key password. Omit this setting if the key has no password. Optional.
`plugins.security.ssl.transport.client.pemcert_filepath` | The path to the X.509 node client certificate chain (PEM format). Relative paths are resolved against the `config` directory. Required.
`plugins.security.ssl.transport.client.pemtrustedcas_filepath` | The path to the root CAs (PEM format). Relative paths are resolved against the `config` directory. Required.

### Separate client and server keystore and truststore files

Name | Description
:--- | :---
`plugins.security.ssl.transport.keystore_type` | The type of the keystore file, either `JKS` or `PKCS12/PFX`. Optional. If not set, the type is detected from the file contents.
`plugins.security.ssl.transport.keystore_filepath` | The path to the keystore file. Relative paths are resolved against the `config` directory. Required.
`plugins.security.ssl.transport.keystore_password` | The password for the keystore file. Optional. Default is `changeit`.
`plugins.security.ssl.transport.server.keystore_alias` | The alias name of the server key. Optional. Default is the first alias.
`plugins.security.ssl.transport.client.keystore_alias` | The alias name of the client key. Optional. Default is the first alias.
`plugins.security.ssl.transport.server.keystore_keypassword` | The password for the server's private key in the keystore. If not set, `keystore_password` is used. Optional. Default is `changeit`.
`plugins.security.ssl.transport.client.keystore_keypassword` | The password for the client's private key in the keystore. If not set, `keystore_password` is used. Optional. Default is `changeit`.
`plugins.security.ssl.transport.server.truststore_alias` | The alias name of the server. Optional. Default is all certificates.
`plugins.security.ssl.transport.client.truststore_alias` | The alias name of the client. Optional. Default is all certificates.
`plugins.security.ssl.transport.truststore_filepath` | The path to the `truststore` file. Relative paths are resolved against the `config` directory. Required.
`plugins.security.ssl.transport.truststore_type` | The type of the `truststore` file, either `JKS` or `PKCS12/PFX`. Optional. If not set, the type is detected from the file contents.
`plugins.security.ssl.transport.truststore_password` | The `truststore` password. Default is `changeit`.


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

Super admin certificates are regular client certificates that have elevated rights to perform administrative security tasks. You need an admin certificate to change the Security plugin configuration using [`plugins/opensearch-security/tools/securityadmin.sh`]({{site.url}}{{site.baseurl}}/security/configuration/security-admin/) or the REST API. Super admin certificates are configured in `opensearch.yml` by stating their DN(s):

```yml
plugins.security.authcz.admin_dn:
  - CN=admin,OU=SSL,O=Test,L=Test,C=DE
```

For security reasons, you cannot use wildcards or regular expressions as values for the `admin_dn` setting.

For more information about admin and super admin user roles, see [Admin and super admin roles]({{site.url}}{{site.baseurl}}/security/access-control/users-roles/#admin-and-super-admin-roles).


## (Advanced) Hostname verification and DNS lookup

In addition to verifying the TLS certificates against the root CA and/or intermediate CA(s), the Security plugin can apply additional checks on the transport layer.

With `enforce_hostname_verification` enabled, the Security plugin verifies that the hostname of the communication partner matches the hostname in the certificate. The hostname is taken from the `subject` or `SAN` entries of your certificate. For example, if the hostname of your node is `node-0.example.com`, then the hostname in the TLS certificate has to be set to `node-0.example.com`, as well. Otherwise, the TLS connection between the nodes fails.

In addition, when `resolve_hostname` is enabled, the Security plugin resolves the (verified) hostname against your DNS. If the hostname does not resolve, the connection fails.

You can configure hostname verification and DNS lookup by using the following settings.

Name | Description
:--- | :---
`transport.ssl.enforce_hostname_verification` | Whether to verify hostnames on the transport layer. Optional. Default is `true`.
`transport.ssl.resolve_hostname` | Whether to resolve hostnames using DNS on the transport layer. Optional. Default is `true`. Only works if hostname verification is enabled.


## (Advanced) Client authentication

With TLS client authentication enabled, REST clients can send a TLS certificate with the HTTP request to provide identity information to the Security plugin. There are three main usage scenarios for TLS client authentication:

- Providing an admin certificate when using the REST management API.
- Configuring roles and permissions based on a client certificate.
- Providing identity information for tools like OpenSearch Dashboards, Logstash, or Beats.

TLS client authentication has three modes:

* `NONE`: The Security plugin does not accept TLS client certificates. If one is sent, it is discarded.
* `OPTIONAL`: The Security plugin accepts TLS client certificates if they are sent, but does not require them.
* `REQUIRE`: The Security plugin only accepts REST requests when a valid client TLS certificate is sent.

For the REST management API, the client authentication mode has to be `OPTIONAL` at a minimum.

You can configure the client authentication mode by using the following setting:

Name | Description
:--- | :---
`plugins.security.ssl.http.clientauth_mode` | The TLS client authentication mode to use. Can be one of `NONE`, `OPTIONAL` (default) or `REQUIRE`. Optional.


## (Advanced) Enabled ciphers and protocols

You can limit the allowed ciphers and TLS protocols for the REST and transport layers. For example, you can only allow strong ciphers and limit the TLS versions to the most recent ones.

If you do not configure these settings, the Security plugin uses its built-in list of allowed cipher suites and the `TLSv1.3`, `TLSv1.2`, and `TLSv1.1` protocols. In all cases, the Security plugin uses only the ciphers and protocols that the JVM supports and enables, and it ignores the rest. The JDK bundled with OpenSearch disables `TLSv1` and `TLSv1.1` in its `java.security` file, so these protocols are not used even if you list them. You can configure the ciphers and protocols using the following settings.

Name | Data type | Description
:--- | :--- | :---
`plugins.security.ssl.http.enabled_ciphers` | Array | Enabled TLS cipher suites for the REST layer. Only Java format is supported.
`plugins.security.ssl.http.enabled_protocols` | Array | Enabled TLS protocols for the REST layer. Only Java format is supported.
`plugins.security.ssl.transport.enabled_ciphers` | Array | Enabled TLS cipher suites for the transport layer. Only Java format is supported.
`plugins.security.ssl.transport.enabled_protocols` | Array | Enabled TLS protocols for the transport layer. Only Java format is supported.

### Example settings

The following example allows only TLS 1.3 and TLS 1.2 connections that use AES-256-GCM cipher suites on the REST layer:

```yml
plugins.security.ssl.http.enabled_ciphers:
  - "TLS_AES_256_GCM_SHA384"
  - "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384"
plugins.security.ssl.http.enabled_protocols:
  - "TLSv1.3"
  - "TLSv1.2"
```
{% include copy.html %}

## (Advanced) Client-initiated renegotiation

The Security plugin disables client-initiated TLS renegotiation by default, which helps prevent denial-of-service attacks. To do this, the plugin sets the `jdk.tls.rejectClientInitiatedRenegotiation` JVM system property to `true` when the node starts.

## (Advanced) Using encrypted password settings for SSL

The plain-text SSL password settings in `opensearch.yml` are deprecated. Each of these settings has a secure alternative that has the same name with the `_secure` suffix appended. Store the secure alternatives in the OpenSearch keystore rather than in `opensearch.yml`. For more information, see [OpenSearch keystore]({{site.url}}{{site.baseurl}}/security/configuration/opensearch-keystore/). The secure alternatives are the following:

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

You cannot specify both a plain-text password setting and its secure alternative.

## Hot reloading TLS certificates

Updating expired or nearly expired TLS certificates on the HTTP and transport layers does not require restarting the cluster. Instead, you can enable hot reloading of TLS certificates. When enabled, in-place hot reloading monitors your keystore resources for updates every 5 seconds. If you add or modify a certificate, key file, or keystore file, the nodes in the cluster detect the change and automatically reload the keys and certificates.

To enable in-place hot reloading, add the following line to `opensearch.yml`:

```yml
plugins.security.ssl.certificates_hot_reload.enabled: true
```
{% include copy.html %}

### Using the Reload Certificates API

When not using hot reloading, you can use the Reload Certificates API to reread the replaced certificates. You cannot enable both hot reloading and the Reload Certificates API. If both `plugins.security.ssl.certificates_hot_reload.enabled` and `plugins.security.ssl_cert_reload_enabled` are set to `true`, the node fails to start.

To enable the Reload Certificates API, add the following line to `opensearch.yml`:

```yml
plugins.security.ssl_cert_reload_enabled: true
```
{% include copy.html %}

This setting is `false` by default.
{: .note }

After enabling reloading, use the Reload Certificates API to replace the expired certificates. The new certificates need to be stored in the same location as the previous certificates in order to prevent any changes to the `opensearch.yml` file.

By default, the Reload Certificates API expects the old certificates to be replaced with valid certificates issued with the same `Issuer/Subject DN` and `SAN`. This behavior can be disabled by adding the following settings in `opensearch.yml`:

```yml
plugins.security.ssl.http.enforce_cert_reload_dn_verification: false
plugins.security.ssl.transport.enforce_cert_reload_dn_verification: false
```
{% include copy.html %}


Only a [superadmin]({{site.url}}{{site.baseurl}}/security/configuration/tls/#configuring-admin-certificates) can use the Reload Certificates API.
{: .note }

#### Reload TLS certificates on the transport layer

 The following command reloads TLS certificates on the transport layer using the Reload Certificates API:

```bash
curl --cacert <ca.pem> --cert <admin.pem> --key <admin.key> -XPUT https://localhost:9200/_plugins/_security/api/ssl/transport/reloadcerts
```
{% include copy.html %}

You should receive the following response:

```
{"message":"updated transport certs"}
```

#### Reload TLS certificates on the HTTP layer

The following command reloads TLS certificates on the HTTP layer using the Reload Certificates API:

```bash
curl --cacert <ca.pem> --cert <admin.pem> --key <admin.key> -XPUT https://localhost:9200/_plugins/_security/api/ssl/http/reloadcerts
```
{% include copy.html %}

You should receive the following response:

```
{"message":"updated http certs"}
```

## Configuring TLS certificates for gRPC

You can configure TLS on the optional gRPC transport in `opensearch.yml`. For more information about using the gRPC plugin, see [Enabling gRPC APIs]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/index/#grpc-settings).

### PEM key settings (X.509 PEM certificates and PKCS #8 keys)

The following table lists the available gRPC PEM key settings.

Name | Description
:--- | :---
`plugins.security.ssl.aux.secure-transport-grpc.enabled` | Whether to enable TLS for gRPC. If enabled, only HTTPS is allowed. Optional. Default is `false`.
`plugins.security.ssl.aux.secure-transport-grpc.pemkey_filepath` | The path to the certificate's key file (PKCS #8), specified as a relative path from the `config` directory. The file must reside within the `config` directory. Required.
`plugins.security.ssl.aux.secure-transport-grpc.pemkey_password` | The key password. Omit this setting if the key has no password. Optional.
`plugins.security.ssl.aux.secure-transport-grpc.pemcert_filepath` | The path to the X.509 node certificate chain (in PEM format), specified as a relative path from the `config` directory. The file must reside within the `config` directory. Required.
`plugins.security.ssl.aux.secure-transport-grpc.pemtrustedcas_filepath` | The path to the root CAs (in PEM format), specified as a relative path from the `config` directory. The file must reside within the `config` directory. Required.

### Keystore and truststore

The following table lists the available gRPC keystore and truststore settings.

Name | Description
:--- | :---
`plugins.security.ssl.aux.secure-transport-grpc.enabled` | Whether to enable TLS for gRPC. If enabled, only HTTPS is allowed. Optional. Default is `false`.
`plugins.security.ssl.aux.secure-transport-grpc.keystore_type` | The type of the keystore file, JKS or PKCS12/PFX. Optional. Default is JKS.
`plugins.security.ssl.aux.secure-transport-grpc.keystore_filepath` | The path to the keystore file, specified as a relative path from the `config` directory. The file must reside within the `config` directory. Required.
`plugins.security.ssl.aux.secure-transport-grpc.keystore_alias` | The alias of the key pair to use from the provided keystore. Optional. Defaults to the first key pair added to the keystore.
`plugins.security.ssl.aux.secure-transport-grpc.keystore_password` | The password for the keystore. Default is `changeit`.
`plugins.security.ssl.aux.secure-transport-grpc.truststore_type` | The type of the truststore file, JKS or PKCS12/PFX. Default is JKS.
`plugins.security.ssl.aux.secure-transport-grpc.truststore_filepath` | The path to the truststore file, specified as a relative path from the `config` directory. The file must reside within the `config` directory. Required.
`plugins.security.ssl.aux.secure-transport-grpc.truststore_alias` | The alias of the certificate to use from the provided truststore. Optional. Default is all certificates.
`plugins.security.ssl.aux.secure-transport-grpc.truststore_password` | The password for the truststore. Default is `changeit`.

## Troubleshooting

- For solutions to common TLS configuration issues, see [Troubleshooting TLS]({{site.url}}{{site.baseurl}}/security/configuration/troubleshoot-tls/).
