---
layout: default
title: Percolator
nav_order: 65
has_children: false
parent: Supported field types
redirect_from:
  - /opensearch/supported-field-types/percolator/
  - /field-types/percolator/
---

# Percolator field type

A percolator field type specifies to treat this field as a query. Any JSON object field can be marked as a percolator field. Normally, documents are indexed and searches are run against them. When you use a percolator field, you store a search, and later the percolate query matches documents to that search. 

## Example

A customer is searching for a table priced at $400 or less and wants to create an alert for this search. 

Create a mapping assigning a percolator field type to the query field:

```json
PUT testindex1
{
  "mappings": {
    "properties": {
      "search": {
        "properties": {
          "query": { 
            "type": "percolator" 
          }
        }
      },
      "price": { 
        "type": "float" 
      },
      "item": { 
        "type": "text" 
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a query:

```json
PUT testindex1/_doc/1
{
  "search": {
    "query": {
      "bool": {
        "filter": [
          { 
            "match": { 
              "item": { 
                "query": "table" 
              }
            }
          },
          { 
            "range": { 
              "price": { 
                "lte": 400.00 
              } 
            } 
          }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

Fields referenced in the query must already exist in the mapping.
{: .note }

Run a percolate query to search for matching documents:

```json
GET testindex1/_search
{
  "query" : {
    "bool" : {
      "filter" : 
        {
          "percolate" : {
            "field" : "search.query",
            "document" : {
              "item" : "Mahogany table",
              "price": 399.99
            }
          }
        }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the originally indexed query:

```json
{
  "took" : 30,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 0.0,
    "hits" : [
      {
        "_index" : "testindex1",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 0.0,
        "_source" : {
          "search" : {
            "query" : {
              "bool" : {
                "filter" : [
                  {
                    "match" : {
                      "item" : {
                        "query" : "table"
                      }
                    }
                  },
                  {
                    "range" : {
                      "price" : {
                        "lte" : 400.0
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        "fields" : {
          "_percolator_document_slot" : [
            0
          ]
        }
      }
    ]
  }
}
```