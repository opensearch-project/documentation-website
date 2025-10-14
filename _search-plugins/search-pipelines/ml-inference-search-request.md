---
layout: default
title: ML inference (request)
nav_order: 30
has_children: false
parent: Search processors
grand_parent: Search pipelines
canonical_url: https://docs.opensearch.org/latest/search-plugins/search-pipelines/ml-inference-search-request/
---

# ML inference search request processor
Introduced 2.16
{: .label .label-purple }

The `ml_inference` search request processor is used to invoke registered machine learning (ML) models in order to rewrite queries using the model output.

**PREREQUISITE**<br>
Before using the `ml_inference` search request processor, you must have either a local ML model hosted on your OpenSearch cluster or an externally hosted model connected to your OpenSearch cluster through the ML Commons plugin. For more information about local models, see [Using ML models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/using-ml-models/).
For more information about externally hosted models, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/).
{: .note}

## Syntax

The following is the syntax for the `ml-inference` search request processor:

```json
{
  "ml_inference": {
    "model_id": "<model_id>",
    "function_name": "<function_name>",
    "full_response_path": "<full_response_path>",
    "query_template": "<query_template>",
    "model_config": {
      "<model_config_field>": "<config_value>"
    },
    "model_input": "<model_input>",
    "input_map": [
      {
        "<model_input_field>": "<query_input_field>"
      }
    ],
    "output_map": [
      {
        "<query_output_field>": "<model_output_field>"
      }
    ]
  }
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `ml-inference` search request processor.

| Parameter | Data type | Required/Optional | Description |
|:--| :--- |:---|:---|
| `model_id`| String | Required | The ID of the ML model used by the processor. |
| `query_template` | String   | Optional  | A query string template used to construct a new query containing a `new_document_field`. Often used when rewriting a search query to a new query type. |
| `function_name` | String    | Optional for externally hosted models<br/><br/>Required for local models | The function name of the ML model configured in the processor. For local models, valid values are `sparse_encoding`, `sparse_tokenize`, `text_embedding`, and `text_similarity`. For externally hosted models, valid value is `remote`. Default is `remote`.   |
| `model_config` | Object    | Optional   | Custom configuration options for the ML model. For externally hosted models, if set, this configuration overrides the default connector parameters. For local models, you can add `model_config` to `model_input` to override the model configuration set during registration. For more information, see [The `model_config` object]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/#the-model_config-object).  |
| `model_input` | String    | Optional for externally hosted models<br/><br/>Required for local models | A template that defines the input field format expected by the model. Each local model type might use a different set of inputs. For externally hosted models, default is `"{ \"parameters\": ${ml_inference.parameters} }`. |
| `input_map` | Array | Required  | An array specifying how to map query string fields to the model input fields. Each element of the array is a map in the `"<model_input_field>": "<query_input_field>"` format and corresponds to one model invocation of a document field. If no input mapping is specified for an externally hosted model, then all document fields are passed to the model directly as input. The `input_map` size indicates the number of times the model is invoked (the number of Predict API requests). |
| `<model_input_field>`  | String    | Required | The model input field name.  |
| `<query_input_field>`  | String    | Required | The name or JSON path of the query field used as the model input. |
| `output_map`  | Array | Required | An array specifying how to map the model output fields to new fields in the query string. Each element of the array is a map in the `"<query_output_field>": "<model_output_field>"` format. |
| `<query_output_field>` | String    | Required | The name of the query field in which the model's output (specified by `model_output`) is stored.  |
| `<model_output_field>` | String    | Required | The name or JSON path of the field in the model output to be stored in the `query_output_field`.  |
| `full_response_path`   | Boolean   | Optional  | Set this parameter to `true` if the `model_output_field` contains a full JSON path to the field instead of the field name. The model output will then be fully parsed to get the value of the field. Default is `true` for local models and `false` for externally hosted models.  |
| `ignore_missing`       | Boolean   | Optional  | If `true` and any of the input fields defined in the `input_map` or `output_map` are missing, then this processor is ignored. Otherwise, a missing field causes a failure. Default is `false`.  |
| `ignore_failure` | Boolean   | Optional | Specifies whether the processor continues execution even if it encounters an error. If `true`, then this processor is ignored and the search continues. If `false`, then any failure causes the search to be canceled. Default is `false`.  |
| `max_prediction_tasks` | Integer   | Optional  | The maximum number of concurrent model invocations that can run during query search. Default is `10`.  |
| `description`          | String    | Optional   | A brief description of the processor.  |
| `tag`                  | String    | Optional | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type.  |

