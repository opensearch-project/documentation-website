---
layout: default
title: Update mapping
parent: REST API reference
nav_order: 6
canonical_url: https://docs.opensearch.org/latest/api-reference/index-apis/put-mapping/
---

# Update mapping

If you want to update an index's mappings to add or update field types after index creation, you can do so with the update mapping API operation.

Note that you cannot use this operation to update mappings that already map to existing data in the index. You must first create a new index with your desired mappings, and then use the [reindex API operation]({{site.url}}{{site.baseurl}}/opensearch/reindex-data) to map all the documents from your old index to the new index. If you don't want any downtime while reindexing your indices, you can use [aliases]({{site.url}}{{site.baseurl}}/opensearch/index-alias).

## Example

```json
PUT /sample-index/_mapping

{
  "properties": {
    "age": {
      "type": "integer"
    },
    "occupation":{
      "type": "text"
    }
  }
}
```


## Path and HTTP methods

```
PUT /<target-index>/_mapping
```

You can also use the update mapping operation to update multiple indices with one request.

```
PUT /<target-index1>,<target-index2>/_mapping
```

## URL parameters

All update mapping parameters are optional.

Parameter | Data Type | Description
:--- | :--- | :---
allow_no_indices | Boolean | Whether to ignore wildcards that don’t match any indices. Default is `true`.
expand_wildcards | String | Expands wildcard expressions to different indices. Combine multiple values with commas. Available values are `all` (match all indices), `open` (match open indices), `closed` (match closed indices), `hidden` (match hidden indices), and `none` (do not accept wildcard expressions), which must be used with `open`, `closed`, or both. Default is `open`.
ignore_unavailable | Boolean | If true, OpenSearch does not include missing or closed indices in the response.
master_timeout | Time | How long to wait for a connection to the master node. Default is `30s`.
timeout | Time | How long to wait for the response to return. Default is `30s`.
write_index_only | Boolean | Whether OpenSearch should apply mapping updates only to the write index.

## Request body

The request body must contain `properties`, which has all of the mappings that you want to update.

```json
{
  "properties":{
    "color":{
      "type": "text"
    },
    "year":{
      "type": "integer"
    }
  }
}
```

## Response

```json
{
    "acknowledged": true
}
```
