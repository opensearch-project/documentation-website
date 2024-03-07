---
layout: default
title: Search for a workflow state
parent: Workflow APIs
nav_order: 65
---

# Search for a workflow

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/flow-framework/issues/475).    
{: .warning}

You can search for resources created by workflows by matching a query to a field. The fields you can search correspond to those returned by the [Get Workflow Status API]({{site.url}}{{site.baseurl}}/automating-configurations/api/get-workflow-status/).

## Path and HTTP methods

```json
GET /_plugins/_flow_framework/workflow/state/_search
POST /_plugins/_flow_framework/workflow/state/_search
``` 

#### Example request: All workflows with a state of `NOT_STARTED`

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

#### Example request: All workflows that have a `resources_created` field with a `workflow_step_id` of `register_model_2`

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

#### Example response

The response contains documents matching the search parameters.