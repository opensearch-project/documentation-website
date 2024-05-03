---
layout: default
title: Get Snapshot Repository
parent: Snapshot APIs
nav_order: 2
---

# Get snapshot repository.
**Introduced 1.0**
{: .label .label-purple }

Retrieves information about a snapshot repository.

To learn more about repositories, see [Register repository]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore#register-repository).

You can also get details about a snapshot during and after snapshot creation. See [Get snapshot status]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot-status/).
{: .note}

## Path parameters

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| repository | String | A comma-separated list of snapshot repository names to retrieve. Wildcard (`*`) expressions are supported including combining wildcards with exclude patterns starting with `-`. |

## Query parameters

| Parameter | Data type | Description | 
:--- | :--- | :---
| local | Boolean | Whether to get information from the local node. Optional, defaults to `false`.|
| cluster_manager_timeout | Time | Amount of time to wait for a connection to the master node. Optional, defaults to 30 seconds. |

#### Example request

The following request retrieves information for the `my-opensearch-repo` repository:

````json
GET /_snapshot/my-opensearch-repo
````
{% include copy-curl.html %}

#### Example response

Upon success, the response returns repositry information. This sample is for an `s3` repository type.

````json
{
  "my-opensearch-repo" : {
    "type" : "s3",
    "settings" : {
      "bucket" : "my-open-search-bucket",
      "base_path" : "snapshots"
    }
  }
}
````

## Response fields

| Field | Data type | Description |
| :--- | :--- | :--- | 
| type | string | Bucket type: `fs` (file system) or `s3` (s3 bucket) |
| bucket | string | S3 bucket name. |
| base_path | string | Folder within the bucket where snapshots are stored. |