---
layout: default
title: Train and Predict APIs
parent: ML Commons API
has_children: true
nav_order: 30
---

# Train and Predict APIs

The ML Commons API lets you train machine learning (ML) algorithms synchronously and asynchronously, make predictions with that trained model, and train and predict with the same dataset.

To train tasks through the API, three inputs are required: 

- Algorithm name: Must be one of a [FunctionName](https://github.com/opensearch-project/ml-commons/blob/1.3/common/src/main/java/org/opensearch/ml/common/parameter/FunctionName.java). This determines what algorithm the ML Engine runs. To add a new function, see [How To Add a New Function](https://github.com/opensearch-project/ml-commons/blob/main/docs/how-to-add-new-function.md).
- Model hyperparameters: Adjust these parameters to improve model accuracy.  
- Input data: The data that trains the ML model, or applies the ML models to predictions. You can input data in two ways, query against your index or use a data frame.

ML Commons supports the following Train and Predict APIs:

- [Train]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/train/)
- [Predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/predict/)
- [Train and Predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/train-predict/train-and-predict/)
