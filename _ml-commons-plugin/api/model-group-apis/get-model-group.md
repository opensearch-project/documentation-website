---
layout: default
title: Get model group
parent: Model group APIs
grand_parent: ML Commons APIs
nav_order: 30
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/api/model-group-apis/get-model-group/
---

# Get Model Group API

Introduced 2.12
{: .label .label-purple }

The Get Model Group API returns information about a model group based on that group's ID. 

If model access control is enabled on your cluster, only the owner or users with matching backend roles can get private model groups. Any user can get any public model group.

If model access control is disabled on your cluster, users with the `get model group API` permission can get any model group.

For more information, see [Model access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/).

## Path and HTTP method

```json
GET /_plugins/_ml/model_groups/<model_group_id>
```

### Example request

The following example request gets a model group based on that group's ID:

```json
GET /_plugins/_ml/model_groups/<model_group_id>
```
{% include copy-curl.html %}

### Example response

The following response returns the model group information, including the model group's name, version, description, access level, and creation information:

```json
{
  "name": "test_model_group",
  "latest_version": 0,
  "description": "This is a public model group",
  "access": "public",
  "created_time": 1715112992748,
  "last_updated_time": 1715112992748
}
```
