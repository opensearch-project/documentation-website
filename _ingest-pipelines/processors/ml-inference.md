---
layout: default
title: ML inference
parent: Ingest processors
nav_order: 240
redirect_from:
- /api-reference/ingest-apis/processors/ml-inference/
---

# ML inference processor

The `ml_inference` processor is used to generate inferences from machine learning (ML) models connected to the [OpenSearch ML Commons plugin]({{site.url}}{{site.baseurl}}/ml-commons-plugin/). The inferences are added as new fields to the ingested documents.

**PREREQUISITE**<br>
Before using the `ml_inference` processor, you must have either a local ML model hosted on your OpenSearch cluster or a remote model connected to your OpenSearch cluster through the ML Commons plugin.

For more information on remote models, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/).

For more information on local models, see [Using ML models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/using-ml-models/).

## Syntax

The following is the syntax for the `ml-inference` processor:

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
        "<model_input>": "<document_field>"
      }
    ],
    "output_map": [
      {
        "<new_document_field>": "<model_output>"
      }
    ],
    "override": "<override>"
  }
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `ml-inference` processor.

| Parameter                   | Data type | Required/Optional                                                                                            | Description                                                                                                                                                                                                                                                                                                                                                                                                                   |
|:----------------------------|:----------|:-------------------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `model_id`                  | String    | Required                                                                                                     | The ID of the ML model to be used by the processor.                                                                                                                                                                                                                                                                                                                                                                           |
| `function_name`             | String    | Optional for remote models.<br/>Required for local models                                                    | The function name of the ML model configured in the processor. The default value is `remote`                                                                                                                                                                                                                                                                                                                                  |
| `input_map`                 | Array     | Optional for remote models.<br/>Required for local models                                                    | An array specifying how to map fields from the ingested document to the model's input. If no input mapping is specified for remote models, then all fields from the document are used as the model input by default. The `input_map` size indicates the number of prediction tasks. In each map, the key represents the model input field name, and the value specifies the document field used to construct the model input. |
| `input_map.<input_key>`     | String    | Optional for remote models.<br/>Required for local models                                                    | The model input field name.                                                                                                                                                                                                                                                                                                                                                                                                   |
| `input_map.<input_field>`   | String    | Optional for remote models.<br/>Required for local models                                                    | The name or the json path of the field from the ingested document to be used as the model's input.                                                                                                                                                                                                                                                                                                                            |
| `output_map`                | Array     | Optional for remote models.<br/>Required for local models                                                    | An array specifying how to map the model's output to new fields in the ingested document.                                                                                                                                                                                                                                                                                                                                     |
| `output_map.<output_key>`   | String    | Optional for remote models.<br/>Required for local models                                                    | The name of the new field in the ingested document in which the model's output (specified by the `output_field`) is stored. If no output mapping is specified for remote models, then all fields from the model prediction output are added to the new document field by default.                                                                                                                                             |
| `output_map.<output_field>` | String    | Optional for remote models.<br/>Required for local models                                                    | The name or the json path of the field in the model output to be stored in the `output_key`.                                                                                                                                                                                                                                                                                                                                  |
| `full_response_path`        | Boolean   | Optional                                                                                                     | When set to true, the model output will be fully parsed to get the value of the field as specified by the json path in `output_map`'s `output_field`. Default is `True` for local models and `False` for remote models.                                                                                                                                                                                                       |
| `model_config`              | Object    | Optional                                                                                                     | Custom configuration options for the ML model.                                                                                                                                                                                                                                                                                                                                                                                |
| `max_prediction_tasks`      | Integer   | Optional                                                                                                     | The maximum number of concurrent prediction tasks that can run during document ingestion. Default is `10`.                                                                                                                                                                                                                                                                                                                    |
| `description`               | String    | Optional                                                                                                     | A brief description of the processor.                                                                                                                                                                                                                                                                                                                                                                                         |
| `tag`                       | String    | Optional                                                                                                     | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type.                                                                                                                                                                                                                                                                                                                 |
| `model_input`               | String    | Optional for remote models.<br/>Required for local models                                                    | A template to define the format and type of fields for model input. For local models, each model type might use a different set of inputs. This field helps user provide the input format as expected by the model                                                                                                                                                                                                            |
| `ignore_missing`            | Boolean   | Optional                                                                                                     | If `true` and any of the input fields defined in `input_map` or `output_map` are missing, then the missing fields are ignored. Otherwise, a missing field causes a failure. Default is `false`.                                                                                                                                                                                                                               |
| `ignore_failure`            | Boolean   | Optional                                                                                                     | If `true` and any exceptions occur, then they are ignored and ingestion continues. Otherwise, an exception occurs and ingestion is canceled. Default is `false`.                                                                                                                                                                                                                                                              |
| `override`                  | Boolean   | Optional                                                                                                     | When set to true, if the ingest document being processed already contains the field as specified by `output_key` in `output_map`, the input field to be inferenced will be skipped. If set to true, existing value will be overridden by new model output. Default value is set to `False`.                                                                                                                                   |

## Using the processor

Follow these steps to use the processor in a pipeline. You must provide a model ID when creating the processor. 

