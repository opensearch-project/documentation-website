---
layout: default
title: Index operations
parent: Index APIs
nav_order: 30
has_children: true
has_toc: false
canonical_url: https://docs.opensearch.org/latest/api-reference/index-apis/index-operations/
---

# Index operations

Index operations APIs provide advanced functionality for maintaining and optimizing indexes in your OpenSearch cluster. These operations help you manage index performance, data organization, and cluster efficiency.

## Available APIs

OpenSearch supports the following index operations APIs.

| API | Description |
|-----|-------------|
| [Clear index cache]({{site.url}}{{site.baseurl}}/api-reference/index-apis/clear-index-cache/) | Clears the cache associated with one or more indexes. |
| [Clone index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/clone/) | Clones an existing index. |
| [Flush]({{site.url}}{{site.baseurl}}/api-reference/index-apis/flush/) | Flushes one or more indexes. |
| [Force merge]({{site.url}}{{site.baseurl}}/api-reference/index-apis/force-merge/) | Forces merge on one or more indexes. |
| [Index recovery]({{site.url}}{{site.baseurl}}/api-reference/index-apis/recover/) | Returns information about ongoing and completed shard recoveries. |
| [Refresh]({{site.url}}{{site.baseurl}}/api-reference/index-apis/refresh/) | Refreshes one or more indexes. |
| [Rollover]({{site.url}}{{site.baseurl}}/api-reference/index-apis/rollover/) | Rolls over an index when it meets certain conditions. |
| [Scale]({{site.url}}{{site.baseurl}}/api-reference/index-apis/scale/) | Scales the number of replicas for one or more indexes. |
| [Index segments]({{site.url}}{{site.baseurl}}/api-reference/index-apis/segment/) | Returns segment information for one or more indexes. |
| [Index shard stores]({{site.url}}{{site.baseurl}}/api-reference/index-apis/shard-stores/) | Returns information about shard copies and their storage locations. |
| [Shrink index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/shrink-index/) | Shrinks an existing index. |
| [Split]({{site.url}}{{site.baseurl}}/api-reference/index-apis/split/) | Splits an existing index. |
| [Index stats]({{site.url}}{{site.baseurl}}/api-reference/index-apis/stats/) | Returns statistics for one or more indexes. |