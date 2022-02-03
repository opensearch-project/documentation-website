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

Before you index your data, OpenSearch's ingest APIs help transform your data through the creation of ingest pipelines. Pipelines are made up of processors, a customizable task that run in succession. The transformed data appears in your data stream or index after each processors completes.

Ingest pipelines in OpenSearch are managed using the ingest APIs. 