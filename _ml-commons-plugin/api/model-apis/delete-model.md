---
layout: default
title: Delete model
parent: Model APIs
grand_parent: ML Commons APIs
nav_order: 47
---

# Delete Model API

Deletes a model based on the `model_id`.

You cannot delete a model that is deployed or being deployed. To delete a deployed model, first [undeploy]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/undeploy-model/) it.
{: .important}

Deleting the last model version in a model group does not delete the model group. To delete the model group, use the [Delete Model Group API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-group-apis/delete-model-group/).

For information about user access for this API, see [Model access control considerations]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/index/#model-access-control-considerations).

## Endpoints

```json
DELETE /_plugins/_ml/models/{model_id}
```

## Example request

```json
DELETE /_plugins/_ml/models/MzcIJX8BA7mbufL6DOwl
```
{% include copy-curl.html %}

## Example response

```json
{
  "_index" : ".plugins-ml-model",
  "_id" : "MzcIJX8BA7mbufL6DOwl",
  "_version" : 2,
  "result" : "deleted",
  "forced_refresh" : true,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "failed" : 0
  },
  "_seq_no" : 27,
  "_primary_term" : 18
}
```

## Error responses

If you attempt to delete a model that doesn't exist, OpenSearch returns a 404 Not Found error:

```json
{
  "error": {
    "root_cause": [
      {
        "type": "status_exception",
        "reason": "Failed to find model"
      }
    ],
    "type": "status_exception",
    "reason": "Failed to find model"
  },
  "status": 404
}
```

## Safely deleting a model
Introduced 2.19
{: .label .label-purple }

To prevent accidental deletion of models in active use by agents, search pipelines, ingest pipelines, or other components, you can enable a safety check. If the safety check is enabled and you attempt to delete a model that is in current use, OpenSearch returns an error message. To proceed with deletion:

- Identify any components using the model and either delete them or update them so that they use other models.
- Once all dependencies are cleared, delete the model.

For information about enabling this feature, see [Feature settings]({{site.url}}{{site.baseurl}}/ml-commons-plugin/cluster-settings/#feature-settings).