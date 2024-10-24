---
layout: default
title: Scope of the plugin
nav_order: 20
parent: Learning to Rank
has_children: false
---

# Scope of the plugin

The Learning to Rank plugin for OpenSearch helps you develop and use machine learning (ML)-based ranking models for your application search operations. The following sections describe how the plugin fits into the overall LTR process.

## What the plugin does

The plugin provides the building blocks to develop and use LTR models, giving you the following capabilities: 

1. **Developing query-dependent features:** Create custom features that capture the relationship between a search query and a document. These features can be stored in OpenSearch.
2. **Logging feature values:** Record the feature values for documents returned in search results. Once you have logged the feature sets for your documents, you can combine this data with the judgment lists you have developed. This will give you a complete training set that you can use to test and train your ranking models. Tools such as RankLib or XGBoost can then be used to develop a satisfactory model.
3. **Deploying and using models:** Upload trained ranking models to the plugin and use them to rerank search results. The plugin offers a custom OpenSearch query domain-specific language (DSL) primitive that allows you to execute the model during the search process.

## What the plugin does not do

The plugin does not support the creation of judgment lists. This is a task you must handle yourself because it is domain specific. See the [Wikimedia Foundation blog](https://blog.wikimedia.org/2017/09/19/search-relevance-survey/) for an example approach to developing judgment lists for searching articles. Some domains, such as e-commerce, may focus more on conversion-related signals, while others may involve human relevance assessors (either internal experts or crowdsourced workers).

The plugin does not handle model training or testing. This is an offline process that should be handled using the appropriate tools, such as [XGBoost](https://xgboost.ai/) and [RankLib](https://lemurproject.org/ranklib.php). The plugin integrates with these external model-building workflows. Training and testing ranking models can be a CPU-intensive task that requires data science expertise and offline testing. Most organizations prefer to have data scientists oversee the model development process rather than running it directly in their production environment.

## Next steps

Learn about [working with features]({{site.url}}{{site.baseurl}}/search-plugins/ltr/working-with-features/).
