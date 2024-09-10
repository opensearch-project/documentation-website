---
layout: default
title: HTML Character Filter
parent: Character Filters
nav_order: 91
---

# HTML strip character filter
The `html_strip` character filter removes HTML elements from the input text, ensuring that only the visible text is passed for further analysis. This is particularly useful for documents that contain rich formatting, like web pages or emails, where you want to ignore the HTML tags but retain the visible content for indexing and search.

The `html_strip` character filter identifies and removes all HTML tags, such as <div>, <p>, and <a>, from the input text. It allows the document content to be analyzed without being affected by HTML markup. The filter can also be configured to preserve certain tags or decode specific HTML entities like &nbsp; into spaces.

For example, a document containing:
```html
<p>The <strong>quick</strong> brown fox <a href="#">jumps</a> over the lazy dog.</p>
```
Would be filtered to:
```
The quick brown fox jumps over the lazy dog.
```
This ensures that when tokenization occurs, only the textual content is processed.
