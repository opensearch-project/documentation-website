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

`source` | Inline script | The script to run. Required.
`tag` | String | The processor's identifier. Optional.
`description` | String | Description of the processor. Optional.

## Example 

The following request creates a search pipeline with a `script` request processor. If the query contains at least two words, the script takes every adjacent pair of words and joins them with an `and`. The resulting pairs are joined with an `or`:

```json
PUT /_search/pipeline/my_pipeline
{
  "request_processors": [
    {
      "script": {
        "source": """
        if (cxt.source['query'] != null) {
            StringBuilder queryBuilder = new StringBuilder();
            String[] terms = cxt.source['query'].splitOnToken(' ');
            if (terms.length >= 2) {
            for (int i = 1; i < terms.length; i++) {
                if (queryBuilder.length() > 0) {
                queryBuilder.append(' OR ');
                }
                queryBuilder.append('(').append(terms[i-1]).append(' AND ').append(terms[i]).append(')');
            }
            cxt.source['query'] = queryBuilder.toString();
            }
        }
        """
      }
    }
  ]
}
```
{% include copy-curl.html %}

For example, if the `query` is `x y z`, then after running the script it becomes `(x AND y) OR (y AND z)`.