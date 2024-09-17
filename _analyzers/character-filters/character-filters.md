---
layout: default
title: Character Filters
nav_order: 90
---

# Character filters

Character filters process the text before tokenization, modifying or cleaning the input to prepare it for further analysis. 

Unlike token filters, which operate on tokens (words or terms), character filters work on the raw input text before tokenization. They are especially useful for cleaning or transforming structured text with unwanted characters, like HTML tags or special symbols. Character filters help strip or replace these elements, ensuring the text is properly formatted for analysis.

Use cases for character filters include:
1. **HTML stripping:** Removing HTML tags from content, ensuring only the visible text is indexed.
2. **Pattern replacement:** Replacing or removing unwanted characters or patterns in text (e.g., converting hyphens to spaces).
3. **Custom mappings:** Substituting specific characters or sequences with other values, such as converting currency symbols into their textual equivalents.

