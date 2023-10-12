---
layout: default
title: Neural
parent: Specialized queries
grand_parent: Query DSL
nav_order: 50
---

# Neural query

Use the `neural` query for vector field search in [neural search]({{site.url}}{{site.baseurl}}/search-plugins/neural-search/). 

## Request fields

Include the following request fields in the `neural` query:

```json
"neural": {
  "<vector_field>": {
    "query_text": "<query_text>",
    "query_image": "<image_binary>",
    "model_id": "<model_id>",
    "k": 100
  }
}
```

The top-level `vector_field` specifies the vector field against which to run a search query. The following table lists the other neural query fields.

Field | Data type | Required/Optional | Description
:--- | :--- | :--- 
`query_text` | String | Optional | The query text from which to generate vector embeddings. You must specify at least one `query_text` or `query_image`.
`query_image` | String | Optional | A base-64 encoded string that corresponds to the query image from which to generate vector embeddings. You must specify at least one `query_text` or `query_image`.
`model_id` | String | Required if the default model ID is not set. For more information, see [Setting a default model on an index or field]({{site.url}}{{site.baseurl}}/search-plugins/neural-text-search/#setting-a-default-model-on-an-index-or-field). | The ID of the model that will be used to generate vector embeddings from the query text. The model must be deployed in OpenSearch before it can be used in neural search. For more information, see [Using custom models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/ml-framework/) and [Semantic search]({{site.url}}{{site.baseurl}}/ml-commons-plugin/semantic-search/).
`k` | Integer | Optional | The number of results returned by the k-NN search. Default is 10.

#### Example request

```json
GET /my-nlp-index/_search
{
  "query": {
    "neural": {
      "passage_embedding": {
        "query_text": "Hi world",
        "query_image": "iVBORw0KGgoAAAAN...",
        "k": 100
      }
    }
  }
}
```
{% include copy-curl.html %}