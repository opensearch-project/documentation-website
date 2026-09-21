---
layout: default
title: Tuning indexes
nav_order: 80
has_children: true
has_toc: false
---

# Tuning indexes

The settings on this page change how an index stores its data on disk, how its documents are ordered within a segment, how matching documents are scored, and how it advertises itself to other features. Most of them are static, so you set them when you create the index and cannot change them afterward without reindexing.

| Topic | Description |
| :--- | :--- |
| [Refresh search analyzer]({{site.url}}{{site.baseurl}}/im-plugin/refresh-analyzer/) | Update the synonym list of a search analyzer without closing or reindexing an index. |
| [Index sorting]({{site.url}}{{site.baseurl}}/im-plugin/index-sorting/) | Order documents within each segment so that early termination can stop a search before it scans every document. |
| [Index codecs]({{site.url}}{{site.baseurl}}/im-plugin/index-codecs/) | Choose the compression algorithm used for stored fields, trading index size against indexing and search performance. |
| [Similarity]({{site.url}}{{site.baseurl}}/im-plugin/similarity/) | Configure the algorithm that scores and ranks matching documents. |
| [Index context]({{site.url}}{{site.baseurl}}/im-plugin/index-context/) | Apply a predefined set of settings and mappings for a use case, such as logs or metrics. |

## Related documentation

- [Index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/)
- [Mappings and field types]({{site.url}}{{site.baseurl}}/field-types/)
- [Tuning for indexing speed]({{site.url}}{{site.baseurl}}/tuning-your-cluster/performance/)
