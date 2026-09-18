---
layout: default
title: API reference
nav_order: 1
has_toc: false
has_children: true
nav_exclude: true
description: "Complete OpenSearch API reference for REST APIs and gRPC APIs, including cluster, index, search, document, and other operations."
permalink: /api-reference/
redirect_from:
  - /opensearch/rest-api/index/
  - /api-reference/index/
---

# API reference

You can use [REST APIs](#rest-apis) for every API operation in OpenSearch. Starting with OpenSearch 3.0, you can call a subset of these operations using the experimental [gRPC APIs](#grpc-apis) instead.

This page lists API families rather than individual operations. To find a specific operation, open the family that owns it and use the list of APIs on its page.

## REST APIs
**Introduced 1.0**
{: .label .label-purple }

OpenSearch provides the following REST APIs.

### Core REST APIs

The following core REST APIs are documented in this section.

| API | Use it to |
| :--- | :--- |
| [Analyze API]({{site.url}}{{site.baseurl}}/api-reference/analyze-apis/) | Inspect the tokens that an analyzer produces from a text string. |
| [CAT APIs]({{site.url}}{{site.baseurl}}/api-reference/cat/) | Read cluster statistics as plain text aligned in columns. |
| [List APIs]({{site.url}}{{site.baseurl}}/api-reference/list/) | Read index and shard statistics as paginated plain text. |
| [Cluster APIs]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/) | Check cluster health, change cluster settings, and retrieve cluster statistics. |
| [Data stream APIs]({{site.url}}{{site.baseurl}}/api-reference/data-stream/) | Create, delete, modify, and retrieve information about data streams. |
| [Document APIs]({{site.url}}{{site.baseurl}}/api-reference/document-apis/) | Index, retrieve, update, and delete documents, individually or in bulk. |
| [Index APIs]({{site.url}}{{site.baseurl}}/api-reference/index-apis/) | Create, configure, maintain, and delete indexes, aliases, and index templates. |
| [Ingest APIs]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/) | Define the ingest pipelines and processors that transform documents as they are indexed. |
| [Nodes APIs]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/) | Retrieve information, statistics, and hot threads for individual nodes. |
| [Script APIs]({{site.url}}{{site.baseurl}}/api-reference/script-apis/) | Store, retrieve, and run Painless scripts. |
| [Search APIs]({{site.url}}{{site.baseurl}}/api-reference/search-apis/) | Run queries and work with search templates, scroll contexts, and search profiling. |
| [Snapshot APIs]({{site.url}}{{site.baseurl}}/api-reference/snapshots/) | Manage snapshot repositories and take and restore snapshots. |
| [Tasks APIs]({{site.url}}{{site.baseurl}}/api-reference/tasks/) | Track and cancel long-running operations. |

The rest of the APIs listed on this page are documented in their respective sections.

### Search feature and query language APIs

The following APIs extend the core search APIs with additional ways to submit queries, process results, and measure relevance.

| API | Use it to |
| :--- | :--- |
| [Asynchronous Search API]({{site.url}}{{site.baseurl}}/search-plugins/async/) | Run a search in the background and retrieve partial results while it completes. |
| [Search Pipeline APIs]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/) | Define the search pipelines and processors that transform search requests and results. |
| [Search Relevance Workbench APIs]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/using-search-relevance-workbench/) | Create the query sets, search configurations, judgments, and experiments that measure search quality. |
| [SQL and PPL API]({{site.url}}{{site.baseurl}}/sql-and-ppl/sql-and-ppl-api/) | Run SQL and Piped Processing Language queries and manage the data sources they read. |

### Vector search and machine learning APIs

The following APIs manage the models, agents, and workflows that support vector search and machine learning.

| API | Use it to |
| :--- | :--- |
| [ML Commons API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/) | Register, deploy, and run machine learning models, agents, and connectors. |
| [Vector Search API]({{site.url}}{{site.baseurl}}/vector-search/api/) | Manage the models and read the statistics that support vector search. |
| [Workflow APIs]({{site.url}}{{site.baseurl}}/automating-configurations/api/) | Create, provision, and manage the workflow templates that automate complex setup tasks. |

### Index management APIs

The following APIs automate the maintenance of indexes and their data.

| API | Use it to |
| :--- | :--- |
| [Index Rollups API]({{site.url}}{{site.baseurl}}/im-plugin/index-rollups/rollup-api/) | Create and manage the rollup jobs that summarize historical data into smaller indexes. |
| [Index State Management API]({{site.url}}{{site.baseurl}}/im-plugin/ism/api/) | Create and manage the policies that automate index lifecycle operations. |
| [ISM Error Prevention API]({{site.url}}{{site.baseurl}}/im-plugin/ism/error-prevention/api/) | Turn on Index State Management error prevention and read its validation results. |
| [Refresh Search Analyzer API]({{site.url}}{{site.baseurl}}/im-plugin/refresh-analyzer/) | Reload the search analyzers of an open index without closing it. |
| [Transforms API]({{site.url}}{{site.baseurl}}/im-plugin/index-transforms/transforms-apis/) | Create and manage the transform jobs that reshape data into a new index. |

