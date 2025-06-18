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

To compare the results of two different search configurations, you can run a pairwise experiment. The building blocks for comparing search configurations is to first have your two search configurations available, then have a query set to use for the search configuration.

For more information about creating a query set, see [Query Sets]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/query-sets/).

For more information on how to create search configurations, see [Search Configurations]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/search-configurations/).

## Creating a pairwise experiment

An experiment is used to compare the metrics between two different search configurations. You will be shown the top N results for every query based on the specified search configurations. In the dashboard, you will be able to "eyeball" the returned documents from any of the queries in the query set, and determine which search configuration returns the more accurate document id set. In addition, there will be some metrics to measure the similarity between the two returned search result lists.

### Example Request:

```json
PUT _plugins/_search_relevance/experiments
{
    "querySetId": "8368a359-146b-4690-b756-40591b2fcddb",
   	"searchConfigurationList": ["a5acc9f3-6ad7-43f4-9651-fe118c499bc6", "26c7255c-c36e-42fb-b5b2-633dbf8e53b6"],
   	"size": 10,
   	"type": "PAIRWISE_COMPARISON"
}
```

### Request body fields

The following lists the input parameters.

Field | Data type |  Description
:---  | :--- | :---
`querySetId` | String |	The id of the query set.
`searchConfigurationList` | Array[String] | A list of search configuration ids to use for comparing.
`size` | Integer | How many documents to return in the results
`type` | String | Defines the type of experiment to run. One of `PAIRWISE_COMPARISON`, `HYBRID_OPTIMIZER`, `POINTWISE_EVALUATION`. However, the body fields will change depending on the type of experiment.

### Example Response:

```json
{
    "experiment_id": "cbd2c209-96d1-4012-aa73-e524b7a1b11a",
    "experiment_result": "CREATED"
}
```
## Interpreting the experiment results

### Retrieving the experiment results

To get the result of a specific experiment, you can make a get request.

#### Endpoint:

```json
GET _plugins/_search_relevance/experiments/<experiment_id>
```

#### Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `experiment_id` | String | The ID of the experiment to retrieve. |

#### Example request:

```json
GET _plugins/_search_relevance/experiments/cbd2c209-96d1-4012-aa73-e524b7a1b11a
```

#### Example response:

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

To retrieve the result of all experiments, you can make another get request without specifying the `experiment_id` in the path.

#### Endpoint:

```json
GET _plugins/_search_relevance/experiments
```

#### Example request:

```json
GET _plugins/_search_relevance/experiments
```

#### Example response:

```json
{
  "took": 5,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": null,
    "hits": [
      {
        "_index": ".plugins-search-relevance-experiment",
        "_id": "36dca330-f662-4347-b8c8-6cfbc4e98007",
        "_score": null,
        "_source": {
          "id": "36dca330-f662-4347-b8c8-6cfbc4e98007",
          "timestamp": "2025-06-11T23:24:27.878Z",
          "type": "POINTWISE_EVALUATION",
          "status": "PROCESSING",
          "querySetId": "8368a359-146b-4690-b756-40591b2fcddb",
          "searchConfigurationList": [
            "a5acc9f3-6ad7-43f4-9651-fe118c499bc6"
          ],
          "judgmentList": [
            "e3bef266-235d-4423-a9f5-00d6e8cdee65"
          ],
          "size": 8,
          "results": {}
        },
        "sort": [
          1749684267878
        ]
      },
      {
        "_index": ".plugins-search-relevance-experiment",
        "_id": "cbd2c209-96d1-4012-aa73-e524b7a1b11a",
        "_score": null,
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
        },
        "sort": [
          1749684266792
        ]
      }
    ]
  }
}
```

The completion of the experiment is actually an asynchronous process, therefore, the status could still be processing like in the preceeding response. However, after waiting for the processes to complete, the results should be available.

#### Example completed response:

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

### Meaning of the results

As shown in the preceeding response, in the results, for both search configurations, the top N documents are returned with 10 specified as the size during the search request. However, there are also metrics on the pairwise comparison.

Jaccard metric: This will show the simularity score by dividing the intersection cardinality by the union cardinality of the returned documents.

RBO: The RBO metric is the Rank-Biased Overlap metric. This compares the returned sets at every depth. For example, it would compare the top documents of each configuration, the top 2 documents,... and would place higher importance on the earlier comparisons.

Frequency Weighted: This is similar to the Jaccard metric in that it calculates the weights of the intersection divided by the weights of the union. However, the weights are skewed towards the documents with higher frequencies.
