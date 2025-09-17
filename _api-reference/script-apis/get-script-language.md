---
layout: default
title: Get script languages
parent: Script APIs
nav_order: 60
---

# Get Script Languages API
**Introduced 1.0**
{: .label .label-purple }

The Get Script Languages API retrieves all supported script languages (such as Painless) and the contexts in which they can be used.

## Example request

<!-- spec_insert_start
component: example_code
rest: GET /_script_language
-->
{% capture step1_rest %}
GET /_script_language
{% endcapture %}

{% capture step1_python %}

response = client.get_script_languages()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

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

## Response body fields

The request contains the following response fields.

Field | Data type | Description | 
:--- | :--- | :---
types_allowed | List of strings | The types of scripts that are enabled, determined by the `script.allowed_types` setting. May contain `inline` and/or `stored`.
language_contexts | List of objects | A list of objects, each of which maps a supported language to its available contexts.
language_contexts.language | String | The name of the registered scripting language.
language_contexts.contexts | List of strings | A list of all contexts for the language, determined by the `script.allowed_contexts` setting.
