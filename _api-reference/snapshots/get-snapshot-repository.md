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

## Endpoints

```json
GET /_snapshot/<repository>
```

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
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `cluster_manager_timeout` | String | The amount of time to wait for a response from the cluster manager node. For more information about supported time units, see [Common parameters]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/#time-units). |
| `local` | Boolean | Whether to get information from the local node. _(Default: `false`)_ |
| `master_timeout` <br> _DEPRECATED_ | String | _(Deprecated since 2.0: To promote inclusive language, use `cluster_manager_timeout` instead.)_ Explicit operation timeout for connection to cluster-manager node |

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

<!-- spec_insert_start
api: snapshot.get_repository
component: response_body_parameters
-->
## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `-- freeform field --` | Object | The name of the repository to store the snapshot. |

<details markdown="block" name="snapshot.get_repository::response_body">
  <summary>
    Response body fields: <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

The name of the repository to store the snapshot.

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `settings` | Object | The settings for the snapshot repository. |
| `type` | String | The type of the snapshot repository. |
| `uuid` | String | The universally unique identifier. |

</details>
<details markdown="block" name="snapshot.get_repository::response_body">
  <summary>
    Response body fields: <code>-- freeform field --</code> > <code>settings</code>
  </summary>
  {: .text-delta}

The settings for the snapshot repository.

`settings` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `chunk_size` | String | The chunk size for the repository. |
| `compress` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `concurrent_streams` | Integer or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |
| `location` | String | The location where snapshots are stored. |
| `read_only` | Boolean or String | Certain APIs may return values, including numbers such as epoch timestamps, as strings. This setting captures this behavior while keeping the semantics of the field type.  Depending on the target language, code generators can keep the union or remove it and leniently parse strings to the target type. |

</details>
<!-- spec_insert_end -->
