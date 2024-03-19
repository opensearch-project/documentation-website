---
layout: default
title: Text chunking
parent: Ingest processors
nav_order: 240
redirect_from:
   - /api-reference/ingest-apis/processors/text-chunking/
---

# Text chunking processor

The `text_chunking` processor is used to chunk a long document into paragraphs. The following is the syntax for the `text_chunking` processor:

```
{
  "text_chunking": {
    "field_map": {
      "<input_field>": "<output_field>"
    },
    "algorithm": {
      "<name>": <parameters>
    }
  }
}
```

## Configuration parameters

The following table lists the required and optional parameters for the `text_chunking` processor.

| Name	                       | Data type	 | Required	 | Description	                                                                                                        |
|-----------------------------|------------|-----------|---------------------------------------------------------------------------------------------------------------------|
| `field_map`	                | Object	    | Required	 | Contains key-value pairs that specify the mapping of a text field to the output field by text chunking processor.	  |
| `field_map.<input_field>`	  | String	    | Required	 | The name of the field from which to obtain text for generating chunked passages.	                                   |
| `field_map.<output_field>`	 | String	    | Required	 | The name of the field in which to store the chunking results.	                                                      |
| `algorithm`	                | Object	    | Required	 | Contains at most one key-value pair that specify the chunking algorithm and parameters.	                            |
| `algorithm.<name>`	         | String	    | Optional	 | The name of the chunking algorithm. Default is `fixed_token_length`.	                                               |
| `algorithm.<parameters>`	   | Object	    | Optional	 | The parameters of the chunking algorithm. Default is the default parameters of the `fixed_token_length` algorithm.	 |
| `description`	              | String	    | Optional	 | A brief description of the processor.	                                                                              |
| `tag`	                      | String	    | Optional	 | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type.	      |

The `algorithm_name` parameter can be either `fixed_token_length` or `delimiter`.

### Fixed token length

The following table lists the optional parameters for the fixed token length algorithm in `text_chunking` processor.

| Name	              | Data type	 | Required	 | Description	                                                                                                                                |
|--------------------|------------|-----------|---------------------------------------------------------------------------------------------------------------------------------------------|
| `token_limit`	     | Integer	   | Optional	 | The token limit for chunking algorithms. Should be an integer at least 1. Default is 384.	                                                  |
| `tokenizer`	       | String	    | Optional	 | The [word tokenizer](https://opensearch.org/docs/latest/analyzers/tokenizers/index/#word-tokenizers) in OpenSearch. Default is `standard`.	 |
| `overlap_rate`	    | String	    | Optional	 | The overlapping degree in token algorithm. Should be a float between 0 and 0.5. Default is 0.	                                              |
| `max_chunk_limit`	 | Integer	   | Optional	 | The chunk limit for chunking algorithms. Default is 100. Users can set this value to -1 to disable this parameter.	                         |

We set the default value of `token_limit` to be 384 so that output paragraphs would not exceed the token limit constraint by downstream text embedding models. In OpenSearch [supported pretrained models](https://opensearch.org/docs/latest/ml-commons-plugin/pretrained-models/#supported-pretrained-models) like `msmarco-distilbert-base-tas-b` and `opensearch-neural-sparse-encoding-v1`  have input token limit with 512. The standard tokenizer in OpenSearch tokenize text according by words. According to [OpenAI](https://platform.openai.com/docs/introduction), 1 token is approximately 0.75 words for English text. The default token limit should be 512 * 0.75 = 384.

Users can set parameter `overlap_rate` from 0 to 50 percent. According to [bedrock](https://aws.amazon.com/blogs/aws/knowledge-bases-now-delivers-fully-managed-rag-experience-in-amazon-bedrock/), we recommend users to set this parameter between 0–20 percent to help improve accuracy.

Parameter `max_chunk_limit` places a restriction on the number of chunked passages. If the chunking results exceed this limit, the algorithm will return an exception to the user, prompting the user to either enlarge or disable this limit.

### Delimiter

The following table lists the optional parameters for the delimiter algorithm in `text_chunking` processor.

| Name	              | Data type	 | Required	 | Description	                                                                                                        |
|--------------------|------------|-----------|---------------------------------------------------------------------------------------------------------------------|
| `delimiter`	       | String	    | Optional	 | A string as the paragraph split indicator. Default is `\n\n`.	                                                      |
| `max_chunk_limit`	 | Integer	   | Optional	 | The chunk limit for chunking algorithms. Default is 100. Users can set this value to -1 to disable this parameter.	 |

Apart from default value `\n\n` , users can set the `delimiter` parameter to be `\n` and `.` according their needs. The delimiter will at the end of each paragraph.

Similar to the fixed token length algorithm, user will encounter an exception when the chunking results exceed the `max_chunk_limit`.

## Using the processor

Follow these steps to use the processor in a pipeline. You can specify the chunking algorithm when creating the processor. If no algorithm name is provided, the chunking processor will use default algorithm `fixed_token_length` along with all its default processor.

**Step 1: Create a pipeline.**

The following example request creates an ingest pipeline where the text from `passage_text` will be converted into chunked passages which will be stored in `passage_chunk`:

```
PUT /_ingest/pipeline/text-chunking-ingest-pipeline
{
  "description": "A text chunking ingest pipeline",
  "processors": [
    {
      "text_chunking": {
        "algorithm": {
          "fixed_token_length": {
            "token_limit": 10,
            "overlap_rate": 0.2,
            "tokenizer": "standard"
          }
        },
        "field_map": {
          "passage_text": "passage_chunk"
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
POST _ingest/pipeline/text-chunking-ingest-pipeline/_simulate
{
  "docs": [
    {
      "_index": "testindex",
      "_id": "1",
      "_source":{
         "passage_text": "This is an example document to be chunked. The document contains a single paragraph, two sentences and 24 tokens by standard tokenizer in OpenSearch."
      }
    }
  ]
}
```
{% include copy-curl.html %}

#### Response

The response confirms that in addition to the `passage_text` field, the processor has generated text embeddings in the `passage_chunk` field:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "testindex",
        "_id": "1",
        "_source": {
          "passage_text": "This is an example document to be chunked. The document contains a single paragraph, two sentences and 24 tokens by standard tokenizer in OpenSearch.",
          "passage_chunk": [
            "This is an example document to be chunked. The document ",
            "The document contains a single paragraph, two sentences and 24 ",
            "and 24 tokens by standard tokenizer in OpenSearch."
          ]
        },
        "_ingest": {
          "timestamp": "2024-03-18T06:49:05.723026Z"
        }
      }
    }
  ]
}
```

Once you have created an ingest pipeline, you need to create an index for ingestion and ingest documents into the index. To learn more, see [Step 2: Create an index for ingestion]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/#step-2-create-an-index-for-ingestion) and [Step 3: Ingest documents into the index]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/#step-3-ingest-documents-into-the-index) of [Neural sparse search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/).

---

## Next steps

- To learn how to use the `neural_sparse` query for a sparse search, see [Neural sparse query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural-sparse/).
- To learn more about sparse search, see [Neural sparse search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/).
- To learn more about using models in OpenSearch, see [Choosing a model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/integrating-ml-models/#choosing-a-model).
- For a comprehensive example, see [Neural search tutorial]({{site.url}}{{site.baseurl}}/search-plugins/neural-search-tutorial/).
