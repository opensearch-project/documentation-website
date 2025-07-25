---
layout: default
title: Delete model
parent: Model APIs
grand_parent: ML Commons APIs
nav_order: 50
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/api/model-apis/delete-model/
---

# Delete a model

Deletes a model based on the `model_id`.

When you delete the last model version in a model group, that model group is automatically deleted from the index.
{: .important}

For information about user access for this API, see [Model access control considerations]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/index/#model-access-control-considerations).

## Endpoints

```json
DELETE /_plugins/_ml/models/<model_id>
```

#### Example request

```json
DELETE /_plugins/_ml/models/MzcIJX8BA7mbufL6DOwl
```
{% include copy-curl.html %}

#### Example response

```json
{
  "_index" : ".plugins-ml-model",
  "_id" : "MzcIJX8BA7mbufL6DOwl",
  "_version" : 2,
  "result" : "deleted",
  "_shards" : {
    "total" : 2,
    "successful" : 2,
    "failed" : 0
  },
  "_seq_no" : 27,
  "_primary_term" : 18
}
```

## Safely deleting a model
Introduced 2.19
{: .label .label-purple }

To prevent accidental deletion of models in active use by agents, search pipelines, ingest pipelines, or other components, you can enable a safety check. If the safety check is enabled and you attempt to delete a model that is in current use, OpenSearch returns an error message. To proceed with deletion:

- Identify any components using the model and either delete them or update them so that they use other models.
- Once all dependencies are cleared, delete the model.

For information about enabling this feature, see [Safely delete models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/cluster-settings/#safely-delete-models).