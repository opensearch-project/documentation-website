---
layout: default
title: Reranking by a field using a late interaction model
parent: Reranking search results
grand_parent: Search relevance
has_children: false
nav_order: 40
---

# Reranking by a field using an externally hosted late interaction model
Introduced 3.3
{: .label .label-purple }

In this tutorial, you'll learn how to use a late interaction model (such as ColBERT or ColPali) hosted on Amazon SageMaker to rerank search results and improve search relevance for multimodal content.

Late interaction models provide a balance between speed and accuracy by generating multiple vectors per document and query, then performing fine-grained token-level matching during search. This approach is particularly effective for multimodal content like images with text, technical diagrams, and complex documents.

To implement late interaction reranking, you'll configure both ingest and search pipelines:
- **Ingest pipeline**: Generates multi-vectors and single KNN vectors during document indexing using the [`ml_inference` ingest processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/ml-inference/)
- **Search pipeline**: Processes queries at search time, generating query vectors for both KNN retrieval and late interaction reranking using the [`ml_inference` search request processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/ml-inference-search-request/) and the [`lateInteractionScore`]({{site.url}}{{site.baseurl}}/query-dsl/specialized/late-interaction-score/) function

## Prerequisite: Deploy a ColPali model on Amazon SageMaker

Deploy the `vidore/colpali-v1.3-hf` model from Hugging Face to a SageMaker endpoint. Run the following Python code in a SageMaker Notebook:

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

