---
layout: default
title: Text analyzers
nav_order: 190
has_children: true
permalink: /analyzers/text-analyzers/
redirect_from: 
  - /opensearch/query-dsl/text-analyzers/
  - /query-dsl/analyzers/text-analyzers/
canonical_url: https://docs.opensearch.org/latest/analyzers/
---


# Optimizing text for searches with text analyzers

OpenSearch applies text analysis during indexing or searching for `text` fields. There is a standard  analyzer that OpenSearch uses by default for text analysis. To optimize unstructured text for search, you can convert it into structured text with our text analyzers.

## Text analyzers

OpenSearch provides several text analyzers to convert your structured text into the format that works best for your searches.

OpenSearch supports the following text analyzers:

- **Standard analyzer** – Parses strings into terms at word boundaries according to the Unicode text segmentation algorithm. It removes most, but not all, punctuation and converts strings to lowercase. You can remove stop words if you enable that option, but it does not remove stop words by default.
- **Simple analyzer** – Converts strings to lowercase and removes non-letter characters when it splits a string into tokens on any non-letter character.
- **Whitespace analyzer** – Parses strings into terms between each whitespace.
- **Stop analyzer** – Converts strings to lowercase and removes non-letter characters by splitting strings into tokens at each non-letter character. It also removes stop words (for example, "but" or "this") from strings.
- **Keyword analyzer** – Receives a string as input and outputs the entire string as one term.
- **Pattern analyzer** – Splits strings into terms using regular expressions and supports converting strings to lowercase. It also supports removing stop words.
- **Language analyzer** – Provides analyzers specific to multiple languages.
- **Fingerprint analyzer** – Creates a fingerprint to use as a duplicate detector.

The full specialized text analyzers reference is in progress and will be published soon.
{: .note }

## How to use text analyzers

If you want to use a text analyzer, specify the name of the analyzer for the `analyzer` field: standard, simple, whitespace, stop, keyword, pattern, fingerprint, or language.

Each analyzer consists of one tokenizer and zero or more token filters. Different analyzers have different character filters, tokenizers, and token filters. To pre-process the string before the tokenizer is applied, you can use one or more character filters.

#### Example: Specify the standard analyzer in a simple query

```json
 GET _search
{
  "query": {
    "match": {
      "title": "A brief history of Time",
        "analyzer": "standard"
       }
    }
  }
  ```

## Analyzer options

Option | Valid values | Description
:--- | :--- | :---
`analyzer` | `standard, simple, whitespace, stop, keyword, pattern, language, fingerprint` | The analyzer you want to use for the query. Different analyzers have different character filters, tokenizers, and token filters. The `stop` analyzer, for example, removes stop words (for example, "an," "but," "this") from the query string. For a full list of acceptable language values, see [Language analyzer]({{site.url}}{{site.baseurl}}/query-dsl/analyzers/language-analyzers/) on this page.
`quote_analyzer` | String | This option lets you choose to use the standard analyzer without any options, such as `language` or other analyzers. Usage is `"quote_analyzer": "standard"`.

<!-- This is a list of the 7 individual new pages we need to write
If you want to select one of the text analyzers, see [Text analyzers reference]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/specialized-analyzers).

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
