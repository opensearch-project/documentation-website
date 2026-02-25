---
layout: default
title: Delete model group
parent: Model group APIs
grand_parent: ML Commons APIs
nav_order: 50
---

# Delete Model Group API

You can only delete a model group if it does not contain any model versions. 
{: .important}

If model access control is enabled on your cluster, only the owner or users with matching backend roles can delete the model group. Any users can delete any public model group.

If model access control is disabled on your cluster, users with the `delete model group API` permission can delete any model group. 

Admin users can delete any model group.
{: .note}

When you delete the last model version in a model group, that model group is automatically deleted from the index.
{: .important}

For more information, see [Model access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/).

## Example request

```json
DELETE _plugins/_ml/model_groups/<model_group_id>
```
{% include copy-curl.html %}

## Example response

```json
{
  "_index": ".plugins-ml-model-group",
  "_id": "l8nnQogByXnLJ-QNpEk2",
  "_version": 5,
  "result": "deleted",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 70,
  "_primary_term": 23
}
```

## Response for non-existent model groups

If you attempt to delete a model group that doesn't exist, the delete operation succeeds and returns `"result": "not_found"`:

```json
{
  "_index": ".plugins-ml-model-group",
  "_id": "l8nnQogByXnLJ-QNpEk2",
  "_version": 1,
  "result": "not_found",
  "forced_refresh": true,
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 5,
  "_primary_term": 25
}
```

This idempotent behavior ensures that delete operations can be safely retried without causing errors.
