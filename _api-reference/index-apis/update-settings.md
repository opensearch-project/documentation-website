---
layout: default
title: Update settings
parent: Index APIs
nav_order: 75
redirect_from:
  - /opensearch/rest-api/index-apis/update-settings/
---

# Update settings
**Introduced 1.0**
{: .label .label-purple }

You can use the update settings API operation to update index-level settings. You can change dynamic index settings at any time, but static settings cannot be changed after index creation. For more information about static and dynamic index settings, see [Create index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/create-index/).

Aside from the static and dynamic index settings, you can also update individual plugins' settings. To get the full list of updatable settings, run `GET <target-index>/_settings?include_defaults=true`.

## Example

```json
PUT /sample-index1/_settings
{
  "index.plugins.index_state_management.rollover_skip": true,
  "index": {
    "number_of_replicas": 4
  }
}
```
{% include copy-curl.html %}

## Path and HTTP methods

```
PUT /<target-index>/_settings
```

## Query parameters

All update settings parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
allow_no_indices | Boolean | Whether to ignore wildcards that don’t match any indexes. Default is `true`.
expand_wildcards | String | Expands wildcard expressions to different indexes. Combine multiple values with commas. Available values are `all` (match all indexes), `open` (match open indexes), `closed` (match closed indexes), `hidden` (match hidden indexes), and `none` (do not accept wildcard expressions), which must be used with `open`, `closed`, or both. Default is `open`.
flat_settings | Boolean | Whether to return settings in the flat form, which can improve readability, especially for heavily nested settings. For example, the flat form of “index”: { “creation_date”: “123456789” } is “index.creation_date”: “123456789”.
ignore_unavailable | Boolean | If true, OpenSearch does not include missing or closed indexes in the response.
preserve_existing | Boolean | Whether to preserve existing index settings. Default is false.
cluster_manager_timeout | Time | How long to wait for a connection to the cluster manager node. Default is `30s`.
timeout | Time | How long to wait for a connection to return. Default is `30s`.

## Request body

The request body must all of the index settings that you want to update.

```json
{
  "index.plugins.index_state_management.rollover_skip": true,
  "index": {
    "number_of_replicas": 4
  }
}
```

## Response

```json
{
    "acknowledged": true
}
```
