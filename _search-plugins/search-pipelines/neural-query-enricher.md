---
layout: default
title: Neural query enrich
nav_order: 12
has_children: false
parent: Search processors
grand_parent: Search pipelines
---

# Neural query enrich processor

The `neural_query_enricher` search request processor is designed to set a default machine learning (ML) model ID at index or field level for [neural search]({{site.url}}{{site.baseurl}}/search-plugins/neural-search/) queries. To learn more about ML models, see [ML Framework]({{site.url}}{{site.baseurl}}/ml-commons-plugin/ml-framework/).

## Request fields

The following table lists all available request fields.

Field | Data type | Description
:--- | :--- | :---
`default_model_id` | String | The model ID of the default model for an index. Optional. You must specify at least one of `default_model_id` and `neural_field_default_id`.
`neural_field_default_id` | Object | A map of key-value pairs representing document field names and their associated default model IDs. Optional. You must specify at least one of `default_model_id` and `neural_field_default_id`.
`tag` | String | The processor's identifier. Optional.
`description` | String | A description of the processor. Optional.

## Example 

The following request creates a search pipeline with a `neural_query_enricher` request processor. The processor sets a default model ID at index level and provides different default model IDs for two specific fields in the index:

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
