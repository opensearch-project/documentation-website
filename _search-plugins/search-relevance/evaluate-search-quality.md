---
layout: default
title: Evaluate search quality
nav_order: 65
parent: Using Search Relevance Workbench
grand_parent: Search relevance
has_children: false
has_toc: false
---

# Evaluating search quality

An application of running the search relevance workbench experiments is to evaluate the quality of search configurations given judgments and queries. 

To create the query set refer [here]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/query-sets/).

To create the search configuration refer here. 
[comment]: <> (TODO: add the link to search configurations here. )

To create the judgments, refer [here]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/judgments/). 

## Creating a pointwise experiment

In creating a pointwise experiment, your evaluation of a search configuration will be tested against the provided judgments. 

### Example Request:

```json
PUT _plugins/_search_relevance/experiments
{
   	"querySetId": "7889ffe9-835e-4f48-a9cd-53905bb967d3",
   	"searchConfigurationList": ["6a58fc84-6bdc-4e06-ad8a-c91e60d335e8"],
    "judgmentList": ["18f652c5-9813-4163-b227-63aa2678873e"],
   	"size": 8,
   	"type": "POINTWISE_EVALUATION"
}
```

### Request body fields

The following lists the input parameters.

Field | Data type |  Description
:---  | :--- | :---
`querySetId` | String |	The id of the query set.
`searchConfigurationList` | List[String] | A list of search configuration ids to use for comparing.
`judgmentList` | List[String] | A list of judgment ids to use for evaluating the accuracy of the search.
`size` | Integer | How many documents to return in the results
`type` | String | Defines the type of experiment to run. One of `PAIRWISE_COMPARISON`, `HYBRID_OPTIMIZER`, `POINTWISE_EVALUATION`. However, the body fields will change depending on the type of chosen. 

### Example Response: 

```json
{
  "experiment_id": "d707fa0f-3901-4c8b-8645-9a17e690722b",
  "experiment_result": "CREATED"
}
```

## Managing the results

For retrieving the results of the experiment, the process will be the same as running the pairwise experiment when [comparing query sets]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/conpare-query-sets/).

### Example completed response:

```json
{
    "took": 11,
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
                "_id": "d707fa0f-3901-4c8b-8645-9a17e690722b",
                "_score": 1.0,
                "_source": {
                    "id": "d707fa0f-3901-4c8b-8645-9a17e690722b",
                    "timestamp": "2025-06-12T04:18:45.979Z",
                    "type": "POINTWISE_EVALUATION",
                    "status": "COMPLETED",
                    "querySetId": "7889ffe9-835e-4f48-a9cd-53905bb967d3",
                    "searchConfigurationList": [
                        "6a58fc84-6bdc-4e06-ad8a-c91e60d335e8"
                    ],
                    "judgmentList": [
                        "18f652c5-9813-4163-b227-63aa2678873e"
                    ],
                    "size": 8,
                    "results": {
                        "tv": {
                            "6a58fc84-6bdc-4e06-ad8a-c91e60d335e8": "e96d52c2-f495-40ff-85c4-1d75bf70c85d"
                        },
                        "led tv": {
                            "6a58fc84-6bdc-4e06-ad8a-c91e60d335e8": "57e981dd-333f-4079-b659-9c46235dd94f"
                        }
                    }
                }
            }
        ]
    }
}
```

This time in the results, for every search configuration, there is the id of the evaluation result

TODO: Show how to retrieve the evaluation result and what the meaning is. 
