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

Short for *Learning to Rank*, the LTR plugin enables you use machine learning and behavioral data to tune the relevance of documents. 
It uses models from the XGBoost and Ranklib libraries to rescore the search results that takes into account query dependent features such as click-through data or field matchings, which can further improve relevance.

[Learning to
Rank](http://opensourceconnections.com/blog/2017/02/24/what-is-learning-to-rank/)
applies machine learning to relevance ranking. The [OpenSearch
Learning to Rank
plugin](https://github.com/opensearch-project/opensearch-learning-to-rank-base)
(OpenSearch LTR) gives you tools to train and use ranking models in
OpenSearch. 

## Get started

-   Want a quickstart? Check out the demo in
    [hello-ltr](https://github.com/o19s/hello-ltr).
-   Brand new to learning to rank? head to
    `core-concepts`{.interpreted-text role="doc"}.
-   Otherwise, start with `fits-in`{.interpreted-text role="doc"}

## Installing

Pre-built versions can be found
[here](https://github.com/opensearch-project/opensearch-learning-to-rank-base/releases).
Want a build for an OS version? Follow the instructions in the [README
for
building](https://github.com/opensearch-project/opensearch-learning-to-rank-base#development)
or [create an
issue](https://github.com/opensearch-project/opensearch-learning-to-rank-base/issues).
Once you've found a version compatible with your OpenSearch, you'd
run a command such as:

    ./bin/opensearch-plugin install https://github.com/opensearch-project/opensearch-learning-to-rank-base/releases/download/ltr-plugin-v2.11.1-RC1/ltr-plugin-v2.11.1-RC1.zip 



## History

The Elasticsearch LTR plugin was initially developed by [OpenSource Connections](http://opensourceconnections.com), with significant contributions by [Wikimedia Foundation](https://diff.wikimedia.org/2017/10/17/elasticsearch-learning-to-rank-plugin/), Snagajob Engineering, Bonsai, and Yelp Engineering. 
The OpenSearch version of the plugin is derived from the Elasticsearch LTR plugin.
