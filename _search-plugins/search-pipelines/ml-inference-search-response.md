---
layout: default
title: ML inference (response) 
nav_order: 40
has_children: false
parent: User-defined search processors
grand_parent: Search pipelines
---

# ML inference search response processor
Introduced 2.16
{: .label .label-purple }

The `ml_inference` search response processor is used to invoke registered machine learning (ML) models in order to incorporate their outputs as new fields in documents within search results.

**PREREQUISITE**<br>
Before using the `ml_inference` search response processor, you must have either a local ML model hosted on your OpenSearch cluster or an externally hosted model connected to your OpenSearch cluster through the ML Commons plugin. For more information about local models, see [Using ML models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/using-ml-models/). For more information about externally hosted models, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/).
{: .note}

## Syntax

The following is the syntax for the `ml-inference` search response processor:

```json
{
  "ml_inference": {
    "model_id": "<model_id>",
    "function_name": "<function_name>",
    "full_response_path": "<full_response_path>",
    "model_config":{
      "<model_config_field>": "<config_value>"
    },
    "model_input": "<model_input>",
    "input_map": [
      {
        "<model_input_field>": "<document_field>"
      }
    ],
    "output_map": [
      {
        "<new_document_field>": "<model_output_field>"
      }
    ],
    "override": "<override>",
    "one_to_one": false
  }
}
```
{% include copy-curl.html %}

## Request body fields

The following table lists the required and optional parameters for the `ml-inference` search response processor.

| Parameter | Data type | Required/Optional | Description  |
|:--| :--- | :--- |:---|
| `model_id` | String | Required | The ID of the ML model used by the processor. |
| `function_name`        | String    | Optional for externally hosted models<br/><br/>Required for local models | The function name of the ML model configured in the processor. For local models, valid values are `sparse_encoding`, `sparse_tokenize`, `text_embedding`, and `text_similarity`. For externally hosted models, valid value is `remote`. Default is `remote`. |
| `model_config`         | Object    | Optional   | Custom configuration options for the ML model. For externally hosted models, if set, this configuration overrides the default connector parameters. For local models, you can add `model_config` to `model_input` to override the model configuration set during registration. For more information, see [The `model_config` object]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/#the-model_config-object). |
| `model_input`          | String    | Optional for externally hosted models<br/><br/>Required for local models | A template that defines the input field format expected by the model. Each local model type might use a different set of inputs. For externally hosted models, default is `"{ \"parameters\": ${ml_inference.parameters} }`. |
| `input_map`            | Array | Optional for externally hosted models<br/><br/>Required for local models | An array specifying how to map document fields in the search response to the model input fields. Each element of the array is a map in the `"<model_input_field>": "<document_field>"` format and corresponds to one model invocation of a document field. If no input mapping is specified for an externally hosted model, then all document fields are passed to the model directly as input. The `input_map` size indicates the number of times the model is invoked (the number of Predict API requests). |
| `<model_input_field>`  | String    | Optional for externally hosted models<br/><br/>Required for local models  | The model input field name. |
| `<document_field>`     | String    | Optional for externally hosted models<br/><br/>Required for local models | The name or JSON path of the document field in the search response used as the model input.  |
| `output_map`           | Array | Optional for externally hosted models<br/><br/>Required for local models | An array specifying how to map the model output fields to new fields in the search response document. Each element of the array is a map in the `"<new_document_field>": "<model_output_field>"` format. |
| `<new_document_field>` | String    | Optional for externally hosted models<br/><br/>Required for local models | The name of the new field in the document in which the model's output (specified by `model_output`) is stored. If no output mapping is specified for externally hosted models, then all fields from the model output are added to the new document field.  |
| `<model_output_field>` | String    | Optional for externally hosted models<br/><br/>Required for local models | The name or JSON path of the field in the model output to be stored in the `new_document_field`.  |
| `full_response_path`   | Boolean   | Optional   | Set this parameter to `true` if the `model_output_field` contains a full JSON path to the field instead of the field name. The model output will then be fully parsed to get the value of the field. Default is `true` for local models and `false` for externally hosted models.  |
| `ignore_missing`       | Boolean   | Optional  | If `true` and any of the input fields defined in the `input_map` or `output_map` are missing, then this processor is ignored. Otherwise, a missing field causes a failure. Default is `false`. |
| `ignore_failure`       | Boolean   | Optional  | Specifies whether the processor continues execution even if it encounters an error. If `true`, then this processor is ignored and the search continues. If `false`, then any failure causes the search to be canceled. Default is `false`. |
| `override`             | Boolean   | Optional   | Relevant if a document in the response already contains a field with the name specified in `<new_document_field>`. If `override` is `false`, then the input field is skipped. If `true`, then the existing field value is overridden by the new model output. Default is `false`.  |
| `max_prediction_tasks` | Integer   | Optional  | The maximum number of concurrent model invocations that can run during document search. Default is `10`.  |
| `one_to_one`           | Boolean    | Optional  | Set this parameter to `true` to invoke the model once (make one Predict API request) for each document. Default value (`false`) specifies to invoke the model with all documents from the search response, making one Predict API request. |
| `description`          | String    | Optional  | A brief description of the processor. |
| `tag`                  | String    | Optional | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type. |

