---
layout: default
title: Machine learning
nav_order: 1
has_children: false
has_toc: false
nav_exclude: true
permalink: /machine-learning/
redirect_from: 
  - /ml-commons-plugin/
  - /ml-commons-plugin/index/
  - /machine-learning/index/
  - /machine-learning/
---

# Machine learning

The [ML Commons plugin](https://github.com/opensearch-project/ml-commons/) provides machine learning (ML) features in OpenSearch. 

## Integrating ML models

For ML-model-powered search, you can use a pretrained model provided by OpenSearch, upload your own model to the OpenSearch cluster, or connect to a foundation model hosted on an external platform. In OpenSearch version 2.9 and later, you can integrate local and external models simultaneously within a single cluster.

For more information, see [Integrating ML models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/integrating-ml-models/).

## Managing ML models in OpenSearch Dashboards

Administrators of ML clusters can use OpenSearch Dashboards to review and manage the status of ML models running inside a cluster. For more information, see [Managing ML models in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/ml-commons-plugin/ml-dashboard/).

## Support for algorithms

ML Commons supports various algorithms to help train ML models and make predictions or test data-driven predictions without a model. For more information, see [Supported algorithms]({{site.url}}{{site.baseurl}}/ml-commons-plugin/algorithms/).

## ML Commons API

ML Commons provides its own set of REST APIs. For more information, see [ML Commons API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/index/). 