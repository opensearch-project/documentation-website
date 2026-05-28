---
layout: default
title: LLM-as-a-Judge
has_children: false
nav_order: 70
---

# Using LLM-as-a-Judge for search relevance

LLM-as-a-Judge is a technique that uses large language models (LLMs) to automatically evaluate search result relevance. Manually annotating search results is time-consuming and inconsistent across annotators. LLM-as-a-Judge automates this process, enabling frequent and repeatable evaluation of search quality.

After completing this tutorial, you can [run an experiment to evaluate search quality]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/evaluate-search-quality/#creating-a-pointwise-experiment) using the LLM-generated judgments.

## Prerequisites

For this tutorial, you need an API key for an external LLM provider (OpenAI, Amazon Bedrock).

Using an external LLM incurs API costs based on the number of queries and results evaluated.
{: .note}

Enable the Search Relevance Workbench and configure the following settings:

```json
PUT /_cluster/settings
{
  "persistent": {
    "plugins.search_relevance.workbench_enabled": true,
    "plugins.ml_commons.only_run_on_ml_node": "false",
    "plugins.ml_commons.model_access_control_enabled": "true",
    "plugins.ml_commons.allow_registering_model_via_url": "true"
  }
}
```
{% include copy-curl.html %}

### Step 1: Configure a model

First, create a connector to an externally hosted LLM. This tutorial uses OpenAI, but you can adapt it for other providers such as Amazon Bedrock. Replace `YOUR_API_KEY` with your OpenAI API key:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "OpenAI Chat Connector",
  "description": "Connector to OpenAI Chat API for LLM judgments",
  "version": "1",
  "protocol": "http",
  "parameters": {
    "endpoint": "api.openai.com",
    "model": "gpt-3.5-turbo"
  },
  "credential": {
    "openAI_key": "YOUR_API_KEY"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://api.openai.com/v1/chat/completions",
      "headers": {
        "Authorization": "Bearer ${credential.openAI_key}",
        "Content-Type": "application/json"
      },
      "request_body": "{ \"model\": \"${parameters.model}\", \"messages\": ${parameters.messages}, \"temperature\": 0 }"
    }
  ]
}
```
{% include copy-curl.html %}

Then register and deploy the model. Replace `{connector_id}` with the ID returned in the previous response:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "openai_gpt-3.5-turbo",
  "function_name": "remote",
  "description": "External LLM model via OpenAI",
  "connector_id": "{connector_id}"
}
```
{% include copy-curl.html %}

This is an asynchronous operation. To verify the task status, use the [Get ML task]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/) API. Once the state is `COMPLETED`, OpenSearch returns the `model_id` you'll use in the following steps.

### Step 2: Create a search index

Create a `products` index:

```json
PUT /products
{
  "mappings": {
    "properties": {
      "title": { "type": "text" },
      "description": { "type": "text" },
      "category": { "type": "keyword" },
      "brand": { "type": "keyword" },
      "price": { "type": "float" }
    }
  }
}
```
{% include copy-curl.html %}

Index example documents into the index:

```json
POST /products/_bulk
{"index":{"_id":"1"}}
{"title":"Samsung 55-inch 4K Smart TV","description":"Ultra HD Smart TV with HDR and built-in streaming apps","category":"Electronics","brand":"Samsung","price":599.99}
{"index":{"_id":"2"}}
{"title":"LG 65-inch OLED TV","description":"Premium OLED display with perfect blacks and vibrant colors","category":"Electronics","brand":"LG","price":1299.99}
{"index":{"_id":"3"}}
{"title":"Sony Wireless Headphones","description":"Noise-canceling over-ear headphones with 30-hour battery","category":"Electronics","brand":"Sony","price":199.99}
{"index":{"_id":"4"}}
{"title":"Apple MacBook Pro 14-inch","description":"Professional laptop with M2 chip and Retina display","category":"Computers","brand":"Apple","price":1999.99}
{"index":{"_id":"5"}}
{"title":"Dell Gaming Monitor 27-inch","description":"High refresh rate gaming monitor with G-Sync support","category":"Computers","brand":"Dell","price":399.99}
```
{% include copy-curl.html %}

### Step 3: Create a search configuration

A _search configuration_ defines a search strategy to evaluate. The `%SearchText%` placeholder is replaced with each query from the query set during evaluation:

```json
PUT /_plugins/_search_relevance/search_configurations
{
  "name": "baseline",
  "query": "{\"query\":{\"multi_match\":{\"query\":\"%SearchText%\",\"fields\":[\"title\",\"description\",\"category\",\"brand\"]}}}",
  "index": "products"
}
```
{% include copy-curl.html %}

### Step 4: Create a query set

Create a query set containing test queries for evaluation:

```json
PUT /_plugins/_search_relevance/query_sets
{
  "name": "Electronics Queries",
  "description": "Test queries for electronics products",
  "sampling": "manual",
  "querySetQueries": [
    {"queryText": "smart tv"},
    {"queryText": "laptop computer"},
    {"queryText": "wireless headphones"}
  ]
}
```
{% include copy-curl.html %}

### Step 5: Generate LLM judgments

Create an LLM judgment that uses your deployed model to evaluate search results. Replace `{model_id}`, `{query_set_id}`, and `{search_configuration_id}` with the IDs returned in previous steps:

```json
PUT /_plugins/_search_relevance/judgments
{
  "name": "LLM Judgment via OpenAI",
  "description": "Uses GPT-3.5-turbo to evaluate product search results",
  "type": "LLM_JUDGMENT",
  "modelId": "{model_id}",
  "querySetId": "{query_set_id}",
  "searchConfigurationList": ["{search_configuration_id}"],
  "size": 10,
  "tokenLimit": 4000,
  "contextFields": ["title", "description", "category"],
  "ignoreFailure": false,
  "llmJudgmentRatingType": "SCORE0_1",
  "promptTemplate": "Rate the relevance of these search results {% raw %}{{hits}}{% endraw %} for the query '{% raw %}{{queryText}}{% endraw %}' on a scale of 0-1, where 0 is completely irrelevant and 1 is perfectly relevant. Consider the product title, description, and category.",
  "overwriteCache": false
}
```
{% include copy-curl.html %}

For a description of all request body parameters, see [Judgments]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/judgments/#request-body-fields).

The judgment process runs asynchronously. To verify the status, retrieve the judgment by its ID:

```json
GET /search-relevance-judgment/_doc/{judgment_id}
```
{% include copy-curl.html %}

When the `status` field is `COMPLETED`, the `judgmentRatings` array contains the generated relevance scores for each query-document pair.

## Next steps

You are now ready to [run an experiment to evaluate search quality]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/evaluate-search-quality/#creating-a-pointwise-experiment) with the LLM-generated judgments. The search configuration and query set that you created during this tutorial can serve as inputs for your first evaluation.

## Related documentation

- [Search Relevance Workbench]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/using-search-relevance-workbench/)
- [Using LLM-as-a-Judge]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/judgments/#using-llm-as-a-judge)
- [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/)
