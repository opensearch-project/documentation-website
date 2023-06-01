---
layout: default
title: Script processor
nav_order: 30
has_children: false
parent: Search pipelines
grand_parent: Search
---

# Script processor

Script processor is part of search pipeline functionality. Search pipelines is an experimental feature. For updates on the progress of search pipelines, or if you want to leave feedback that could help improve the feature, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/6278).    
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
`description` | String | Description of the processor. Optional.

## Example 

The following request creates a search pipeline with a `script` request processor. The script limits score explanation to be included for one document only:

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

