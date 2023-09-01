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
opensearch.ssl.verificationMode | This setting is for communications between OpenSearch and OpenSearch Dashboards. Valid values are `full`, `certificate`, or `none`. We recommend `full` if you enable TLS, which enables hostname verification. `certificate` just checks the certificate, not the hostname, and `none` performs no checks (suitable for HTTP). Default is `full`.
opensearch.ssl.certificateAuthorities | If `opensearch.ssl.verificationMode` is `full` or `certificate`, specify the full path to one or more CA certificates that comprise a trusted chain for your OpenSearch cluster. For example, you might need to include a root CA _and_ an intermediate CA if you used the intermediate CA to issue your admin, client, and node certificates.
server.ssl.enabled | This setting is for communications between OpenSearch Dashboards and the web browser. Set to true for HTTPS, false for HTTP.
server.ssl.certificate | If `server.ssl.enabled` is true, specify the full path to a valid client certificate for your OpenSearch cluster. You can [generate your own]({{site.url}}{{site.baseurl}}/security/configuration/generate-certificates/) or get one from a certificate authority.
server.ssl.key | If `server.ssl.enabled` is true, specify the full path (e.g. `/usr/share/opensearch-dashboards-1.0.0/config/my-client-cert-key.pem` to the key for your client certificate. You can [generate your own]({{site.url}}{{site.baseurl}}/security/configuration/generate-certificates/) or get one from a certificate authority.
server.ssl.certificateAuthorities | This setting adds the SSL certificate authority which issues SSL certificates for the Dashboard's server in a list format. 
opensearch.ssl.certificateAuthorities | This setting adds the SSL certificate authority for OpenSearch.
opensearch_security.cookie.secure | If you enable TLS for OpenSearch Dashboards, change this setting to `true`. For HTTP, set it to `false`.

This `opensearch_dashboards.yml` configuration shows OpenSearch and OpenSearch Dashboards running on the same machine with the demo configuration:

```yml
opensearch.hosts: ["https://localhost:9200"]
opensearch.ssl.verificationMode: full
opensearch.username: "kibanaserver"
opensearch.password: "kibanaserver"
opensearch.requestHeadersAllowlist: [ authorization,securitytenant ]
server.ssl.enabled: true
server.ssl.certificate: /usr/share/opensearch-dashboards/config/client-cert.pem
server.ssl.key: /usr/share/opensearch-dashboards/config/client-cert-key.pem
server.ssl.certificateAuthorities: [ "/usr/share/opensearch-dashboards/config/root-ca.pem", "/usr/share/opensearch-dashboards/config/intermediate-ca.pem" ]
opensearch.ssl.certificateAuthorities: [ "/usr/share/opensearch-dashboards/config/root-ca.pem", "/usr/share/opensearch-dashboards/config/intermediate-ca.pem" ]
opensearch_security.multitenancy.enabled: true
opensearch_security.multitenancy.tenants.preferred: ["Private", "Global"]
opensearch_security.readonly_mode.roles: ["kibana_read_only"]
opensearch_security.cookie.secure: true
```

If you use the Docker install, you can pass a custom `opensearch_dashboards.yml` to the container. To learn more, see the [Docker installation page]({{site.url}}{{site.baseurl}}/opensearch/install/docker/).

After enabling these settings and starting OpenSearch Dashboards, you can connect to it at `https://localhost:5601`. You might have to acknowledge a browser warning if your certificates are self-signed. To avoid this sort of warning (or outright browser incompatibility), best practice is to use certificates from trusted certificate authority.
