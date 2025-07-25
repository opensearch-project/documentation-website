---
layout: default
title: Ingest APIs
parent: REST API reference
has_children: true
nav_order: 3
redirect_from:
  - /opensearch/rest-api/ingest-apis/
canonical_url: https://docs.opensearch.org/latest/api-reference/ingest-apis/index/
---

# Ingest APIs

Before you index your data, OpenSearch's ingest APIs help transform your data by creating and managing ingest pipelines. Pipelines consist of **processors**, customizable tasks that run in the order they appear in the request body. The transformed data appears in your index after each of the processor completes.

Ingest pipelines in OpenSearch can only be managed using ingest API operations. When using ingest in production environments, your cluster should contain at least one node with the node roles permission set to `ingest`. For more information on setting up node roles within a cluster, see [Cluster Formation]({{site.url}}{{site.baseurl}}/opensearch/cluster/).
