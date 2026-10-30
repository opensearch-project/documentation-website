---
layout: default
title: Search for a workflow state
parent: Workflow APIs
grand_parent: AI search workflows
great_grand_parent: AI search
nav_order: 65
redirect_from:
  - /automating-configurations/api/search-workflow-state/
---

# Search Workflow State API

You can search for resources created by workflows by matching a query to a field. The fields you can search correspond to those returned by the [Get Workflow Status API]({{site.url}}{{site.baseurl}}/vector-search/ai-search/workflows/api/get-workflow-status/).

## Endpoints

```json
GET /_plugins/_flow_framework/workflow/state/_search
POST /_plugins/_flow_framework/workflow/state/_search
``` 

## Example request: All workflows with a state of `NOT_STARTED`

```json
GET /_plugins/_flow_framework/workflow/state/_search
{
  "query": {
    "match": {
      "state": "NOT_STARTED"
    }
  }
}
```
{% include copy-curl.html %}

## Example request: All workflows that have a `resources_created` field with a `workflow_step_id` of `register_model_2`

```json
GET /_plugins/_flow_framework/workflow/state/_search
{
  "query": {
    "nested": {
      "path": "resources_created",
      "query": {
        "bool": {
          "must": [
            {
              "match": {
                "resources_created.workflow_step_id": "register_model_2"
              }
            }
          ]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

The response contains documents matching the search parameters.