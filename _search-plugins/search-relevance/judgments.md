---
layout: default
title: Judgments
nav_order: 8
parent: Search Relevance Workbench
grand_parent: Optimizing search quality
has_children: false
---

# Judgments

A judgment is a relevance rating assigned to a specific document in the context of a particular query. Multiple judgments are grouped together into judgment lists.
Typically, judgments are categorized as two types---implicit and explicit:

- Implicit judgments are ratings derived from user behavior (for example, what did the user see and select after searching?).
- Humans have traditionally produced explicit judgments, but large language models (LLMs) are increasingly used for this task.

Search Relevance Workbench (SRW) supports all types of judgments:

- Using LLMs as automated judges (an approach known as LLM-as-a-Judge) to generate judgments by evaluating search results using a prompt.
- Generating implicit judgments based on data that adheres to the User Behavior Insights (UBI) schema specification.
- Importing judgments that were collected using a process outside of SRW.

## Using LLM-as-a-Judge

Generate explicit judgments with an LLM in SRW when you don't have human annotators available, or you need to scale up the number of judgments beyond what humans can provide.

For step-by-step instructions, see [Using LLM-as-a-Judge for search relevance]({{site.url}}{{site.baseurl}}/tutorials/llm-as-a-judge-tutorial/).

### Prerequisites

To use LLM-as-a-Judge, configure the following components:

- A connector to an LLM to use for generating the judgments. For more information, see [Connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/).
- A query set: Together with the `size` parameter, the query set defines the scope for generating judgments. For each query, the top k documents are retrieved from the specified index, in which k is defined by the `size` parameter.
- A search configuration: A search configuration defines how documents are retrieved for use in query-document pairs.

The AI-assisted judgment process consists of the following steps:

