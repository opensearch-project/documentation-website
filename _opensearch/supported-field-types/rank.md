---
layout: default
title: Rank field types
nav_order: 60
has_children: false
parent: Supported field types
---

# Rank field types

The following table lists all rank field types that OpenSearch supports.

Field data type | Description
:--- | :---  
[`rank_feature`](#rank-feature) | Boosts or decreases the relevance score of documents. 
[`rank_features`](#rank-features) | Boosts or decreases the relevance score of documents. Used when the list of features is sparse. 

Rank feature and rank features fields can be queried with rank_feature queries only. They do not support aggregating or sorting.
{: .note }

## Rank feature

A rank feature field type uses a positive [float]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/numeric/)  value to boost or decrease the relevance score of a document in a `rank_feature` query. By default, this value boosts the relevance score. To decrease the relevance score, set the optional `positive_score_impact` parameter to `false`.

### Example

Create a mapping with a rank feature field:

```json
PUT testindex1
{
  "mappings": {
    "properties": {
      "positive_correlation": {
        "type": "rank_feature" 
      },
      "negative_correlation": {
        "type": "rank_feature",
        "positive_score_impact": false 
      }
    }
  }
}
```

Index three documents with a rank_feature that boosts the score (`positive_correlation`), and a rank_feature that decreases the score (`negative_correlation`):

```json
PUT testindex1/_doc/1
{
  "positive_correlation": 25.54,
  "negative_correlation": 10
}

PUT testindex1/_doc/2
{
  "positive_correlation": 25.54
}

PUT testindex1/_doc/3
{
  "negative_correlation": 10
}
```

## Rank features

A rank features field type is similar to the rank feature field type, but it is more suitable for a sparse list of features. A rank features field can index numeric feature vectors that are later used to boost or decrease documents' relevance scores in `rank_feature` queries. 

### Example

Create a mapping with a rank features field:

```json
PUT testindex1
{
  "mappings": {
    "properties": {
      "correlations": {
        "type": "rank_features" 
      }
    }
  }
}
```

To index a document with a rank features field, use a hashmap with string keys and positive float values:

```json
PUT testindex1/_doc/1
{
  "correlations": { 
    "young kids" : 1,
    "older kids" : 15,
    "teens" : 25.9
  }
}

PUT testindex1/_doc/2
{
  "correlations": {
    "teens": 10,
    "adults": 95.7
  }
}
```

Query the documents using rank feature query:

```json
GET testindex1/_search
{
  "query": {
    "rank_feature": {
      "field": "correlations.teens"
    }
  }
}
```

Response is ranked by relevance score:

```json
{
  "took" : 123,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 0.6258503,
    "hits" : [
      {
        "_index" : "testindex1",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 0.6258503,
        "_source" : {
          "correlations" : {
            "young kids" : 1,
            "older kids" : 15,
            "teens" : 25.9
          }
        }
      },
      {
        "_index" : "testindex1",
        "_type" : "_doc",
        "_id" : "2",
        "_score" : 0.39263803,
        "_source" : {
          "correlations" : {
            "teens" : 10,
            "adults" : 95.7
          }
        }
      }
    ]
  }
}
```

Rank feature and rank features fields use top nine significant bits for precision, leading to about 0.4% relative error. Values are stored with a relative precision of 2<sup>−8</sup> = 0.00390625.
{: .note }
