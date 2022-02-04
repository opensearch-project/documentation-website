---
layout: default
title: Ingest APIs
parent: REST API reference
has_children: true
nav_order: 3
redirect_from:
  - /opensearch/rest-api/ingest-apis/
---

# Ingest APIs

Before you index your data, OpenSearch's ingest APIs help transform your data through the creation of ingest pipelines. Pipelines are made up of processors, a customizable task that run in the order they appear in the request body. The transformed data appears in your data stream or index after each of the processors completes.

Ingest pipelines in OpenSearch are managed using ingest API operations. In production environments, your cluster should contain at least one node with the `node.roles: [ingest]`. For more information on setting up node roles within a cluster, see [Cluster Formation]({{site.url}}{{site.baseurl}}/cluster/).
