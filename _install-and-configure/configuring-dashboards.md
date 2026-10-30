---
layout: default
title: Configuring OpenSearch Dashboards
nav_order: 15
---

# Configuring OpenSearch Dashboards

OpenSearch Dashboards reads its settings from the `opensearch_dashboards.yml` configuration file when it starts. The file location depends on how you installed OpenSearch Dashboards.

Installation method | File location
:--- | :---
Docker | `/usr/share/opensearch-dashboards/config/opensearch_dashboards.yml`
Debian or RPM package | `/etc/opensearch-dashboards/opensearch_dashboards.yml`
Tarball or Windows ZIP archive | `config/opensearch_dashboards.yml` in the OpenSearch Dashboards installation directory

After you change `opensearch_dashboards.yml`, restart OpenSearch Dashboards to apply the changes.

Some OpenSearch Dashboards settings can also be changed in the UI without editing `opensearch_dashboards.yml`. For more information, see [Advanced settings]({{site.url}}{{site.baseurl}}/dashboards/management/advanced-settings/).

## Example configuration file

The following `opensearch_dashboards.yml` file configures OpenSearch Dashboards to accept connections on all network interfaces and to connect to an OpenSearch cluster that uses the Security plugin:

```yaml
server.host: "0.0.0.0"
server.port: 5601
opensearch.hosts: ["https://localhost:9200"]
opensearch.username: "kibanaserver"
opensearch.password: "<kibanaserver-password>"
opensearch.ssl.verificationMode: full
opensearch.ssl.certificateAuthorities: ["/etc/opensearch-dashboards/root-ca.pem"]
opensearch.requestHeadersAllowlist: ["authorization", "securitytenant"]
```
{% include copy.html %}

Replace `<kibanaserver-password>` with the password of the `kibanaserver` user and update the certificate authority path to match your environment. For information about the `kibanaserver` user, see [Multi-tenancy configuration]({{site.url}}{{site.baseurl}}/security/multi-tenancy/multi-tenancy-config/#kibana_server-role-details).

For a list of all settings, see the sample [`opensearch_dashboards.yml`](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/config/opensearch_dashboards.yml) file in the OpenSearch Dashboards repository.

## Server settings

The following table lists the settings for the OpenSearch Dashboards server.

Setting | Data type | Description
:--- | :--- | :---
`server.host` | String | The host name or IP address to which the OpenSearch Dashboards server binds. To allow connections from other machines, set this to a non-loopback address or to `0.0.0.0`. Default is `localhost`.
`server.port` | Integer | The port on which OpenSearch Dashboards listens. Default is `5601`.
`server.name` | String | A display name for this OpenSearch Dashboards instance. Default is the machine's host name.
`server.basePath` | String | The path at which OpenSearch Dashboards is served when it runs behind a reverse proxy, for example, `/dashboards`. Must start with a slash (`/`) and must not end with one. Default is empty.
`server.rewriteBasePath` | Boolean | Whether OpenSearch Dashboards removes `server.basePath` from incoming request paths. Set to `false` if your reverse proxy removes the base path before forwarding requests. Default is `false`.

## OpenSearch connection settings

The following table lists the settings that control how OpenSearch Dashboards connects to OpenSearch.

Setting | Data type | Description
:--- | :--- | :---
`opensearch.hosts` | String or array of strings | The URLs of the OpenSearch nodes to which OpenSearch Dashboards sends requests. All nodes must belong to the same cluster. Default is `http://localhost:9200`.
`opensearch.username` | String | The user name that the OpenSearch Dashboards server uses to connect to OpenSearch, for example, to manage its own system index.
`opensearch.password` | String | The password for `opensearch.username`.
`opensearch.requestTimeout` | Integer | The amount of time, in milliseconds, to wait for a response from OpenSearch. Default is `30000` (30 seconds).
`opensearch.pingTimeout` | Integer | The amount of time, in milliseconds, to wait for OpenSearch to respond to a ping. Default is the value of `opensearch.requestTimeout`.
`opensearchDashboards.index` | String | The name of the index in which OpenSearch Dashboards stores saved objects, such as index patterns, visualizations, and dashboards. Default is `.kibana`.

## TLS settings

To encrypt traffic between the browser and OpenSearch Dashboards (`server.ssl.*` settings) or between OpenSearch Dashboards and OpenSearch (`opensearch.ssl.*` settings), see [Configuring TLS for OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/tls/).

## Security plugin settings

The Security plugin for OpenSearch Dashboards uses settings that start with `opensearch_security`. These settings are documented with the features that they configure:

- OpenID Connect (`opensearch_security.openid.*`): See [OpenSearch Dashboards single sign-on]({{site.url}}{{site.baseurl}}/security/authentication-backends/openid-connect/#opensearch-dashboards-single-sign-on).
- SAML (`opensearch_security.saml.*`): See [OpenSearch Dashboards settings]({{site.url}}{{site.baseurl}}/security/authentication-backends/saml/#opensearch-dashboards-settings).
- Multiple authentication types on the sign-in page (`opensearch_security.auth.*`): See [Configuring Dashboards sign-in for multiple authentication options]({{site.url}}{{site.baseurl}}/security/configuration/multi-auth/).
- Multi-tenancy (`opensearch_security.multitenancy.*`): See [Multi-tenancy configuration]({{site.url}}{{site.baseurl}}/security/multi-tenancy/multi-tenancy-config/).

## Logging settings

By default, OpenSearch Dashboards writes logs to standard output. The following table lists the logging settings.

Setting | Data type | Description
:--- | :--- | :---
`logging.dest` | String | Where to write logs. Set to `stdout` or to the path of a log file. Default is `stdout`.
`logging.silent` | Boolean | If `true`, OpenSearch Dashboards writes no logs. Default is `false`.
`logging.quiet` | Boolean | If `true`, OpenSearch Dashboards writes only error messages. Default is `false`.
`logging.verbose` | Boolean | If `true`, OpenSearch Dashboards logs all events, including system usage information and all requests. Default is `false`.

## Language settings

To display the OpenSearch Dashboards interface in a language other than English, set `i18n.locale` to a locale code, for example:

```yaml
i18n.locale: "fr-FR"
```
{% include copy.html %}

The default is `en`. Each available locale has a translation file in the [`src/translations`](https://github.com/opensearch-project/OpenSearch-Dashboards/tree/main/src/translations) directory of the OpenSearch Dashboards repository, named after its locale code. Translations can be incomplete, so some text may still appear in English.

## Related documentation

- [Settings and administration]({{site.url}}{{site.baseurl}}/dashboards/settings-and-administration/)
- [Advanced settings]({{site.url}}{{site.baseurl}}/dashboards/management/advanced-settings/)
