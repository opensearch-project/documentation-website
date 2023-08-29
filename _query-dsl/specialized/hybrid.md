---
layout: default
title: Hybrid
parent: Specialized queries
grand_parent: Query DSL
nav_order: 20
---

# Hybrid query

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/neural-search/issues/244).    
{: .warning}

Use a hybrid query to combine relevance scores from multiple queries into one score for a given document. A hybrid query contains a list of one or more queries 


```json
POST flicker-index/_search?search_pipeline=normalizationPipeline
{
  "query": {
    "hybrid": {
      "queries": [
        {
          "neural": {
            "passage_embedding": {
              "query_text": "Girl with Brown Hair",
              "model_id": "ABCBMODELID",
              "k": 20
            }
          }
        },
        {
          "match": {
            "passage_text": "Girl Brown hair"
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}