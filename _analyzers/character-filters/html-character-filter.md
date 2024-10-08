---
layout: default
title: html_strip character filter
parent: Character filters
nav_order: 100
---

# `html_strip` character filter

The `html_strip` character filter removes HTML tags, such as `<div>`, `<p>`, and `<a>`, from the input text and renders plain text. The filter can be configured to preserve certain tags or decode specific HTML entities, such as `&nbsp;`, into spaces.

## Example: HTML analyzer

```
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

Using the HTML analyzer, you can convert the HTML character entity references into their corresponding symbols. The returned processed text would read as follows:

```
Commonly used calculus symbols include α, β and θ 
```

## Example: Custom analyzer with lowercase filter

The following example query creates a custom analyzer that strips HTML tags and converts the plain text to lowercase by using the `html_strip` analyzer and `lowercase` filter.

```
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

### Testing `html_strip_and_lowercase_analyzer`

You can run the following request to test the analyzer:

```
GET /html_strip_and_lowercase_analyzer/_analyze
{
  "analyzer": "html_strip_analyzer",
  "text": "<h1>Welcome to <strong>OpenSearch</strong>!</h1>"
}
```
{% include copy-curl.html %}

The following response shows that the HTML tags have been removed and the plain text is lowercase:

```
welcome to opensearch!
```

## Example: Custom analyzer preserving HTML tags

The following example request creates a custom analyzer that preserves HTML tags:

```
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

### Testing `html_strip_preserve_analyzer`  

You can run the following request to test the analyzer:

```
GET /html_strip_preserve_analyzer/_analyze
{
  "analyzer": "html_strip_analyzer",
  "text": "<p>This is a <b>bold</b> and <i>italic</i> text.</p>"
}
```
{% include copy-curl.html %}

The following response shows that the `italic` and `bold` tags have been retained as specified in the custom analyzer request:

```
This is a <b>bold</b> and <i>italic</i> text.
```
