---
layout: default
title: Pattern replace
parent: Character filters
nav_order: 130
canonical_url: https://docs.opensearch.org/latest/analyzers/character-filters/pattern-replace-character-filter/
---

# Pattern replace character filter

The `pattern_replace` character filter allows you to use regular expressions to define patterns for matching and replacing characters in the input text. It is a flexible tool for advanced text transformations, especially when dealing with complex string patterns.

This filter replaces all instances of a pattern with a specified replacement string, allowing for easy substitutions, deletions, or complex modifications of the input text. You can use it to normalize the input before tokenization.

## Example 

To standardize phone numbers, you'll use the regular expression `[\\s()-]+`:

- `[ ]`: Defines a **character class**, meaning it will match **any one** of the characters inside the brackets.
- `\\s`: Matches any **white space** character, such as a space, tab, or newline.
- `()`: Matches literal **parentheses** (`(` or `)`).
- `-`: Matches a literal **hyphen** (`-`).
- `+`: Specifies that the pattern should match **one or more** occurrences of the preceding characters.

The pattern `[\\s()-]+` will match any sequence of one or more white space characters, parentheses, or hyphens and remove it from the input text. This ensures that the phone numbers are normalized and contain only digits.

The following request standardizes phone numbers by removing spaces, dashes, and parentheses: 

```json
GET /_analyze
{
  "tokenizer": "standard",
  "char_filter": [
    {
      "type": "pattern_replace",
      "pattern": "[\\s()-]+",
      "replacement": ""
    }
  ],
  "text": "(555) 123-4567"
}
```
{% include copy-curl.html %}

The response contains the generated token:

```json
{
  "tokens": [
    {
      "token": "5551234567",
      "start_offset": 1,
      "end_offset": 14,
      "type": "<NUM>",
      "position": 0
    }
  ]
}
```
 
## Parameters

The `pattern_replace` character filter must be configured with the following parameters.

| Parameter   | Required/Optional | Data type | Description    |
|:---|:---|
| `pattern`   | Required | String | A regular expression used to match parts of the input text. The filter identifies and matches this pattern to perform replacement. |
| `replacement` | Optional | String | The string that replaces pattern matches. Use an empty string (`""`) to remove the matched text. Default is an empty string (`""`).   |

## Creating a custom analyzer

The following request creates an index with a custom analyzer configured with a `pattern_replace` character filter. The filter removes currency signs and thousands separators (both European `.` and American `,`) from numbers:

```json
PUT /my_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_analyzer": {
          "tokenizer": "standard",
          "char_filter": [
            "pattern_char_filter"
          ]
        }
      },
      "char_filter": {
        "pattern_char_filter": {
          "type": "pattern_replace",
          "pattern": "[$€,.]",
          "replacement": ""
        }
      }
    }
  }
}
```

{% include copy-curl.html %}

Use the following request to examine the tokens generated using the analyzer:

```json
POST /my_index/_analyze
{
  "analyzer": "my_analyzer",
  "text": "Total: $ 1,200.50 and € 1.100,75"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "Total",
      "start_offset": 0,
      "end_offset": 5,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "120050",
      "start_offset": 9,
      "end_offset": 17,
      "type": "<NUM>",
      "position": 1
    },
    {
      "token": "and",
      "start_offset": 18,
      "end_offset": 21,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "110075",
      "start_offset": 24,
      "end_offset": 32,
      "type": "<NUM>",
      "position": 3
    }
  ]
}
```

## Using capturing groups

You can use capturing groups in the `replacement` parameter. For example, the following request creates a custom analyzer that uses a `pattern_replace` character filter to replace hyphens with dots in phone numbers:

```json
PUT /my_index
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_analyzer": {
          "tokenizer": "standard",
          "char_filter": [
            "pattern_char_filter"
          ]
        }
      },
      "char_filter": {
        "pattern_char_filter": {
          "type": "pattern_replace",
          "pattern": "(\\d+)-(?=\\d)",
          "replacement": "$1."
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Use the following request to examine the tokens generated using the analyzer:

```json
POST /my_index/_analyze
{
  "analyzer": "my_analyzer",
  "text": "Call me at 555-123-4567 or 555-987-6543"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "Call",
      "start_offset": 0,
      "end_offset": 4,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "me",
      "start_offset": 5,
      "end_offset": 7,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "at",
      "start_offset": 8,
      "end_offset": 10,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "555.123.4567",
      "start_offset": 11,
      "end_offset": 23,
      "type": "<NUM>",
      "position": 3
    },
    {
      "token": "or",
      "start_offset": 24,
      "end_offset": 26,
      "type": "<ALPHANUM>",
      "position": 4
    },
    {
      "token": "555.987.6543",
      "start_offset": 27,
      "end_offset": 39,
      "type": "<NUM>",
      "position": 5
    }
  ]
}
```