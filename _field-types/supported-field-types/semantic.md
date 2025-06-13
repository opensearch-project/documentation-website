---
layout: default
title: Semantic
nav_order: 20
parent: Supported field types
has_math: true
---

# Semantic
**Introduced 3.1**
{: .label .label-purple }

The `semantic` field type is a high-level abstraction that simplifies neural search setup in OpenSearch. It can wrap a variety of field types—including all String fields and binary—and automatically enables semantic indexing and querying based on the configured machine learning (ML) model.

## Example

**PREREQUISITE**<br>
Before using the `semantic` field type, you must install the `neural-search` plugin. And you must have either a local ML model hosted on your OpenSearch cluster or an externally hosted model connected to your OpenSearch cluster through the ML Commons plugin. For more information about local models, see [Using ML models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/using-ml-models/). For more information about externally hosted models, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/).
{: .note}

Create an index with a semantic field using a dense model.

```json
PUT /my-nlp-index
{
  "settings": {
    "index": {
      "knn": true
    }
  },
  "mappings": {
    "properties": {
      "passage": {
        "type": "semantic",
        "model_id": "n17yX5cBsaYnPfyOzmQU"
      }
    }
  }
}
```
{% include copy-curl.html %}

After creating the index, you can retrieve its mapping to verify that the embedding field was automatically created.

An object field named `passage_semantic_info` is automatically created. It includes a `knn_vector` subfield to store the embedding, as well as additional text fields to capture model metadata such as the model ID, model name, and model type. Check the below example to see more details.

The `dimension` and `space_type` of the `knn_vector` field are determined by the ML model configuration. For [pretrained dense models](ml-commons-plugin/pretrained-models/#sentence-transformers), this information is included in the model config by default. However, for remote dense models, you must ensure that the dimension and space_type are explicitly defined in the model config before using it with a semantic field.

You may notice that the auto-created `knn_vector` field supports additional configurations that are not currently exposed through the semantic field. For other constraints, see the [Limitations](#limitations) section.
{: .note}

```json
GET /my-nlp-index/_mapping
{
  "my-nlp-index": {
    "mappings": {
      "properties": {
        "passage": {
          "type": "semantic",
          "model_id": "n17yX5cBsaYnPfyOzmQU",
          "raw_field_type": "text"
        },
        "passage_semantic_info": {
          "properties": {
            "embedding": {
              "type": "knn_vector",
              "dimension": 384,
              "method": {
                "engine": "faiss",
                "space_type": "l2",
                "name": "hnsw",
                "parameters": {}
              }
            },
            "model": {
              "properties": {
                "id": {
                  "type": "text",
                  "index": false
                },
                "name": {
                  "type": "text",
                  "index": false
                },
                "type": {
                  "type": "text",
                  "index": false
                }
              }
            }
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Create an index with a semantic field using a sparse model.

```json
PUT /my-nlp-index
{
  "mappings": {
    "properties": {
      "passage": {
        "type": "semantic",
        "model_id": "nF7yX5cBsaYnPfyOq2SG"
      }
    }
  }
}
```
{% include copy-curl.html %}

After creating the index, you can retrieve its mapping to verify that the embedding field was automatically created as a rank_features field.

```json
GET /my-nlp-index/_mapping
{
  "my-nlp-index": {
    "mappings": {
      "properties": {
        "passage": {
          "type": "semantic",
          "model_id": "nF7yX5cBsaYnPfyOq2SG",
          "raw_field_type": "text"
        },
        "passage_semantic_info": {
          "properties": {
            "embedding": {
              "type": "rank_features"
            },
            "model": {
              "properties": {
                "id": {
                  "type": "text",
                  "index": false
                },
                "name": {
                  "type": "text",
                  "index": false
                },
                "type": {
                  "type": "text",
                  "index": false
                }
              }
            }
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

### Parameters

The following table lists the parameters accepted by semantic field types.

Parameter | Data type | Required/Optional | Description
:--- |:--- |:--- |:---
`type` | String    | Required | The semantic field type. Must be `semantic`.
`raw_field_type` | String    | Optional | Specifies the underlying field type that the semantic field wraps. The raw input is stored as this type at the path of the semantic field, allowing it to behave like a standard field of that type. Valid values are `text`, `keyword`, `match_only_text`, `wildcard`, `token_count` and `binary`. Default is `text`. You can use any parameters supported by the underlying field type, and those parameters will function as expected.
`model_id` | String    | Required | Specifies the ID of the ML model to use for embedding generation. The model is used both during ingestion—to create embeddings from field values—and during query time to generate embeddings from the query input.
`search_model_id` | String    | Optional | Specifies the ID of the ML model to use for generating embeddings from the query input. If not provided, the model_id configured for the field will be used by default. This field cannot be provided with the `semantic_field_search_analyzer` at the same time.
`semantic_info_field_name` | String    | Optional | Allows you to customize the name of the semantic metadata field that stores embeddings and model information. By default, the name is generated by appending `_semantic_info` to the name of the `semantic` field.
`chunking` | Boolean   | Optional | Enables or disables text chunking during ingestion. When set to true, the input is split using a fixed token length chunking algorithm with default configs. For details, see the [Fixed Token Length Algorithm]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/text-chunking/#fixed-token-length-algorithm). Valid values are `true` and `false`. Default is `false`. In future releases, OpenSearch will support more flexible and configurable text chunking strategies.
`semantic_field_search_analyzer` | String    | Optional | Allows you to use a analyzer to tokenize the query input when you are using a sparse model. Valid values are `standard`, `bert-uncased` and `mbert-uncased`. If not provided, the model_id configured for the field will be used by default. This field cannot be provided with the `search_model_id` at the same time.

### Text Chunking

By default, text chunking is `disabled` for `semantic` fields. This is because enabling chunking requires storing each chunk’s embedding in a nested object, which can increase search latency. Searching nested objects involves joining child documents back to their parent, along with additional scoring and aggregation logic. The more matching child documents there are, the higher the potential latency.

However, if you're working with long-form text and want to improve search relevance, you can enable chunking by configuring the semantic field accordingly when creating the index, as shown below:

```json
PUT /my-nlp-index
{
  "mappings": {
    "properties": {
      "passage": {
        "type": "semantic",
        "model_id": "nF7yX5cBsaYnPfyOq2SG",
        "chunking": true
      }
    }
  }
}
```

### Limitations
When using a `semantic` field with a dense model, OpenSearch automatically creates a `knn_vector` field to store the embeddings. The `dimension` and `space_type` are derived from the model configuration, so you must ensure that this information is available before using the model. Other `knn_vector` parameters use default values, and customization is not currently supported.

To enable text chunking, you can set `chunking: true` in the semantic field configuration. However, chunking currently uses a fixed token-length algorithm by default, with no support for customizing the chunking strategy.

For sparse models, OpenSearch applies a default prune ratio of `0.1` when generating sparse embeddings. This pruning configuration is currently not customizable. When querying a semantic field with a sparse model, using the [`neural_sparse_two_phase_processor`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/neural-sparse-query-two-phase-processor/) to optimize search speed is not supported.

Querying a semantic field from a remote cluster is not supported at this time.

## Next steps
- [Semantic Field Using Dense Model]({{site.url}}{{site.baseurl}}/vector-search/ai-search/semantic-search/#manual-setup-with-semantic-field)
- [Semantic Field Using Sparse Model]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-with-pipelines/#using-semantic-field)