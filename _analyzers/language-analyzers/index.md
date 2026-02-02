---
layout: default
title: Language analyzers
nav_order: 140
parent: Analyzers
has_children: true
has_toc: true
redirect_from:
  - /query-dsl/analyzers/language-analyzers/
  - /analyzers/language-analyzers/
---

# Language analyzers

OpenSearch supports the following language analyzers:
`arabic`, `armenian`, `basque`, `bengali`, `brazilian`, `bulgarian`, `catalan`, `czech`, `danish`, `dutch`, `english`, `estonian`, `finnish`, `french`, `galician`, `german`, `greek`, `hindi`, `hungarian`, `indonesian`, `irish`, `italian`, `latvian`, `lithuanian`, `norwegian`, `persian`, [`polish`]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/polish/) (requires plugin), `portuguese`, `romanian`, `russian`, `sorani`, `spanish`, `swedish`, `thai`, `turkish`, and [`ukrainian`]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/ukrainian/) (requires plugin).

To use an analyzer when you map an index, specify the value in your query. For example, to map your index with the French language analyzer, specify the `french` value in the analyzer field:

```json
 "analyzer": "french"
```

#### Example request

The following query specifies an index `my-index` with the `content` field configured as multi-field, and a sub-field named `french` is configured with the `french` language analyzer:

```json
PUT my-index
{
  "mappings": {
    "properties": {
      "content": { 
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
{% include copy-curl.html %}

The default `french` analyzer can also be configured for the entire index using the following query:

```json
PUT my-index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "default": {
          "type": "french"
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text"
      },
      "title": {
        "type": "text"
      },
      "description": {
        "type": "text"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

You can apply stem exclusion to any language analyzer by providing a list of lowercase words that should be excluded from stemming. Internally, OpenSearch uses the `keyword_marker` token filter to mark these words as keywords, ensuring that they are not stemmed.

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


## Stem exclusion with custom analyzers

All language analyzers consist of tokenizers and token filters specific to a particular language. If you want to implement a custom version of the language analyzer with stem exclusion, you need to configure the `keyword_marker` token filter and list the words excluded from stemming in the `keywords` parameter:

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
