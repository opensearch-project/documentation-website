---
layout: default
title: Character filters
nav_order: 90
has_children: true
has_toc: false
---

# Character filters

Character filters process text before tokenization to prepare it for further analysis.

Unlike token filters, which operate on tokens (words or terms), character filters process the raw input text before tokenization. They are especially useful for cleaning or transforming structured text containing unwanted characters, such as HTML tags or special symbols. Character filters help to strip or replace these elements so that text is properly formatted for analysis.

Use cases for character filters include:

- **HTML stripping:** Removes HTML tags from content so that only the plain text is indexed.
- **Pattern replacement:** Replaces or removes unwanted characters or patterns in text, for example, converting hyphens to spaces.
- **Custom mappings:** Substitutes specific characters or sequences with other values, for example, to convert currency symbols into their textual equivalents.
