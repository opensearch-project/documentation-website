---
layout: default
title: ML inference search request processor
nav_order: 8
has_children: false
parent: Search processors
grand_parent: Search pipelines
---

# ML inference search request processor

The `ml_inference` search request processor is used to invoke machine learning (ML) models registered in
the [OpenSearch ML Commons plugin]({{site.url}}{{site.baseurl}}/ml-commons-plugin/). The model outputs are used to
rewrite queries.

**PREREQUISITE**<br>
Before using the `ml_inference` processor, you must have either a local ML model hosted on your OpenSearch cluster or an
externally hosted model connected to your OpenSearch cluster through the ML Commons plugin. For more information about
local models, see [Using ML models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/using-ml-models/).
For more information about externally hosted models,
see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/).
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

The following table lists the required and optional parameters for the `ml-inference` processor.

| Parameter              | Data type | Required/Optional                                                        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
|:-----------------------| :--- |:-------------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `model_id`             | String | Required                                                                 | The ID of the ML model used by the processor.                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `query_template`       | String   | Optional                                                                 | A query string template to construct new query with new_document_field. Oftenly used when rewriting to a new query type.                                                                                                                                                                                                                                                                                                                                                                                |
| `function_name`        | String    | Optional for externally hosted models<br/><br/>Required for local models | The function name of the ML model configured in the processor. For local models, valid values are `sparse_encoding`, `sparse_tokenize`, `text_embedding`, and `text_similarity`. For externally hosted models, valid value is `remote`. Default is `remote`.                                                                                                                                                                                                                                            |
| `model_config`         | Object    | Optional                                                                 | Custom configuration options for the ML model. For more information, see [The `model_config` object]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/#the-model_config-object).                                                                                                                                                                                                                                                                                            |
| `model_input`          | String    | Optional for externally hosted models<br/><br/>Required for local models | A template that defines the input field format expected by the model. Each local model type might use a different set of inputs. For externally hosted models, default is `"{ \"parameters\": ${ml_inference.parameters} }`.                                                                                                                                                                                                                                                                            |
| `input_map`            | Array | Required                                               | An array specifying how to map query string fields to the model input fields. Each element of the array is a map in the `"<model_input_field>": "<query_input_field>"` format and corresponds to one model invocation for a document field. If no input mapping is specified for an externally hosted model, then all fields from the document are passed to the model directly as input. The `input_map` size indicates the number of times the model is invoked (the number of Predict API requests). |
| `<model_input_field>`  | String    | Required | The model input field name.                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `<query_input_field>`  | String    | Required | The name or JSON path of the query field used as the model input.                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `output_map`           | Array | Required | An array specifying how to map the model output fields to new fields in the query string. Each element of the array is a map in the `"<query_output_field>": "<model_output_field>"` format.                                                                                                                                                                                                                                                                                                            |
| `<query_output_field>` | String    | Required | The name of the query field in which the model's output (specified by `model_output`) is stored.                                                                                                                                                                                                                                                                                                                                                                                                        |
| `<model_output_field>` | String    | Required | The name or JSON path of the field in the model output to be stored in the `query_output_field`.                                                                                                                                                                                                                                                                                                                                                                                                        |
| `full_response_path`   | Boolean   | Optional                                                                 | Set this parameter to `true` if the `model_output_field` contains a full JSON path to the field instead of the field name. The model output will then be fully parsed to get the value of the field. Default is `true` for local models and `false` for externally hosted models.                                                                                                                                                                                                                       |
| `ignore_missing`       | Boolean   | Optional                                                                 | If `true` and any of the input fields defined in the `input_map` or `output_map` are missing, then the missing fields are ignored. Otherwise, a missing field causes a failure. Default is `false`.                                                                                                                                                                                                                                                                                                     |
| `ignore_failure`       | Boolean   | Optional                                                                 | Specifies whether the processor continues execution even if it encounters an error. If `true`, then any failure is ignored and search continues. If `false`, then any failure causes search to be canceled. Default is `false`.                                                                                                                                                                                                                                                                         |
| `max_prediction_tasks` | Integer   | Optional                                                                 | The maximum number of concurrent model invocations that can run during query search. Default is `10`.                                                                                                                                                                                                                                                                                                                                                                                                   |
| `description`          | String    | Optional                                                                 | A brief description of the processor.                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `tag`                  | String    | Optional                                                                 | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type.                                                                                                                                                                                                                                                                                                                                                                                           |

