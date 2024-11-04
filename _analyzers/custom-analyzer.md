---
layout: default
title: Creating custom analyzer
nav_order: 90
parent: Analyzers

---

# Creating custom analyzer

If you have a use-case where a pre-built analyzers do not tick all the boxes, you can create a custom analyzer.

Analyzers are built using combination of:

- Character filters (zero or more)

- Tokenizer (one)

- Token filters (zero or more)

## Configuration

Following parameters can be used to configure the custom analyzer:

- `type`: Type of analyzer. Default is `custom`. You can also specify the pre-built analyzer using this parameter. (Optional)
- `tokenizer`: tokenizer to be included in the analyzer. (Required)
- `char_filter`: list of character filters to be included in the analyzer. (Optional)
- `filter`: list of token filters to be included in the analyzer. (Optional)
- `position_increment_gap`: The artificial distance that will be added during indexing of text fields with multiple values. You can find further details at [Position increment gap.]({{site.url}}{{site.baseurl}}/analyzers/custom-analyzer/#position-increment-gap) Default is `100`. (Optional)

## Examples

Following examples demonstrate different configurations for custom analyzers

### Custom Analyzer with Character Filter for HTML Stripping

Following example analyzer can be used to remove HTML tags from the text before tokenization:

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

#### Generated tokens

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

### Analyzer with Mapping Character Filter for Synonym Replacement

Following example analyzer can be used to replace specific characters and patterns before applying the synonym filter.

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

#### Generated tokens

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

### Analyzer with Custom Pattern-Based Character Filter for Number Normalization

Following example analyzer can be used to normalize phone numbers by removing dashes and spaces and apply edge n-grams to the normalized text for partial matches.

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

#### Generated tokens

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

## Position increment gap

The `position_increment_gap` parameter sets a positional gap between terms when indexing multi-valued fields, like arrays. This gap ensures that phrase queries typically don't match terms across separate values unless explicitly allowed. For example, a default gap of 100 means terms in different array entries are 100 positions apart, preventing unintended matches in phrase searches. You can adjust this value or set it to 0 to allow phrases to span across array values.

Following example demonstrates the effect of `position_increment_gap` using `match_phrase` query.

1. Index a document in `test-index`:

     ```json
     PUT test-index/_doc/1
     {
       "names": [ "Slow green", "turtle swims"]
     }
     ```
     {% include copy-curl.html %}

2. Query the document using `match_phrase`:

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
    
    You should get no hits, as theoretically the distance between these two terms is `100` (the default of `position_increment_gap`).

3. Now query the document using `match_phrasez` with `slop` parameter higher than the `position_increment_gap`:

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

Expected response:

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