The `input_map` and `output_map` mappings support standard [JSON path](https://github.com/json-path/JsonPath) notation for specifying complex data structures.
{: .note}

### Setup

Create an index named `my_index` and index one document to explain the mappings:

```json
POST /my_index/_doc/1
{
  "passage_text": "hello world"
}
```
{% include copy-curl.html %}

## Using the processor

Follow these steps to use the processor in a pipeline. You must provide a model ID when creating the processor. Before testing a pipeline using the processor, make sure that the model is successfully deployed. You can check the model state using the [Get Model API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/get-model/).

For local models, you must provide a `model_input` field that specifies the model input format. Add any input fields in `model_config` to `model_input`.

For remote models, the `model_input` field is optional, and its default value is `"{ \"parameters\": ${ml_inference.parameters} }`.

### Example: Local model

The following example shows you how to configure an `ml_inference` search response processor with a local model.

**Step 1: Create a pipeline**

The following example shows you how to create a search pipeline for the `huggingface/sentence-transformers/all-distilroberta-v1` local model. The model is a [pretrained sentence transformer model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/#sentence-transformers) hosted in your OpenSearch cluster.

If you invoke the model using the Predict API, then the request appears as follows:

```json
POST /_plugins/_ml/_predict/text_embedding/cleMb4kBJ1eYAeTMFFg4
{
  "text_docs":[ "today is sunny"],
  "return_number": true,
  "target_response": ["sentence_embedding"]
}
```

Using this schema, specify the `model_input` as follows:

```json
 "model_input": "{ \"text_docs\": ${input_map.text_docs}, \"return_number\": ${model_config.return_number}, \"target_response\": ${model_config.target_response} }"
```

In the `input_map`, map the `passage_text` document field to the `text_docs` field expected by the model:

```json
"input_map": [
  {
    "text_docs": "passage_text"
  }
]
```

Because you specified the field to be converted into embeddings as a JSON path, you need to set the `full_response_path` to `true`. Then the full JSON document is parsed in order to obtain the input field:

```json
"full_response_path": true
```

The text in the `passage_text` field will be used to generate embeddings:

```json
{
  "passage_text": "hello world"
}
```

The Predict API request returns the following response:

```json
{
  "inference_results" : [
    {
      "output" : [
        {
          "name" : "sentence_embedding",
          "data_type" : "FLOAT32",
          "shape" : [
            768
          ],
          "data" : [
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

The model generates embeddings in the `$.inference_results.*.output.*.data` field. The `output_map` maps this field to the newly created `passage_embedding` field in the search response document:

```json
"output_map": [
  {
    "passage_embedding": "$.inference_results.*.output.*.data"
  }
]
```

To configure an `ml_inference` search response processor with a local model, specify the `function_name` explicitly. In this example, the `function_name` is `text_embedding`. For information about valid `function_name` values, see [Request fields](#request-body-fields).

The following is the final configuration of the `ml_inference` search response processor with the local model:

```json
PUT /_search/pipeline/ml_inference_pipeline_local
{
  "description": "search passage and generates embeddings",
  "response_processors": [
    {
      "ml_inference": {
        "function_name": "text_embedding",
        "full_response_path": true,
        "model_id": "<your model id>",
        "model_config": {
          "return_number": true,
          "target_response": ["sentence_embedding"]
        },
        "model_input": "{ \"text_docs\": ${input_map.text_docs}, \"return_number\": ${model_config.return_number}, \"target_response\": ${model_config.target_response} }",
        "input_map": [
          {
            "text_docs": "passage_text"
          }
        ],
        "output_map": [
          {
            "passage_embedding": "$.inference_results.*.output.*.data"
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
    "passage_text": {
      "value": "hello"
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Response

The response confirms that the processor has generated text embeddings in the `passage_embedding` field:

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
        "_id": "1",
        "_score": 0.00009405752,
        "_source": {
          "passage_text": "hello world",
          "passage_embedding": [
            0.017304314,
            -0.021530833,
            0.050184276,
            0.08962978,
            ...]
        }
      }
    ]
  }
}
```

### Example: Externally hosted text embedding model

The following example shows you how to configure an `ml_inference` search response processor with an externally hosted model.

**Step 1: Create a pipeline**

The following example shows you how to create a search pipeline for an externally hosted text embedding model. The model requires an `input` field and generates results in a `data` field. It converts the text in the `passage_text` field into text embeddings and stores the embeddings in the `passage_embedding` field. The `function_name` is not explicitly specified in the processor configuration, so it defaults to `remote`, signifying an externally hosted model:

```json
PUT /_search/pipeline/ml_inference_pipeline
{
  "description": "Generate passage_embedding when search documents",
  "response_processors": [
    {
      "ml_inference": {
        "model_id": "<your model id>",
        "input_map": [
          {
            "input": "passage_text"
          }
        ],
        "output_map": [
          {
            "passage_embedding": "data"
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
    "input": [
      {
        ...
      }
    ]
  }
}
```

When specifying the `input_map` for an externally hosted model, you can directly reference the `input` field instead of providing its dot path `parameters.input`:

```json
"input_map": [
  {
    "input": "passage_text"
  }
]
```

**Step 2: Run the pipeline**

Run the following query, providing the pipeline name in the request:

```json
GET /my_index/_search?search_pipeline=ml_inference_pipeline_local
{
  "query": {
    "match_all": {
    }
  }
}
```
{% include copy-curl.html %}

The response confirms that the processor has generated text embeddings in the `passage_embedding` field. The document within `_source` now contains both the `passage_text` and `passage_embedding` fields:

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
        "_id": "1",
        "_score": 0.00009405752,
        "_source": {
          "passage_text": "hello world",
          "passage_embedding": [
            0.017304314,
            -0.021530833,
            0.050184276,
            0.08962978,
            ...]
        }
      }
      }
    ]
  }
}
```

### Example: Externally hosted large language model

This example demonstrates how to configure an `ml_inference` search response processor to work with an externally hosted large language model (LLM) and map the model's response to the search extension object. Using the `ml_inference` processor, you can enable an LLM to summarize search results directly within the response. The summary is included in the `ext` field of the search response, providing seamless access to AI-generated insights alongside the original search results.

**Prerequisite**

You must configure an externally hosted LLM for this use case. For more information about externally hosted models, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/). Once you register the LLM, you can use the following request to test it. This request requires providing the `prompt` and `context` fields:

```json
POST /_plugins/_ml/models/KKne6JIBAs32TwoK-FFR/_predict
{
  "parameters": {
    "prompt":"\n\nHuman: You are a professional data analysist. You will always answer question: Which month had the lowest customer acquisition cost per new customer? based on the given context first. If the answer is not directly shown in the context, you will analyze the data and find the answer. If you don't know the answer, just say I don't know. Context: ${parameters.context.toString()}. \n\n Assistant:",
    "context":"Customer acquisition cost: January: $50, February: $45, March: $40. New customers: January: 500, February: 600, March: 750"
  }
}
```
{% include copy-curl.html %}

The response contains the model output in the `inference_results` field:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "dataAsMap": {
            "response": """ Based on the data provided:

                        - Customer acquisition cost in January was $50 and new customers were 500. So cost per new customer was $50/500 = $0.10
                        - Customer acquisition cost in February was $45 and new customers were 600. So cost per new customer was $45/600 = $0.075
                        - Customer acquisition cost in March was $40 and new customers were 750. So cost per new customer was $40/750 = $0.053
            
                        Therefore, the month with the lowest customer acquisition cost per new customer was March, at $0.053."""
          }
        }
      ],
      "status_code": 200
    }
  ]
}
```

**Step 1: Create a pipeline**

Create a search pipeline for the registered model. The model requires a `context` field as input. The model response summarizes the text in the `review` field and stores the summary in the `ext.ml_inference.llm_response` field of the search response:

```json
PUT /_search/pipeline/my_pipeline_request_review_llm
{
  "response_processors": [
    {
      "ml_inference": {
        "tag": "ml_inference",
        "description": "This processor is going to run llm",
        "model_id": "EOF6wJIBtDGAJRTD4kNg",
        "function_name": "REMOTE",
        "input_map": [
          {
            "context": "review"
          }
        ],
        "output_map": [
          {
            "ext.ml_inference.llm_response": "response"
          }
        ],
        "model_config": {
          "prompt": "\n\nHuman: You are a professional data analysist. You will always answer question: Which month had the lowest customer acquisition cost per new customer? based on the given context first. If the answer is not directly shown in the context, you will analyze the data and find the answer. If you don't know the answer, just say I don't know. Context: ${parameters.context.toString()}. \n\n Assistant:"
        },
        "ignore_missing": false,
        "ignore_failure": false
      }
    }
  ]
}
```
{% include copy-curl.html %}

In this configuration, you've provided the following parameters:

- The `model_id` parameter specifies the ID of the generative AI model.
- The `function_name` parameter is set to `REMOTE`, indicating that the model is hosted externally.
- The `input_map` parameter maps the review field from the document to the context field expected by the model.
- The `output_map` parameter specifies that the model's response should be stored in `ext.ml_inference.llm_response` in the search response.
- The `model_config` parameter includes a prompt that tells the model how to process the input and generate a summary.

**Step 2: Index sample documents**

Index some sample documents to test the pipeline:

```json
POST /_bulk
{"index":{"_index":"review_string_index","_id":"1"}}
{"review":"Customer acquisition cost: January: $50, New customers: January: 500."}
{"index":{"_index":"review_string_index","_id":"2"}}
{"review":"Customer acquisition cost: February: $45, New customers: February: 600."}
{"index":{"_index":"review_string_index","_id":"3"}}
{"review":"Customer acquisition cost: March: $40, New customers: March: 750."}
```
{% include copy-curl.html %}

**Step 3: Run the pipeline**

Run a search query using the pipeline:

```json
GET /review_string_index/_search?search_pipeline=my_pipeline_request_review_llm
{
  "query": {
    "match_all": {}
  }
}
```
{% include copy-curl.html %}

The response includes the original documents and the generated summary in the `ext.ml_inference.llm_response` field:

```json
{
  "took": 1,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "review_string_index",
        "_id": "1",
        "_score": 1,
        "_source": {
          "review": "Customer acquisition cost: January: $50, New customers: January: 500."
        }
      },
      {
        "_index": "review_string_index",
        "_id": "2",
        "_score": 1,
        "_source": {
          "review": "Customer acquisition cost: February: $45, New customers: February: 600."
        }
      },
      {
        "_index": "review_string_index",
        "_id": "3",
        "_score": 1,
        "_source": {
          "review": "Customer acquisition cost: March: $40, New customers: March: 750."
        }
      }
    ]
  },
  "ext": {
    "ml_inference": {
      "llm_response": """ Based on the context provided:

      - Customer acquisition cost in January was $50 and new customers were 500. So the cost per new customer was $50/500 = $0.10

      - Customer acquisition cost in February was $45 and new customers were 600. So the cost per new customer was $45/600 = $0.075

      - Customer acquisition cost in March was $40 and new customers were 750. So the cost per new customer was $40/750 = $0.053

      Therefore, the month with the lowest customer acquisition cost per new customer was March, as it had the lowest cost per customer of $0.053."""
    }
  }
}
```

### Example: Reranking search results using a text similarity model

The following example shows you how to configure an `ml_inference` search response processor with a text similarity model.

**Prerequisite**

You must configure an externally hosted text similarity model for this use case. For more information about externally hosted models, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/). Once you register the text similarity model, you can use the following request to test it. This request requires that you provide the `text` and `text_pair` fields within the `inputs` field:

```json
POST /_plugins/_ml/models/Ialx65IBAs32TwoK1lXf/_predict
{
  "parameters": {
    "inputs":
    {
      "text": "I like you",
      "text_pair": "I hate you"
    }
  }
}
```
{% include copy-curl.html %}

The model returns similarity scores for each input document:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "dataAsMap": {
            "label": "LABEL_0",
            "score": 0.022704314440488815
          }
        }
      ],
      "status_code": 200
    }
  ]
}
```
{% include copy-curl.html %}

