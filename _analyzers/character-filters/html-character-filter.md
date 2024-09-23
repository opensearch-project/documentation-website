---
layout: default
title: HTML Character Filter
parent: Character Filters
nav_order: 100
---

# HTML strip character filter
The `html_strip` character filter removes HTML elements from the input text, and generating the visible text with the tags rendered.

The `html_strip` character filter identifies and removes all HTML tags, such as `<div>`, `<p>`, and `<a>`, from the input text. The filter can also be configured to preserve certain tags or decode specific HTML entities like `&nbsp;` into spaces.

## Example of the HTML analyzer
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
Using the HTML analyzer, we can convert the HTML character entity references into their corresponding symbols. The returned processed text would read:

```
Commonly used calculus symbols include α, β and θ 
```

## Example of a custom analyzer 

Let's create a custom analyzer that strips HTML tags and then converts the remaining text to lowercase using the `html_strip` analyszer and `lowercase` filter.
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
### Testing our `html_strip_and_lowercase_analyzer`
```
GET /html_strip_and_lowercase_analyzer/_analyze
{
  "analyzer": "html_strip_analyzer",
  "text": "<h1>Welcome to <strong>OpenSearch</strong>!</h1>"
}
```
Gives the result
```
welcome to opensearch!
```
The HTML tags have been removed and the output is in lowercase.

## Example of a custom analyzer preserving HTML tags
Let's create our custom analyzer
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
### Testing the `html_strip_preserve_analyzer`  
```
GET /html_strip_preserve_analyzer/_analyze
{
  "analyzer": "html_strip_analyzer",
  "text": "<p>This is a <b>bold</b> and <i>italic</i> text.</p>"
}

```
We get the results as seen. The italic and bold tags have been retained as we specified this in our custom analyzer.
```
This is a <b>bold</b> and <i>italic</i> text.
```
