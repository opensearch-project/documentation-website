---
layout: default
title: Learning to Rank
parent: Optimizing search quality
nav_order: 40
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

## Documentation

### Core concepts and setup
- [Core concepts]({{site.url}}{{site.baseurl}}/search-plugins/ltr/core-concepts/): Understand the fundamental concepts behind Learning to Rank.
- [Fits in]({{site.url}}{{site.baseurl}}/search-plugins/ltr/fits-in/): Learn how LTR integrates with your OpenSearch infrastructure.

### Feature engineering and model development
- [Feature engineering]({{site.url}}{{site.baseurl}}/search-plugins/ltr/feature-engineering/): Design effective features for your ranking models.
- [Working with features]({{site.url}}{{site.baseurl}}/search-plugins/ltr/working-with-features/): Create and manage feature sets.
- [Logging features]({{site.url}}{{site.baseurl}}/search-plugins/ltr/logging-features/): Collect feature data for model training.
- [Training models]({{site.url}}{{site.baseurl}}/search-plugins/ltr/training-models/): Build and train your ranking models.

### Deployment and advanced topics
- [Searching with your model]({{site.url}}{{site.baseurl}}/search-plugins/ltr/searching-with-your-model/): Deploy models in production search.
- [Advanced functionality]({{site.url}}{{site.baseurl}}/search-plugins/ltr/advanced-functionality/): Explore advanced LTR features and techniques.
- [FAQ]({{site.url}}{{site.baseurl}}/search-plugins/ltr/faq/): Common questions and troubleshooting.
