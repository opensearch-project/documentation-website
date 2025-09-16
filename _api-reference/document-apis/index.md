---
layout: default
title: Document APIs
has_children: true
has_toc: false
nav_order: 25
redirect_from:
  - /opensearch/rest-api/document-apis/index/
---

# Document APIs
**Introduced 1.0**
{: .label .label-purple }

The document APIs allow you to handle documents relative to your index, such as adding, updating, and deleting documents.

Document APIs are separated into two categories: single document operations and multi-document operations. Multi-document operations offer performance advantages over submitting many individual requests, so whenever practical, we recommend that you use multi-document operations.

## Single document operations

- [Index document]({{site.url}}{{site.baseurl}}/api-reference/document-apis/index-document/)
- [Get document]({{site.url}}{{site.baseurl}}/api-reference/document-apis/get-documents/)
- [Update document]({{site.url}}{{site.baseurl}}/api-reference/document-apis/update-document/)
- [Delete document]({{site.url}}{{site.baseurl}}/api-reference/document-apis/delete-document/)

## Multi-document operations

- [Bulk]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/)
- [Streaming bulk]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk-streaming/)
- [Multi-get documents]({{site.url}}{{site.baseurl}}/api-reference/document-apis/multi-get/)
- [Delete by query]({{site.url}}{{site.baseurl}}/api-reference/document-apis/delete-by-query/)
- [Update by query]({{site.url}}{{site.baseurl}}/api-reference/document-apis/update-by-query/)
- [Reindex documents]({{site.url}}{{site.baseurl}}/api-reference/document-apis/reindex/)

## Term vector operations

- [Term vector]({{site.url}}{{site.baseurl}}/api-reference/document-apis/termvector/)
- [Multi term vectors]({{site.url}}{{site.baseurl}}/api-reference/document-apis/mtermvectors/)

## Pull-based ingestion

- [Pull-based ingestion]({{site.url}}{{site.baseurl}}/api-reference/document-apis/pull-based-ingestion/)
