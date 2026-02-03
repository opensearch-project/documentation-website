---
layout: default
title: Experiments
nav_order: 9
parent: Search Relevance Workbench
grand_parent: Search relevance
has_children: false
has_toc: false
---

# Experiments

An _experiment_ is a controlled test designed to assess the effectiveness, relevance, or performance of a search engine or its algorithms. These experiments are typically conducted in order to evaluate how well a search system delivers useful results for specific queries.

Search Relevance Workbench offers multiple types of experiments. For more information, see [Available search result quality experiments]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/using-search-relevance-workbench/#available-search-result-quality-experiments).

## Managing experiments

You can retrieve or delete experiments using the following APIs.

### View an experiment

You can retrieve an experiment using the experiment ID.

#### Endpoint

```json
GET _plugins/_search_relevance/experiment/<experiment_id>
```

### Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `experiment_id` | String | The ID of the experiment to retrieve. |

#### Example request

```json
GET _plugins/_search_relevance/experiment/b54f791a-3b02-49cb-a06c-46ab650b2ade
```
{% include copy-curl.html %}

#### Example response

<details open markdown="block">
  <summary>
    Response
  </summary>

```json
{
  "took": 1,
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
        "_id": "47cc3861-c37b-43cc-99c4-c1e7c90b4674",
        "_score": 1,
        "_source": {
          "id": "47cc3861-c37b-43cc-99c4-c1e7c90b4674",
          "timestamp": "2026-01-28T18:16:44.548Z",
          "type": "PAIRWISE_COMPARISON",
          "status": "COMPLETED",
          "querySetId": "f4c35381-407c-45c7-89ec-094b8a4cd5b1",
          "searchConfigurationList": [
            "85f31a87-2833-4d4a-89d2-cc83248f410e",
            "050b8c98-ba63-4c75-89cb-75f379b0d66e"
          ],
          "judgmentList": [],
          "size": 10,
          "isScheduled": false,
          "scheduledExperimentJobId": null,
          "results": [
            {
              "snapshots": [
                {
                  "searchConfigurationId": "85f31a87-2833-4d4a-89d2-cc83248f410e",
                  "docIds": [
                    "B07K1H1G3M",
                    "B07THVCJK3",
                    "B07FPP6TB5",
                    "B07Q7Z9DJ3",
                    "B07PYPCX21",
                    "B07WLRKCNW",
                    "B01HE1IVNA",
                    "B07ZKDVHFB",
                    "B071D41YC3",
                    "B07B6L2QCF"
                  ]
                },
                {
                  "searchConfigurationId": "050b8c98-ba63-4c75-89cb-75f379b0d66e",
                  "docIds": [
                    "B07ZKDVHFB",
                    "B07FPP6TB5",
                    "B07THVCJK3",
                    "B071D41YC3",
                    "B07JD5RT4D",
                    "B079QHML21",
                    "B07ZZVX1F2",
                    "B07YNLBS7R",
                    "B01N1SSOUC",
                    "B07WLRKCNW"
                  ]
                }
              ],
              "metrics": [
                {
                  "metric": "jaccard",
                  "value": 0.33
                },
                {
                  "metric": "rbo50",
                  "value": 0.14
                },
                {
                  "metric": "rbo90",
                  "value": 0.32
                },
                {
                  "metric": "frequencyWeighted",
                  "value": 0.5
                }
              ],
              "query_text": "tv"
            },
            {
              "snapshots": [
                {
                  "searchConfigurationId": "85f31a87-2833-4d4a-89d2-cc83248f410e",
                  "docIds": [
                    "B07THVCJK3",
                    "B07FPP6TB5",
                    "B07PP4882Q",
                    "B07K1H1G3M",
                    "B091KB3W63",
                    "B07JN28KP3",
                    "B07Q7SGS6Z",
                    "B07SJZ9X6J",
                    "B07VNG9ZLM",
                    "B00DTOAWZ2"
                  ]
                },
                {
                  "searchConfigurationId": "050b8c98-ba63-4c75-89cb-75f379b0d66e",
                  "docIds": [
                    "B07THVCJK3",
                    "B091KB3W63",
                    "B07PP4882Q",
                    "B07RFFJ7YL",
                    "B08HGQ7H8F",
                    "B083BNQYBP",
                    "B07ZKDVHFB",
                    "B07N1CMGQQ",
                    "B07FPP6TB5",
                    "B071D41YC3"
                  ]
                }
              ],
              "metrics": [
                {
                  "metric": "jaccard",
                  "value": 0.25
                },
                {
                  "metric": "rbo50",
                  "value": 0.77
                },
                {
                  "metric": "rbo90",
                  "value": 0.58
                },
                {
                  "metric": "frequencyWeighted",
                  "value": 0.4
                }
              ],
              "query_text": "led tv"
            }
          ]
        }
      }
    ]
  }
}
```

