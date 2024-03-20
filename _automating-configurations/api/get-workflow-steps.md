---
layout: default
title: Get workflow steps
parent: Workflow APIs
nav_order: 50
---

# Get workflow steps

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/flow-framework/issues/475).    
{: .warning}

OpenSearch validates workflows by using the validation template that lists the required inputs, generated outputs, and required plugins for all steps. For example, for the `register_remote_model` step, the validation template appears as follows:

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

The Get Workflow Steps API retrieves [this](https://github.com/opensearch-project/flow-framework/blob/2.x/src/main/java/org/opensearch/flowframework/workflow/WorkflowStepFactory.java#L120-L229) enum.   

## Path and HTTP methods

To fetch all the workflow steps to figure out their inputs, outputs, required plugin for the workflow step and the timeout use the following request.

```json
GET /_plugins/_flow_framework/workflow/_steps
``` 

To fetch specific workflow steps, pass the step names to the request as a parameter.
#### Example request

```json
GET /_plugins/_flow_framework/workflow/_step?workflow_step=create_connector,delete_model,deploy_model
```
{% include copy-curl.html %}


#### Example response

OpenSearch responds with the validation template containing the steps. The order of fields in the returned steps may not exactly match the original JSON but will function identically.

To retrieve the template in YAML format, specify `Content-Type: application/yaml` in the request header:

```bash
curl -XGET "http://localhost:9200/_plugins/_flow_framework/workflow/_steps" -H 'Content-Type: application/yaml'
```

To retrieve the template in JSON format, specify `Content-Type: application/json` in the request header:

```bash
curl -XGET "http://localhost:9200/_plugins/_flow_framework/workflow/_steps" -H 'Content-Type: application/json'
```