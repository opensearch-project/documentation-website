---
layout: default
title: API reference
nav_order: 1
has_toc: false
has_children: true
nav_exclude: true
permalink: /api-reference/
redirect_from:
  - /opensearch/rest-api/index/
  - /api-reference/index/
---

# API reference

You can use [REST APIs](#rest-apis) for most operations in OpenSearch. Starting with OpenSearch 3.0, you can use alternative experimental [gRPC APIs](#grpc-apis). 

## REST APIs 
**Introduced 1.0**
{: .label .label-purple }

OpenSearch supports the following REST APIs:

### Core APIs (in this section)

- [Analyze APIs]({{site.url}}{{site.baseurl}}/api-reference/analyze-apis/)
- [CAT APIs]({{site.url}}{{site.baseurl}}/api-reference/cat/)
- [Cluster APIs]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/)
- [Common REST parameters]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/)
- [Document APIs]({{site.url}}{{site.baseurl}}/api-reference/document-apis/)
- [Index APIs]({{site.url}}{{site.baseurl}}/api-reference/index-apis/)
- [Ingest APIs]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/)
- [List APIs]({{site.url}}{{site.baseurl}}/api-reference/list/)
- [Nodes APIs]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/)
- [Popular APIs]({{site.url}}{{site.baseurl}}/api-reference/popular-api/)
- [Script APIs]({{site.url}}{{site.baseurl}}/api-reference/script-apis/)
- [Search APIs]({{site.url}}{{site.baseurl}}/api-reference/search-apis/)
- [Security APIs]({{site.url}}{{site.baseurl}}/api-reference/security/)
- [Snapshot APIs]({{site.url}}{{site.baseurl}}/api-reference/snapshots/)
- [Supported units]({{site.url}}{{site.baseurl}}/api-reference/units/)

### Other APIs (throughout documentation)

- [Access control API]({{site.url}}{{site.baseurl}}/security/access-control/api/)
- [Alerting API]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/api/)
- [Anomaly detection API]({{site.url}}{{site.baseurl}}/observing-your-data/ad/api/)
- [Count]({{site.url}}{{site.baseurl}}/api-reference/count/)
- [Cross-cluster replication API]({{site.url}}{{site.baseurl}}/tuning-your-cluster/replication-plugin/api/)
- [Explain]({{site.url}}{{site.baseurl}}/api-reference/explain/)
- [Index rollups API]({{site.url}}{{site.baseurl}}/im-plugin/index-rollups/rollup-api/)
- [Index state management API]({{site.url}}{{site.baseurl}}/im-plugin/ism/api/)
- [ISM error prevention API]({{site.url}}{{site.baseurl}}/im-plugin/ism/error-prevention/api/)
- [Job Scheduler APIs]({{site.url}}{{site.baseurl}}/monitoring-your-cluster/job-scheduler/index/#job-scheduler-apis)
- [Vector search API]({{site.url}}{{site.baseurl}}/vector-search/api/)
- [ML Commons API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/)
- [Multi-search]({{site.url}}{{site.baseurl}}/api-reference/multi-search/)
- [Notifications API]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/api/)
- [Performance analyzer API]({{site.url}}{{site.baseurl}}/monitoring-your-cluster/pa/api/)
- [Point in Time API]({{site.url}}{{site.baseurl}}/search-plugins/point-in-time-api/)
- [Ranking evaluation]({{site.url}}{{site.baseurl}}/api-reference/rank-eval/)
- [Refresh search analyzer]({{site.url}}{{site.baseurl}}/im-plugin/refresh-analyzer/)
- [Remote cluster information]({{site.url}}{{site.baseurl}}/api-reference/remote-info/)
- [Root cause analysis API]({{site.url}}{{site.baseurl}}/monitoring-your-cluster/pa/rca/api/)
- [Snapshot management API]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/sm-api/)
- [Scroll]({{site.url}}{{site.baseurl}}/api-reference/scroll/)
- [Search]({{site.url}}{{site.baseurl}}/api-reference/search/)
- [Search relevance stats API]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/stats-api/)
- [Security analytics APIs]({{site.url}}{{site.baseurl}}/security-analytics/api-tools/index/)
- [Stats API]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/stats-api/)
- [Tasks]({{site.url}}{{site.baseurl}}/api-reference/tasks/)
- [Transforms API]({{site.url}}{{site.baseurl}}/im-plugin/index-transforms/transforms-apis/)
- [Hot reload TLS certificates]({{site.url}}{{site.baseurl}}/security/configuration/tls/#hot-reloading-tls-certificates)

## gRPC APIs
**Introduced 3.0**
{: .label .label-purple }

Starting with OpenSearch 3.0, you can use gRPC APIs---a high-performance alternative to traditional REST interfaces. These APIs use the gRPC protocol to provide more efficient communication with OpenSearch clusters. For more information and supported APIs, see [gRPC APIs]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/).
