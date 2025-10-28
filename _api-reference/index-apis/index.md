---
layout: default
title: Index APIs
has_children: true
has_toc: false
nav_order: 30
redirect_from:
  - /opensearch/rest-api/index-apis/index/
  - /opensearch/rest-api/index-apis/
  - /api-reference/index-apis/
---

# Index APIs
**Introduced 1.0**
{: .label .label-purple }

The index API operations let you interact with indexes in your cluster. Using these operations, you can create, delete, close, and complete other index-related operations.

## Index API operations

The following index API operations are available, organized by category:

- [Alias APIs]({{site.url}}{{site.baseurl}}/api-reference/alias/) - Create, update, delete, and retrieve information about index aliases
- [Core index APIs]({{site.url}}{{site.baseurl}}/api-reference/index-apis/core-index-apis/) - Fundamental operations for managing the lifecycle of indexes
- [Index operations]({{site.url}}{{site.baseurl}}/api-reference/index-apis/index-operations/) - Advanced functionality for maintaining and optimizing indexes
- [Index settings and mappings]({{site.url}}{{site.baseurl}}/api-reference/index-apis/index-settings-mappings/) - Configure and modify index behavior and structure
- [Index templates]({{site.url}}{{site.baseurl}}/api-reference/index-apis/index-templates/) - Create and manage templates for automatic index configuration
- [Index blocks and allocation]({{site.url}}{{site.baseurl}}/api-reference/index-apis/index-blocks-allocation/) - Control index access restrictions and shard allocation
- [Data stream stats]({{site.url}}{{site.baseurl}}/api-reference/index-apis/data-stream-stats/) - Returns statistics for data streams
- [Dangling index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/dangling-index/) - Manage indexes that exist on disk but are not part of cluster state

If you use the Security plugin, make sure you have the appropriate permissions.
{: .note }
