---
layout: default
title: Path hierarchy
parent: Tokenizers
nav_order: 90
---

# Pattern tokenizer

The `path_hierarchy` tokenizer is designed to tokenize file system-like paths (or similar hierarchical structures) by breaking them down into tokens at each level of the hierarchy. This tokenizer is particularly useful when working with hierarchical data such as file paths, URLs, or any other delimited paths.

## Example usage

The following example request creates a new index named `my_index` and configures an analyzer with `path_hierarchy` tokenizer:

```json
PUT /my_index
{
  "settings": {
    "analysis": {
      "tokenizer": {
        "my_path_tokenizer": {
          "type": "path_hierarchy"
        }
      },
      "analyzer": {
        "my_path_analyzer": {
          "type": "custom",
          "tokenizer": "my_path_tokenizer"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the created analyzer:

```json
POST /my_index/_analyze
{
  "analyzer": "my_path_analyzer",
  "text": "/users/john/documents/report.txt"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "/users",
      "start_offset": 0,
      "end_offset": 6,
      "type": "word",
      "position": 0
    },
    {
      "token": "/users/john",
      "start_offset": 0,
      "end_offset": 11,
      "type": "word",
      "position": 0
    },
    {
      "token": "/users/john/documents",
      "start_offset": 0,
      "end_offset": 21,
      "type": "word",
      "position": 0
    },
    {
      "token": "/users/john/documents/report.txt",
      "start_offset": 0,
      "end_offset": 32,
      "type": "word",
      "position": 0
    }
  ]
}
```

## Configuration

The `path_hierarchy` tokenizer can be configured with the following parameters:

- `delimiter`: specifies the character used to separate path components. Default is `/`. (String, _Optional_)
- `replacement`: configures the character used to replace the delimiter in the tokens. The default is `/`. (String, _Optional_)
- `buffer_size`: specifies the size of the buffer. Default is `1024`. (Integer, _Optional_)
- `reverse`: produces tokens in reverse order if set to `true`. Default is `false`. (Boolean, _Optional_)
- `skip`: specifies the number of initial tokens (levels) to skip when tokenizing. The default is `0`. (Integer, _Optional_)

## Example using custom parameter

The following example configures custom `delimiter` and `replacement`:

```json
PUT /my_index
{
  "settings": {
    "analysis": {
      "tokenizer": {
        "my_path_tokenizer": {
          "type": "path_hierarchy",
          "delimiter": "\\",
          "replacement": "\\"
        }
      },
      "analyzer": {
        "my_path_analyzer": {
          "type": "custom",
          "tokenizer": "my_path_tokenizer"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Generated tokens

Use the following request to examine the tokens generated using the created analyzer:

```json
POST /my_index/_analyze
{
  "analyzer": "my_path_analyzer",
  "text": "C:\\users\\john\\documents\\report.txt"
}
```
{% include copy-curl.html %}

The response contains the generated tokens:

```json
{
  "tokens": [
    {
      "token": "C:",
      "start_offset": 0,
      "end_offset": 2,
      "type": "word",
      "position": 0
    },
    {
      "token": """C:\users""",
      "start_offset": 0,
      "end_offset": 8,
      "type": "word",
      "position": 0
    },
    {
      "token": """C:\users\john""",
      "start_offset": 0,
      "end_offset": 13,
      "type": "word",
      "position": 0
    },
    {
      "token": """C:\users\john\documents""",
      "start_offset": 0,
      "end_offset": 23,
      "type": "word",
      "position": 0
    },
    {
      "token": """C:\users\john\documents\report.txt""",
      "start_offset": 0,
      "end_offset": 34,
      "type": "word",
      "position": 0
    }
  ]
}
```