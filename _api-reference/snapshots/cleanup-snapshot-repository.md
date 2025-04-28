---
layout: default
title: Cleanup snapshot repository
parent: Snapshot APIs
nav_order: 11
---

# Cleanup snapshot repository 
Introduced 1.0
{: .label .label-purple }

The Cleanup Snapshot Repository API removes data from a snapshot repository that is no longer referenced by any existing snapshot. This helps reclaim storage space and optimize repository performance.

<!-- spec_insert_start
api: snapshot.cleanup_repository
component: endpoints
-->
## Endpoints
```json
POST /_snapshot/{repository}/_cleanup
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: snapshot.cleanup_repository
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `repository` | **Required** | String | Snapshot repository to clean up. |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: snapshot.cleanup_repository
component: query_parameters
include_deprecated: false
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `cluster_manager_timeout` | String | The amount of time to wait for a response from the cluster manager node. For more information about supported time units, see [Common parameters]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/#time-units). |
| `timeout` | String | The amount of time to wait for a response. |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: snapshot.cleanup_repository
component: request_body_parameters
-->
<!-- API snapshot.cleanup_repository does NOT have a request_body_parameters component -->
<!-- spec_insert_end -->

<!-- spec_insert_start
api: snapshot.cleanup_repository
component: response_body_parameters
-->
## Response body fields

The response body is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `results` | **Required** | Object | Details the results and metrics of the snapshot cleanup operation. |

<details markdown="block" name="snapshot.cleanup_repository::response_body">
  <summary>
    Response body fields: <code>results</code>
  </summary>
  {: .text-delta}

`results` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `deleted_blobs` | **Required** | Integer | The number of binary large objects (blobs) removed during cleanup. |
| `deleted_bytes` | **Required** | Integer | The number of bytes freed by cleanup operations. |

</details>
<!-- spec_insert_end -->


## Example request

The following request removes all stale data from the repository `my_backup`:

```json
POST /_snapshot/my_backup/_cleanup
```
{% include copy-curl.html %}


## Example response

```json
{
	"results":{
		"deleted_bytes":40,
		"deleted_blobs":8
	}
}
```


