---
layout: default
title: Semantic search using text chunking
parent: Semantic search
grand_parent: Vector search
nav_order: 90
redirect_from:
  - /vector-search/tutorials/semantic-search/long-document/
---

# Semantic search using text chunking

This tutorial shows you how to use text chunking to run semantic search on long documents in OpenSearch 2.19 or later. 

In this tutorial, you'll use the following OpenSearch components:
- [Text chunking processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/text-chunking/)
- [ML inference ingest processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/ml-inference/)
- [ML inference search request processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/ml-inference-search-request/) 
- [Template query]({{site.url}}{{site.baseurl}}/api-reference/search-template/)

Replace the placeholders beginning with the prefix `your_` with your own values.
{: .note}

## Step 1: Create an embedding model

In this tutorial, you'll use the [Amazon Bedrock Titan Text Embeddings model](https://docs.aws.amazon.com/bedrock/latest/userguide/titan-embedding-models.html). 

If using Python, you can create an Amazon Bedrock Titan embedding connector and test the model using the [opensearch-py-ml](https://github.com/opensearch-project/opensearch-py-ml) client CLI. The CLI automates many configuration steps, making setup faster and reducing the chance of errors. For more information about using the CLI, see the [CLI documentation](https://opensearch-project.github.io/opensearch-py-ml/cli/index.html#).
{: .tip}

If using self-managed OpenSearch, create a model using [the blueprint](https://github.com/opensearch-project/ml-commons/blob/main/docs/remote_inference_blueprints/bedrock_connector_titan_embedding_blueprint.md). 

If using Amazon OpenSearch Service, use [this Python notebook](https://github.com/opensearch-project/ml-commons/blob/main/docs/tutorials/aws/AIConnectorHelper.ipynb) to create the model. Alternatively, you can manually create a connector by following [this tutorial]({{site.url}}{{site.baseurl}}/vector-search/tutorials/semantic-search/semantic-search-bedrock-titan/).

### Step 1.1: Create a connector

To create a connector, send the following request. Because you'll use the [ML inference processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/ml-inference/) in this tutorial, you don't need to specify a pre- or post-processing function in the connector:

```json
POST _plugins/_ml/connectors/_create
{
  "name": "Amazon Bedrock Connector: embedding",
  "description": "The connector to bedrock Titan embedding model",
  "version": 1,
  "protocol": "aws_sigv4",
  "parameters": {
    "region": "us-west-2",
    "service_name": "bedrock",
    "model": "amazon.titan-embed-text-v2:0",
    "dimensions": 1024,
    "normalize": true,
    "embeddingTypes": ["float"]
  },
  "credential": {
    "access_key": "your_aws_access_key",
    "secret_key": "your_aws_secret_key",
    "session_token": "your_aws_session_token"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://bedrock-runtime.${parameters.region}.amazonaws.com/model/${parameters.model}/invoke",
      "headers": {
        "content-type": "application/json",
        "x-amz-content-sha256": "required"
      },
      "request_body": "{ \"inputText\": \"${parameters.inputText}\", \"dimensions\": ${parameters.dimensions}, \"normalize\": ${parameters.normalize}, \"embeddingTypes\": ${parameters.embeddingTypes} }"
    }
  ]
}
```
{% include copy-curl.html %}

The response contains a connector ID:

```json
{
  "connector_id": "vhR15JQBLopfJ2xsx9p5"
}
```

Note the connector ID; you'll use it in the next step.

### Step 1.2: Register the model

To register the model, send the following request:

```json
POST _plugins/_ml/models/_register?deploy=true
{
  "name": "Bedrock embedding model",
  "function_name": "remote",
  "description": "Bedrock text embedding model v2",
  "connector_id": "vhR15JQBLopfJ2xsx9p5"
}
```
{% include copy-curl.html %}

The response contains the model ID:

```json
{
  "task_id": "xRR35JQBLopfJ2xsO9pU",
  "status": "CREATED",
  "model_id": "xhR35JQBLopfJ2xsO9pr"
}
```

Note the model ID; you'll use it in the next step.

### Step 1.3: Test the model

To test the model, send the following request:

```json
POST /_plugins/_ml/models/xhR35JQBLopfJ2xsO9pr/_predict
{
    "parameters": {
        "inputText": "hello world"
    }
}
```
{% include copy-curl.html %}

The response contains the embeddings generated by the model:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "dataAsMap": {
            "embedding": [
              -0.020442573353648186,...
            ],
            "embeddingsByType": {
              "float": [
                -0.020442573353648186, ...
              ]
            },
            "inputTextTokenCount": 3.0
          }
        }
      ],
      "status_code": 200
    }
  ]
}
```

## Step 2: Create an ingest pipeline

Many text embedding models have input size limitations. The [Amazon Titan Text Embeddings V2 model](https://docs.aws.amazon.com/bedrock/latest/userguide/titan-embedding-models.html) supports a maximum of 8,192 text tokens. To process long documents, you need to split them into smaller chunks and send each chunk to the model. The [text chunking processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/text-chunking/) splits the original document into smaller pieces, and the [ML inference processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/ml-inference/) generates embeddings for each chunk. To create an ingest pipeline containing both processors, send the following request:

```json
PUT _ingest/pipeline/bedrock-text-embedding-pipeline
{
  "description": "ingest reviews, generate embedding, and format chunks",
  "processors": [
    {
      "text_chunking": {
        "algorithm": {
          "fixed_token_length": {
            "token_limit": 100,
            "overlap_rate": 0.2,
            "tokenizer": "standard"
          }
        },
        "field_map": {
          "passage_text": "passage_chunk"
        }
      }
    },
    {
      "foreach": {
        "field": "passage_chunk",
        "processor": {
          "set": {
            "field": "_ingest._value",
            "value": {
              "text": "{{_ingest._value}}"
            }
          }
        }
      }
    },
    {
      "foreach": {
        "field": "passage_chunk",
        "processor": {
          "ml_inference": {
            "model_id": "xhR35JQBLopfJ2xsO9pr",
            "input_map": [
              {
                "inputText": "_ingest._value.text"
              }
            ],
            "output_map": [
              {
                "_ingest._value.embedding": "embedding"
              }
            ]
          }
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

To test the pipeline, send the following request:

```json
POST _ingest/pipeline/bedrock-text-embedding-pipeline/_simulate
{
  "docs": [
    {
      "_index": "testindex",
      "_id": "1",
      "_source":{
         "passage_text": "Ingest pipelines\nAn ingest pipeline is a sequence of processors that are applied to documents as they are ingested into an index. Each processor in a pipeline performs a specific task, such as filtering, transforming, or enriching data.\n\nProcessors are customizable tasks that run in a sequential order as they appear in the request body. This order is important, as each processor depends on the output of the previous processor. The modified documents appear in your index after the processors are applied.\n\nOpenSearch ingest pipelines compared to OpenSearch Data Prepper\nOpenSeach ingest pipelines run within the OpenSearch cluster, whereas OpenSearch Data Prepper is an external component that runs on the OpenSearch cluster.\n\nOpenSearch ingest pipelines perform actions on indexes and are preferred for use cases involving pre-processing simple datasets, machine learning (ML) processors, and vector embedding processors. OpenSearch ingest pipelines are recommended for simple data pre-processing and small datasets.\n\nOpenSearch Data Prepper is recommended for any data processing tasks it supports, particularly when dealing with large datasets and complex data pre-processing requirements. It streamlines the process of transferring and fetching large datasets while providing robust capabilities for intricate data preparation and transformation operations. Refer to the OpenSearch Data Prepper documentation for more information.\n\nOpenSearch ingest pipelines can only be managed using Ingest API operations.\n\nPrerequisites\nThe following are prerequisites for using OpenSearch ingest pipelines:\n\nWhen using ingestion in a production environment, your cluster should contain at least one node with the node roles permission set to ingest. For information about setting up node roles within a cluster, see Cluster Formation.\nIf the OpenSearch Security plugin is enabled, you must have the cluster_manage_pipelines permission to manage ingest pipelines.\nDefine a pipeline\nA pipeline definition describes the sequence of an ingest pipeline and can be written in JSON format. An ingest pipeline consists of the following:\n\n{\n    \"description\" : \"...\"\n    \"processors\" : [...]\n}\nRequest body fields\nField\tRequired\tType\tDescription\nprocessors\tRequired\tArray of processor objects\tA component that performs a specific data processing task as the data is being ingested into OpenSearch.\ndescription\tOptional\tString\tA description of the ingest pipeline.\n"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The response shows the processed document, which has been split into chunks and includes embeddings for each chunk:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "testindex",
        "_id": "1",
        "_source": {
          "passage_text": """Ingest pipelines
An ingest pipeline is a sequence of processors that are applied to documents as they are ingested into an index. Each processor in a pipeline performs a specific task, such as filtering, transforming, or enriching data.

Processors are customizable tasks that run in a sequential order as they appear in the request body. This order is important, as each processor depends on the output of the previous processor. The modified documents appear in your index after the processors are applied.

OpenSearch ingest pipelines compared to OpenSearch Data Prepper
OpenSeach ingest pipelines run within the OpenSearch cluster, whereas OpenSearch Data Prepper is an external component that runs on the OpenSearch cluster.

OpenSearch ingest pipelines perform actions on indexes and are preferred for use cases involving pre-processing simple datasets, machine learning (ML) processors, and vector embedding processors. OpenSearch ingest pipelines are recommended for simple data pre-processing and small datasets.

OpenSearch Data Prepper is recommended for any data processing tasks it supports, particularly when dealing with large datasets and complex data pre-processing requirements. It streamlines the process of transferring and fetching large datasets while providing robust capabilities for intricate data preparation and transformation operations. Refer to the OpenSearch Data Prepper documentation for more information.

OpenSearch ingest pipelines can only be managed using Ingest API operations.

Prerequisites
The following are prerequisites for using OpenSearch ingest pipelines:

When using ingestion in a production environment, your cluster should contain at least one node with the node roles permission set to ingest. For information about setting up node roles within a cluster, see Cluster Formation.
If the OpenSearch Security plugin is enabled, you must have the cluster_manage_pipelines permission to manage ingest pipelines.
Define a pipeline
A pipeline definition describes the sequence of an ingest pipeline and can be written in JSON format. An ingest pipeline consists of the following:

{
    "description" : "..."
    "processors" : [...]
}
Request body fields
Field	Required	Type	Description
processors	Required	Array of processor objects	A component that performs a specific data processing task as the data is being ingested into OpenSearch.
description	Optional	String	A description of the ingest pipeline.
""",
          "passage_chunk": [
            {
              "text": """Ingest pipelines\nAn ingest pipeline is a sequence of processors that are applied to documents as they are ingested into an index. Each processor in a pipeline performs a specific task, such as filtering, transforming, or enriching data.\n\nProcessors are customizable tasks that run in a sequential order as they appear in the request body. This order is important, as each processor depends on the output of the previous processor. The modified documents appear in your index after the processors are applied.\n\nOpenSearch ingest pipelines compared to OpenSearch Data Prepper\nOpenSeach ingest pipelines run within the OpenSearch cluster, whereas OpenSearch Data Prepper is an external component that runs on the OpenSearch cluster.\n\nOpenSearch ingest pipelines perform actions on indexes and are preferred for use cases involving pre-processing simple datasets, machine learning (ML) processors, and vector embedding processors. OpenSearch ingest pipelines are recommended for simple data pre-processing and small datasets.\n\nOpenSearch Data Prepper is recommended for any data processing tasks it supports, particularly when dealing with large datasets and complex data pre-processing requirements. It streamlines the process of transferring and fetching large datasets while providing robust capabilities for intricate data preparation and transformation operations. Refer to the OpenSearch """,
              "embedding": [
                0.04044651612639427,
                ...
              ]
            },
            {
              "text": """tasks it supports, particularly when dealing with large datasets and complex data pre-processing requirements. It streamlines the process of transferring and fetching large datasets while providing robust capabilities for intricate data preparation and transformation operations. Refer to the OpenSearch Data Prepper documentation for more information.\n\nOpenSearch ingest pipelines can only be managed using Ingest API operations.\n\nPrerequisites\nThe following are prerequisites for using OpenSearch ingest pipelines:\n\nWhen using ingestion in a production environment, your cluster should contain at least one node with the node roles permission set to ingest. For information about setting up node roles within a cluster, see Cluster Formation.\nIf the OpenSearch Security plugin is enabled, you must have the cluster_manage_pipelines permission to manage ingest pipelines.\nDefine a pipeline\nA pipeline definition describes the sequence of an ingest pipeline and can be written in JSON format. An ingest pipeline consists of the following:\n\n{\n    \"description\" : \"...\"\n    \"processors\" : [...]\n}\nRequest body fields\nField\tRequired\tType\tDescription\nprocessors\tRequired\tArray of processor objects\tA component that performs a specific data processing task as the data is being ingested into OpenSearch.\ndescription\tOptional\tString\tA description of the ingest pipeline.\n""",
              "embedding": [
                0.02055041491985321,
                ...
              ]
            }
          ]
        },
        "_ingest": {
          "_value": null,
          "timestamp": "2025-02-08T07:49:43.484543119Z"
        }
      }
    }
  ]
}
```

## Step 3: Create an index and ingest data 

To create a vector index, send the following request:

```json
PUT opensearch_docs
{
  "settings": {
    "index.knn": true,
    "default_pipeline": "bedrock-text-embedding-pipeline"
  },
  "mappings": {
    "properties": {
      "passage_chunk": {
        "type": "nested",
        "properties": {
          "text": {
            "type": "text"
          },
          "embedding": {
            "type": "knn_vector",
            "dimension": 1024
          }
        }
      },
      "passage_text": {
        "type": "text"
      }
    }
  }
}
```
{% include copy-curl.html %}

Ingest test data into the index:

```json
POST _bulk
{"index": {"_index": "opensearch_docs"}}
{"passage_text": "Ingest pipelines\nAn ingest pipeline is a sequence of processors that are applied to documents as they are ingested into an index. Each processor in a pipeline performs a specific task, such as filtering, transforming, or enriching data.\n\nProcessors are customizable tasks that run in a sequential order as they appear in the request body. This order is important, as each processor depends on the output of the previous processor. The modified documents appear in your index after the processors are applied.\n\nOpenSearch ingest pipelines compared to OpenSearch Data Prepper\nOpenSeach ingest pipelines run within the OpenSearch cluster, whereas OpenSearch Data Prepper is an external component that runs on the OpenSearch cluster.\n\nOpenSearch ingest pipelines perform actions on indexes and are preferred for use cases involving pre-processing simple datasets, machine learning (ML) processors, and vector embedding processors. OpenSearch ingest pipelines are recommended for simple data pre-processing and small datasets.\n\nOpenSearch Data Prepper is recommended for any data processing tasks it supports, particularly when dealing with large datasets and complex data pre-processing requirements. It streamlines the process of transferring and fetching large datasets while providing robust capabilities for intricate data preparation and transformation operations. Refer to the OpenSearch Data Prepper documentation for more information.\n\nOpenSearch ingest pipelines can only be managed using Ingest API operations.\n\nPrerequisites\nThe following are prerequisites for using OpenSearch ingest pipelines:\n\nWhen using ingestion in a production environment, your cluster should contain at least one node with the node roles permission set to ingest. For information about setting up node roles within a cluster, see Cluster Formation.\nIf the OpenSearch Security plugin is enabled, you must have the cluster_manage_pipelines permission to manage ingest pipelines.\nDefine a pipeline\nA pipeline definition describes the sequence of an ingest pipeline and can be written in JSON format. An ingest pipeline consists of the following:\n\n{\n    \"description\" : \"...\"\n    \"processors\" : [...]\n}\nRequest body fields\nField\tRequired\tType\tDescription\nprocessors\tRequired\tArray of processor objects\tA component that performs a specific data processing task as the data is being ingested into OpenSearch.\ndescription\tOptional\tString\tA description of the ingest pipeline.\n"}
{"index": {"_index": "opensearch_docs"}}
{"passage_text": "Monitors\nProactively monitor your data in OpenSearch with features available in Alerting and Anomaly Detection. For example, you can pair Anomaly Detection with Alerting to ensure that you’re notified as soon as an anomaly is detected. You can do this by setting up a detector to automatically detect outliers in your streaming data and monitors to alert you through notifications when data exceeds certain thresholds.\n\nMonitor types\nThe Alerting plugin provides the following monitor types:\n\nper query: Runs a query and generates alert notifications based on the matching criteria. See Per query monitors for information about creating and using this monitor type.\nper bucket: Runs a query that evaluates trigger criteria based on aggregated values in the dataset. See Per bucket monitors for information about creating and using this monitor type.\nper cluster metrics: Runs API requests on the cluster to monitor its health. See Per cluster metrics monitors for information about creating and using this monitor type.\nper document: Runs a query (or multiple queries combined by a tag) that returns individual documents that match the alert notification trigger condition. See Per document monitors for information about creating and using this monitor type.\ncomposite monitor: Runs multiple monitors in a single workflow and generates a single alert based on multiple trigger conditions. See Composite monitors for information about creating and using this monitor type.\nThe maximum number of monitors you can create is 1,000. You can change the default maximum number of alerts for your cluster by updating the plugins.alerting.monitor.max_monitors setting using the cluster settings API."}
{"index": {"_index": "opensearch_docs"}}
{"passage_text": "Search pipelines\nYou can use search pipelines to build new or reuse existing result rerankers, query rewriters, and other components that operate on queries or results. Search pipelines make it easier for you to process search queries and search results within OpenSearch. Moving some of your application functionality into an OpenSearch search pipeline reduces the overall complexity of your application. As part of a search pipeline, you specify a list of processors that perform modular tasks. You can then easily add or reorder these processors to customize search results for your application.\n\nTerminology\nThe following is a list of search pipeline terminology:\n\nSearch request processor: A component that intercepts a search request (the query and the metadata passed in the request), performs an operation with or on the search request, and returns the search request.\nSearch response processor: A component that intercepts a search response and search request (the query, results, and metadata passed in the request), performs an operation with or on the search response, and returns the search response.\nSearch phase results processor: A component that runs between search phases at the coordinating node level. A search phase results processor intercepts the results retrieved from one search phase and transforms them before passing them to the next search phase.\nProcessor: Either a search request processor or a search response processor.\nSearch pipeline: An ordered list of processors that is integrated into OpenSearch. The pipeline intercepts a query, performs processing on the query, sends it to OpenSearch, intercepts the results, performs processing on the results, and returns them to the calling application, as shown in the following diagram.\n"}
```
{% include copy-curl.html %}

To verify that the documents were properly processed, search the index to view the generated chunks and embeddings:

```json
GET opensearch_docs/_search
```
{% include copy-curl.html %}

## Step 4: Search using an ML inference processor

Create a search pipeline with an ML inference processor that converts input text into embeddings:

```json
PUT _search/pipeline/bedrock_semantic_search_pipeline
{
  "request_processors": [
    {
      "ml_inference": {
        "model_id": "xhR35JQBLopfJ2xsO9pr",
        "input_map": [
          {
            "inputText": "ext.ml_inference.params.text"
          }
        ],
        "output_map": [
          {
            "ext.ml_inference.params.vector": "embedding"
          }
        ]
      }
    }
  ]
}
```
{% include copy-curl.html %}

Use the following template query to run a semantic search:

```json
GET opensearch_docs/_search?search_pipeline=bedrock_semantic_search_pipeline
{
  "query": {
    "template": {
      "nested": {
        "path": "passage_chunk",
        "query": {
          "knn": {
            "passage_chunk.embedding": {
              "vector": "${ext.ml_inference.params.vector}",
              "k": 5
            }
          }
        }
      }
    }
  },
  "ext": {
    "ml_inference": {
      "params": {
        "text": "What's OpenSearch ingest pipeline"
      }
    }
  },
  "_source": {
    "excludes": [
      "passage_chunk"
    ]
  },
  "size": 1
}
```
{% include copy-curl.html %}

The pipeline maps `inputText` to `ext.ml_inference.params.text`. During input processing, the pipeline retrieves the value from the path `ext.ml_inference.params.text` in the search request. In this example, the value in this path is `"What's OpenSearch ingest pipeline"`, and this value is passed to the model in the `inputText` parameter.

During search, the search query references `"vector": "${ext.ml_inference.params.vector}"`. This vector value isn't provided in the initial search request; instead, the ML inference processor generates it by invoking the Amazon Bedrock Titan Embeddings model. The model creates an embedding vector from your search text and stores the vector in `ext.ml_inference.params.vector`. OpenSearch then uses this generated vector to find similar documents:

```json
{
  "took": 398,
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
    "max_score": 0.78014797,
    "hits": [
      {
        "_index": "opensearch_docs",
        "_id": "rj2T5JQBg4dihuRifxJT",
        "_score": 0.78014797,
        "_source": {
          "passage_text": """Ingest pipelines
An ingest pipeline is a sequence of processors that are applied to documents as they are ingested into an index. Each processor in a pipeline performs a specific task, such as filtering, transforming, or enriching data.

Processors are customizable tasks that run in a sequential order as they appear in the request body. This order is important, as each processor depends on the output of the previous processor. The modified documents appear in your index after the processors are applied.

OpenSearch ingest pipelines compared to OpenSearch Data Prepper
OpenSeach ingest pipelines run within the OpenSearch cluster, whereas OpenSearch Data Prepper is an external component that runs on the OpenSearch cluster.

OpenSearch ingest pipelines perform actions on indexes and are preferred for use cases involving pre-processing simple datasets, machine learning (ML) processors, and vector embedding processors. OpenSearch ingest pipelines are recommended for simple data pre-processing and small datasets.

OpenSearch Data Prepper is recommended for any data processing tasks it supports, particularly when dealing with large datasets and complex data pre-processing requirements. It streamlines the process of transferring and fetching large datasets while providing robust capabilities for intricate data preparation and transformation operations. Refer to the OpenSearch Data Prepper documentation for more information.

OpenSearch ingest pipelines can only be managed using Ingest API operations.

Prerequisites
The following are prerequisites for using OpenSearch ingest pipelines:

When using ingestion in a production environment, your cluster should contain at least one node with the node roles permission set to ingest. For information about setting up node roles within a cluster, see Cluster Formation.
If the OpenSearch Security plugin is enabled, you must have the cluster_manage_pipelines permission to manage ingest pipelines.
Define a pipeline
A pipeline definition describes the sequence of an ingest pipeline and can be written in JSON format. An ingest pipeline consists of the following:

{
    "description" : "..."
    "processors" : [...]
}
Request body fields
Field	Required	Type	Description
processors	Required	Array of processor objects	A component that performs a specific data processing task as the data is being ingested into OpenSearch.
description	Optional	String	A description of the ingest pipeline.
"""
        }
      }
    ]
  }
}
```
