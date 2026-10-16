---
layout: default
title: Train 
parent: Model APIs
grand_parent: ML Commons APIs
nav_order: 50
---

# Train API

The train API operation trains a model based on a selected algorithm. Training can occur both synchronously and asynchronously.

## Endpoints

```json
POST /_plugins/_ml/_train/{algorithm}
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `algorithm` | String | The name of the algorithm to train, for example, `kmeans`. The name is not case sensitive. For a list of algorithms, see [Supported algorithms]({{site.url}}{{site.baseurl}}/ml-commons-plugin/algorithms/). Required. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `async` | Boolean | If `true`, the request runs asynchronously and returns a task ID. If `false`, the request returns a model ID after training completes. Default is `false`. |

## Request body fields

The following table lists the available request body fields. Provide the training data using either `input_index` and `input_query` or `input_data`.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `parameters` | Object | The algorithm hyperparameters. The available parameters depend on the algorithm. For the parameters of each algorithm, see [Supported algorithms]({{site.url}}{{site.baseurl}}/ml-commons-plugin/algorithms/). Optional. |
| `input_index` | Array | A list of indexes containing the training data. |
| `input_query` | Object | A search query that selects the training documents from `input_index`. |
| `input_data` | Object | The training data provided directly as a data frame, containing `column_metas` and `rows`. |

## Example request 

The following examples use the k-means algorithm to train index data.

**Train with k-means synchronously** 

```json
POST /_plugins/_ml/_train/kmeans
{
    "parameters": {
        "centroids": 3,
        "iterations": 10,
        "distance_type": "COSINE"
    },
    "input_query": {
        "_source": ["petal_length_in_cm", "petal_width_in_cm"],
        "size": 10000
    },
    "input_index": [
        "iris_data"
    ]
}
```
{% include copy-curl.html %}

**Train with k-means asynchronously**

```json
POST /_plugins/_ml/_train/kmeans?async=true
{
    "parameters": {
        "centroids": 3,
        "iterations": 10,
        "distance_type": "COSINE"
    },
    "input_query": {
        "_source": ["petal_length_in_cm", "petal_width_in_cm"],
        "size": 10000
    },
    "input_index": [
        "iris_data"
    ]
}
```
{% include copy-curl.html %}

## Example response

**Synchronous**

For synchronous responses, the API returns the `model_id`, which can be used to get or delete a model.

```json
{
  "model_id" : "lblVmX8BO5w8y8RaYYvN",
  "status" : "COMPLETED"
}
```

**Asynchronous**

For asynchronous responses, the API returns the `task_id`, which can be used to get or delete a task.

```json
{
  "task_id" : "lrlamX8BO5w8y8Ra2otd",
  "status" : "CREATED"
}
```