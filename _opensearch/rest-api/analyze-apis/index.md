---
layout: default
title: Analyze APIs
parent: REST API reference
has_children: true
nav_order: 7
redirect_from:
  - /opensearch/rest-api/analyze-apis/
---

# Analyze APIs

The analyze APIs allow you to perform text analysis, which is the process of converting unstructured text into individual tokens (usually words) that are optimized for search. 

## Terminology

The following sections provide descriptions of important text analysis terms. 

### Analyzers

Analyzers instruct OpenSearch how to index and search text. Analyzers comprise three components: a tokenizer, zero or more token filters, and zero or more character filters. 

OpenSearch provides *built-in* analyzers. For example, the `standard` built-in analyzer converts text to lower case and breaks text into tokens based on word boundaries such as carriage returns and white space. The `standard` analyzer is also called the *default* analyzer and is used when no analyzer is specified in the text analysis request.

If needed, you can combine tokenizers, token filters, and character filters to create a *custom* analyzer.

#### Tokenizers

Tokenizers break unstuctured text into tokens and maintain metadata about tokens such as their start and ending positions in the text.

#### Character filters

Character filters examine textand perform translations such as changing, removing, and adding characters. 

#### Token filters

Token filters modify tokens, performing operations such converting a token's characters to upper case, and adding or removing tokens. 

### Normalizers

Similar to analyzers, normalizers tokenize text, but return a single token only. Normalizers do not employ tokenizers, and make limited use of character and token filters, such as those that operate on one character at a time.

By default, OpenSearch does not apply normalizers. To apply a normalizers, you must add them to your data before creating an index.