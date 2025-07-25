---
layout: default
title: Get a workflow
parent: Workflow APIs
nav_order: 20
canonical_url: https://docs.opensearch.org/latest/automating-configurations/api/get-workflow/
---

# Get a workflow

The Get Workflow API retrieves the workflow template.   

## Path and HTTP methods

```json
GET /_plugins/_flow_framework/workflow/<workflow_id>
```

## Path parameters

The following table lists the available path parameters. 

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `workflow_id` | String | The ID of the workflow to be retrieved. Required. |

#### Example request

```json
GET /_plugins/_flow_framework/workflow/8xL8bowB8y25Tqfenm50
```
{% include copy-curl.html %}

#### Example response

To retrieve a template in YAML format, specify `Content-Type: application/yaml` in the request header:

```bash
curl -XGET "http://localhost:9200/_plugins/_flow_framework/workflow/8xL8bowB8y25Tqfenm50" -H 'Content-Type: application/yaml'
```

To retrieve a template in JSON format, specify `Content-Type: application/json` in the request header:

```bash
curl -XGET "http://localhost:9200/_plugins/_flow_framework/workflow/8xL8bowB8y25Tqfenm50" -H 'Content-Type: application/json'
```

OpenSearch responds with the stored template containing the same content as the body of the [create workflow]({{site.url}}{{site.baseurl}}/automating-configurations/api/create-workflow/) request. The order of fields in the returned template may not exactly match the original template but will function identically.