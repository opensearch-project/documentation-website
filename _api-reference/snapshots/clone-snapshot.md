---
layout: default
title: Clone snapshot
parent: Snapshot APIs
nav_order: 10
---

# Clone Snapshot API
Introduced 1.0
{: .label .label-purple }

Creates a clone of all or part of a snapshot in the same repository as the original.


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
| `repository` | **Required** | String | The name of repository which will contain the snapshots clone. |
| `snapshot` | **Required** | String | The name of the original snapshot. |
| `target_snapshot` | **Required** | String | The name of the cloned snapshot. |

<!-- spec_insert_end -->


<!-- spec_insert_start
api: snapshot.clone
component: query_parameters
include_deprecated: false
-->
## Query parameters

The following table lists the available query parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `cluster_manager_timeout` | String | The amount of time to wait for a response from the cluster manager node. For more information about supported time units, see [Common parameters](https://opensearch.org/docs/latest/api-reference/common-parameters/#time-units). |

<!-- spec_insert_end -->


## Example request

The following request clones indexes `index_a` and `index_b` from `my_snapshot`, a snapshot located in the snapshot repository `my-opensearch-repo`, into a new snapshot in the same repository called `my_new_snapshot`:

<!-- spec_insert_start
component: example_code
rest: PUT /_snapshot/my-opensearch-repo/my_snapshot/_clone/my_new_snapshot
body: |
{
	“indices” : “index_a,index_b”
}
-->
{% capture step1_rest %}
PUT /_snapshot/my-opensearch-repo/my_snapshot/_clone/my_new_snapshot
{
	“indices” : “index_a,index_b”
}
{% endcapture %}

{% capture step1_python %}


response = client.snapshot.clone(
  repository = "my-opensearch-repo",
  snapshot = "my_snapshot",
  target_snapshot = "my_new_snapshot",
  body = '''
{
	“indices” : “index_a,index_b”
}
'''
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->


## Example response

The successful creation of a snapshot clone returns the following response:

```json
{ 
    "acknowledged" : true
}
```

