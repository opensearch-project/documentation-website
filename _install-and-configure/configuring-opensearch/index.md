---
layout: default
title: Configuring OpenSearch
nav_order: 10
has_children: true
has_toc: false
redirect_from:
  - /opensearch/configuration/
  - /install-and-configure/configuring-opensearch/
---

# Configuring OpenSearch

Each OpenSearch setting is either a cluster setting or an index setting. Cluster settings apply to the whole cluster or to individual nodes. Index settings apply to a single index, and their names begin with `index.`. The settings pages in this section list cluster settings grouped by area, such as networking, security, and thread pools. For information about index settings, see [Index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/).

Settings are also either [static](#static-settings) or [dynamic](#dynamic-settings). Whether a setting is static or dynamic determines whether you can change it while OpenSearch is running.

The following table lists the ways in which you can specify cluster settings.

| Method | Setting types | Applies to | Changes take effect |
|:---|:---|:---|:---|
| [Configuration file](#configuration-file) (`opensearch.yml`) | Static and dynamic | The node | When the node starts |
| [Startup options](#specifying-configuration-settings-at-startup) (command-line flags or environment variables) | Static and dynamic | The node | When the node starts |
| [Cluster Settings API](#updating-cluster-settings-using-the-api) | Dynamic only | The whole cluster | Immediately |

If you specify a cluster setting using more than one method, OpenSearch determines the value to use based on [setting precedence](#setting-precedence).

## Static settings

Static settings are settings that you cannot update while the cluster is running. To change a static setting, update it in `opensearch.yml` or using a startup flag on each node and then restart the node. In general, static settings relate to networking, cluster formation, and the local file system. For more information, see [Creating a cluster]({{site.url}}{{site.baseurl}}/tuning-your-cluster/).

## Dynamic settings

Dynamic settings are settings that you can update while the cluster is running. You can specify dynamic settings using any of the methods on this page, including the Cluster Settings API. For more information, see [Updating cluster settings using the API](#updating-cluster-settings-using-the-api).

We recommend using the Cluster Settings API for cluster-wide dynamic settings. Settings updated using the API apply to all nodes, which keeps the configuration consistent across the cluster and makes configuration changes easier to track.
{: .tip}

## Configuration file

You can find `opensearch.yml` in `/usr/share/opensearch/config/opensearch.yml` (Docker) or `/etc/opensearch/opensearch.yml` (most Linux distributions) on each node.

To change the configuration directory location, set the `OPENSEARCH_PATH_CONF` environment variable, for example, `OPENSEARCH_PATH_CONF=/etc/opensearch`. This variable is sourced from `/etc/default/opensearch` (Debian package) and `/etc/sysconfig/opensearch` (RPM package).

If you set a custom `OPENSEARCH_PATH_CONF` variable, other default environment variables are not loaded.

Settings in `opensearch.yml` are not marked as persistent or transient. The following example uses the flat form:

```yml
cluster.name: my-application
action.auto_create_index: true
compatibility.override_main_response_version: true
```

The demo configuration includes several [settings for the Security plugin]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/) that you should modify before using OpenSearch for a production workload. To learn more, see [Security]({{site.url}}{{site.baseurl}}/security/).

### (Optional) CORS header configuration

If you are working on a client application running against an OpenSearch cluster on a different domain, you can configure headers in `opensearch.yml` to allow for developing a local application on the same machine. Use [Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) so that your application can make calls to the OpenSearch API running locally. Add the following lines to `opensearch.yml`:

```yml
http.host: 0.0.0.0
http.port: 9200
http.cors.allow-origin: "http://localhost"
http.cors.enabled: true
http.cors.allow-headers: X-Requested-With,X-Auth-Token,Content-Type,Content-Length,Authorization
http.cors.allow-credentials: true
```
{% include copy.html %}

## Specifying configuration settings at startup

When you start OpenSearch, you can specify settings using command-line flags or environment variables. These settings apply only to the node that you start.

### Command-line flags

To pass a setting directly to OpenSearch at startup, use the `-E` flag:

```bash
./opensearch -Ecluster.name=opensearch-cluster -Enode.name=opensearch-node1 -Ehttp.host=0.0.0.0 -Ediscovery.type=single-node
```
{% include copy.html %}

### Environment variables

OpenSearch reads environment variables that configure the startup process, such as `OPENSEARCH_JAVA_OPTS` for JVM options and `OPENSEARCH_PATH_CONF` for the configuration directory location.

To specify OpenSearch settings using environment variables, define a custom environment variable and reference it in `opensearch.yml` using the `${ENV_VAR}` syntax:

```yml
node.name: ${NODE_NAME}
cluster.name: ${CLUSTER_NAME}
```
{% include copy.html %}

You can set environment variables in the shell, in a `systemd` service file, or in a Docker container.

#### Shell

To set environment variables in a shell, export them before starting OpenSearch. Run the following commands in the same shell session.

To set the JVM heap size, export the `OPENSEARCH_JAVA_OPTS` variable:

```bash
export OPENSEARCH_JAVA_OPTS="-Xms2g -Xmx2g"
```
{% include copy.html %}

To set the configuration directory location, export the `OPENSEARCH_PATH_CONF` variable:

```bash
export OPENSEARCH_PATH_CONF="/etc/opensearch"
```
{% include copy.html %}

Then start OpenSearch:

```bash
./opensearch
```
{% include copy.html %}

Do not export OpenSearch settings directly, for example, `export discovery.type=single-node`. Setting names contain dots, which most shells do not accept in variable names. To pass a setting directly at startup, use the `-E` flag. For more information, see [Command-line flags](#command-line-flags).

<!-- vale off -->
#### systemd service file
<!-- vale on -->

When running OpenSearch as a service managed by `systemd`, you can specify environment variables in a service override file. The following example `/etc/systemd/system/opensearch.service.d/override.conf` file sets two environment variables:

```ini
[Service]
Environment="OPENSEARCH_JAVA_OPTS=-Xms2g -Xmx2g"
Environment="OPENSEARCH_PATH_CONF=/etc/opensearch"
```
{% include copy.html %}

After creating or modifying the file, reload the `systemd` configuration:

```bash
sudo systemctl daemon-reload
```
{% include copy.html %}

Then restart the OpenSearch service:

```bash
sudo systemctl restart opensearch
```
{% include copy.html %}

#### Docker

When running OpenSearch in Docker, you can specify environment variables using the `-e` option of the `docker run` command, as shown in the following example:

```bash
docker run -e "OPENSEARCH_JAVA_OPTS=-Xms2g -Xmx2g" -e "OPENSEARCH_PATH_CONF=/usr/share/opensearch/config" opensearchproject/opensearch:latest
```
{% include copy.html %}

Docker accepts environment variable names that contain dots, so you can pass OpenSearch settings directly using the `-e` option. The OpenSearch Docker image converts each environment variable whose name has the form of a setting into an `-E` flag. A name has the form of a setting if it begins with at least two dot-separated parts containing lowercase letters, digits, or underscores, for example, `discovery.type`. The `processors` setting is also converted. The following command passes two settings as environment variables:

```bash
docker run -e "discovery.type=single-node" -e "cluster.name=my-cluster" opensearchproject/opensearch:latest
```
{% include copy.html %}

The image skips environment variables that have an empty value, so you cannot use an empty variable to clear a value set in `opensearch.yml`. To set a list setting to an empty list, use `[]`, for example, `-e "node.roles=[]"`.

## Updating cluster settings using the API

Using the [Cluster Settings API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/), you can update dynamic settings for the whole cluster while it is running. You can update a setting as either _persistent_ or _transient_. Persistent settings are written to the cluster state and persist after a cluster restart. After a restart, OpenSearch clears transient settings. Transient settings take precedence over persistent settings. For more information, see [Setting precedence](#setting-precedence).

Before changing a setting, view the current settings by sending the following request:

```json
GET _cluster/settings?include_defaults=true
```
{% include copy-curl.html %}

For a more concise summary of non-default settings, send the following request:

```json
GET _cluster/settings
```
{% include copy-curl.html %}

To change a setting, specify the new value as either persistent or transient. The following example shows the flat settings form:

```json
PUT _cluster/settings
{
  "persistent" : {
    "action.auto_create_index" : false
  }
}
```
{% include copy-curl.html %}

You can also use the expanded form, which lets you copy and paste from the GET response and change existing values:

```json
PUT _cluster/settings
{
  "persistent": {
    "action": {
      "auto_create_index": false
    }
  }
}
```
{% include copy-curl.html %}

## Setting precedence

If you specify a setting in more than one place, OpenSearch uses the value from the source that appears first in the following list:

1. Transient cluster settings, specified using the Cluster Settings API
2. Persistent cluster settings, specified using the Cluster Settings API
3. Settings passed using the `-E` flag at startup
4. Values in `opensearch.yml`, including values supplied by `${ENV_VAR}` references
5. Default setting values

OpenSearch reads `opensearch.yml`, applies the `-E` flags, and then resolves any `${ENV_VAR}` references. Thus, an `-E` flag overrides the value in `opensearch.yml`, including a value supplied by an environment variable.

Transient and persistent cluster settings apply only to dynamic settings. For static settings, precedence starts with the `-E` flag.

When you send a `GET _cluster/settings?include_defaults=true` request, the `defaults` object in the response contains values specified in `opensearch.yml` and using the `-E` flag in addition to built-in default values. The response does not indicate the source of each value.

## Resetting settings

To reset a setting that you updated using the Cluster Settings API, assign it a `null` value. OpenSearch then applies the value from the next available source in the [precedence order](#setting-precedence). For example, when you reset a transient setting, OpenSearch applies the persistent value if one exists. The following request resets a transient setting:

```json
PUT _cluster/settings
{
  "transient": {
    "action.auto_create_index": null
  }
}
```
{% include copy-curl.html %}

You can also use wildcards to reset multiple related settings at once:

```json
PUT _cluster/settings
{
  "persistent": {
    "indices.recovery.*": null
  }
}
```
{% include copy-curl.html %}

### Restoring the default value

A reset setting returns to its default value only if no other source specifies it. To restore the default value, remove the setting from every source:

1. Reset both the transient and persistent values using the Cluster Settings API:

    ```json
    PUT _cluster/settings
    {
      "transient": {
        "action.auto_create_index": null
      },
      "persistent": {
        "action.auto_create_index": null
      }
    }
    ```
    {% include copy-curl.html %}

1. On each node, remove the setting from `opensearch.yml` and from any `-E` flags that specify it, including Docker environment variables that OpenSearch converts to `-E` flags. If `opensearch.yml` references an environment variable for the setting, remove the reference.
1. Restart each node that you changed in the previous step.

If the setting is not specified in `opensearch.yml` or at startup, the first step is sufficient and no restart is required.

## Settings reference

The following pages list cluster settings grouped by area:

- [Configuration and system settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/configuration-system/)
- [Network settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/network-settings/)
- [Discovery and gateway settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/discovery-gateway-settings/)
- [Security settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/)
- [Cluster management settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/cluster-settings/)
- [Cluster settings for indexes]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/cluster-settings-for-indexes/)
- [Cache settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/cache-settings/)
- [Search settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/search-settings/)
- [Monitoring settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/monitoring-settings/)
- [Availability and recovery settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/availability-recovery/)
- [Thread pool settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/thread-pool-settings/)
- [Circuit breaker settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/circuit-breaker/)
- [Admission control settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/admission-control-settings/)
- [Plugin settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/plugin-settings/)
- [Ingest settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/ingest-settings/)
- [Script and resource settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/script-and-resource-settings/)

The following page lists settings that apply to individual indexes:

- [Index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/)

The following pages describe other configuration options:

- [Experimental feature flags]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/experimental/)
- [Logs]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/logs/)

## Related documentation

To learn how to view and update cluster settings, see [Cluster Settings API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/).
