---
layout: default
title: ML inference
parent: Ingest processors
nav_order: 240
redirect_from:
- /api-reference/ingest-apis/processors/ml-inference/
---

# ML inference processor

The ml_inference processor is used to generate inferences from machine learning models connected to the OpenSearch ML Commons plugin. The inferences are added as new fields to the ingested documents.


**PREREQUISITE**<br>
Before using the ml_inference processor, you must have a machine learning model connected to the OpenSearch cluster through the ML Commons plugin.  For more information, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/).



The following is the syntax for the `ml-inference` processor:

```json
{
  "ml_inference": {
    "model_id": "<model_id>",
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
    "model_config":{
      "<model_config_field>": "<config_value>"
    }
  }
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `ml-inference` processor.

| Parameter | Data type | Required/Optional | Description                                                                                                                                                                                                                                                                                                                                                                                                       |
|:---|:----------|:---|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `model_id` | String    | Required | The ID of the machine learning model connected to the OpenSearch cluster through the ML Commons plugin.                                                                                                                                                                                                                                                                                                           |
| `input_map` | Array     | Optional | An array specifying how to map fields from the ingested document to the model's input. If no input mapping is specified, all fields from the document will be used as the model input by default. The size of input_map indicates the number of prediction tasks. In each map, the key represents the model input field name, and the value represents the document field name used to construct the model input. |
| `input_map.<input_key>` | String    | Optional | The model input field name.                                                                                                                                                                                                                                                                                                                                                                                       |
| `input_map.<input_field>` | String    | Optional | The name of the field from the ingested document to be used as the model's input.                                                                                                                                                                                                                                                                                                                                 |
| `output_map` | Array     | Optional | An array specifying how to map the model's output to new fields in the ingested document.                                                                                                                                                                                                                                                                                                                         |
| `output_map.<output_field>` | String    | Optional | The name of the new field in the ingested document where the model's output (specified by the output_key) will be stored. If no output mapping is specified, all fields from the model prediction output will be added to the new document field by default.                                                                                                                                                      |
| `output_map.<output_key>` | String    | Optional | The key representing the model's output to be stored in the output_field.                                                                                                                                                                                                                                                                                                                                         |
| `model_config` | Object    | Optional | Custom configuration options for the machine learning model.                                                                                                                                                                                                                                                                                                                                                      |
| `max_prediction_tasks` | Int       | Optional | The setting of the maximum number of prediction tasks can run when ingesting a document, default value is 10.                                                                                                                                                                                                                                                                                                     |
| `description` | String    | Optional | A brief description of the processor.                                                                                                                                                                                                                                                                                                                                                                             |
| `tag` | String    | Optional | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type.                                                                                                                                                                                                                                                                                                     |
| `ignore_missing` | Boolean   | Optional | If true and any of the input fields defined in input_map or output_map are missing, those missing fields are quietly ignored. Otherwise, a missing field causes a failure. Default is false.                                                                                                                                                                                                                      |
| `ignore_failure` | Boolean   | Optional | If true and any exceptions occur, they are quietly ignored, and the ingestion continues. Otherwise, an exception can occur and cancel the ingestion. Default is false.                                                                                                                                                                                                                                             |

## Using the processor

Follow these steps to use the processor in a pipeline. You must provide a model ID when creating the processor. Currently, only remote models are supported. For more information about creating remote models, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/).

**Step 1: Create a pipeline.**

The following example request creates an ingest pipeline where the model requires an `input` field and produces a `data` field in the prediction task and the document has a `passage_text` field, which will be converted into text embeddings and the embeddings will be stored in `passage_embedding` field. 

The mappings for input_map and output_map also support standard [JsonPath](https://docs.oracle.com/cd/E60058_01/PDF/8.0.8.x/8.0.8.0.0/PMF_HTML/JsonPath_Expressions.htm) notation to complex data structures.

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

**Step 2 (Optional): Test the pipeline.**

It is recommended that you test your pipeline before you ingest documents.
{: .tip}

To test the pipeline, run the following query:

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

The response confirms that in addition to the `passage_text` field, the processor has generated text embeddings in the `passage_embedding` field:

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
            0.08962978
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

---
#### Limitation

Currently, ml inference processor only supports remote models connected through a connector. Local models uploaded to OpenSearch cluster are not supported. Watch the future versions for new releases.

