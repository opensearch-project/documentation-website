---
layout: default
title: Communicate with OpenSearch
nav_order: 30
---

# Communicate with OpenSearch

You interact with OpenSearch clusters using the REST API, which offers a lot of flexibility. You can use clients like [curl](https://curl.se/) or any programming language that can send HTTP requests. To add a JSON document to an OpenSearch index (i.e. index a document), you send an HTTP request:

```json
PUT https://<host>:<port>/<index-name>/_doc/<document-id>
{
  "title": "The Wind Rises",
  "release_date": "2013-07-20"
}
```

To run a search for the document:

```json
GET https://<host>:<port>/<index-name>/_search?q=wind
```

To delete the document:

```json
DELETE https://<host>:<port>/<index-name>/_doc/<document-id>
```

You can change most OpenSearch settings using the REST API, modify indexes, check the health of the cluster, get statistics---almost everything.


When you add the document to an index, OpenSearch adds some metadata, such as the unique document *ID*:

```json
{
  "_index": "<index-name>",
  "_type": "_doc",
  "_id": "<document-id>",
  "_version": 1,
  "_source": {
    "title": "The Wind Rises",
    "release_date": "2013-07-20"
  }
}
```

Indexes also contain mappings and settings:

- A *mapping* is the collection of *fields* that documents in the index have. In this case, those fields are `title` and `release_date`.
- Settings include data like the index name, creation date, and number of shards.