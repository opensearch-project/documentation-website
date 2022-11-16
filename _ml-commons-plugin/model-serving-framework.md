---
layout: default
title: Model serving framework 
has_children: false
nav_order: 110
---

# Model serving framework

ML commons supports the ability to serve custom models and use those models to make inferences. For those who wish to use train their models using a deep-learning framework, such as Pytorch, TensorFlow, or ONNX, they can upload such models to OpenSearch in order to take advantage of OpenSearch resources, like GPU acceleration.

This page outlines the steps required to upload a custom model with the ML Commons plugin.

## Prerequisites 

To upload a custom model to OpenSearch, you'll need to prepare outside of your OpenSearch cluster. You can use a current model or train a new model depending on your needs.

### Model format

Although most ML models are written in Python, you'll need to export the model into a portable format. As of 2.4, OpenSearch only supports [torchscript](https://pytorch.org/docs/stable/jit.html).

### Model size

Most deep-learning models are over 100 MBs, making it difficult to fit the model into a single document. OpenSearch splits the model file into smaller chunks to store in an ML index. When allocating ML or Data nodes for your OpenSearch cluster, please be aware of the size of your model to prevent any downtime when making inferences. 

## Upload model to OpenSearch

Use the URL upload operation for models that already exist on another server, such as GitHub or S3. 

```
POST /_plugins/_ml/models/_upload
```

The URL upload method requires the following request fields:

Field | Data Type | Description
:---  | :--- | :--- 
`name`| string | The name of the model. |
`version` | string | The version number of the model. Since OpenSearch does not enforce a specific version schema for models, you can choose any number or format that makes sense for your models. |
`model_format` | string | The portable format of the model file. Currently only supports `TORCH_SCRIPT`. |
`model_config` | string | The model's configuration, including the `model_type`, `embedding_dimension`, and `framework_type`. |
`url` | string | The URL where the model is located. |

#### Sample request

The following sample request uploads version `1.0.0` of an NLP sentence transformation model named `all-MiniLM-L6-v2`.

```json
POST /_plugins/_ml/models/_upload
{
  "name": "all-MiniLM-L6-v2",
  "version": "1.0.0",
  "description": "test model",
  "model_format": "TORCH_SCRIPT",
  "model_config": {
    "model_type": "bert",
    "embedding_dimension": 384,
    "framework_type": "sentence_transformers",
  },
  "url": "https://github.com/ylwu-amzn/ml-commons/blob/2.x_custom_m_helper/ml-algorithms/src/test/resources/org/opensearch/ml/engine/algorithms/text_embedding/all-MiniLM-L6-v2_torchscript_sentence-transformer.zip?raw=true"
}
```

#### Sample response

OpenSearch responds with the `task_id` and task `status`.

```json
{
  "task_id" : "ew8I44MBhyWuIwnfvDIH", 
  "status" : "CREATED"
}
```

## Load the model

The load model operation loads a model into memory by reading the model from the index. Since models indexed by OpenSearch are indexed as small chunks, the loading process can take time. 

### Get the `model_id`

To load a model, you need the `model_id`. To find the `model_id`, take the `task_id` from the model's upload operations API response and use the `GET _ml/tasks` API.

This example request uses the `task_id` from the upload example.

```json
GET /_plugins/_ml/tasks/ew8I44MBhyWuIwnfvDIH

OpenSearch responds with the `model_id`. 

```json
{
  "model_id" : "WWQI44MBbzI2oUKAvNUt", 
  "task_type" : "UPLOAD_MODEL",
  "function_name" : "TEXT_EMBEDDING",
  "state" : "COMPLETED",
  "worker_node" : "KzONM8c8T4Od-NoUANQNGg",
  "create_time" : 3455961564003,
  "last_update_time" : 3216361373241,
  "is_async" : true
}
```

### Load model from index

With the `model_id`, you can now load the model from the model's index, then create an instance of the model to save in an ML node's available cache.

Add the `model_id` to the load API operation. 

```json
POST /_plugins/_ml/models/<model_id>/_load
```

#### Request: Load into any available ML node

In this example request, OpenSearch loads the model into any available OpenSearch node:

```json
POST /_plugins/_ml/models/WWQI44MBbzI2oUKAvNUt/_load
```

#### Request: Load into a specific node

If you want to reserve the memory of other ML nodes within your cluster, you can load your model into a specific node(s) by specifying the `node_id` in the request body:

```json
POST /_plugins/_ml/models/WWQI44MBbzI2oUKAvNUt/_load
{
    "node_ids": ["4PLK7KJWReyX0oWKnBA8nA"]
}
```

#### Response

All models load asynchronously. Therefore, the load API responds a new `task_id` based on the load, and returns a `status` for the task.

```json
{
  "task_id" : "hA8P44MBhyWuIwnfvTKP",
  "status" : "CREATED"
}
```

### Check model load status

With your `task_id` from the load response, you can use the `GET _ml/tasks` API to see the loading status of your model. Before a loaded model can be used for inferences, the load tasks `state` must show as `COMPLETED`. 

#### Request

```json
GET /_plugins/_ml/tasks/hA8P44MBhyWuIwnfvTKP
```

#### Response

```json
{
  "model_id" : "WWQI44MBbzI2oUKAvNUt",
  "task_type" : "LOAD_MODEL",
  "function_name" : "TEXT_EMBEDDING",
  "state" : "COMPLETED",
  "worker_node" : "KzONM8c8T4Od-NoUANQNGg",
  "create_time" : 1665961803150,
  "last_update_time" : 1665961815959,
  "is_async" : true
}
```

## Use loaded model for inferences

After the model has been loaded, you can enter the `model_id` into the [predict API](https://opensearch.org/docs/latest/ml-commons-plugin/api/#predict) to perform inferences.

```json
POST /_plugins/_ml/models/<model_id>/_predict
```


### Request

```json
POST /_plugins/_ml/models/WWQI44MBbzI2oUKAvNUt/_predict
{
  "text_docs":[ "today is sunny"],
  "return_number": true,
  "target_response": ["sentence_embedding"]
}
```

### Response

```json
{
  "inference_results" : [
    {
      "output" : [
        {
          "name" : "sentence_embedding",
          "data_type" : "FLOAT32",
          "shape" : [
            384
          ],
          "data" : [
            -0.023315024,
            0.08975691,
            0.078479774,
            ...
          ]
        }
      ]
    }
  ]
}
```

## Unload the model

To unload a model from memory, use the unload operation.

```json
POST /_plugins/_ml/models/<model_id>/_unload
```

### Example request

```json
POST /_plugins/_ml/models/MGqJhYMBbbh0ushjm8p_/_unload
```

### Example response

```json
{
    "s5JwjZRqTY6nOT0EvFwVdA": {
        "stats": {
            "MGqJhYMBbbh0ushjm8p_": "deleted"
        }
    }
}
```










