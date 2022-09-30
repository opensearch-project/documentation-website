---
layout: default
title: Built-in Analyzers
parent: Query DSL
nav_order: 41
---





## Convert text with analyzers

OpenSearch provides the analyzer option to convert your structured text into the format that works best for your searches. You can use the following options with the analyzer field: standard, simple, whitespace, stop, keyword, pattern, fingerprint, and language. Different analyzers have different character filters, tokenizers, and token filters. The stop analyzer, for example, removes stop words (e.g., “an,” “but,” “this”) from the query string.

OpenSearch supports the following language values with the `analyzer` option:
arabic, armenian, basque, bengali, brazilian, bulgarian, catalan, czech, danish, dutch, english, estonian, finnish, french, galicia, german, greek, hindi, hungarian, indonesian, irish, italian, latvian, lithuanian, norwegian, persian, portuguese, romanian, russian, sorani, spanish, swedish, turkish, and thai.

To use the analyzer when you map an index, specify the value within your query. For example, to map your index with the French language analyzer, specify the `french` value for the analyzer field:

```json
 "analyzer": "french"
 ```

#### Sample Request

The following query maps an index with the language analyzer set to `french`:

```json
PUT my-index-000001

{
  "mappings": {
    "properties": {
      "text": { 
        "type": "text",
        "fields": {
          "french": { 
            "type":     "text",
            "analyzer": "french"
          }
        }
      }
    }
  }
}
```

<!-- TO do: each of the options needs its own section with an example. Convert table to individual sections, and then give a streamlined list with valid values. -->






