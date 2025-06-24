---
layout: default
title: Refresh search analyzer
nav_order: 50
has_toc: false
redirect_from: 
  - /query-dsl/analyzers/refresh-analyzer/
  - /im-plugin/refresh-analyzer/index/
canonical_url: https://docs.opensearch.org/docs/latest/im-plugin/refresh-analyzer/
---

# Refresh search analyzer

You can refresh search analyzers in real time using the following API. This requires the [Index State Management]({{site.url}}{{site.baseurl}}/im-plugin/ism/index/) (ISM) plugin to be installed. For more information, see [Installing plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/).

```json
POST /_plugins/_refresh_search_analyzers/<index or alias or wildcard>
```
For example, if you change the synonym list in your analyzer, the change takes effect without you needing to close and reopen the index.

To work, the token filter must have an `updateable` flag of `true`:

```json
{
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
      "synonyms_path": "synonyms.txt",
      "updateable": true
    }
  }
}
```
