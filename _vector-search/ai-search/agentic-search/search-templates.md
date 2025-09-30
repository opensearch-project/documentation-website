---
layout: default
title: Search Templates to improve determinism
parent: Agentic search
grand_parent: AI search
nav_order: 100
has_children: false
---

# Search Templates to improve determinism

The Query Planner Tool can accept a list of user-defined search templates during its registration. The Query Planner Tool generates DSL queries based on context and uses the attached search templates to generate the appropriate query.

## Why use Search Templates?

Search templates provide several key benefits:

- **Improve determinism**: Enhance query response consistency in Agentic Search. The major portion of the DSL query is provided by the search template, with only minor parts or placeholders filled by the LLM
- **Handle complex use cases**: Solve scenarios where the LLM struggles to generate correct queries
- **Consistent output**: Ensure predictable query structure and naming conventions

## How Search Templates work

1. **Template Definition**: Users provide a list of search templates alongside descriptions for each template
2. **Template Selection**: The Query Planner Tool chooses an appropriate search template based on the user's question and template descriptions
3. **Query Generation**: The LLM generates a query based on the selected search template

This approach allows you to solve really complicated use cases that would otherwise be challenging for the LLM alone.



## How to Use Search Templates: Example Use Case

### Step 1: Create Index

```json
PUT /stores
{
  "mappings": {
    "properties": {
      "store_id": { "type": "keyword" },
      "name":     { "type": "text", "fields": { "keyword": { "type": "keyword", "ignore_above": 256 } } },
      "address": {
        "properties": {
          "city":  { "type": "keyword" },
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

### Step 2: Ingest Documents

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

### Step 3: Register Template 1

Return stores in a city whose combined inventory across three SKUs is ≥ min_total.
```json
POST /_scripts/store_sum_skus
{
  "script": {
    "lang": "mustache",
    "source": {
      "size": 0,
      "query": { "term": { "address.city": "{{city}}" } },
      "aggs": {
        "by_store": {
          "terms": {
            "field": "store_id",
            "size": "{{bucket_size}}{{^bucket_size}}200{{/bucket_size}}",
            "order": { "inv>skus>q": "desc" }
          },
          "aggs": {
            "inv": {
              "nested": { "path": "inventory" },
              "aggs": {
                "skus": {
                  "filter": { "terms": { "inventory.sku": ["{{sku1}}","{{sku2}}","{{sku3}}"] } },
                  "aggs": { "q": { "sum": { "field": "inventory.qty" } } }
                }
              }
            },
            "keep": {
              "bucket_selector": {
                "buckets_path": { "t": "inv>skus>q" },
                "script": { "source": "params.t >= {{min_total}}{{^min_total}}30{{/min_total}}" }
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

### Step 4: Register Template 2
Count stores in a city that have at least min units of a single SKU
```json
POST /_scripts/store_sum_skus
{
  "script": {
    "lang": "mustache",
    "source": {
      "size": 0,
      "query": { "term": { "address.city": "{{city}}" } },
      "aggs": {
        "s": {
          "terms": {
            "field": "store_id",
            "size": "{{bs}}{{^bs}}200{{/bs}}"
          },
          "aggs": {
            "i": {
              "nested": { "path": "inventory" },
              "aggs": {
                "f": {
                  "filter": { "term": { "inventory.sku": "{{sku}}" } },
                  "aggs": { "q": { "sum": { "field": "inventory.qty" } } }
                }
              }
            },
            "m": {
              "bucket_script": {
                "buckets_path": { "x": "i>f>q" },
                "script": { "source": "params.x >= {{min}}{{^min}}10{{/min}} ? 1 : 0" }
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

### Step 5: Register Query Planner Tool with Search Templates

Refer to these to register query planner model and the agent model:

- [Create a model for Query Planning tool]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/index/#step-3-create-a-model-for-query-planning-tool)
- [Create a Model for Conversational Agent]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/index/#step-4-create-a-model-for-conversational-agent)
- [Create an Agent]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/index/#step-5-create-an-agent)
- [Create a search pipeline]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/index/#step-6-create-a-search-pipeline)

```json
{
    "name": "GPT 5 Agent for Agentic Search",
    "type": "conversational",
    "description": "Use this for Agentic Search",
    "llm": {
        "model_id": "{{llm_model_id}}",
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
                "model_id": "{{query_planner_model_id}}",
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

### Step 6: Hard Question Without Search Templates (Failing)

Register the search pipeline before performing the query:

- [Create a search pipeline]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/index/#step-6-create-a-search-pipeline)

**Agentic Search Query:** 
```json
POST /stores/_search?search_pipeline=my_pipeline
{
    "query": {
        "agentic": {
            "query_text": "List all stores in Seattle that have at least 30 combined units across these SKUs: iphone_17_air, iphone_17, and vision_pro."
        }
    }
}
```
{% include copy-curl.html %}

**LLM Response:** 
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

This error demonstrates that the LLM struggled to generate a valid query for this complex scenario. The failure occurred because:

- The query involves nested aggregations with multiple SKUs
- Complex filtering logic across inventory arrays
- Script-based calculations with type handling

LLMs often encounter issues with:
- Incorrect `_source` iteration patterns
- Misuse of `doc` values in scripts
- Type mismatches causing runtime `script_exception` errors

Let's now demonstrate how search templates solve this problem:

### Hard Question With Search Templates (Succeeding)

**Agentic Search Query:** 
```json
POST /stores/_search?search_pipeline=my_pipeline
{
    "query": {
        "agentic": {
            "query_text": "List all stores in Seattle that have at least 30 combined units across these SKUs: iphone_17_air, iphone_17, and vision_pro."
        }
    }
}
```
{% include copy-curl.html %}

**Generated Query:**
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

**Analysis of the successful response:**

The query executed successfully and returned the expected results. Key observations:

- **Template Selection**: The LLM correctly identified and used the `store_sum_skus` template
- **Parameter Filling**: Properly filled template parameters (`city: "Seattle"`, `sku1: "iphone_17_air"`, etc.)
- **Query Execution**: Generated a valid DSL query with nested aggregations and bucket selectors
- **Results**: Successfully returned stores (S-SEA-002 and S-SEA-003) with combined inventory ≥ 30 units

The search template approach eliminated the script errors and provided deterministic, reliable query generation for this complex use case.

## Best Practices

- **Clear descriptions**: Write detailed descriptions for each template to help the LLM choose correctly
- **Meaningful placeholders**: Use descriptive placeholder names that clearly indicate what should be filled
- **Template variety**: Create templates for different query patterns you commonly use
- **Test thoroughly**: Validate that templates work correctly with various inputs


