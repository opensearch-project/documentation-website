---
layout: default
title: Completion
nav_order: 51
has_children: false
parent: Autocomplete field types
grand_parent: Supported field types
redirect_from:
  - /opensearch/supported-field-types/completion/
  - /field-types/completion/
---

# Completion field type

A completion field type provides autocomplete functionality through a completion suggester. The completion suggester is a prefix suggester, so it matches the beginning of text only. A completion suggester creates an in-memory data structure, which provides faster lookups but leads to increased memory usage. You need to upload a list of all possible completions into the index before using this feature.

## Example

Create a mapping with a completion field:

```json
PUT chess_store
{
  "mappings": {
    "properties": {
      "suggestions": {
        "type": "completion"
      },
      "product": {
        "type": "keyword"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index suggestions into OpenSearch:

```json
PUT chess_store/_doc/1
{
  "suggestions": {
      "input": ["Books on openings", "Books on endgames"],
      "weight" : 10
    }
}
```
{% include copy-curl.html %}

## Parameters

The following table lists the parameters accepted by completion fields.

Parameter | Description 
:--- | :--- 
`input` | A list of possible completions as a string or array of strings. Cannot contain `\u0000` (null), `\u001f` (information separator one), or `\u001e` (information separator two). Required.
`weight` | A positive integer or a positive integer string for ranking suggestions. Optional.

Multiple suggestions can be indexed as follows:

```json
PUT chess_store/_doc/2
{
  "suggestions": [
    {
      "input": "Chess set",
      "weight": 20
    },
    {
      "input": "Chess pieces",
      "weight": 10
    },
    {
      "input": "Chess board",
      "weight": 5
    }
  ]
}
```
{% include copy-curl.html %}

As an alternative, you can use the following shorthand notation (note that you cannot provide the `weight` parameter in this notation):

```json
PUT chess_store/_doc/3
{
  "suggestions" : [ "Chess clock", "Chess timer" ]
}
```
{% include copy-curl.html %}

## Querying completion field types

To query completion field types, specify the prefix that you want to search for and the name of the field in which to look for suggestions.

Query the index for suggestions that start with the word "chess":

```json
GET chess_store/_search
{
  "suggest": {
    "product-suggestions": {
      "prefix": "chess",        
      "completion": {         
          "field": "suggestions"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains autocomplete suggestions:

```json
{
  "took" : 3,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 0,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "suggest" : {
    "product-suggestions" : [
      {
        "text" : "chess",
        "offset" : 0,
        "length" : 5,
        "options" : [
          {
            "text" : "Chess set",
            "_index" : "chess_store",
            "_type" : "_doc",
            "_id" : "2",
            "_score" : 20.0,
            "_source" : {
              "suggestions" : [
                {
                  "input" : "Chess set",
                  "weight" : 20
                },
                {
                  "input" : "Chess pieces",
                  "weight" : 10
                },
                {
                  "input" : "Chess board",
                  "weight" : 5
                }
              ]
            }
          },
          {
            "text" : "Chess clock",
            "_index" : "chess_store",
            "_type" : "_doc",
            "_id" : "3",
            "_score" : 1.0,
            "_source" : {
              "suggestions" : [
                "Chess clock",
                "Chess timer"
              ]
            }
          }
        ]
      }
    ]
  }
}
```

In the response, the `_score` field contains the value of the `weight` parameter that was set up at index time. The `text` field is populated with the suggestion's `input` parameter.

By default, the response contains the whole document, including the `_source` field, which may impact performance. To return only the `suggestions` field, you can specify that in the `_source` parameter. You can also restrict the number of returned suggestions by specifying the `size` parameter.

```json
GET chess_store/_search
{
  "_source": "suggestions", 
  "suggest": {
    "product-suggestions": {
      "prefix": "chess",        
      "completion": {         
          "field": "suggestions",
          "size" : 3
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the suggestions:

```json
{
  "took" : 5,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 0,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "suggest" : {
    "product-suggestions" : [
      {
        "text" : "chess",
        "offset" : 0,
        "length" : 5,
        "options" : [
          {
            "text" : "Chess set",
            "_index" : "chess_store",
            "_type" : "_doc",
            "_id" : "2",
            "_score" : 20.0,
            "_source" : {
              "suggestions" : [
                {
                  "input" : "Chess set",
                  "weight" : 20
                },
                {
                  "input" : "Chess pieces",
                  "weight" : 10
                },
                {
                  "input" : "Chess board",
                  "weight" : 5
                }
              ]
            }
          },
          {
            "text" : "Chess clock",
            "_index" : "chess_store",
            "_type" : "_doc",
            "_id" : "3",
            "_score" : 1.0,
            "_source" : {
              "suggestions" : [
                "Chess clock",
                "Chess timer"
              ]
            }
          }
        ]
      }
    ]
  }
}
```

To take advantage of source filtering, use the suggest functionality on the `_search` endpoint. The `_suggest` endpoint does not support source filtering.
{: .note}

## Completion query parameters

The following table lists the parameters accepted by the completion suggester query.

Parameter | Description 
:--- | :--- 
`field` | A string that specifies the field on which to run the query. Required.
`size` | An integer that specifies the maximum number of returned suggestions. Optional. Default is 5.
`skip_duplicates` | A Boolean value that specifies whether to skip duplicate suggestions. Optional. Default is `false`.

## Fuzzy completion query

To allow for fuzzy matching, you can specify the `fuzziness` parameter for the completion query. In this case, even if the user mistypes a search term, the completion query still returns results. Additionally, the longer the prefix that matches the query, the higher the document's score.

```json
GET chess_store/_search
{
  "suggest": {
    "product-suggestions": {
      "prefix": "chesc",        
      "completion": {         
          "field": "suggestions",
          "size" : 3,
          "fuzzy" : {
            "fuzziness" : "AUTO"
          }
      }
    }
  }
}
```
{% include copy-curl.html %}

To use all default fuzziness options, specify `"fuzzy": {}` or `"fuzzy": true`.
{: .tip}

The following table lists the parameters accepted by the fuzzy completion suggester query. All of the parameters are optional.

Parameter | Description 
:--- | :--- 
`fuzziness` | Fuzziness can be set as one of the following: <br> 1. An integer that specifies the maximum allowed [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) for this edit. <br> 2. `AUTO`: Strings of 0–2 characters must match exactly, strings of 3–5 characters allow 1 edit, and strings longer than 5 characters allow 2 edits.<br> Default is `AUTO`.
`min_length` | An integer that specifies the minimum length the input must be to start returning suggestions. If the search term is shorter than `min_length`, no suggestions are returned. Default is 3.
`prefix_length` | An integer that specifies the minimum length the matched prefix must be to start returning suggestions. If the prefix of `prefix_length` is not matched, but the search term is still within the Levenshtein distance, no suggestions are returned. Default is 1.
`transpositions` | A Boolean value that specifies to count transpositions (interchanges of adjacent characters) as one edit instead of two. Example: The suggestion's `input` parameter is `abcde` and the `fuzziness` is 1. If `transpositions` is set to `true`, `abdce` will match, but if `transpositions` is set to `false`, `abdce` will not match.  Default is `true`.
`unicode_aware` | A Boolean value that specifies whether to use Unicode code points when measuring the edit distance, transposition, and length. If `unicode_aware` is set to `true`, the measurement is slower. Default is `false`, in which case distances are measured in bytes.

## Regex queries

You can use a regular expression to define the prefix for the completion suggester query. 

For example, to search for strings that start with "a" and have a "d" later on, use the following query:

```json
GET chess_store/_search
{
  "suggest": {
    "product-suggestions": {
      "regex": "a.*d",        
      "completion": {         
          "field": "suggestions"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response matches the string "abcde":

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
      "value" : 0,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "suggest" : {
    "product-suggestions" : [
      {
        "text" : "a.*d",
        "offset" : 0,
        "length" : 4,
        "options" : [
          {
            "text" : "abcde",
            "_index" : "chess_store",
            "_type" : "_doc",
            "_id" : "2",
            "_score" : 20.0,
            "_source" : {
              "suggestions" : [
                {
                  "input" : "abcde",
                  "weight" : 20
                }
              ]
            }
          }
        ]
      }
    ]
  }
}
```