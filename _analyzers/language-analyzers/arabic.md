---
layout: default
title: Arabic
parent: Language analyzers
nav_order: 10
---

# Arabic analyzer

The built-in `arabic` analyzer can be applied to a text field using the following command:

```json
PUT /arabic-index
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "arabic"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Arabic analyzer internals

The `arabic` analyzer is build using the following:

Tokenizer: `standard`

Token Filters:
- decimal_digit (general)
- stop (arabic)
- normalization (arabic)
- keywords (arabic)
- stemmer (arabic)

## Custom Arabic analyzer

You can create custom Arabic analyzer using the following command:

```json
PUT /arabic-index
{
  "settings": {
    "analysis": {
      "filter": {
        "arabic_stop": {
          "type": "stop",
          "stopwords": "_arabic_"
        },
        "arabic_stemmer": {
          "type": "stemmer",
          "language": "arabic"
        },
        "arabic_normalization": {
          "type": "arabic_normalization"
        },
        "decimal_digit": {
          "type": "decimal_digit"
        }
      },
      "analyzer": {
        "arabic_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "arabic_normalization",
            "decimal_digit",
            "arabic_stop",
            "arabic_stemmer"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "analyzer": "arabic_analyzer"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Stem exclusion

If you want to prevent certain words from stemming, you can add a `keyword_marker` token filter to mark list of words as keywords and add it to list of filters in analyzer.

```json
"arabic_stemmer": {
    ...
},
"arabic_keywords": {
    "type":       "keyword_marker",
    "keywords":   ["بتن"] 
},
"arabic_normalization": {
    ...
},
```


