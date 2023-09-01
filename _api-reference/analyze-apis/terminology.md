---
layout: default
title: Analysis API Terminology
parent: Analyze API

nav_order: 1
---

# Terminology

The following sections provide descriptions of important text analysis terms. 

## Analyzers

Analyzers tell OpenSearch how to index and search text. An analyzer is composed of three components: a tokenizer, zero or more token filters, and zero or more character filters. 

OpenSearch provides *built-in* analyzers. For example, the `standard` built-in analyzer converts text to lowercase and breaks text into tokens based on word boundaries such as carriage returns and white space. The `standard` analyzer is also called the *default* analyzer and is used when no analyzer is specified in the text analysis request.

If needed, you can combine tokenizers, token filters, and character filters to create a *custom* analyzer.

#### Tokenizers

Tokenizers break unstructured text into tokens and maintain metadata about tokens, such as their starting and ending positions in the text.

#### Character filters

Character filters examine text and perform translations, such as changing, removing, and adding characters. 

#### Token filters

Token filters modify tokens, performing operations such as converting a token's characters to uppercase and adding or removing tokens. 

## Normalizers

Similar to analyzers, normalizers tokenize text but return a single token only. Normalizers do not employ tokenizers; they make limited use of character and token filters, such as those that operate on one character at a time.

By default, OpenSearch does not apply normalizers. To apply normalizers, you must add them to your data before creating an index.