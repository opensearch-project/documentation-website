---
layout: default
title: Verify Snaphot Repository
parent: Snapshot APIs

nav_order: 4
---

# Verify snapshot repository
**Introduced 1.0**
{: .label .label-purple }

Verifies that a snapshot repository is functional. Verifies the repository on each node in a cluster.

If verification is successful, the verify snapshot repository API returns a list of nodes connected to the snapshot repository. If verification failed, the API returns an error.

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


## Endpoints

```json
GET _snapshot/<repository>/
```

## Path parameters

Path parameters are optional. 

| Parameter | Data type | Description | 
:--- | :--- | :---
| repository | String | Name of repository to verify. |

## Query parameters

| Parameter | Data type | Description | 
:--- | :--- | :---
| cluster_manager_timeout | Time | Amount of time to wait for a connection to the cluster manager node. Optional, defaults to `30s`. |
| timeout | Time | The period of time to wait for a response. If a response is not received before the timeout value, the request fails and returns an error. Defaults to `30s`. |

## Example request

The following request verifies that the my-opensearch-repo is functional:

````json
POST /_snapshot/my-opensearch-repo/_verify?timeout=0s&cluster_manager_timeout=50s
````

## Example response

The example that follows corresponds to the request above in the [Example request](#example-request) section.

The `POST /_snapshot/my-opensearch-repo/_verify?timeout=0s&cluster_manager_timeout=50s` request returns the following fields:

````json
{
  "nodes" : {
    "by1kztwTRoeCyg4iGU5Y8A" : {
      "name" : "opensearch-node1"
    }
  }
}
````

In the preceding sample, one node is connected to the snapshot repository. If more were connected, you would see them in the response. Example:

````json
{
  "nodes" : {
    "lcfL6jv2jo6sMEtp4idMvg" : {
      "name" : "node-1"
    },
    "rEPtFT/B+cuuOHnQn0jy4s" : {
      "name" : "node-2"
  }
}
````

<!-- spec_insert_start
api: snapshot.verify_repository
component: response_body_parameters
-->
## Response body fields

The response body is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `nodes` | **Required** | Object |  |

<details markdown="block" name="snapshot.verify_repository::response_body">
  <summary>
    Response body fields: <code>nodes</code>
  </summary>
  {: .text-delta}

`nodes` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `-- freeform field --` | Object |  |

</details>
<details markdown="block" name="snapshot.verify_repository::response_body">
  <summary>
    Response body fields: <code>nodes</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `name` | **Required** | String | The name of a resource or configuration element. |

</details>
<!-- spec_insert_end -->
