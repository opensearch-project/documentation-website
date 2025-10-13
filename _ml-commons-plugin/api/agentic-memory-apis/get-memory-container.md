---
layout: default
title: Get memory container
parent: Agentic memory APIs
grand_parent: ML Commons APIs
nav_order: 20
---

# Get Memory Container API
**Introduced 3.3**
{: .label .label-purple }


Use this API to retrieve a memory container by its ID.

## Endpoints

```json
GET /_plugins/_ml/memory_containers/<memory_container_id>
```

## Example request

```json
GET /_plugins/_ml/memory_containers/SdjmmpgBOh0h20Y9kWuN
```
{% include copy-curl.html %}

## Example response

```json
{
    "name": "Raw memory container",
    "description": "Store static conversations with semantic search",
    "owner": {
        "name": "admin",
        "backend_roles": [
            "admin"
        ],
        "roles": [
            "own_index",
            "all_access"
        ],
        "custom_attribute_names": [],
        "user_requested_tenant": "null",
        "user_requested_tenant_access": "WRITE"
    },
    "created_time": 1754943902286,
    "last_updated_time": 1754943902286,
    "memory_storage_config": {
        "memory_index_name": "ml-static-memory-sdjmmpgboh0h20y9kwun-admin",
        "semantic_storage_enabled": false
    }
}
```

## Response body fields

For response field descriptions, see [Create Memory Container API request fields]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/create-memory-container#request-body-fields).