- For each query, the top k documents are retrieved using the defined search configuration, which includes the index information. The query and each document from the result list create a query-document pair.
- The LLM is then called with a predefined prompt to generate a judgment for each query-document pair.
- All generated judgments are stored in the judgment list. To reuse ratings from previous judgments in a new run, use the `existingJudgments` parameter. For more information, see [Reusing existing judgments](#reusing-existing-judgments).

To create a judgment list, provide the model ID of the LLM, an available query set, and a created search configuration.

The following example uses a generic prompt template with a scale of 0.0 to 1.0. To reduce the volume of data sent to the LLM (and therefore the cost), use the `contextFields` parameter to specify which fields from each result to include:

```json
PUT _plugins/_search_relevance/judgments
{
    "name":"AI-assisted judgment list",
    "description": "Uses GPT-3.5-turbo to evaluate product search results",
    "type":"LLM_JUDGMENT",
    "modelId":"N8AE1osB0jLkkocYjz7D",
    "querySetId":"5f0115ad-94b9-403a-912f-3e762870ccf6",
    "searchConfigurationList":["2f90d4fd-bd5e-450f-95bb-eabe4a740bd1"],
    "size":5,
    "contextFields": ["title", "description", "category"],
    "llmJudgmentRatingType": "SCORE0_1",
    "promptTemplate": "Rate the relevance of these search results {% raw %}{{hits}}{% endraw %} for the query '{% raw %}{{queryText}}{% endraw %}' on a scale of 0-1, where 0 is completely irrelevant and 1 is perfectly relevant. Consider the product title, description, and category."
}
```
{% include copy-curl.html %}

### Request body fields

The following table lists the parameters for creating LLM-based judgments.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `name` | String | The name of the judgment list. |
| `description` | String | Optional. A description of the judgment list. |
| `type` | String | Set to `LLM_JUDGMENT`. |
| `modelId` | String | The ID of the deployed machine learning (ML) model to use for generating judgments. Must be a remote model connected to an external LLM service. |
| `querySetId` | String | The ID of the query set containing the queries to evaluate. |
| `searchConfigurationList` | Array of strings | The list of search configuration IDs to use for retrieving documents to evaluate. |
| `size` | Integer | The number of top documents to retrieve and evaluate for each query. Default is `10`. |
| `tokenLimit` | Integer | The maximum number of tokens to send to the LLM in a single request. Used to batch documents when the total content exceeds this limit. Default is `4,000`. |
| `contextFields` | Array of strings | Optional. Specifies which document fields to include when sending content to the LLM. If not specified, the entire document source is sent. Use this parameter to reduce costs and focus the LLM on relevant fields. |
| `ignoreFailure` | Boolean | Whether to continue processing other documents if the LLM fails to generate a judgment for some documents. Default is `false`. |
| `llmJudgmentRatingType` | String | The type of rating scale to use. Valid values are `SCORE0_1` (numeric scale 0--1) and `RELEVANT_IRRELEVANT` (binary relevant/irrelevant). Use `SCORE0_1` for graded relevance metrics such as NDCG. Use `RELEVANT_IRRELEVANT` for binary metrics such as precision and recall. |
| `promptTemplate` | String | Optional. A custom prompt template for the LLM. Supports {% raw %}`{{queryText}}`{% endraw %} and {% raw %}`{{hits}}`{% endraw %} placeholders. If not provided, the default template is used. |
| `existingJudgments` | Array of strings | Optional. A list of up to five existing LLM judgment IDs whose ratings are reused before calling the LLM. SRW only sends query-document pairs that aren't already rated in one of these judgments to the LLM. For more information, see [Reusing existing judgments](#reusing-existing-judgments). |
| `overwriteCache` | Boolean | Optional, deprecated. This parameter no longer has any effect because the global judgment cache has been removed. It is still accepted so that older clients don't break. To reuse ratings from previous judgments, use `existingJudgments`. To retry only the documents that failed in a completed judgment, use the [retry endpoint](#retrying-failed-documents). |

### Custom prompt templates

You can customize the prompt template to focus on specific aspects of relevance:

```json
PUT /_plugins/_search_relevance/judgments
{
  "name": "Custom Prompt Judgment",
  "type": "LLM_JUDGMENT",
  "modelId": "MODEL_ID_HERE",
  "querySetId": "QUERY_SET_ID_HERE",
  "searchConfigurationList": ["SEARCH_CONFIGURATION_ID_HERE"],
  "promptTemplate": "As an e-commerce search expert, evaluate how well these products {% raw %}{{hits}}{% endraw %} match the user's search for '{% raw %}{{queryText}}{% endraw %}'. Consider product relevance, brand reputation, and price competitiveness. Rate each result from 0-1.",
  "llmJudgmentRatingType": "SCORE0_1"
}
```
{% include copy-curl.html %}

### Binary relevance judgments

For simpler relevance assessment, you can use binary (relevant/irrelevant) judgments:

```json
PUT /_plugins/_search_relevance/judgments
{
  "name": "Binary LLM Judgment",
  "type": "LLM_JUDGMENT",
  "modelId": "MODEL_ID_HERE",
  "querySetId": "QUERY_SET_ID_HERE",
  "searchConfigurationList": ["SEARCH_CONFIGURATION_ID_HERE"],
  "llmJudgmentRatingType": "RELEVANT_IRRELEVANT",
  "promptTemplate": "Determine if these search results {% raw %}{{hits}}{% endraw %} are relevant or irrelevant for the query '{% raw %}{{queryText}}{% endraw %}'. Consider exact matches and semantic relevance."
}
```
{% include copy-curl.html %}

### Reusing existing judgments

Generating an LLM judgment sends one request to the LLM for every query-document pair, which takes time and incurs cost. When you create a new judgment that overlaps with judgments you've already generated---for example, you're adding a search configuration to an existing query set, or resuming a run in which some documents didn't receive a rating---you can reuse the ratings you already have instead of asking the LLM to score those pairs again.

To reuse ratings, provide a list of up to five existing LLM judgment IDs in the `existingJudgments` parameter. Before calling the LLM, SRW looks up each query-document pair in the specified judgments. If a pair is already rated, SRW reuses that rating; only pairs that aren't found are sent to the LLM. If the same query-document pair is rated in more than one of the listed judgments, SRW uses the rating from the first judgment in the list.

```json
PUT _plugins/_search_relevance/judgments
{
  "name": "Reuse existing ratings",
  "type": "LLM_JUDGMENT",
  "modelId": "MODEL_ID_HERE",
  "querySetId": "QUERY_SET_ID_HERE",
  "searchConfigurationList": ["SEARCH_CONFIGURATION_ID_HERE"],
  "size": 5,
  "existingJudgments": ["b54f791a-3b02-49cb-a06c-46ab650b2ade", "505d00cf-2fce-422b-bb97-2e3a95ce9446"]
}
```
{% include copy-curl.html %}

You can specify a maximum of five judgment IDs in `existingJudgments`. A request that includes more than five is rejected.
{: .note}

In OpenSearch Dashboards, you can select judgments to reuse from the **Reuse Existing Judgments** field under **Advanced Settings** on the judgment creation page.

### Using different LLM providers

You can adapt the connector configuration for other providers.

#### Amazon Bedrock example

The following example creates a connector for Amazon Bedrock:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "Amazon Bedrock Connector",
  "description": "Connector to Amazon Bedrock",
  "version": "1",
  "protocol": "aws_sigv4",
  "parameters": {
    "region": "us-east-1",
    "service_name": "bedrock",
    "model": "anthropic.claude-v2"
  },
  "credential": {
    "access_key": "YOUR_ACCESS_KEY",
    "secret_key": "YOUR_SECRET_KEY"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://bedrock-runtime.${parameters.region}.amazonaws.com/model/${parameters.model}/invoke",
      "request_body": "{ \"prompt\": \"${parameters.messages}\", \"max_tokens_to_sample\": 300 }"
    }
  ]
}
```
{% include copy-curl.html %}

## Implicit judgments

Implicit judgments are derived from past user interactions. SRW supports the Clicks Over Expected Clicks (COEC) click model, which uses *impression* and *click* signals to calculate judgments.

Input data must follow the [UBI index schemas]({{site.url}}{{site.baseurl}}/search-plugins/ubi/schemas/). COEC uses every event in the `ubi_events` index with an `action_name` of `impression` or `click`.

COEC calculates an expected click-through rate (CTR) for each rank by dividing the total number of clicks by the total number of impressions observed at that rank, based on all events in `ubi_events`. This ratio represents the expected CTR for that position.

For each document displayed in a hit list after a query, the average CTR at that rank serves as the expected value for the query-document pair. COEC calculates the actual CTR for the query-document pair and divides it by this expected rank-based CTR. Consequently, query-document pairs with a higher CTR than the average for that rank have a judgment value greater than 1. Conversely, if the CTR is lower than average, the judgment value is lower than 1.

Depending on the tracking implementation, multiple clicks for a single query can be recorded in the `ubi_events` index. Consequently, the average CTR can sometimes exceed 1 (or 100%).
{: .note}

For query-document observations that occur at different positions, all impressions and clicks are assumed to have occurred at the lowest (best) position. This aggregation approach biases the final judgment toward lower values, reflecting the common trend that higher-ranked results typically receive higher CTRs.
{: .note}

### Example request

The following example creates an implicit judgment list using the COEC click model:

```json
PUT _plugins/_search_relevance/judgments
{
  "name": "Implicit Judgments",
  "clickModel": "coec",
  "type": "UBI_JUDGMENT",
  "maxRank": 20
}
```
{% include copy-curl.html %}

### Request body fields

The following table lists the parameters for creating implicit judgments.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `name` | String | The name of the judgment list. |
| `clickModel` | String | The model used to calculate implicit judgments. Only `coec` (Clicks Over Expected Clicks) is supported. |
| `type` | String | Set to `UBI_JUDGMENT`. |
| `maxRank` | Integer | The maximum rank to consider when including events in the judgment calculation. |
| `startDate` | Date | An optional starting date from which behavioral data events are considered for implicit judgment generation. The format is `yyyy-MM-dd`. |
| `endDate` | Date | An optional end date until which behavioral data events are considered for implicit judgment generation. The format is `yyyy-MM-dd`. |

## Importing judgments

You may already have external processes for generating judgments. Regardless of the judgment type or the way they were generated, you can import them into SRW.

### Example request

The following example imports a set of judgments for two queries:

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

### Request body fields

The following table lists the parameters for importing judgments.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `name` | String | The name of the judgment list. |
| `description` | String | An optional description of the judgment list. |
| `type` | String | Set to `IMPORT_JUDGMENT`. |
| `judgmentRatings` | Array | A list of JSON objects containing the judgments. Judgments are grouped by query, each containing a nested map in which document IDs (`docId`) serve as keys and their floating-point ratings serve as values. |

## Managing judgment lists

You can retrieve or delete judgment lists using the following APIs.

### Viewing a judgment list

Retrieve a judgment list by its ID.

#### Endpoint

```json
GET _plugins/_search_relevance/judgments/{judgment_list_id}
```

#### Path parameters

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

### Retrying failed documents

A judgment can finish with a `status` of `COMPLETED` even if some documents didn't receive a rating, for example because the LLM provider throttled or timed out on those requests. Rather than regenerating the entire judgment, you can retry only the documents that failed by sending a `POST` request to the `_retry` endpoint with the judgment's ID.

#### Endpoint

```json
POST _plugins/_search_relevance/judgments/{judgment_list_id}/_retry
```

#### Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `judgment_list_id` | String | The ID of the judgment list whose failed documents you want to retry. |

#### Example request

```json
POST _plugins/_search_relevance/judgments/b54f791a-3b02-49cb-a06c-46ab650b2ade/_retry
```
{% include copy-curl.html %}

#### Example response

```json
{
  "judgment_id": "b54f791a-3b02-49cb-a06c-46ab650b2ade",
  "status": "RETRYING",
  "message": "Retrying failed documents"
}
```

The retry runs asynchronously and generates new ratings for only the previously failed documents; ratings that already succeeded are left unchanged. The response returns immediately with a `status` of `RETRYING`. To track progress, retrieve the judgment and check its `status`, as described in [Viewing a judgment list](#viewing-a-judgment-list). When the retry finishes, the judgment returns to a `status` of `COMPLETED`.

In OpenSearch Dashboards, you can start a retry from the judgment list, which also shows whether each document is **Rated** or **Failed**.

### Deleting a judgment list

Delete a judgment list by its ID.

#### Endpoint

```json
DELETE _plugins/_search_relevance/judgments/{judgment_list_id}
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

