---
layout: default
title: Ignored
nav_order: 15
has_children: false
parent: Metadata fields
---

# Ignored

The `_ignored` field indexes and stores the name of fields within a document that were ignored during the indexing process due to being malformed. This functionality is enabled with the `ignore_malformed` setting is turned on in the [index mapping]({{site.url}}{{site.baseurl}}/field-types/#mapping-example-usage). 

The `_ignored` field allows you to search and identify documents that contain fields that were ignored, as well as the specific field names that were ignored. The can be useful for troubleshooting and understadning issues related to malformed data in your documents. 

You can query the `_ignored` field using `term`, `terms`, and `exists` queries, and the results will be in the search hits.

The `_ignored` field is only populated when the `ignore_malformed` setting is enabled in your index mapping. If `ignore_malformed` is set to `false` (the default value), malformed fields will cause the entire document to be rejected, and the `_ignored` field will not be populated.
{: .note}

The basic syntax for a request with `_ignored` is as follows:

```json
GET _search
{
  "query": {
    "exists": {
      "field": "_ignored"
    }
  }
}
```
{% include copy-curl.html %}

--- 

#### Example indexing request with `_ignored` field

The following example request adds a new document to the `test-ignored` index, with `ignore_malformed` set to `true` so that no error is thrown during indexing: 

```json
PUT test-ignored
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text"
      },
      "length": {
        "type": "long",
        "ignore_malformed": true
      }
    }
  }
}

POST test-ignored/_doc
{
  "title": "correct text",
  "length": "not a number"
}

GET test-ignored/_search
{
  "query": {
    "exists": {
      "field": "_ignored"
    }
  }
}
```
{% include copy-curl.html %}

#### Example reponse

```json
{
  "took": 42,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "test-ignored",
        "_id": "qcf0wZABpEYH7Rw9OT7F",
        "_score": 1,
        "_ignored": [
          "length"
        ],
        "_source": {
          "title": "correct text",
          "length": "not a number"
        }
      }
    ]
  }
}
```

---

## Ignoring a specified field

Similarly, you can use a term query to find documents where a specific field, such as created_at, was ignored, as shown in the following example request:

```json
GET _search
{
  "query": {
    "term": {
      "_ignored": "created_at"
    }
  }
}
```
{% include copy-curl.html %}

#### Reponse 

```json
{
  "took": 51,
  "timed_out": false,
  "_shards": {
    "total": 45,
    "successful": 45,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 0,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  }
}
```
