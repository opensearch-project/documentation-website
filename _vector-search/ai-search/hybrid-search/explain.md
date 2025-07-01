---
layout: default
title: Hybrid search explain
parent: Hybrid search
grand_parent: AI search
has_children: false
nav_order: 70
---

# Hybrid search explain
**Introduced 2.19**
{: .label .label-purple }

You can provide the `explain` parameter to understand how scores are calculated, normalized, and combined in hybrid queries. When enabled, it provides detailed information about the scoring process for each search result. This includes revealing the score normalization techniques used, how different scores were combined, and the calculations for individual subquery scores. This comprehensive insight makes it easier to understand and optimize your hybrid query results. For more information about `explain`, see [Explain API]({{site.url}}{{site.baseurl}}/api-reference/explain/). 

`explain` is an expensive operation in terms of both resources and time. For production clusters, we recommend using it sparingly for the purpose of troubleshooting.
{: .warning }

You can provide the `explain` parameter in a URL when running a complete hybrid query using the following syntax:

```json
GET <index>/_search?search_pipeline=<search_pipeline>&explain=true
POST <index>/_search?search_pipeline=<search_pipeline>&explain=true
```

To use the `explain` parameter, you must configure the `hybrid_score_explanation` response processor in your search pipeline. For more information, see [Hybrid score explanation processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/explanation-processor/). 

You can also use `explain` with the individual document ID:

```json
GET <index>/_explain/<id>
POST <index>/_explain/<id>
```

In this case, the result will contain only low-level scoring information, for example, [Okapi BM25](https://en.wikipedia.org/wiki/Okapi_BM25) scores for text-based queries such as `term` or `match`. For an example response, see [Explain API example response]({{site.url}}{{site.baseurl}}/api-reference/explain/#example-response).

To see the `explain` output for all results, set the parameter to `true` either in the URL or in the request body:

```json
POST my-nlp-index/_search?search_pipeline=my_pipeline&explain=true
{
  "_source": {
    "exclude": [
      "passage_embedding"
    ]
  },
  "query": {
    "hybrid": {
      "queries": [
        {
          "match": {
            "text": {
              "query": "horse"
            }
          }
        },
        {
          "neural": {
            "passage_embedding": {
              "query_text": "wild west",
              "model_id": "aVeif4oB5Vm0Tdw8zYO2",
              "k": 5
            }
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

The response contains scoring information:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
    "took": 54,
    "timed_out": false,
    "_shards": {
        "total": 2,
        "successful": 2,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 5,
            "relation": "eq"
        },
        "max_score": 0.9251075,
        "hits": [
            {
                "_shard": "[my-nlp-index][0]",
                "_node": "IsuzeVYdSqKUfy0qfqil2w",
                "_index": "my-nlp-index",
                "_id": "5",
                "_score": 0.9251075,
                "_source": {
                    "text": "A rodeo cowboy , wearing a cowboy hat , is being thrown off of a wild white horse .",
                    "id": "2691147709.jpg"
                },
                "_explanation": {
                    "value": 0.9251075,
                    "description": "arithmetic_mean combination of:",
                    "details": [
                        {
                            "value": 1.0,
                            "description": "min_max normalization of:",
                            "details": [
                                {
                                    "value": 1.2336599,
                                    "description": "weight(text:horse in 0) [PerFieldSimilarity], result of:",
                                    "details": [
                                        {
                                            "value": 1.2336599,
                                            "description": "score(freq=1.0), computed as boost * idf * tf from:",
                                            "details": [
                                                {
                                                    "value": 2.2,
                                                    "description": "boost",
                                                    "details": []
                                                },
                                                {
                                                    "value": 1.2039728,
                                                    "description": "idf, computed as log(1 + (N - n + 0.5) / (n + 0.5)) from:",
                                                    "details": [
                                                        {
                                                            "value": 1,
                                                            "description": "n, number of documents containing term",
                                                            "details": []
                                                        },
                                                        {
                                                            "value": 4,
                                                            "description": "N, total number of documents with field",
                                                            "details": []
                                                        }
                                                    ]
                                                },
                                                {
                                                    "value": 0.46575344,
                                                    "description": "tf, computed as freq / (freq + k1 * (1 - b + b * dl / avgdl)) from:",
                                                    "details": [
                                                        {
                                                            "value": 1.0,
                                                            "description": "freq, occurrences of term within document",
                                                            "details": []
                                                        },
                                                        {
                                                            "value": 1.2,
                                                            "description": "k1, term saturation parameter",
                                                            "details": []
                                                        },
                                                        {
                                                            "value": 0.75,
                                                            "description": "b, length normalization parameter",
                                                            "details": []
                                                        },
                                                        {
                                                            "value": 16.0,
                                                            "description": "dl, length of field",
                                                            "details": []
                                                        },
                                                        {
                                                            "value": 17.0,
                                                            "description": "avgdl, average length of field",
                                                            "details": []
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "value": 0.8503647,
                            "description": "min_max normalization of:",
                            "details": [
                                {
                                    "value": 0.015177966,
                                    "description": "within top 5",
                                    "details": []
                                }
                            ]
                        }
                    ]
...
```
</details>

## Response body fields

Field | Description
:--- | :---
`explanation` | The `explanation` object has three properties: `value`, `description`, and `details`. The `value` property shows the result of the calculation, `description` explains what type of calculation was performed, and `details` shows any subcalculations performed. For score normalization, the information in the `description` property includes the technique used for normalization or combination and the corresponding score. 

## Next steps

- To learn how to use `explain` with inner hits, see [Using inner hits in hybrid queries]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/inner-hits/).
