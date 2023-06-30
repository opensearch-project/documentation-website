---
layout: default
title: Uppercase
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 310
---

# Uppercase



```json
PUT _ingest/pipeline/uppercase
{
  "processors": [
    {
      "uppercase": {
        "field": "name"
      }
    }
  ]
}

PUT testindex1/_doc/1?pipeline=uppercase
{
  "name": "John"
}
```

Following is the GET request and response. 

```json
GET testindex1/_doc/1
{
  "_index": "testindex1",
  "_id": "1",
  "_version": 11,
  "_seq_no": 10,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "name": "JOHN"
  }
}
```