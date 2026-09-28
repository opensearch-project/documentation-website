---
layout: default
title: Configuring OpenSearch
nav_order: 10
has_children: true
redirect_from:
  - /opensearch/configuration/
  - /install-and-configure/configuring-opensearch/
---

# Configuring OpenSearch

This page describes how to specify cluster and node settings. For settings that apply to individual indexes, see [Index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/).

You can specify settings in the following ways:

- In the [configuration file](#configuration-file), `opensearch.yml`, on each node
- [At startup](#specifying-configuration-settings-at-startup), using command-line flags or environment variables
- Using the [Cluster Settings API](#updating-cluster-settings-using-the-api) while the cluster is running

The methods you can use depend on whether a setting is [dynamic](#dynamic-settings) or [static](#static-settings). If you specify a setting using more than one method, OpenSearch determines which value to use based on [setting precedence](#setting-precedence).

## Dynamic settings

Dynamic settings are settings that you can update while the cluster is running. You can specify dynamic settings using any of the methods on this page, including the Cluster Settings API. For more information, see [Updating cluster settings using the API](#updating-cluster-settings-using-the-api).

Use the Cluster Settings API for all cluster-wide dynamic settings. Settings updated using the API apply to all nodes, which keeps the configuration consistent across the cluster and makes configuration changes easier to track.
{: .tip}

## Static settings

Static settings are settings that you can specify only in `opensearch.yml` or at startup. To change a static setting, update it on each node and then restart the node. In general, static settings relate to networking, cluster formation, and the local file system. For more information, see [Creating a cluster]({{site.url}}{{site.baseurl}}/tuning-your-cluster/).

## Configuration file

You can find `opensearch.yml` in `/usr/share/opensearch/config/opensearch.yml` (Docker) or `/etc/opensearch/opensearch.yml` (most Linux distributions) on each node.

To change the configuration directory location, set the `OPENSEARCH_PATH_CONF` environment variable, for example, `OPENSEARCH_PATH_CONF=/etc/opensearch`. This variable is sourced from `/etc/default/opensearch` (Debian package) and `/etc/sysconfig/opensearch` (RPM package).

If you set a custom `OPENSEARCH_PATH_CONF` variable, other default environment variables are not loaded.

Settings in `opensearch.yml` are not marked as persistent or transient and use the flat form:

```yml
cluster.name: my-application
action.auto_create_index: true
compatibility.override_main_response_version: true
```

The demo configuration includes a number of [settings for the Security plugin]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/) that you should modify before using OpenSearch for a production workload. To learn more, see [Security]({{site.url}}{{site.baseurl}}/security/).

### (Optional) CORS header configuration

If you are working on a client application running against an OpenSearch cluster on a different domain, you can configure headers in `opensearch.yml` to allow for developing a local application on the same machine. Use [Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) so that your application can make calls to the OpenSearch API running locally. Add the following lines in your `custom-opensearch.yml` file:

```yml
http.host: 0.0.0.0
http.port: 9200
http.cors.allow-origin: "http://localhost"
http.cors.enabled: true
http.cors.allow-headers: X-Requested-With,X-Auth-Token,Content-Type,Content-Length,Authorization
http.cors.allow-credentials: true
```

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

To set environment variables in a shell, export them before starting OpenSearch:

```bash
export OPENSEARCH_JAVA_OPTS="-Xms2g -Xmx2g"
export OPENSEARCH_PATH_CONF="/etc/opensearch"
./opensearch
```
{% include copy.html %}

Do not export OpenSearch settings directly, for example, `export discovery.type=single-node`. Setting names contain dots, which most shells do not accept in variable names. To pass a setting directly at startup, use the `-E` flag. For more information, see [Command-line flags](#command-line-flags).

<!-- vale off -->
#### systemd service file
<!-- vale on -->

When running OpenSearch as a service managed by `systemd`, you can specify environment variables in the service file, as shown in the following example:

```bash
# /etc/systemd/system/opensearch.service.d/override.conf
[Service]
Environment="OPENSEARCH_JAVA_OPTS=-Xms2g -Xmx2g"
Environment="OPENSEARCH_PATH_CONF=/etc/opensearch"
```

After creating or modifying the file, reload the `systemd` configuration and restart the service using the following command:

```bash
sudo systemctl daemon-reload
sudo systemctl restart opensearch
```
{% include copy.html %}

#### Docker

When running OpenSearch in Docker, you can specify environment variables using the `-e` option of the `docker run` command, as shown in the following command:

```bash
docker run -e "OPENSEARCH_JAVA_OPTS=-Xms2g -Xmx2g" -e "OPENSEARCH_PATH_CONF=/usr/share/opensearch/config" opensearchproject/opensearch:latest
```
{% include copy.html %}

Docker accepts environment variable names that contain dots, so you can pass OpenSearch settings directly using the `-e` option. The OpenSearch Docker image converts each environment variable whose name has the form of a setting into an `-E` flag. A name has the form of a setting if it consists of at least two dot-separated parts containing lowercase letters, digits, or underscores, for example, `discovery.type`. The `processors` setting is also converted. The following command passes two settings as environment variables:

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
4. Environment variables referenced in `opensearch.yml` using the `${ENV_VAR}` syntax
5. Values specified directly in `opensearch.yml`
6. Default setting values

OpenSearch reads `opensearch.yml`, resolving any `${ENV_VAR}` references, and then applies the `-E` flags. Thus, an `-E` flag overrides the value in `opensearch.yml`, including a value supplied by an environment variable.

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

## Related documentation

- [Cluster Settings API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-settings/)
