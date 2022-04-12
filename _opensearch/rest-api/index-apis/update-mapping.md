---
layout: default
title: Update mapping
parent: Index APIs
grand_parent: REST API reference
nav_order: 220
---

# Update mapping
Introduced 1.0
{: .label .label-purple }

If you want to add or update field types to an existing index, you can use the update mapping API operation.

You can't use this operation to update mappings that already map to existing data in the index. You must first create a new index with your desired mappings, and then use the [reindex API operation]({{site.url}}{{site.baseurl}}/opensearch/reindex-data) to map all the documents from your old index to the new index. If you don't want any downtime while you re-index your indexes, you can use [aliases]({{site.url}}{{site.baseurl}}/opensearch/index-alias).

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
PUT /_mapping
```

You can also use the update mapping operation to update multiple indices with one request.

```
PUT /<target-index1>,<target-index2>/_mapping
```

## URL parameters

All update mapping parameters are optional.

Parameter | Data Type | Description
:--- | :--- | :---
&lt;target-index&gt; | N/A | The index to add the mapping to. If you do not specify this parameter, OpenSearch adds the mapping to all indexes within the cluster.
allow_no_indices | Boolean | Whether to ignore wildcards that don’t match any indexes. Default is `true`.
expand_wildcards | String | Expands wildcard expressions to different indexes. Combine multiple values with commas. Available values are `all` (match all indexes), `open` (match open indexes), `closed` (match closed indexes), `hidden` (match hidden indexes), and `none` (do not accept wildcard expressions), which must be used with `open`, `closed`, or both. Default is `open`.
ignore_unavailable | Boolean | If true, OpenSearch does not include missing or closed indexes in the response.
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
