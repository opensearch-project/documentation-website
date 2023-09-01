---
layout: default
title: Rank field types
nav_order: 60
has_children: false
parent: Supported field types
redirect_from:
  - /opensearch/supported-field-types/rank/
  - /field-types/rank/
---

# Rank field types

The following table lists all rank field types that OpenSearch supports.

Field data type | Description
:--- | :---  
[`rank_feature`](#rank-feature) | Boosts or decreases the relevance score of documents. 
[`rank_features`](#rank-features) | Boosts or decreases the relevance score of documents. Used when the list of features is sparse. 

Rank feature and rank features fields can be queried with [rank feature queries](#rank-feature-query) only. They do not support aggregating or sorting.
{: .note }

## Rank feature

A rank feature field type uses a positive [float]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/numeric/) value to boost or decrease the relevance score of a document in a `rank_feature` query. By default, this value boosts the relevance score. To decrease the relevance score, set the optional `positive_score_impact` parameter to false.

### Example

Create a mapping with a rank feature field:

```json
PUT chessplayers
{
  "mappings": {
    "properties": {
      "name" : {
        "type" : "text"
      },
      "rating": {
        "type": "rank_feature" 
      },
      "age": {
        "type": "rank_feature",
        "positive_score_impact": false 
      }
    }
  }
}
```
{% include copy-curl.html %}

Index three documents with a rank_feature field that boosts the score (`rating`) and a rank_feature field that decreases the score (`age`):

```json
PUT testindex1/_doc/1
{
  "name" : "John Doe",
  "rating" : 2554,
  "age" : 75
}
```
{% include copy-curl.html %}

```json
PUT testindex1/_doc/2
{
  "name" : "Kwaku Mensah",
  "rating" : 2067,
  "age": 10
}
```
{% include copy-curl.html %}

```json
PUT testindex1/_doc/3
{
  "name" : "Nikki Wolf",
  "rating" : 1864,
  "age" : 22
}
```
{% include copy-curl.html %}

## Rank feature query

Using a rank feature query, you can rank players by rating, by age, or by both rating and age. If you rank players by rating, higher-rated players will have higher relevance scores. If you rank players by age, younger players will have higher relevance scores.

Use a rank feature query to search for players based on age and rating:

```json
GET chessplayers/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "rank_feature": {
            "field": "rating"
          }
        },
        {
          "rank_feature": {
            "field": "age"
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

When ranked by both age and rating, younger players and players who are more highly ranked score better:

```json
{
  "took" : 2,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 3,
      "relation" : "eq"
    },
    "max_score" : 1.2093145,
    "hits" : [
      {
        "_index" : "chessplayers",
        "_type" : "_doc",
        "_id" : "2",
        "_score" : 1.2093145,
        "_source" : {
          "name" : "Kwaku Mensah",
          "rating" : 1967,
          "age" : 10
        }
      },
      {
        "_index" : "chessplayers",
        "_type" : "_doc",
        "_id" : "3",
        "_score" : 1.0150313,
        "_source" : {
          "name" : "Nikki Wolf",
          "rating" : 1864,
          "age" : 22
        }
      },
      {
        "_index" : "chessplayers",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 0.8098284,
        "_source" : {
          "name" : "John Doe",
          "rating" : 2554,
          "age" : 75
        }
      }
    ]
  }
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
{% include copy-curl.html %}

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
```
{% include copy-curl.html %}

```json
PUT testindex1/_doc/2
{
  "correlations": {
    "teens": 10,
    "adults": 95.7
  }
}
```
{% include copy-curl.html %}

Query the documents using a rank feature query:

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
{% include copy-curl.html %}

The response is ranked by relevance score:

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
