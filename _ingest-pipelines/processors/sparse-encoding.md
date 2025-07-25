---
layout: default
title: Sparse encoding
parent: Ingest processors
nav_order: 240
redirect_from:
   - /api-reference/ingest-apis/processors/sparse-encoding/
canonical_url: https://docs.opensearch.org/latest/ingest-pipelines/processors/sparse-encoding/
---

# Sparse encoding processor

The `sparse_encoding` processor is used to generate a sparse vector/token and weights from text fields for [neural sparse search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/) using sparse retrieval. 

**PREREQUISITE**<br>
Before using the `sparse_encoding` processor, you must set up a machine learning (ML) model. For more information, see [Choosing a model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/integrating-ml-models/#choosing-a-model).
{: .note}

The following is the syntax for the `sparse_encoding` processor: 

```json
{
  "sparse_encoding": {
    "model_id": "<model_id>",
    "field_map": {
      "<input_field>": "<vector_field>"
    }
  }
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `sparse_encoding` processor.

| Parameter  | Data type | Required/Optional  | Description  |
|:---|:---|:---|:---|
`model_id` | String | Required | The ID of the model that will be used to generate the embeddings. The model must be deployed in OpenSearch before it can be used in neural search. For more information, see [Using custom models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/using-ml-models/) and [Neural sparse search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/).
`prune_type` | String | Optional | The prune strategy for sparse vectors. Valid values are `max_ratio`, `alpha_mass`, `top_k`, `abs_value`, and `none`. Default is `none`.
`prune_ratio` | Float | Optional | The ratio for the pruning strategy. Required when `prune_type` is specified.
`field_map` | Object | Required | Contains key-value pairs that specify the mapping of a text field to a `rank_features` field.
`field_map.<input_field>` | String | Required | The name of the field from which to obtain text for generating vector embeddings.
`field_map.<vector_field>`  | String | Required | The name of the vector field in which to store the generated vector embeddings.
`description`  | String | Optional  | A brief description of the processor.  |
`tag` | String | Optional | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type. |
`batch_size` | Integer | Optional | Specifies the number of documents to be batched and processed each time. Default is `1`. |

### Pruning sparse vectors

A sparse vector often has a long-tail distribution of token weights, with less important tokens occupying a significant amount of storage space. Pruning reduces the size of an index by removing tokens with lower semantic importance, yielding a slight decrease in search relevance in exchange for a more compact index.

The `sparse_encoding` processor can be used to prune sparse vectors by configuring the `prune_type` and `prune_ratio` parameters. The following table lists the supported pruning options for the `sparse_encoding` processor. 

| Pruning type  | Valid pruning ratio | Description  |
|:---|:---|:---|
`max_ratio` | Float [0, 1) | Prunes a sparse vector by keeping only elements whose values are within the `prune_ratio` of the largest value in the vector.
`abs_value` | Float (0, +∞) | Prunes a sparse vector by removing elements with values lower than the `prune_ratio`.
`alpha_mass` | Float [0, 1) | Prunes a sparse vector by keeping only elements whose cumulative sum of values is within the `prune_ratio` of the total sum.
`top_k` | Integer (0, +∞) | Prunes a sparse vector by keeping only the top `prune_ratio` elements.
none | N/A | Leaves sparse vectors unchanged.

Among all pruning options, specifying `max_ratio` as equal to `0.1` demonstrates strong generalization on test datasets. This approach reduces storage requirements by approximately 40% while incurring less than a 1% loss in search relevance.

## Using the processor

Follow these steps to use the processor in a pipeline. You must provide a model ID when creating the processor. For more information, see [Using custom models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/using-ml-models/). 

**Step 1: Create a pipeline.** 

The following example request creates an ingest pipeline where the text from `passage_text` will be converted into text embeddings and the embeddings will be stored in `passage_embedding`:

```json
PUT /_ingest/pipeline/nlp-ingest-pipeline
{
  "description": "A sparse encoding ingest pipeline",
  "processors": [
    {
      "sparse_encoding": {
        "model_id": "aP2Q8ooBpBj3wT4HVS8a",
        "prune_type": "max_ratio",
        "prune_ratio": 0.1,
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
  "docs" : [
    {
      "doc" : {
        "_index" : "testindex1",
        "_id" : "1",
        "_source" : {
          "passage_embedding" : {
            "!" : 0.8708904,
            "door" : 0.8587369,
            "hi" : 2.3929274,
            "worlds" : 2.7839446,
            "yes" : 0.75845814,
            "##world" : 2.5432441,
            "nothing" : 0.8625516,
            "greeting" : 0.96817183,
            "birth" : 1.2788506,
            "life" : 1.5750692,
            "world" : 4.7300377,
            "earth" : 2.6555297,
            "universe" : 2.0308156,
            "worldwide" : 1.3903781,
            "hello" : 6.696973,
            "?" : 0.67785245
          },
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

Once you have created an ingest pipeline, you need to create an index for ingestion and ingest documents into the index. To learn more, see [Create an index for ingestion]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-with-pipelines/#step-2b-create-an-index-for-ingestion) and [Step 3: Ingest documents into the index]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-with-pipelines/#step-2c-ingest-documents-into-the-index) of [Neural sparse search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/).

---

## Next steps

- To learn how to use the `neural_sparse` query for a sparse search, see [Neural sparse query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural-sparse/).
- To learn more about sparse search, see [Neural sparse search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/).
- To learn more about using models in OpenSearch, see [Choosing a model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/integrating-ml-models/#choosing-a-model).
- For a comprehensive example, see [Getting started with semantic and hybrid search]({{site.url}}{{site.baseurl}}/search-plugins/neural-search-tutorial/).
