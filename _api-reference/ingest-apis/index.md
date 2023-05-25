---
layout: default
title: Ingest APIs
has_children: true
nav_order: 40
redirect_from:
  - /opensearch/rest-api/ingest-apis/index/
---

# Ingest APIs

Ingest APIs help you efficently transform and process data for an index by creating pipelines for dat ingestion in OpenSearch. Ingest pipelines use **processors**, customizable tasks that run in the order that they appear in the request body (that is, the data sent to the server as part of the HTTP request to ingest data in an API). Once the data is transformed, processed, and indexed, it is stored in OpenSearch and ready for you to search.

## Next steps
- Learn more about [Pipelines]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/pipelines/).
- Learn more about [Processors]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/processors/).
