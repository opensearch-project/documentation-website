---
layout: default
title: Agentic search
parent: AI search
nav_order: 30
has_children: false
---

# Agentic search
This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

Introduced 3.2
{: .label .label-purple }

Agentic search lets users ask questions in natural language and have OpenSearch plan and execute the retrieval automatically. A preconfigured **agent** reads the question, plans the search, and returns relevant results.

**Prerequisite**<br>
Before using agentic search, you must configure an agent with the [`QueryPlanningTool`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/query-planning-tool/).

## Configuring semantic search

1. [Enable the agentic search feature flag](#step-1-enable-the-agentic-search-feature-flag).
2. [Create an index for ingestion](#step-2-create-an-index-for-ingestion).
3. [Ingest documents into the index](#step-3-ingest-documents-into-the-index).
4. [Create a search pipeline](#step-4-create-a-search-pipeline).
5. [Search the index](#step-5-search-the-index).

### Step 1: Enable the agentic search feature flag

Because this is an experimental feature in version 3.2, you must enable the feature flag:

```json
PUT _cluster/settings
{
  "persistent" : {
    "plugins.neural_search.agentic_search_enabled": true,
  }
}
```
{% include copy-curl.html %}



### Step 2: Create an index for ingestion

Create an index for ingestion:

```json
PUT /iris-index
{
  "mappings": {
    "properties": {
      "petal_length_in_cm": {
        "type": "float"
      },
      "petal_width_in_cm": {
        "type": "float"
      },
      "sepal_length_in_cm": {
        "type": "float"
      },
      "sepal_width_in_cm": {
        "type": "float"
      },
      "species": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

### Step 3: Ingest documents into the index

To ingest documents into the index created in the previous step, send the following requests:

```json
POST _bulk
{ "index": { "_index": "iris-index", "_id": "1" } }
{ "petal_length_in_cm": 1.4, "petal_width_in_cm": 0.2, "sepal_length_in_cm": 5.1, "sepal_width_in_cm": 3.5, "species": "setosa" }
{ "index": { "_index": "iris-index", "_id": "2" } }
{ "petal_length_in_cm": 4.5, "petal_width_in_cm": 1.5, "sepal_length_in_cm": 6.4, "sepal_width_in_cm": 2.9, "species": "versicolor" }
```
{% include copy-curl.html %}

### Step 4: Create a search pipeline

Create a search pipeline with an agentic query translator search request processor and pass the agent ID created with the QueryPlanningTool:

```json
PUT _search/pipeline/agentic-pipeline
{
     "request_processors": [
        {
            "agentic_query_translator": {
                "agent_id": "-E2Av5gBrRE4_QBCgKwl"
            }
        }
     ]
}
```
{% include copy-curl.html %}

### Step 5: Search the index

To perform agentic search, use the agentic query clause with your narural language question.

The following example request uses an agentic query to search for a natural language question:

```json
GET iris-index/_search?search_pipeline=agentic-pipeline
{
    "query": {
        "agentic": {
            "query_text": "List all the flowers present",
            "query_fields": ["species", "petal_length_in_cm"]
        }
    }
}
```
{% include copy-curl.html %}

The request contains the following fields:
1. `query_text`: The natural language question.
2. `query_fields` (optional): A list of fields that the agent should consider when generating the search query.


The agentic search request executes the agent with the QueryPlanningTool and sends the natural language question, along with the index mapping and a default prompt, to a large language model (LLM) to generate a query domain-specific language (DSL) query. The returned DSL query is then executed as a search request in OpenSearch:

```json
"hits": {
        "total": {
            "value": 2,
            "relation": "eq"
        },
        "max_score": 1.0,
        "hits": [
            {
                "_index": "iris-index",
                "_id": "1",
                "_score": 1.0,
                "_source": {
                    "petal_length_in_cm": 1.4,
                    "petal_width_in_cm": 0.2,
                    "sepal_length_in_cm": 5.1,
                    "sepal_width_in_cm": 3.5,
                    "species": "setosa"
                }
            },
            {
                "_index": "iris-index",
                "_id": "2",
                "_score": 1.0,
                "_source": {
                    "petal_length_in_cm": 4.5,
                    "petal_width_in_cm": 1.5,
                    "sepal_length_in_cm": 6.4,
                    "sepal_width_in_cm": 2.9,
                    "species": "versicolor"
                }
            }
        ]
    }
```

## Next steps

This is an experimental feature. See [[RFC] Design for Agentic Search #1479](https://github.com/opensearch-project/neural-search/issues/1479) and [[RFC] Agentic Search in OpenSearch #4005](https://github.com/opensearch-project/ml-commons/issues/4005) for information about future enhancements.  