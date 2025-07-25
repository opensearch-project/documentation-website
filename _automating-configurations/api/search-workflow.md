---
layout: default
title: Search for a workflow
parent: Workflow APIs
nav_order: 60
canonical_url: https://docs.opensearch.org/latest/automating-configurations/api/search-workflow/
---

# Search for a workflow

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/flow-framework/issues/475).    
{: .warning}

You can retrieve created workflows with their `workflow_id` or search for workflows by using a query matching a field. You can use the `use_case` field to search for similar workflows.

## Path and HTTP methods

```json
GET /_plugins/_flow_framework/workflow/_search
POST /_plugins/_flow_framework/workflow/_search
``` 

#### Example request: All created workflows

```json
GET /_plugins/_flow_framework/workflow/_search
{
  "query": {
    "match_all": {}
  }
}
```
{% include copy-curl.html %}

#### Example request: All workflows with a `use_case` of `REMOTE_MODEL_DEPLOYMENT`

```json
GET /_plugins/_flow_framework/workflow/_search
{
  "query": {
    "match": {
      "use_case": "REMOTE_MODEL_DEPLOYMENT"
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

OpenSearch responds with a list of workflow templates matching the search parameters.