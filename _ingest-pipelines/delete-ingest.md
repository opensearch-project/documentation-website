---
layout: default
title: Delete pipeline
nav_order: 13
redirect_from:
  - /opensearch/rest-api/ingest-apis/delete-ingest/
  - /api-reference/ingest-apis/delete-ingest/
---

# Delete pipeline
**Introduced 1.0**
{: .label .label-purple }

Use the following request to delete a pipeline. 

To delete a specific pipeline, pass the pipeline ID as a parameter:

```json
DELETE /_ingest/pipeline/<pipeline-id>
```
{% include copy-curl.html %}

To delete all pipelines in a cluster, use the wildcard character (`*`):

```json
DELETE /_ingest/pipeline/*
```
{% include copy-curl.html %}
