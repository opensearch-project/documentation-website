---
layout: default
title: Token count
nav_order: 48
has_children: false
parent: String field types
grand_parent: Supported field types
redirect_from:
  - /opensearch/supported-field-types/token-count/
  - /field-types/token-count/
---

# Token count field type

A token count field type stores the number of analyzed tokens in a string.

## Example

Create a mapping with a token count field:

```json
PUT testindex
{
  "mappings": {
    "properties": {
      "sentence": { 
        "type": "text",
        "fields": {
          "num_words": { 
            "type":     "token_count",
            "analyzer": "english"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Index three documents with text fields:

```json
PUT testindex/_doc/1
{ "sentence": "To be, or not to be: that is the question." }
```
{% include copy-curl.html %}

```json
PUT testindex/_doc/2
{ "sentence": "All the world’s a stage, and all the men and women are merely players." }
```
{% include copy-curl.html %}

```json
PUT testindex/_doc/3
{ "sentence": "Now is the winter of our discontent." }
```
{% include copy-curl.html %}

Search for sentences with fewer than 10 words:

```json
GET testindex/_search
{
  "query": {
    "range": {
      "sentence.num_words": {
        "lt": 10
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains one matching sentence:

```json
{
  "took" : 8,
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
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "testindex",
        "_type" : "_doc",
        "_id" : "3",
        "_score" : 1.0,
        "_source" : {
          "sentence" : "Now is the winter of our discontent."
        }
      }
    ]
  }
}
```

## Parameters

The following table lists the parameters accepted by token count field types. The `analyzer` parameter is required; all other parameters are optional.

Parameter | Description 
:--- | :--- 
`analyzer` | The analyzer to be used for this field. Specify an analyzer without token filters for optimal performance. Required.
`boost` | A floating-point value that specifies the weight of this field toward the relevance score. Values above 1.0 increase the field's relevance. Values between 0.0 and 1.0 decrease the field's relevance. Default is 1.0.
`doc_values` | A Boolean value that specifies whether the field should be stored on disk so that it can be used for aggregations, sorting, or scripting. Default is `false`.
`enable_position_increments` | A Boolean value that specifies whether position increments should be counted. To avoid removing stopwords, set this field to `false`. Default is `true`.
`index` | A Boolean value that specifies whether the field should be searchable. Default is `true`.
[`null_value`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/index#null-value) | A  value to be used in place of `null`. Must be of the same type as the field. If this parameter is not specified, the field is treated as missing when its value is `null`. Default is `null`.
`store` | A Boolean value that specifies whether the field value should be stored and can be retrieved separately from the _source field. Default is `false`. 
