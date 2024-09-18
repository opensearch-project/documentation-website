---
layout: default
title: Character Filters
nav_order: 90
has_children: true
has_toc: false
---

# Character filters

Character filters process the text before tokenization, modifying or cleaning the input to prepare it for further analysis. 

Unlike token filters, which operate on tokens (words or terms), character filters work on the raw input text before tokenization. They are especially useful for cleaning or transforming structured text with unwanted characters, like HTML tags or special symbols. Character filters help strip or replace these elements, ensuring the text is properly formatted for analysis.

Use cases for character filters include:
## HTML stripping
Removing HTML tags from content, ensuring only the visible text is indexed. See [HTML stripping]({{site.url}}{{site.baseurl}}/analyzers/html-character-filter) for more information.

## Pattern replacement
Replacing or removing unwanted characters or patterns in text (e.g., converting hyphens to spaces
## Custom mappings
Substituting specific characters or sequences with other values, such as converting currency symbols into their textual equivalents.

