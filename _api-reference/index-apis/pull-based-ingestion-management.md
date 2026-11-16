---
layout: default
title: Pull-based ingestion management
parent: Index APIs
nav_order: 80
has_children: true
has_toc: false
redirect_from:
  - /api-reference/document-apis/pull-based-ingestion-management/
---

# Pull-based ingestion management
**Introduced 3.0**
{: .label .label-purple }

Pull-based ingestion management APIs control how an index consumes data from its [pull-based ingestion]({{site.url}}{{site.baseurl}}/im-plugin/pull-based-ingestion/index/) source. You can stop and restart ingestion, reset the position from which shards read, and check the state of each shard's poller.

## Available APIs

OpenSearch supports the following pull-based ingestion management APIs.

| API | Description |
| :--- | :--- |
| [Pause ingestion]({{site.url}}{{site.baseurl}}/api-reference/index-apis/pause-ingestion/) | Stops consuming data from the source for all shards in one or more indexes. |
| [Resume ingestion]({{site.url}}{{site.baseurl}}/api-reference/index-apis/resume-ingestion/) | Restarts consuming data, optionally from a specific offset or timestamp. |
| [Get ingestion state]({{site.url}}{{site.baseurl}}/api-reference/index-apis/get-ingestion-state/) | Returns the current ingestion state for each shard in one or more indexes. |
