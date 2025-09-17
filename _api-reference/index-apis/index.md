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

The following index API operations are available:

### Index management
- [Create index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/create-index/)
- [Delete index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/delete-index/)
- [Get index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/get-index/)
- [Index exists]({{site.url}}{{site.baseurl}}/api-reference/index-apis/exists/)
- [Open index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/open-index/)
- [Close index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/close-index/)
- [Resolve index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/resolve-index/)

### Index operations
- [Clear index cache]({{site.url}}{{site.baseurl}}/api-reference/index-apis/clear-index-cache/)
- [Clone index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/clone/)
- [Flush]({{site.url}}{{site.baseurl}}/api-reference/index-apis/flush/)
- [Force merge]({{site.url}}{{site.baseurl}}/api-reference/index-apis/force-merge/)
- [Recover]({{site.url}}{{site.baseurl}}/api-reference/index-apis/recover/)
- [Refresh]({{site.url}}{{site.baseurl}}/api-reference/index-apis/refresh/)
- [Rollover]({{site.url}}{{site.baseurl}}/api-reference/index-apis/rollover/)
- [Scale]({{site.url}}{{site.baseurl}}/api-reference/index-apis/scale/)
- [Segments]({{site.url}}{{site.baseurl}}/api-reference/index-apis/segment/)
- [Shrink index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/shrink-index/)
- [Split]({{site.url}}{{site.baseurl}}/api-reference/index-apis/split/)
- [Stats]({{site.url}}{{site.baseurl}}/api-reference/index-apis/stats/)

### Index settings and mappings
- [Get settings]({{site.url}}{{site.baseurl}}/api-reference/index-apis/get-settings/)
- [Update settings]({{site.url}}{{site.baseurl}}/api-reference/index-apis/update-settings/)
- [Put mapping]({{site.url}}{{site.baseurl}}/api-reference/index-apis/put-mapping/)

### Index templates
- [Create index template]({{site.url}}{{site.baseurl}}/api-reference/index-apis/create-index-template/)
- [Delete index template]({{site.url}}{{site.baseurl}}/api-reference/index-apis/delete-index-template/)
- [Get index template]({{site.url}}{{site.baseurl}}/api-reference/index-apis/get-index-template/)
- [Index template exists]({{site.url}}{{site.baseurl}}/api-reference/index-apis/index-template-exists/)
- [Simulate index template]({{site.url}}{{site.baseurl}}/api-reference/index-apis/simulate-index-template/)
- [Component template]({{site.url}}{{site.baseurl}}/api-reference/index-apis/component-template/)

### Legacy index templates
- [Delete template (legacy)]({{site.url}}{{site.baseurl}}/api-reference/index-apis/delete-template-legacy/)
- [Get template (legacy)]({{site.url}}{{site.baseurl}}/api-reference/index-apis/get-template-legacy/)
- [Post template (legacy)]({{site.url}}{{site.baseurl}}/api-reference/index-apis/post-template-legacy/)
- [Put template (legacy)]({{site.url}}{{site.baseurl}}/api-reference/index-apis/put-template-legacy/)
- [Template exists (legacy)]({{site.url}}{{site.baseurl}}/api-reference/index-apis/template-exists-legacy/)

### Index aliases
- [Alias]({{site.url}}{{site.baseurl}}/api-reference/index-apis/alias/)
- [Update alias]({{site.url}}{{site.baseurl}}/api-reference/index-apis/update-alias/)

### Index blocks and allocation
- [Blocks]({{site.url}}{{site.baseurl}}/api-reference/index-apis/blocks/)
- [Shard allocation]({{site.url}}{{site.baseurl}}/api-reference/index-apis/shard-allocation/)

### Data streams
- [Data stream stats]({{site.url}}{{site.baseurl}}/api-reference/index-apis/data-stream-stats/)

### Dangling indexes
- [Dangling index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/dangling-index/)

If you use the Security plugin, make sure you have the appropriate permissions.
{: .note }
