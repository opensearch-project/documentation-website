---
layout: default
title: Search agent
parent: Agent APIs
grand_parent: ML Commons APIs
nav_order: 30
canonical_url: https://docs.opensearch.org/docs/latest/ml-commons-plugin/api/agent-apis/search-agent/
---

# Search for an agent
**Introduced 2.13**
{: .label .label-purple }

Use this command to search for agents you've already created. You can provide any OpenSearch search query in the request body.

## Endpoints

```json
GET /_plugins/_ml/agents/_search
POST /_plugins/_ml/agents/_search
```

#### Example request: Searching for all agents

```json
POST /_plugins/_ml/agents/_search
{
  "query": {
    "match_all": {}
  },
  "size": 1000
}
```
{% include copy-curl.html %}

#### Example request: Searching for agents of a certain type

```json
POST /_plugins/_ml/agents/_search
{
  "query": {
    "term": {
      "type": {
        "value": "flow"
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example: Searching for an agent by description

```json
GET _plugins/_ml/agents/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "description": "test agent"
          }
        }
      ]
    }
  },
  "size": 1000
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
      "value": 6,
      "relation": "eq"
    },
    "max_score": 0.15019803,
    "hits": [
      {
        "_index": ".plugins-ml-agent",
        "_id": "8HXlkI0BfUsSoeNTP_0P",
        "_version": 1,
        "_seq_no": 17,
        "_primary_term": 2,
        "_score": 0.13904166,
        "_source": {
          "created_time": 1707532959502,
          "last_updated_time": 1707532959502,
          "name": "Test_Agent_For_RagTool",
          "description": "this is a test flow agent",
          "type": "flow",
          "tools": [
            {
              "description": "A description of the tool",
              "include_output_in_agent_response": false,
              "type": "RAGTool",
              "parameters": {
                "inference_model_id": "gnDIbI0BfUsSoeNT_jAw",
                "embedding_model_id": "Yg7HZo0B9ggZeh2gYjtu_2",
                "input": "${parameters.question}",
                "source_field": """["text"]""",
                "embedding_field": "embedding",
                "index": "my_test_data",
                "query_type": "neural",
                "prompt": """

Human:You are a professional data analyst. You will always answer question based on the given context first. If the answer is not directly shown in the context, you will analyze the data and find the answer. If you don't know the answer, just say don't know. 

 Context:
${parameters.output_field}

Human:${parameters.question}

Assistant:"""
              }
            }
          ]
        }
      }
    ]
  }
}
```

## Response body fields

For response field descriptions, see [Register Agent API request fields]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agent-apis/register-agent#request-body-fields).
