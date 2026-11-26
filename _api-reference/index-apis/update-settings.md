---
layout: default
title: Update settings
parent: Index settings and mappings
grand_parent: Index APIs
nav_order: 20
redirect_from:
  - /opensearch/rest-api/index-apis/update-settings/
---

# Update Index Settings API
**Introduced 1.0**
{: .label .label-purple }

The Update Index Settings API changes index-level settings in real time. You can update dynamic index settings at any time. You can update static index settings only on a closed index, and you cannot update final static settings, such as `index.number_of_shards`, after index creation. For more information about static and dynamic index settings, see [Index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/).

In addition to the built-in index settings, you can also update settings for individual plugins. To retrieve a complete list of all available settings, including default values, run `GET <target-index>/_settings?include_defaults=true`.

The API updates settings only on existing indexes and does not create an index. Each setting in the request body is applied whether or not it was previously set on the index. To leave settings that already have a value unchanged and apply only the settings that are not yet set, specify `preserve_existing=true`. To reset a setting to its default value, set it to `null`. For more information, see [Resetting a setting to its default value](#example-request-resetting-a-setting-to-its-default-value).

If the request contains any setting that cannot be updated, the entire request is rejected and no settings are changed.


## Endpoints

<!-- spec_insert_start
component: endpoints
-->
```json
PUT /{index}/_settings
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
`index` | String | The name of the index to update. You can specify a single index name, a comma-separated list of index names, or a wildcard expression. Use `_all` or `*` to update settings for all indexes in the cluster.

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
`allow_no_indices` | Boolean | Specifies whether to ignore wildcard expressions or index patterns that don’t match any indexes. When `false`, the request returns an error if a wildcard expression doesn’t match any indexes. When `true`, the request ignores missing indexes and updates only the settings for indexes that exist. Default is `false`.
`expand_wildcards` | String | Specifies the types of indexes to which wildcard expressions can expand. Supports comma-separated values. Valid values are `all` (all indexes), `open` (open indexes), `closed` (closed indexes), `hidden` (hidden indexes), and `none` (wildcard expressions are not accepted). Default is `open`.
`flat_settings` | Boolean | Specifies whether to return settings in flat format. When `true`, settings are returned in a flattened format. When `false`, settings are returned in nested format. Default is `false`.
`ignore_unavailable` | Boolean | Specifies whether to ignore indexes that are missing or closed. When `true`, the request does not return an error if the target index is missing or closed. When `false`, the request returns an error if the target index is unavailable. Default is `false`.
`preserve_existing` | Boolean | Specifies whether to preserve existing index settings. When `true`, existing settings remain unchanged and only new settings are applied. When `false`, the request updates existing settings with the provided values. Default is `false`.
`cluster_manager_timeout` | Time | The amount of time to wait for a connection to the cluster manager node. Default is `30s`.
`timeout` | Time | The amount of time to wait for a response. Default is `30s`.

## Request body

The request body contains the index settings you want to update. You can specify settings in either flat or nested format.

Field | Data type | Description
:--- | :--- | :---
`settings` | Object | An object containing the index settings to update. For a list of available index settings, see [Index settings]({{site.url}}{{site.baseurl}}/im-plugin/index-settings/).

## Example request: Updating settings for a single index

The following example updates settings for the `books` index:

<!-- spec_insert_start
component: example_code
rest: PUT /books/_settings
body: |
{
  "index": {
    "number_of_replicas": 2
  }
}
-->
{% capture step1_rest %}
PUT /books/_settings
{
  "index": {
    "number_of_replicas": 2
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.put_settings(
  index = "books",
  body = {
    "index": {
      "number_of_replicas": 2
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example request: Resetting a setting to its default value

To revert a setting to its default value, specify `null` as the value:

```json
PUT /books/_settings
{
  "index": {
    "refresh_interval": null
  }
}
```
{% include copy.html %}

## Example request: Updating settings for multiple indexes

The following example updates settings for multiple indexes:

```json
PUT /books,products/_settings
{
  "index": {
    "number_of_replicas": 0
  }
}
```
{% include copy.html %}

## Example request: Optimizing for bulk indexing

To optimize an index for bulk indexing operations, disable the refresh interval by setting it to `-1`. After bulk indexing is complete, reenable it by setting it back to a positive value:

```json
PUT /books/_settings
{
  "index": {
    "refresh_interval": "-1"
  }
}
```
{% include copy.html %}

After completing bulk indexing, restore the refresh interval:

```json
PUT /books/_settings
{
  "index": {
    "refresh_interval": "1s"
  }
}
```
{% include copy.html %}

## Example response

```json
{
  "acknowledged": true
}
```

## Response body fields

The following table lists all response body fields.

Field | Data type | Description
:--- | :--- | :---
`acknowledged` | Boolean | Indicates whether the update request was received. A value of `true` indicates that the request was received. This does not guarantee that the settings were applied.

## Status codes

The following table lists the HTTP status codes that the API returns.

Status code | Error type | Description
:--- | :--- | :---
`200` | None | The request succeeded. The response contains `"acknowledged": true`.
`400` | `settings_exception` | The request contains an unknown setting name or attempts to update a final setting, such as `index.number_of_shards`, on a closed index.
`400` | `illegal_argument_exception` | The request contains an invalid setting value or attempts to update a static setting on an open index.
`400` | `parse_exception` | The request body is missing.
`400` | A JSON parsing error, such as `unexpected_end_of_input_exception` | The request body is not valid JSON.
`404` | `index_not_found_exception` | A target index does not exist or a wildcard expression does not match any indexes. To ignore missing indexes, set `ignore_unavailable` to `true`. To ignore wildcard expressions that do not match any indexes, or when no target index exists, also set `allow_no_indices` to `true`.

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `indices:admin/settings/update`.
