---
layout: default
title: Retrieval-augmented generation
nav_order: 90
has_children: false
parent: Search processors
grand_parent: Search pipelines
canonical_url: https://docs.opensearch.org/latest/search-plugins/search-pipelines/rag-processor/
---

# Retrieval-augmented generation processor
Introduced 2.12
{: .label .label-purple }

The `retrieval_augmented_generation` processor is a search results processor that you can use in [conversational search]({{site.url}}{{site.baseurl}}/search-plugins/conversational-search/) for retrieval-augmented generation (RAG). The processor intercepts query results, retrieves previous messages from the conversation from the conversational memory, and sends a prompt to a large language model (LLM). After the processor receives a response from the LLM, it saves the response in conversational memory and returns both the original OpenSearch query results and the LLM response.

As of OpenSearch 2.12, the `retrieval_augmented_generation` processor supports only OpenAI and Amazon Bedrock models.
{: .note}

## Request body fields

The following table lists all available request fields.

Field | Data type | Description
:--- | :--- | :---
`model_id` | String | The ID of the model used in the pipeline. Required.
`context_field_list` | Array | A list of fields contained in document sources that the pipeline uses as context for RAG. Required. For more information, see [Context field list](#context-field-list). 
`system_prompt` | String | The system prompt that is sent to the LLM to adjust its behavior, such as its response tone. Can be a persona description or a set of instructions. Optional.
`user_instructions` | String | Human-generated instructions sent to the LLM to guide it in producing results. 
`tag` | String | The processor's identifier. Optional.
`description` | String | A description of the processor. Optional.

### Context field list

The `context_field_list` is a list of fields contained in document sources that the pipeline uses as context for RAG. For example, suppose your OpenSearch index contains a collection of documents, each including a `title` and `text`:

```json
{
  "_index": "qa_demo",
  "_id": "SimKcIoBOVKVCYpk1IL-",
  "_source": {
    "title": "Abraham Lincoln 2",
    "text": "Abraham Lincoln was born on February 12, 1809, the second child of Thomas Lincoln and Nancy Hanks Lincoln, in a log cabin on Sinking Spring Farm near Hodgenville, Kentucky.[2] He was a descendant of Samuel Lincoln, an Englishman who migrated from Hingham, Norfolk, to its namesake, Hingham, Massachusetts, in 1638. The family then migrated west, passing through New Jersey, Pennsylvania, and Virginia.[3] Lincoln was also a descendant of the Harrison family of Virginia; his paternal grandfather and namesake, Captain Abraham Lincoln and wife Bathsheba (née Herring) moved the family from Virginia to Jefferson County, Kentucky.[b] The captain was killed in an Indian raid in 1786.[5] His children, including eight-year-old Thomas, Abraham's father, witnessed the attack.[6][c] Thomas then worked at odd jobs in Kentucky and Tennessee before the family settled in Hardin County, Kentucky, in the early 1800s.[6]\n"
  }
}
```

You can specify that only the `text` contents should be sent to the LLM by setting `"context_field_list": ["text"]` in the processor. 

## Example 

The following example demonstrates using a search pipeline with a `retrieval_augmented_generation` processor. 

### Creating a search pipeline 

The following request creates a search pipeline containing a `retrieval_augmented_generation` processor for an OpenAI model:

```json
PUT /_search/pipeline/rag_pipeline
{
  "response_processors": [
    {
      "retrieval_augmented_generation": {
        "tag": "openai_pipeline_demo",
        "description": "Demo pipeline Using OpenAI Connector",
        "model_id": "gnDIbI0BfUsSoeNT_jAw",
        "context_field_list": ["text"],
        "system_prompt": "You are a helpful assistant",
        "user_instructions": "Generate a concise and informative answer in less than 100 words for the given question"
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Using a search pipeline

Combine an OpenSearch query with an `ext` object that stores generative question answering parameters for the LLM:

```json
GET /my_rag_test_data/_search?search_pipeline=rag_pipeline
{
  "query": {
    "match": {
      "text": "Abraham Lincoln"
    }
  },
  "ext": {
    "generative_qa_parameters": {
      "llm_model": "gpt-3.5-turbo",
      "llm_question": "Was Abraham Lincoln a good politician",
      "memory_id": "iXC4bI0BfUsSoeNTjS30",
      "context_size": 5,
      "message_size": 5,
      "timeout": 15
    }
  }
}
```
{% include copy-curl.html %}

For more information about setting up conversational search, see [Using conversational search]({{site.url}}{{site.baseurl}}/search-plugins/conversational-search/#using-conversational-search).
