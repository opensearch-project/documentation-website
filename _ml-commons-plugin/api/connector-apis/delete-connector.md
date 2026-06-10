---
layout: default
title: Delete connector
parent: Connector APIs
grand_parent: ML Commons APIs
nav_order: 30
---

# Delete Connector API

Deletes a standalone connector. For more information, see [Connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/).

## Endpoints

```json
DELETE /_plugins/_ml/connectors/<connector_id>
```

## Example request

```json
DELETE /_plugins/_ml/connectors/KsAo1YsB0jLkkocY6j4U
```
{% include copy-curl.html %}

## Example response

```json
{
  "_index" : ".plugins-ml-connector",
  "_id" : "KsAo1YsB0jLkkocY6j4U",
  "_version" : 1,
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

## Error responses

If you attempt to delete a connector that doesn't exist, OpenSearch returns a 200 response with `"result": "not_found"` rather than an error:

```json
{
  "_index": ".plugins-ml-connector",
  "_id": "nonexistent-connector-id",
  "_version": 1,
  "result": "not_found",
  "forced_refresh": true,
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 1,
  "_primary_term": 1
}
```