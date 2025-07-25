---
layout: default
title: Cluster settings
parent: REST API reference
nav_order: 20
canonical_url: https://docs.opensearch.org/latest/api-reference/cluster-api/cluster-settings/
---

# Cluster settings
Introduced 1.0
{: .label .label-purple }

The cluster settings operation lets you check the current settings for your cluster, review default settings, and change settings. When you update a setting using the API, OpenSearch applies it to all nodes in the cluster.


## Examples

```json
GET _cluster/settings?include_defaults=true
```

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


## Path and HTTP methods

```
GET _cluster/settings
PUT _cluster/settings
```


## URL parameters

All cluster settings parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
flat_settings | Boolean | Whether to return settings in the flat form, which can improve readability, especially for heavily nested settings. For example, the flat form of `"cluster": { "max_shards_per_node": 500 }` is `"cluster.max_shards_per_node": "500"`.
include_defaults (GET only) | Boolean | Whether to include default settings as part of the response. This parameter is useful for identifying the names and current values of settings you want to update.
master_timeout | Time | The amount of time to wait for a response from the master node. Default is 30 seconds.
timeout (PUT only) | Time | The amount of time to wait for a response from the cluster. Default is 30 seconds.


## Request body

The GET operation has no request body options.

For a PUT operation, the request body must contain `transient` or `persistent`, along with the setting you want to update:

```json
PUT _cluster/settings
{
  "persistent": {
    "cluster": {
      "max_shards_per_node": 500
    }
  }
}
```

For more information about transient settings, persistent settings, and precedence, see [OpenSearch configuration]({{site.url}}{{site.baseurl}}/opensearch/configuration/).


## Response

```json
{
  "acknowledged": true,
  "persistent": {
    "cluster": {
      "max_shards_per_node": "500"
    }
  },
  "transient": {}
}
```
