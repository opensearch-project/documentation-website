---
layout: default
title: Get snapshot repository
parent: Snapshot APIs
nav_order: 2
---

# Get snapshot repository
**Introduced 1.0**
{: .label .label-purple }

The Get Snapshot Repository API retrieves information about one or more snapshot repositories in your OpenSearch cluster.

For more information about repositories, see [Register repository]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore#register-repository).

You can also get details about a snapshot during and after snapshot creation. See [Get Snapshot Status]({{site.url}}{{site.baseurl}}/api-reference/snapshots/get-snapshot-status/).
{: .note}

<!-- spec_insert_start
api: snapshot.get_repository
component: endpoints
-->
## Endpoints
```json
GET /_snapshot
GET /_snapshot/{repository}
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: snapshot.get_repository
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `repository` | List or String | A comma-separated list of repository names. |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: snapshot.get_repository
component: query_parameters
include_deprecated: false
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `cluster_manager_timeout` | String | The amount of time to wait for a response from the cluster manager node. For more information about supported time units, see [Common parameters]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/#time-units). |
| `local` | Boolean | Whether to get information from the local node. _(Default: `false`)_ |

<!-- spec_insert_end -->



## Example request

The following request retrieves information for the `my-opensearch-repo` repository:

````json
GET /_snapshot/my-opensearch-repo
````
{% include copy-curl.html %}

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

The response body is a JSON object where each key is a repository name and each value contains information about that repository.

For each repository, the response includes the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `type` | String | The type of the snapshot repository (e.g., `fs` or `s3`). |
| `settings` | Object | The settings configured for the snapshot repository. |
| `uuid` | String | The universally unique identifier for the repository, if applicable. |

<details markdown="block">
  <summary>
    Repository settings fields
  </summary>
  {: .text-delta}

The `settings` object contains fields specific to the repository type:

**For `fs` repositories:**

| Property | Data type | Description |
| :--- | :--- | :--- |
| `location` | String | The file system location where snapshots are stored. |
| `chunk_size` | String | The chunk size used for the repository. |
| `compress` | Boolean | Whether metadata files are compressed. |
| `readonly` | Boolean | Whether the repository is read-only. |

**For `s3` repositories:**

| Property | Data type | Description |
| :--- | :--- | :--- |
| `bucket` | String | The S3 bucket name. |
| `base_path` | String | The path within the bucket where snapshots are stored. |
| `chunk_size` | String | The chunk size used for the repository. |
| `compress` | Boolean | Whether metadata files are compressed. |
| `readonly` | Boolean | Whether the repository is read-only. |

Additional settings may be present depending on the repository configuration.

</details>
