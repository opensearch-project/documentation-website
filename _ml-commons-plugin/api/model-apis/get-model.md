---
layout: default
title: Get model
parent: Model APIs
grand_parent: ML Commons API
nav_order: 20
---

# Get a model

To retrieve information about a model, you can:

- [Get a model by ID](#get-a-model-by-id)
- [Search for a model](#search-for-a-model)

## Get a model by ID

You can retrieve model information using the `model_id`.

For information about user access for this API, see [Model access control considerations]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/index/#model-access-control-considerations).

## Path and HTTP methods

```json
GET /_plugins/_ml/models/<model-id>
```

#### Example request

```json
GET /_plugins/_ml/models/N8AE1osB0jLkkocYjz7D
```
{% include copy-curl.html %}

#### Example response

```json
{
"name" : "all-MiniLM-L6-v2_onnx",
"algorithm" : "TEXT_EMBEDDING",
"version" : "1",
"model_format" : "TORCH_SCRIPT",
"model_state" : "LOADED",
"model_content_size_in_bytes" : 83408741,
"model_content_hash_value" : "9376c2ebd7c83f99ec2526323786c348d2382e6d86576f750c89ea544d6bbb14",
"model_config" : {
    "model_type" : "bert",
    "embedding_dimension" : 384,
    "framework_type" : "SENTENCE_TRANSFORMERS",
    "all_config" : """{"_name_or_path":"nreimers/MiniLM-L6-H384-uncased","architectures":["BertModel"],"attention_probs_dropout_prob":0.1,"gradient_checkpointing":false,"hidden_act":"gelu","hidden_dropout_prob":0.1,"hidden_size":384,"initializer_range":0.02,"intermediate_size":1536,"layer_norm_eps":1e-12,"max_position_embeddings":512,"model_type":"bert","num_attention_heads":12,"num_hidden_layers":6,"pad_token_id":0,"position_embedding_type":"absolute","transformers_version":"4.8.2","type_vocab_size":2,"use_cache":true,"vocab_size":30522}"""
},
"created_time" : 1665961344044,
"last_uploaded_time" : 1665961373000,
"last_loaded_time" : 1665961815959,
"total_chunks" : 9
}
```

## Search for a model

Use this command to search for models you've already created.

The response will contain only those model versions to which you have access. For example, if you send a match all query, model versions for the following model group types will be returned:

- All public model groups in the index.
- Private model groups for which you are the model owner.
- Model groups that share at least one backend role with your backend roles.

For more information, see [Model access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/).

### Path and HTTP methods

```json
GET /_plugins/_ml/models/_search
POST /_plugins/_ml/models/_search
```

#### Example request: Searching for all models

```json
POST /_plugins/_ml/models/_search
{
  "query": {
    "match_all": {}
  },
  "size": 1000
}
```
{% include copy-curl.html %}

#### Example request: Searching for models with algorithm "FIT_RCF"

```json
POST /_plugins/_ml/models/_search
{
  "query": {
    "term": {
      "algorithm": {
        "value": "FIT_RCF"
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
    "took" : 8,
    "timed_out" : false,
    "_shards" : {
      "total" : 1,
      "successful" : 1,
      "skipped" : 0,
      "failed" : 0
    },
    "hits" : {
      "total" : {
        "value" : 2,
        "relation" : "eq"
      },
      "max_score" : 2.4159138,
      "hits" : [
        {
          "_index" : ".plugins-ml-model",
          "_id" : "-QkKJX8BvytMh9aUeuLD",
          "_version" : 1,
          "_seq_no" : 12,
          "_primary_term" : 15,
          "_score" : 2.4159138,
          "_source" : {
            "name" : "FIT_RCF",
            "version" : 1,
            "content" : "xxx",
            "algorithm" : "FIT_RCF"
          }
        },
        {
          "_index" : ".plugins-ml-model",
          "_id" : "OxkvHn8BNJ65KnIpck8x",
          "_version" : 1,
          "_seq_no" : 2,
          "_primary_term" : 8,
          "_score" : 2.4159138,
          "_source" : {
            "name" : "FIT_RCF",
            "version" : 1,
            "content" : "xxx",
            "algorithm" : "FIT_RCF"
          }
        }
      ]
    }
  }
```