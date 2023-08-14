---
layout: default
title: Text analysis
has_children: true
nav_order: 5
nav_exclude: true
has_toc: false
redirect_from: 
  - /opensearch/query-dsl/text-analyzers/
  - /query-dsl/analyzers/text-analyzers/
  - /analyzers/text-analyzers/
---

# Text analysis

When you are searching documents using a full-text search, you want to receive all relevant results and not only exact matches. If you're looking for "walk", you're interested in results that contain any form of the word, like "Walk", "walked", or "walking." To facilitate full-text search, OpenSearch uses text analysis.

Text analysis consists of the following steps:

1. _Tokenize_ text into terms: For example, after tokenization, the phrase `Actions speak louder than words` is split into tokens `Actions`, `speak`, `louder`, `than`, and `words`.
1. _Normalize_ the terms by converting them into a standard format, for example, converting them to lowercase or performing stemming (reducing the word to its root): For example, after normalization, `Actions` becomes `action`, `louder` becomes `loud`, and `words` becomes `word`.

## Analyzers

In OpenSearch, text analysis is performed by an _analyzer_. Each analyzer contains the following sequentially applied components:

1. **Character filters**: First, a character filter receives the original text as a stream of characters and adds, removes, or modifies characters in the text. For example, a character filter can strip HTML characters from a string so that the text `<p><b>Actions</b> speak louder than <em>words</em></p>` becomes `\nActions speak louder than words\n`. The output of a character filter is a stream of characters.

1. **Tokenizer**: Next, a tokenizer receives the stream of characters that has been processed by the character filter and splits the text into individual _tokens_ (usually, words). For example, a tokenizer can split text on white space so that the preceding text becomes [`Actions`, `speak`, `louder`, `than`, `words`]. Tokenizers also maintain metadata about tokens, such as their starting and ending positions in the text. The output of a tokenizer is a stream of tokens.

1. **Token filters**: Last, a token filter receives the stream of tokens from the tokenizer and adds, removes, or modifies tokens. For example, a token filter may lowercase the tokens so that `Actions` becomes `action`, remove stopwords like `than`, or add synonyms like `talk` for the word `speak`.

An analyzer must contain exactly one tokenizer and may contain zero or more character filters and zero or more token filters.
{: .note}

## Built-in analyzers

The following table lists the built-in analyzers that OpenSearch provides. The last column of the table contains the result of applying the analyzer to the string `It’s fun to contribute a brand-new PR or 2 to OpenSearch!`.

Analyzer | Analysis performed | Analyzer output 
:--- | :--- | :---
**Standard** (default) | - Parses strings into tokens at word boundaries <br> - Removes most punctuation <br> - Converts tokens to lowercase | [`it’s`, `fun`, `to`, `contribute`, `a`,`brand`, `new`, `pr`, `or`, `2`, `to`, `opensearch`]
**Simple** | - Parses strings into tokens on any non-letter character <br> - Removes non-letter characters <br> - Converts tokens to lowercase  | [`it`, `s`, `fun`, `to`, `contribute`, `a`,`brand`, `new`, `pr`, `or`, `to`, `opensearch`]
**Whitespace** | - Parses strings into tokens on white space | [`It’s`, `fun`, `to`, `contribute`, `a`,`brand-new`, `PR`, `or`, `2`, `to`, `OpenSearch!`]
**Stop** | - Parses strings into tokens on any non-letter character <br> - Removes non-letter characters <br> - Removes stop words <br> - Converts tokens to lowercase | [`s`, `fun`, `contribute`, `brand`, `new`, `pr`, `opensearch`]
**Keyword** (noop) | - Outputs the entire string unchanged | [`It’s fun to contribute a brand-new PR or 2 to OpenSearch!`]
**Pattern** | - Parses strings into tokens using regular expressions <br> - Supports converting strings to lowercase <br> - Supports removing stop words | [`it`, `s`, `fun`, `to`, `contribute`, `a`,`brand`, `new`, `pr`, `or`, `2`, `to`, `opensearch`]
[**Language**]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/) | Performs analysis specific to a certain language (for example, `english`). | [`fun`, `contribut`, `brand`, `new`, `pr`, `2`, `opensearch`]
**Fingerprint** | - Parses strings on any non-letter character <br> - Normalizes characters by converting them to ASCII <br> - Converts tokens to lowercase <br> - Sorts, deduplicates, and concatenates tokens into a single token <br> - Supports removing stop words | [`2 a brand contribute fun it's new opensearch or pr to`] <br> Note that the apostrophe was converted to its ASCII counterpart.

