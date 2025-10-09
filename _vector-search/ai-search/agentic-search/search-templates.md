---
layout: default
title: Adding search templates
parent: Agentic search
grand_parent: AI search
nav_order: 100
has_children: false
---

# Adding search templates

The `QueryPlanningTool` can accept a list of [search templates]({{site.url}}{{site.baseurl}}/search-plugins/search-template/) during its registration. During search, the `QueryPlanningTool` chooses an appropriate search template based on the user's question and template descriptions, and the large language model (LLM) generates a query based on the selected search template. 

This approach allows you to solve complex use cases that would otherwise be challenging for the LLM alone:

- Enhances query response consistency in agentic search. Most of the query domain-specific language (DSL) query is provided by the search template, with only minor portions or placeholders provided by the LLM.
- Handles complex use cases in which the LLM struggles to generate correct queries.
- Ensures predictable query structure and naming conventions.

## Best practices

When creating search templates for agentic search, follow these guidelines:

- Write detailed descriptions for each template to help the LLM choose appropriately.
- Use descriptive placeholder names that clearly indicate what should be filled.
- Create templates for different query patterns you commonly use.
- Validate that templates work correctly with various inputs before deployment.

## Step 1: Create an index

Create a stores index with nested inventory data to demonstrate complex aggregation scenarios:

```json
PUT /stores
{
  "mappings": {
    "properties": {
      "store_id": { "type": "keyword" },
      "name": { "type": "text", "fields": { "keyword": { "type": "keyword", "ignore_above": 256 } } },
      "address": {
        "properties": {
          "city": { "type": "keyword" },
          "state": { "type": "keyword" }
        }
      },
      "location": { "type": "geo_point" },
      "inventory": {
        "type": "nested",
        "properties": {
          "sku": { "type": "keyword" },
          "qty": { "type": "integer" }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Step 2: Ingest documents

Add sample store documents containing inventory data for different cities and products:

```json
POST /_bulk
{ "index": { "_index": "stores", "_id": "S-SEA-001" } }
{ "store_id": "S-SEA-001", "name": "Downtown Seattle", "address": { "city": "Seattle", "state": "WA" }, "location": { "lat": 47.608, "lon": -122.335 }, "inventory": [ { "sku": "iphone_17_air", "qty": 12 }, { "sku": "iphone_17", "qty": 11 }, { "sku": "vision_pro", "qty": 3 } ] }
{ "index": { "_index": "stores", "_id": "S-SEA-002" } }
{ "store_id": "S-SEA-002", "name": "Capitol Hill", "address": { "city": "Seattle", "state": "WA" }, "location": { "lat": 47.623, "lon": -122.319 }, "inventory": [ { "sku": "iphone_17_air", "qty": 5 }, { "sku": "iphone_17", "qty": 25 }, { "sku": "vision_pro", "qty": 4 } ] }
{ "index": { "_index": "stores", "_id": "S-SEA-003" } }
{ "store_id": "S-SEA-003", "name": "South Lake Union", "address": { "city": "Seattle", "state": "WA" }, "location": { "lat": 47.626, "lon": -122.338 }, "inventory": [ { "sku": "iphone_17_air", "qty": 6 }, { "sku": "iphone_17", "qty": 9 }, { "sku": "vision_pro", "qty": 20 } ] }
{ "index": { "_index": "stores", "_id": "S-BEL-001" } }
{ "store_id": "S-BEL-001", "name": "Bellevue Square", "address": { "city": "Bellevue", "state": "WA" }, "location": { "lat": 47.616, "lon": -122.203 }, "inventory": [ { "sku": "iphone_17_air", "qty": 14 }, { "sku": "iphone_17", "qty": 4 }, { "sku": "vision_pro", "qty": 1 } ] }
{ "index": { "_index": "stores", "_id": "S-SEA-004" } }
{ "store_id": "S-SEA-004", "name": "Ballard", "address": { "city": "Seattle", "state": "WA" }, "location": { "lat": 47.668, "lon": -122.382 }, "inventory": [ { "sku": "iphone_17_air", "qty": 9 }, { "sku": "iphone_17", "qty": 7 }, { "sku": "vision_pro", "qty": 12 } ] }