### Searching for a judgment list

Search for judgment lists using query domain-specific language (DSL). The response excludes `judgmentRatings.ratings` by default; to include it, specify the `_source` field in the query.

#### Endpoints

```json
GET _plugins/_search_relevance/judgments/_search
POST _plugins/_search_relevance/judgments/_search
```

#### Example request

The following example searches for judgment lists that include the exact query `red dress`:

```json
GET _plugins/_search_relevance/judgments/_search
{
  "query": {
    "nested": {
      "path": "judgmentRatings",
      "query": {
        "match_phrase": {
          "judgmentRatings.query": "red dress"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "took": 29,
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
    "max_score": 4.5558767,
    "hits": [
      {
        "_index": "search-relevance-judgment",
        "_id": "505d00cf-2fce-422b-bb97-2e3a95ce9446",
        "_score": 4.5558767,
        "_source": {
          "metadata": {},
          "name": "Imported Judgments",
          "judgmentRatings": [
            {
              "query": "red dress"
            },
            {
              "query": "blue jeans"
            }
          ],
          "id": "505d00cf-2fce-422b-bb97-2e3a95ce9446",
          "type": "IMPORT_JUDGMENT",
          "timestamp": "2026-01-28T18:16:44.218Z",
          "status": "COMPLETED"
        }
      }
    ]
  }
}
```

## Related documentation

- [Automate search relevance evaluation using LLMs]({{site.url}}{{site.baseurl}}/tutorials/llm-as-a-judge-tutorial/)