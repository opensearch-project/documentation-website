---
layout: default
title: Add and manage your data
nav_order: 35
---

# Add and manage your data

OpenSearch stores data as JSON _documents_ and groups related documents into an _index_. Adding a document to an index that doesn't exist creates the index and infers a type for each field, so you can start storing data without defining any fields. Once you index documents, you can retrieve, update, and delete them from the index.

## Indexing documents

To add a JSON document to an OpenSearch index (that is, to _index_ a document), you send an HTTP request with the following header:

```json
PUT /{index-name}/_doc/{document-id}
```

For example, to index a document representing a student, send the following request:

```json
PUT /students/_doc/1
{
  "name": "John Doe",
  "gpa": 3.89,
  "grad_year": 2022
}
```
{% include copy-curl.html %}

Once you send the preceding request, OpenSearch creates an index called `students` and stores the document in the index. If you don't provide an ID for your document, OpenSearch generates a document ID. In the preceding request, the document ID is specified as the student ID (`1`).

To learn more about indexing, see [Managing indexes]({{site.url}}{{site.baseurl}}/im-plugin/).

## Dynamic mapping

When you index a document, OpenSearch infers the field types from the JSON types submitted in the document. This process is called _dynamic mapping_. For more information, see [Dynamic mapping]({{site.url}}{{site.baseurl}}/mappings/#dynamic-mapping).

To view the inferred field types, send a request to the `_mapping` endpoint:

```json
GET /students/_mapping
```
{% include copy-curl.html %}

OpenSearch responds with the field `type` for each field:

```json
{
  "students": {
    "mappings": {
      "properties": {
        "gpa": {
          "type": "float"
        },
        "grad_year": {
          "type": "long"
        },
        "name": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword",
              "ignore_above": 256
            }
          }
        }
      }
    }
  }
}
```

OpenSearch mapped the numeric fields to the `float` and `long` types. Notice that OpenSearch mapped the `name` text field to `text` and added a `name.keyword` subfield mapped to `keyword`. Fields mapped to `text` are analyzed (lowercased and split into terms) and can be used for full-text search. Fields mapped to `keyword` are used for exact term search.

## Index mappings and settings

OpenSearch indexes are configured with mappings and settings:

- A _mapping_ is a collection of fields and the types of those fields. For more information, see [Mappings and field types]({{site.url}}{{site.baseurl}}/mappings/).
- _Settings_ include index data like the index name, creation date, and number of shards. For more information, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

Once a field is created, you cannot change its type. Changing a field type requires deleting the index and recreating it with the new mappings. To control field types, specify the mappings yourself when you create the index.
{: .note}

In the preceding example, OpenSearch mapped `grad_year` to `long`, but a graduation year is a date. To map `grad_year` to `date`, first delete the index that dynamic mapping created:

```json
DELETE /students
```
{% include copy-curl.html %}

You can specify the mappings and settings in one request. The following request recreates the index, specifying the number of index shards and mapping the `name` field to `text` and the `grad_year` field to `date`. Because a graduation year has no month or day, the `format` parameter tells OpenSearch to interpret the field as a four-digit year:

```json
PUT /students
{
  "settings": {
    "index.number_of_shards": 1
  }, 
  "mappings": {
    "properties": {
      "name": {
        "type": "text"
      },
      "grad_year": {
        "type": "date",
        "format": "yyyy"
      }
    }
  }
}
```
{% include copy-curl.html %}

Now index the same document again:

```json
PUT /students/_doc/1
{
  "name": "John Doe",
  "gpa": 3.89,
  "grad_year": 2022
}
```
{% include copy-curl.html %}

OpenSearch stores `grad_year` as the date `2022-01-01`, so you can now use date range queries on it. The `_source` still contains the original value, `2022`.

To view the mappings for the index fields, send the following request:

```json
GET /students/_mapping
```
{% include copy-curl.html %}

OpenSearch mapped the `name` and `grad_year` fields according to the specified types and inferred the field type for the `gpa` field:

```json
{
  "students": {
    "mappings": {
      "properties": {
        "gpa": {
          "type": "float"
        },
        "grad_year": {
          "type": "date",
          "format": "yyyy"
        },
        "name": {
          "type": "text"
        }
      }
    }
  }
}
```

Note that `name` no longer has a `name.keyword` subfield. Explicit mappings replace the dynamic defaults, so only the types you specify are used.

## Searching for documents

To run a search for the document, specify the index that you're searching and a query that will be used to match documents. The simplest query is the `match_all` query, which matches all documents in an index:

```json
GET /students/_search
{
  "query": {
    "match_all": {}
  }
}
```
{% include copy-curl.html %}

OpenSearch returns the indexed document:

```json
{
  "took": 12,
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
        "_index": "students",
        "_id": "1",
        "_score": 1,
        "_source": {
          "name": "John Doe",
          "gpa": 3.89,
          "grad_year": 2022
        }
      }
    ]
  }
}
```

For more information about search, see [Search your data]({{site.url}}{{site.baseurl}}/getting-started/search-data/).

## Updating documents

In OpenSearch, stored documents are immutable, so an update replaces the document rather than modifying it in place. OpenSearch retrieves the current document, applies your changes, and indexes the result as a new version. You can replace an entire document using the Index Document API, providing values for all existing and added fields in the document. For example, to update the `gpa` field and add an `address` field to the previously indexed document, send the following request:

```json
PUT /students/_doc/1
{
  "name": "John Doe",
  "gpa": 3.91,
  "grad_year": 2022,
  "address": "123 Main St."
}
```
{% include copy-curl.html %}

Alternatively, you can update parts of a document by calling the Update Document API:

```json
POST /students/_update/1/
{
  "doc": {
    "gpa": 3.91,
    "address": "123 Main St."
  }
}
```
{% include copy-curl.html %}

This request updates only the fields that you provide and leaves the rest of the document unchanged. The document must already exist; updating a document that isn't in the index returns an error. For more information about partial document updates, see [Update Document API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/update-document/).

To update a document if it exists or index a new one if it doesn't, use an _upsert_ operation. Add `doc_as_upsert` to the request and set it to `true`:

```json
POST /students/_update/2/
{
  "doc": {
    "name": "Jonathan Powers",
    "gpa": 3.85,
    "grad_year": 2025
  },
  "doc_as_upsert": true
}
```
{% include copy-curl.html %}

Because no document with the ID `2` exists, OpenSearch indexes a new one. Had the document existed, the same request would have updated it instead of returning an error.

For more information about upsert operations, see [Upsert]({{site.url}}{{site.baseurl}}/api-reference/document-apis/update-document/#upsert).

## Deleting a document

To delete a document, send a delete request and provide the document ID:

```json
DELETE /students/_doc/1
```
{% include copy-curl.html %}

## Deleting an index

To permanently delete an index and all documents in it, send the following request:

```json
DELETE /students
```
{% include copy-curl.html %}

## Further reading

- For information about document APIs, see [Document APIs]({{site.url}}{{site.baseurl}}/api-reference/document-apis/).
- For information about mappings, see [Mappings and field types]({{site.url}}{{site.baseurl}}/mappings/).
- For information about settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

## Next steps

- To index many documents in a single request, see [Ingest data into OpenSearch]({{site.url}}{{site.baseurl}}/getting-started/ingest-data/).
- To learn about search options, see [Search your data]({{site.url}}{{site.baseurl}}/getting-started/search-data/).
