---
layout: default
title: ML inference (response) 
nav_order: 40
has_children: false
parent: Search processors
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
| `model_config`         | Object    | Optional   | Custom configuration options for the ML model. For more information, see [The `model_config` object]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/#the-model_config-object).|
| `model_input`          | String    | Optional for externally hosted models<br/><br/>Required for local models | A template that defines the input field format expected by the model. Each local model type might use a different set of inputs. For externally hosted models, default is `"{ \"parameters\": ${ml_inference.parameters} }`. |
| `input_map`            | Array | Optional for externally hosted models<br/><br/>Required for local models | An array specifying how to map document fields in the search response to the model input fields. Each element of the array is a map in the `"<model_input_field>": "<document_field>"` format and corresponds to one model invocation of a document field. If no input mapping is specified for an externally hosted model, then all document fields are passed to the model directly as input. The `input_map` size indicates the number of times the model is invoked (the number of Predict API requests). |
| `<model_input_field>`  | String    | Optional for externally hosted models<br/><br/>Required for local models  | The model input field name. |
| `<document_field>`     | String    | Optional for externally hosted models<br/><br/>Required for local models | The name or JSON path of the document field in the search response used as the model input.  |
| `output_map`           | Array | Optional for externally hosted models<br/><br/>Required for local models | An array specifying how to map the model output fields to new fields in the search response document. Each element of the array is a map in the `"<new_document_field>": "<model_output_field>"` format. |
| `<new_document_field>` | String    | Optional for externally hosted models<br/><br/>Required for local models | The name of the new field in the document in which the model's output (specified by `model_output`) is stored. If no output mapping is specified for externally hosted models, then all fields from the model output are added to the new document field.  |
| `<model_output_field>` | String    | Optional for externally hosted models<br/><br/>Required for local models | The name or JSON path of the field in the model output to be stored in the `new_document_field`.  |
| `full_response_path`   | Boolean   | Optional   | Set this parameter to `true` if the `model_output_field` contains a full JSON path to the field instead of the field name. The model output will then be fully parsed to get the value of the field. Default is `true` for local models and `false` for externally hosted models.  |
| `ignore_missing`       | Boolean   | Optional  | If `true` and any of the input fields defined in the `input_map` or `output_map` are missing, then the missing fields are ignored. Otherwise, a missing field causes a failure. Default is `false`. |
| `ignore_failure`       | Boolean   | Optional  | Specifies whether the processor continues execution even if it encounters an error. If `true`, then any failure is ignored and the search continues. If `false`, then any failure causes the search to be canceled. Default is `false`. |
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

### Example: Externally hosted model

The following example shows you how to configure an `ml_inference` search response processor with an externally hosted model.

**Step 1: Create a pipeline**

The following example shows you how to create a search pipeline for an externally hosted text embedding model. The model requires an `input` field and generates results in a `data` field. It converts the text in the `passage_text` field into text embeddings and stores the embeddings in the `passage_embedding` field. The `function_name` is not explicitly specified in the processor configuration, so it defaults to `remote`, signifying an externally hosted model:

```json
PUT /_search/pipeline/ml_inference_pipeline
{
  "description": "Generate passage_embedding when search documents",
  "processors": [
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
  "processors": [
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

### Example: GENAI Use Case

The following example shows you how to configure an `ml_inference` search response processor with a genai model and mapping the model response to the search extension.

Step 0: Host a model
The pre-requisite is a registered genai model in opensearch. For more information about externally hosted models, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/). Here is a sample predict response using a registered model, which requires a prompt and a context field.

```json
POST /_plugins/_ml/models/EOF6wJIBtDGAJRTD4kNg/_predict  
{
  "parameters": {
    "prompt":"\n\nHuman: You are a professional data analysist. You will always answer question based on the given context first. If the answer is not directly shown in the context, you will analyze the data and find the answer. If you don't know the answer, just say I don't know. Context: ${parameters.context.toString()}. \n\n Human: please summarize the documents \n\n Assistant:",
    "context":"Dr. Eric Goldberg is a fantastic doctor who has correctly diagnosed every issue that my wife and I have had. Unlike many of my past doctors, Dr. Goldberg is very accessible and we have been able to schedule appointments with him and his staff very quickly. We are happy to have him in the neighborhood and look forward to being his patients for many years to come."
  }
}
```


Step 1: Create a pipeline

The following example shows you how to create a search pipeline for a generative AI model. The model requires a context field as input and generates a response. It summarizes the text in the review field and stores the summary in the ext.ml_inference.llm_response field of the search response.

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
          "prompt": "\n\nHuman: You are a professional data analyst. You will always answer questions based on the given context first. If the answer is not directly shown in the context, you will analyze the data and find the answer. If you don't know the answer, just say I don't know. Context: ${parameters.context.toString()}. \n\n Human: please summarize the documents \n\n Assistant:"
        },
        "ignore_missing": false,
        "ignore_failure": false
      }
    }
  ]
}

```
{% include copy-curl.html %}

In this configuration:

The model_id specifies the ID of the generative AI model.
The function_name is set to "REMOTE", indicating an externally hosted model.
The input_map maps the review field from the document to the context field expected by the model.
The output_map specifies that the model's response should be stored in ext.ml_inference.llm_response in the search response.
The model_config includes a prompt that instructs the model on how to process the input and generate a summary.

Step 2: Index sample documents

Index some sample documents to test the pipeline:
```json
PUT /review_string_index/_doc/1
{
  "review": "always my to go place" ,
  "label":"5 stars"
}

PUT /review_string_index/_doc/2
{
  "review": "happy visit" ,
  "label":"5 stars"
}

PUT /review_string_index/_doc/3
{
  "review": "sad place" ,
  "label":"1 stars"
}
```
{% include copy-curl.html %}

