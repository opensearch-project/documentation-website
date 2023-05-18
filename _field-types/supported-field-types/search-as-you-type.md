---
layout: default
title: Search as you type
nav_order: 53
has_children: false
parent: Autocomplete field types
grand_parent: Supported field types
redirect_from:
  - /opensearch/supported-field-types/search-as-you-type/
  - /field-types/search-as-you-type/
---

# Search-as-you-type field type

A search-as-you-type field type provides search-as-you-type functionality using both prefix and infix completion. 

## Example

Mapping a search-as-you-type field creates n-gram subfields of this field, where n is in the range [2, `max_shingle_size`]. Additionally, it creates an index prefix subfield.

Create a mapping with a search-as-you-type field:

```json
PUT books
{
  "mappings": {
    "properties": {
      "suggestions": {
        "type": "search_as_you_type"
      }
    }
  }
}
```
{% include copy-curl.html %}

In addition to the `suggestions` field, this creates `suggestions._2gram`, `suggestions._3gram`, and `suggestions._index_prefix` fields. 

Index a document with a search-as-you-type field:

```json
PUT books/_doc/1
{
  "suggestions": "one two three four"
}
```
{% include copy-curl.html %}

To match terms in any order, use a bool_prefix or multi-match query. These queries rank the documents in which search terms are in the specified order higher than the documents in which terms are out of order.

```json
GET books/_search
{
  "query": {
    "multi_match": {
      "query": "tw one",
      "type": "bool_prefix",
      "fields": [
        "suggestions",
        "suggestions._2gram",
        "suggestions._3gram"
      ]
    }
  }
}
```
{% include copy-curl.html %}

The response contains the matching document:

```json
{
  "took" : 13,
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
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 1.0,
        "_source" : {
          "suggestions" : "one two three four"
        }
      }
    ]
  }
}
```

To match terms in order, use a match_phrase_prefix query:

```json
GET books/_search
{
  "query": {
    "match_phrase_prefix": {
      "suggestions": "two th"
    }
  }
}
```
{% include copy-curl.html %}

The response contains the matching document:

```json
{
  "took" : 23,
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
    "max_score" : 0.4793051,
    "hits" : [
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 0.4793051,
        "_source" : {
          "suggestions" : "one two three four"
        }
      }
    ]
  }
}
```

To match the last terms exactly, use a match_phrase query:

```json
GET books/_search
{
  "query": {
    "match_phrase": {
      "suggestions": "four"
    }
  }
}
```
{% include copy-curl.html %}

Response:

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
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 0.2876821,
    "hits" : [
      {
        "_index" : "books",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 0.2876821,
        "_source" : {
          "suggestions" : "one two three four"
        }
      }
    ]
  }
}
```

## Parameters

The following table lists the parameters accepted by search-as-you-type field types. All parameters are optional.

Parameter | Description 
:--- | :---
`analyzer` | The analyzer to be used for this field. By default, it will be used at index time and at search time. To override it at search time, set the `search_analyzer` parameter. Default is the `standard` analyzer, which uses grammar-based tokenization and is based on the [Unicode Text Segmentation](https://unicode.org/reports/tr29/) algorithm. Configures the root field and subfields.
`index` | A Boolean value that specifies whether the field should be searchable. Default is `true`. Configures the root field and subfields.
`index_options` | Specifies the information to be stored in the index for search and highlighting. Valid values: `docs` (doc number only), `freqs` (doc number and term frequencies), `positions` (doc number, term frequencies, and term positions), `offsets` (doc number, term frequencies, term positions, and start and end character offsets). Default is `positions`. Configures the root field and subfields.
`max_shingle_size` | An integer that specifies the maximum n-gram size. Valid values are in the range [2, 4]. N-grams to be created are in the range [2, `max_shingle_size`]. Default is 3, which creates a 2-gram and a 3-gram. Larger `max_shingle_size` values work better for more specific queries but lead to a larger index size. 
`norms` | A Boolean value that specifies whether the field length should be used when calculating relevance scores. Configures the root field and n-gram subfields (default is `false`). Does not configure the prefix subfield (in the prefix subfield, `norms` is `false`). 
`search_analyzer` | The analyzer to be used at search time. Default is the analyzer specified in the `analyzer` parameter. Configures the root field and subfields.
`search_quote_analyzer` | The analyzer to be used at search time with phrases. Default is the analyzer specified in the `analyzer` parameter. Configures the root field and subfields.
`similarity` | The ranking algorithm for calculating relevance scores. Default is `BM25`. Configures the root field and subfields.
`store` | A Boolean value that specifies whether the field value should be stored and can be retrieved separately from the _source field. Default is `false`. Configures the root field only.
[`term_vector`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/text#term-vector-parameter) | A Boolean value that specifies whether a term vector for this field should be stored. Default is `no`. Configures the root field and n-gram subfields. Does not configure the prefix subfield. 
