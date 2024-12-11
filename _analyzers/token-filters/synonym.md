---
layout: default
title: Synonym
parent: Token filters
nav_order: 415
---

# Synonym token filter

The `synonym` token filter allows you to map multiple terms to a single term or create equivalence groups between words, improving search flexibility.

## Parameters

The `synonym` token filter can be configured with the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`synonyms` | Either `synonyms` or `synonyms_path` must be specified | String | A list of synonym rules defined directly in the configuration.
`synonyms_path` | Either `synonyms` or `synonyms_path` must be specified | String |  The file path to a file containing synonym rules (either an absolute path or a path relative to the config directory).
`lenient` | Optional | Boolean | Whether to ignore exceptions when loading the rule configurations. Default is `false`.
`format` | Optional | String | Specifies the format used to determine how OpenSearch defines and interprets synonyms. Valid values are:<br>- `solr` <br>- [`wordnet`](https://wordnet.princeton.edu/). <br> Default is `solr`.
`expand` | Optional | Boolean |  Whether to expand equivalent synonym rules. Default is `true`.<br><br>For example: <br>If `synonyms` are defined as `"quick, fast"` and `expand` is set to `true`, then the synonym rules are configured as follows:<br>- `quick => quick`<br>- `quick => fast`<br>- `fast => quick`<br>- `fast => fast`<br><br>If `expand` is set to `false`, the synonym rules are configured as follows:<br>- `quick => quick`<br>- `fast => quick`

## Example: Solr format

The following example request creates a new index named `my-synonym-index` and configures an analyzer with a `synonym` filter. The filter is configured with the default `solr` rule format:

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

## Example: WordNet format

The following example request creates a new index named `my-wordnet-index` and configures an analyzer with a `synonym` filter. The filter is configured with the [`wordnet`](https://wordnet.princeton.edu/) rule format:

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