The `input_map` and `output_map` mappings support standard [JSON path](https://github.com/json-path/JsonPath) notation for specifying complex data structures.
{: .note}

## Using the processor

Follow these steps to use the processor in a pipeline. You must provide a model ID, `input_map`, and `output_map` when creating the processor. Before testing a pipeline using the processor, make sure that the model is successfully deployed. You can check the model state using the [Get Model API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/get-model/).

For local models, you must provide a `model_input` field that specifies the model input format. Add any input fields in `model_config` to `model_input`.

For externally hosted models, the `model_input` field is optional, and its default value
is `"{ \"parameters\": ${ml_inference.parameters} }`.

### Setup

Create an index named `my_index` and index two documents:

```json
POST /my_index/_doc/1
{
  "passage_text": "I am excited",
  "passage_language": "en",
  "label": "POSITIVE",
  "passage_embedding": [
    2.3886719,
    0.032714844,
    -0.22229004
    ...]
}
```
{% include copy-curl.html %}

```json
POST /my_index/_doc/2
{
  "passage_text": "I am sad",
  "passage_language": "en",
  "label": "NEGATIVE",
  "passage_embedding": [
    1.7773438,
    0.4309082,
    1.8857422,
    0.95996094,
    ...]
}
```
{% include copy-curl.html %}

When you run a term query on the created index without a search pipeline, the query searches for documents that contain the exact term specified in the query. The following query does not return any results because the query text does not match any of the documents in the index:

```json
GET /my_index/_search
{
  "query": {
    "term": {
      "passage_text": {
        "value": "happy moments",
        "boost": 1
      }
    }
  }
}
```

By using a model, the search pipeline can dynamically rewrite the term value to enhance or alter the search results based on the model inference. This means the model takes an initial input from the search query, processes it, and then updates the query term to reflect the model inference, potentially improving the relevance of the search results.

### Example: Externally hosted model

The following example configures an `ml_inference` processor with an externally hosted model.

**Step 1: Create a pipeline**

This example demonstrates how to create a search pipeline for an externally hosted sentiment analysis model that rewrites the term query value. The model requires an `inputs` field and produces results in a `label` field. Because the `function_name` is not specified, it defaults to `remote`, indicating an externally hosted model.

The term query value is rewritten based on the model's output. The `ml_inference` processor in the search request needs an `input_map` to retrieve the query field value for the model input and an `output_map` to assign the model output to the query string.

In this example, an `ml_inference` search request processor is used for the following term query:

```json
 {
  "query": {
    "term": {
      "label": {
        "value": "happy moments",
        "boost": 1
      }
    }
  }
}
```

The following request creates a search pipeline that rewrites the preceding term query:

```json
PUT /_search/pipeline/ml_inference_pipeline
{
  "description": "Generate passage_embedding for searched documents",
  "request_processors": [
    {
      "ml_inference": {
        "model_id": "<your model id>",
        "input_map": [
          {
            "inputs": "query.term.label.value"
          }
        ],
        "output_map": [
          {
            "query.term.label.value": "label"
          }
        ]
      }
    }
  ]
}
```
{% include copy-curl.html %}

When making a Predict API request to an externally hosted model, all necessary fields and parameters are usually contained within a `parameters` object:

```json
POST /_plugins/_ml/models/cleMb4kBJ1eYAeTMFFg4/_predict
{
  "parameters": {
    "inputs": [
      {
        ...
      }
    ]
  }
}
```

Thus, to use an externally hosted sentiment analysis model, send a Predict API request in the following format:

```json
POST /_plugins/_ml/models/cywgD5EB6KAJXDLxyDp1/_predict
{
  "parameters": {
    "inputs": "happy moments"
  }
}
```
{% include copy-curl.html %}

The model processes the input and generates a prediction based on the sentiment of the input text. In this case, the sentiment is positive: 

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "dataAsMap": {
            "label": "POSITIVE",
            "score": "0.948"
          }
        }
      ],
      "status_code": 200
    }
  ]
}
```

When specifying the `input_map` for an externally hosted model, you can directly reference the `inputs` field instead of providing its dot path `parameters.inputs`:

```json
"input_map": [  
  {
    "inputs": "query.term.label.value"
  }
]
```

**Step 2: Run the pipeline**

Once you have created a search pipeline, you can run the same term query with the search pipeline:

```json
GET /my_index/_search?search_pipeline=my_pipeline_request_review
{
  "query": {
    "term": {
      "label": {
        "value": "happy moments",
        "boost": 1
      }
    }
  }
}
```
{% include copy-curl.html %}

The query term value is rewritten based on the model's output. The model determines that the sentiment of the query term is positive, so the rewritten query appears as follows:

```json
{
  "query": {
    "term": {
      "label": {
        "value": "POSITIVE",
        "boost": 1
      }
    }
  }
}
```

The response includes the document whose `label` field has the value `POSITIVE`:

```json
{
  "took": 288,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 0.00009405752,
    "hits": [
      {
        "_index": "my_index",
        "_id": "3",
        "_score": 0.00009405752,
        "_source": {
          "passage_text": "I am excited",
          "passage_language": "en",
          "label": "POSITIVE"
        }
      }
    ]
  }
}
```

### Example: Local model

The following example shows you how to configure an `ml_inference` processor with a local model to rewrite a term query into a k-NN query.

**Step 1: Create a pipeline**

The following example shows you how to create a search pipeline for the `huggingface/sentence-transformers/all-distilroberta-v1` local model. The model is a [pretrained sentence transformer model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/#sentence-transformers)
hosted in your OpenSearch cluster.

If you invoke the model using the Predict API, then the request appears as follows:

```json
POST /_plugins/_ml/_predict/text_embedding/cleMb4kBJ1eYAeTMFFg4
{
  "text_docs": [
    "today is sunny"
  ],
  "return_number": true,
  "target_response": [
    "sentence_embedding"
  ]
}
```

Using this schema, specify the `model_input` as follows:

```json
 "model_input": "{ \"text_docs\": ${input_map.text_docs}, \"return_number\": ${model_config.return_number}, \"target_response\": ${model_config.target_response} }"
