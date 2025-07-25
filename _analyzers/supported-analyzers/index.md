---
layout: default
title: Analyzers
nav_order: 40
has_children: true
has_toc: false
redirect_from:
    - /analyzers/supported-analyzers/index/
canonical_url: https://docs.opensearch.org/latest/analyzers/supported-analyzers/index/
---

# Analyzers

The following sections list all analyzers that OpenSearch supports.

## Built-in analyzers

The following table lists the built-in analyzers that OpenSearch provides. The last column of the table contains the result of applying the analyzer to the string `It’s fun to contribute a brand-new PR or 2 to OpenSearch!`.

Analyzer | Analysis performed | Analyzer output 
:--- | :--- | :---
**Standard** (default) | - Parses strings into tokens at word boundaries <br> - Removes most punctuation <br> - Converts tokens to lowercase | [`it’s`, `fun`, `to`, `contribute`, `a`,`brand`, `new`, `pr`, `or`, `2`, `to`, `opensearch`]
**Simple** | - Parses strings into tokens on any non-letter character <br> - Removes non-letter characters <br> - Converts tokens to lowercase  | [`it`, `s`, `fun`, `to`, `contribute`, `a`,`brand`, `new`, `pr`, `or`, `to`, `opensearch`]
**Whitespace** | - Parses strings into tokens on white space | [`It’s`, `fun`, `to`, `contribute`, `a`,`brand-new`, `PR`, `or`, `2`, `to`, `OpenSearch!`]
**Stop** | - Parses strings into tokens on any non-letter character <br> - Removes non-letter characters <br> - Removes stop words <br> - Converts tokens to lowercase | [`s`, `fun`, `contribute`, `brand`, `new`, `pr`, `opensearch`]
**Keyword** (no-op) | - Outputs the entire string unchanged | [`It’s fun to contribute a brand-new PR or 2 to OpenSearch!`]
**Pattern** | - Parses strings into tokens using regular expressions <br> - Supports converting strings to lowercase <br> - Supports removing stop words | [`it`, `s`, `fun`, `to`, `contribute`, `a`,`brand`, `new`, `pr`, `or`, `2`, `to`, `opensearch`]
[**Language**]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/) | Performs analysis specific to a certain language (for example, `english`). | [`fun`, `contribut`, `brand`, `new`, `pr`, `2`, `opensearch`]
**Fingerprint** | - Parses strings on any non-letter character <br> - Normalizes characters by converting them to ASCII <br> - Converts tokens to lowercase <br> - Sorts, deduplicates, and concatenates tokens into a single token <br> - Supports removing stop words | [`2 a brand contribute fun it's new opensearch or pr to`] <br> Note that the apostrophe was converted to its ASCII counterpart.

## Language analyzers

OpenSearch supports analyzers for various languages. For more information, see [Language analyzers]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/).