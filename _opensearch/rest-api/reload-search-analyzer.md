---
layout: default
title: Reload search analyzer
parent: REST API reference
nav_order: 83
---

# Reload search analyzer

The reload search analyzer API operation picks up any changes to [synonym](https://opensearch.org/docs/latest/opensearch/ux/) files for any configured [search analyzers](https://opensearch.org/docs/latest/im-plugin/refresh-analyzer/index/). The reload search analyzer request needs to be run on all nodes. Additionally, the synonym token filter must be set to `true`.

## Path and HTTP methods

```
POST /<index>/_reload_search_analyzers
GET /<index>/_reload_search_analyzers
```

## Request body parameters

Request body parameters are optional.

Field Type | Data Type | Description
:--- | :--- | :---
[`allow_no_indices`](#allow_no_indices) | boolean | When set to `false`, an error is returned for indicies that are closed or missing that match any wildcard expression. Default is set to `true`.
[`expand_wildcards`](#expand_wildcards) | string | Allows you to set the wildcards that can be matched to a type of index. Available options are `open`, `closed`, `all`, `none`, and `hidden`. Default is set to `open`.
[`ignore_unavailable`](#ignore_unavailable) | boolean | If an index is closed or missing, an error is returned when ignore_unavailable is set to `false`. Default is set to `false`.

## Examples

Request:

````json
POST /shakespeare/_reload_search_analyzers
````
 
Response body:

````json
{
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "reload_details": [
    {
      "index": "shakespeare",
      "reloaded_analyzers": [
        "analyzers-synonyms-test"
      ],
      "reloaded_node_ids": [
        "opensearch-node1"
      ]
    }
  ]
}
````