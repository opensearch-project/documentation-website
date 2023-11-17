---
layout: default
title: Delete model
parent: Model APIs
grand_parent: ML Commons API
nav_order: 50
---

# Delete a model

Deletes a model based on the `model_id`.

When you delete the last model version in a model group, that model group is automatically deleted from the index.
{: .important}

For information about user access for this API, see [Model access control considerations]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/index/#model-access-control-considerations).

## Path and HTTP methods

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