---
layout: default
title: Judgments
nav_order: 80
parent: Using Search Relevance Workbench
grand_parent: Search relevance
has_children: false
has_toc: false
---

# Judgments

A judgment is a rating that describes the relevance of one particular document for a given query. Multiple judgments are grouped together to judgment lists.
Typically, judgments are categorized into two types: implicit and explicit.

* Implicit judgments are ratings that were derived from user behavior (for example what was seen and what was clicked after searching?)
* Explicit judgments were traditionally done by humans, nowadays LLMs increasingly take over this role.

The Search Relevance Workbench supports all types of judgments:

* The Search Relevance Workbench allows the generating implicit judgments based on data that adheres to the UBI schema specification.
* Additionally, the Search Relevance Workbench offers users to leverage LLMs to generate judgments by connecting OpenSearch to an API or an internally or externally hosted model.
* Lastly, for OpenSearch users that already have processes to generate judgments the Search Relevance Workbench can import these.

## Explicit judgments

The Search Relevance Workbench offers two ways to integrate explicit judgments:
* Importing judgments that were collected in a process outside of OpenSearch.
* AI-assisted judgments that leverage LLMs.

### Importing judgments

Search teams may already have external processes set up that result in judgments. These can be imported with a PUT command to the correspnding endpoint. It does not matter what the process looks like that generated the judgments. This means that the judgments can be implicit or explicit and the judgment list can be generated with humans or AI-assisted: all kinds of judgments are supported in the import process.

#### Example request:

```json
PUT _plugins/_search_relevance/judgments
{
  "name": "Imported Judgments",
  "description": "Judgments generated outside SRW",
  "type": "IMPORT_JUDGMENT",
  "judgmentRatings": [
    {
      "query": "red dress",
        "ratings": [
          {
                    "docId": "B077ZJXCTS",
                    "rating": "3.000"
          },
          {
                    "docId": "B071S6LTJJ",
                    "rating": "2.000"
          },
          {
                    "docId": "B01IDSPDJI",
                    "rating": "2.000"
          },
          {
                    "docId": "B07QRCGL3G",
                    "rating": "0.000"
          },
          {
                    "docId": "B074V6Q1DR",
                    "rating": "1.000"
          }
        ]
      },
      {
        "query": "blue jeans",
        "ratings": [
          {
                    "docId": "B07L9V4Y98",
                    "rating": "0.000"
          },
          {
                    "docId": "B01N0DSRJC",
                    "rating": "1.000"
          },
          {
                    "docId": "B001CRAWCQ",
                    "rating": "1.000"
          },
          {
                    "docId": "B075DGJZRM",
                    "rating": "2.000"
          },
          {
                    "docId": "B009ZD297U",
                    "rating": "2.000"
          }
        ]
      }
  ]
}
```
{% include copy-curl.html %}

The judgment import supports the following parameters.

Parameter | Data type | Description
`name` | String | The name of the judgment list.
`description` | String | An optional description of the judgment list.
`type` | String | The type of judgment. When importing judgments the type is `IMPORT_JUDGMENT`.
`judgmentRatings` | Array | A list of JSON objects with the actual judgments. Judgments are grouped by query that have a nested map with document IDs (`docId`) as keys and the ratings as numerical float values.

### Creating AI-assisted judgments

Search teams that want to use judgments in their experimentation process and do not have a team of humans or do not have the user behavior data to calculate judgments based on interactions are covered by the Search Relevance Workbench's feature of leveraging LLMs to assist them.
There are three prerequisites to use the AI-assisted process:

* A connector to a LLM to use for generating the judgments: you have several options to [create connectors that let you access models to generate AI-assisted judgments]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/).
* A query set: The query set sets the scope of the judgments to generate together with the `size` parameter. For each query the top k documents are retrieved from the defined index where k is the number defined with the `size` parameter.
* A search configuration: defines how the documents should be retrieved that are used for query/document pairs.

