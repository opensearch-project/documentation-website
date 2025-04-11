---
layout: default
title: Keyword
nav_order: 46
has_children: false
parent: String field types
grand_parent: Supported field types
redirect_from:
  - /opensearch/supported-field-types/keyword/
  - /field-types/keyword/
---

# Keyword field type
**Introduced 1.0**
{: .label .label-purple }

A keyword field type contains a string that is not analyzed. It allows only exact, case-sensitive matches.

By default, keyword fields are both indexed (because `index` is enabled) and stored on disk (because `doc_values` is enabled). To reduce disk space, you can specify not to index keyword fields by setting `index` to `false`.

If you need to use a field for full-text search, map it as [`text`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/text/) instead.
{: .note }

## Example

The following query creates a mapping with a keyword field. Setting `index` to `false` specifies to store the `genre` field on disk and to retrieve it using `doc_values`:

```json
PUT movies
{
  "mappings" : {
    "properties" : {
      "genre" : {
        "type" :  "keyword",
        "index" : false
      }
    }
  }
}
```
{% include copy-curl.html %}

## Parameters

The following table lists the parameters accepted by keyword field types. All parameters are optional.

Parameter | Description 
:--- | :--- 
`boost` | A floating-point value that specifies the weight of this field toward the relevance score. Values above 1.0 increase the field's relevance. Values between 0.0 and 1.0 decrease the field's relevance. Default is 1.0.
`doc_values` | A Boolean value that specifies whether the field should be stored on disk so that it can be used for aggregations, sorting, or scripting. Default is `true`.
`eager_global_ordinals` | Specifies whether global ordinals should be loaded eagerly on refresh. If the field is often used for aggregations, this parameter should be set to `true`. Default is `false`.
`fields` | To index the same string in several ways (for example, as a keyword and text), provide the fields parameter. You can specify one version of the field to be used for search and another to be used for sorting and aggregations.
`ignore_above` | Any string longer than this integer value should not be indexed. Default is 2147483647. Default dynamic mapping creates a keyword subfield for which `ignore_above` is set to 256.
`index` | A Boolean value that specifies whether the field should be searchable. Default is `true`. To reduce disk space, set `index` to `false`.
`index_options` | Information to be stored in the index that will be considered when calculating relevance scores. Can be set to `freqs` for term frequency. Default is `docs`.
`meta` | Accepts metadata for this field.
[`normalizer`]({{site.url}}{{site.baseurl}}/analyzers/normalizers/) | Specifies how to preprocess this field before indexing (for example, make it lowercase). Default is `null` (no preprocessing).
`norms` | A Boolean value that specifies whether the field length should be used when calculating relevance scores. Default is `false`.
[`null_value`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/index#null-value) | A value to be used in place of `null`. Must be of the same type as the field. If this parameter is not specified, the field is treated as missing when its value is `null`. Default is `null`.
`similarity` | The ranking algorithm for calculating relevance scores. Default is index default, which is `BM25`.
`useSimilarity` | With default of `false`, constant_score is used that leads to lower latency. Set this to `true` if you old behavior of scoring, but expect worse search latency. See example below.
`split_queries_on_whitespace` | A Boolean value that specifies whether full-text queries should be split on white space. Default is `false`.
`store` | A Boolean value that specifies whether the field value should be stored and can be retrieved separately from the `_source` field. Default is `false`. 

#### Example term search with useSimilarity set to false (Default) - Took time is 10ms, all scores are 1.0. 

```json
curl - X POST "http://localhost:9200/big5/_search?pretty=true"\ -
    H "Content-Type: application/json"\ -
    d '{"size":3, "explain": false,
"query": {
    "term": {
        "process.name": "kernel"
    }
}, "_source": false
}
' {
"took": 10,
"timed_out": false,
"_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
},
"hits": {
    "total": {
        "value": 10000,
        "relation": "gte"
    },
    "max_score": 1.0,
    "hits": [{
            "_index": "big5",
            "_id": "xDoCtJQBE3c7bAfikzbk",
            "_score": 1.0
        },
        {
            "_index": "big5",
            "_id": "xzoCtJQBE3c7bAfikzbk",
            "_score": 1.0
        },
        {
            "_index": "big5",
            "_id": "yDoCtJQBE3c7bAfikzbk",
            "_score": 1.0
        }
    ]
}
}
```

#### Example term search with useSimilarity set to true - took time 200ms, scores are based on BM25

Set the parameter and check
```json
curl -X PUT "http://localhost:9200/big5/_mapping?pretty" \
-H "Content-Type: application/json" \
-d '{
  "properties": {
    "process.name": {
       "type":"keyword", "useSimilarity": true
    }
  }
}'
{
  "acknowledged" : true
}

GET "http://localhost:9200/big5/_mapping/field/process.name?pretty=true"
{
  "big5" : {
    "mappings" : {
      "process.name" : {
        "full_name" : "process.name",
        "mapping" : {
          "name" : {
            "type" : "keyword",
            "useSimilarity" : true
          }
        }
      }
    }
  }
}
```

Took 200ms
```json
curl -X POST "http://localhost:9200/big5/_search?pretty=true" \
-H "Content-Type: application/json" \
-d '{"size":3, "explain": false,
  "query": {
    "term": {
      "process.name": "kernel"
    }
  },"_source":false
}'
{
  "took" : 200,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 10000,
      "relation" : "gte"
    },
    "max_score" : 0.8844931,
    "hits" : [
      {
        "_index" : "big5",
        "_id" : "xDoCtJQBE3c7bAfikzbk",
        "_score" : 0.8844931
      },
      {
        "_index" : "big5",
        "_id" : "xzoCtJQBE3c7bAfikzbk",
        "_score" : 0.8844931
      },
      {
        "_index" : "big5",
        "_id" : "yDoCtJQBE3c7bAfikzbk",
        "_score" : 0.8844931
      }
    ]
  }
}


```