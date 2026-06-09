---
layout: default
title: Get index
parent: Core index APIs
grand_parent: Index APIs
nav_order: 30
redirect_from:
  - /opensearch/rest-api/index-apis/get-index/
---

# Get Index API
**Introduced 1.0**
{: .label .label-purple }

The get index API operation returns information about one or more indexes, including their settings, mappings, and aliases.

<!-- spec_insert_start
api: indices.get
component: endpoints
-->
## Endpoints
```json
GET /{index}
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `index` | **Required** | String | The name of the index to retrieve. You can specify a single index, a comma-separated list of indexes, or a wildcard expression. Use `_all` or `*` to retrieve information for all indexes in the cluster. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `allow_no_indices` | Boolean | Specifies whether to ignore wildcards that do not match any indexes. If `false`, the request returns an error when wildcards do not match any indexes. | `true` |
| `expand_wildcards` | String | Specifies the types of indexes to which wildcard expressions can expand. Supports comma-separated values. Valid values are: <br> - `all`: Match all indexes, including hidden indexes. <br> - `open`: Match open indexes. <br> - `closed`: Match closed indexes. <br> - `hidden`: Match hidden indexes. Must be combined with `open`, `closed`, or both. <br> - `none`: Do not accept wildcard expressions. | `open` |
| `flat_settings` | Boolean | Specifies whether to return settings in flat format. When `true`, settings are returned in a flattened format (for example, `"index.creation_date": "123456789"`). When `false`, settings are returned in nested format (for example, `"index": {"creation_date": "123456789"}`). | `false` |
| `include_defaults` | Boolean | Specifies whether to include default settings in the response. When `true`, the response includes default values for all settings, which can help you identify setting names and values to update. | `false` |
| `ignore_unavailable` | Boolean | Specifies whether to ignore indexes that are unavailable (missing or closed). If `true`, missing or closed indexes are not included in the response. | `false` |
| `local` | Boolean | Specifies whether to retrieve information from the local node only instead of from the cluster manager node. | `false` |
| `cluster_manager_timeout` | String | The amount of time to wait for a connection to the cluster manager node. | `30s` |

## Example request

The following example request retrieves information for the `books` index:

<!-- spec_insert_start
component: example_code
rest: GET /books
-->
{% capture step1_rest %}
GET /books
{% endcapture %}

{% capture step1_python %}


response = client.indices.get(
  index = "books"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

OpenSearch returns information for the requested index or indexes:

```json
{
  "books": {
    "aliases": {},
    "mappings": {},
    "settings": {
      "index": {
        "replication": {
          "type": "DOCUMENT"
        },
        "number_of_shards": "2",
        "provided_name": "books",
        "creation_date": "1778255937147",
        "number_of_replicas": "1",
        "uuid": "Onnd4TKBQMODrfvAvNXjAg",
        "version": {
          "created": "137277827"
        }
      }
    }
  }
}
```

When you use the `flat_settings=true` query parameter, settings are returned in a flattened format:

```json
{
  "books": {
    "aliases": {},
    "mappings": {},
    "settings": {
      "index.creation_date": "1778255937147",
      "index.number_of_replicas": "1",
      "index.number_of_shards": "2",
      "index.provided_name": "books",
      "index.replication.type": "DOCUMENT",
      "index.uuid": "Onnd4TKBQMODrfvAvNXjAg",
      "index.version.created": "137277827"
    }
  }
}
```

## Response body fields

The response contains a separate object for each index, for which the key is the index name. Each index object contains the following fields.

Field | Data type | Description
:--- | :--- | :---
`aliases` | Object | Index aliases associated with the index. Each key is an alias name, and each value is an alias configuration object. For more information, see [Index aliases]({{site.url}}{{site.baseurl}}/im-plugin/index-alias/).
`mappings` | Object | Field mappings for documents in the index. Defines the data type and properties for each field. For more information, see [Mappings]({{site.url}}{{site.baseurl}}/field-types/).
`settings` | Object | Index settings that control index behavior, such as the number of shards and replicas. For more information, see [Index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/).