Step 3: Run the pipeline

Execute a search query using the pipeline:
```json
GET /review_string_index/_search?search_pipeline=my_pipeline_request_review_llm
{
  "query": {
    "match_all": {}
  }
}
```
{% include copy-curl.html %}

Step 4: Examine the response

The response will include the original documents and the generated summary in the ext.ml_inference.llm_response field:

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
          "review": "always my to go place",
          "label": "5 stars"
        }
      },
      {
        "_index": "review_string_index",
        "_id": "2",
        "_score": 1,
        "_source": {
          "review": "happy visit",
          "label": "5 stars"
        }
      },
      {
        "_index": "review_string_index",
        "_id": "3",
        "_score": 1,
        "_source": {
          "review": "sad place",
          "label": "1 stars"
        }
      }
    ]
  },
  "ext": {
    "ml_inference": {
      "llm_response": "Based on the context provided, here is a summary:\n\nThe context includes 3 short phrases or documents:\n\n1. \"always my to go place\" - This suggests that whatever is being referred to is always the place that someone goes to. It could imply that it is a favorite or preferred location. \n\n2. \"happy visit\" - This directly states that visiting wherever is being discussed results in happiness. \n\n3. \"sad place\" - In contrast to the previous two documents, this one indicates that the place makes someone sad.\n\nIn summary, two of the documents have positive connotations about visiting a particular place, implying it is enjoyed. The third document provides a negative view, saying the place results in sadness. Without more context around what \"place\" is being referred to, it is difficult to draw definitive conclusions. But overall the data provided presents both positive and negative assessments of the same unnamed location."
    }
  }
}
```
{% include copy-curl.html %}
This example demonstrates how the ml_inference search response processor can be used with a generative AI model to provide summarization of search results. The summary is included in the ext field of the search response, allowing for easy access to the AI-generated insights alongside the original search results.


### Example: Rerank Use Case

The following example shows you how to configure an `ml_inference` search response processor with a text similarity model.


Step 0: Host a model
The pre-requisite is a registered genai model in opensearch. For more information about externally hosted models, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/). Here is a sample predict response using a registered model, which requires a prompt and a context field.

```json
POST _plugins/_ml/models/tg5p1ZEB4iWlnHsIh2U9/_predict
{
    "query_text": "today is sunny",
    "text_docs": [
        "how are you",
        "today is sunny",
        "today is july fifth",
        "it is winter"
    ]
}
```

The model returns similarity scores for each input document:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "similarity",
          "data_type": "FLOAT32",
          "shape": [1],
          "data": [-11.055183]
        }
      ]
    },
    {
      "output": [
        {
          "name": "similarity",
          "data_type": "FLOAT32",
          "shape": [1],
          "data": [8.969885]
        }
      ]
    },
    {
      "output": [
        {
          "name": "similarity",
          "data_type": "FLOAT32",
          "shape": [1],
          "data": [-5.736347]
        }
      ]
    },
    {
      "output": [
        {
          "name": "similarity",
          "data_type": "FLOAT32",
          "shape": [1],
          "data": [-10.0452175]
        }
      ]
    }
  ]
}
```
{% include copy-curl.html %}

Step 1: Index sample documents

Create an index and add some sample documents:

```json
PUT /demo-index-0/_doc/1
{
  "dairy": "how are you"
}

PUT /demo-index-0/_doc/2
{
  "dairy": "today is sunny"
}

PUT /demo-index-0/_doc/3
{
  "dairy": "today is july fifth"
}

PUT /demo-index-0/_doc/4
{
  "dairy": "it is winter"
}

```
{% include copy-curl.html %}

Step 2: Create a search pipeline

Create a search pipeline that uses the text similarity model:

```json
PUT /_search/pipeline/my_pipeline
{
  "response_processors": [
    {
      "ml_inference": {
        "tag": "ml_inference",
        "description": "This processor runs ml inference during search response",
        "model_id": "tg5p1ZEB4iWlnHsIh2U9",
        "model_input": "{ \"text_docs\": ${input_map.text_docs}, \"query_text\": \"${input_map.query_text}\" }",
        "function_name": "TEXT_SIMILARITY",
        "input_map": [
          {
            "text_docs": "dairy",
            "query_text": "$.query.term.dairy.value"          
          }
        ],
        "output_map": [
          {
            "rank_score": "$.inference_results[*].output[*].data"
          }
        ],
        "full_response_path": false,
        "model_config": {},
        "ignore_missing": false,
        "ignore_failure": false
      }
    }
  ]
}
```
{% include copy-curl.html %}

This pipeline configuration:

Uses the text similarity model with ID tg5p1ZEB4iWlnHsIh2U9.
Maps the dairy field from documents to the text_docs input of the model.
Extracts the query text from the search request's term query.
Maps the model's output to a new rank_score field in the search results.

Step 3: Run the pipeline

Now, perform a search using the created pipeline:

```json
GET /demo-index-0/_search?search_pipeline=my_pipeline
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

The response includes the original documents along with their calculated rank scores:

```json
{
  "took": 400,
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
    "max_score": 0.71566814,
    "hits": [
      {
        "_index": "demo-index-0",
        "_id": "2",
        "_score": 0.71566814,
        "_source": {
          "dairy": "today is sunny",
          "rank_score": [
            3.6144485
          ]
        }
      },
      {
        "_index": "demo-index-0",
        "_id": "3",
        "_score": 0.6333549,
        "_source": {
          "dairy": "today is july fifth",
          "rank_score": [
            3.6144485
          ]
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}