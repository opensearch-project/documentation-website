---
layout: default
title: Index Management
nav_order: 30
has_children: false
redirect_from:
  - /dashboards/admin-ui-index/
---

# Index Management in OpenSearch Dashboards

The **Index Management** page in OpenSearch Dashboards provides an interface for the index operations that you can otherwise perform using the [Index APIs]({{site.url}}{{site.baseurl}}/api-reference/index-apis/index/): creating indexes and defining their mappings, opening and closing indexes, merging and splitting them, and automating those operations with state management policies.

To reach the page, go to **Management > Index Management** on the top menu:

![Index Management page]({{site.url}}{{site.baseurl}}/images/dashboards/index-management-UI.png)

Index management does not include operations on the documents in an index. To add data to an index, see [Ingest your data into OpenSearch]({{site.url}}{{site.baseurl}}/getting-started/ingest-data/). To query it, see [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/).

## Index Management pages

The left panel of the **Index Management** page contains the following pages.

| Page | Description | Documentation |
| :--- | :--- | :--- |
| **State management policies** | Create, edit, and delete the policies that manage indexes automatically. | [Policies]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies/#policies-in-opensearch-dashboards) |
| **Policy managed indexes** | View the state of each index that a policy manages, change its policy, or stop managing it. | [Managed indexes]({{site.url}}{{site.baseurl}}/im-plugin/ism/managedindexes/#managed-indexes-in-opensearch-dashboards) |
| **Indexes** | Create indexes and view their settings, mappings, and statistics. Open, close, reindex, and delete them, apply a policy to them, and maintain them by refreshing, flushing, force merging, shrinking, splitting, and rolling them over. | [Index operations]({{site.url}}{{site.baseurl}}/im-plugin/index-operations/#index-operations-in-opensearch-dashboards), [Index maintenance]({{site.url}}{{site.baseurl}}/im-plugin/index-maintenance/#index-maintenance-in-opensearch-dashboards) |
| **Data streams** | Create data streams, view their backing indexes, and roll them over. | [Data streams]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/#data-streams-in-opensearch-dashboards) |
| **Templates** | Create index templates and component templates that configure new indexes and data streams. | [Index templates]({{site.url}}{{site.baseurl}}/im-plugin/index-templates/#index-templates-in-opensearch-dashboards) |
| **Aliases** | Create aliases, add indexes to them, and set the write index. | [Index aliases]({{site.url}}{{site.baseurl}}/im-plugin/index-alias/#index-aliases-in-opensearch-dashboards) |
| **Rollup jobs** | Create jobs that summarize old data into smaller indexes. | [Index rollups]({{site.url}}{{site.baseurl}}/im-plugin/index-rollups/index/#index-rollups-in-opensearch-dashboards) |
| **Transform jobs** | Create jobs that write a summarized view of an index to a second index. | [Index transforms]({{site.url}}{{site.baseurl}}/im-plugin/index-transforms/index/#index-transforms-in-opensearch-dashboards) |
| **Notification settings** | Choose the index operations that send a notification when they finish or fail, and the channels that receive it. | [Long-running operation notifications]({{site.url}}{{site.baseurl}}/im-plugin/notifications-settings/#notifications-in-opensearch-dashboards) |

## Related documentation

- [Managing indexes]({{site.url}}{{site.baseurl}}/im-plugin/)
- [Index APIs]({{site.url}}{{site.baseurl}}/api-reference/index-apis/index/)
- [Index State Management]({{site.url}}{{site.baseurl}}/im-plugin/ism/index/)
