---
layout: default
title: About ML Commons
nav_order: 1
has_children: false
has_toc: false
nav_exclude: true
---

# ML Commons plugin

ML Commons for OpenSearch simplifies the development of machine learning (ML) features by providing a set of ML algorithms through transport and REST API calls. Those calls choose the right nodes and resources for each ML request and monitor ML tasks to ensure uptime. This allows you to use existing open-source ML algorithms and reduce the effort required to develop new ML features.

Interaction with the ML Commons plugin occurs through either the [REST API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/index/) or [`ad`]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/functions#ad) and [`kmeans`]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/functions#kmeans) Piped Processing Language (PPL) commands.

[Models trained]({{site.url}}{{site.baseurl}}//ml-commons-plugin/api/train-predict/train/) through the ML Commons plugin support model-based algorithms, such as k-means. After you've trained a model to your precision requirements, use the model to [make predictions]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/). 

If you don't want to use a model, you can use the [Train and Predict API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/train-and-predict/) to test your model without having to evaluate the model's performance.

## Using ML Commons

1. Ensure that you've appropriately set the cluster settings described in [ML Commons cluster settings]({{site.url}}{{site.baseurl}}/ml-commons-plugin/cluster-settings/). 
2. Set up model access as described in [Model access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/). 
3. Start using models: 
  - [Run your custom models within an OpenSearch cluster]({{site.url}}{{site.baseurl}}/ml-commons-plugin/ml-framework/). 
  - [Integrate models hosted on an external platform]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/index/). 