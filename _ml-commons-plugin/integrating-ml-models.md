---
layout: default
title: Integrating ML models
nav_order: 15
has_children: true
---

# Integrating ML models

OpenSearch offers support for machine learning (ML) models that you can use in conjunction with k-NN search to retrieve semantically similar documents. This semantic search capability improves search relevance for your applications.

Before you get started, you'll need to [set up]({{site.url}}{{site.baseurl}}/quickstart/) and [secure]({{site.url}}{{site.baseurl}}/security/index/) your cluster. 
{: .tip}

## Choosing a model

To integrate an ML model into your search workflow, choose one of the following options:

1. **Local model**: Upload a model to the OpenSearch cluster and use it locally. This option allows you to serve the model in your OpenSearch cluster but may require significant system resources.

    1. **Pretrained model provided by OpenSearch**: This option requires minimal setup and avoids the time and effort required to train a custom model.

        For a list of supported models and information about using a pretrained model provided by OpenSearch, see [Pretrained models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/). 

    1. **Custom model**: This option offers customization for your specific use case.

        For information about uploading your model, see [Using ML models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/using-ml-models/).

1. **Remote model**: This option allows you to connect to a model hosted on a third-party platform. It requires more setup but allows the use of models that are already hosted on a service other than OpenSearch.     
    
    To connect to an externally hosted model, you need to set up a connector:  

    - For a walkthrough with detailed steps, see [Connecting to remote models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/).
    - For more information about supported connectors, see [Connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/).
    - For information about creating your own connector, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/).

## Tutorial

For a step-by-step tutorial, see [Neural search tutorial]({{site.url}}{{site.baseurl}}/search-plugins/neural-search-tutorial/).

## Using a model

You can use an ML model in one of the following ways:

- [Make predictions](#making-predictions).
- [Use a model for search](#using-a-model-for-search).

### Making predictions

[Models trained]({{site.url}}{{site.baseurl}}//ml-commons-plugin/api/train-predict/train/) through the ML Commons plugin support model-based algorithms, such as k-means. After you've trained a model to your precision requirements, use the model to [make predictions]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/). 

If you don't want to use a model, you can use the [Train and Predict API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/train-and-predict/) to test your model without having to evaluate the model's performance.

### Using a model for search

OpenSearch supports multiple search methods that integrate with ML. For more information, see [Search methods]({{site.url}}{{site.baseurl}}/search-plugins/index/#search-methods).