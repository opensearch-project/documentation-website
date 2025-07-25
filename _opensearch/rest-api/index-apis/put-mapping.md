---
layout: default
title: Put mapping
parent: Index APIs
grand_parent: REST API reference
nav_order: 200
canonical_url: https://docs.opensearch.org/latest/api-reference/index-apis/put-mapping/
---

# Put mapping
Introduced 1.0
{: .label .label-purple }

The put mapping API operation lets you add new mappings and fields to an index.

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

## URL parameters

All put mapping parameters are optional.

Parameter | Data Type | Description
:--- | :--- | :---
&lt;target-index&gt; | Data Type | The index to add the mapping to. If you do not specify this parameter, OpenSearch adds the mapping to all indices within the cluster.
allow_no_indices | Boolean | Whether to ignore wildcards that don’t match any indices. Default is `true`.
expand_wildcards | String | Expands wildcard expressions to different indices. Combine multiple values with commas. Available values are `all` (match all indices), `open` (match open indices), `closed` (match closed indices), `hidden` (match hidden indices), and `none` (do not accept wildcard expressions), which must be used with `open`, `closed`, or both. Default is `open`.
ignore_unavailable | Boolean | If true, OpenSearch does not include missing or closed indices in the response.
master_timeout | Time | How long to wait for a connection to the master node. Default is `30s`.
timeout | Time | How long to wait for a response from the cluster. Default is `30s`.
write_index_only | Boolean | Whether OpenSearch should add the mapping only to write indexes. If false, OpenSearch can add the mapping to all indexes with the same alias. See [alias]({{site.url}}{{site.baseurl}}/opensearch/rest-api/alias/#request-body) for more information. Default is false.

## Request body

The request body must contain the `properties` object, which has all of the mappings that you want to add.

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
