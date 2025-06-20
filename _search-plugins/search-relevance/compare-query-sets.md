---
layout: default
title: Comparing query sets
nav_order: 12
parent: Using Search Relevance Workbench
grand_parent: Search relevance
has_children: false
has_toc: false
---

# Comparing query sets

To compare the results of two different search configurations, you can run a pairwise experiment. To achieve this, you need two search configurations and a query set to use for the search configuration.


For more information about creating a query set, see [Query Sets]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/query-sets/).

For more information about creating search configurations, see [Search Configurations]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/search-configurations/).

## Creating a pairwise experiment

An experiment is used to compare the metrics between two different search configurations. An experiment shows you the top N results for every query based on the specified search configurations. In the dashboard, you can view the returned documents from any of the queries in the query set and determine which search configuration returns more relevant results. Additionally, you can measure the similarity between the two returned search result lists using the provided similarity metrics.

### Example

To create a pairwise comparison experiment for the specified query set an search configurations, send the following request:

```json
PUT _plugins/_search_relevance/experiments
{
    "querySetId": "8368a359-146b-4690-b756-40591b2fcddb",
   	"searchConfigurationList": ["a5acc9f3-6ad7-43f4-9651-fe118c499bc6", "26c7255c-c36e-42fb-b5b2-633dbf8e53b6"],
   	"size": 10,
   	"type": "PAIRWISE_COMPARISON"
}
```
{% include copy-curl.html %}

### Request body fields

The following lists the input parameters.

Field | Data type |  Description
:---  | :--- | :---
`querySetId` | String |	The query set ID.
`searchConfigurationList` | List | A list of search configuration IDs to use for comparison.
`size` | Integer | The number of documents to return in the results.
`type` | String | Defines the type of experiment to run. Valid values are `PAIRWISE_COMPARISON`, `HYBRID_OPTIMIZER`, `POINTWISE_EVALUATION`. Depending on the experiment type, you must provide different body fields in the request. `PAIRWISE_COMPARISON` is for comparing two search configurations against a query set and is used [here]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/compare-query-sets/). `HYBRID_OPTIMIZER` is for combining results and is used [here]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/optimize-hybrid-search/). `POINTWISE_EVALUATION` is to evaluate a search configuration against judgments and is used [here]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/evaluate-search-quality/). 

The response contains the experiment ID of the created experiment:

```json
{
    "experiment_id": "cbd2c209-96d1-4012-aa73-e524b7a1b11a",
    "experiment_result": "CREATED"
}
```
## Interpreting the experiment results
To interpret the experiment results, use the following operations.

### Retrieving the experiment results

Use the following API to retrieve the result of a specific experiment.

#### Endpoint

```json
GET _plugins/_search_relevance/experiments
GET _plugins/_search_relevance/experiments/<experiment_id>
```

#### Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `experiment_id` | String | The ID of the experiment to retrieve. Retrieves all experiments when empty. |

#### Example request

```json
GET _plugins/_search_relevance/experiments/cbd2c209-96d1-4012-aa73-e524b7a1b11a
```

#### Example response

```json
{
  "took": 2,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": ".plugins-search-relevance-experiment",
        "_id": "cbd2c209-96d1-4012-aa73-e524b7a1b11a",
        "_score": 1,
        "_source": {
          "id": "cbd2c209-96d1-4012-aa73-e524b7a1b11a",
          "timestamp": "2025-06-11T23:24:26.792Z",
          "type": "PAIRWISE_COMPARISON",
          "status": "PROCESSING",
          "querySetId": "8368a359-146b-4690-b756-40591b2fcddb",
          "searchConfigurationList": [
            "a5acc9f3-6ad7-43f4-9651-fe118c499bc6",
            "26c7255c-c36e-42fb-b5b2-633dbf8e53b6"
          ],
          "judgmentList": [],
          "size": 10,
          "results": {}
        }
      }
    ]
  }
}
```

Once the experiment finishes running, the results are available:

<details open markdown="block">
  <summary>
    Response
  </summary>

