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

## Path parameters

Path parameters are optional. 

| Parameter | Data type | Description | 
:--- | :--- | :---
| repository | String | Name of repository to verify. |

## Query parameters

| Parameter | Data type | Description | 
:--- | :--- | :---
| cluster_manager_timeout | Time | Amount of time to wait for a connection to the master node. Optional, defaults to `30s`. |
| timeout | Time | The period of time to wait for a response. If a response is not received before the timeout value, the request fails and returns an error. Defaults to `30s`. |

#### Example request

The following request verifies that the my-opensearch-repo is functional:

````json
POST /_snapshot/my-opensearch-repo/_verify?timeout=0s&cluster_manager_timeout=50s
````

#### Example response

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

## Response fields

| Field | Data type | Description | 
:--- | :--- | :---
| nodes | Object | A list (not an array) of nodes connected to the snapshot repository. Each node itself is a property where the node ID is the key and the name has an ID (Object) and a name (String). |