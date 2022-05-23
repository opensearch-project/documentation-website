---
layout: default
title: Supported Algorithms 
has_children: false
nav_order: 100
---

# Supported Algorithms

ML Commons supports various algorithms to help train and predict ML models or test data-driven predictions without a model. This page outlines the algorithms supported by the ML Commons plugin, and which API actions can be used with each algorithm. 

## Common limitations 

With exception to the Localization algorithm, all of the following algorithms can only support the retrieval of 10,000 documents from an index when indexed data is used as the input. 

## K-Means

K-Means is a simple and popular unsupervised clustering ML algorithm. K-Means will randomly choose centroids, then calculate iteratively to optimize the position of the centroids until each observation belongs to the cluster with nearest mean.

### Parameters

Parameter | Type   | Description | Default Value
:--- |:--- | :--- | :---

### APIs

* train
* predict
* train and predict

### Example

### Limitations

Training process supports multi-threads, but thread number is less than half of CPUs.

## Linear Regression

Linear Regression maps the linear relationship between inputs and outputs. In ml-common, the linear regression algorithm is adopted from the public machine learning library Tribuo (https://tribuo.org/), which offers multidimensional linear regression models.  The model supports linear optimizer in training, including popular approaches like Linear Decay, SQRT_DECAY, ADA (http://chrome-extension//gphandlahdpffmccakmbngmbjnjiiahp/https://www.jmlr.org/papers/volume12/duchi11a/duchi11a.pdf), ADAM (https://tribuo.org/learn/4.1/javadoc/org/tribuo/math/optimisers/Adam.html), RMS_DROP (https://tribuo.org/learn/4.1/javadoc/org/tribuo/math/optimisers/RMSProp.html). 

### Parameters

Parameter | Type   | Description | Default Value
:--- |:--- | :--- | :---


### APIs

* train
* predict

### Example

### Limitations

As of now, ml-commons only supports linear Stochastic gradient trainer or optimizer, which can not effectively map the non-linear relationships in the training data. This may bring some convergence problem and inaccuracy in the results for complicated data sets.  Adding some popular non-linear models like CART_Tree and XGBoost (https://xgboost.ai/) is in the plan for the next releases in ml-common.

## RCF

Random Cut Forest(RCF) is a probabilistic data structure (refer to the https://quip-amazon.com/1SnsA4gbMECc/Supported-algorithms#temp:C:MeN75517f455b564b69ae5972516, and Github repo (https://github.com/aws/random-cut-forest-by-aws)) used primarily for unsupervised anomaly detection, but extends to density estimation and forecasting. OpenSearch leverages RCF for anomaly detection and ml-commons supports two new variants of RCF for different use cases:

* Batch RCF: this is to detect anomalies in non-time-series data. 
* Fixed in time (FIT) RCF: this is to detect anomalies in time-series data



### Parameters

#### Batch RCF

Parameter | Type   | Description | Default Value
:--- |:--- | :--- | :---

#### Fit RCF

Parameter | Type   | Description | Default Value
:--- |:--- | :--- | :---

### APIs

* train
* predict
* train and predict

### Example

### Limitations

FIT RCF: user can train model with historical data and the trained model will be stored in index. When call predict API, the model will be deserialized and predict new data points. But the model in index will not be refreshed with new data. That’s why we call it “fixed in time” RCF. 

## Localization 

Finding subset level information for aggregate data (for example, aggregated over time) that demonstrates activity of interest (spikes, drops, changes, anomalies) is a critical insight. Localization can be applied in different scenarios such as data exploration, root cause analysis, etc., to expose the contributors driving the activity of interest in the aggregate data.

### Parameters

Parameter | Type   | Description | Default Value
:--- |:--- | :--- | :---


### Example

### Limitations

The localization algorithm can only be executed directly. Therefore, it cannot be used in conjunction with the ML Common's train and predicts APIs.