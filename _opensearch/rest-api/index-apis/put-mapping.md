---
layout: default
title: Create or update mappings
parent: Index APIs
grand_parent: REST API reference
nav_order: 220
---

# Create or update mappings
Introduced 1.0
{: .label .label-purple }

If you want to create or add mappings and fields to an index, you can use the put mapping API operation. For an existing mapping, this operation updates the mapping.

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

The index name is a required path parameter. If you don't specify the index, you will get an error.

```
PUT /<target-index>/_mapping
```
For example, to create a mapping for the `sample-index` index, you can make the following call to the mapping API operation:

```
PUT /sample-index/_mapping/
{
  "properties":{
    "year":{
      "type": "text"
    }
  } 
}
```

Upon success, you will receive `acknowledged" : true` in the response.

You can also use the put mapping operation to update multiple indexes with one request.

```
PUT /<target-index1>,<target-index2>/_mapping
```

## URL parameters

All put mapping parameters are optional.

Parameter | Data Type | Description
:--- | :--- | :---
&lt;target-index&gt; | N/A | Specifies an index with which to associate the mapping. If you do not specify this parameter, OpenSearch adds the mapping to all indexes within the cluster.
allow_no_indices | Boolean | Whether to ignore wildcards that don’t match any indexes. Default is `true`.
expand_wildcards | String | Expands wildcard expressions to different indexes. Combine multiple values with commas. Available values are `all` (match all indexes), `open` (match open indexes), `closed` (match closed indexes), `hidden` (match hidden indexes), and `none` (do not accept wildcard expressions), which must be used with `open`, `closed`, or both. Default is `open`.
ignore_unavailable | Boolean | If true, OpenSearch does not include missing or closed indexes in the response.
ignore_malformed | Boolean | Use this parameter with the `ip_range` data type to specify that OpenSearch should ignore malformed fields. If `true`, OpenSearch does not include entries that do not match the IP range specified in the index in the response. The default is `false`.
master_timeout | Time | How long to wait for a connection to the master node. Default is `30s`.
timeout | Time | How long to wait for the response to return. Default is `30s`.
write_index_only | Boolean | Whether OpenSearch should apply mapping updates only to the write index.

## Request body

The request body must contain `properties`, which has all of the mappings that you want to create or update.

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
