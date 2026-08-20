---
layout: default
title: Index Management
nav_order: 30
redirect_from:
  - /dashboards/admin-ui-index/
  - /dashboards/admin-ui-index/index-management/
---

# Index Management in OpenSearch Dashboards

Introduced 2.5
{: .label .label-purple }

Index Management in OpenSearch Dashboards provides an interface for creating, using, and managing indexes. In the OpenSearch **Index Management** web-based interface, you can perform most operations available in the [Index API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/index/), including the following:

- Create indexes and define their data mappings.
- Assign index sharding and replication.
- Perform management tasks, such as opening, closing, merging, splitting, and deleting indexes.
- Define state management policies to automate tasks such as log rollup and rollover, and assign those policies to indexes.
- Create templates, aliases, and notifications to use with index management policies.

## Navigating the Index Management UI

The following image shows how to navigate to the **Index Management** features.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/index-management-UI-callouts.png" alt="Index Management panel" width="60%">

- Select the **Index Management** _link_ (A) in the _navigation panel_ to view the Index Management features.
- The **Index Management** _panel_ (B) contains the index management features.
- The _breadcrumb_ display (C) shows which application or feature is active on the application page.

Following is a short summary of the index management operations available in the **Index Management** panel.

- [**State management policies**]({{site.url}}{{site.baseurl}}/im-plugin/ism/dash-ism/): Create and modify policies that can automatically manage indexes.
- [**Policy managed indexes**]({{site.url}}{{site.baseurl}}/im-plugin/ism/dash-ism): View, remove, and change state management policies applied to indexes.
- [**Indexes**]({{site.url}}{{site.baseurl}}/im-plugin/index-ops/dash-ops): View all indexes. Create and manage indexes and perform operations on them.
- [**Data streams**]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/dash-datastream/): View, create, and manage data streams.
- [**Templates**]({{site.url}}{{site.baseurl}}/im-plugin/templates/dash-templates): View, create, and manage templates to automate index and data stream creation.
- [**Aliases**]({{site.url}}{{site.baseurl}}/im-plugin/aliases/dash-aliases/): View, create, and manage aliases. Aliases are virtual indexes that can incorporate multiple real indexes.
- [**Rollup jobs**]({{site.url}}{{site.baseurl}}/im-plugin/index-rollups/): Create and manage rollup jobs. Rollup jobs are like specialized transform jobs for compressing and archiving continuous indexes such as log data.
- [**Transform jobs**]({{site.url}}{{site.baseurl}}/im-plugin/index-transforms): Create and manage transform jobs. Transform jobs append transformed data from one index to a second index on a schedule you define.
- [**Notification settings**]({{site.url}}{{site.baseurl}}/im-plugin/notifications/dash-notifications): Configure notifications via email or other channels for failed or completed index-related jobs.

## Next steps

For more information about index management, including how to perform index maangement operations using the Index management API or the Index Management page in OpenSearch Dashboards, see [Managing indexes]({{site.url}}{{site.baseurl}}/im-plugin/).

Index management does not include data operations such as adding, updating, and querying documents. For an introduction to adding data to indexes, see [Ingest your data into OpenSearch]({{site.url}}{{site.baseurl}}/getting-started/ingest-data/). For information about using OpenSearch Dashboards to query your data, see [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/).
