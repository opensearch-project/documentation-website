---
layout: default
title: Text analyzers
parent: Query DSL
nav_order: 41
---


# Text analyzers

OpenSearch applies text analysis during indexing or searching for `text` fields. There is a standard  analyzer that OpenSearch uses by default for text analysis. To optimize unstructured text for search, you can convert it into structured text with our specialized text analyzers.
## Specialized analyzers

OpenSearch provides specialized analyzers to convert your structured text into the format that works best for your searches.

OpenSearch supports the following specialized text analyzers:

1. **Standard analyzer** – parses text strings into terms at word boundaries per the Unicode text segmentation algorithm. It also removes stop words and removes punctuation and lowercase terms.
1. **Simple analyzer** – converts all characters to lower case and divides groups of non-letter characters into terms.
1. **Whitespace analyzer** – parses characters into terms between whitespaces.
1. **Stop analyzer** – Removes stop words (e.g. "but," or "this") from the query string.
1. **Keyword analyzer** – receives text and outputs only the text specified as a single keyword term.
1. **Pattern analyzer** – splits text into terms using a regular expression and supports lower case characters and stop words.
1. **Language analyzer** – provides multiple languages to specify as analyzer values.
1. **Fingerprint analyzer** – creates a fingerprint to use as a duplicate detector.

The full specialized text analyzers reference is in-progress and will be published soon.
{: .note }

## How to use specialized analyzers

If you want to use a specialized text analyzer, you specify the name of the analyzer for the `analyzer` field.

You can use the following options with the `analyzer` field: standard, simple, whitespace, stop, keyword, pattern, fingerprint, and language. Different analyzers have different character filters, tokenizers, and token filters.


<!-- This is a list of the 7 individual new pages we need to write>

If you want to select one of the specialized analyzers, see [Specialized analyzers reference]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/specialized-analyzers).

## Specialized text analyzers

1. Standard analyzer
1. Simple
1. Whitespace
1. Stop
1. Keyword
1. Pattern
1. Language
1. Fingerprint

-->

## Language analyzer

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






