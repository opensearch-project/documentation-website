---
layout: default
title: Reranking by a field using a late interaction model
parent: Reranking search results
grand_parent: Search relevance
has_children: false
nav_order: 40
canonical_url: https://docs.opensearch.org/latest/search-plugins/search-relevance/rerank-by-field-late-interaction/
---

# Reranking by a field using an externally hosted late interaction model
**Introduced 3.3**
{: .label .label-purple }

In this tutorial, you'll learn how to use a late interaction model (such as ColBERT or ColPali) hosted on Amazon SageMaker to rerank search results and improve search relevance for multimodal content.

Late interaction models balance speed and accuracy by generating multiple vectors per document and query, then performing fine-grained token-level matching during search. This approach is particularly effective for multimodal content (such as images with text, technical diagrams, and complex documents), for which detailed semantic analysis improves relevance. By combining fast k-NN retrieval with token-level reranking, late interaction models efficiently handle complex queries and capture nuanced semantic relationships across text and other content types.

To implement late interaction reranking, you'll configure both ingest and search pipelines:
- **Ingest pipeline**: Generates multi-vectors and single k-NN vectors during document indexing using the [`ml_inference` ingest processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/ml-inference/).
- **Search pipeline**: Processes queries at search time, generating query vectors for both k-NN retrieval and late interaction reranking using the [`ml_inference` search request processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/ml-inference-search-request/) and the [`lateInteractionScore`]({{site.url}}{{site.baseurl}}/query-dsl/specialized/script-score/#late-interaction-score) function.

## Prerequisite: Deploy a ColPali model on Amazon SageMaker

To deploy the `vidore/colpali-v1.3-hf` model from Hugging Face to a SageMaker endpoint, run the following Python code in a SageMaker notebook:

```python
import sagemaker
import boto3
from sagemaker.huggingface import HuggingFaceModel

try:
    role = sagemaker.get_execution_role()
except ValueError:
    iam = boto3.client('iam')
    # Replace with your SageMaker execution role name if different
    role = iam.get_role(RoleName='sagemaker_execution_role')['Role']['Arn']

# Hub Model configuration
hub = {
    'HF_MODEL_ID':'vidore/colpali-v1.3-hf',
    'HF_TASK':'visual-document-retrieval'
}

# Create Hugging Face Model Class
huggingface_model = HuggingFaceModel(
    transformers_version='4.49.0',
    pytorch_version='2.6.0',
    py_version='py312',
    env=hub,
    role=role, 
)

# Deploy model to SageMaker Inference
predictor = huggingface_model.deploy(
    initial_instance_count=1, # number of instances
    instance_type='ml.m5.xlarge' # ec2 instance type
)

# Save the endpoint name for OpenSearch configuration
print(f"SageMaker Endpoint Name: {predictor.endpoint_name}")
```
{% include copy.html %}

After deployment, find your endpoint name in the Amazon SageMaker console under **Inference > Endpoints**. You'll use this endpoint URL in the connector configuration.

## Running a search with late interaction reranking

To implement late interaction reranking, follow these steps:

1. [Register the model](#step-1-register-the-model).
1. [Create an index with appropriate mappings](#step-2-create-an-index).
1. [Create an ingest pipeline](#step-3-create-an-ingest-pipeline).
1. [Ingest documents](#step-4-ingest-documents).
1. [Create a search pipeline](#step-5-create-a-search-pipeline).
1. [Search using late interaction reranking](#step-6-search-using-late-interaction-reranking).

## Step 1: Register the model

Register the ColPali model by creating a connector and registering it with OpenSearch:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
    "name": "ColPali model",
    "function_name": "remote",
    "description": "ColPali model for multimodal search",
    "connector": {
        "name": "Amazon SageMaker connector",
        "description": "Connector for ColPali in SageMaker",
        "version": 1,
        "protocol": "aws_sigv4",
        "parameters": {
            "region": "us-east-1",
            "service_name": "sagemaker"
        },
        "credential": {
            "access_key": "<YOUR_ACCESS_KEY>",
            "secret_key": "<YOUR_SECRET_KEY>",
            "session_token": "<YOUR_SESSION_TOKEN>"
        },
        "actions": [
            {
                "action_type": "predict",
                "method": "POST",
                "url": "<YOUR_SAGEMAKER_ENDPOINT>",
                "headers": {
                    "content-type": "application/json"
                },
                "request_body": "{ \"queries\": ${parameters.queries:-[]}, \"images\": ${parameters.images:-[]} }"
            }
        ]
    }
}
```
{% include copy-curl.html %}

Note the `model_id` from the response; you'll use it in subsequent steps.

## Step 2: Create an index

Create an index with mappings optimized for storing both multi-vectors and single k-NN vectors. The `colbert_vectors` field is stored as an `object` with `enabled: false` for optimal performance. The `knn_vector` field is configured for the `hnsw` algorithm, with the number of dimensions matching the model's number of dimensions. The `image` field stores Base64-encoded image data as a `keyword`:


```json
PUT /multimodal_docs
{
  "settings": {
    "index.knn": true,
    "index.knn.algo_param.ef_search": 100
  },
  "mappings": {
    "properties": {
      "title": {
        "type": "text"
      },
      "description": {
        "type": "text"
      },
      "image": {
        "type": "keyword"
      },
      "colbert_vectors": {
        "type": "object",
        "enabled": false
      },
      "knn_vector": { 
        "type": "knn_vector", 
        "dimension": 128,
        "method": {
          "name": "hnsw",
          "engine": "lucene"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Step 3: Create an ingest pipeline

Create an ingest pipeline that generates both multi-vectors for late interaction and single vectors for k-NN search:

```json
PUT /_ingest/pipeline/colpali_pipeline
{
  "processors": [
    {
      "ml_inference": {
        "tag": "ml_inference",
        "description": "Generate multi-vectors and mean pooling vector for multimodal content",
        "model_id": "<YOUR_MODEL_ID>",
        "input_map": [
          {
            "images": "$..image"
          }
        ],
        "output_map": [
          {
            "colbert_vectors": "image_embeddings[0]",
            "knn_vector": "image_embeddings[0].meanPooling()"
          }
        ],
        "ignore_missing": false,
        "ignore_failure": false
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Step 4: Ingest documents

Ingest sample documents containing Base64-encoded images and descriptive content:

```json
PUT /multimodal_docs/_doc/1?pipeline=colpali_pipeline
{
  "title": "Data Visualization Chart",
  "description": "A comprehensive bar chart showing quarterly sales performance with multiple data series and trend analysis",
  "image": "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"
}

```
{% include copy-curl.html %}

```json
PUT /multimodal_docs/_doc/2?pipeline=colpali_pipeline
{
  "title": "Technical Architecture Diagram",
  "description": "System architecture diagram showing microservices, databases, and API connections with detailed component relationships",
  "image": "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"
}
```
{% include copy-curl.html %}

```json
PUT /multimodal_docs/_doc/3?pipeline=colpali_pipeline
{
  "title": "Financial Report Summary",
  "description": "Quarterly financial report with revenue charts, expense breakdowns, and profit margin analysis across different business units",
  "image": "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"
}
```
{% include copy-curl.html %}

## Step 5: Create a search pipeline

Create a search pipeline that generates query vectors and performs both k-NN retrieval and late interaction reranking:

```json
PUT /_search/pipeline/colpali_search_pipeline
{
  "description": "Generate query vectors for KNN search and late interaction reranking",
  "request_processors": [
    {
      "ml_inference": {
        "model_id": "<YOUR_MODEL_ID>",
        "query_template": "{\n    \"query\": {\n        \"knn\": {\n            \"knn_vector\": {\n                \"vector\": ${query_knn_vector},\n                \"k\": 100\n            }\n        }\n    },\n    \"rescore\": {\n        \"query\": {\n            \"rescore_query\": {\n                \"script_score\": {\n                    \"query\": {\n                        \"match_all\": {}\n                    }, \n                    \"script\": {\n                        \"source\": \"lateInteractionScore(params.query_vector, 'colbert_vectors', params._source)\",\n                        \"params\": {\n                            \"query_vector\": ${query_colbert_vectors}\n                        }\n                    }\n                }\n            }\n        }\n    },\n    \"size\": 10,\n  \"_source\": {\n    \"excludes\": [\"knn_vector\"]\n  }\n}",
        "input_map": [
          {
            "queries": "$..query.term.search_text.value"
          }
        ],
        "output_map": [
          {
            "query_colbert_vectors": "query_embeddings[0]",
            "query_knn_vector": "query_embeddings[0].meanPooling()"
          }
        ]
      }
    }
  ]
}
```
{% include copy-curl.html %}

The following is the `query_template` from the preceding search pipeline, formatted for clarity. The template defines how the original search query is rewritten:

```json
{
  "query": {
    "knn": {
      "knn_vector": {
        "vector": ${query_knn_vector},
        "k": 100
      }
    }
  },
  "rescore": {
    "query": {
      "rescore_query": {
        "script_score": {
          "query": {
            "match_all": {}
          },
          "script": {
            "source": "lateInteractionScore(params.query_vector, 'colbert_vectors', params._source)",
            "params": {
              "query_vector": ${query_colbert_vectors}
            }
          }
        }
      }
    }
  },
  "size": 10,
  "_source": {
    "excludes": ["knn_vector"]
  }
}
```

Note the following components of the query template:

- Template variables:
   - `${query_knn_vector}`: Mean-pooled vector for fast k-NN retrieval
   - `${query_colbert_vectors}`: Multi-vectors for precise late interaction scoring
- Rewritten query structure:
   - `knn` query: Uses `query_knn_vector` to find the top 100 candidates quickly
   - `rescore_query`: Uses `query_colbert_vectors` with the `lateInteractionScore` function for precise reranking
   - `_source` filtering: Excludes vector fields from the response to reduce payload size

## Step 6: Search using late interaction reranking

Now you can search for documents using k-NN retrieval and late interaction reranking:

```json
GET /multimodal_docs/_search?search_pipeline=colpali_search_pipeline
{
  "query": {
    "term": {
      "search_text": {
        "value": "financial report"
      }
    }
  }
}
```
{% include copy-curl.html %}

When you run this search request, OpenSearch executes the following steps:

1. **Query processing**: The search text (`"financial data charts"`) is sent to the ColPali model, which generates query vectors.

1. **k-NN retrieval**: The mean-pooled query vector (`query_knn_vector`) performs approximate k-NN search to retrieve the top 100 candidate documents. This step prioritizes speed.

1. **Late interaction reranking**: Multi-vectors (`query_colbert_vectors`) are used with the `lateInteractionScore` function to rerank results based on fine-grained token-level matching. This step prioritizes accuracy.

1. **Final results**: The top 10 documents are returned, ranked by their late interaction scores.

This hybrid approach balances speed and accuracy, making it suitable for production search systems. The response contains documents reranked based on their semantic similarity to the query, with late interaction scoring providing more nuanced relevance than traditional vector search alone:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 2135,
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
    "max_score": 11.68498,
    "hits": [
      {
        "_index": "multimodal_docs",
        "_id": "3",
        "_score": 11.68498,
        "_source": {
          "image": "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",
          "description": "Quarterly financial report with revenue charts, expense breakdowns, and profit margin analysis across different business units",
          "title": "Financial Report Summary"
        }
      },
      {
        "_index": "multimodal_docs",
        "_id": "1",
        "_score": 9.761469,
        "_source": {
          "image": "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",
          "description": "A comprehensive bar chart showing quarterly sales performance with multiple data series and trend analysis",
          "title": "Data Visualization Chart"
        }
      },
      {
        "_index": "multimodal_docs",
        "_id": "2",
        "_score": 9.619822,
        "_source": {
          "image": "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",
          "description": "System architecture diagram showing microservices, databases, and API connections with detailed component relationships",
          "title": "Technical Architecture Diagram"
        }
      }
    ]
  }
}
```

</details>

## Debugging and testing

You can perform the following actions to debug and test the search.

### Simulating the ingest pipeline

Before ingesting documents, test the ingest pipeline to verify it processes documents correctly:

```json
POST /_ingest/pipeline/colpali_pipeline/_simulate?verbose=true
{
  "docs": [
    {
      "_index": "multimodal_docs",
      "_id": "test_1",
      "_source": {
        "title": "Test Chart",
        "description": "Sample chart for testing pipeline",
        "image": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoADwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigD//2Q=="
      }
    }
  ]
}
```
{% include copy-curl.html %}

The response shows how the document will be processed and includes the generated `colbert_vectors` and `knn_vector` fields:

```json
{
  "docs": [
    {
      "processor_results": [
        {
          "processor_type": "ml_inference",
          "status": "success",
          "description": "Generate multi-vectors and mean pooling vector for multimodal content",
          "tag": "ml_inference",
          "doc": {
            "_index": "multimodal_docs",
            "_id": "test_1",
            "_source": {
              "title": "Test Chart",
              "description": "Sample chart for testing pipeline",
              "image": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoADwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigD//2Q==",
              "colbert_vectors": [
                [
                  -0.0653999000787735,
                  0.1100006103515625,
                  0.2052547186613083
                ],
                [
                  0.0234567890123456,
                  -0.0987654321098765,
                  0.1357924680135792
                ]
              ],
              "knn_vector": [
                0.025610961,
                0.045123789,
                0.067891234
              ]
            },
            "_ingest": {
              "pipeline": "colpali_pipeline",
              "timestamp": "2025-10-02T23:17:01.615598095Z"
            }
          }
        }
      ]
    }
  ]
}
```

### Debugging the search pipeline

Test the search pipeline with verbose output to see how queries are rewritten:

```json
GET /multimodal_docs/_search?search_pipeline=colpali_search_pipeline&verbose_pipeline=true
{
  "query": {
    "term": {
      "search_text": {
        "value": "financial data charts"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response provides a complete view of the query transformation process captured in the `processor_results` section. It shows the original query text ("financial data charts") submitted as input, the generated query vectors (both multi-vectors and mean-pooled vector), and the rewritten query structure using k-NN search with late interaction rescoring. Processing times for each step are also included, providing detailed information for debugging and performance optimization:

```json
{
  "took": 1835,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 8.247408,
    "hits": [
      {
        "_index": "multimodal_docs",
        "_id": "3",
        "_score": 8.247408,
        "_source": {
          "title": "Financial Report Summary",
          "description": "Quarterly financial report with revenue charts, expense breakdowns, and profit margin analysis across different business units"
        }
      }
    ]
  },
  "processor_results": [
    {
      "processor_name": "ml_inference",
      "duration_millis": 1200,
      "status": "success",
      "input_data": {
        "query": {
          "term": {
            "search_text": {
              "boost": 1,
              "value": "financial data charts"
            }
          }
        }
      },
      "output_data": {
        "size": 10,
        "query": {
          "knn": {
            "knn_vector": {
              "vector": [
                -0.06357764,
                0.021222984,
                0.06605018,
                0.07643713
              ],
              "boost": 1,
              "k": 100
            }
          }
        },
        "_source": {
          "excludes": [
            "knn_vector"
          ]
        },
        "rescore": [
          {
            "query": {
              "rescore_query": {
                "script_score": {
                  "query": {
                    "match_all": {
                      "boost": 1
                    }
                  },
                  "script": {
                    "source": "lateInteractionScore(params.query_vector, 'colbert_vectors', params._source)",
                    "params": {
                      "query_vector": [
                        [
                          -0.0024404169525951147,
                          0.14708828926086426,
                          0.15877428650856018
                        ],
                        [
                          0.08923456789012346,
                          -0.03456789012345679,
                          0.20123456789012345
                        ]
                      ]
                    }
                  }
                }
              }
            }
          }
        ]
      }
    }
  ]
}
```

## Related documentation

- [Late interaction score function]({{site.url}}{{site.baseurl}}/query-dsl/specialized/script-score/#late-interaction-score)

