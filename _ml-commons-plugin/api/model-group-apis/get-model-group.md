---
layout: default
title: Get model group
parent: Model group APIs
grand_parent: ML Commons APIs
nav_order: 30
---

# Get a model group

This API is available from 2.12 release
{: .important}

If model access control is enabled on your cluster, only the owner or users with matching backend roles can get the model group. Any users can get any public model group.

If model access control is disabled on your cluster, users with the `get model group API` permission can get any model group.

Admin users can get any model group.

For more information, see [Model access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/).

## Path and HTTP method

```json
GET /_plugins/_ml/model_groups/<model_group_id>
```

#### Example request: 

```json
GET /_plugins/_ml/model_groups/<model_group_id>
```
{% include copy-curl.html %}

#### Example response

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
