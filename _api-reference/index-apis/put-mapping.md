---
layout: default
title: Create or update mappings
parent: Index settings and mappings
grand_parent: Index APIs
nav_order: 30
redirect_from:
  - /opensearch/rest-api/index-apis/put-mapping/
  - /opensearch/rest-api/index-apis/update-mapping/
  - /opensearch/rest-api/update-mapping/
---

# Create Or Update Mappings API
**Introduced 1.0**
{: .label .label-purple }

If you want to create or add mappings and fields to an index, you can use the put mapping API operation. For an existing mapping, this operation updates the mapping.

You can't use this operation to update mappings that already map to existing data in the index. You must first create a new index with your desired mappings, and then use the [reindex API operation]({{site.url}}{{site.baseurl}}/opensearch/reindex-data) to map all the documents from your old index to the new index. If you don't want any downtime while you re-index your indexes, you can use [aliases]({{site.url}}{{site.baseurl}}/opensearch/index-alias).

## Endpoints

```json
PUT /<target-index>/_mapping
PUT /<target-index1>,<target-index2>/_mapping
```


## Path parameters

The only required path parameter is the index with which to associate the mapping. If you don't specify an index, you will get an error. You can specify a single index, or multiple indexes separated by a comma as follows:

```json
PUT /<target-index>/_mapping
PUT /<target-index1>,<target-index2>/_mapping
```

## Query parameters

Optionally, you can add query parameters to make a more specific request. For example, to skip any missing or closed indexes in the response, you can add the `ignore_unavailable` query parameter to your request as follows:

```json
PUT /sample-index/_mapping?ignore_unavailable
```

The following table defines the put mapping query parameters:

Parameter | Data type | Description
:--- | :--- | :---
allow_no_indices | Boolean | Whether to ignore wildcards that don’t match any indexes. Default is `true`.
expand_wildcards | String | Expands wildcard expressions to different indexes. Combine multiple values with commas. Available values are `all` (match all indexes), `open` (match open indexes), `closed` (match closed indexes), `hidden` (match hidden indexes), and `none` (do not accept wildcard expressions), which must be used with `open`, `closed`, or both. Default is `open`.
ignore_unavailable | Boolean | If true, OpenSearch does not include missing or closed indexes in the response.
cluster_manager_timeout | Time | How long to wait for a connection to the cluster manager node. Default is `30s`.
timeout | Time | How long to wait for the response to return. Default is `30s`.
write_index_only | Boolean | Whether OpenSearch should apply mapping updates only to the write index.

## Request body fields

### properties

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

### dynamic

You can make the document structure match the structure of the index mapping by setting the `dynamic` request body field to `strict`, as seen in the following example:

```json
{
  "dynamic": "strict",
  "properties":{
    "color":{
      "type": "text"
    }
  }
}
```


## Example request

The following request creates a new mapping for the `sample-index` index:

<!-- spec_insert_start
component: example_code
rest: PUT /sample-index/_mapping
body: |
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
-->
{% capture step1_rest %}
PUT /sample-index/_mapping
{
  "properties": {
    "age": {
      "type": "integer"
    },
    "occupation": {
      "type": "text"
    }
  }
}
{% endcapture %}

{% capture step1_python %}


response = client.indices.put_mapping(
  index = "sample-index",
  body =   {
    "properties": {
      "age": {
        "type": "integer"
      },
      "occupation": {
        "type": "text"
      }
    }
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

Upon success, the response returns `"acknowledged": true`.

```json
{
    "acknowledged": true
}
```


