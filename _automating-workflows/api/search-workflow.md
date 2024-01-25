---
layout: default
title: Search for a workflow
parent: Workflow API
nav_order: 60
---

# Search for a workflow

You can retrieve created workflows by their `workflow_id` or search for workflows using a query matching a field.  The `use_case` field is intended for searching for similar workflows.

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