1. [Register the model](#step-1-register-the-model)
1. [Create an index with appropriate mappings](#step-2-create-an-index)
1. [Create an ingest pipeline](#step-3-create-an-ingest-pipeline)
1. [Ingest documents](#step-4-ingest-documents)
1. [Create a search pipeline](#step-5-create-a-search-pipeline)
1. [Search using late interaction reranking](#step-6-search-using-late-interaction-reranking)

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

Create an index with mappings optimized for storing both multi-vectors and single KNN vectors:

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

**Key mapping considerations:**
- `colbert_vectors`: Stored as `object` with `enabled: false` for optimal performance
- `knn_vector`: Configured for HNSW algorithm with appropriate dimensions
- `image`: Base64-encoded image data stored as keyword

## Step 3: Create an ingest pipeline

Create an ingest pipeline that generates both multi-vectors for late interaction and single vectors for KNN search:

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

Ingest sample documents with base64-encoded images and descriptive content:

```json
PUT /multimodal_docs/_doc/1?pipeline=colpali_pipeline
{
    "title": "Data Visualization Chart",
    "description": "A comprehensive bar chart showing quarterly sales performance with multiple data series and trend analysis",
    "image": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoADwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigD//2Q=="
}

PUT /multimodal_docs/_doc/2?pipeline=colpali_pipeline
{
    "title": "Technical Architecture Diagram",
    "description": "System architecture diagram showing microservices, databases, and API connections with detailed component relationships",
    "image": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoADwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigD//2Q=="
}

PUT /multimodal_docs/_doc/3?pipeline=colpali_pipeline
{
    "title": "Financial Report Summary",
    "description": "Quarterly financial report with revenue charts, expense breakdowns, and profit margin analysis across different business units",
    "image": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoADwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigD//2Q=="
}
```
{% include copy-curl.html %}

## Step 5: Create a search pipeline

Create a search pipeline that generates query vectors and performs both KNN retrieval and late interaction reranking:

```json
PUT /_search/pipeline/colpali_search_pipeline
{
  "description": "Generate query vectors for KNN search and late interaction reranking",
  "request_processors": [
    {
      "ml_inference": {
        "model_id": "<YOUR_MODEL_ID>",
        "query_template": "{\n    \"query\": {\n        \"knn\": {\n            \"knn_vector\": {\n                \"vector\": ${query_knn_vector},\n                \"k\": 100\n            }\n        }\n    },\n    \"rescore\": {\n        \"query\": {\n            \"rescore_query\": {\n                \"script_score\": {\n                    \"query\": {\n                        \"match_all\": {}\n                    }, \n                    \"script\": {\n                        \"source\": \"lateInteractionScore(params.query_vector, 'colbert_vectors', params._source)\",\n                        \"params\": {\n                            \"query_vector\": ${query_colbert_vectors}\n                        }\n                    }\n                }\n            }\n        }\n    },\n    \"size\": 10,\n  \"_source\": {\n    \"excludes\": [\"knn_vector\",\"colbert_vectors\"]\n  }\n}",
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

## Step 6: Search using late interaction reranking

Now you can search for documents using both KNN retrieval and late interaction reranking:

```json
GET /multimodal_docs/_search?search_pipeline=colpali_search_pipeline
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

### How the search works

The search pipeline performs the following steps:

1. **Query Processing**: The search text is sent to the ColPali model to generate query vectors
2. **KNN Retrieval**: The mean-pooled query vector performs initial retrieval using KNN search (top 100 candidates)
3. **Late Interaction Reranking**: The multi-vector query representation is used with the `lateInteractionScore` function to rerank results based on fine-grained token-level matching
4. **Final Results**: Documents are returned ranked by their late interaction scores

The response will show documents reranked based on their semantic similarity to the query, with the late interaction model providing more nuanced relevance scoring than traditional vector search alone.

## Key benefits

Late interaction reranking provides several advantages:

- **Fine-grained matching**: Token-level comparisons capture detailed semantic relationships
- **Multimodal support**: Works with text, images, and other content types
- **Efficient retrieval**: Combines fast KNN search with precise reranking
- **Improved relevance**: Handles complex queries with multiple concepts

This approach is particularly effective for multimodal search scenarios where documents contain rich visual or structured content that benefits from detailed semantic analysis.
## Debugging and testing

### Simulate the ingest pipeline

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

The response shows how the document will be processed, including the generated `colbert_vectors` and `knn_vector` fields.

**Expected response:**
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

### Debug the search pipeline

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

The `verbose_pipeline=true` parameter shows the complete query transformation process, including:

- How the original query text is processed by the ColPali model
- The generated query vectors (both multi-vectors and mean-pooled vector)
- The rewritten query structure with KNN search and late interaction rescoring
- Processing times for each step

This debugging information helps troubleshoot issues and optimize performance.

**Expected response:**
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
                            "boost": 1.0,
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
                            "boost": 1.0,
                            "k": 100
                        }
                    }
                },
                "_source": {
                    "excludes": [
                        "knn_vector",
                        "colbert_vectors"
                    ]
                },
                "rescore": [
                    {
                        "query": {
                            "rescore_query": {
                                "script_score": {
                                    "query": {
                                        "match_all": {
                                            "boost": 1.0
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
                                                    0.089234567890123456,
                                                    -0.034567890123456789,
                                                    0.201234567890123456
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

### Understanding the response

The `processor_results` section shows:
- **Input transformation**: How "financial data charts" becomes the query input
- **Vector generation**: The ColPali model generates both multi-vectors and mean-pooled vectors
- **Query rewriting**: The original query becomes a KNN query with late interaction rescoring
- **Performance metrics**: Processing time (1200ms) for optimization

## Understanding the query template

The `query_template` in the search pipeline defines how the original search query gets rewritten. Let's break down each part:

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
        "excludes": ["knn_vector","colbert_vectors"]
    }
}
```

### Query transformation process

1. **Original query**: `"financial data charts"` (text input)
2. **ML inference**: ColPali model generates vectors from the text
3. **Template variables**:
   - `${query_knn_vector}`: Mean-pooled vector for fast KNN retrieval
   - `${query_colbert_vectors}`: Multi-vectors for precise late interaction scoring

4. **Rewritten query structure**:
   - **KNN query**: Uses `query_knn_vector` to find top 100 candidates quickly
   - **Rescore query**: Uses `query_colbert_vectors` with `lateInteractionScore` function for precise reranking
   - **Source filtering**: Excludes vector fields from response to reduce payload size

### Two-stage execution

1. **Stage 1 - KNN Retrieval**: Fast approximate search using the mean-pooled vector finds the top 100 most similar documents
2. **Stage 2 - Late Interaction Reranking**: Precise token-level matching using multi-vectors reorders the candidates for better relevance

This hybrid approach balances speed and accuracy, making it suitable for production search systems.
