---
layout: default
title: HTML strip
parent: Character filters
nav_order: 100
---

# HTML strip character filter

The `html_strip` character filter removes HTML tags, such as `<div>`, `<p>`, and `<a>`, from the input text and renders plain text. The filter can be configured to preserve certain tags or decode specific HTML entities, such as `&nbsp;`, into spaces.

## Example

The following request applies an `html_strip` character filter to the provided text:

```json
GET /_analyze
{
  "tokenizer": "keyword",
  "char_filter": [
    "html_strip"
  ],
  "text": "<p>Commonly used calculus symbols include &alpha;, &beta; and &theta; </p>"
}
```
{% include copy-curl.html %}

The response contains the token in which HTML characters have been converted to their decoded values:

```json
{
  "tokens": [
    {
      "token": """
Commonly used calculus symbols include α, β and θ 
""",
      "start_offset": 0,
      "end_offset": 74,
      "type": "word",
      "position": 0
    }
  ]
}
```

## Parameters

The `html_strip` character filter can be configured with the following parameter.

| Parameter       | Required/Optional | Data type | Description    |
|:---|:---|:---|:---|
| `escaped_tags` | Optional | Array of strings | An array of HTML element names, specified without the enclosing angle brackets (`< >`). The filter does not remove elements in this list when stripping HTML from the text. For example, setting the array to `["b", "i"]` will prevent the `<b>` and `<i>` elements from being stripped.|

## Example: Custom analyzer with lowercase filter

The following example request creates a custom analyzer that strips HTML tags and converts the plain text to lowercase by using the `html_strip` analyzer and `lowercase` filter:

```json
PUT /html_strip_and_lowercase_analyzer
{
  "settings": {
    "analysis": {
      "char_filter": {
        "html_filter": {
          "type": "html_strip"
        }
      },
      "analyzer": {
        "html_strip_analyzer": {
          "type": "custom",
          "char_filter": ["html_filter"],
          "tokenizer": "standard",
          "filter": ["lowercase"]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Use the following request to examine the tokens generated using the analyzer:

```json
GET /html_strip_and_lowercase_analyzer/_analyze
{
  "analyzer": "html_strip_analyzer",
  "text": "<h1>Welcome to <strong>OpenSearch</strong>!</h1>"
}
```
{% include copy-curl.html %}

In the response, the HTML tags have been removed and the plain text has been converted to lowercase:

```json
{
  "tokens": [
    {
      "token": "welcome",
      "start_offset": 4,
      "end_offset": 11,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "to",
      "start_offset": 12,
      "end_offset": 14,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "opensearch",
      "start_offset": 23,
      "end_offset": 42,
      "type": "<ALPHANUM>",
      "position": 2
    }
  ]
}
```

## Example: Custom analyzer that preserves HTML tags

The following example request creates a custom analyzer that preserves HTML tags:

```json
PUT /html_strip_preserve_analyzer
{
  "settings": {
    "analysis": {
      "char_filter": {
        "html_filter": {
          "type": "html_strip",
          "escaped_tags": ["b", "i"]
        }
      },
      "analyzer": {
        "html_strip_analyzer": {
          "type": "custom",
          "char_filter": ["html_filter"],
          "tokenizer": "keyword"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Use the following request to examine the tokens generated using the analyzer:

```json
GET /html_strip_preserve_analyzer/_analyze
{
  "analyzer": "html_strip_analyzer",
  "text": "<p>This is a <b>bold</b> and <i>italic</i> text.</p>"
}
```
{% include copy-curl.html %}

In the response, the `italic` and `bold` tags have been retained, as specified in the custom analyzer request:

```json
{
  "tokens": [
    {
      "token": """
This is a <b>bold</b> and <i>italic</i> text.
""",
      "start_offset": 0,
      "end_offset": 52,
      "type": "word",
      "position": 0
    }
  ]
}
```
