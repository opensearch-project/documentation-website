---
layout: default
title: Evaluate search quality
nav_order: 50
parent: Using Search Relevance Workbench
grand_parent: Search relevance
has_children: false
has_toc: false
---

# Evaluating search quality

An application of running the search relevance workbench experiments is to evaluate the quality of search configurations given judgments and queries, also called a pointwise experiment.

For more information about how to create a query set, see [Query Sets]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/query-sets/).

For more information about how to create search configurations, see [Search Configurations]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/search-configurations/).

For more information about how to create the judgments, see [Judgments]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/judgments/).

## Creating a pointwise experiment

In creating a pointwise experiment, your evaluation of a search configuration will be tested against the provided judgments.

### Example request:

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

The following lists the input parameters.

Field | Data type |  Description
:---  | :--- | :---
`querySetId` | String |	The id of the query set.
`searchConfigurationList` | Array[String] | A list of search configuration ids to use for comparing.
`judgmentList` | Array[String] | A list of judgment ids to use for evaluating the accuracy of the search.
`size` | Integer | How many documents to return in the results
`type` | String | Defines the type of experiment to run. One of `PAIRWISE_COMPARISON`, `HYBRID_OPTIMIZER`, `POINTWISE_EVALUATION`. However, the body fields will change depending on the type of chosen.

### Example response:

```json
{
  "experiment_id": "d707fa0f-3901-4c8b-8645-9a17e690722b",
  "experiment_result": "CREATED"
}
```

## Managing the results

For retrieving the results of the experiment, the process will be the same as running the pairwise experiment when [comparing query sets]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/compare-query-sets/).

### Example completed response:

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

This time in the results, for every search configuration, there is the id of the evaluation result. When you query for the id, you would have to query the `search-relevance-evaluation-result` index.

### Example evaluation metrics

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

The usual parameters that were added to the put requests are returned, but there is also the metric values.

Coverage@k: The proportion of documents with scores from the judgment which is the amount of documents with scores divided by the total amount of documents.

Precision@k: This would be the proportion of documents with nonzero judgment scores out of k or the number of documents returned, whichever is lower.

MAP@k: The Mean Average Precision is the average of the precisions out of the number of documents. For more details, check [here](https://en.wikipedia.org/wiki/Evaluation_measures_(information_retrieval)#Average_precision)

- `NDCG@k`: The Normalized Discounted Cumulative Gain, which compares the actual ranking of results against a perfect ranking, with higher weights given to top results. This measures the quality of result ordering.
