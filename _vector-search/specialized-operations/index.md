---
layout: default
title: Specialized vector search
nav_order: 50
has_children: true
has_toc: false
redirect_from:
  - /vector-search/specialized-operations/
cards:
  - heading: "Nested field vector search"
    description: "Use vector search to search nested fields"
    link: "/vector-search/specialized-operations/nested-search-knn/"
  - heading: "Radial search"
    description: "Search all points in a vector space that reside within a specified maximum distance or minimum score threshold from a query point"
    link: "/vector-search/specialized-operations/radial-search-knn/"
  - heading: "Vector search with MMR"
    description: "Use vector search with maximal marginal relevance(mmr) re-rank."
    link: "/vector-search/specialized-operations/vector-search-mmr/"
---

# Specialized vector search

OpenSearch supports the following specialized vector search applications. 

{% include cards.html cards=page.cards %}