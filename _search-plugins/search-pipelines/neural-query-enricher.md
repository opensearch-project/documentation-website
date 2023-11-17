---
layout: default
title: Neural query enricher
nav_order: 12
has_children: false
parent: Search processors
grand_parent: Search pipelines
---

# Neural query enricher processor

The `neural_query_enricher` search request processor is designed to set a default machine learning (ML) model ID at the index or field level for [neural search]({{site.url}}{{site.baseurl}}/search-plugins/neural-search/) queries. To learn more about ML models, see [Using ML models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/ml-framework/) and [Connecting to remote models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/index/).

## Request fields

The following table lists all available request fields.

Field | Data type | Description
:--- | :--- | :---
`default_model_id` | String | The model ID of the default model for an index. Optional. You must specify at least one `default_model_id` or `neural_field_default_id`. If both are provided, `neural_field_default_id` takes precedence.
`neural_field_default_id` | Object | A map of key-value pairs representing document field names and their associated default model IDs. Optional. You must specify at least one `default_model_id` or `neural_field_default_id`. If both are provided, `neural_field_default_id` takes precedence.
`tag` | String | The processor's identifier. Optional.
`description` | String | A description of the processor. Optional.

## Example 

The following example request creates a search pipeline with a `neural_query_enricher` search request processor. The processor sets a default model ID at the index level and provides different default model IDs for two specific fields in the index:

```json
PUT /_search/pipeline/default_model_pipeline 
{
  "request_processors": [
    {
      "neural_query_enricher" : {
        "tag": "tag1",
        "description": "Sets the default model ID at index and field levels",
        "default_model_id": "u5j0qYoBMtvQlfhaxOsa",
        "neural_field_default_id": {
           "my_field_1": "uZj0qYoBMtvQlfhaYeud",
           "my_field_2": "upj0qYoBMtvQlfhaZOuM"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}
