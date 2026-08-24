---
layout: default
title: Text embedding
parent: Ingest processors
nav_order: 260
redirect_from:
   - /api-reference/ingest-apis/processors/text-embedding/
---

# Text embedding processor

The `text_embedding` processor is used to generate vector embeddings from text fields for [semantic search]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/). 

**PREREQUISITE**<br>
Before using the `text_embedding` processor, you must set up a machine learning (ML) model. For more information, see [Choosing a model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/integrating-ml-models/#choosing-a-model).
{: .note}

**Token limits and truncation**: Text embedding models have maximum token limits (typically 512 tokens for BERT-based models). When a document exceeds this limit, the model automatically truncates the text, and the truncated content is not represented in the embeddings. This can significantly impact search relevance because documents may not be returned in search results if the relevant content was truncated. To avoid this issue, split long documents into smaller chunks before generating embeddings. 
{: .warning}

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
{% include copy.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `text_embedding` processor.

| Parameter  | Data type | Required/Optional  | Description  |
|:---|:---|:---|:---|
`model_id` | String | Required | The ID of the model that will be used to generate the embeddings. The model must be deployed in OpenSearch before it can be used in neural search. For more information, see [Using custom models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/using-ml-models/) and [Semantic search]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/).
`field_map` | Object | Required | Contains key-value pairs that specify the mapping of a text field to a vector field.
`field_map.<input_field>` | String | Required | The name of the field from which to obtain text for generating text embeddings.
`field_map.<vector_field>`  | String | Required | The name of the vector field in which to store the generated text embeddings. For a nested input field, specify only the field name and not the full path. For more information, see [Embedding a nested field](#embedding-a-nested-field).
`description`  | String | Optional  | A brief description of the processor.  |
`tag` | String | Optional | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type. |
`batch_size` | Integer | Optional | Specifies the number of documents to be batched and processed each time. Default is `1`. |
`if` | String containing a Boolean expression | Optional | A condition for running the processor.|
`ignore_failure` | Boolean | Optional | Specifies whether the processor continues execution even if it encounters an error. If set to `true`, the processor failure is ignored. Default is `false`.|
`on_failure` | List | Optional | A list of processors to run if the processor fails. |
`skip_existing` | Boolean | Optional | When `true`, the processor compares the incoming document with the document already indexed under the same document ID. If the input text is unchanged and the indexed document already contains embeddings, the processor makes no inference call and copies the existing embeddings. Because the comparison requires an indexed document, this parameter has no effect in `_simulate` requests. Default is `false`.|

## Using the processor

Follow these steps to use the processor in a pipeline. You must provide a model ID when creating the processor. For more information, see [Using custom models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/using-ml-models/). 

### Step 1: Create a pipeline

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

Creating the pipeline does not validate `model_id`. The request succeeds even if the model does not exist or is not deployed, and the error appears only when you ingest a document. Test the pipeline before ingesting documents.
{: .note}

### Step 2: Test the pipeline

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

If a document does not contain the input field, the processor makes no inference call and indexes the document without the vector field. No error is returned, so confirm that your documents contain the input field.
{: .note}

Once you have created an ingest pipeline, you need to create an index for ingestion and ingest documents into the index. To learn more, see [Step 2: Create an index for ingestion]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/#step-2-create-an-index-for-ingestion) and [Step 3: Ingest documents into the index]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/#step-3-ingest-documents-into-the-index) of [Semantic search]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/).

## Embedding a nested field

To generate embeddings from a field nested in an object, specify the full path of the input field and only the field name of the vector field. The processor stores the vector field in the same object as the input field.

The following example request creates a pipeline that generates embeddings from `obj.passage_text` and stores them in `obj.passage_embedding`:

```json
PUT /_ingest/pipeline/nlp-nested-ingest-pipeline
{
  "description": "A text embedding pipeline for a nested field",
  "processors": [
    {
      "text_embedding": {
        "model_id": "<model_id>",
        "field_map": {
          "obj.passage_text": "passage_embedding"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

If you specify the full path (`obj.passage_embedding`) as the vector field, the processor resolves the path relative to the object containing the input field and stores the embeddings in `obj.obj.passage_embedding`.

## Next steps

- To learn how to use the `neural` query for text search, see [Neural query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural/).
- To learn more about semantic search, see [Semantic search]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/).
- To learn more about using models in OpenSearch, see [Choosing a model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/integrating-ml-models/#choosing-a-model).
- For a comprehensive example, see [Getting started with semantic and hybrid search]({{site.url}}{{site.baseurl}}/search-plugins/neural-search-tutorial/).
