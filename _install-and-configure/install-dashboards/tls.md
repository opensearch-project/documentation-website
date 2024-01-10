---
layout: default
title: Configure TLS
parent: Installing OpenSearch Dashboards
nav_order: 40
redirect_from:
  - /dashboards/install/tls/
---

# Configure TLS for OpenSearch Dashboards

By default, for ease of testing and getting started, OpenSearch Dashboards runs over HTTP. To enable TLS for HTTPS, update the following settings in `opensearch_dashboards.yml`.

Setting | Description
:--- | :---
`server.ssl.enabled` | Enables SSL communication between the OpenSearch Dashboards server and the user's web browser. Set to `true` for HTTPS or `false` for HTTP.
`server.ssl.supportedProtocols` | Specifies the array of supported TLS protocols. Possible values are `TLSv1`, `TLSv1.1`, and `TLSv1.2`, `TLSv1.3`. Default is `['TLSv1.1', 'TLSv1.2', and 'TLSv1.3']`.
`server.ssl.cipherSuites` | Specifies the array of TLS cipher suites. Optional.
`server.ssl.certificate` | If `server.ssl.enabled` is set to `true`, specifies the full path to a valid Privacy Enhanced Mail (PEM) server certificate for OpenSearch Dashboards. You can [generate your own certificate]({{site.url}}{{site.baseurl}}/security/configuration/generate-certificates/) or get one from a certificate authority (CA).
`server.ssl.key` | If `server.ssl.enabled` is set to `true`, specifies the full path to the key for your server certificate, for example, `/usr/share/opensearch-dashboards-1.0.0/config/my-client-cert-key.pem`. You can [generate your own certificate]({{site.url}}{{site.baseurl}}/security/configuration/generate-certificates/) or get one from a CA.
`server.ssl.keyPassphrase` | Sets the password for the key. Omit this setting if the key has no password. Optional.
`server.ssl.keystore.path` | Uses a JKS (Java KeyStore) or PKCS12/PFX (Public-Key Cryptography Standards) file instead of a PEM certificate and key.
`server.ssl.keystore.password` | Sets the password for the key store. Required.
`server.ssl.clientAuthentication` | Specifies the TLS client authentication mode to use. Can be one of the following: `none`, `optional`, or `required`. If set to `required`, your web browser needs to send a valid client certificate signed by the CA configured in `server.ssl.certificateAuthorities`. Default is `none`.
`server.ssl.certificateAuthorities` | Specifies the full path to one or more CA certificates in an array that issues the certificate used for client authentication. Required if `server.ssl.clientAuthentication` is set to `optional` or `required`.
`server.ssl.truststore.path` | Uses a JKS or PKCS12/PFX trust store file instead of PEM CA certificates.
`server.ssl.truststore.password` | Sets the password for the trust store. Required.
`opensearch.ssl.verificationMode` | Establishes communication between OpenSearch and OpenSearch Dashboards. Valid values are `full`, `certificate`, or `none`. `full` is recommended if TLS is enabled, which enables hostname verification. `certificate` checks the certificate but not the hostname. `none` performs no checks (suitable for HTTP). Default is `full`.
`opensearch.ssl.certificateAuthorities` | If `opensearch.ssl.verificationMode` is set to `full` or `certificate`, specifies the full path to one or more CA certificates in an array that comprises a trusted chain for an OpenSearch cluster. For example, you might need to include a root CA _and_ an intermediate CA if you used the intermediate CA to issue your admin, client, and node certificates.
`opensearch.ssl.truststore.path` | Uses a JKS or PKCS12/PFX trust store file instead of PEM CA certificates.
`opensearch.ssl.truststore.password` | Sets the password for the trust store. Required.
`opensearch.ssl.alwaysPresentCertificate` | Sends the client certificate to the OpenSearch cluster if set to `true`, which is necessary when mTLS is enabled in OpenSearch. Default is `false`.
`opensearch.ssl.certificate` | If `opensearch.ssl.alwaysPresentCertificate` is set to `true`, specifies the full path to a valid client certificate for the OpenSearch cluster. You can [generate your own certificate]({{site.url}}{{site.baseurl}}/security/configuration/generate-certificates/) or get one from a CA.
`opensearch.ssl.key` | If `opensearch.ssl.alwaysPresentCertificate` is set to `true`, specifies the full path to the key for the client certificate. You can [generate your own certificate]({{site.url}}{{site.baseurl}}/security/configuration/generate-certificates/) or get one from a CA.
`opensearch.ssl.keyPassphrase` | Sets the password for the key. Omit this setting if the key has no password. Optional.
`opensearch.ssl.keystore.path` | Uses a JKS or PKCS12/PFX key store file instead of a PEM certificate and key.
`opensearch.ssl.keystore.password` | Sets the password for the key store. Required.
`opensearch_security.cookie.secure` | If TLS is enabled for OpenSearch Dashboards, change the setting to `true`. For HTTP, set it to `false`.

The following `opensearch_dashboards.yml` configuration shows OpenSearch and OpenSearch Dashboards running on the same machine with the demo configuration:

```yml
server.ssl.enabled: true
server.ssl.certificate: /usr/share/opensearch-dashboards/config/client-cert.pem
server.ssl.key: /usr/share/opensearch-dashboards/config/client-cert-key.pem
opensearch.hosts: ["https://localhost:9200"]
opensearch.ssl.verificationMode: full
opensearch.ssl.certificateAuthorities: [ "/usr/share/opensearch-dashboards/config/root-ca.pem", "/usr/share/opensearch-dashboards/config/intermediate-ca.pem" ]
opensearch.username: "kibanaserver"
opensearch.password: "kibanaserver"
opensearch.requestHeadersAllowlist: [ authorization,securitytenant ]
opensearch_security.multitenancy.enabled: true
opensearch_security.multitenancy.tenants.preferred: ["Private", "Global"]
opensearch_security.readonly_mode.roles: ["kibana_read_only"]
opensearch_security.cookie.secure: true
```

If you use the Docker install option, you can pass a custom `opensearch_dashboards.yml` file to the container. To learn more, see the [Docker installation page]({{site.url}}{{site.baseurl}}/opensearch/install/docker/).

You can connect to OpenSearch Dashboards at `https://localhost:5601` after enabling these settings and starting the application. You might need to acknowledge a browser warning if your certificates are self-signed. To avoid this type of warning (or outright browser incompatibility), it is best practice to use certificates from a trusted CA.
