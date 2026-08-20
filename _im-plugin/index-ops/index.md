---
layout: default
title: Index operations
nav_order: 20
has_children: true
has_toc: false
---


# Index operations


Index operations are used to manage indexes on a cluster. These include things like cloning, shrinking, scaling, flushing, and merging. The most basic of these are core index operations, used to create, delete, open, close, and get information about indexes.

OpenSearch supports a number of operations on indexes. These operations are presented here in two categories, parallelling their organization in the OpenSearch [Index APIs]({{site.url}}{{site.baseurl}}/api-reference/index-apis/index/):

- [**Core index operations**]({{site.url}}{{site.baseurl}}/im-plugin/index-ops/index/#core-index-operations) are the most basic operations, used to create, delete, open, close, and get information about indexes.
- [**Index management operations**]({{site.url}}{{site.baseurl}}/im-plugin/index-ops/index/#index-management-operations) are used to manage indexes on a cluster. These include things like cloning, shrinking, scaling, flushing, and merging.

In addition, the following index operations and features, documented in their own sections, support [index state management (ISM)]({{site.url}}{{site.baseurl}}/im-plugin/ism/index/).

- [Aliases]({{site.url}}{{site.baseurl}}/im-plugin/aliases/index/)
- [Data streams]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/index/)
- [Index rollups]({{site.url}}{{site.baseurl}}/im-plugin/index-rollups/index/)
- [Index transforms]({{site.url}}{{site.baseurl}}/im-plugin/index-transforms/index/)
- [Notifications]({{site.url}}{{site.baseurl}}/im-plugin/notifications/index/)
- [Reindexing]({{site.url}}{{site.baseurl}}/im-plugin/reindex/index/)
- [Templates]({{site.url}}{{site.baseurl}}/im-plugin/templates/index/)


## Core index operations

Core index operations enable you to directly manage indexes in your OpenSearch cluster. These operations are also the building blocks for state managed indexes.

OpenSearch provides following core index operations:

- Retrieving information about an index or a group of indexes, including whether an index exists.
- Creating and deleting an index.
- Opening and closing an index.

All of the core operations can be performed with the core index APIs or in OpenSearch Dashboards.


### In OpenSearch Dashboards

For core index operations in OpenSearch Dashboards, see [Core dashboard operations]({{site.url}}{{site.baseurl}}/im-plugin/index-ops/dash-ops/).


### Using the APIs

For core index operations using the Index APIs, see [Core index APIs]({{site.url}}{{site.baseurl}}/api-reference/index-apis/).


## Index management operations

OpenSearch features many operations on indexes beyond the core index operations. Most of these operations can also be performed in OpenSearch Dashboards.

Index operations include:

- Operational tasks, such as clearing index caches and flushing, force-merging, and refreshing indexes.
- Segement and shard operations, such as splitting, shrinking, and scaling indexes.
- Querying information about indexes, including storage locations, statistics, and the status of long-running operations.
- Index manipulations like cloning, rolling over, and transforming indexes.


### In OpenSearch Dashboards

For index operations in OpenSearch Dashboards, see [Managing indexes in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/im-plugin/index-ops/dash-ops/).


### Using the APIs

For index operations using the Index APIs, see [Index APIs]({{site.url}}{{site.baseurl}}/api-reference/index-apis/).


## Next steps

Index state management (ISM) enables you to automate index management in your OpenSearch cluster. See [Index State Management]({{site.url}}{{site.baseurl}}/im-plugin/ism/index/).