```

In the `input_map`, map the `query.term.passage_embedding.value` query field to the `text_docs` field expected by the model:

```json
"input_map": [
  {
    "text_docs": "query.term.passage_embedding.value"
  } 
]
```

Because you specified the field to be converted into embeddings as a JSON path, you need to set the `full_response_path` to `true`. Then the full JSON document is parsed in order to obtain the input field:

```json
"full_response_path": true
```

The text in the `query.term.passage_embedding.value` field will be used to generate embeddings:

```json
{
  "text_docs": "happy passage"
}
```

The Predict API request returns the following response:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "sentence_embedding",
          "data_type": "FLOAT32",
          "shape": [
            768
          ],
          "data": [
            0.25517133,
            -0.28009856,
            0.48519906,
            ...
          ]
        }
      ]
    }
  ]
}
```

The model generates embeddings in the `$.inference_results.*.output.*.data` field. The `output_map` maps this field to the query field in the query template:

```json
"output_map": [
  {
    "modelPredictionOutcome": "$.inference_results.*.output.*.data"
  }
]
```

To configure an `ml_inference` search request processor with a local model, specify the `function_name` explicitly. In this example, the `function_name` is `text_embedding`. For information about valid `function_name` values, see [Configuration parameters](#configuration-parameters).

The following is the final configuration of the `ml_inference` processor with the local model:

```json
PUT /_search/pipeline/ml_inference_pipeline_local
{
  "description": "searchs reviews and generates embeddings",
  "request_processors": [
    {
      "ml_inference": {
        "function_name": "text_embedding",
        "full_response_path": true,
        "model_id": "<your model id>",
        "model_config": {
          "return_number": true,
          "target_response": [
            "sentence_embedding"
          ]
        },
        "model_input": "{ \"text_docs\": ${input_map.text_docs}, \"return_number\": ${model_config.return_number}, \"target_response\": ${model_config.target_response} }",
        "query_template": """{
        "size": 2,
        "query": {
          "knn": {
            "passage_embedding": {
              "vector": ${modelPredictionOutcome},
              "k": 5
              }
            }
           }
          }""",
        "input_map": [
          {
            "text_docs": "query.term.passage_embedding.value"
          }
        ],
        "output_map": [
          {
            "modelPredictionOutcome": "$.inference_results.*.output.*.data"
          }
        ],
        "ignore_missing": true,
        "ignore_failure": true
      }
    }
  ]
}
```
{% include copy-curl.html %}

**Step 2: Run the pipeline**

Run the following query, providing the pipeline name in the request:

```json
GET /my_index/_search?search_pipeline=ml_inference_pipeline_local
{
"query": {
  "term": {
    "passage_embedding": {
      "value": "happy passage"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response confirms that the processor ran a k-NN query, which returned document 1 with a higher score:

```json
{
  "took": 288,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 0.00009405752,
    "hits": [
      {
        "_index": "my_index",
        "_id": "1",
        "_score": 0.00009405752,
        "_source": {
          "passage_text": "I am excited",
          "passage_language": "en",
          "label": "POSITIVE",
          "passage_embedding": [
            2.3886719,
            0.032714844,
            -0.22229004
            ...]
        }
      },
      {
        "_index": "my_index",
        "_id": "2",
        "_score": 0.00001405052,
        "_source": {
          "passage_text": "I am sad",
          "passage_language": "en",
          "label": "NEGATIVE",
          "passage_embedding": [
            1.7773438,
            0.4309082,
            1.8857422,
            0.95996094,
            ...
          ]
        }
      }
    ]
  }
}
```
