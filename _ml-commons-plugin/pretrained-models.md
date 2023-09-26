---
layout: default
title: Pretrained models
parent: ML framework
nav_order: 120
---

Pretrained models were taken out of experimental status and released to General Availability in OpenSearch 2.9.  
{: .warning}

# Pretrained models

The ML framework supports a variety of open-source pretrained models that can assist with a range of machine learning (ML) search and analytics use cases. 

## Uploading pretrained models

To use a pretrained model in your OpenSearch cluster:

1. Select the model you want to upload. For a list of pretrained models, see [supported pretrained models](#supported-pretrained-models).
2. Upload the model using the [upload API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-serving-framework#upload-model-to-opensearch). Because a pretrained model originates from the ML Commons model repository, you only need to provide the `name`, `version`, and `model_format` in the upload API request.  

```
POST /_plugins/_ml/models/_upload
{
  "name": "huggingface/sentence-transformers/all-MiniLM-L12-v2",
  "version": "1.0.1",
  "model_format": "TORCH_SCRIPT"
}
```

For more information about how to upload and use ML models, see [ML Framework]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-serving-framework/).

## Supported pretrained models

The ML Framework supports the following models, categorized by type. All models are traced from [Hugging Face](https://huggingface.co/). Although models with the same type will have similar use cases, each model has a different model size and performs differently depending on your cluster. For a performance comparison of some pretrained models, see the [sbert documentation](https://www.sbert.net/docs/pretrained_models.html#model-overview).


### Sentence transformers

Sentence transformer models map sentences and paragraphs across a dimensional dense vector space. The number of vectors depends on the model. Use these models for use cases such as clustering and semantic search. 

The following table provides a list of sentence transformer models and artifact links you can use to download them. Note that you must prefix the model name with `huggingface/`, as shown in the **Model name** column. As of OpenSearch 2.6, all artifacts are set to version 1.0.1.

| Model name | Vector dimensions | Auto-truncation | TorchScript artifact | ONNX artifact |
|---|---|---|---|
| `huggingface/sentence-transformers/all-distilroberta-v1` | 768-dimensional dense vector space. | Yes | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-distilroberta-v1/1.0.1/torch_script/sentence-transformers_all-distilroberta-v1-1.0.1-torch_script.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-distilroberta-v1/1.0.1/torch_script/config.json) | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-distilroberta-v1/1.0.1/onnx/sentence-transformers_all-distilroberta-v1-1.0.1-onnx.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-distilroberta-v1/1.0.1/onnx/config.json) |
| `huggingface/sentence-transformers/all-MiniLM-L6-v2` | 384-dimensional dense vector space.  | Yes | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-MiniLM-L6-v2/1.0.1/torch_script/sentence-transformers_all-MiniLM-L6-v2-1.0.1-torch_script.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-MiniLM-L6-v2/1.0.1/torch_script/config.json) | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-MiniLM-L6-v2/1.0.1/onnx/sentence-transformers_all-MiniLM-L6-v2-1.0.1-onnx.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-MiniLM-L6-v2/1.0.1/onnx/config.json) |
| `huggingface/sentence-transformers/all-MiniLM-L12-v2` | 384-dimensional dense vector space. | Yes | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-MiniLM-L12-v2/1.0.1/torch_script/sentence-transformers_all-MiniLM-L12-v2-1.0.1-torch_script.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-MiniLM-L12-v2/1.0.1/onnx/config.json) | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-MiniLM-L12-v2/1.0.1/onnx/sentence-transformers_all-MiniLM-L12-v2-1.0.1-onnx.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-MiniLM-L12-v2/1.0.1/onnx/config.json) |
| `huggingface/sentence-transformers/all-mpnet-base-v2` | 768-dimensional dense vector space. | Yes | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-mpnet-base-v2/1.0.1/torch_script/sentence-transformers_all-mpnet-base-v2-1.0.1-torch_script.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-mpnet-base-v2/1.0.1/torch_script/config.json) | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-mpnet-base-v2/1.0.1/onnx/sentence-transformers_all-mpnet-base-v2-1.0.1-onnx.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/all-mpnet-base-v2/1.0.1/onnx/config.json) |
| `huggingface/sentence-transformers/msmarco-distilbert-base-tas-b` | 768-dimensional dense vector space. Optimized for semantic search. | No | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/msmarco-distilbert-base-tas-b/1.0.1/torch_script/sentence-transformers_msmarco-distilbert-base-tas-b-1.0.1-torch_script.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/msmarco-distilbert-base-tas-b/1.0.1/torch_script/config.json) | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/msmarco-distilbert-base-tas-b/1.0.1/onnx/sentence-transformers_msmarco-distilbert-base-tas-b-1.0.1-onnx.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/msmarco-distilbert-base-tas-b/1.0.1/onnx/config.json) |
| `huggingface/sentence-transformers/multi-qa-MiniLM-L6-cos-v1` | 384-dimensional dense vector space. Designed for semantic search and trained on 215 million question/answer pairs. | Yes | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/multi-qa-MiniLM-L6-cos-v1/1.0.1/torch_script/sentence-transformers_multi-qa-MiniLM-L6-cos-v1-1.0.1-torch_script.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/multi-qa-MiniLM-L6-cos-v1/1.0.1/torch_script/config.json) | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/multi-qa-MiniLM-L6-cos-v1/1.0.1/onnx/sentence-transformers_multi-qa-MiniLM-L6-cos-v1-1.0.1-onnx.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/multi-qa-MiniLM-L6-cos-v1/1.0.1/onnx/config.json) |
| `huggingface/sentence-transformers/multi-qa-mpnet-base-dot-v1` | 384-dimensional dense vector space. | Yes | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/multi-qa-mpnet-base-dot-v1/1.0.1/torch_script/sentence-transformers_multi-qa-mpnet-base-dot-v1-1.0.1-torch_script.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/multi-qa-mpnet-base-dot-v1/1.0.1/torch_script/config.json) | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/multi-qa-mpnet-base-dot-v1/1.0.1/onnx/sentence-transformers_multi-qa-mpnet-base-dot-v1-1.0.1-onnx.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/multi-qa-mpnet-base-dot-v1/1.0.1/onnx/config.json) |
| `huggingface/sentence-transformers/paraphrase-MiniLM-L3-v2` | 384-dimensional dense vector space. | Yes | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/paraphrase-MiniLM-L3-v2/1.0.1/torch_script/sentence-transformers_paraphrase-MiniLM-L3-v2-1.0.1-torch_script.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/paraphrase-MiniLM-L3-v2/1.0.1/torch_script/config.json) | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/paraphrase-MiniLM-L3-v2/1.0.1/onnx/sentence-transformers_paraphrase-MiniLM-L3-v2-1.0.1-onnx.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/paraphrase-MiniLM-L3-v2/1.0.1/onnx/config.json) |
| `huggingface/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` | 384-dimensional dense vector space. | Yes | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2/1.0.1/torch_script/sentence-transformers_paraphrase-multilingual-MiniLM-L12-v2-1.0.1-torch_script.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2/1.0.1/torch_script/config.json) | - [model_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2/1.0.1/onnx/sentence-transformers_paraphrase-multilingual-MiniLM-L12-v2-1.0.1-onnx.zip)<br>- [config_url](https://artifacts.opensearch.org/models/ml-models/huggingface/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2/1.0.1/onnx/config.json) |