The AI-assisted judgment process: For each query the top k documents are retrieved from with the defined search configuration that also has the index information. The query and each document from the result list create a query/doc pair. For each query/doc pair a judgment is generated by calling the LLM with the prompt that is defined as a static variable in the backend. The LLM generates one judgment per query/doc pair. All generated judgments are stored in the judgments index for repeated and/or future usage.

With the model ID, an available query set and a created search confoguiration you can initiate a job to create a judgment list:

#### Example request:

```json
PUT _plugins/_search_relevance/judgments
{
    "name":"COEC",
    "type":"LLM_JUDGMENT",
    "querySetId":"5f0115ad-94b9-403a-912f-3e762870ccf6",
    "searchConfigurationList":["2f90d4fd-bd5e-450f-95bb-eabe4a740bd1"],
    "size":5,
    "modelId":"N8AE1osB0jLkkocYjz7D",
    "contextFields":[]
}
```
{% include copy-curl.html %}

## Implicit judgments

Implicit judgments are derived from user interactions. Several models exist that allow leveraging signals from user behavior to calculate implicit judgments. Clicks Over Expected Clicks (COEC) is one of these models, specifically a click model, that is implemented in the following way in the Search Relevance Workbench.
The data used to derive relevance labels is based on past user behavior following the [User Behavior Insights schema specification]({{site.url}}{{site.baseurl}}/search-plugins/ubi/schemas/). The two types of interactions relevant for the implicit judgments process are impressions and clicks that happen after a user query. Technically, this means that all events in the index `ubi_events` that either have `impression` or `click` as values indexed in the field `action_name` are used to model implicit judgments.
Clicks Over Expected Clicks calculates for each rank an expected click-through rate (CTR) based on all past impressions and clicks that happened at the rank. It is implemented as the sum of all clicks over the sum of all impressions for all events in `ubi_events` that were observed at a given rank.

For each document that is displayed in a hit list after a query the average click-through rate at this rank is the expected value for the query/doc pair. COEC now calculates the actual CTR of the query/doc pair and divivdes the observed CTR by the expected rank-aggregated CTR value. This means that those query-document pairs that have a better (higher) click-through rate than the average CTR at the rank of this query-document pair were observed and the judgment will be greater than 1. If it’s less than the average then the judgment value will drop below 1.

Be aware that depending on the implementation details of the tracking multiple clicks for one query can be stored in the `ubi_events` index. This means that an average click-through rate greater than 1 (=100%) is possible.
For query-document observations that occur on different positions we assume all observations (impressions and clicks) happened at the lowest (=best) position. This means that we bias the final judgment towards lower values as we typically see higher click-through rates for better ranks in practice.
{: .note}

#### Example request:

```json
PUT _plugins/_search_relevance/judgments
{
  "name": "Implicit Judgements",
  "clickModel": "coec",
  "type": "UBI_JUDGMENT",
  "maxRank": 20
}
```
{% include copy-curl.html %}

Initializing the creation of implicit judgments supports the following parameters.

Parameter | Data type | Description
`name` | String | The name of the judgment list.
`clickModel` | String | The model used to calculate implicit judgments. `coec` (Clicks Over Expected Clicks) is currently supported.
`type` | String | The type of judgment. When creating implicit judgments the type is `UBI_JUDGMENT`.
`maxRank` | Integer | The maximum rank at which to consider events for judgment calculation.

## Managing judgment lists

In addition to creating judgment lists, there are API calls to retrieve available judgment lists, view individual judgment lists and delete judgment lists.

### Retrieve judgment lists

Endpoint
```json
GET _plugins/_search_relevance/judgments
```
{% include copy-curl.html %}

#### Example response

