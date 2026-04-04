---
layout: default
title: Getting started with LLM-as-a-Judge for search relevance evaluation
has_children: false
parent: Search Relevance Workbench
nav_order: 4
steps:
  - heading: "Set up ML Commons and create an external LLM connector"
    link: "/tutorials/search-relevance/llm-as-judge-tutorial/#step-1-set-up-ml-commons-and-create-an-external-llm-connector"
  - heading: "Create a simple search index with sample data"
    link: "/tutorials/search-relevance/llm-as-judge-tutorial/#step-2-create-a-simple-search-index-with-sample-data"
  - heading: "Create search configurations"
    link: "/tutorials/search-relevance/llm-as-judge-tutorial/#step-3-create-search-configurations"
  - heading: "Create a query set"
    link: "/tutorials/search-relevance/llm-as-judge-tutorial/#step-4-create-a-query-set"
  - heading: "Generate LLM judgments"
    link: "/tutorials/search-relevance/llm-as-judge-tutorial/#step-5-generate-llm-judgments"
  - heading: "Run experiments with LLM judgments"
    link: "/tutorials/search-relevance/llm-as-judge-tutorial/#step-6-run-experiments-with-llm-judgments"
---

# Getting started with LLM-as-a-Judge for search relevance evaluation

LLM-as-a-Judge is a technique that leverages large language models to automatically evaluate search result relevance, providing a scalable and consistent approach to search quality assessment.

In this tutorial, you'll learn how to:

- **Set up external LLM integration**: Connect OpenSearch to external LLM providers like OpenAI, AWS Bedrock, or others.
- **Generate automated judgments**: Use LLMs to evaluate search result relevance without manual annotation.
- **Compare search configurations**: Run experiments to determine which search approach performs better using LLM-generated judgments.

## OpenSearch components for LLM-as-a-Judge

In this tutorial, you'll use the following OpenSearch components:

- [ML Commons plugin]({{site.url}}{{site.baseurl}}/ml-commons-plugin/index/) for LLM integration
- [Search Relevance Workbench]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/index/) for evaluation workflows
- [Remote model connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/) for external LLM APIs
- [Search configurations]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/search-configuration/) for defining search strategies
- [Query sets]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/query-set/) for organizing test queries
- [Judgments]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/judgment/) for storing relevance assessments
- [Experiments]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/experiment/) for evaluating search quality

## Prerequisites

For this tutorial, you'll need:

- OpenSearch 3.5 or newer with the Search Relevance Workbench plugin installed
- ML Commons plugin installed and configured
- An API key for an external LLM provider (OpenAI, AWS Bedrock)

First, enable the Search Relevance Workbench and configure ML Commons:

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

## Tutorial

This tutorial consists of the following steps:

{% include list.html list_items=page.steps%}

You can follow this tutorial by using your command line or the OpenSearch Dashboards [Dev Tools console]({{site.url}}{{site.baseurl}}/dashboards/dev-tools/run-queries/).

Some steps in the tutorial contain optional <span>Test it</span>{: .text-delta} sections. You can confirm that the step completed successfully by running the requests in these sections.

After you're done, follow the steps in the [Clean up](#clean-up) section to delete all created components.

### Step 1: Set up ML Commons and create an external LLM connector

First, you'll create a connector to an external LLM service. This tutorial uses OpenAI's GPT models, but you can adapt it for other providers like AWS Bedrock.

#### Step 1(a): Create an ML connector

Create a connector to OpenAI's chat completion API. Replace `YOUR_API_KEY` with your actual OpenAI API key:

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

The response contains the connector ID:

```json
{
  "connector_id": "abc123def456"
}
```

You will use the returned `connector_id` in the next step.

#### Step 1(b): Register and deploy the model

