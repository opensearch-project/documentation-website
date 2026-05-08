---
layout: default
title: Get index settings
parent: Index settings and mappings
grand_parent: Index APIs
nav_order: 10
redirect_from:
  - /opensearch/rest-api/index-apis/get-settings/
  - /opensearch/rest-api/index-apis/get-index/
---

# Get Index Settings API
**Introduced 1.0**
{: .label .label-purple }

The Get Index Settings API returns the configuration settings for one or more indexes. Use this API to retrieve index-level settings such as the number of shards and replicas, refresh intervals, analysis configurations, and other index parameters.


## Endpoints

<!-- spec_insert_start
component: endpoints
-->
```json
GET /_settings
GET /{target-index}/_settings
GET /{target-index}/_settings/{setting}
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
`target-index` | String | The name of the index to retrieve settings from. You can specify a single index name, a comma-separated list of index names, or a wildcard expression. Use `_all` or `*` to retrieve settings from all indexes in the cluster.
`setting` | String | The name of a specific setting to retrieve. When specified, the response includes only the requested setting instead of all settings.

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
`allow_no_indices` | Boolean | Specifies whether to ignore wildcard expressions or index patterns that don’t match any indexes. When `false`, the request returns an error if a wildcard expression doesn’t match any indexes. When `true`, the request ignores missing indexes and returns only the settings for indexes that exist. Default is `true`.
`expand_wildcards` | String | Specifies the types of indexes to which wildcard expressions can expand. Supports comma-separated values. Valid values are `all` (all indexes), `open` (open indexes), `closed` (closed indexes), `hidden` (hidden indexes), and `none` (wildcard expressions are not accepted). Default is `open`.
`flat_settings` | Boolean | Specifies whether to return settings in flat format. When `true`, settings are returned in a flattened format (for example, `”index.creation_date”: “123456789”`). When `false`, settings are returned in nested format (for example, `”index”: {“creation_date”: “123456789”}`). Default is `false`.
`include_defaults` | Boolean | Specifies whether to include default settings in the response. Default settings are configurations that are implicitly applied by OpenSearch when not explicitly set, including settings used by OpenSearch plugins. When `true`, the response includes both custom and default settings. When `false`, the response includes only custom settings. Default is `false`.
`ignore_unavailable` | Boolean | Specifies whether to ignore indexes that are missing or closed. When `true`, the request does not return an error if the target index is missing or closed. When `false`, the request returns an error if the target index is unavailable. Default is `false`.
`local` | Boolean | Specifies whether to retrieve settings from the local node only or from the cluster manager node. When `true`, settings are retrieved from the local node. When `false`, settings are retrieved from the cluster manager node. Default is `false`.
`cluster_manager_timeout` | Time | The amount of time to wait for a connection to the cluster manager node. Default is `30s`.

## Example request: Retrieving settings for a single index

The following example retrieves all settings for the `books` index:

<!-- spec_insert_start
component: example_code
rest: GET /books/_settings
-->
{% capture step1_rest %}
GET /books/_settings
{% endcapture %}

{% capture step1_python %}


response = client.indices.get_settings(
  index = "books"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example request: Retrieving settings from multiple indexes

The following example retrieves settings from multiple indexes:

```json
GET /books,products/_settings
```
{% include copy.html %}

## Example request: Retrieving settings from all indexes

The following example retrieves settings from all indexes in the cluster:

```json
GET /_all/_settings
```
{% include copy.html %}

## Example request: Retrieving settings using a wildcard pattern

The following example uses a wildcard pattern to retrieve settings from all indexes matching the pattern:

```json
GET /logs-*/_settings
```
{% include copy.html %}

## Example request: Filtering settings by name

The following example filters the response to return only settings matching the specified pattern:

```json
GET /logs-*/_settings/index.number_*
```
{% include copy.html %}

{% capture default_response %}

## Example response 

By default, settings are returned in nested format:

```json
{
  "books": {
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

{% endcapture %}
{{ default_response }}

{% capture flat_response %}

## Example response: Flat format

When you specify `flat_settings=true`, settings are returned in flattened format:

```json
{
  "books": {
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

{% endcapture %}
{{ flat_response }}

## Response body fields

The following table lists all response body fields.

Field | Description
:--- | :---
`settings` | An object containing all settings for the index. The specific settings returned depend on the index configuration. For information about available index settings, see [Index settings]({{site.url}}{{site.baseurl}}/im-plugin/index-settings/).
