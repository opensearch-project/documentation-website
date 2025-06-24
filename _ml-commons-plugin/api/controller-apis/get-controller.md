---
layout: default
title: Get controller
parent: Controller APIs
grand_parent: ML Commons APIs
nav_order: 20
canonical_url: https://docs.opensearch.org/docs/latest/ml-commons-plugin/api/controller-apis/get-controller/
---

# Get a controller
**Introduced 2.12**
{: .label .label-purple }

Use this API to retrieve information about a controller for a model by model ID.

### Endpoints

```json
GET /_plugins/_ml/controllers/<model_id>
```

## Path parameters

The following table lists the available path parameters. 

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `model_id` | String | The model ID of the model for which to retrieve the controller. |

#### Example request

```json
GET /_plugins/_ml/controllers/T_S-cY0BKCJ3ot9qr0aP
```
{% include copy-curl.html %}

#### Example response

```json
{
  "model_id": "T_S-cY0BKCJ3ot9qr0aP",
  "user_rate_limiter": {
    "user1": {
      "limit": "4",
      "unit": "MINUTES"
    },
    "user2": {
      "limit": "4",
      "unit": "MINUTES"
    }
  }
}
```

If there is no controller defined for the model, OpenSearch returns an error:

```json
{
  "error": {
    "root_cause": [
      {
        "type": "status_exception",
        "reason": "Failed to find model controller with the provided model ID: T_S-cY0BKCJ3ot9qr0aP"
      }
    ],
    "type": "status_exception",
    "reason": "Failed to find model controller with the provided model ID: T_S-cY0BKCJ3ot9qr0aP"
  },
  "status": 404
}
```

## Response body fields

For response field descriptions, see [Create Controller API request fields]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/controller-apis/create-controller#request-body-fields).

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:admin/opensearch/ml/controllers/get`.