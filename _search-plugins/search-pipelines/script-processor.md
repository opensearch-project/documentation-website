---
layout: default
title: Script processor
nav_order: 30
has_children: false
parent: Search pipelines
grand_parent: Search
canonical_url: https://docs.opensearch.org/latest/search-plugins/search-pipelines/script-processor/
---

# Script processor

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion in the [OpenSearch forum](https://forum.opensearch.org/t/rfc-search-pipelines/12099).    
{: .warning}

The `script` search request processor intercepts a search request and adds an inline Painless script that is run on incoming requests. The script can only run on the following request fields:

- `from` 
- `size` 
- `explain` 
- `version` 
- `seq_no_primary_term` 
- `track_scores`  
- `track_total_hits` 
- `min_score` 
- `terminate_after` 
- `profile` 

For request field definitions, see [search request fields]({{site.url}}{{site.baseurl}}/api-reference/search#request-body).

## Request fields

The following table lists all available request fields.

Field | Data type | Description
:--- | :--- | :---
`source` | Inline script | The script to run. Required.
`lang` | String | The script language. Optional. Only `painless` is supported.
`tag` | String | The processor's identifier. Optional.
`description` | String | A description of the processor. Optional.

## Example 

The following request creates a search pipeline with a `script` request processor. The script limits score explanation to only one document because `explain` is an expensive operation:

```json
PUT /_search/pipeline/explain_one_result
{
  "description": "A pipeline to limit the explain operation to one result only",
  "request_processors": [
    {
      "script": {
        "lang": "painless",
        "source": "if (ctx._source['size'] > 1) { ctx._source['explain'] = false } else { ctx._source['explain'] = true }"
      }
    }
  ]
} 
```
{% include copy-curl.html %}

