---
layout: default
title: Search for a workflow
parent: Workflow APIs
grand_parent: AI search workflows
great_grand_parent: AI search
nav_order: 60
redirect_from:
  - /automating-configurations/api/search-workflow/
---

# Search Workflow API

You can retrieve created workflows with their `workflow_id` or search for workflows by using a query matching a field. You can use the `use_case` field to search for similar workflows.

## Endpoints

```json
GET /_plugins/_flow_framework/workflow/_search
POST /_plugins/_flow_framework/workflow/_search
``` 

## Example request: All created workflows

```json
GET /_plugins/_flow_framework/workflow/_search
{
  "query": {
    "match_all": {}
  }
}
```
{% include copy-curl.html %}

## Example request: All workflows with a `use_case` of `REMOTE_MODEL_DEPLOYMENT`

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

## Example response

OpenSearch responds with a list of workflow templates matching the search parameters.