**Step 1: Index sample documents**

Create an index and add some sample documents:

```json
POST _bulk
{"index":{"_index":"demo-index-0","_id":"1"}}
{"diary":"I hate you"}
{"index":{"_index":"demo-index-0","_id":"2"}}
{"diary":"I love you"}
{"index":{"_index":"demo-index-0","_id":"3"}}
{"diary":"I dislike you"}
```
{% include copy-curl.html %}

**Step 2: Create a search pipeline**

For this example, you'll create a search pipeline that uses a text similarity model in a `one-to-one` inference mode, processing each document in the search results individually. This setup allows the model to make one prediction request per document, providing specific relevance insights for each search hit. When using `input_map` to map the search request to query text, the JSON path must start with `$._request` or `_request`:

```json
PUT /_search/pipeline/my_rerank_pipeline
{
  "response_processors": [
    {
      "ml_inference": {
        "tag": "ml_inference",
        "description": "This processor runs ml inference during search response",
        "model_id": "Ialx65IBAs32TwoK1lXf",
        "model_input":"""{"parameters":{"inputs":{"text":"${input_map.text}","text_pair":"${input_map.text_pair}"}}}""",
        "function_name": "REMOTE",
        "input_map": [
          {
            "text": "diary",
            "text_pair":"$._request.query.term.diary.value"
          }
        ],
        "output_map": [
          {
            "rank_score": "$.score"
          }
        ],
        "full_response_path": false,
        "model_config": {},
        "ignore_missing": false,
        "ignore_failure": false,
        "one_to_one": true
        },
        "rerank": {
          "by_field": {
            "target_field": "rank_score",
            "remove_target_field": true
          }
        }
    }
  ]
}
```
{% include copy-curl.html %}