The `input_map` and `output_map` mappings support standard [JSON path](https://github.com/json-path/JsonPath) notation
for specifying complex data structures.
{: .note}

## Using the processor

Follow these steps to use the processor in a pipeline. You must provide a model ID, input_map and output_map when
creating the processor. Before testing a pipeline using the processor, make sure that the model is successfully
deployed. You can check the model state using
the [Get Model API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/get-model/).

For local models, you must provide a `model_input` field that specifies the model input format. Add any input fields
in `model_config` to `model_input`.

For remote models, the `model_input` field is optional, and its default value
is `"{ \"parameters\": ${ml_inference.parameters} }`.

### Setup

Create an index named `my_index` and index two documents:

```json
POST /my_index/_doc/1
{
  "passage_text": "I am exicited",
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

When using a term query to match document, a sample term query will be used as following, and it will not return any
document as there is no such text in the above documents:

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

### Example: Externally hosted model

The following example configures an `ml_inference` processor with an externally hosted model.

**Step 1: Create a pipeline**

The following example creates a search pipeline for an externally hosted sentimental analysis model to rewrite query value in 
a term query. The model requires an `inputs` field and generates sentimental analysis results in a `label` field. 
The term query value is rewritten with the model output result. The `function_name` is not explicitly specified
in the processor configuration, so it defaults to `remote`, signifying an externally hosted model:

For `ml_inference` search request processor, it requires `input_map` and `output_map` to fetch the query field value to
model input, and assign model output to the query string.


In this example, if a `ml_inference` search request processor is used for the following term query:

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

{% include copy-curl.html %}

Here is the sample config to create a search pipeline to rewrite the term query. 
```json
PUT /_search/pipeline/ml_inference_pipeline
{
  "description": "Generate passage_embedding for searched documents",
  "processors": [
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

For a Predict API request to an externally hosted model, all fields are usually nested inside the `parameters` object:

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

For example, using a remote sentimental analysis model prediction request is as following:

```json
POST /_plugins/_ml/models/cywgD5EB6KAJXDLxyDp1/_predict
{
  "parameters": {
    "inputs": "happy moments"
  }
}
```
The sample response is as following: 
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

When specifying the `input_map` for an externally hosted model, you can directly reference the `inputs` field instead of
providing its dot path `parameters.inputs`:

```json
"input_map": [
{
"inputs": "query.term.label.value"
}
]
```

Once you have created a search pipeline, you can run your search query with the search pipeline.

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

The search query will be similar to rewrite with the model output `label` field.

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

The response will include `label` that includes `POSITIVE` value.

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
          "passage_text": "I am exicited",
          "passage_language": "en",
          "label": "POSITIVE"
        }
      }
    ]
  }
}
```

{: .note}

### Example: Local model

The following example configures an `ml_inference` processor with a local model and rewrite term query into knn query.

**Step 1: Create a pipeline**

The following example creates a search pipeline for the `huggingface/sentence-transformers/all-distilroberta-v1` local
model. The model is a sentence
transformer [pretrained model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/#sentence-transformers)
hosted in your OpenSearch cluster.

If you invoke the model using the Predict API, then the request looks like this:

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

Because you specified the field to convert into embeddings as a JSON path, you need to set the `full_response_path`
to `true` so that the full JSON document is parsed to obtain the input field:

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

The model generates embeddings in the `$.inference_results.*.output.*.data` field. The `output_map` maps this field to
the query field in the query template:

```json
"output_map": [
{
"modelPredictionOutcome": "$.inference_results.*.output.*.data"
}
]
```

To configure an `ml_inference` processor with a local model, specify the `function_name` explicitly. In this
example, `function_name` is `text_embedding`. For information about valid `function_name` values,
see [Configuration parameters](#configuration-parameters).

In this example, the final configuration of the `ml_inference` processor with the local model is as follows:

```json
PUT /_search/pipeline/ml_inference_pipeline_local
{
  "description": "searchs reviews and generates embeddings",
  "processors": [
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

To run the following query with pipeline name:

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

#### Response

The response confirms that the processor conduct knn query that match id 1 with higher scores:

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
          "passage_text": "I am exicited",
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

{: .note}