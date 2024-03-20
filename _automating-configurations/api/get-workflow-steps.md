---
layout: default
title: Get workflow steps
parent: Workflow APIs
nav_order: 50
---

# Get workflow steps

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

The Get Workflow Steps API retrieves this file.   

## Path and HTTP methods

```json
GET /_plugins/_flow_framework/workflow/_steps
``` 

#### Example request

```json
GET /_plugins/_flow_framework/workflow/_steps
```
{% include copy-curl.html %}


#### Example response

OpenSearch responds with the validation template containing the steps. The order of fields in the returned steps may not exactly match the original JSON but will function identically.

To retrieve the template in YAML format, specify `Content-Type: application/yaml` in the request header:

```bash
curl -XGET "http://localhost:9200/_plugins/_flow_framework/workflow/8xL8bowB8y25Tqfenm50" -H 'Content-Type: application/yaml'
```

To retrieve the template in JSON format, specify `Content-Type: application/json` in the request header:

```bash
curl -XGET "http://localhost:9200/_plugins/_flow_framework/workflow/8xL8bowB8y25Tqfenm50" -H 'Content-Type: application/json'
```