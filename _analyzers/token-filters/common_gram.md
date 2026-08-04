---
layout: default
title: Common grams
parent: Token filters
nav_order: 60
canonical_url: https://docs.opensearch.org/latest/analyzers/token-filters/common_gram/
---
<!-- vale off -->
# Common grams token filter
<!-- vale on -->
The `common_grams` token filter improves search relevance by keeping commonly occurring phrases (common grams) in the text. This is useful when dealing with languages or datasets in which certain word combinations frequently occur as a unit and can impact search relevance if treated as separate tokens. If any common words are present in the input string, this token filter generates both their unigrams and bigrams.

Using this token filter improves search relevance by keeping common phrases intact. This can help in matching queries more accurately, particularly for frequent word combinations. It also improves search precision by reducing the number of irrelevant matches.

When using this filter, you must carefully select and maintain the `common_words` list.
{: .warning}

## Parameters

The `common_grams` token filter can be configured with the following parameters.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :--- 
`common_words` | Required | List of strings | A list of words that should be treated as words that commonly appear together. These words will be used to generate common grams. If the `common_words` parameter is an empty list, the `common_grams` token filter becomes a no-op filter, meaning that it doesn't modify the input tokens at all.
`ignore_case` | Optional | Boolean |  Indicates whether the filter should ignore case differences when matching common words. Default is `false`.
`query_mode` | Optional | Boolean | When set to `true`, the following rules are applied:<br>- Unigrams that are generated from `common_words` are not included in the output.<br>- Bigrams in which a non-common word is followed by a common word are retained in the output.<br>- Unigrams of non-common words are excluded if they are immediately followed by a common word.<br>- If a non-common word appears at the end of the text and is preceded by a common word, its unigram is not included in the output.


## Example

The following example request creates a new index named `my_common_grams_index` and configures an analyzer with the `common_grams` filter:

```json
PUT /my_common_grams_index
{
  "settings": {
    "analysis": {
      "filter": {
        "my_common_grams_filter": {
          "type": "common_grams",
          "common_words": ["a", "in", "for"],
          "ignore_case": true,
          "query_mode": true
        }
      },
      "analyzer": {
        "my_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "my_common_grams_filter"
          ]
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
GET /my_common_grams_index/_analyze
{
  "analyzer": "my_analyzer",
  "text": "A quick black cat jumps over the lazy dog in the park"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {"token": "a_quick","start_offset": 0,"end_offset": 7,"type": "gram","position": 0},
    {"token": "quick","start_offset": 2,"end_offset": 7,"type": "<ALPHANUM>","position": 1},
    {"token": "black","start_offset": 8,"end_offset": 13,"type": "<ALPHANUM>","position": 2},
    {"token": "cat","start_offset": 14,"end_offset": 17,"type": "<ALPHANUM>","position": 3},
    {"token": "jumps","start_offset": 18,"end_offset": 23,"type": "<ALPHANUM>","position": 4},
    {"token": "over","start_offset": 24,"end_offset": 28,"type": "<ALPHANUM>","position": 5},
    {"token": "the","start_offset": 29,"end_offset": 32,"type": "<ALPHANUM>","position": 6},
    {"token": "lazy","start_offset": 33,"end_offset": 37,"type": "<ALPHANUM>","position": 7},
    {"token": "dog_in","start_offset": 38,"end_offset": 44,"type": "gram","position": 8},
    {"token": "in_the","start_offset": 42,"end_offset": 48,"type": "gram","position": 9},
    {"token": "the","start_offset": 45,"end_offset": 48,"type": "<ALPHANUM>","position": 10},
    {"token": "park","start_offset": 49,"end_offset": 53,"type": "<ALPHANUM>","position": 11}
  ]
}
```