In this configuration, you've provided the following parameters:

- The `model_id` parameter specifies the unique identifier of the text similarity model.
- The `function_name` parameter is set to `REMOTE`, indicating that the model is hosted externally.
- The `input_map` parameter maps the `diary` field from each document to the `text` input of the model as well as the search query term to the `text_pair` input.
- The `output_map` parameter maps the model's score to a field named `rank_score` in each document.
- The `model_input` parameter formats the input for the model, ensuring that it matches the structure expected by the Predict API.
- The `one_to_one` parameter is set to `true`, ensuring that the model processes each document individually rather than batching multiple documents together.
- The `ignore_missing` parameter is set to `false`, causing the processor to fail if the mapped fields are missing from a document.
- The `ignore_failure` parameter is set to `false`, causing the entire pipeline to fail if the ML inference processor encounters an error.

The `rerank` processor is applied after ML inference. It reorders the documents based on the `rank_score` field generated by the ML model and then removes this field from the final results.

**Step 3: Run the pipeline**

Now perform a search using the created pipeline:

```json
GET /demo-index-0/_search?search_pipeline=my_rerank_pipeline
{
  "query": {
    "term": {
      "dairy": {
        "value": "today"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response includes the original documents and their reranked scores:

```json
{
  "took": 2,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": 0.040183373,
    "hits": [
      {
        "_index": "demo-index-0",
        "_id": "1",
        "_score": 0.040183373,
        "_source": {
          "diary": "I hate you"
        }
      },
      {
        "_index": "demo-index-0",
        "_id": "2",
        "_score": 0.022628736,
        "_source": {
          "diary": "I love you"
        }
      },
      {
        "_index": "demo-index-0",
        "_id": "3",
        "_score": 0.0073115323,
        "_source": {
          "diary": "I dislike you"
        }
      }
    ]
  },
  "profile": {
    "shards": []
  }
}
```

## Next steps

- See a comprehensive example of [reranking by a field using an externally hosted cross-encoder model]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/rerank-by-field-cross-encoder/).