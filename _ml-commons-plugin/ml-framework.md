---
layout: default
title: ML framework 
has_children: true
nav_order: 50
redirect_from:
   - /ml-commons-plugin/model-serving-framework/
---

ML Framework was taken out of experimental status and released as Generally Available in OpenSearch 2.9.  
{: .note}


# ML Framework

ML Commons allows you to serve custom models and use those models to make inferences through the OpenSearch Machine Learning (ML) Framework. For those who want to run their PyTorch deep learning model inside an OpenSearch cluster, you can upload and run that model with the ML Commons REST API.

This page outlines the steps required to upload a custom model and run it with the ML Framework.


## Prerequisites 

To upload a custom model to OpenSearch, you need to prepare it outside of your OpenSearch cluster. You can use a pretrained model, like one from [Huggingface](https://huggingface.co/), or train a new model in accordance with your needs.

### Model support

As of OpenSearch 2.6, the ML Framework supports text-embedding models.

### Model format

To use a model in OpenSearch, you'll need to export the model into a portable format. As of Version 2.5, OpenSearch only supports the [TorchScript](https://pytorch.org/docs/stable/jit.html) and [ONNX](https://onnx.ai/) formats.

Furthermore, files must be saved as zip files before upload. Therefore, to ensure that ML Commons can upload your model, compress your TorchScript file before uploading. You can download an example file [here](https://github.com/opensearch-project/ml-commons/blob/2.x/ml-algorithms/src/test/resources/org/opensearch/ml/engine/algorithms/text_embedding/all-MiniLM-L6-v2_torchscript_sentence-transformer.zip).



### Model size

Most deep learning models are more than 100 MB, making it difficult to fit them into a single document. OpenSearch splits the model file into smaller chunks to be stored in a model index. When allocating machine learning (ML) or data nodes for your OpenSearch cluster, make sure you correctly size your ML nodes so that you have enough memory when making ML inferences.

## GPU acceleration

To achieve better performance within the ML Framework, you can take advantage of GPU acceleration on your ML node. For more information, see [GPU acceleration]({{site.url}}{{site.baseurl}}/ml-commons-plugin/gpu-acceleration/).


## Register model to OpenSearch

Use the URL Register operation for models that already exist on another server, such as GitHub or S3. 

```
POST /_plugins/_ml/models/_register
```

The URL register method requires the following request fields.

Field | Data type | Description
:---  | :--- | :--- 
`name`| String | The model's name. |
`version` | Integer | The model's version number. |
`model_format` | String | The portable format of the model file. Currently only supports `TORCH_SCRIPT`. |
`model_group_id` | String | The model group ID of the model group to register this model to. 
`model_content_hash_value` | String | The model content hash generated using the SHA-256 hashing algorithm.
`model_config`  | JSON object | The model's configuration, including the `model_type`, `embedding_dimension`, and `framework_type`. `all_config` is an optional JSON string that contains all model configurations. |
`url` | String | The URL that contains the model. |

### The `model_config` object

| Field | Data type | Description |
| :--- | :--- | :--- |
| `model_type` | String | The model type, such as `bert`. For a Huggingface model, the model type is specified in `config.json`. For an example, see the [`all-MiniLM-L6-v2` Huggingface model `config.json`](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2/blob/main/config.json#L15).|
| `embedding_dimension` | Integer | The dimension of the model-generated dense vector. For a Huggingface model, the dimension is specified in the model card. For example, in the [`all-MiniLM-L6-v2` Huggingface model card](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2), the statement `384 dimensional dense vector space` specifies 384 as the embedding dimension. |
| `framework_type` | String  | The framework the model is using. Currently, we support `sentence_transformers` and `huggingface_transformers` frameworks. The `sentence_transformers` model outputs text embeddings directly, so ML Commons does not perform any post processing. For `huggingface_transformers`, ML Commons performs post processing by applying mean pooling to get text embeddings. See the example [`all-MiniLM-L6-v2` Huggingface model](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) for more details. |
| `all_config` _(Optional)_ | String | This field is used for reference purposes. You can specify all model configurations in this field. For example, if you are using a Huggingface model, you can minify the `config.json` file to one line and save its contents in the `all_config` field. Once the model is uploaded, you can use the get model API operation to get all model configurations stored in this field. |

You can further customize a pre-trained sentence transformer model's post-processing logic with the following optional fields in the `model_config` object.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `pooling_mode` | String | The post-process model output, either `mean`, `mean_sqrt_len`, `max`, `weightedmean`, or `cls`.|
| `normalize_result` | Boolean | When set to `true`, normalizes the model output in order to scale to a standard range for the model. |

#### Example request


The following example request uploads version `1.0.0` of a natural language processing (NLP) sentence transformation model named `all-MiniLM-L6-v2`:

```json
POST /_plugins/_ml/models/_register
{
  "name": "all-MiniLM-L6-v2",
  "version": "1.0.0",
  "description": "test model",
  "model_format": "TORCH_SCRIPT",
  "model_content_hash_value": "96a89c2fb80f20550a4fcedb0d86d9bfad788b7bcab7497c7cda015adee1cb32",
  "model_config": {
    "model_type": "bert",
    "embedding_dimension": 384,
    "framework_type": "sentence_transformers"
  },
  "url": "https://github.com/opensearch-project/ml-commons/raw/2.x/ml-algorithms/src/test/resources/org/opensearch/ml/engine/algorithms/text_embedding/all-MiniLM-L6-v2_torchscript_sentence-transformer.zip?raw=true"
}
```

#### Example response


OpenSearch responds with the `task_id` and task `status`:

```json
{
  "task_id" : "ew8I44MBhyWuIwnfvDIH", 
  "status" : "CREATED"
}
```

To see the status of your model upload, pass the `task_id` into the [task API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api#getting-task-information).

## Load the model

The load model operation reads the model's chunks from the model index and then creates an instance of the model to load into memory. The bigger the model, the more chunks the model is split into. The more chunks a model index contains, the longer it takes for the model to load into memory.

### Get the `model_id`

To load a model, you need the `model_id`. To find the `model_id`, take the `task_id` from the model's upload operations API response and use the `GET _ml/tasks` API.

This example request uses the `task_id` from the upload example.

```json
GET /_plugins/_ml/tasks/ew8I44MBhyWuIwnfvDIH
```


OpenSearch responds with the `model_id`:

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

### Load the model from the model index

With the `model_id`, you can now load the model from the model's index in order to deploy the model to ML nodes. The load API reads model chunks from the model index, creates an instance of that model, and saves the model instance in the ML node's cache.


Add the `model_id` to the load API: 


```json
POST /_plugins/_ml/models/<model_id>/_deploy
```

By default, the ML Commons setting `plugins.ml_commons.only_run_on_ml_node` is set to `false`. When `false`, models load on ML nodes first. If no ML nodes exist, models load on data nodes. When running ML models in production, set `plugins.ml_commons.only_run_on_ml_node` to `true` so that models only load on ML nodes.


#### Example request: Load into any available ML node


In this example request, OpenSearch loads the model into all available OpenSearch node: 

```json
POST /_plugins/_ml/models/WWQI44MBbzI2oUKAvNUt/_deploy
```

#### Example request: Load into a specific node


If you want to reserve the memory of other ML nodes within your cluster, you can load your model into a specific node(s) by specifying each node's ID in the request body:

```json
POST /_plugins/_ml/models/WWQI44MBbzI2oUKAvNUt/_deploy
{
    "node_ids": ["4PLK7KJWReyX0oWKnBA8nA"]
}
```


#### Example response

All models load asynchronously. Therefore, the load API responds with a new `task_id` based on the load and responds with a new `status` for the task.

```json
{
  "task_id" : "hA8P44MBhyWuIwnfvTKP",
  "status" : "CREATED"
}
```


### Check the model load status

With your `task_id` from the load response, you can use the `GET _ml/tasks` API to see the load status of your model. Before a loaded model can be used for inferences, the load task's `state` must be `COMPLETED`.


#### Example request


```json
GET /_plugins/_ml/tasks/hA8P44MBhyWuIwnfvTKP
```

#### Example response

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

## Use the loaded model for inferences


After the model has been loaded, you can enter the `model_id` into the [predict API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api#predict) to perform inferences.

```json
POST /_plugins/_ml/models/<model_id>/_predict
```


### Example request


```json
POST /_plugins/_ml/_predict/text_embedding/WWQI44MBbzI2oUKAvNUt
{
  "text_docs":[ "today is sunny"],
  "return_number": true,
  "target_response": ["sentence_embedding"]
}
```

### Example response


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


If you're done making predictions with your model, use the unload operation to remove the model from your memory cache. The model will remain accessible in the model index.

```json
POST /_plugins/_ml/models/<model_id>/_undeploy
```

### Example request


```json
POST /_plugins/_ml/models/MGqJhYMBbbh0ushjm8p_/_undeploy
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










