---
layout: default
title: CAT snapshots
parent: CAT API

nav_order: 65
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-snapshots/
---

# CAT snapshots
**Introduced 1.0**
{: .label .label-purple }

The CAT snapshots operation lists all snapshots for a repository.


## Path and HTTP methods

```json
GET _cat/snapshots
```

## Query parameters

Parameter | Type   | Description
:--- |:-------| :---
repository | String | Name of snapshot repository. Required.
cluster_manager_timeout | Time   | The amount of time to wait for a connection to the cluster manager node. Default is 30 seconds.
time | Time   | Specify the units for time. For example, `5d` or `7h`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).

## Example request

The following example request lists all snapshots in the provided repository:

```
GET _cat/snapshots?v&repository=<repository-name>
```
{% include copy-curl.html %}


## Example response

```json
id                 | status  | start_epoch | start_time | end_epoch  | end_time | duration | indices | successful_shards | failed_shards | total_shards
nightly-1732912545 | SUCCESS | 1732912585  | 20:36:25   | 1732912585 | 20:36:25 | 0s       | 1       | 1                 | 0             | 1
nightly-1732826145 | SUCCESS | 1732912631  | 20:37:11   | 1732912631 | 20:37:11 | 0s       | 1       | 1                 | 0             | 1
nightly-1732998945 | SUCCESS | 1732912647  | 20:37:27   | 1732912647 | 20:37:27 | 202ms    | 1       | 1                 | 0             | 1
```
