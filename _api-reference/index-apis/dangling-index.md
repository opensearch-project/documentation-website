---
layout: default
title: Dangling indexes
parent: index-apis
nav_order: 30
---

# Dangling indexes API
**Introduced 1.0**
{: .label .label-purple }

After a node joins a cluster, dangling indexes occur if any shards exist in the node's local directory that do not already exist in the cluster. Dangling indexes can be listed, deleted, or imported.

## Path and HTTP methods

List dangling indexes:

```
GET /_dangling
```

Import a dangling index:

```
POST /_dangling/<index-uuid>
```

Delete a dangling index:

```
DELETE /_dangling/<index-uuid>
```

## Path parameters

Path parameters are required.

Path parameter | Description
:--- | :---
index-uuid | UUID of index.

## Query parameters

Query parameters are optional.

Query parameter | Data type | Description
:--- | :--- | :---
accept_data_loss | Boolean | Must be set to `true` for an `import` or `delete` because OpenSearch is unaware of where the dangling index data came from.
timeout | Time units | The amount of time to wait for a response. If no response is received in the defined time period, an error is returned. Default is `30` seconds.
cluster_manager_timeout | Time units | The amount of time to wait for a connection to the cluster manager. If no response is received in the defined time period, an error is returned. Default is `30` seconds.

## Examples

The following are example requests and a example response.

#### Sample list

````bash
GET /_dangling
````
{% include copy-curl.html %}

#### Sample import

````bash
POST /_dangling/msdjernajxAT23RT-BupMB?accept_data_loss=true
````
{% include copy-curl.html %}
 
#### Sample delete

````bash
DELETE /_dangling/msdjernajxAT23RT-BupMB?accept_data_loss=true
````

#### Example response body

````json
{
    "_nodes": {
        "total": 1,
        "successful": 1,
        "failed": 0
    },
    "cluster_name": "opensearch-cluster",
    "dangling_indices": [msdjernajxAT23RT-BupMB]
}
````