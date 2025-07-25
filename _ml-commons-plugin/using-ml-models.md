---
layout: default
title: Using ML models within OpenSearch
parent: Integrating ML models
has_children: true
nav_order: 50
redirect_from:
   - /ml-commons-plugin/model-serving-framework/
   - /ml-commons-plugin/ml-framework/
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/using-ml-models/
---

# Using ML models within OpenSearch
**Generally available 2.9**
{: .label .label-purple }

To integrate machine learning (ML) models into your OpenSearch cluster, you can upload and serve them locally. Choose one of the following options:

- **Pretrained models provided by OpenSearch**: To learn more, see [OpenSearch-provided pretrained models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/). For a list of supported models, see [Supported pretrained models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/#supported-pretrained-models). 

- **Custom models** such as PyTorch deep learning models: To learn more, see [Custom models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/custom-local-models/).

## GPU acceleration

For better performance, you can take advantage of GPU acceleration on your ML node. For more information, see [GPU acceleration]({{site.url}}{{site.baseurl}}/ml-commons-plugin/gpu-acceleration/).

