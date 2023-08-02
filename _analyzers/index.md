---
layout: default
title: Text analysis
has_children: true
nav_order: 5
nav_exclude: true
redirect_from: 
  - /opensearch/query-dsl/text-analyzers/
  - /query-dsl/analyzers/text-analyzers/
  - /analyzers/text-analyzers/
---

# Text analysis

When you are searching documents using a full-text search, you want to receive all relevant results and not only exact matches. If you're looking for "walk," you're interested in results that contain any form of the word, like "Walk", "walked" or "walking." To facilitate full-text search, OpenSearch uses text analysis.

Text analysis consists of the following steps:

- _Tokenize_ text into terms: After tokenization, the phrase `Actions speak louder than words` is split into tokens `Actions`, `speak`, `louder`, `than`, `words`.
- _Normalize_ the terms by converting them into a standard format, for example convert them to lowercase or perform stemming (reducing the word to its root): After normalization, `Actions` becomes `action`, `louder` becomes `loud`, and `words` becomes `word`.

## Analyzers

In OpenSearch, text analysis is performed by an _analyzer_. Each analyzer contains the following components that are applied sequentially:

- **Character filters**: First, a character filter receives the original text as a stream of characters and adds, removes, or modifies characters in the text. For example, a character filter can strip HTML characters from a string so the text `<p><b>Actions</b> speak louder than <em>words</em></p>` becomes `\nActions speak louder than words\n`. The output of a character filter is a stream of characters.

- **Tokenizer**: Next, a tokenizer receives the stream of characters that has been processed by a character filter and splits the text into individual _tokens_ (usually, words). For example, a tokenizer can split text on white space so the preceding text becomes [`Actions`, `speak`, `louder`, `than`, `words`]. Tokenizers also maintain metadata about tokens, such as their starting and ending positions in the text. The output of a tokenizer is a stream of tokens.

- **Token filter**: Last, a token filter receives the stream of tokens from the tokenizer and adds, removes, or modifies tokens. For example, a token filter may lowercase the tokens so `Actions` becomes `action`, remove stopwords like `than`, or add synonyms like `talk` for the word `speak`.

An analyzer must contain exactly one tokenizer and may contain zero or more character filters and zero or more token filters.
{: .note}

## Built-in analyzers

OpenSearch provides the following built-in analyzers:

- **Standard analyzer** (default) – Parses strings into terms at word boundaries according to the Unicode text segmentation algorithm. It removes most, but not all, punctuation and converts strings to lowercase. You can remove stop words if you enable that option, but it does not remove stop words by default.
- **Simple analyzer** – Converts strings to lowercase and removes non-letter characters when it splits a string into tokens on any non-letter character.
- **Whitespace analyzer** – Parses strings into terms between each whitespace.
- **Stop analyzer** – Converts strings to lowercase and removes non-letter characters by splitting strings into tokens at each non-letter character. It also removes stop words (for example, "but" or "this") from strings.
- **Keyword analyzer** – Receives a string as input and outputs the entire string as one term.
- **Pattern analyzer** – Splits strings into terms using regular expressions and supports converting strings to lowercase. It also supports removing stop words.
- **Language analyzer** – Provides analyzers specific to multiple languages.
- **Fingerprint analyzer** – Creates a fingerprint to use as a duplicate detector.

The default `standard` analyzer converts text to lowercase and breaks text into tokens based on word boundaries such as carriage returns and white space. 

## Custom analyzers

If needed, you can combine tokenizers, token filters, and character filters to create a custom analyzer.

## Text analysis at indexing time and query time

OpenSearch performs text analysis on text fields when you index a document and when you send a search request. Depending on the time of text analysis, the analyzers used for it are classified as follows:

- An _index analyzer_ performs analysis at indexing time: When you are indexing a [text]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/text/) field, OpenSearch analyzes it before indexing it. 

- A _search analyzer_ performs analysis at query time: OpenSearch analyzes the query string when you run a full-text query on a text field.

Analyzing both the text field and the query string that is used to search it ensures that the search uses the same terms as those that are stored in the index. 

### Example

When you index a document that has a text field with the text `Actions speak louder than words`, OpenSearch analyzes the text and produces the following list of tokens: 

Text field tokens = [`action`, `speak`, `loud`, `than`, `word`]

When you search for documents that match the query `speaking loudly`, OpenSearch analyzes the query string and produces the following list of tokens:

Query string tokens = [`speak`, `loud`]

Then OpenSearch compares each token in the query string against the list of text field tokens and finds that both lists contain the tokens `speak` and `loud`, so OpenSearch returns this document as part of search results that match the query.

In the majority of cases, you should use the same analyzer at indexing time and at search time because then the text field and the query string are analyzed in the same way and the resulting tokens match as expected.
{: .tip}

## Testing an analyzer

To test a built-in analyzer and view the list of tokens it generates when a document is indexed, you can use the [Analyze API]({{site.url}}{{site.baseurl}}/api-reference/analyze-apis/#apply-a-built-in-analyzer).

