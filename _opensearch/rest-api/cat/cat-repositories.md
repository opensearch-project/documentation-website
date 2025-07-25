---
layout: default
title: cat repositories
parent: CAT
grand_parent: REST API reference
nav_order: 55
has_children: false
canonical_url: https://docs.opensearch.org/latest/api-reference/cat/cat-repositories/
---

# cat repositories
Introduced 1.0
{: .label .label-purple }

The cat repositories operation lists all completed and ongoing index and shard recoveries.

## Example

```
GET _cat/repositories?v
```

## Path and HTTP methods

```
GET _cat/repositories
```

## URL parameters

All cat repositories URL parameters are optional.

In addition to the [common URL parameters]({{site.url}}{{site.baseurl}}/opensearch/rest-api/cat/index#common-url-parameters), you can specify the following parameters:

Parameter | Type | Description
:--- | :--- | :---
local | Boolean | Whether to return information from the local node only instead of from the master node. Default is false.
master_timeout | Time | The amount of time to wait for a connection to the master node. Default is 30 seconds.


## Response

```json
id    type
repo1   fs
repo2   s3
```
