---
layout: default
title: Flat object
nav_order: 43
has_children: false
parent: Object field types
grand_parent: Supported field types
---

# Flat object field type

In OpenSearch, you don't have to specify a mapping before indexing documents. If you don't specify a mapping, OpenSearch uses [dynamic mapping]({{site.url}}{{site.baseurl}}/field-types/mappings#dynamic-mapping) to map every field and its subfields in the document automatically. When you ingest documents such as logs, you may not know every field's subfield name and type in advance. In this case, dynamically mapping all new subfields can quickly lead to a "mapping explosion", where the growing number of fields may degrade the performance of your cluster. 

Flat object solves this problem by not indexing the field itself or its subfields. Instead, for any JSON object, the values of all subfields and their paths are stored in two string fields. Subfields within the JSON are accessible using standard dot path notation but are not indexed for fast lookup.

The maximum field path length in the dot notation is 2<sup>24</sup> &minus; 1.
{: .note}

Flat objects provide the following advantages:

- Efficient reads: Fetching performance is similar to that of a keyword field.
- Memory efficiency: Storing the entire complex JSON object in one field without indexing all its subfields reduces the number of fields in an index. 
- Space efficiency: OpenSearch does not create an inverted index for flat objects, thereby saving space. 
- Compatibility for migration: You can migrate your data from systems that support similar flat types to OpenSearch.

Mapping a field as flat object applies when a field and its subfields are mostly read and not used as a search criteria because the subfields are not indexed. Flat objects are useful for objects with a large number of fields or when you don't know the keys in advance.

Flat objects support:

- Exact match queries. 
- Textual sorting.
- Aggregations of subfields using dot notation.
- Filtering by subfields.

Searching for a specific value of a nested field in a document may be inefficient because it may require a full scan of the index, which is an expensive operation.
{: .note}

Flat objects do not support:

- Type-specific parsing.
- Numerical operations, such as numerical comparison and numerical sorting.
- Text analysis.
- Highlighting.

## Supported queries

The flat object field type supports the following queries:

- [Term]({{site.url}}{{site.baseurl}}/query-dsl/term#term) 
- [Terms]({{site.url}}{{site.baseurl}}/query-dsl/term#terms) 
- [Terms set]({{site.url}}{{site.baseurl}}/query-dsl/term#terms-set)  
- [Prefix]({{site.url}}{{site.baseurl}}/query-dsl/term#prefix) 
- [Range]({{site.url}}{{site.baseurl}}/query-dsl/term#range) 
- [Match]({{site.url}}{{site.baseurl}}/query-dsl/full-text/#match) 
- [Multi-match]({{site.url}}{{site.baseurl}}/query-dsl/full-text/#multi-match) 
- [Query string]({{site.url}}{{site.baseurl}}/query-dsl/full-text/#query-string) 
- [Simple query string]({{site.url}}{{site.baseurl}}/query-dsl/full-text/#simple-query-string) 
- [Exists]({{site.url}}{{site.baseurl}}/query-dsl/term#exists) 

## Limitations

The following limitations apply to flat objects in the 2.7 release:

- Flat objects do not support open parameters.
- Painless scripting and wildcard queries are not supported for retrieving values of subfields.

This functionality is planned for a future release.

## Using flat objects 

The following example illustrates mapping a field as a flat object, indexing documents with flat object fields, and searching for leaf values of the flat object in those documents.

Only root fields of a document can be defined as a flat objects. You cannot define an object that is part of another JSON object as a flat object because when a flat object it is flattened to a string, the nested architecture of the leaves is lost.
{: .note}

First, create a mapping for your index, where `issue` is of type `flat_object`:

```json
PUT /test-index/
{
  "mappings": {
    "properties": {
      "issue": {
        "type": "flat_object"
      }
    }
  }
}
```
{% include copy-curl.html %}

Next, index two documents with flat object fields:

```json
PUT /test-index/_doc/1
{
  "issue": {
    "number": "123456",
    "labels": {
      "version": "2.1",
      "backport": [
        "2.0",
        "1.3"
      ],
      "category": {
        "type": "API",
        "level": "enhancement"
      }
    }
  }
}
```
{% include copy-curl.html %}

```json
PUT /test-index/_doc/2
{
  "issue": {
    "number": "123457",
    "labels": {
      "version": "2.2",
      "category": {
        "type": "API",
        "level": "bug"
      }
    }
  }
}
```
{% include copy-curl.html %}

To search for a leaf value of the flat object, use a POST request. Even if you don't know the field names, you can search for a leaf value in the entire flat object. For example, the following request searches for all issues labeled as bugs:

```json
POST /test-index/_search
{
  "query": {
    "match": {"issue": "bug"}
  }
}
```

Alternatively, if you know the subfield name in which to search, provide the field's path in dot notation:

```json
POST /test-index/_search
{
  "query": {
    "match": {"issue.labels.category.level": "bug"}
  }
}
```
{% include copy-curl.html %}

In both previous cases, the response is the same and contains document 2:

```json
{
  "took": 1,
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
    "max_score": 1.0303539,
    "hits": [
      {
        "_index": "test-index",
        "_id": "2",
        "_score": 1.0303539,
        "_source": {
          "issue": {
            "number": "123457",
            "labels": {
              "version": "2.2",
              "category": {
                "type": "API",
                "level": "bug"
              }
            }
          }
        }
      }
    ]
  }
}
```

Using a prefix query, you can search for all issues for the versions that start with `2.`:

```json
POST /test-index/_search
{
  "query": {
    "prefix": {"issue.labels.version": "2."}
  }
}
```

With a range query, you can search for all issues for versions 2.0--2.1:

```json
POST /test-index/_search
{
  "query": {
    "range": {
      "issue": {
        "gte": "2.0",
        "lte": "2.1"
      }
    }
  }
}
```
