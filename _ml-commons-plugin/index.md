---
layout: default
title: Integrate ML models
nav_order: 1
has_children: false
has_toc: false
nav_exclude: true
---

# Integrate ML models

OpenSearch offers support for machine learning (ML) models that you can use in conjunction with k-NN search to retrieve semantically similar documents. This semantic search capability improves search relevance for your applications.

Before you get started with machine learning, you'll need to [set up]({{site.url}}{{site.baseurl}}/quickstart/) and [secure]({{site.url}}{{site.baseurl}}/security/index/) your cluster. 
{: .tip}

## Choosing a model

To integrate an ML model into your workflow, choose one of the following options:

1. **Local model**: Upload a model to the OpenSearch cluster and use it locally. This option allows you to serve the model in your OpenSearch cluster but may require significant system resources.

    1. **Pretrained model provided by OpenSearch**: This option requires minimal setup and saves you time and effort of training a custom model.

        For information about using a pretrained model provided by OpenSearch and a list of supported models, see [Pretrained models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/). 

    1. **Custom model**: This option offers customization to your specific use case.

        For information about uploading your model, see [Using ML models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/ml-framework/).

1. **Remote model**: Connect to a model hosted on a third-party platform. This option requires more setup but allows to use models that are already hosted on a service other than OpenSearch.     
    
    To connect to an externally hosted model, you need to set up a connector:  

    - For a walkthrough with detailed steps, see [Connecting to remote models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/index/).
    - For more information about supported connectors, see [Connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/connectors/).
    - For information about creating your own connector, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/blueprints/).


## ML model-powered search

Regardless of what option you chose for the model, the following common steps apply to setting up:

1. **Configure ML Commons cluster settings**. To learn more, see [ML Commons cluster settings]({{site.url}}{{site.baseurl}}/ml-commons-plugin/cluster-settings/). 
1. **Set up an ML model**.
    1. Set up model access control. To learn more, see [Model access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/).    
      1. Register a model group.
      1. Register the model to the model group.
    1. Deploy the model.
1. **Ingest data**.
    1. Create an ingest pipeline.
    1. Create an index (create a k-NN index for vector search).
    1. Ingest documents into the index.
1. **Use the model**.
    1. (Optional) Test the model by calling the Predict API.
    1. Search using a model.

### Tutorial

For a step-by-step tutorial, see [Neural search tutorial]({{site.url}}{{site.baseurl}}/search-plugins/neural-search-tutorial/).

## Using a model

You can use an ML model in one of the following ways:

- [Make predictions](#making-predictions)
- [Use a model for search](#using-a-model-for-search)

### Making predictions

[Models trained]({{site.url}}{{site.baseurl}}//ml-commons-plugin/api/train-predict/train/) through the ML Commons plugin support model-based algorithms, such as k-means. After you've trained a model to your precision requirements, use the model to [make predictions]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/). 

If you don't want to use a model, you can use the [Train and Predict API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/train-and-predict/) to test your model without having to evaluate the model's performance.

### Using a model for search

OpenSearch supports multiple search methods that integrate with machine learning. For more information, see [Search methods]({{site.url}}{{site.baseurl}}/search-plugins/index/#search-methods).