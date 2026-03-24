---
layout: default
title: Optimizing vector search using Cohere compressed embeddings
parent: Vector operations
grand_parent: Vector search
nav_order: 20
redirect_from:
  - /vector-search/tutorials/vector-operations/optimize-compression/
---

# Optimizing vector search using Cohere compressed embeddings

This tutorial shows you how to optimize vector search using Cohere compressed embeddings. These embeddings allow for more efficient storage and faster retrieval of vector representations, making them ideal for large-scale search applications.

This tutorial is compatible with version 2.17 and later, except for [Using a template query and a search pipeline](#using-a-template-query-and-a-search-pipeline) in [Step 4: Search the index](#step-4-search-the-index), which requires version 2.19 or later.

This tutorial uses the Cohere Embed Multilingual v3 model on Amazon Bedrock. For more information about using Cohere compressed embeddings on Amazon Bedrock, see [this blog post](https://aws.amazon.com/about-aws/whats-new/2024/06/amazon-bedrock-compressed-embeddings-cohere-embed/).

In this tutorial, you'll use the following OpenSearch components:
- [ML inference ingest processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/ml-inference/) 
- [ML inference search request processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/ml-inference-search-request/)
- [Search template query]({{site.url}}{{site.baseurl}}/api-reference/search-template/) 
- [Vector index]({{site.url}}{{site.baseurl}}/search-plugins/knn/index/) and [byte vectors]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-memory-optimized/#byte-vectors)

Replace the placeholders beginning with the prefix `your_` with your own values.
{: .note}

## Step 1: Configure an embedding model

Follow these steps to create a connector to Amazon Bedrock for accessing the Cohere Embed model.

### Step 1.1: Create a connector

Create a connector for the embedding model using [this blueprint](https://github.com/opensearch-project/ml-commons/blob/main/docs/remote_inference_blueprints/bedrock_connector_cohere_cohere.embed-multilingual-v3_blueprint.md). For more information about creating a connector, see [Connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/).

Because you'll use the [ML inference processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/ml-inference/) in this tutorial, you don't need to specify a pre- or post-processing function in the connector.
{: .note}

To create a connector, send the following request. The `"embedding_types": ["int8"]` parameter specifies 8-bit integer quantized embeddings from the Cohere model. This setting compresses embeddings from 32-bit floats to 8-bit integers, reducing storage space and improving computation speed. While there is a slight trade-off in precision, it is typically negligible for search tasks. These quantized embeddings are compatible with OpenSearch's `knn_index`, which supports byte vectors:

```json
POST _plugins/_ml/connectors/_create
{
  "name": "Amazon Bedrock Connector: Cohere embed-multilingual-v3",
  "description": "Test connector for Amazon Bedrock Cohere embed-multilingual-v3",
  "version": 1,
  "protocol": "aws_sigv4",
  "credential": {
    "access_key": "your_aws_access_key",
    "secret_key": "your_aws_secret_key",
    "session_token": "your_aws_session_token"
  },
  "parameters": {
    "region": "your_aws_region",
    "service_name": "bedrock",
    "truncate": "END",
    "input_type": "search_document",
    "model": "cohere.embed-multilingual-v3",
    "embedding_types": ["int8"]
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "headers": {
        "x-amz-content-sha256": "required",
        "content-type": "application/json"
      },
      "url": "https://bedrock-runtime.${parameters.region}.amazonaws.com/model/${parameters.model}/invoke",
      "request_body": "{ \"texts\": ${parameters.texts}, \"truncate\": \"${parameters.truncate}\", \"input_type\": \"${parameters.input_type}\", \"embedding_types\":  ${parameters.embedding_types} }"

    }
  ]
}
```
{% include copy-curl.html %}

For more information about the model parameters, see the [Cohere documentation](https://docs.cohere.com/v2/docs/embeddings) and the [Amazon Bedrock documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-embed.html)

The response contains the connector ID:

```json
{
  "connector_id": "AOP0OZUB3JwAtE25PST0"
}
```

Note the connector ID; you'll use it in the next step.

### Step 1.2: Register the model

Next, register the model using the connector you created in the previous step. The `interface` parameter is optional. If the model does not require a specific interface configuration, set this parameter to an empty object: `"interface": {}`:

```json
POST _plugins/_ml/models/_register?deploy=true
{
  "name": "Bedrock Cohere embed-multilingual-v3",
  "version": "1.0",
  "function_name": "remote",
  "description": "Bedrock Cohere embed-multilingual-v3",
  "connector_id": "AOP0OZUB3JwAtE25PST0",
  "interface": {
    "input": "{\n    \"type\": \"object\",\n    \"properties\": {\n        \"parameters\": {\n            \"type\": \"object\",\n            \"properties\": {\n                \"texts\": {\n                    \"type\": \"array\",\n                    \"items\": {\n                        \"type\": \"string\"\n                    }\n                },\n                \"embedding_types\": {\n                    \"type\": \"array\",\n                    \"items\": {\n                        \"type\": \"string\",\n                        \"enum\": [\"float\", \"int8\", \"uint8\", \"binary\", \"ubinary\"]\n                    }\n                },\n                \"truncate\": {\n                    \"type\": \"array\",\n                    \"items\": {\n                        \"type\": \"string\",\n                        \"enum\": [\"NONE\", \"START\", \"END\"]\n                    }\n                },\n                \"input_type\": {\n                    \"type\": \"string\",\n                    \"enum\": [\"search_document\", \"search_query\", \"classification\", \"clustering\"]\n                }\n            },\n            \"required\": [\"texts\"]\n        }\n    },\n    \"required\": [\"parameters\"]\n}",
    "output": "{\n    \"type\": \"object\",\n    \"properties\": {\n        \"inference_results\": {\n            \"type\": \"array\",\n            \"items\": {\n                \"type\": \"object\",\n                \"properties\": {\n                    \"output\": {\n                        \"type\": \"array\",\n                        \"items\": {\n                            \"type\": \"object\",\n                            \"properties\": {\n                                \"name\": {\n                                    \"type\": \"string\"\n                                },\n                                \"dataAsMap\": {\n                                    \"type\": \"object\",\n                                    \"properties\": {\n                                        \"id\": {\n                                            \"type\": \"string\",\n                                            \"format\": \"uuid\"\n                                        },\n                                        \"texts\": {\n                                            \"type\": \"array\",\n                                            \"items\": {\n                                                \"type\": \"string\"\n                                            }\n                                        },\n                                        \"embeddings\": {\n                                            \"type\": \"object\",\n                                            \"properties\": {\n                                                \"binary\": {\n                                                    \"type\": \"array\",\n                                                    \"items\": {\n                                                        \"type\": \"array\",\n                                                        \"items\": {\n                                                            \"type\": \"number\"\n                                                        }\n                                                    }\n                                                },\n                                                \"float\": {\n                                                    \"type\": \"array\",\n                                                    \"items\": {\n                                                        \"type\": \"array\",\n                                                        \"items\": {\n                                                            \"type\": \"number\"\n                                                        }\n                                                    }\n                                                },\n                                                \"int8\": {\n                                                    \"type\": \"array\",\n                                                    \"items\": {\n                                                        \"type\": \"array\",\n                                                        \"items\": {\n                                                            \"type\": \"number\"\n                                                        }\n                                                    }\n                                                },\n                                                \"ubinary\": {\n                                                    \"type\": \"array\",\n                                                    \"items\": {\n                                                        \"type\": \"array\",\n                                                        \"items\": {\n                                                            \"type\": \"number\"\n                                                        }\n                                                    }\n                                                },\n                                                \"uint8\": {\n                                                    \"type\": \"array\",\n                                                    \"items\": {\n                                                        \"type\": \"array\",\n                                                        \"items\": {\n                                                            \"type\": \"number\"\n                                                        }\n                                                    }\n                                                }\n                                            }\n                                        },\n                                        \"response_type\": {\n                                            \"type\": \"string\"\n                                        }\n                                    },\n                                    \"required\": [\"embeddings\"]\n                                }\n                            },\n                            \"required\": [\"name\", \"dataAsMap\"]\n                        }\n                    },\n                    \"status_code\": {\n                        \"type\": \"integer\"\n                    }\n                },\n                \"required\": [\"output\", \"status_code\"]\n            }\n        }\n    },\n    \"required\": [\"inference_results\"]\n}"
  }
}
```
{% include copy-curl.html %}

For more information, see the [model interface documentation]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/register-model/#the-interface-parameter)

The response contains the model ID:

```json
{
  "task_id": "COP0OZUB3JwAtE25yiQr",
  "status": "CREATED",
  "model_id": "t64OPpUBX2k07okSZc2n"
}
```

To test the model, send the following request:

```json
POST _plugins/_ml/models/t64OPpUBX2k07okSZc2n/_predict
{
  "parameters": {
    "texts": ["Say this is a test"],
    "embedding_types": [ "int8" ]
  }
}
```
{% include copy-curl.html %}

The response contains the generated embeddings:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "dataAsMap": {
            "id": "db07a08c-283d-4da5-b0c5-a9a54ef35d01",
            "texts": [
              "Say this is a test"
            ],
            "embeddings": {
              "int8": [
                [
                  -26.0,
                  31.0,
                  ...
                ]
              ]
            },
            "response_type": "embeddings_by_type"
          }
        }
      ],
      "status_code": 200
    }
  ]
}
```

## Step 2: Create an ingest pipeline

An ingest pipeline lets you process documents before indexing them. In this case, you'll use one to generate embeddings for the `title` and `description` fields in your data.

There are two ways to set up the pipeline:

1. [Invoke the model separately for `title` and `description`](#option-1-invoke-the-model-separately-for-title-and-description): This option sends separate requests for each field, generating independent embeddings.
1. [Invoke the model once by combining `title` and `description`](#option-2-invoke-the-model-once-by-combining-title-and-description): This option concatenates the fields into a single input and sends one request, generating a single embedding that represents both.

### Option 1: Invoke the model separately for `title` and `description`

```json
PUT _ingest/pipeline/ml_inference_pipeline_cohere
{
"processors": [
    {
    "ml_inference": {
        "tag": "ml_inference",
        "description": "This processor is going to run ml inference during ingest request",
        "model_id": "t64OPpUBX2k07okSZc2n",
        "input_map": [
        {
            "texts": "$..title"
        },
        {
            "texts": "$..description"
        }
        ],
        "output_map": [
        {
            "title_embedding": "embeddings.int8[0]"
        },
        {
            "description_embedding": "embeddings.int8[0]"
        }
        ],
        "model_config": {
        "embedding_types": ["int8"]
        },
        "ignore_failure": false
    }
    }
]
}
```
{% include copy-curl.html %}
    
### Option 2: Invoke the model once by combining `title` and `description`

```json
PUT _ingest/pipeline/ml_inference_pipeline_cohere
{
    "description": "Concatenate title and description fields",
    "processors": [
        {
        "set": {
            "field": "title_desc_tmp",
            "value": [
            "{{title}}",
            "{{description}}"
            ]
        }
        },
        {
        "ml_inference": {
            "tag": "ml_inference",
            "description": "This processor is going to run ml inference during ingest request",
            "model_id": "t64OPpUBX2k07okSZc2n",
            "input_map": [
            {
                "texts": "title_desc_tmp"
            }
            ],
            "output_map": [
            {
                "title_embedding": "embeddings.int8[0]",
                "description_embedding": "embeddings.int8[1]"
            }
            ],
            "model_config": {
            "embedding_types": ["int8"]
            },
            "ignore_failure": true
        }
        },
        {
        "remove": {
            "field": "title_desc_tmp"
        }
        }
    ]
}
```
{% include copy-curl.html %}

Test the pipeline by sending the following [simulate]({{site.url}}{{site.baseurl}}/ingest-pipelines/simulate-ingest/) request:

```json
POST _ingest/pipeline/ml_inference_pipeline_cohere/_simulate
{
  "docs": [
    {
      "_index": "books",
      "_id": "1",
      "_source": {
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "description": "A novel of decadence and excess in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
        "publication_year": 1925,
        "genre": "Classic Fiction"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The response contains the generated embeddings:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "books",
        "_id": "1",
        "_source": {
          "publication_year": 1925,
          "author": "F. Scott Fitzgerald",
          "genre": "Classic Fiction",
          "description": "A novel of decadence and excess in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
          "title": "The Great Gatsby",
          "title_embedding": [
            18,
            33,
            ...
          ],
          "description_embedding": [
            -21,
            -14,
            ...
          ]
        },
        "_ingest": {
          "timestamp": "2025-02-25T09:11:32.192125042Z"
        }
      }
    }
  ]
}
```

## Step 3: Create a vector index and ingest data

Next, create a vector index:

```json
PUT books
{
  "settings": {
    "index": {
      "default_pipeline": "ml_inference_pipeline_cohere",
      "knn": true,
      "knn.algo_param.ef_search": 100
    }
  },
  "mappings": {
    "properties": {
      "title_embedding": {
        "type": "knn_vector",
        "dimension": 1024,
        "data_type": "byte",
        "space_type": "l2",
        "method": {
          "name": "hnsw",
          "engine": "lucene",
          "parameters": {
            "ef_construction": 100,
            "m": 16
          }
        }
      },
      "description_embedding": {
        "type": "knn_vector",
        "dimension": 1024,
        "data_type": "byte",
        "space_type": "l2",
        "method": {
          "name": "hnsw",
          "engine": "lucene",
          "parameters": {
            "ef_construction": 100,
            "m": 16
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Ingest test data into the index:

```json
POST _bulk
{"index":{"_index":"books"}}
{"title":"The Great Gatsby","author":"F. Scott Fitzgerald","description":"A novel of decadence and excess in the Jazz Age, exploring themes of wealth, love, and the American Dream.","publication_year":1925,"genre":"Classic Fiction"}
{"index":{"_index":"books"}}
{"title":"To Kill a Mockingbird","author":"Harper Lee","description":"A powerful story of racial injustice and loss of innocence in the American South during the Great Depression.","publication_year":1960,"genre":"Literary Fiction"}
{"index":{"_index":"books"}}
{"title":"Pride and Prejudice","author":"Jane Austen","description":"A romantic novel of manners that follows the character development of Elizabeth Bennet as she learns about the repercussions of hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness.","publication_year":1813,"genre":"Romance"}
```
{% include copy-curl.html %}

## Step 4: Search the index

You can run a vector search on the index in the following ways: 
- [Using a template query and a search pipeline](#using-a-template-query-and-a-search-pipeline)
- [Rewriting the query in the search pipeline](#rewriting-the-query-in-the-search-pipeline)

### Using a template query and a search pipeline

First, create a search pipeline:

```json
PUT _search/pipeline/ml_inference_pipeline_cohere_search
{
  "request_processors": [
    {
      "ml_inference": {
        "model_id": "t64OPpUBX2k07okSZc2n",
        "input_map": [
          {
            "texts": "$..ext.ml_inference.text"
          }
        ],
        "output_map": [
          {
            "ext.ml_inference.vector": "embeddings.int8[0]"
          }
        ],
        "model_config": {
          "input_type": "search_query",
          "embedding_types": ["int8"]
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

Next, use a template query to run a search:

```json
GET books/_search?search_pipeline=ml_inference_pipeline_cohere_search&verbose_pipeline=false
{
  "query": {
    "template": {
      "knn": {
        "description_embedding": {
          "vector": "${ext.ml_inference.vector}",
          "k": 10
        }
      }
    }
  },
  "ext": {
    "ml_inference": {
      "text": "American Dream"
    }
  },
  "_source": {
    "excludes": [
      "title_embedding", "description_embedding"
    ]
  },
  "size": 2
}
```
{% include copy-curl.html %}

To see each search processor's input and output, add `&verbose_pipeline=true` to your request. This is useful for debugging and understanding how the search pipeline modifies queries. For more information, see [Debugging a search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/debugging-search-pipeline/).

### Rewriting the query in the search pipeline

Create another search pipeline that rewrites the query:

```json
PUT _search/pipeline/ml_inference_pipeline_cohere_search2
{
  "request_processors": [
    {
      "ml_inference": {
        "model_id": "t64OPpUBX2k07okSZc2n",
        "input_map": [
          {
            "texts": "$..match.description.query"
          }
        ],
        "output_map": [
          {
            "query_vector": "embeddings.int8[0]"
          }
        ],
        "model_config": {
          "input_type": "search_query",
          "embedding_types": ["int8"]
        },
        "query_template": """
          {
            "query": {
              "knn": {
                "description_embedding": {
                  "vector": ${query_vector},
                  "k": 10
                }
              }
            },
            "_source": {
              "excludes": [
                "title_embedding",
                "description_embedding"
              ]
            },
            "size": 2
          }
        """
      }
    }
  ]
}
```
{% include copy-curl.html %}

Now run a vector search using this pipeline:

```json
GET books/_search?search_pipeline=ml_inference_pipeline_cohere_search2
{
  "query": {
    "match": {
      "description": "American Dream"
    }
  }
}
```
{% include copy-curl.html %}

The response contains the matching documents:

```json
{
  "took": 96,
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
    "max_score": 7.271585e-7,
    "hits": [
      {
        "_index": "books",
        "_id": "U640PJUBX2k07okSEMwy",
        "_score": 7.271585e-7,
        "_source": {
          "publication_year": 1925,
          "author": "F. Scott Fitzgerald",
          "genre": "Classic Fiction",
          "description": "A novel of decadence and excess in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
          "title": "The Great Gatsby"
        }
      },
      {
        "_index": "books",
        "_id": "VK40PJUBX2k07okSEMwy",
        "_score": 6.773544e-7,
        "_source": {
          "publication_year": 1960,
          "author": "Harper Lee",
          "genre": "Literary Fiction",
          "description": "A powerful story of racial injustice and loss of innocence in the American South during the Great Depression.",
          "title": "To Kill a Mockingbird"
        }
      }
    ]
  }
}
```

## Step 5 (Optional): Using binary embeddings

In this section, you'll extend the setup to support binary embeddings, which offer even more efficient storage and faster retrieval. Binary embeddings can significantly reduce storage requirements and improve search speed, making them ideal for large-scale applications.

You don't need to modify the connector or model---you only need to update the vector index, ingest pipeline, and search pipeline.

### Step 5.1: Create an ingest pipeline

Create a new ingest pipeline named `ml_inference_pipeline_cohere_binary` by using the same configuration as in [Step 2](#step-2-create-an-ingest-pipeline) but replacing all occurrences of `int8` with `binary`.

### Option 1: Invoke the model separately for `title` and `description`

```json
PUT _ingest/pipeline/ml_inference_pipeline_cohere
{
"processors": [
    {
    "ml_inference": {
        "tag": "ml_inference",
        "description": "This processor is going to run ml inference during ingest request",
        "model_id": "t64OPpUBX2k07okSZc2n",
        "input_map": [
        {
            "texts": "$..title"
        },
        {
            "texts": "$..description"
        }
        ],
        "output_map": [
        {
            "title_embedding": "embeddings.binary[0]"
        },
        {
            "description_embedding": "embeddings.binary[0]"
        }
        ],
        "model_config": {
        "embedding_types": ["binary"]
        },
        "ignore_failure": false
    }
    }
]
}
```
{% include copy-curl.html %}
    
### Option 2: Invoke the model once by combining `title` and `description`

```json
PUT _ingest/pipeline/ml_inference_pipeline_cohere
{
    "description": "Concatenate title and description fields",
    "processors": [
        {
        "set": {
            "field": "title_desc_tmp",
            "value": [
            "{{title}}",
            "{{description}}"
            ]
        }
        },
        {
        "ml_inference": {
            "tag": "ml_inference",
            "description": "This processor is going to run ml inference during ingest request",
            "model_id": "t64OPpUBX2k07okSZc2n",
            "input_map": [
            {
                "texts": "title_desc_tmp"
            }
            ],
            "output_map": [
            {
                "title_embedding": "embeddings.binary[0]",
                "description_embedding": "embeddings.binary[1]"
            }
            ],
            "model_config": {
            "embedding_types": ["binary"]
            },
            "ignore_failure": true
        }
        },
        {
        "remove": {
            "field": "title_desc_tmp"
        }
        }
    ]
}
```
{% include copy-curl.html %}


### Step 5.2: Create a vector index and ingest data

Create a new vector index containing a [binary vector]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-memory-optimized/#binary-vectors) field:

```json
PUT books_binary_embedding
{
  "settings": {
    "index": {
      "default_pipeline": "ml_inference_pipeline_cohere_binary",
      "knn": true
    }
  },
  "mappings": {
    "properties": {
      "title_embedding": {
        "type": "knn_vector",
        "dimension": 1024,
        "data_type": "binary",
        "space_type": "hamming",
        "method": {
          "name": "hnsw",
          "engine": "faiss"
        }
      },
      "description_embedding": {
        "type": "knn_vector",
        "dimension": 1024,
        "data_type": "binary",
        "space_type": "hamming",
        "method": {
          "name": "hnsw",
          "engine": "faiss"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Ingest test data into the index:

```json
POST _bulk
{"index":{"_index":"books_binary_embedding"}}
{"title":"The Great Gatsby","author":"F. Scott Fitzgerald","description":"A novel of decadence and excess in the Jazz Age, exploring themes of wealth, love, and the American Dream.","publication_year":1925,"genre":"Classic Fiction"}
{"index":{"_index":"books_binary_embedding"}}
{"title":"To Kill a Mockingbird","author":"Harper Lee","description":"A powerful story of racial injustice and loss of innocence in the American South during the Great Depression.","publication_year":1960,"genre":"Literary Fiction"}
{"index":{"_index":"books_binary_embedding"}}
{"title":"Pride and Prejudice","author":"Jane Austen","description":"A romantic novel of manners that follows the character development of Elizabeth Bennet as she learns about the repercussions of hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness.","publication_year":1813,"genre":"Romance"}
```
{% include copy-curl.html %}

### Step 5.3: Create a search pipeline

Create a new search pipeline named `ml_inference_pipeline_cohere_search_binary` by using the same configuration as in [Step 2](#step-4-search-the-index) but replacing all occurrences of `int8` with `binary`.

1. Change `embeddings.int8[0]` to `embeddings.binary[0]`.
1. Change `"embedding_types": ["int8"]` to `"embedding_types": ["binary"]`.

### Using a template query and a search pipeline

First, create a search pipeline:

```json
PUT _search/pipeline/ml_inference_pipeline_cohere_search_binary
{
  "request_processors": [
    {
      "ml_inference": {
        "model_id": "t64OPpUBX2k07okSZc2n",
        "input_map": [
          {
            "texts": "$..ext.ml_inference.text"
          }
        ],
        "output_map": [
          {
            "ext.ml_inference.vector": "embeddings.binary[0]"
          }
        ],
        "model_config": {
          "input_type": "search_query",
          "embedding_types": ["binary"]
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Rewriting the query in the search pipeline

Create another search pipeline that rewrites the query:

```json
PUT _search/pipeline/ml_inference_pipeline_cohere_search_binary2
{
  "request_processors": [
    {
      "ml_inference": {
        "model_id": "t64OPpUBX2k07okSZc2n",
        "input_map": [
          {
            "texts": "$..match.description.query"
          }
        ],
        "output_map": [
          {
            "query_vector": "embeddings.binary[0]"
          }
        ],
        "model_config": {
          "input_type": "search_query",
          "embedding_types": ["binary"]
        },
        "query_template": """
          {
            "query": {
              "knn": {
                "description_embedding": {
                  "vector": ${query_vector},
                  "k": 10
                }
              }
            },
            "_source": {
              "excludes": [
                "title_embedding",
                "description_embedding"
              ]
            },
            "size": 2
          }
        """
      }
    }
  ]
}
```
{% include copy-curl.html %}

Then you can use the search pipeline to run a vector search, as described in [Step 4](#step-4-search-the-index).