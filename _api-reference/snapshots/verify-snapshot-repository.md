---
layout: default
title: Verify Snaphot Repository
parent: Snapshot APIs
nav_order: 4
---

The Verify Snapshot Repository API confirms that a snapshot repository is functional across all nodes in a cluster. This verification helps ensure that the repository is properly configured and accessible before you attempt to create or restore snapshots.

If verification is successful, the API returns a list of nodes connected to the snapshot repository. If verification fails, the API returns an error.

If you use the Security plugin, you must have the `manage cluster` privilege.
{: .note}

<!-- spec_insert_start
api: snapshot.verify_repository
component: endpoints
-->
## Endpoints
```json
POST /_snapshot/{repository}/_verify
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: snapshot.verify_repository
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `repository` | **Required** | String | The name of the repository containing the snapshot. |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: snapshot.verify_repository
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

## Example request

The following request verifies that the `my-opensearch-repo` repository is functional with custom timeout settings:

```json
POST /_snapshot/my-opensearch-repo/_verify?timeout=0s&cluster_manager_timeout=50s
```
{% include copy-curl.html %}

## Example response

The response includes a list of all nodes that can access the repository:

```json
{
  "nodes": {
    "by1kztwTRoeCyg4iGU5Y8A": {
      "name": "opensearch-node1"
    }
  }
}
```

In this example, one node is connected to the snapshot repository. If multiple nodes can access the repository, they would all be listed in the response, as shown in this example:

```json
{
  "nodes": {
    "lcfL6jv2jo6sMEtp4idMvg": {
      "name": "node-1"
    },
    "rEPtFT/B+cuuOHnQn0jy4s": {
      "name": "node-2"
    }
  }
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `nodes` | **Required** | Object | A map of node IDs to node information for each node that can access the repository. |

<details markdown="block">
  <summary>
    Response body fields: <code>nodes</code>
  </summary>
  {: .text-delta}

For each node that can access the repository, the `nodes` object contains a key-value pair where:
- The key is the node ID (a string)
- The value is an object containing node information

| Property | Data type | Description |
| :--- | :--- | :--- |
| `name` | String | The name of the node. |

</details>

