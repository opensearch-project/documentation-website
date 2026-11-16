---
layout: default
title: Managing indexes
nav_order: 1
has_children: false
nav_exclude: true
permalink: /im-plugin/
redirect_from:
  - /im-plugin/index/
---

# Managing indexes

An index is the basic unit of data storage in OpenSearch: a collection of JSON documents, each identified by a unique ID, distributed across one or more shards. You can manage indexes using either the OpenSearch API or OpenSearch Dashboards.

If you are new to OpenSearch, start with [Add and manage your data]({{site.url}}{{site.baseurl}}/getting-started/manage-data/), which walks through creating an index, adding documents to it, and reading them back.

## Working with indexes

Use the following topics to add documents, create and maintain indexes, and copy data between indexes.

| Topic | Description |
| :--- | :--- |
| [Indexing data]({{site.url}}{{site.baseurl}}/im-plugin/indexing-data/) | Add one or many documents to an index, with or without your own document IDs. |
| [Index operations]({{site.url}}{{site.baseurl}}/im-plugin/index-operations/) | Create, inspect, close, open, and delete an index. |
| [Index maintenance]({{site.url}}{{site.baseurl}}/im-plugin/index-maintenance/) | Refresh, flush, clear caches, force merge, shrink, split, clone, and roll over an index. |
| [Index templates]({{site.url}}{{site.baseurl}}/im-plugin/index-templates/) | Apply the same settings and mappings to every index whose name matches a pattern. |
| [Index aliases]({{site.url}}{{site.baseurl}}/im-plugin/index-alias/) | Query a group of indexes under one name and switch that name between indexes without changing your clients. |
| [Reindexing data]({{site.url}}{{site.baseurl}}/im-plugin/reindex-data/) | Copy documents from one index into another, applying new mappings or transformations. |

## Controlling how data is written

OpenSearch provides the following alternatives to a standard index, depending on how your data arrives and whether it changes after it is written.

| Topic | Description |
| :--- | :--- |
| [Data streams]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/) | Manage append-only time-series data as a single named stream backed by rolling indexes. |
| [Append-only index]({{site.url}}{{site.baseurl}}/im-plugin/append-only-index/) | Prevent updates and deletes on an index to reduce indexing overhead. |
| [Pull-based ingestion]({{site.url}}{{site.baseurl}}/im-plugin/pull-based-ingestion/index/) | Create an index that pulls data directly from Apache Kafka, Amazon Kinesis, or object storage. |

## Automating and summarizing data

Use the following features to run index operations automatically, summarize historical data, and get notified when long-running operations finish.

| Topic | Description |
| :--- | :--- |
| [Index State Management]({{site.url}}{{site.baseurl}}/im-plugin/ism/index/) | Automate lifecycle operations, such as rollover and delete, based on index age, size, or document count. |
| [Index rollups]({{site.url}}{{site.baseurl}}/im-plugin/index-rollups/index/) | Summarize historical data into a smaller index to reduce storage cost. |
| [Index transforms]({{site.url}}{{site.baseurl}}/im-plugin/index-transforms/index/) | Build a materialized summary of your data, grouped by the fields you query most. |
| [Long-running operation notifications]({{site.url}}{{site.baseurl}}/im-plugin/notifications-settings/) | Get notified when a reindex, force merge, shrink, split, or open operation finishes or fails. |

## Tuning and securing indexes

Use the following topics to optimize how indexes store and retrieve data and to control who can manage them.

| Topic | Description |
| :--- | :--- |
| [Tuning indexes]({{site.url}}{{site.baseurl}}/im-plugin/index-tuning/) | Configure codecs, index sorting, similarity, and other storage and retrieval options. |
| [Index management security]({{site.url}}{{site.baseurl}}/im-plugin/security/) | Control who can perform index management operations. |

## Related documentation

- [Index APIs]({{site.url}}{{site.baseurl}}/api-reference/index-apis/index/)
- [Index Management in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/)
- [Ingest your data into OpenSearch]({{site.url}}{{site.baseurl}}/getting-started/ingest-data/)
- [Index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/)
