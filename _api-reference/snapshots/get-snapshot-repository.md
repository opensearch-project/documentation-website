---
layout: default
title: Get snapshot repository
parent: Snapshot APIs
nav_order: 2
---

# Get Snapshot Repository. API
**Introduced 1.0**
{: .label .label-purple }

Retrieves information about a snapshot repository.

To learn more about repositories, see [Register repository]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore#register-repository).

You can also get details about a snapshot during and after snapshot creation. See [Get snapshot status]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot-status/).
{: .note}

## Endpoints

```json
GET /_snapshot/<repository>
```

## Path parameters

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| repository | String | A comma-separated list of snapshot repository names to retrieve. Wildcard (`*`) expressions are supported including combining wildcards with exclude patterns starting with `-`. |

## Query parameters

| Parameter | Data type | Description | 
:--- | :--- | :---
| local | Boolean | Whether to get information from the local node. Optional, defaults to `false`.|
| cluster_manager_timeout | Time | Amount of time to wait for a connection to the cluster manager node. Optional, defaults to 30 seconds. |

## Example request

The following request retrieves information for the `my-opensearch-repo` repository:

<!-- spec_insert_start
component: example_code
rest: GET /_snapshot/my-opensearch-repo
-->
{% capture step1_rest %}
GET /_snapshot/my-opensearch-repo
{% endcapture %}

{% capture step1_python %}


response = client.snapshot.get_repository(
  repository = "my-opensearch-repo"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

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

## Response body fields

| Field | Data type | Description |
| :--- | :--- | :--- | 
| type | string | Bucket type: `fs` (file system) or `s3` (s3 bucket) |
| bucket | string | S3 bucket name. |
| base_path | string | Folder within the bucket where snapshots are stored. |