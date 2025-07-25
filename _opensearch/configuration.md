---
layout: default
title: Configuration
nav_order: 5
canonical_url: https://docs.opensearch.org/latest/install-and-configure/configuring-opensearch/index/
---

# OpenSearch configuration

Most OpenSearch configuration can take place in the cluster settings API. Certain operations require you to modify `opensearch.yml` and restart the cluster.

Whenever possible, use the cluster settings API instead; `opensearch.yml` is local to each node, whereas the API applies the setting to all nodes in the cluster. Certain settings, however, require `opensearch.yml`. In general, these settings relate to networking, cluster formation, and the local file system. To learn more, see [Cluster formation]({{site.url}}{{site.baseurl}}/opensearch/cluster/).


## Update cluster settings using the API

The first step in changing a setting is to view the current settings:

```
GET _cluster/settings?include_defaults=true
```

For a more concise summary of non-default settings:

```
GET _cluster/settings
```

Three categories of setting exist in the cluster settings API: persistent, transient, and default. Persistent settings, well, persist after a cluster restart. After a restart, OpenSearch clears transient settings.

If you specify the same setting in multiple places, OpenSearch uses the following precedence:

1. Transient settings
2. Persistent settings
3. Settings from `opensearch.yml`
4. Default settings

To change a setting, just specify the new one as either persistent or transient. This example shows the flat settings form:

```json
PUT _cluster/settings
{
  "persistent" : {
    "action.auto_create_index" : false
  }
}
```

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


---

## Configuration file

You can find `opensearch.yml` in `/usr/share/opensearch/config/opensearch.yml` (Docker) or `/etc/opensearch/opensearch.yml` (most Linux distributions) on each node.

You don't mark settings in `opensearch.yml` as persistent or transient, and settings use the flat form:

```yml
cluster.name: my-application
action.auto_create_index: true
compatibility.override_main_response_version: true
```

The demo configuration includes a number of settings for the security plugin that you should modify before using OpenSearch for a production workload. To learn more, see [Security]({{site.url}}{{site.baseurl}}/security-plugin/).
