---
layout: default
title: Specialized vector search
nav_order: 50
has_children: true
has_toc: false
redirect_from:
  - /vector-search/specialized-operations/
cards:
  - heading: "Vector search with filters"
    description: "Apply filtering at various stages of your vector search"
    link: "/vector-search/specialized-operations/filter-search-knn/"
  - heading: "Nested field vector search"
    description: "Use vector search to search nested fields"
    link: "/vector-search/specialized-operations/nested-search-knn/"
  - heading: "Radial search"
    description: "Search all points within a vector space that reside within a specified maximum distance or minimum score threshold from a query point."
    link: "/vector-search/specialized-operations/radial-search-knn/"
---

# Specialized vector search

OpenSearch supports the following specialized vector search applications. 

{% include cards.html cards=page.cards %}