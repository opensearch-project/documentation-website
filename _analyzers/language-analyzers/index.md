---
layout: default
title: Language analyzers
nav_order: 100
parent: Analyzers
has_children: true
has_toc: false
---

# Language analyzers

OpenSearch supports the following language analyzers:
`arabic`, `armenian`, `basque`, `bengali`, `brazilian`, `bulgarian`, `catalan`, `czech`, `danish`, `dutch`, `english`, `estonian`, `finnish`, `french`, `galician`, `german`, `greek`, `hindi`, `hungarian`, `indonesian`, `irish`, `italian`, `latvian`, `lithuanian`, `norwegian`, `persian`, `portuguese`, `romanian`, `russian`, `sorani`, `spanish`, `swedish`, `turkish`, and `thai`.

To use the analyzer when you map an index, specify the value within your query. For example, to map your index with the French language analyzer, specify the `french` value for the analyzer field:

```json
 "analyzer": "french"
```

#### Example request

The following query specifies the `french` language analyzer for the index `my-index`:

```json
PUT my-index
{
  "mappings": {
    "properties": {
      "text": { 
        "type": "text",
        "fields": {
          "french": { 
            "type": "text",
            "analyzer": "french"
          }
        }
      }
    }
  }
}
```

## Stem exclusion

You can apply stem exclusion to many language analyzers by providing a list of lowercase words that should be excluded from stemming. Internally, OpenSearch uses the `keyword_marker` token filter to mark these words as keywords, ensuring they are not stemmed.

## Stem exclusion example

Use the following request to configure `stem_exclusion`:

```json
PUT index_with_stem_exclusion_english_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "stem_exclusion_english_analyzer":{
          "type":"english",
          "stem_exclusion": ["manager", "management"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The following languages support stem exclusion:

- arabic 
- armenian
- basque
- bengali
- brazilian
- bulgarian
- catalan
- cjk
- czech
- danish
- dutch
- english
- finnish
- french
- galician
- german
- hindi
- hungarian
- indonesian
- irish
- italian
- latvian
- lithuanian
- norwegian
- portuguese
- romanian
- russian
- sorani
- spanish
- swedish
- turkish


## Stem exclusion with custom analyzers

All language analyzers consist of tokenizers and token filters specific to the particular language. If you want to implement a custom version of the language analyzer with stem exclusion, you need to configure the `keyword_marker` token filter and list the words excluded from stemming in the `keywords` parameter:

```json
PUT index_with_keyword_marker_analyzer
{
  "settings": {
    "analysis": {
      "filter": {
        "protected_keywords_filter": {
          "type": "keyword_marker",
          "keywords": ["Apple", "OpenSearch"]
        }
      },
      "analyzer": {
        "custom_english_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "protected_keywords_filter",
            "english_stemmer"
          ]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}