### Cluster management APIs

The following APIs protect cluster availability and control how a cluster uses its resources.

| API | Use it to |
| :--- | :--- |
| [Cross-Cluster Replication (CCR) API]({{site.url}}{{site.baseurl}}/tuning-your-cluster/replication-plugin/api/) | Replicate indexes from a leader cluster to a follower cluster. |
| [Remote Store Stats API]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/remote-store/remote-store-stats-api/) | Read upload and download statistics for remote-backed storage. |
| [Rules API]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/rule-based-autotagging/rule-lifecycle-api/) | Create and manage the auto-tagging rules that assign incoming requests to a workload group. |
| [Shard Indexing Backpressure Stats API]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/stats-api/) | Monitor shard indexing backpressure. |
| [Snapshot Management API]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/sm-api/) | Take and delete snapshots on a schedule. |
| [Workload Management APIs]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/workload-management/workload-groups/) | Create the workload groups that limit resource usage and read their statistics. |

### Observability and monitoring APIs

The following APIs report the cluster state and notify you when it changes.

| API | Use it to |
| :--- | :--- |
| [Alerting API]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/api/) | Create and manage monitors, triggers, and alerts. |
| [Anomaly Detection API]({{site.url}}{{site.baseurl}}/observing-your-data/ad/api/) | Create and manage anomaly detectors and read the anomalies they find. |
| [Forecasting API]({{site.url}}{{site.baseurl}}/observing-your-data/forecast/api/) | Create and manage forecasters and read the forecasts they produce. |
| [Job Scheduler APIs]({{site.url}}{{site.baseurl}}/monitoring-your-cluster/job-scheduler/index/#job-scheduler-apis) | Monitor the scheduled jobs and locks on a cluster. |
| [Notifications API]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/api/) | Define the channels that deliver notifications and the sources that send them. |
| [Performance Analyzer API]({{site.url}}{{site.baseurl}}/monitoring-your-cluster/pa/api/) | Retrieve performance metrics for a node or a cluster. |
| [Query Insights APIs]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/) | Read top N queries, live queries, and query insights health statistics, and change query insights settings. |
| [Reporting API]({{site.url}}{{site.baseurl}}/reporting/api/) | Define reports and generate them from dashboards, visualizations, saved searches, and notebooks. Downloading the rendered content uses the OpenSearch Dashboards endpoint. |
| [Root Cause Analysis API]({{site.url}}{{site.baseurl}}/monitoring-your-cluster/pa/rca/api/) | Retrieve root cause analysis results for a cluster. |

### Security and security analytics APIs

The following APIs provide access control for a cluster and detect security threats in the data it contains.

| API | Use it to |
| :--- | :--- |
| [Resource Sharing APIs]({{site.url}}{{site.baseurl}}/security/access-control/resource-sharing-api/) | Share plugin resources, such as models and detectors, with other users and roles. |
| [Security APIs]({{site.url}}{{site.baseurl}}/security/api/) | Manage users, roles, role mappings, action groups, and tenants, and read or replace the security configuration. |
| [Security Analytics APIs]({{site.url}}{{site.baseurl}}/security-analytics/api-tools/index/) | Manage the detectors, rules, findings, and alerts that identify security events. |

### OpenSearch Dashboards APIs

The following APIs manage OpenSearch Dashboards saved objects and workspaces and read usage statistics. Unlike the preceding REST API requests that are sent to the OpenSearch REST layer on port 9200 by default, you send these requests to OpenSearch Dashboards on port 5601 by default.

| API | Use it to |
| :--- | :--- |
| [Maps Stats API]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/maps-stats-api/) | Read usage statistics for maps and their layers. |
| [Saved Objects APIs]({{site.url}}{{site.baseurl}}/dashboards/management/saved-objects-api/) | List, create, update, export, and import saved objects such as index patterns, visualizations, and dashboards. |
| [Search Relevance Stats API]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/stats-api/) | Read usage statistics for search relevance operations. |
| [Workspace APIs]({{site.url}}{{site.baseurl}}/dashboards/workspace/apis/) | Create, update, list, and delete workspaces. |

## gRPC APIs
**Introduced 3.0**
{: .label .label-purple }

Starting with OpenSearch 3.0, you can use gRPC APIs---a high-performance alternative to traditional REST interfaces. These APIs use the gRPC protocol to provide more efficient communication with OpenSearch clusters. For more information and supported APIs, see [gRPC APIs]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/).

## Reference

The following pages provide additional API reference information:

- [Common REST parameters]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/)
- [Supported units]({{site.url}}{{site.baseurl}}/api-reference/units/)
- [Popular APIs]({{site.url}}{{site.baseurl}}/api-reference/popular-api/)
