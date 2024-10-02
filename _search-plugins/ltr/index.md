---
layout: default
title: LTR search
nav_order: 20
has_children: true
has_toc: false
redirect_from:
  - /search-plugins/ltr/
---

# LTR search

The Learning to Rank plugin for OpenSearch enables you to use machine learning (ML) and behavioral data to fine-tune the relevance of documents. It uses models from the XGBoost and RankLib libraries to rescore the search results that takes into account query dependent features such as click-through data or field matches, which can further improve relevance.

The term _learning to rank_ is abbreviated as LTR throughout the OpenSearch documentation when the term is used generally. For the plugin developer documentation, see [opensearch-learning-to-rank-base](https://github.com/opensearch-project/opensearch-learning-to-rank-base).
{: .note} 

## Getting started

The following resources can help get you started:

- For a quick introduction, see the demo in [hello-ltr](https://github.com/o19s/hello-ltr).
- If you are new to LTR, start with the [Core concepts]({{site.url}}{{site.baseurl}}/search-plugins/ltr/core-concepts/) documentation.
- If you are familiar with LTR, start with the [Integrating the plugin]({{site.url}}{{site.baseurl}}/search-plugins/ltr/fits-in/) documentation.

## Installing the plugin

Pre-built versions of the plugin are available at [https://github.com/opensearch-project/opensearch-learning-to-rank-base/releases](https://github.com/opensearch-project/opensearch-learning-to-rank-base/releases). If you need a version compatible with your OpenSearch installation, follow the instructions in the [README](https://github.com/opensearch-project/opensearch-learning-to-rank-base#development) file or [create an issue](https://github.com/opensearch-project/opensearch-learning-to-rank-base/issues). Once you have an appropriate version, you can install it using a command line shown in the following example:

```
./bin/opensearch-plugin install https://github.com/opensearch-project/opensearch-learning-to-rank-base/releases/download/ltr-plugin-v2.11.1-RC1/ltr-plugin-v2.11.1-RC1.zip 
```
{% include copy-curl.html %}
