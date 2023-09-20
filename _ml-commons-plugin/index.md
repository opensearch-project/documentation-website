---
layout: default
title: About ML Commons
nav_order: 1
has_children: false
has_toc: false
nav_exclude: true
---

# ML Commons plugin

ML Commons for OpenSearch eases the development of machine learning features by providing a set of common machine learning (ML) algorithms through transport and REST API calls. Those calls choose the right nodes and resources for each ML request and monitors ML tasks to ensure uptime. This allows you to leverage existing open-source ML algorithms and reduce the effort required to develop new ML features.

Interaction with the ML Commons plugin occurs through either the [REST API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api) or [`ad`]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/functions#ad) and [`kmeans`]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/functions#kmeans) Piped Processing Language (PPL) commands.

Models [trained]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api#training-the-model) through the ML Commons plugin support model-based algorithms such as k-means. After you've trained a model enough so that it meets your precision requirements, you can apply the model to [predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api#predict) new data safely. 

Should you not want to use a model, you can use the [Train and Predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api#train-and-predict) API to test your model without having to evaluate the model's performance.

## Using ML Commons

1. Ensure you've set the appropriate cluster settings outlined in [Cluster Settings]({{site.url}}{{site.baseurl}}/ml-commons-plugin/cluster-settings/). 
2. Set up model access described in [Model Access Control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/). 
3. Start using models: 
  - [ML Framework]({{site.url}}{{site.baseurl}}/ml-commons-plugin/ml-framework/) allows you to run models within OpenSearch. 
  - [ML Extensibility]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/index/) allows you to access remote models. 