---
layout: default
title: Learning to Rank
nav_order: 20
has_children: true
has_toc: false
redirect_from:
  - /search-plugins/ltr/
---

# Learning to Rank

The Learning to Rank plugin for OpenSearch enables you to use machine learning (ML) and behavioral data to fine-tune the relevance of documents. It uses models from the [XGBoost](https://xgboost.ai/) and [RankLib](https://lemurproject.org/ranklib.php) libraries. These models rescore the search results, considering query-dependent features such as click-through data or field matches, which can further improve relevance.

The term _learning to rank_ is abbreviated as LTR throughout the OpenSearch documentation when the term is used in a general sense. For the plugin developer documentation, see [opensearch-learning-to-rank-base](https://github.com/opensearch-project/opensearch-learning-to-rank-base).
{: .note} 

## Getting started

The following resources can help you get started:

- If you are new to LTR, start with the [ML ranking core concepts]({{site.url}}{{site.baseurl}}/search-plugins/ltr/core-concepts/) documentation.
- For a quick introduction, see the demo in [hello-ltr](https://github.com/o19s/hello-ltr).
- If you are familiar with LTR, start with the [Integrating the plugin]({{site.url}}{{site.baseurl}}/search-plugins/ltr/fits-in/) documentation.
