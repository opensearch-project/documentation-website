---
layout: default
title: Model APIs
parent: ML Commons APIs
has_children: true
nav_order: 10
has_toc: false
redirect_from:
  - /ml-commons-plugin/api/model-apis/
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/api/model-apis/index/
---

# Model APIs

ML Commons supports the following model-level CRUD APIs:

- [Register Model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/)
- [Deploy Model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/deploy-model/)
- [Get Model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/get-model/)
- [Search Model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/search-model/)
- [Update Model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/update-model/)
- [Undeploy Model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/undeploy-model/)
- [Delete Model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/delete-model/)

# Predict APIs

Predict APIs are used to invoke machine learning (ML) models. ML Commons supports the following Predict APIs:

- [Predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/) 
- [Predict Stream]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict-stream/) 
- [Batch Predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/batch-predict/)

# Train API

The ML Commons Train API lets you train ML algorithms synchronously and asynchronously:

- [Train]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/train/)

To train tasks through the API, three inputs are required: 

- Algorithm name: Must be a [FunctionName](https://github.com/opensearch-project/ml-commons/blob/1.3/common/src/main/java/org/opensearch/ml/common/parameter/FunctionName.java). This determines what algorithm the ML model runs. To add a new function, see [How To Add a New Function](https://github.com/opensearch-project/ml-commons/blob/main/docs/how-to-add-new-function.md).
- Model hyperparameters: Adjust these parameters to improve model accuracy.  
- Input data: The data that trains the ML model or applies it to predictions. You can input data in two ways: query against your index or use a data frame.

# Train and Predict API

The Train and Predict API lets you train and invoke the model using the same dataset:

- [Train and Predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/train-and-predict/)

## Model access control considerations

For clusters with model access control enabled, users can perform API operations on models in model groups with specified access levels as follows:

- `public` model group: Any user.
- `restricted` model group: Only the model owner or users who share at least one backend role with the model group.
- `private` model group: Only the model owner. 

For clusters with model access control disabled, any user can perform API operations on models in any model group. 

Admin users can perform API operations for models in any model group. 

For more information, see [Model access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/).
