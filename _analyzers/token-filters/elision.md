---
layout: default
title: Elision
parent: Token filters
nav_order: 130
---
<!-- vale off -->
# Elision token filter
<!-- vale on -->
The `elision` token filter is used to remove elided characters from words in certain languages. Elision typically occurs in languages such as French, where words are often contracted and combined with the following word, typically by omitting a vowel and replacing it with an apostrophe. 

The `elision` token filter already comes preconfigured in the following [language analyzers]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/): **Catalan**, **French**, **Irish** and **Italian**.
{: .note}

## Parameters

The custom `elision` token filter in OpenSearch can be configured with the following parameters:

- `articles`: Defines which articles or short words should be removed when they appear as part of an elision. (Array of strings, _Required_ if `articles_path` is not configured)
- `articles_path`: Specifies path to custom list of articles that should be removed during the analysis process. (String, _Required_ if `articles` is not configured)
- `articles_case`: Filter is case-sensitive when it removes articles from text during analysis. Default is `false` (Boolean, _Optional_)

## Example

The following example request creates a new index named `french_texts` and configures an analyzer with `french_elision` filter:

```json
PUT /french_texts
{
  "settings": {
    "analysis": {
      "filter": {
        "french_elision": {
          "type": "elision",
          "articles": [ "l", "t", "m", "d", "n", "s", "j" ]
        }
      },
      "analyzer": {
        "french_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": ["lowercase", "french_elision"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "text": {
        "type": "text",
        "analyzer": "french_analyzer"
      }
    }
  }
}

```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
POST /french_texts/_analyze
{
  "analyzer": "french_analyzer",
  "text": "L'étudiant aime l'école et le travail."
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "étudiant",
      "start_offset": 0,
      "end_offset": 10,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "aime",
      "start_offset": 11,
      "end_offset": 15,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "école",
      "start_offset": 16,
      "end_offset": 23,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "et",
      "start_offset": 24,
      "end_offset": 26,
      "type": "<ALPHANUM>",
      "position": 3
    },
    {
      "token": "le",
      "start_offset": 27,
      "end_offset": 29,
      "type": "<ALPHANUM>",
      "position": 4
    },
    {
      "token": "travail",
      "start_offset": 30,
      "end_offset": 37,
      "type": "<ALPHANUM>",
      "position": 5
    }
  ]
}
```
