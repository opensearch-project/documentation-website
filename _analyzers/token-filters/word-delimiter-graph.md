---
layout: default
title: Word delimiter graph
parent: Token filters
nav_order: 480
canonical_url: https://docs.opensearch.org/latest/analyzers/token-filters/word-delimiter-graph/
---

# Word delimiter graph token filter

The `word_delimiter_graph` token filter is used to splits token on predefined characters and also offers optional token normalization based on customizable rules.

The `word_delimiter_graph` filter is used to remove punctuation from complex identifiers like part numbers or product IDs. In such cases, it is best used with the `keyword` tokenizer. For hyphenated words, use the `synonym_graph` token filter instead of the `word_delimiter_graph` filter because users frequently search for these terms both with and without hyphens.
{: .note}

By default, the filter applies the following rules.

| Description   | Input  | Output |
|:---|:---|:---|
| Treats non-alphanumeric characters as delimiters.  | `ultra-fast`    | `ultra`, `fast`   |
| Removes delimiters at the beginning or end of tokens.    | `Z99++'Decoder'`| `Z99`, `Decoder`  |
| Splits tokens when there is a transition between uppercase and lowercase letters. | `OpenSearch`    | `Open`, `Search`  |
| Splits tokens when there is a transition between letters and numbers.  | `T1000`         | `T`, `1000`   |
| Removes the possessive ('s) from the end of tokens.  | `John's`        | `John`  |

It's important **not** to use tokenizers that strip punctuation, like the `standard` tokenizer, with this filter. Doing so may prevent proper token splitting and interfere with options like `catenate_all` or `preserve_original`. We recommend using this filter with a `keyword` or `whitespace` tokenizer.
{: .important}

## Parameters

You can configure the `word_delimiter_graph` token filter using the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`adjust_offsets` | Optional | Boolean | Determines whether the token offsets should be recalculated for split or concatenated tokens. When `true`, the filter adjusts the token offsets to accurately represent the token's position within the token stream. This adjustment ensures that the token's location in the text aligns with its modified form after processing, which is particularly useful for applications like highlighting or phrase queries. When `false`, the offsets remain unchanged, which may result in misalignment when the processed tokens are mapped back to their positions in the original text. If your analyzer uses filters like `trim` that change the token lengths without changing their offsets, we recommend setting this parameter to `false`. Default is `true`.
`catenate_all` | Optional | Boolean | Produces concatenated tokens from a sequence of alphanumeric parts. For example, `"quick-fast-200"` becomes `[ quickfast200, quick, fast, 200 ]`. Default is `false`.
`catenate_numbers` | Optional | Boolean | Concatenates numerical sequences. For example, `"10-20-30"` becomes `[ 102030, 10, 20, 30 ]`. Default is `false`.
`catenate_words` | Optional | Boolean | Concatenates alphabetic words. For example, `"high-speed-level"` becomes `[ highspeedlevel, high, speed, level ]`. Default is `false`. 
`generate_number_parts` | Optional | Boolean | If `true`, numeric tokens (tokens consisting of numbers only) are included in the output. Default is `true`.
`generate_word_parts` | Optional | Boolean | If `true`, alphabetical tokens (tokens consisting of alphabetic characters only) are included in the output. Default is `true`.
`ignore_keywords` | Optional | Boolean | Whether to process tokens marked as keywords. Default is `false`.
`preserve_original` | Optional | Boolean | Keeps the original token (which may include non-alphanumeric delimiters) alongside the generated tokens in the output. For example, `"auto-drive-300"` becomes `[ auto-drive-300, auto, drive, 300 ]`. If `true`, the filter generates multi-position tokens not supported by indexing, so do not use this filter in an index analyzer or use the `flatten_graph` filter after this filter. Default is `false`. 
`protected_words` | Optional | Array of strings | Specifies tokens that should not be split.
`protected_words_path` | Optional | String | Specifies a path (absolute or relative to the config directory) to a file containing tokens that should not be separated by new lines.
`split_on_case_change` | Optional | Boolean | Splits tokens where consecutive letters have different cases (one is lowercase and the other is uppercase). For example, `"OpenSearch"` becomes `[ Open, Search ]`. Default is `true`.
`split_on_numerics` | Optional | Boolean | Splits tokens where there are consecutive letters and numbers. For example `"v8engine"` will become `[ v, 8, engine ]`. Default is `true`.
`stem_english_possessive` | Optional | Boolean | Removes English possessive endings, such as `'s`. Default is `true`.
`type_table` | Optional | Array of strings | A custom map that specifies how to treat characters and whether to treat them as delimiters, which avoids unwanted splitting. For example, to treat a hyphen (`-`) as an alphanumeric character, specify `["- => ALPHA"]` so that words are not split on hyphens. Valid types are: <br> - `ALPHA`: alphabetical <br> - `ALPHANUM`: alphanumeric <br> - `DIGIT`: numeric <br> - `LOWER`: lowercase alphabetical <br> - `SUBWORD_DELIM`: non-alphanumeric delimiter <br> - `UPPER`: uppercase alphabetical
`type_table_path` | Optional | String | Specifies a path (absolute or relative to the config directory) to a file containing a custom character map. The map specifies how to treat characters and whether to treat them as delimiters, which avoids unwanted splitting. For valid types, see `type_table`.

## Example

The following example request creates a new index named `my-custom-index` and configures an analyzer with a `word_delimiter_graph` filter:

```json
PUT /my-custom-index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "custom_analyzer": {
          "tokenizer": "keyword",
          "filter": [ "custom_word_delimiter_filter" ]
        }
      },
      "filter": {
        "custom_word_delimiter_filter": {
          "type": "word_delimiter_graph",
          "split_on_case_change": true,
          "split_on_numerics": true,
          "stem_english_possessive": true
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the analyzer:

```json
GET /my-custom-index/_analyze
{
  "analyzer": "custom_analyzer",
  "text": "FastCar's Model2023"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "Fast",
      "start_offset": 0,
      "end_offset": 4,
      "type": "word",
      "position": 0
    },
    {
      "token": "Car",
      "start_offset": 4,
      "end_offset": 7,
      "type": "word",
      "position": 1
    },
    {
      "token": "Model",
      "start_offset": 10,
      "end_offset": 15,
      "type": "word",
      "position": 2
    },
    {
      "token": "2023",
      "start_offset": 15,
      "end_offset": 19,
      "type": "word",
      "position": 3
    }
  ]
}   
```

<!-- vale off-->
## Differences between the word_delimiter_graph and word_delimiter filters
<!-- vale on-->

Both the `word_delimiter_graph` and `word_delimiter` token filters generate tokens spanning multiple positions when any of the following parameters are set to `true`:

- `catenate_all`  
- `catenate_numbers`  
- `catenate_words`  
- `preserve_original`  

To illustrate the differences between these filters, consider the input text `Pro-XT500`.

<!-- vale off-->
### word_delimiter_graph
<!-- vale on-->

The `word_delimiter_graph` filter assigns a `positionLength` attribute to multi-position tokens, indicating how many positions a token spans. This ensures that the filter always generates valid token graphs, making it suitable for use in advanced token graph scenarios. Although token graphs with multi-position tokens are not supported for indexing, they can still be useful in search scenarios. For example, queries like `match_phrase` can use these graphs to generate multiple subqueries from a single input string. For the example input text, the `word_delimiter_graph` filter generates the following tokens:

- `Pro` (position 1)  
- `XT500` (position 2)  
- `ProXT500` (position 1, `positionLength`: 2)

The `positionLength` attribute the production of a valid graph to be used in advanced queries.

<!-- vale off-->
### word_delimiter
<!-- vale on-->

In contrast, the `word_delimiter` filter does not assign a `positionLength` attribute to multi-position tokens, leading to invalid graphs when these tokens are present. For the example input text, the `word_delimiter` filter generates the following tokens:

- `Pro` (position 1)  
- `XT500` (position 2)  
- `ProXT500` (position 1, no `positionLength`)

The lack of a `positionLength` attribute results in a token graph that is invalid for token streams containing multi-position tokens.