```json
{
    "took": 34,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 1,
            "relation": "eq"
        },
        "max_score": 1.0,
        "hits": [
            {
                "_index": ".plugins-search-relevance-experiment",
                "_id": "cbd2c209-96d1-4012-aa73-e524b7a1b11a",
                "_score": 1.0,
                "_source": {
                    "id": "cbd2c209-96d1-4012-aa73-e524b7a1b11a",
                    "timestamp": "2025-06-12T04:18:37.284Z",
                    "type": "PAIRWISE_COMPARISON",
                    "status": "COMPLETED",
                    "querySetId": "7889ffe9-835e-4f48-a9cd-53905bb967d3",
                    "searchConfigurationList": [
                        "a5acc9f3-6ad7-43f4-9651-fe118c499bc6",
                        "26c7255c-c36e-42fb-b5b2-633dbf8e53b6"
                    ],
                    "judgmentList": [],
                    "size": 10,
                    "results": {
                        "tv": {
                            "26c7255c-c36e-42fb-b5b2-633dbf8e53b6": [
                                "B07X3S9RTZ",
                                "B07WVZFKLQ",
                                "B00GXD4NWE",
                                "B07ZKCV5K5",
                                "B07ZKDVHFB",
                                "B086VKT9R8",
                                "B08XLM8YK1",
                                "B07FPP6TB5",
                                "B07N1TMNHB",
                                "B09CDHM8W7"
                            ],
                            "pairwiseComparison": {
                                "jaccard": 0.11,
                                "rbo90": 0.16,
                                "frequencyWeighted": 0.2,
                                "rbo50": 0.07
                            },
                            "a5acc9f3-6ad7-43f4-9651-fe118c499bc6": [
                                "B07Q7VGW4Q",
                                "B00GXD4NWE",
                                "B07VML1CY1",
                                "B07THVCJK3",
                                "B07RKSV7SW",
                                "B010EAW8UK",
                                "B07FPP6TB5",
                                "B073G9ZD33",
                                "B07VXRXRJX",
                                "B07Q45SP9P"
                            ]
                        },
                        "led tv": {
                            "26c7255c-c36e-42fb-b5b2-633dbf8e53b6": [
                                "B01M1D0KL1",
                                "B07YSMD3Z9",
                                "B07V4CY9GZ",
                                "B074KFP426",
                                "B07S8XNWWF",
                                "B07XBJR7GY",
                                "B075FDWSHT",
                                "B01N2Z17MS",
                                "B07F1T4JFB",
                                "B07S658ZLH"
                            ],
                            "pairwiseComparison": {
                                "jaccard": 0.11,
                                "rbo90": 0.13,
                                "frequencyWeighted": 0.2,
                                "rbo50": 0.03
                            },
                            "a5acc9f3-6ad7-43f4-9651-fe118c499bc6": [
                                "B07Q45SP9P",
                                "B074KFP426",
                                "B07JKVKZX8",
                                "B07THVCJK3",
                                "B0874XJYW8",
                                "B08LVPWQQP",
                                "B07V4CY9GZ",
                                "B07X3BS3DF",
                                "B074PDYLCZ",
                                "B08CD9MKLZ"
                            ]
                        }
                    }
                }
            }
        ]
    }
}
```
</details>

### Interpreting the results

As shown in the preceding response, both search configurations return the top N documents, with `size` set to 10 in the search request. In addition to the results, the response also includes metrics from the pairwise comparison.

### Response body fields

Field | Description
:--- | :---
`jaccard` | Shows the similarity score by dividing the intersection cardinality by the union cardinality of the returned documents.
`RBO` | The Rank-Biased Overlap (RBO) metric compares the returned result sets at each ranking depth—for example, the top 1 document, top 2 documents, and so on. It places greater importance on higher-ranked results, giving more weight to earlier positions in the list.
`Frequency Weighted` | Similar to the Jaccard metric, the frequency weighted metric calculates the ratio of the weighted intersection to the weighted union of two sets. However, unlike standard Jaccard, it gives more weight to documents with higher frequencies, skewing the result toward more frequently occurring items.
