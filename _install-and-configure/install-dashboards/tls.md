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
server.ssl.enabled | This setting enables SSL communication between OpenSearch Dashboards server and the user's web browser. Set to `true` for HTTPS or `false` for HTTP.
server.ssl.supportedProtocols | Specific the array of supported TLS protocols. Possible values are `TLSv1`, `TLSv1.1`, `TLSv1.2`, `TLSv1.3`. Default is `['TLSv1.1', 'TLSv1.2', 'TLSv1.3']`.
server.ssl.cipherSuites | Specific the array of TLS cipher suites. Optional.
server.ssl.certificate | If `server.ssl.enabled` is set to `true`, specify the full path to a valid PEM server certificate for OpenSearch Dashboards. You can [generate your own certificate]({{site.url}}{{site.baseurl}}/security/configuration/generate-certificates/) or get one from a certificate authority.
server.ssl.key | If `server.ssl.enabled` is set to `true`, specify the full path, for example, `/usr/share/opensearch-dashboards-1.0.0/config/my-client-cert-key.pem`, to the key for your server certificate. You can [generate your own certificate]({{site.url}}{{site.baseurl}}/security/configuration/generate-certificates/) or get one from a certificate authority.
server.ssl.keyPassphrase | Password for the above key. Omit this setting if the key has no password. Optional.
server.ssl.keystore.path | Use JKS or PKCS12/PFX keystore file instead of PEM certificate and key.
server.ssl.keystore.password | Password for the above keystore. Required.
server.ssl.clientAuthentication | TLS client authentication mode to use. Can be one of `none`, `optional` or `required`. The user's web browser needs to send a valid client certificate signed by CA configured in `server.ssl.certificateAuthorities` if set to `required`. Default is `none`.
server.ssl.certificateAuthorities | Specify the full path to one or more CA certificates in an array who issues the certificate used for client authentication. Required if `server.ssl.clientAuthentication` is set to `optional` or `required`.
server.ssl.truststore.path | Use JKS or PKCS12/PFX truststore file instead of PEM CA certificates.
server.ssl.truststore.password | Password for the above truststore. Required.
opensearch.ssl.verificationMode | This setting is for communications between OpenSearch and OpenSearch Dashboards. Valid values are `full`, `certificate`, or `none`. We recommend `full` if you enable TLS, which enables hostname verification. `certificate` just checks the certificate, not the hostname, and `none` performs no checks (suitable for HTTP). Default is `full`.
opensearch.ssl.certificateAuthorities | If `opensearch.ssl.verificationMode` is `full` or `certificate`, specify the full path to one or more CA certificates in an array that comprise a trusted chain for your OpenSearch cluster. For example, you might need to include a root CA _and_ an intermediate CA if you used the intermediate CA to issue your admin, client, and node certificates.
opensearch.ssl.truststore.path | Use JKS or PKCS12/PFX truststore file instead of PEM CA certificates.
opensearch.ssl.truststore.password | Password for the above truststore. Required.
opensearch.ssl.alwaysPresentCertificate | Set to `true` to send the client certificate to the OpenSearch cluster. This is necessary when mTLS is enabled in OpenSearch. Default is `false`.
opensearch.ssl.certificate | If `opensearch.ssl.alwaysPresentCertificate` is set to `true`, specify the full path to a valid client certificate for the OpenSearch cluster. You can [generate your own certificate]({{site.url}}{{site.baseurl}}/security/configuration/generate-certificates/) or get one from a certificate authority.
opensearch.ssl.key | If `opensearch.ssl.alwaysPresentCertificate` is set to `true`, specify the full path to the key for your client certificate. You can [generate your own certificate]({{site.url}}{{site.baseurl}}/security/configuration/generate-certificates/) or get one from a certificate authority.
opensearch.ssl.keyPassphrase | Password for the above key. Omit this setting if the key has no password. Optional.
opensearch.ssl.keystore.path | Use JKS or PKCS12/PFX keystore file instead of PEM certificate and key.
opensearch.ssl.keystore.password | Password for the above keystore. Required.
opensearch_security.cookie.secure | If you enable TLS for OpenSearch Dashboards, change this setting to `true`. For HTTP, set it to `false`.

This `opensearch_dashboards.yml` configuration shows OpenSearch and OpenSearch Dashboards running on the same machine with the demo configuration:

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

If you use the Docker install, you can pass a custom `opensearch_dashboards.yml` to the container. To learn more, see the [Docker installation page]({{site.url}}{{site.baseurl}}/opensearch/install/docker/).

After enabling these settings and starting OpenSearch Dashboards, you can connect to it at `https://localhost:5601`. You might have to acknowledge a browser warning if your certificates are self-signed. To avoid this sort of warning (or outright browser incompatibility), best practice is to use certificates from trusted certificate authority.
