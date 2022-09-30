---
layout: default
title: Dangling indices
parent: index-apis
grand_parent: REST API reference
nav_order: 84
---

# Dangling indices API

Dangling indices occur if any shards exist in a node's local directory that do not already exist in the cluster, after a node joins a cluster. Dangling indices can be listed, deleted, or imported.

## Path and HTTP methods

List dangling indices:

```
GET /_dangling
```

Import dangling index:

```
POST /_dangling/<index-uuid>
```

Delete dangling index:

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

Query parameter | Data Type | Description
:--- | :--- | :---
accept_data_loss | boolean | Must be set to `true` for an `import` or `delete`, as Opensearch is unaware of where the dangling index data came from.
timeout | time units | The amount of time to wait for a response. If no response is received in the defined time period, an error is returned. Default is `30` seconds.
master_timeout | time units | The amount of time to wait for the connection to the cluster manager. If no response is received in the defined time period, an error is returned. Default is `30` seconds.

## Examples

Example requests and response:

#### Sample list:

````bash
GET /_dangling
````

#### Sample import:

````bash
POST /_dangling/msdjernajxAT23RT-BupMB?accept_data_loss=true
````
 
#### Sample delete:

````bash
DELETE /_dangling/msdjernajxAT23RT-BupMB?accept_data_loss=true
````

#### Sample response body:

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