Register and deploy the connector as a remote model:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "openai_gpt-3.5-turbo",
  "function_name": "remote",
  "description": "External LLM model via OpenAI",
  "connector_id": "abc123def456"
}
```
{% include copy-curl.html %}

Registering a model is an asynchronous task. OpenSearch sends back a task ID for this task:

```json
{
  "task_id": "aFeif4oB5Vm0Tdw8yoN7",
  "status": "CREATED"
}
```

You can check the status of the task by using the [Get ML Task API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/):

```json
GET /_plugins/_ml/tasks/aFeif4oB5Vm0Tdw8yoN7
```

OpenSearch saves the registered model in the model index. Deploying a model creates a model instance and caches the model in memory. 

Once the task is complete, the task state changes to `COMPLETED` and the [Get ML Task API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/) response contains the `model_id` for the deployed model (which is different from the initial `task_id`):

```json
{
  "model_id": "DQmk2ZwBqLOthQZKMqU-",
  "task_type": "REGISTER_MODEL",
  "function_name": "REMOTE",
  "state": "COMPLETED",
  "worker_node": [
    "rbmK-mMDQfecqr41sOjEsA"
  ],
  "create_time": 1773177942532,
  "last_update_time": 1773177942677,
  "is_async": false
}
```

You'll need the `model_id` in order to use the deployed model for several of the following steps.

{% include copy-curl.html %}

<details markdown="block">
  <summary>
    Test it
  </summary>
  {: .text-delta}

Test the model connection:

```json
POST /_plugins/_ml/models/MODEL_ID_HERE/_predict
{
  "parameters": {
    "messages": "[{\"role\": \"user\", \"content\": \"Say hello in one word\"}]"
  }
}
```
{% include copy-curl.html %}

You should receive a response from the LLM.
</details>

### Step 2: Create a simple search index with sample data

Now you'll create a simple index with product data for testing search relevance.

#### Step 2(a): Create the index

```json
PUT /products
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text"
      },
      "description": {
        "type": "text"
      },
      "category": {
        "type": "keyword"
      },
      "brand": {
        "type": "keyword"
      },
      "price": {
        "type": "float"
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Step 2(b): Index sample documents

Add sample product documents using the bulk API:

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

<details markdown="block">
  <summary>
    Test it
  </summary>
  {: .text-delta}

Verify the documents were indexed:

```json
GET /products/_search
{
  "query": {
    "match_all": {}
  }
}
```
{% include copy-curl.html %}
</details>

### Step 3: Create search configuration "baseline"

Search configuration defines a search strategy to evaluate using the LLM-as-a-Judge judgments.

```json
PUT /_plugins/_search_relevance/search_configurations
{
  "name": "baseline",
  "query": "{\"query\":{\"multi_match\":{\"query\":\"%SearchText%\",\"fields\":[\"title\",\"description\",\"category\",\"brand\"]}}}",
  "index": "products"
}
```
{% include copy-curl.html %}

The response contains the search configuration ID:

```json
{
  "search_configuration_id": "baseline_config_id"
}
```

<details markdown="block">
  <summary>
    Test it
  </summary>
  {: .text-delta}

List all search configurations:

```json
GET _plugins/_search_relevance/search_configurations/_search
{
  "query":
  {
    "match_all": {}
  }
}
```
{% include copy-curl.html %}
</details>

### Step 4: Create a query set

Query sets contain the test queries you'll use for evaluation.

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

The response contains the query set ID:

```json
{
  "query_set_id": "electronics_queries_id"
}
```

<details markdown="block">
  <summary>
    Test it
  </summary>
  {: .text-delta}

Verify the query set was created:

```json
GET /_plugins/_search_relevance/query_sets/_search
{
  "query": {
    "match": {
      "name": "Electronics Queries"
    }
  }
}
```
{% include copy-curl.html %}
</details>

### Step 5: Generate LLM judgments

Now you'll create an LLM judgment that uses your deployed model to evaluate search results.

```json
PUT /_plugins/_search_relevance/judgments
{
  "name": "LLM Judgment via OpenAI",
  "description": "Uses GPT-3.5-turbo to evaluate product search results",
  "type": "LLM_JUDGMENT",
  "modelId": "MODEL_ID_HERE",
  "querySetId": "electronics_queries_id",
  "searchConfigurationList": ["baseline_config_id"],
  "size": 10,
  "tokenLimit": 4000,
  "contextFields": ["title", "description", "category"],
  "ignoreFailure": false,
  "llmJudgmentRatingType": "SCORE0_1",
  "promptTemplate": "Rate the relevance of these search results {{hits}} for the query '{{queryText}}' on a scale of 0-1, where 0 is completely irrelevant and 1 is perfectly relevant. Consider the product title, description, and category.",
  "overwriteCache": false
}
```
{% include copy-curl.html %}

The response contains the judgment ID:

```json
{
  "judgment_id": "LLM_JUDGEMENT_ID"
}
```

The LLM judgment process runs asynchronously. Wait a few moments for the judgments to be generated, then check the status:

```json
GET /search-relevance-judgment/_doc/LLM_JUDGEMENT_ID
```
{% include copy-curl.html %}

You can see the judgments and how they were arrived at:

```json
{
  "_index": "search-relevance-judgment",
  "_id": "d6f73218-ad6b-408f-b6ab-186a47b27e87",
  "_version": 2,
  "_seq_no": 10,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "id": "d6f73218-ad6b-408f-b6ab-186a47b27e87",
    "timestamp": "2026-03-10T21:37:13.837Z",
    "name": "LLM Judgment via OpenAI",
    "status": "COMPLETED",
    "type": "LLM_JUDGMENT",
    "metadata": {
      "contextFields": [
        "title",
        "description",
        "category"
      ],
      "ignoreFailure": false,
      "llmJudgmentRatingType": "SCORE0_1",
      "size": 10,
      "modelId": "DQmk2ZwBqLOthQZKMqU-",
      "overwriteCache": false,
      "searchConfigurationList": [
        "0fa1fedb-4bcb-469d-9fcb-2a5cd6709e1d"
      ],
      "tokenLimit": 4000,
      "promptTemplate": "Rate the relevance of these search results {{hits}} for the query '{{queryText}}' on a scale of 0-1, where 0 is completely irrelevant and 1 is perfectly relevant. Consider the product title, description, and category.",
      "querySetId": "4c6bf6f4-c2e4-4c76-a668-82de11d14846"
    },
    "judgmentRatings": [
      {
        "query": "smart tv",
        "ratings": [
          {
            "docId": "1",
            "rating": "0.9"
          },
          {
            "docId": "2",
            "rating": "0.8"
          }
        ]
      },
      {
        "query": "laptop computer",
        "ratings": [
          {
            "docId": "4",
            "rating": "0.9"
          }
        ]
      },
      {
        "query": "wireless headphones",
        "ratings": [
          {
            "docId": "3",
            "rating": "1.0"
          }
        ]
      }
    ]
  }
}
```


<details markdown="block">
  <summary>
    Test it
  </summary>
  {: .text-delta}

Check the judgment cache to see the individual generated ratings:

```json
GET /.plugins-search-relevance-judgment-cache/_search
{
  "size": 5,
  "query": {
    "match_all": {}
  }
}
```
{% include copy-curl.html %}

You should see documents with ratings between 0 and 1 generated by the LLM.
</details>

### Step 6: Run experiments with LLM judgments

Finally, you'll create an experiment to evaluate your `baseline` search configuration using the LLM-generated judgments.

**SHOULD THIS JUST BE SCREENSHOTS OF SRW????**

#### Step 6(a): Create a pointwise experiment

```json
PUT /_plugins/_search_relevance/experiments
{
  "querySetId": "electronics_queries_id",
  "searchConfigurationList": ["baseline_config_id"],
  "judgmentList": ["llm_judgment_id"],
  "size": 10,
  "type": "POINTWISE_EVALUATION"
}
```
{% include copy-curl.html %}

The response contains the experiment ID:

```json
{
  "experiment_id": "pointwise_experiment_id"
}
```

#### Step 6(b): View experiment results

```json
GET /_plugins/_search_relevance/experiments/pointwise_experiment_id
```
{% include copy-curl.html %}

The response shows evaluation metrics comparing your search configurations:

<details markdown="block">
  <summary>
    Results
  </summary>
  {: .text-delta}

```json
{
  "experiment_id": "pointwise_experiment_id",
  "query_set_id": "electronics_queries_id",
  "search_configuration_list": ["baseline_config_id"],
  "judgment_list": ["llm_judgment_id"],
  "type": "POINTWISE_EVALUATION",
  "results": {
    "baseline_config_id": {
      "precision_at_1": 0.67,
      "precision_at_3": 0.56,
      "precision_at_5": 0.48,
      "precision_at_10": 0.42,
      "recall_at_1": 0.67,
      "recall_at_3": 0.78,
      "recall_at_5": 0.85,
      "recall_at_10": 0.92,
      "ndcg_at_1": 0.67,
      "ndcg_at_3": 0.71,
      "ndcg_at_5": 0.73,
      "ndcg_at_10": 0.75
    },
    "title_boosted_config_id": {
      "precision_at_1": 0.78,
      "precision_at_3": 0.63,
      "precision_at_5": 0.52,
      "precision_at_10": 0.45,
      "recall_at_1": 0.78,
      "recall_at_3": 0.84,
      "recall_at_5": 0.89,
      "recall_at_10": 0.94,
      "ndcg_at_1": 0.78,
      "ndcg_at_3": 0.79,
      "ndcg_at_5": 0.81,
      "ndcg_at_10": 0.83
    }
  }
}
```

In this example, the title-boosted configuration shows better performance across most metrics, indicating that boosting the title field improves search relevance for these queries.
</details>

<details markdown="block">
  <summary>
    Test it
  </summary>
  {: .text-delta}

You can also view detailed evaluation results:

```json
GET /search-relevance-evaluation-result/_search
{
  "query": {
    "match": {
      "experiment_id": "pointwise_experiment_id"
    }
  }
}
```
{% include copy-curl.html %}
</details>

## Advanced features

### Custom prompt templates

You can customize the prompt template to focus on specific aspects of relevance:

```json
PUT /_plugins/_search_relevance/judgments
{
  "name": "Custom Prompt Judgment",
  "type": "LLM_JUDGMENT",
  "modelId": "MODEL_ID_HERE",
  "querySetId": "electronics_queries_id",
  "searchConfigurationList": ["baseline_config_id"],
  "promptTemplate": "As an e-commerce search expert, evaluate how well these products {{hits}} match the user's search for '{{queryText}}'. Consider product relevance, brand reputation, and price competitiveness. Rate each result from 0-1.",
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
  "querySetId": "electronics_queries_id",
  "searchConfigurationList": ["baseline_config_id"],
  "llmJudgmentRatingType": "RELEVANT_IRRELEVANT",
  "promptTemplate": "Determine if these search results {{hits}} are relevant or irrelevant for the query '{{queryText}}'. Consider exact matches and semantic relevance."
}
```
{% include copy-curl.html %}

### Using different LLM providers

You can adapt the connector configuration for other providers:

#### AWS Bedrock example:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "AWS Bedrock Connector",
  "description": "Connector to AWS Bedrock",
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

## Clean up

After you're done, delete the components you've created in this tutorial:

```json
DELETE /products
```
{% include copy-curl.html %}

```json
DELETE /_plugins/_search_relevance/experiments/pointwise_experiment_id
```
{% include copy-curl.html %}

```json
DELETE /_plugins/_search_relevance/judgments/llm_judgment_id
```
{% include copy-curl.html %}

```json
DELETE /_plugins/_search_relevance/query_sets/electronics_queries_id
```
{% include copy-curl.html %}

```json
DELETE /_plugins/_search_relevance/search_configurations/baseline_config_id
```
{% include copy-curl.html %}

```json
DELETE /_plugins/_search_relevance/search_configurations/title_boosted_config_id
```
{% include copy-curl.html %}

```json
POST /_plugins/_ml/models/MODEL_ID_HERE/_undeploy
```
{% include copy-curl.html %}

```json
DELETE /_plugins/_ml/models/MODEL_ID_HERE
```
{% include copy-curl.html %}

```json
DELETE /_plugins/_ml/connectors/abc123def456
```
{% include copy-curl.html %}

## Benefits of LLM-as-a-Judge

- **Scalability**: Generate judgments for thousands of query-document pairs without manual annotation
- **Consistency**: LLMs provide consistent evaluation criteria across all judgments
- **Cost-effective**: Reduce the need for expensive human annotation while maintaining quality
- **Rapid iteration**: Quickly evaluate new search configurations and features
- **Semantic understanding**: LLMs can assess semantic relevance beyond keyword matching

## Further reading

- Learn more about [Search Relevance Workbench]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/index/)
- Explore [ML Commons remote models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/)
- Read about [search evaluation metrics]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/evaluation-metrics/)

## Next steps

- Experiment with different LLM models and prompt templates
- Create more sophisticated query sets for comprehensive evaluation
- Integrate LLM judgments into your search development workflow
- Compare LLM judgments with human annotations to validate quality
