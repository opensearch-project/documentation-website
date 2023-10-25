---
layout: default
title: Document APIs
has_children: true
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

- Index
- Get
- Delete
- Update

## Multi-document operations

- Bulk
- Multi get
- Delete by query
- Update by query
- Reindex