## Custom analyzers

If needed, you can combine tokenizers, token filters, and character filters to create a custom analyzer.

## Text analysis at indexing time and query time

OpenSearch performs text analysis on text fields when you index a document and when you send a search request. Depending on the time of text analysis, the analyzers used for it are classified as follows:

- An _index analyzer_ performs analysis at indexing time: When you are indexing a [text]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/text/) field, OpenSearch analyzes it before indexing it. For more information about ways to specify index analyzers, see [Index analyzers]({{site.url}}{{site.baseurl}}/analyzers/index-analyzers/).

- A _search analyzer_ performs analysis at query time: OpenSearch analyzes the query string when you run a full-text query on a text field. For more information about ways to specify search analyzers, see [Search analyzers]({{site.url}}{{site.baseurl}}/analyzers/search-analyzers/).

In most cases, you should use the same analyzer at both indexing and search time because the text field and the query string will be analyzed in the same way and the resulting tokens will match as expected.
{: .tip}

### Example

When you index a document that has a text field with the text `Actions speak louder than words`, OpenSearch analyzes the text and produces the following list of tokens: 

Text field tokens = [`action`, `speak`, `loud`, `than`, `word`]

When you search for documents that match the query `speaking loudly`, OpenSearch analyzes the query string and produces the following list of tokens:

Query string tokens = [`speak`, `loud`]

Then OpenSearch compares each token in the query string against the list of text field tokens and finds that both lists contain the tokens `speak` and `loud`, so OpenSearch returns this document as part of the search results that match the query.

## Testing an analyzer

To test a built-in analyzer and view the list of tokens it generates when a document is indexed, you can use the [Analyze API]({{site.url}}{{site.baseurl}}/api-reference/analyze-apis/#apply-a-built-in-analyzer).

Specify the analyzer and the text to be analyzed in the request:

```json
GET /_analyze
{
  "analyzer" : "standard",
  "text" : "Let’s contribute to OpenSearch!"
}
```
{% include copy-curl.html %}

The following image shows the query string.

![Query string with indices]({{site.url}}{{site.baseurl}}/images/string-indices.png)

The response contains each token and its start and end offsets that correspond to the starting index in the original string (inclusive) and the ending index (exclusive):

```json
{
  "tokens": [
    {
      "token": "let’s",
      "start_offset": 0,
      "end_offset": 5,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "contribute",
      "start_offset": 6,
      "end_offset": 16,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "to",
      "start_offset": 17,
      "end_offset": 19,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "opensearch",
      "start_offset": 20,
      "end_offset": 30,
      "type": "<ALPHANUM>",
      "position": 3
    }
  ]
}
```

## Verifying analyzer settings

To verify which analyzer is associated with which field, you can use the get mapping API operation:

```json
GET /testindex/_mapping
```
{% include copy-curl.html %}

The response provides information about the analyzers for each field:

```json
{
  "testindex": {
    "mappings": {
      "properties": {
        "text_entry": {
          "type": "text",
          "analyzer": "simple",
          "search_analyzer": "whitespace"
        }
      }
    }
  }
}
```

## Next steps

- Learn more about specifying [index analyzers]({{site.url}}{{site.baseurl}}/analyzers/index-analyzers/) and [search analyzers]({{site.url}}{{site.baseurl}}/analyzers/search-analyzers/).