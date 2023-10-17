---
layout: default
title: Text embedding
parent: Ingest processors
nav_order: 260
redirect_from:
   - /api-reference/ingest-apis/processors/text-embedding/
---

# Text embedding

The `text_embedding` processor is used to generate vector embeddings from text fields for [neural search]({{site.url}}{{site.baseurl}}/search-plugins/neural-search/). 

**PREREQUISITE**<br>
Before using the `text_embedding` processor, you must set up a machine learning (ML) model. For more information, see [Using custom models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/ml-framework/) and [Semantic search]({{site.url}}{{site.baseurl}}/ml-commons-plugin/semantic-search/).
{: .note}

The following is the syntax for the `text_embedding` processor: 

```json
{
  "text_embedding": {
    "model_id": "<model_id>",
    "field_map": {
      "<input_field>": "<vector_field>"
    }
  }
}
```
{% include copy-curl.html %}

#### Configuration parameters

The following table lists the required and optional parameters for the `text_embedding` processor.

| Name  | Data type | Required  | Description  |
|:---|:---|:---|:---|
`model_id` | String | Required | The ID of the model that will be used to generate the embeddings. The model must be deployed in OpenSearch before it can be used in neural search. For more information, see [Using custom models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/ml-framework/) and [Semantic search]({{site.url}}{{site.baseurl}}/ml-commons-plugin/semantic-search/).
`field_map` | Object | Required | Contains key-value pairs that specify the mapping of a text field to a vector field.
`field_map.<input_field>` | String | Required | The name of the field from which to obtain text for generating text embeddings.
`field_map.<vector_field>`  | String | Required | The name of the vector field in which to store the generated text embeddings.
`description`  | String | Optional  | A brief description of the processor.  |
`tag` | String | Optional | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type. |

## Using the processor

Follow these steps to use the processor in a pipeline. You must provide a model ID when creating the processor. For more information, see [Using custom models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/ml-framework/). 

**Step 1: Create a pipeline.** 

The following example request creates an ingest pipeline where the text from `passage_text` will be converted into text embeddings and the embeddings will be stored in `passage_embedding`:

```json
PUT /_ingest/pipeline/nlp-ingest-pipeline
{
  "description": "A text embedding pipeline",
  "processors": [
    {
      "text_embedding": {
        "model_id": "bQ1J8ooBpBj3wT4HVUsb",
        "field_map": {
          "passage_text": "passage_embedding"
        }
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
POST _ingest/pipeline/nlp-ingest-pipeline/_simulate
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
  "docs": [
    {
      "doc": {
        "_index": "testindex1",
        "_id": "1",
        "_source": {
          "passage_embedding": [
            -0.048237972,
            -0.07612712,
            0.3262124,
            ...
            -0.16352308
          ],
          "passage_text": "hello world"
        },
        "_ingest": {
          "timestamp": "2023-10-05T15:15:19.691345393Z"
        }
      }
    }
  ]
}
```

## Next steps

- To learn how to use the `neural` query for text search, see [Neural query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural/).
- To learn more about neural text search, see [Text search]({{site.url}}{{site.baseurl}}/search-plugins/neural-text-search/).
- To learn more about using models in OpenSearch, see [Using custom models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/ml-framework/).
- For a semantic search tutorial, see [Semantic search]({{site.url}}{{site.baseurl}}/ml-commons-plugin/semantic-search/).