---
layout: default
title: Using collapse with a hybrid query
parent: Hybrid search
grand_parent: AI search
has_children: false
nav_order: 10
---

# Using collapse with hybrid query
**Introduced 3.1**
{: .label .label-purple }

You can [collapse](https://docs.opensearch.org/docs/latest/search-plugins/collapse-search/) on a field by specifying the collapse parameter in the search query.
This will return the highest scoring document for each unique value of that field, up to the specified size.

Note: Inner hits compatibility within the collapse parameter is not currently supported for hybrid query.
