---
layout: default
title: Delete model
parent: Model APIs
grand_parent: ML Commons APIs
nav_order: 50
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

# Check downstream task before deleting

Since we have several downstreams which using models (agent, search pipeline, ingest pipeline), we provide a feature to check all downstream tasks to prevent deleting using model by accident to customer after 2.19. 

You can enable this feature by setting cluster setting `plugins.ml_commons.safe_delete_model` to true, which is false by default. 

After you set it to true, and some downstreams is using your candidate deleting model (e.g. a search pipeline), when you try to delete the model, you will receive
```
{
    "error": {
        "root_cause": [
            {
                "type": "status_exception",
                "reason": "1 ingest pipelines are still using this model, please delete or update the pipelines first: [<downstream pipeline name>]"
            }
        ],
        "type": "status_exception",
        "reason": "1 ingest pipelines are still using this model, please delete or update the pipelines first: [<downstream pipeline name>]"
    },
    "status": 409
}
```

After deleting the downstream tasks, you can delete it successfully.
