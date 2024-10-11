---
layout: default
title: Scope of the plugin
nav_order: 20
parent: Learning to Rank
has_children: false
---

# Scope of the plugin

The Learning to Rank plugin for OpenSearch provides tool to help you develop and use machine learning-based ranking models for your application search. The following sections describe how the plugin fits into the overall LTR process.

## What the plugin does

This plugin gives you building blocks to develop and use LTR models. It allows you to: 

1. **Develop query-dependent features:** Create custom features that capture the relationship between a search query and a document. These features can be stored in OpenSearch.
2. **Log feature values:** Record the feature values for documents return in search results. Once you have logged the feature sets for your documents, you can combine this data with the judgment lists you have developed. This will give you a complete training set that you can use to test and train your ranking models. Tools such as RankLib or XGBoost can then be used to develop a satisfactory model.
3. **Deploy and use models:** Upload trained ranking models to the plugin and use them to rerank search results. The plugin offers a custom OpenSearch Query DSL primitive that allows you to execute the model during the search process.

## What the plugin does not do

The plugin does not help with creating judgment lists, which is a task you must handle yourself, as it can be highly domain-speific. See the [Wikimedia Foundation blog](https://blog.wikimedia.org/2017/09/19/search-relevance-survey/) for an example of an approach to developing judgment lists for people searching their articles. Other domains, such as e-commerce, may focus more on conversion-related signals, while some may involve human relevance assessors, either internal experts or crowdsourced workers.

The plugin does not handle the training or testing of models. This is an offline process that should be handled using the appropriate tools, such as XGboost and RankLib. The plugin integrates with these external model-building workflows. Training and testing ranking models can be a CPU-intensive task that requires data scientist expertise and offline testing. Most organizations prefer to have data scientists oversee the model development process, rather than running it directly in their production environment.

## Next steps

Learn about [Working with features]({{site.url}}{{site.baseurl}}/search-plugins/ltr/working-with-features/).