**Step 1: Create a pipeline**

The following example creates an ingest pipeline where the model requires an `input` field, produces a `data` field for prediction, and converts the `passage_text` field into text embeddings stored in the `passage_embedding` field. The `input_map` and `output_map` mappings support standard JSON path notation for complex data structures.

Since you did not specify the `function_name` in the processor configuration, default is set to "remote" and you cannot use a local model ID here.

```json

PUT /_ingest/pipeline/ml_inference_pipeline
{
  "description": "Generate passage_embedding for ingested documents",
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

**Step 2 (Optional): Test the pipeline**

It is recommended that you test your pipeline before you ingest documents.
{: .tip}

Make sure to have the model successfully deployed when testing or ingesting the documents using the processor

To test the pipeline, run the following query::

```json
POST _ingest/pipeline/ml_inference_pipeline/_simulate
{
  "docs": [
    {
      "_index": "testindex1",
      "_id": "1",
      "_source":{
         "passage_text": "hello world"
      }
    }
  ]
}
```
{% include copy-curl.html %}

#### Response

The response confirms that, in addition to the `passage_text` field, the processor has generated text embeddings in the `passage_embedding` field:

```json
{
  "docs" : [
    {
      "doc" : {
        "_index" : "testindex1",
        "_id" : "1",
        "_source" : {
          "passage_embedding" : [
            0.017304314,
            -0.021530833,
            0.050184276,
            0.08962978,
            ...
          ],
          "passage_text" : "hello world"
        },
        "_ingest" : {
          "timestamp" : "2023-10-11T22:35:53.654650086Z"
        }
      }
    }
  ]
}
```

Once you have created an ingest pipeline, you need to create an index for ingestion and ingest documents into the index.
{: .note}

### Example ingest processor configuration for local models

The following example creates an ingest pipeline for a `SENTENCE_TRANSFORMER` local model that requires an `text_docs` field, produces a `data` field for prediction in the model output path `$.inference_results.*.output.*.data`. The processor converts the `context` field into text embeddings and stores in the `context_embedding` field. The `input_map` and `output_map` mappings support standard JSON path notation for complex data structures. The model used here is a [pretrained model](https://opensearch.org/docs/latest/ml-commons-plugin/pretrained-models/#sentence-transformers) from ml-commons with the name `huggingface/sentence-transformers/all-distilroberta-v1`

For local models, the `model_input` field is mandatory and you should specify the inputs and their formats you want to provide the ML Model. If there are any inputs in `model_config` map to be used by model, they should also be added to `model_input`

For remote models, the `model_input` field is optional and its default value is `"{ \"parameters\": ${ml_inference.parameters} }`.
{: .note}

```json

PUT /_ingest/pipeline/ml_inference_pipeline_local
{
  "description": "ingest reviews and generate embedding",
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
            "text_docs": "book.*.chunk.text.*.context"
          }
        ],
        "output_map": [
          {
            "book.*.chunk.text.*.context_embedding": "$.inference_results.*.output.*.data"
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

To test the above pipeline, run the following query:

```json
POST _ingest/pipeline/ml_inference_pipeline/_simulate
{
  "docs": [
    {
      "_index": "my_books",
      "_id": "1",
      "_source": {
        "book": [
          {
            "chunk": {
              "text": [
                {
                  "chapter": "first chapter",
                  "context": "this is the first part"
                },
                {
                  "chapter": "first chapter",
                  "context": "this is the second part"
                }
              ]
            }
          },
          {
            "chunk": {
              "text": [
                {
                  "chapter": "second chapter",
                  "context": "this is the third part"
                },
                {
                  "chapter": "second chapter",
                  "context": "this is the fourth part"
                }
              ]
            }
          }
        ]
      }
    }
  ]
}

```
{% include copy-curl.html %}

#### Response

The response confirms that, in addition to the `context` field, the processor has generated text embeddings in the `context_embedding` field:

```json
{
  "docs" : [
    {
      "doc" : {
        "_index": "my_books",
        "_id": "1",
        "_source": {
          "book": [
            {
              "chunk": {
                "text": [
                  {
                    "chapter": "first chapter",
                    "context": "this is the first part",
                    "context_embedding": [
                      0.15756914,
                      0.05150984,
                      0.25225413,
                      0.4941875,
                      ...
                    ]
                  },
                  {
                    "chapter": "first chapter",
                    "context": "this is the second part",
                    "context_embedding": [
                      0.10526893,
                      0.026559234,
                      0.28763372,
                      0.4653795,
                      ...
                    ]
                  }
                ]
              }
            },
            {
              "chunk": {
                "text": [
                  {
                    "chapter": "second chapter",
                    "context": "this is the third part",
                    "context_embedding": [
                      0.017304314,
                      -0.021530833,
                      0.050184276,
                      0.08962978,
                      ...
                    ]
                  },
                  {
                    "chapter": "second chapter",
                    "context": "this is the fourth part",
                    "context_embedding": [
                      0.37742054,
                      0.046911318,
                      1.2053889,
                      0.04663613,
                      ...
                    ]
                  }
                ]
              }
            }
          ]
        }
      }
    }
  ]
}
```

---

