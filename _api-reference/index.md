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
canonical_url: https://docs.opensearch.org/latest/api-reference/
---

# API reference

You can use [REST APIs](#rest-apis) for most operations in OpenSearch. Starting with OpenSearch 3.0, you can use alternative experimental [gRPC APIs](#grpc-apis). 

## REST APIs 
**Introduced 1.0**
{: .label .label-purple }

OpenSearch supports the following REST APIs:

- [Analyze API]({{site.url}}{{site.baseurl}}/api-reference/analyze-apis/)
- [Access control API]({{site.url}}{{site.baseurl}}/security/access-control/api/)
- [Alerting API]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/api/)
- [Anomaly detection API]({{site.url}}{{site.baseurl}}/observing-your-data/ad/api/) 
- [CAT APIs]({{site.url}}{{site.baseurl}}/api-reference/cat/index/)
- [Cluster APIs]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/index/)
- [Common REST parameters]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/)
- [Count]({{site.url}}{{site.baseurl}}/api-reference/count/)
- [Cross-cluster replication API]({{site.url}}{{site.baseurl}}/tuning-your-cluster/replication-plugin/api/)
- [Document APIs]({{site.url}}{{site.baseurl}}/api-reference/document-apis/index/)
- [Explain]({{site.url}}{{site.baseurl}}/api-reference/explain/)
- [Index APIs]({{site.url}}{{site.baseurl}}/api-reference/index-apis/index/)
- [Index rollups API]({{site.url}}{{site.baseurl}}/im-plugin/index-rollups/rollup-api/)
- [Index state management API]({{site.url}}{{site.baseurl}}/im-plugin/ism/api/)
- [ISM error prevention API]({{site.url}}{{site.baseurl}}/im-plugin/ism/error-prevention/api/)
- [Ingest APIs]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/)
- [Vector search API]({{site.url}}{{site.baseurl}}/vector-search/api/)
- [ML Commons API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/) 
- [Multi-search]({{site.url}}{{site.baseurl}}/api-reference/multi-search/)
- [Nodes APIs]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/index/)
- [Notifications API]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/api/)
- [Performance analyzer API]({{site.url}}{{site.baseurl}}/monitoring-your-cluster/pa/api/)
- [Point in Time API]({{site.url}}{{site.baseurl}}/search-plugins/point-in-time-api/)
- [Popular APIs]({{site.url}}{{site.baseurl}}/api-reference/popular-api/)
- [Ranking evaluation]({{site.url}}{{site.baseurl}}/api-reference/rank-eval/)
- [Refresh search analyzer]({{site.url}}{{site.baseurl}}/im-plugin/refresh-analyzer/)
- [Remote cluster information]({{site.url}}{{site.baseurl}}/api-reference/remote-info/)
- [Root cause analysis API]({{site.url}}{{site.baseurl}}/monitoring-your-cluster/pa/rca/api/)
- [Snapshot management API]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/sm-api/)
- [Script APIs]({{site.url}}{{site.baseurl}}/api-reference/script-apis/index/)
- [Scroll]({{site.url}}{{site.baseurl}}/api-reference/scroll/)
- [Search]({{site.url}}{{site.baseurl}}/api-reference/search/)
- [Search relevance stats API]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/stats-api/)
- [Security analytics APIs]({{site.url}}{{site.baseurl}}/security-analytics/api-tools/index/)
- [Snapshot APIs]({{site.url}}{{site.baseurl}}/api-reference/snapshots/index/)
- [Stats API]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/stats-api/)
- [Supported units]({{site.url}}{{site.baseurl}}/api-reference/units/)
- [Tasks]({{site.url}}{{site.baseurl}}/api-reference/tasks/)
- [Transforms API]({{site.url}}{{site.baseurl}}/im-plugin/index-transforms/transforms-apis/)
- [Hot reload TLS certificates]({{site.url}}{{site.baseurl}}/security/configuration/tls/#hot-reloading-tls-certificates)

## gRPC APIs
**Introduced 3.0**
{: .label .label-purple }

Starting with OpenSearch 3.0, you can use gRPC APIs---a high-performance alternative to traditional REST interfaces. These APIs use the gRPC protocol to provide more efficient communication with OpenSearch clusters. For more information and supported APIs, see [gRPC APIs]({{site.url}}{{site.baseurl}}/api-reference/grpc-apis/).
