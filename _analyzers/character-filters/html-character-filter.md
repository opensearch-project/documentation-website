---
layout: default
title: HTML Character Filter
parent: Character Filters
nav_order: 91
---

# HTML strip character filter
The `html_strip` character filter removes HTML elements from the input text, and generating the visible text with the tags rendered.

The `html_strip` character filter identifies and removes all HTML tags, such as `<div>`, `<p>`, and `<a>`, from the input text. The filter can also be configured to preserve certain tags or decode specific HTML entities like `&nbsp;` into spaces.

For example, a document containing:
```html
<p>The <strong>quick</strong> brown fox <a href="#">jumps</a> over the lazy dog.</p>
```
Would be filtered to:
```
The quick brown fox jumps over the lazy dog.
```
This ensures that when tokenization occurs, only the textual content is processed.
