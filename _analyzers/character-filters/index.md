---
layout: default
title: Character filters
nav_order: 90
has_children: true
has_toc: false
redirect_from:
  - /analyzers/character-filters/
---

# Character filters

Character filters process text before tokenization to prepare it for further analysis.

Unlike token filters, which operate on tokens (words or terms), character filters process the raw input text before tokenization. They are especially useful for cleaning or transforming structured text containing unwanted characters, such as HTML tags or special symbols. Character filters help to strip or replace these elements so that text is properly formatted for analysis.

Use cases for character filters include:

- **HTML stripping**: The [`html_strip`]({{site.url}}{{site.baseurl}}/analyzers/character-filters/html-character-filter/) character filter removes HTML tags from content so that only the plain text is indexed.
- **Pattern replacement**: The [`pattern_replace`]({{site.url}}{{site.baseurl}}/analyzers/character-filters/pattern-replace-character-filter/) character filter replaces or removes unwanted characters or patterns in text, for example, converting hyphens to spaces.
- **Custom mappings**: The [`mapping`]({{site.url}}{{site.baseurl}}/analyzers/character-filters/mapping-character-filter/) character filter substitutes specific characters or sequences with other values, for example, to convert currency symbols into their textual equivalents.
