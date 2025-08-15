---
layout: default
title: Get memory container
parent: Agentic Memory APIs
grand_parent: ML Commons APIs
nav_order: 20
---

# Get Memory Container API
**Introduced 3.2**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

Use this API to retrieve a memory container by its ID.

## Endpoint

```json
GET /_plugins/_ml/memory_containers/{memory_container_id}
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