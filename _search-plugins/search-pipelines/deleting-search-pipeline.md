---
layout: default
title: Deleting search pipelines
nav_order: 30
has_children: false
parent: Search pipelines
canonical_url: https://docs.opensearch.org/latest/search-plugins/search-pipelines/deleting-search-pipeline/
---

# Deleting search pipelines

Use the following request to delete a pipeline.

To delete a specific search pipeline, pass the pipeline ID as a parameter:

```json
DELETE /_search/pipeline/<pipeline-id>
```
{% include copy-curl.html %}

To delete all search pipelines in a cluster, use the wildcard character (`*`):

```json
DELETE /_search/pipeline/*
```
{% include copy-curl.html %}