```json
{
  "took": 9,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4,
      "relation": "eq"
    },
    "max_score": null,
    "hits": [
      {
        "_index": "search-relevance-judgment",
        "_id": "b54f791a-3b02-49cb-a06c-46ab650b2ade",
        "_score": null,
        "_source": {
          "id": "b54f791a-3b02-49cb-a06c-46ab650b2ade",
          "timestamp": "2025-06-11T06:07:23.766Z",
          "name": "Imported Judgments",
          "status": "COMPLETED",
          "type": "IMPORT_JUDGMENT",
          "metadata": {},
          "judgmentRatings": [
            {
              "query": "red dress",
              "ratings": [
                {
                  "docId": "B077ZJXCTS",
                  "rating": "3.000"
                },
                {
                  "docId": "B071S6LTJJ",
                  "rating": "2.000"
                },
                {
                  "docId": "B01IDSPDJI",
                  "rating": "2.000"
                },
                {
                  "docId": "B07QRCGL3G",
                  "rating": "0.000"
                },
                {
                  "docId": "B074V6Q1DR",
                  "rating": "1.000"
                }
              ]
            },
            {
              "query": "blue jeans",
              "ratings": [
                {
                  "docId": "B07L9V4Y98",
                  "rating": "0.000"
                },
                {
                  "docId": "B01N0DSRJC",
                  "rating": "1.000"
                },
                {
                  "docId": "B001CRAWCQ",
                  "rating": "1.000"
                },
                {
                  "docId": "B075DGJZRM",
                  "rating": "2.000"
                },
                {
                  "docId": "B009ZD297U",
                  "rating": "2.000"
                }
              ]
            }
          ]
        },
        "sort": [
          1749622043766
        ]
      }
    }
  }
}
```

### View a judgment list

You can retrieve a judgment list using the judgment list ID.

#### Endpoint

```json
GET _plugins/_search_relevance/judgments/<judgment_list_id>
```

### Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `judgment_list_id` | String | The judgment list ID of the model to retrieve. |

#### Example request:

```json
GET _plugins/_search_relevance/judgments/b54f791a-3b02-49cb-a06c-46ab650b2ade
```

#### Example response:

```json
{
  "took": 36,
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
        "_index": "search-relevance-judgment",
        "_id": "b54f791a-3b02-49cb-a06c-46ab650b2ade",
        "_score": 1,
        "_source": {
          "id": "b54f791a-3b02-49cb-a06c-46ab650b2ade",
          "timestamp": "2025-06-11T06:07:23.766Z",
          "name": "Imported Judgments",
          "status": "COMPLETED",
          "type": "IMPORT_JUDGMENT",
          "metadata": {},
          "judgmentRatings": [
            {
              "query": "red dress",
              "ratings": [
                {
                  "rating": "3.000",
                  "docId": "B077ZJXCTS"
                },
                {
                  "rating": "2.000",
                  "docId": "B071S6LTJJ"
                },
                {
                  "rating": "2.000",
                  "docId": "B01IDSPDJI"
                },
                {
                  "rating": "0.000",
                  "docId": "B07QRCGL3G"
                },
                {
                  "rating": "1.000",
                  "docId": "B074V6Q1DR"
                }
              ]
            },
            {
              "query": "blue jeans",
              "ratings": [
                {
                  "rating": "0.000",
                  "docId": "B07L9V4Y98"
                },
                {
                  "rating": "1.000",
                  "docId": "B01N0DSRJC"
                },
                {
                  "rating": "1.000",
                  "docId": "B001CRAWCQ"
                },
                {
                  "rating": "2.000",
                  "docId": "B075DGJZRM"
                },
                {
                  "rating": "2.000",
                  "docId": "B009ZD297U"
                }
              ]
            }
          ]
        }
      }
    ]
  }
}
```

### Delete a judgment list

You can delete a judgment list using the judgment list ID.

#### Endpoint

```json
DELETE _plugins/_search_relevance/judgments/<judgment_list_id>
```

#### Example request:

```json
DELETE _plugins/_search_relevance/judgments/b54f791a-3b02-49cb-a06c-46ab650b2ade
```

#### Example response

```json
{
  "_index": "search-relevance-judgment",
  "_id": "b54f791a-3b02-49cb-a06c-46ab650b2ade",
  "_version": 3,
  "result": "deleted",
  "forced_refresh": true,
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 156,
  "_primary_term": 1
}
```
