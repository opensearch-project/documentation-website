---
layout: default
title: Get Script Language
parent: Script APIs
nav_order: 6
---

# Get script language
**Introduced 1.0**
{: .label .label-purple }

The get script language API operation retrieves all supported script languages and their contexts.

#### Example request

```json
GET _script_language
```
{% include copy-curl.html %}

#### Example response

The `GET _script_language` request returns the available contexts for each language:

```json
{
  "types_allowed" : [
    "inline",
    "stored"
  ],
  "language_contexts" : [
    {
      "language" : "expression",
      "contexts" : [
        "aggregation_selector",
        "aggs",
        "bucket_aggregation",
        "field",
        "filter",
        "number_sort",
        "score",
        "terms_set"
      ]
    },
    {
      "language" : "mustache",
      "contexts" : [
        "template"
      ]
    },
    {
      "language" : "opensearch_query_expression",
      "contexts" : [
        "aggs",
        "filter"
      ]
    },
    {
      "language" : "painless",
      "contexts" : [
        "aggregation_selector",
        "aggs",
        "aggs_combine",
        "aggs_init",
        "aggs_map",
        "aggs_reduce",
        "analysis",
        "bucket_aggregation",
        "field",
        "filter",
        "ingest",
        "interval",
        "moving-function",
        "number_sort",
        "painless_test",
        "processor_conditional",
        "score",
        "script_heuristic",
        "similarity",
        "similarity_weight",
        "string_sort",
        "template",
        "terms_set",
        "trigger",
        "update"
      ]
    }
  ]
}
```

## Response fields

The request contains the following response fields.

Field | Data type | Description | 
:--- | :--- | :---
types_allowed | List of strings | The types of scripts that are enabled, determined by the `script.allowed_types` setting. May contain `inline` and/or `stored`.
language_contexts | List of objects | A list of objects, each of which maps a supported language to its available contexts.
language_contexts.language | String | The name of the registered scripting language.
language_contexts.contexts | List of strings | A list of all contexts for the language, determined by the `script.allowed_contexts` setting.
