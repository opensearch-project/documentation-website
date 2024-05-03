---
layout: default
title: Get Stored Script Contexts
parent: Script APIs
nav_order: 5
---

# Get stored script contexts
**Introduced 1.0**
{: .label .label-purple }

Retrieves all contexts for stored scripts.

#### Example request

````json
GET _script_context
````
{% include copy-curl.html %}

#### Example response

The `GET _script_context` request returns the following fields:

````json
{
  "contexts" : [
    {
      "name" : "aggregation_selector",
      "methods" : [
        {
          "name" : "execute",
          "return_type" : "boolean",
          "params" : [ ]
        },
        {
          "name" : "getParams",
          "return_type" : "java.util.Map",
          "params" : [ ]
        }
      ]
    },
    {
      "name" : "aggs",
      "methods" : [
        {
          "name" : "execute",
          "return_type" : "java.lang.Object",
          "params" : [ ]
        },
        {
          "name" : "getDoc",
          "return_type" : "java.util.Map",
          "params" : [ ]
        },
        {
          "name" : "getParams",
          "return_type" : "java.util.Map",
          "params" : [ ]
        },
        {
          "name" : "get_score",
          "return_type" : "java.lang.Number",
          "params" : [ ]
        },
        {
          "name" : "get_value",
          "return_type" : "java.lang.Object",
          "params" : [ ]
        }
      ]
    },
    {
      "name" : "aggs_combine",
      "methods" : [
        {
          "name" : "execute",
          "return_type" : "java.lang.Object",
          "params" : [ ]
        },
        {
          "name" : "getParams",
          "return_type" : "java.util.Map",
          "params" : [ ]
        },
        {
          "name" : "getState",
          "return_type" : "java.util.Map",
          "params" : [ ]
        }
      ]
    },
    {
      "name" : "aggs_init",
      "methods" : [
        {
          "name" : "execute",
          "return_type" : "void",
          "params" : [ ]
        },
        {
          "name" : "getParams",
          "return_type" : "java.util.Map",
          "params" : [ ]
        },
        {
          "name" : "getState",
          "return_type" : "java.lang.Object",
          "params" : [ ]
        }
      ]
    },
    {
      "name" : "aggs_map",
      "methods" : [
        {
          "name" : "execute",
          "return_type" : "void",
          "params" : [ ]
        },
        {
          "name" : "getDoc",
          "return_type" : "java.util.Map",
          "params" : [ ]
        },
        {
          "name" : "getParams",
          "return_type" : "java.util.Map",
          "params" : [ ]
        },
        {
          "name" : "getState",
          "return_type" : "java.util.Map",
          "params" : [ ]
        },
        {
          "name" : "get_score",
          "return_type" : "double",
          "params" : [ ]
        }
      ]
    },
    {
      "name" : "aggs_reduce",
      "methods" : [
        {
          "name" : "execute",
          "return_type" : "java.lang.Object",
          "params" : [ ]
        },
        {
          "name" : "getParams",
          "return_type" : "java.util.Map",
          "params" : [ ]
        },
        {
          "name" : "getStates",
          "return_type" : "java.util.List",
          "params" : [ ]
        }
      ]
    },
    {
      "name" : "analysis",
      "methods" : [
        {
          "name" : "execute",
          "return_type" : "boolean",
          "params" : [
            {
              "type" : "org.opensearch.analysis.common.AnalysisPredicateScript$Token",
              "name" : "token"
            }
          ]
        }
      ]
    },
    {
      "name" : "bucket_aggregation",
      "methods" : [
        {
          "name" : "execute",
          "return_type" : "java.lang.Number",
          "params" : [ ]
        },
        {
          "name" : "getParams",
          "return_type" : "java.util.Map",
          "params" : [ ]
        }
      ]
    },
    {
      "name" : "field",
      "methods" : [
        {
          "name" : "execute",
          "return_type" : "java.lang.Object",
          "params" : [ ]
        },
        {
          "name" : "getDoc",
          "return_type" : "java.util.Map",
          "params" : [ ]
        },
        {
          "name" : "getParams",
          "return_type" : "java.util.Map",
          "params" : [ ]
        }
      ]
    },
    {
      "name" : "filter",
      "methods" : [
        {
          "name" : "execute",
          "return_type" : "boolean",
          "params" : [ ]
        },
        {
          "name" : "getDoc",
          "return_type" : "java.util.Map",
          "params" : [ ]
        },
        {
          "name" : "getParams",
          "return_type" : "java.util.Map",
          "params" : [ ]
        }
      ]
    },
    {
      "name" : "ingest",
      "methods" : [
        {
          "name" : "execute",
          "return_type" : "void",
          "params" : [
            {
              "type" : "java.util.Map",
              "name" : "ctx"
            }
          ]
        },
        {
          "name" : "getParams",
          "return_type" : "java.util.Map",
          "params" : [ ]
        }
      ]
    },
    {
      "name" : "interval",
      "methods" : [
        {
          "name" : "execute",
          "return_type" : "boolean",
          "params" : [
            {
              "type" : "org.opensearch.index.query.IntervalFilterScript$Interval",
              "name" : "interval"
            }
          ]
        }
      ]
    },
    {
      "name" : "moving-function",
      "methods" : [
        {
          "name" : "execute",
          "return_type" : "double",
          "params" : [
            {
              "type" : "java.util.Map",
              "name" : "params"
            },
            {
              "type" : "double[]",
              "name" : "values"
            }
          ]
        }
      ]
    },
    {
      "name" : "number_sort",
      "methods" : [
        {
          "name" : "execute",
          "return_type" : "double",
          "params" : [ ]
        },
        {
          "name" : "getDoc",
          "return_type" : "java.util.Map",
          "params" : [ ]
        },
        {
          "name" : "getParams",
          "return_type" : "java.util.Map",
          "params" : [ ]
        },
        {
          "name" : "get_score",
          "return_type" : "double",
          "params" : [ ]
        }
      ]
    },
    {
      "name" : "painless_test",
      "methods" : [
        {
          "name" : "execute",
          "return_type" : "java.lang.Object",
          "params" : [ ]
        },
        {
          "name" : "getParams",
          "return_type" : "java.util.Map",
          "params" : [ ]
        }
      ]
    },
    {
      "name" : "processor_conditional",
      "methods" : [
        {
          "name" : "execute",
          "return_type" : "boolean",
          "params" : [
            {
              "type" : "java.util.Map",
              "name" : "ctx"
            }
          ]
        },
        {
          "name" : "getParams",
          "return_type" : "java.util.Map",
          "params" : [ ]
        }
      ]
    },
    {
      "name" : "score",
      "methods" : [
        {
          "name" : "execute",
          "return_type" : "double",
          "params" : [
            {
              "type" : "org.opensearch.script.ScoreScript$ExplanationHolder",
              "name" : "explanation"
            }
          ]
        },
        {
          "name" : "getDoc",
          "return_type" : "java.util.Map",
          "params" : [ ]
        },
        {
          "name" : "getParams",
          "return_type" : "java.util.Map",
          "params" : [ ]
        },
        {
          "name" : "get_score",
          "return_type" : "double",
          "params" : [ ]
        }
      ]
    },
    {
      "name" : "script_heuristic",
      "methods" : [
        {
          "name" : "execute",
          "return_type" : "double",
          "params" : [
            {
              "type" : "java.util.Map",
              "name" : "params"
            }
          ]
        }
      ]
    },
    {
      "name" : "similarity",
      "methods" : [
        {
          "name" : "execute",
          "return_type" : "double",
          "params" : [
            {
              "type" : "double",
              "name" : "weight"
            },
            {
              "type" : "org.opensearch.index.similarity.ScriptedSimilarity$Query",
              "name" : "query"
            },
            {
              "type" : "org.opensearch.index.similarity.ScriptedSimilarity$Field",
              "name" : "field"
            },
            {
              "type" : "org.opensearch.index.similarity.ScriptedSimilarity$Term",
              "name" : "term"
            },
            {
              "type" : "org.opensearch.index.similarity.ScriptedSimilarity$Doc",
              "name" : "doc"
            }
          ]
        }
      ]
    },
    {
      "name" : "similarity_weight",
      "methods" : [
        {
          "name" : "execute",
          "return_type" : "double",
          "params" : [
            {
              "type" : "org.opensearch.index.similarity.ScriptedSimilarity$Query",
              "name" : "query"
            },
            {
              "type" : "org.opensearch.index.similarity.ScriptedSimilarity$Field",
              "name" : "field"
            },
            {
              "type" : "org.opensearch.index.similarity.ScriptedSimilarity$Term",
              "name" : "term"
            }
          ]
        }
      ]
    },
    {
      "name" : "string_sort",
      "methods" : [
        {
          "name" : "execute",
          "return_type" : "java.lang.String",
          "params" : [ ]
        },
        {
          "name" : "getDoc",
          "return_type" : "java.util.Map",
          "params" : [ ]
        },
        {
          "name" : "getParams",
          "return_type" : "java.util.Map",
          "params" : [ ]
        },
        {
          "name" : "get_score",
          "return_type" : "double",
          "params" : [ ]
        }
      ]
    },
    {
      "name" : "template",
      "methods" : [
        {
          "name" : "execute",
          "return_type" : "java.lang.String",
          "params" : [ ]
        },
        {
          "name" : "getParams",
          "return_type" : "java.util.Map",
          "params" : [ ]
        }
      ]
    },
    {
      "name" : "terms_set",
      "methods" : [
        {
          "name" : "execute",
          "return_type" : "java.lang.Number",
          "params" : [ ]
        },
        {
          "name" : "getDoc",
          "return_type" : "java.util.Map",
          "params" : [ ]
        },
        {
          "name" : "getParams",
          "return_type" : "java.util.Map",
          "params" : [ ]
        }
      ]
    },
    {
      "name" : "trigger",
      "methods" : [
        {
          "name" : "execute",
          "return_type" : "boolean",
          "params" : [
            {
              "type" : "org.opensearch.alerting.script.QueryLevelTriggerExecutionContext",
              "name" : "ctx"
            }
          ]
        },
        {
          "name" : "getParams",
          "return_type" : "java.util.Map",
          "params" : [ ]
        }
      ]
    },
    {
      "name" : "update",
      "methods" : [
        {
          "name" : "execute",
          "return_type" : "void",
          "params" : [ ]
        },
        {
          "name" : "getCtx",
          "return_type" : "java.util.Map",
          "params" : [ ]
        },
        {
          "name" : "getParams",
          "return_type" : "java.util.Map",
          "params" : [ ]
        }
      ]
    }
  ]
}
````

## Response fields

The `GET _script_context` request returns the following response fields:

| Field | Data type | Description | 
:--- | :--- | :---
| contexts | List | A list of all contexts. See [Script object](#script-context).  |

#### Script context

| Field | Data type | Description | 
:--- | :--- | :---
| name | String | The context name. |
|  methods | List | List of the context's allowable methods. See [Script object](#context-methods). |

#### Context methods

| Field | Data type | Description | 
:--- | :--- | :---
| name | String | Method name. |
| name | String | Type that the method returns (`boolean`, `object`, `number`, and so on). |
| params | List | List of the parameters accepted by the method. See [Script object](#method-parameters). |

#### Method parameters 

| Field | Data type | Description | 
:--- | :--- | :---
| type | String | Parameter data type. | 
| name | String | Parameter name. |