</details>

### Delete an experiment

You can delete an experiment using the experiment ID.

#### Endpoint

```json
DELETE _plugins/_search_relevance/experiment/<experiment_id>
```

#### Example request

```json
DELETE _plugins/_search_relevance/experiment/47cc3861-c37b-43cc-99c4
```
{% include copy-curl.html %}

#### Example response

```json
{
  "_index": ".plugins-search-relevance-experiment",
  "_id": "47cc3861-c37b-43cc-99c4-c1e7c90b4674",
  "_version": 3,
  "result": "deleted",
  "forced_refresh": true,
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 6,
  "_primary_term": 1
}
```

### Search for an experiment

You can search for available experiments using query domain-specific language (DSL). By default, the `results` data is not returned in the response. To include the `results` data, specify the `_source` field in the query.

#### Endpoints

```json
GET _plugins/_search_relevance/experiment/_search
POST _plugins/_search_relevance/experiment/_search
```

#### Example request

Search for experiments that use a specific query set in order to measure search relevance performance:

```json
GET _plugins/_search_relevance/experiments/_search
{
  "query": {
    "term": { "querySetId": "f4c35381-407c-45c7-89ec-094b8a4cd5b1" }
  }
}
```
{% include copy-curl.html %}

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
      "value": 3,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": ".plugins-search-relevance-experiment",
        "_id": "47cc3861-c37b-43cc-99c4-c1e7c90b4674",
        "_score": 1,
        "_source": {
          "judgmentList": [],
          "size": 10,
          "scheduledExperimentJobId": null,
          "searchConfigurationList": [
            "85f31a87-2833-4d4a-89d2-cc83248f410e",
            "050b8c98-ba63-4c75-89cb-75f379b0d66e"
          ],
          "isScheduled": false,
          "id": "47cc3861-c37b-43cc-99c4-c1e7c90b4674",
          "type": "PAIRWISE_COMPARISON",
          "timestamp": "2026-01-28T18:16:44.548Z",
          "status": "COMPLETED",
          "querySetId": "f4c35381-407c-45c7-89ec-094b8a4cd5b1"
        }
      },
      {
        "_index": ".plugins-search-relevance-experiment",
        "_id": "90e4a31b-3b4a-4b2e-b492-0399358961cc",
        "_score": 1,
        "_source": {
          "judgmentList": [
            "505d00cf-2fce-422b-bb97-2e3a95ce9446"
          ],
          "size": 8,
          "scheduledExperimentJobId": null,
          "searchConfigurationList": [
            "85f31a87-2833-4d4a-89d2-cc83248f410e"
          ],
          "isScheduled": false,
          "id": "90e4a31b-3b4a-4b2e-b492-0399358961cc",
          "type": "POINTWISE_EVALUATION",
          "timestamp": "2026-01-28T18:16:45.696Z",
          "status": "COMPLETED",
          "querySetId": "f4c35381-407c-45c7-89ec-094b8a4cd5b1"
        }
      },
      {
        "_index": ".plugins-search-relevance-experiment",
        "_id": "71608f58-4827-4cd3-b6a6-61a527975a23",
        "_score": 1,
        "_source": {
          "judgmentList": [
            "505d00cf-2fce-422b-bb97-2e3a95ce9446"
          ],
          "size": 10,
          "scheduledExperimentJobId": null,
          "searchConfigurationList": [
            "97f5b450-9571-469d-9dbb-347f94d164ba"
          ],
          "isScheduled": false,
          "id": "71608f58-4827-4cd3-b6a6-61a527975a23",
          "type": "HYBRID_OPTIMIZER",
          "timestamp": "2026-01-28T18:17:00.811Z",
          "status": "COMPLETED",
          "querySetId": "f4c35381-407c-45c7-89ec-094b8a4cd5b1"
        }
      }
    ]
  }
}
```
