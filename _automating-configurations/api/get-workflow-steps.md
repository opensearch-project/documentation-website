---
layout: default
title: Get workflow steps
parent: Workflow APIs
nav_order: 50
canonical_url: https://docs.opensearch.org/docs/latest/automating-configurations/api/get-workflow-steps/
---

# Get workflow steps

This API returns a list of workflow steps, including their required inputs, outputs, default timeout values, and required plugins. For example, for the `register_remote_model` step, the Get Workflow Steps API returns the following information:

```json
{
  "register_remote_model": {
    "inputs": [
      "name",
      "connector_id"
    ],
    "outputs": [
      "model_id",
      "register_model_status"
    ],
    "required_plugins": [
      "opensearch-ml"
    ]
  }
}
``` 

## Endpoints

```json
GET /_plugins/_flow_framework/workflow/_steps
GET /_plugins/_flow_framework/workflow/_steps?workflow_step=<step_name>
``` 

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `workflow_step` | String | The name of the step to retrieve. Specify multiple step names as a comma-separated list. For example, `create_connector,delete_model,deploy_model`. |

#### Example request

To fetch all workflow steps, use the following request:

```json
GET /_plugins/_flow_framework/workflow/_steps
``` 
{% include copy-curl.html %}

To fetch specific workflow steps, pass the step names to the request as a query parameter:

```json
GET /_plugins/_flow_framework/workflow/_step?workflow_steps=create_connector,delete_model,deploy_model
```
{% include copy-curl.html %}


#### Example response

OpenSearch responds with the workflow steps. The order of fields in the returned steps may not exactly match the original JSON but will function identically.

To retrieve the template in YAML format, specify `Content-Type: application/yaml` in the request header:

```bash
curl -XGET "http://localhost:9200/_plugins/_flow_framework/workflow/_steps" -H 'Content-Type: application/yaml'
```

To retrieve the template in JSON format, specify `Content-Type: application/json` in the request header:

```bash
curl -XGET "http://localhost:9200/_plugins/_flow_framework/workflow/_steps" -H 'Content-Type: application/json'
```
