---
layout: default
title: Reload search analyzer
nav_order: 65
---

# Reload search analyzer

The reload search analyzer API operation detects any changes to [synonym]({{site.url}}{{site.baseurl}}/opensearch/ux/) files for any configured [search analyzers]({{site.url}}{{site.baseurl}}/im-plugin/refresh-analyzer/index/). The reload search analyzer request needs to be run on all nodes. Additionally, the synonym token filter must be set to `true`.

## Path and HTTP methods

```
POST /<index>/_reload_search_analyzers
GET /<index>/_reload_search_analyzers
```

## Request body fields

Request body parameters are optional.

Field Type | Data type | Description
:--- | :--- | :---
allow_no_indices | Boolean | When set to `false`, an error is returned for indexes that are closed or missing and match any wildcard expression. Default is set to `true`.
expand_wildcards | String | Allows you to set the wildcards that can be matched to a type of index. Available options are `open`, `closed`, `all`, `none`, and `hidden`. Default is set to `open`.
ignore_unavailable | Boolean | If an index is closed or missing, an error is returned when ignore_unavailable is set to `false`. Default is set to `false`.

## Examples

The following are an example request and response.

#### Example request

````json
POST /shakespeare/_reload_search_analyzers
````
{% include copy-curl.html %}
 
#### Example response

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