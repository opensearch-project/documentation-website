---
layout: default
title: Creating a custom analyzer
nav_order: 40
parent: Analyzers
---

# Creating a custom analyzer

To create a custom analyzer, specify a combination of the following components:

- Character filters (zero or more)

- Tokenizer (one)

- Token filters (zero or more)

## Configuration

The following parameters can be used to configure a custom analyzer.

| Parameter                | Required/Optional | Description  |
|:--- | :--- | :--- |
| `type`                   | Optional          | The analyzer type. Default is `custom`. You can also specify a prebuilt analyzer using this parameter.              |
| `tokenizer`              | Required          | A tokenizer to be included in the analyzer. |
| `char_filter`            | Optional          | A list of character filters to be included in the analyzer. |
| `filter`                 | Optional          | A list of token filters to be included in the analyzer. |
| `position_increment_gap` | Optional          | The extra spacing applied between values when indexing text fields that have multiple values. For more information, see [Position increment gap](#position-increment-gap). Default is `100`. |

## Examples

The following examples demonstrate various custom analyzer configurations.

### Custom analyzer with a character filter for HTML stripping

The following example analyzer removes HTML tags from text before tokenization:

```json
PUT simple_html_strip_analyzer_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "html_strip_analyzer": {
          "type": "custom",
          "char_filter": ["html_strip"],
          "tokenizer": "whitespace",
          "filter": ["lowercase"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Use the following request to examine the tokens generated using the analyzer:

```json
GET simple_html_strip_analyzer_index/_analyze
{
  "analyzer": "html_strip_analyzer",
  "text": "<p>OpenSearch is <strong>awesome</strong>!</p>"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "opensearch",
      "start_offset": 3,
      "end_offset": 13,
      "type": "word",
      "position": 0
    },
    {
      "token": "is",
      "start_offset": 14,
      "end_offset": 16,
      "type": "word",
      "position": 1
    },
    {
      "token": "awesome!",
      "start_offset": 25,
      "end_offset": 42,
      "type": "word",
      "position": 2
    }
  ]
}
```

### Custom analyzer with a mapping character filter for synonym replacement

The following example analyzer replaces specific characters and patterns before applying the synonym filter:

```json
PUT mapping_analyzer_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "synonym_mapping_analyzer": {
          "type": "custom",
          "char_filter": ["underscore_to_space"],
          "tokenizer": "standard",
          "filter": ["lowercase", "stop", "synonym_filter"]
        }
      },
      "char_filter": {
        "underscore_to_space": {
          "type": "mapping",
          "mappings": ["_ => ' '"]
        }
      },
      "filter": {
        "synonym_filter": {
          "type": "synonym",
          "synonyms": [
            "quick, fast, speedy",
            "big, large, huge"
          ]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Use the following request to examine the tokens generated using the analyzer:

```json
GET mapping_analyzer_index/_analyze
{
  "analyzer": "synonym_mapping_analyzer",
  "text": "The slow_green_turtle is very large"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "slow","start_offset": 4,"end_offset": 8,"type": "<ALPHANUM>","position": 1},
    {"token": "green","start_offset": 9,"end_offset": 14,"type": "<ALPHANUM>","position": 2},
    {"token": "turtle","start_offset": 15,"end_offset": 21,"type": "<ALPHANUM>","position": 3},
    {"token": "very","start_offset": 25,"end_offset": 29,"type": "<ALPHANUM>","position": 5},
    {"token": "large","start_offset": 30,"end_offset": 35,"type": "<ALPHANUM>","position": 6},
    {"token": "big","start_offset": 30,"end_offset": 35,"type": "SYNONYM","position": 6},
    {"token": "huge","start_offset": 30,"end_offset": 35,"type": "SYNONYM","position": 6}
  ]
}
```

### Custom analyzer with a custom pattern-based character filter for number normalization

The following example analyzer normalizes phone numbers by removing dashes and spaces and applies edge n-grams to the normalized text to support partial matches:

```json
PUT advanced_pattern_replace_analyzer_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "phone_number_analyzer": {
          "type": "custom",
          "char_filter": ["phone_normalization"],
          "tokenizer": "standard",
          "filter": ["lowercase", "edge_ngram"]
        }
      },
      "char_filter": {
        "phone_normalization": {
          "type": "pattern_replace",
          "pattern": "[-\\s]",
          "replacement": ""
        }
      },
      "filter": {
        "edge_ngram": {
          "type": "edge_ngram",
          "min_gram": 3,
          "max_gram": 10
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Use the following request to examine the tokens generated using the analyzer:

```json
GET advanced_pattern_replace_analyzer_index/_analyze
{
  "analyzer": "phone_number_analyzer",
  "text": "123-456 7890"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "123","start_offset": 0,"end_offset": 12,"type": "<NUM>","position": 0},
    {"token": "1234","start_offset": 0,"end_offset": 12,"type": "<NUM>","position": 0},
    {"token": "12345","start_offset": 0,"end_offset": 12,"type": "<NUM>","position": 0},
    {"token": "123456","start_offset": 0,"end_offset": 12,"type": "<NUM>","position": 0},
    {"token": "1234567","start_offset": 0,"end_offset": 12,"type": "<NUM>","position": 0},
    {"token": "12345678","start_offset": 0,"end_offset": 12,"type": "<NUM>","position": 0},
    {"token": "123456789","start_offset": 0,"end_offset": 12,"type": "<NUM>","position": 0},
    {"token": "1234567890","start_offset": 0,"end_offset": 12,"type": "<NUM>","position": 0}
  ]
}
```

## Handling special characters in regex patterns

When using custom regex patterns in your analyzer, ensure that special or non-English characters are handled correctly. By default, Java's regex considers only `[A-Za-z0-9_]` to be word characters (`\w`). This can cause unexpected behavior when using `\w` or `\b`, which match the boundary between a word and a non-word character.  

For example, the following analyzer attempts to use the pattern `(\b\p{L}+\b)` to match one or more letter characters from any language (`\p{L}`) surrounded by word boundaries:  

```json
PUT /buggy_custom_analyzer
{
  "settings": {
    "analysis": {
      "filter": {
        "capture_words": {
          "type": "pattern_capture",
          "patterns": [
            "(\\b\\p{L}+\\b)"
          ]
        }
      },
      "analyzer": {
        "filter_only_analyzer": {
          "type": "custom",
          "tokenizer": "keyword",
          "filter": [
            "capture_words"
          ]
        }
      }
    }
  }
}
```  

However, this analyzer incorrectly tokenizes `él-empezó-a-reír` as `l`, `empez`, `a`, and `reír` because `\b` does not match the boundary between accented characters and the start or end of a string.   

To handle special characters correctly, add the Unicode case flag `(?U)` to your pattern:  

```json
PUT /fixed_custom_analyzer
{
  "settings": {
    "analysis": {
      "filter": {
        "capture_words": {
          "type": "pattern_capture",
          "patterns": [
            "(?U)(\\b\\p{L}+\\b)"
          ]
        }
      },
      "analyzer": {
        "filter_only_analyzer": {
          "type": "custom",
          "tokenizer": "keyword",
          "filter": [
            "capture_words"
          ]
        }
      }
    }
  }
}
```  
{% include copy-curl.html %}

## Position increment gap

The `position_increment_gap` parameter sets a positional gap between terms when indexing multi-valued fields, such as arrays. This gap ensures that phrase queries don't match terms across separate values unless explicitly allowed. For example, a default gap of 100 specifies that terms in different array entries are 100 positions apart, preventing unintended matches in phrase searches. You can adjust this value or set it to `0` in order to allow phrases to span across array values.

The following example demonstrates the effect of `position_increment_gap` using a `match_phrase` query.

1. Index a document in a `test-index`:

     ```json
     PUT test-index/_doc/1
     {
       "names": [ "Slow green", "turtle swims"]
     }
     ```
     {% include copy-curl.html %}

1. Query the document using a `match_phrase` query:

    ```json
    GET test-index/_search
    {
      "query": {
        "match_phrase": {
          "names": {
            "query": "green turtle" 
          }
        }
      }
    }
    ```
    {% include copy-curl.html %}
    
    The response returns no hits because the distance between the terms `green` and `turtle` is `100` (the default `position_increment_gap`).

1. Now query the document using a `match_phrase` query with a `slop` parameter that is higher than the `position_increment_gap`:

    ```json
    GET test-index/_search
    {
      "query": {
        "match_phrase": {
          "names": {
            "query": "green turtle",
            "slop": 101
          }
        }
      }
    }
    ```
    {% include copy-curl.html %}

    The response contains the matching document:

    ```json
    {
      "took": 4,
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
        "max_score": 0.010358453,
        "hits": [
          {
            "_index": "test-index",
            "_id": "1",
            "_score": 0.010358453,
            "_source": {
              "names": [
                "Slow green",
                "turtle swims"
              ]
            }
          }
        ]
      }
    }
    ```
