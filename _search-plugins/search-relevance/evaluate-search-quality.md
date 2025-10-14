---
layout: default
title: Evaluating search quality
nav_order: 50
parent: Search Relevance Workbench
grand_parent: Search relevance
has_children: false
canonical_url: https://docs.opensearch.org/latest/search-plugins/search-relevance/evaluate-search-quality/
---

# Evaluating search quality

Search Relevance Workbench can run pointwise experiments to evaluate search configuration quality using provided queries and relevance judgments.

For more information about creating a query set, see [Query sets]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/query-sets/).

For more information about creating search configurations, see [Search Configurations]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/search-configurations/).

For more information about creating judgments, see [Judgments]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/judgments/).

## Creating a pointwise experiment

A pointwise experiment compares your search configuration results against provided relevance judgments to evaluate search quality.

### Example request

```json
PUT _plugins/_search_relevance/experiments
{
   	"querySetId": "a02cedc2-249d-41de-be3e-662f6f221689",
   	"searchConfigurationList": ["4f90e474-0806-4dd2-a8dd-0fb8a5f836eb"],
    "judgmentList": ["d3d93bb3-2cf4-4da0-8d31-c298427c2756"],
   	"size": 8,
   	"type": "POINTWISE_EVALUATION"
}
```

### Request body fields

The following table lists the available input parameters.

Field | Data type |  Description
:---  | :--- | :---
`querySetId` | String |	The ID of the query set.
`searchConfigurationList` | List | A list of search configuration IDs to use for comparison.
`judgmentList` | Array[String] | A list of judgment IDs to use for evaluating search accuracy.
`size` | Integer | The number of documents to return in the results.
`type` | String | The type of experiment to run. Valid values are `PAIRWISE_COMPARISON`, `HYBRID_OPTIMIZER`, or `POINTWISE_EVALUATION`. Depending on the experiment type, you must provide different body fields in the request. `PAIRWISE_COMPARISON` is for comparing two search configurations against a query set and is used [here]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/compare-query-sets/). `HYBRID_OPTIMIZER` is for combining results and is used [here]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/optimize-hybrid-search/). `POINTWISE_EVALUATION` is for evaluating a search configuration against judgments and is used [here]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/evaluate-search-quality/).

### Example response

```json
{
  "experiment_id": "d707fa0f-3901-4c8b-8645-9a17e690722b",
  "experiment_result": "CREATED"
}
```

## Managing the results

To retrieve experiment results, follow the same process used for [comparing query sets]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/compare-query-sets/) in pairwise experiments.

The following is an example completed response:

<details open markdown="block">
  <summary>
    Response
  </summary>

```json
{
    "took": 140,
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
                "_id": "bb609dc9-e357-42ec-a956-92b43be0a3ab",
                "_score": 1.0,
                "_source": {
                    "id": "bb609dc9-e357-42ec-a956-92b43be0a3ab",
                    "timestamp": "2025-06-13T08:06:46.046Z",
                    "type": "POINTWISE_EVALUATION",
                    "status": "COMPLETED",
                    "querySetId": "a02cedc2-249d-41de-be3e-662f6f221689",
                    "searchConfigurationList": [
                        "4f90e474-0806-4dd2-a8dd-0fb8a5f836eb"
                    ],
                    "judgmentList": [
                        "d3d93bb3-2cf4-4da0-8d31-c298427c2756"
                    ],
                    "size": 8,
                    "results": [
                        {
                            "evaluationId": "10c60fee-11ca-49b0-9e8a-82cb7b2c044b",
                            "searchConfigurationId": "4f90e474-0806-4dd2-a8dd-0fb8a5f836eb",
                            "queryText": "tv"
                        },
                        {
                            "evaluationId": "c03a5feb-8dc2-4f7f-9d31-d99bfb392116",
                            "searchConfigurationId": "4f90e474-0806-4dd2-a8dd-0fb8a5f836eb",
                            "queryText": "led tv"
                        }
                    ]
                }
            }
        ]
    }
}
```

</details>

The results include an evaluation result ID for each search configuration. To view detailed results, query the `search-relevance-evaluation-result` index using this ID.

The following is an example of the detailed results:

<details open markdown="block">
  <summary>
    Response
  </summary>

```json
{
    "took": 59,
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
                "_index": "search-relevance-evaluation-result",
                "_id": "10c60fee-11ca-49b0-9e8a-82cb7b2c044b",
                "_score": 1.0,
                "_source": {
                    "id": "10c60fee-11ca-49b0-9e8a-82cb7b2c044b",
                    "timestamp": "2025-06-13T08:06:40.869Z",
                    "searchConfigurationId": "4f90e474-0806-4dd2-a8dd-0fb8a5f836eb",
                    "searchText": "tv",
                    "judgmentIds": [
                        "d3d93bb3-2cf4-4da0-8d31-c298427c2756"
                    ],
                    "documentIds": [
                        "B07Q7VGW4Q",
                        "B00GXD4NWE",
                        "B07VML1CY1",
                        "B07THVCJK3",
                        "B07RKSV7SW",
                        "B010EAW8UK",
                        "B07FPP6TB5",
                        "B073G9ZD33"
                    ],
                    "metrics": [
                        {
                            "metric": "Coverage@8",
                            "value": 0.0
                        },
                        {
                            "metric": "Precision@8",
                            "value": 0.0
                        },
                        {
                            "metric": "MAP@8",
                            "value": 0.0
                        },
                        {
                            "metric": "NDCG@8",
                            "value": 0.0
                        }
                    ]
                }
            }
        ]
    }
}
```

</details>

The results include the original request parameters along with the following metric values:

- `Coverage@k`: The proportion of scored documents from the judgment set, calculated as the number of documents with scores divided by the total number of documents.


- `Precision@k`: The proportion of documents with nonzero judgment scores out of k (or out of the total number of returned documents, if lower).

- `MAP@k`: The Mean Average Precision, which calculates the average precision across all documents. For more information, see [Average precision](https://en.wikipedia.org/wiki/Evaluation_measures_(information_retrieval)#Average_precision).

- `NDCG@k`: The Normalized Discounted Cumulative Gain, which compares the actual ranking of results against a perfect ranking, with higher weights given to top results. This measures the quality of result ordering.

To review these results visually, see [Exploring search evaluation results]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/explore-experiment-results/).
