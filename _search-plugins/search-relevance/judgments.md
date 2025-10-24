---
layout: default
title: Judgments
nav_order: 8
parent: Search Relevance Workbench
grand_parent: Search relevance
has_children: false
---

# Judgments

A judgment is a relevance rating assigned to a specific document in the context of a particular query. Multiple judgments are grouped together into judgment lists.
Typically, judgments are categorized into two types---implicit and explicit:

* Implicit judgments are ratings that were derived from user behavior (for example, what did the user see and select after searching?)
* Explicit judgments were traditionally made by humans, but large language models (LLMs) are increasingly being used to perform this task.

Search Relevance Workbench supports all types of judgments:

* Generating implicit judgments based on data that adheres to the User Behavior Insights (UBI) schema specification.
* Using LLMs to generate judgments by connecting OpenSearch to an API or an internally or externally hosted model.
* Importing externally created judgments.

## Explicit judgments

Search Relevance Workbench offers two ways to integrate explicit judgments:
* Importing judgments that were collected using a process outside of OpenSearch
* AI-assisted judgments that use LLMs

### Importing judgments

You may already have external processes for generating judgments. Regardless of the judgment type or the way it was generated, you can import it into Search Relevance Workbench.

#### Example request

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

#### Request body fields

The process of importing judgments supports the following parameters.

Parameter | Data type | Description
`name` | String | The name of the judgment list.
`description` | String | An optional description of the judgment list.
`type` | String | Set to `IMPORT_JUDGMENT`.
`judgmentRatings` | Array | A list of JSON objects containing the judgments. Judgments are grouped by query, each containing a nested map in which document IDs (`docId`) serve as keys and their floating-point ratings serve as values.

### Creating AI-assisted judgments

If you want to use judgments in your experimentation process but do not have a team of humans or the user behavior data to calculate judgments based on interactions, you can use an LLM in Search Relevance Workbench to generate judgments.
#### Prerequisites

To use AI-assisted judgment generation, ensure that you have configured the following components:

* A connector to an LLM to use for generating the judgments. For more information, see [Creating connectors for third-party ML platforms]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/).
* A query set: Together with the `size` parameter, the query set defines the scope for generating judgments. For each query, the top k documents are retrieved from the specified index, where k is defined in the `size` parameter.
* A search configuration: A search configuration defines how documents are retrieved for use in query/document pairs.

The AI-assisted judgment process works as follows:
- For each query, the top k documents are retrieved using the defined search configuration, which includes the index information. The query and each document from the result list create a query/document pair.
- Each query and document pair forms a query/document pair.
- The LLM is then called with a predefined prompt (stored as a static variable in the backend) to generate a judgment for each query/document pair.
- All generated judgments are stored in the judgments index for reuse in future experiments.

To create a judgment list, provide the model ID of the LLM, an available query set, and a created search configuration:


```json
PUT _plugins/_search_relevance/judgments
{
    "name":"AI-assisted judgment list",
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

Implicit judgments are derived from user interactions. Several models use signals from user behavior to calculate these judgments. One such model is Clicks Over Expected Clicks (COEC), a click model implemented in Search Relevance Workbench.
The data used to derive relevance labels is based on past user behavior. The data follows the [User Behavior Insights schema specification]({{site.url}}{{site.baseurl}}/search-plugins/ubi/schemas/). The two key interaction types for implicit judgments are *impressions* and *clicks* that occur after a user query. In practice, this means that all events in the `ubi_events` index with an `impression` or `click` recorded in the `action_name` field are used to model implicit judgments.
COEC calculates an expected click-through rate (CTR) for each rank. It does this by dividing the total number of clicks by the total number of impressions observed at that rank, based on all events in `ubi_events`. This ratio represents the expected CTR for that position.

For each document displayed in a hit list after a query, the average CTR at that rank serves as the expected value for the query/document pair. COEC calculates the actual CTR for the query/document pair and divides it by this expected rank-based CTR. This means that query/document pairs with a higher CTR than the average for that rank will have a judgment value greater than 1. Conversely, if the CTR is lower than average, the judgment value will be lower than 1.

Note that depending on the tracking implementation, multiple clicks for a single query can be recorded in the `ubi_events` index. As a result, the average CTR can sometimes exceed 1 (or 100%).
For query-document observations that occur at different positions, all impressions and clicks are assumed to have occurred at the lowest (best) position. This approach biases the final judgment toward lower values, reflecting the common trend that higher-ranked results typically receive higher CTRs.
{: .note}

#### Example request

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

#### Request body fields

The process of creating implicit judgments supports the following parameters.

Parameter | Data type | Description
`name` | String | The name of the judgment list.
`clickModel` | String | The model used to calculate implicit judgments. Only `coec` (Clicks Over Expected Clicks) is supported.
`type` | String | Set to `UBI_JUDGMENT`.
`maxRank` | Integer | The maximum rank to consider when including events in the judgment calculation.
`startDate` | Date | The optional starting date from which behavioral data events are considered for implicit judgment generation. The format is`yyyy-MM-dd`.
`endDate` | Date | The optional end date until which behavioral data events are considered for implicit judgment generation. The format is`yyyy-MM-dd`.

## Managing judgment lists

You can retrieve or delete judgment lists using the following APIs.

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
| `judgment_list_id` | String | The ID of the judgment list to retrieve. |

#### Example request

```json
GET _plugins/_search_relevance/judgments/b54f791a-3b02-49cb-a06c-46ab650b2ade
```
{% include copy-curl.html %}

#### Example response

<details open markdown="block">
  <summary>
    Response
  </summary>

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

</details>

### Delete a judgment list

You can delete a judgment list using the judgment list ID.

#### Endpoint

```json
DELETE _plugins/_search_relevance/judgments/<judgment_list_id>
```

#### Example request

```json
DELETE _plugins/_search_relevance/judgments/b54f791a-3b02-49cb-a06c-46ab650b2ade
```
{% include copy-curl.html %}

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
