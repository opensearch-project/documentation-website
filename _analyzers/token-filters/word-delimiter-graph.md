---
layout: default
title: Word delimiter graph
parent: Token filters
nav_order: 480
---

# Word delimiter graph token filter

The `word_delimiter_graph` token filter is used to split tokens at predefined characters, while also offering optional token normalization based on customizable rules.

It's important **not** to use tokenizers that strip punctuation, like the `standard` tokenizer, with this filter. Doing so may prevent proper token splitting and interfere with options like `catenate_all` or `preserve_original`. Instead, it's recommended to use the `keyword` or `whitespace` tokenizer.
{: .note}

## Parameters

You can configure the `word_delimiter_graph` token filter using the following parameters:

- `adjust_offsets`: Adjusts the token offsets for better accuracy. If your analyzer uses filters that change the length of tokens without changing their offsets, such as  `trim`, setting this parameter to `false` is recommended. Default is `true`. (Boolean, _Optional_)

- `catenate_all`: Produces concatenated tokens from a sequence of alphanumeric parts. For example, `"quick-fast-200"` becomes `[ quickfast200, quick, fast, 200 ]`. Default is `false`. (Boolean, _Optional_)

- `catenate_numbers`: Combines numerical sequences, such as `"10-20-30"` turning into `[ 102030, 10, 20, 30 ]`. Default is `false`. (Boolean, _Optional_)

- `catenate_words`: Concatenates alphabetic words. For example `"high-speed-level"` becomes `[ highspeedlevel, high, speed, level ]`. Default is `false`. (Boolean, _Optional_)

- `generate_number_parts`: Controls whether numeric tokens are generated separately. Default is `true`. (Boolean, _Optional_)

- `generate_word_parts`: Specifies whether alphabetical tokens should be generated. Default is `true`. (Boolean, _Optional_)

- `ignore_keywords`: Skips over tokens marked as keywords. Default is `false`. (Boolean, _Optional_)

- `preserve_original`: Keeps the original, unsplit token alongside the generated tokens. For example `"auto-drive-300"` will result in `[ auto-drive-300, auto, drive, 300 ]`. Default is `false`. (Boolean, _Optional_)

- `protected_words`: Specifies tokens that the filter should not split. (Array, _Optional_)

- `protected_words_path`: Specifies a path (absolute or relating to config directory) to a file containing tokens separated by new line which should not be split. (string, _Optional_)

- `split_on_case_change`: Splits tokens when there is a transition between lowercase and uppercase letters. Default is `true`. (Boolean, _Optional_)

- `split_on_numerics`: Splits tokens where letters and numbers meet. For example `"v8engine"` will become `[ v, 8, engine ]`. Default is `true`. (Boolean, _Optional_)

- `stem_english_possessive`: Removes English possessive endings such as `"'s."` Default is `true`. (Boolean, _Optional_)

- `type_table`: Custom mappings can be provided for characters to treat them as alphanumeric or numeric, which avoids unwanted splitting. For example: `["- => ALPHA"]`. (Array of strings, _Optional_)


## Example

The following example request creates a new index named `my-custom-index` and configures an analyzer with `word_delimiter_graph` filter:

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
