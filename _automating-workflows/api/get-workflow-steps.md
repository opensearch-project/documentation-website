---
layout: default
title: Get workflow steps
parent: Workflow API
nav_order: 50
---

# Get workflow steps

OpenSearch validates workflows using the [JSON file](https://github.com/opensearch-project/automating-workflows/blob/main/src/main/resources/mappings/workflow-steps.json) that lists the required inputs and generated outputs for all steps. The Get Workflow Steps API retrieves this file.   

## Path and HTTP methods

```json
GET /_plugins/_flow_framework/workflow/_steps
``` 

### Example request

```json
GET /_plugins/_flow_framework/workflow/_steps
```
{% include copy-curl.html %}


### Example response

OpenSearch responds with the [JSON file](https://github.com/opensearch-project/automating-workflows/blob/main/src/main/resources/mappings/workflow-steps.json) containing the steps. The order of fields in the returned steps may not exactly match the original JSON but will function identically.

To retrieve a template in YAML format, specify `Content-Type: application/yaml` in the request header:

```bash
curl -XGET "http://localhost:9200/_plugins/_flow_framework/workflow/8xL8bowB8y25Tqfenm50" -H 'Content-Type: application/yaml'
```

To retrieve a template in JSON format, specify `Content-Type: application/json` in the request header:

```bash
curl -XGET "http://localhost:9200/_plugins/_flow_framework/workflow/8xL8bowB8y25Tqfenm50" -H 'Content-Type: application/json'
```