```
{% include copy-curl.html %}

## Step 3: Register search templates

Register a search template that returns stores in a city whose combined inventory across three SKUs meets a minimum threshold:

```json
POST /_scripts/store_sum_skus
{
  "script": {
    "lang": "mustache",
    "source": {
      "size": 0,
      "query": { "term": { "address.city": "{% raw %}{{city}}{% endraw %}" } },
      "aggs": {
        "by_store": {
          "terms": {
            "field": "store_id",
            "size": "{% raw %}{{bucket_size}}{{^bucket_size}}200{{/bucket_size}}{% endraw %}",
            "order": { "inv>skus>q": "desc" }
          },
          "aggs": {
            "inv": {
              "nested": { "path": "inventory" },
              "aggs": {
                "skus": {
                  "filter": { "terms": { "inventory.sku": ["{% raw %}{{sku1}}{% endraw %}","{% raw %}{{sku2}}{% endraw %}","{% raw %}{{sku3}}{% endraw %}"] } },
                  "aggs": { "q": { "sum": { "field": "inventory.qty" } } }
                }
              }
            },
            "keep": {
              "bucket_selector": {
                "buckets_path": { "t": "inv>skus>q" },
                "script": { "source": "params.t >= {% raw %}{{min_total}}{{^min_total}}30{{/min_total}}{% endraw %}" }
              }
            },
            "store": {
              "top_hits": {
                "size": 1,
                "_source": { "includes": ["store_id","name","address.city"] }
              }
            }
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Register a search template that counts stores in a city that have at least a minimum quantity of a specific SKU:

```json
POST /_scripts/stores_with_give_sku
{
  "script": {
    "lang": "mustache",
    "source": {
      "size": 0,
      "query": { "term": { "address.city": "{% raw %}{{city}}{% endraw %}" } },
      "aggs": {
        "s": {
          "terms": {
            "field": "store_id",
            "size": "{% raw %}{{bs}}{{^bs}}200{{/bs}}{% endraw %}"
          },
          "aggs": {
            "i": {
              "nested": { "path": "inventory" },
              "aggs": {
                "f": {
                  "filter": { "term": { "inventory.sku": "{% raw %}{{sku}}{% endraw %}" } },
                  "aggs": { "q": { "sum": { "field": "inventory.qty" } } }
                }
              }
            },
            "m": {
              "bucket_script": {
                "buckets_path": { "x": "i>f>q" },
                "script": { "source": "{% raw %}params.x >= {{min}}{{^min}}10{{/min}} ? 1 : 0{% endraw %}" }
              }
            }
          }
        },
        "cnt": { "sum_bucket": { "buckets_path": "s>m" } }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Step 4: Register an agent with the QueryPlanningTool

Next, register an agent with the `QueryPlanningTool`, and configure the tool to use your search templates.

### Step 4(a): Create a model for the agent and QueryPlanningTool

Register a model for both the conversational agent and the `QueryPlanningTool`:

```json
POST /_plugins/_ml/models/_register
{
  "name": "My OpenAI model: gpt-5",
  "function_name": "remote",
  "description": "Model for agentic search with templates",
  "connector": {
    "name": "My openai connector: gpt-5",
    "description": "The connector to openai chat model",
    "version": 1,
    "protocol": "http",
    "parameters": {
      "model": "gpt-5"
    },
    "credential": {
      "openAI_key": "<OPEN AI KEY>"
    },
    "actions": [
      {
        "action_type": "predict",
        "method": "POST",
        "url": "https://api.openai.com/v1/chat/completions",
        "headers": {
          "Authorization": "Bearer ${credential.openAI_key}"
        },
        "request_body": "{ \"model\": \"${parameters.model}\", \"messages\": [{\"role\":\"developer\",\"content\":\"${parameters.system_prompt}\"},${parameters._chat_history:-}{\"role\":\"user\",\"content\":\"${parameters.user_prompt}\"}${parameters._interactions:-}], \"reasoning_effort\":\"low\"${parameters.tool_configs:-}}"
      }
    ]
  }
}
```
{% include copy-curl.html %}

### Step 4(b): Register an agent with search templates

Register an agent with the `QueryPlanningTool` configured to use your search templates:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Store Search Agent with Templates",
  "type": "conversational",
  "description": "Agent for store inventory searches using templates",
  "llm": {
    "model_id": "your-model-id-from-step-4a",
    "parameters": {
      "max_iteration": 15
    }
  },
  "memory": {
    "type": "conversation_index"
  },
  "parameters": {
    "_llm_interface": "openai/v1/chat/completions"
  },
  "tools": [
    {
      "type": "QueryPlanningTool",
      "parameters": {
        "model_id": "your-model-id-from-step-4a",
        "generation_type": "user_templates",
        "search_templates": [
          {
            "template_id": "store_sum_skus",
            "template_description": "Return stores in a given city where the combined quantity across a list of SKUs meets or exceeds a threshold."
          },
          {
            "template_id": "stores_with_give_sku",
            "template_description": "List stores in a given city that have at least min_qty units of a specific SKU."
          }
        ]
      }
    }
  ],
  "app_type": "os_chat"
}
```
{% include copy-curl.html %}

## Step 5: Create a search pipeline

Create a search pipeline that uses your agent with search templates:

```json
PUT _search/pipeline/agentic-pipeline
{
    "request_processors": [
        {
            "agentic_query_translator": {
                "agent_id": "your-agent-id-from-step-4b"
            }
        }
    ],
    "response_processors": [
        {
            "agentic_context": {
                "agent_steps_summary": true,
                "dsl_query": true
            }
        }
    ]
}
```
{% include copy-curl.html %}

## Step 6: Test a complex question

Send a complex query that requires advanced aggregations:

```json
POST /stores/_search?search_pipeline=agentic-pipeline
{
  "query": {
    "agentic": {
      "query_text": "List all stores in Seattle that have at least 30 combined units across these SKUs: iphone_17_air, iphone_17, and vision_pro."
    }
  }
}
```
{% include copy-curl.html %}

Without search templates, complex queries involving advanced aggregations and scripts often fail because LLMs struggle to generate the correct syntax. For example, if you did not add search templates when creating an agent in Step 4(b), the preceding request would return a script execution error similar to the following:

<details markdown="block">
  <summary>
    Error response
  </summary>
  {: .text-delta}

```json
{
  "error": {
    "root_cause": [
      {
        "type": "script_exception",
        "reason": "runtime error",
        "script_stack": [
          "for (item in params._source.inventory) { ",
          "                           ^---- HERE"
        ],
        "script": "int total = 0; for (item in params._source.inventory) { if (params.skus.contains(item.sku)) { if (item.qty instanceof Integer || item.qty instanceof Long) { total += (int)item.qty; } else if (item.qty instanceof String) { try { total += Integer.parseInt(it ...",
        "lang": "painless",
        "position": {
          "offset": 42,
          "start": 15,
          "end": 56
        }
      }
    ],
    "type": "search_phase_execution_exception",
    "reason": "all shards failed",
    "phase": "query",
    "grouped": true,
    "failed_shards": [
      {
        "shard": 0,
        "index": "stores",
        "node": "u3NEXA8PS8W8EJcT_9suGg",
        "reason": {
          "type": "script_exception",
          "reason": "runtime error",
          "script_stack": [
            "for (item in params._source.inventory) { ",
            "                           ^---- HERE"
          ],
          "script": "int total = 0; for (item in params._source.inventory) { if (params.skus.contains(item.sku)) { if (item.qty instanceof Integer || item.qty instanceof Long) { total += (int)item.qty; } else if (item.qty instanceof String) { try { total += Integer.parseInt(it ...",
          "lang": "painless",
          "position": {
            "offset": 42,
            "start": 15,
            "end": 56
          },
          "caused_by": {
            "type": "null_pointer_exception",
            "reason": "Cannot invoke \"Object.getClass()\" because \"callArgs[0]\" is null"
          }
        }
      }
    ]
  },
  "status": 400
}
```

</details>

However, with search templates, the agent can handle sophisticated queries by selecting the appropriate template and filling in the parameters. The LLM correctly identifies and uses the `store_sum_skus` template, fills the template parameters (such as `city: "Seattle"` and `sku1: "iphone_17_air"`), and generates a valid query with nested aggregations and bucket selectors. The response contains stores (`S-SEA-002` and `S-SEA-003`) with a combined inventory of ≥ 30 units:

```json
{
  "took": 21658,
  "timed_out": false,
  "terminated_early": true,
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
    "hits": []
  },
  "aggregations": {
    "by_store": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "S-SEA-002",
          "doc_count": 1,
          "inv": {
            "doc_count": 3,
            "skus": {
              "doc_count": 3,
              "sum_qty": {
                "value": 34.0
              }
            }
          },
          "store": {
            "hits": {
              "total": {
                "value": 1,
                "relation": "eq"
              },
              "max_score": 1.0,
              "hits": [
                {
                  "_index": "stores",
                  "_id": "S-SEA-002",
                  "_score": 1.0,
                  "_source": {
                    "store_id": "S-SEA-002",
                    "address": {
                      "city": "Seattle"
                    },
                    "name": "Capitol Hill"
                  }
                }
              ]
            }
          }
        },
        {
          "key": "S-SEA-003",
          "doc_count": 1,
          "inv": {
            "doc_count": 3,
            "skus": {
              "doc_count": 3,
              "sum_qty": {
                "value": 35.0
              }
            }
          },
          "store": {
            "hits": {
              "total": {
                "value": 1,
                "relation": "eq"
              },
              "max_score": 1.0,
              "hits": [
                {
                  "_index": "stores",
                  "_id": "S-SEA-003",
                  "_score": 1.0,
                  "_source": {
                    "store_id": "S-SEA-003",
                    "address": {
                      "city": "Seattle"
                    },
                    "name": "South Lake Union"
                  }
                }
              ]
            }
          }
        }
      ]
    }
  },
  "ext": {
    "agent_steps_summary": "I have these tools available: [ListIndexTool, IndexMappingTool, query_planner_tool]\nFirst I used: query_planner_tool — qpt.question: \"List all stores in Seattle that have at least a combined total of 30 units across the following SKUs: \\\"iphone_17_air\\\", \\\"iphone_17\\\", and \\\"vision_pro\\\". The location must be Seattle. Sum the inventory counts for only these three SKUs per store and return stores where the sum is greater than or equal to 30.\"; index_name_provided: \"stores\"\nValidation: qpt output is valid JSON; adjusted numeric literals to integers and sizes to integers.",
    "memory_id": "-BxpmJkB-5P992SCQ-qU",
    "dsl_query":"{\"size\":0.0,\"query\":{\"term\":{\"address.city\":\"Seattle\"}},\"aggs\":{\"by_store\":{\"terms\":{\"field\":\"store_id\",\"size\":200.0},\"aggs\":{\"inv\":{\"nested\":{\"path\":\"inventory\"},\"aggs\":{\"skus\":{\"filter\":{\"terms\":{\"inventory.sku\":[\"iphone_17_air\",\"iphone_17\",\"vision_pro\"]}},\"aggs\":{\"sum_qty\":{\"sum\":{\"field\":\"inventory.qty\"}}}}}},\"keep\":{\"bucket_selector\":{\"buckets_path\":{\"total\":\"inv\>skus\>sum_qty\"},\"script\":{\"source\":\"params.total \>\= 30\"}}},\"store\":{\"top_hits\":{\"size\":1.0,\"_source\":{\"includes\":[\"store_id\",\"name\",\"address.city\"]}}}}}}}"
  }
}
```

## Related documentation

- [Search templates]({{site.url}}{{site.baseurl}}/search-plugins/search-template/)
