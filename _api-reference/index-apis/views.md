---
layout: default
title: View APIs
parent: Index APIs
nav_order: 75
redirect_from:
  - /opensearch/rest-api/index-apis/views/
---

## Views

These REST APIs enable users to manage virtual indices, known as Views, which abstract the complexity of querying multiple indices. Before using these APIs, ensure your OpenSearch cluster is configured to support Views.

### Create a View

Creates a new View with specified settings and index patterns.

#### Request

```json
PUT /_views/<view-name>
{
  "description": "Your view description",
  "targets": [
    {
      "indexPattern": "your-index-pattern-*"
    }
  ]
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "status": "CREATED",
  "message": "'<view-name>' created."
}
```

### Get a View

Retrieves the configuration of a specific View.

#### Request

```json
GET /_views/<view-name>
```
{% include copy-curl.html %}

#### Example response

```json
{
  "view-name": {
    "description": "Your view description",
    "targets": [
      {
        "indexPattern": "your-index-pattern-*"
      }
    ]
  }
}
```

### Update a View

Updates the configuration of an existing View.

#### Request

```json
PUT /_views/<view-name>
{
  "description": "Updated view description",
  "targets": [
    {
      "indexPattern": "new-index-pattern-*"
    },
    {
      "indexPattern": "another-index-pattern-*"
    }
  ]
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "status": "UPDATED",
  "message": "'<view-name>' updated."
}
```

### Delete a View

Deletes a specific View and its configuration.

#### Request

```json
DELETE /_views/<view-name>
```
{% include copy-curl.html %}

#### Example response

```json
{
  "status": "OK",
}
```

### Search a View

Performs a search query across the indices covered by a View.

#### Request

```json
POST /_views/<view-name>/_search
{
  "query": {
    "match": {
      "field": "value"
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "took": 10,
  "hits": {
    "total": {
      "value": 100,
      "relation": "eq"
    },
    "hits": [
      {
        "_index": "index-name",
        "_id": "id",
        "_score": 1.0,
        "_source": {
          "field": "value"
        }
      }
    ]
  }
}
```

### List View Names

Retrieves a list of all view names in the cluster.

#### Request

```json
GET /_views/_listViewNames
```
{% include copy-curl.html %}

#### Example response

```json
{
  "views": [
    "view1",
    "view2"
  ]
}
```