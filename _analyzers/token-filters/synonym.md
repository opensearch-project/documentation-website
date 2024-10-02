---
layout: default
title: Synonym
parent: Token filters
nav_order: 420
---

# Synonym token filter

The `synonym` token filter allows you to map multiple terms to a single term or create equivalence groups between words, improving search flexibility.

## Parameters

The `synonym` token filter can be configured with the following parameters:

- `synonyms`: Specifies a list of synonym rules defined directly in the configuration. (String, Either `synonyms` or `synonyms_path` needs to be configured)
- `synonyms_path`: Specifies the file path to synonym rules, absolute or relative to config directory. (String, Either `synonyms` or `synonyms_path` needs to be configured)
- `expand`: Expand the input tokens into multiple tokens. Default is `false` (Boolean, _Optional_)
- `lenient`: Ignore the exceptions when loading the rule configurations. Default is `false` (Boolean, _Optional_)
- `format`: Specifies which format is used to determine how synonyms are defined and interpreted by OpenSearch. Options are: `solr` or `wordnet`. Default is `solr` (String, _Optional_)

## Example using solr format

The following example request creates a new index named `my-synonym-index` and configures an analyzer with `synonym` filter with default `solr` rules format:

```json
PUT /my-synonym-index
{
  "settings": {
    "analysis": {
      "filter": {
        "my_synonym_filter": {
          "type": "synonym",
          "synonyms": [
            "car, automobile",
            "quick, fast, speedy",
            "laptop => computer"
          ]
        }
      },
      "analyzer": {
        "my_synonym_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "my_synonym_filter"
          ]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
GET /my-synonym-index/_analyze
{
  "analyzer": "my_synonym_analyzer",
  "text": "The quick dog jumps into the car with a laptop"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "the",
      "start_offset": 0,
      "end_offset": 3,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "quick",
      "start_offset": 4,
      "end_offset": 9,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "fast",
      "start_offset": 4,
      "end_offset": 9,
      "type": "SYNONYM",
      "position": 1
    },
    {
      "token": "speedy",
      "start_offset": 4,
      "end_offset": 9,
      "type": "SYNONYM",
      "position": 1
    },
    {
      "token": "dog",
      "start_offset": 10,
      "end_offset": 13,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "jumps",
      "start_offset": 14,
      "end_offset": 19,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "into",
      "start_offset": 20,
      "end_offset": 24,
      "type": "<ALPHANUM>",
      "position": 4
    },
    {
      "token": "the",
      "start_offset": 25,
      "end_offset": 28,
      "type": "<ALPHANUM>",
      "position": 5
    },
    {
      "token": "car",
      "start_offset": 29,
      "end_offset": 32,
      "type": "<ALPHANUM>",
      "position": 6
    },
    {
      "token": "automobile",
      "start_offset": 29,
      "end_offset": 32,
      "type": "SYNONYM",
      "position": 6
    },
    {
      "token": "with",
      "start_offset": 33,
      "end_offset": 37,
      "type": "<ALPHANUM>",
      "position": 7
    },
    {
      "token": "a",
      "start_offset": 38,
      "end_offset": 39,
      "type": "<ALPHANUM>",
      "position": 8
    },
    {
      "token": "computer",
      "start_offset": 40,
      "end_offset": 46,
      "type": "SYNONYM",
      "position": 9
    }
  ]
}
```

## Example using wordnet format

The following example request creates a new index named `my-wordnet-index` and configures an analyzer with `synonym` filter with `wordnet` rules format:

```json
PUT /my-wordnet-index
{
  "settings": {
    "analysis": {
      "filter": {
        "my_wordnet_synonym_filter": {
          "type": "synonym",
          "format": "wordnet",
          "synonyms": [
            "s(100000001,1,'fast',v,1,0).",
            "s(100000001,2,'quick',v,1,0).",
            "s(100000001,3,'swift',v,1,0)."
          ]
        }
      },
      "analyzer": {
        "my_wordnet_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "my_wordnet_synonym_filter"
          ]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
GET /my-wordnet-index/_analyze
{
  "analyzer": "my_wordnet_analyzer",
  "text": "I have a fast car"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "i",
      "start_offset": 0,
      "end_offset": 1,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "have",
      "start_offset": 2,
      "end_offset": 6,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "a",
      "start_offset": 7,
      "end_offset": 8,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "fast",
      "start_offset": 9,
      "end_offset": 13,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "quick",
      "start_offset": 9,
      "end_offset": 13,
      "type": "SYNONYM",
      "position": 3
    },
    {
      "token": "swift",
      "start_offset": 9,
      "end_offset": 13,
      "type": "SYNONYM",
      "position": 3
    },
    {
      "token": "car",
      "start_offset": 14,
      "end_offset": 17,
      "type": "<ALPHANUM>",
      "position": 4
    }
  ]
}
```
