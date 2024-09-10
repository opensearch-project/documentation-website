---
layout: default
title: Character Filters
nav_order: 90
---

# Character filters

Character filters are an essential component of text analysis in OpenSearch. They process the text before tokenization, modifying or cleaning the input to prepare it for further analysis. Unlike token filters, which operate on tokens (words or terms), character filters work directly on the raw input string. They are especially useful when dealing with structured text that may include unwanted characters or patterns, such as HTML tags or special symbols.

Use cases for character filters include:
1. **HTML stripping:** Removing HTML tags from content, ensuring only the visible text is indexed.
2. **Pattern replacement:** Replacing or removing unwanted characters or patterns in text (e.g., converting hyphens to spaces).
3. **Custom mappings:** Substituting specific characters or sequences with other values, such as converting currency symbols into their textual equivalents.

