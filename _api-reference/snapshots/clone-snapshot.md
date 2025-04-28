---
layout: default
title: Clone snapshot
parent: Snapshot APIs
nav_order: 10
---

# Clone snapshot
Introduced 1.0
{: .label .label-purple }

The Clone Snapshot API creates a copy of all or part of an existing snapshot within the same repository. This is useful when you want to preserve a specific version of a snapshot while continuing to modify the original.

<!-- spec_insert_start
api: snapshot.clone
component: endpoints
-->
## Endpoints
```json
PUT /_snapshot/{repository}/{snapshot}/_clone/{target_snapshot}
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: snapshot.clone
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `repository` | **Required** | String | The name of the repository that contains the source snapshot and where the cloned snapshot will be stored. |
| `snapshot` | **Required** | String | The name of the original snapshot. |
| `target_snapshot` | **Required** | String | The name of the cloned snapshot. |

<!-- spec_insert_end -->


<!-- spec_insert_start
api: snapshot.clone
component: query_parameters
include_deprecated: false
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `cluster_manager_timeout` | String | The amount of time to wait for a response from the cluster manager node. For more information about supported time units, see [Common parameters]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/#time-units). |

<!-- spec_insert_end -->


<!-- spec_insert_start
api: snapshot.clone
component: request_body_parameters
-->
## Request body fields

The snapshot clone definition.

The request body is __required__. It is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `indices` | **Required** | String | A comma-separated list of index patterns to clone from the source snapshot. Wildcards are supported. |

<!-- spec_insert_end -->


## Example request

The following request clones indexes `index_a` and `index_b` from `my_snapshot`, a snapshot located in the snapshot repository `my-opensearch-repo`, into a new snapshot in the same repository called `my_new_snapshot`:

```json
PUT /_snapshot/my-opensearch-repo/my_snapshot/_clone/my_new_snapshot
{
	“indices” : “index_a,index_b”
}
```
{% include copy-curl.html %}


## Example response

The successful creation of a snapshot clone returns the following response:

```json
{ 
    "acknowledged" : true
}
```

