---
layout: default
title: Refresh search analyzer
parent: Tuning indexes
nav_order: 10
has_toc: false
redirect_from: 
  - /query-dsl/analyzers/refresh-analyzer/
  - /im-plugin/refresh-analyzer/index/
---

# Refresh search analyzer

Use the Refresh Search Analyzer API to apply a change to a search analyzer's resource files in real time. For example, if you change the synonym list in your analyzer, the change takes effect without you needing to close and reopen the index:

```json
POST /_plugins/_refresh_search_analyzers/{index}
```
{% include copy-curl.html %}

## Path parameters

The following table lists the available path parameters. All path parameters are required.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `index` | String | A comma-separated list of indexes, data streams, or index aliases to which the operation is applied. Supports wildcard expressions (`*`). Use `_all` or `*` to specify all indexes and data streams in a cluster. |

## Query parameters

The following table lists the supported query parameters.

Parameter | Data type | Description
:--- | :--- | :---
`reload_cached_resources` | Boolean | When set to `true`, reloads cached resources from disk without rebuilding caches for token filters that load files from disk (for example, the [`hunspell`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/hunspell/) filter's dictionary files). When `false` (the default), analyzer factories are rebuilt but cached resources are reused.

## Making a token filter updatable

A token filter is only refreshed if it has an `updateable` flag of `true`. An updatable filter can be used only in a search analyzer, not in an index analyzer, because existing documents are not reanalyzed. The following request creates an index with an updatable synonym filter and applies it as the search analyzer for the `desc` field:

```json
PUT /synonym_index
{
  "settings": {
    "index": {
      "analysis": {
        "analyzer": {
          "my_synonyms": {
            "tokenizer": "whitespace",
            "filter": [
              "synonym"
            ]
          }
        },
        "filter": {
          "synonym": {
            "type": "synonym_graph",
            "synonyms_path": "analysis/synonyms.txt",
            "updateable": true
          }
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "desc": {
        "type": "text",
        "analyzer": "standard",
        "search_analyzer": "my_synonyms"
      }
    }
  }
}
```
{% include copy-curl.html %}

The `synonyms_path` is relative to the `config` directory of each node. After you edit the file, refresh the analyzer:

```json
POST /_plugins/_refresh_search_analyzers/synonym_index
```
{% include copy-curl.html %}

## Example response

The response lists the analyzers that were refreshed in each index:

```json
{
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "successful_refresh_details": [
    {
      "index": "synonym_index",
      "refreshed_analyzers": [
        "my_synonyms"
      ]
    }
  ]
}
```

Searches against `desc` now use the updated synonym list.

