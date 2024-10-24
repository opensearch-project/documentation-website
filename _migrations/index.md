---
layout: default
title: Migration Assistant for OpenSearch
nav_order: 1
has_children: false
nav_exclude: true
has_toc: false
---

# Migration Assistant for OpenSearch

This overview outlines the process for successfully performing an end-to-end, zero-downtime migration. The solution offered in this repository caters to several specific scenarios:

1. **Metadata Migration** - Migrating cluster metadata, such as index settings, aliases, and templates.
2. **Backfill Migration** - Migrating existing or historical data from a source to a target cluster.
3. **Live Traffic Migration** - Replicating live ongoing traffic from source to target cluster.
4. **Comparative Tooling** - Comparing the performance and behaviors of an existing cluster with a prospective new one.

In this guide, we focus on scenarios 1-3, guiding you through a backfill from a source cluster while concurrently handling live production traffic, which will be captured and replayed to a target cluster. 

It's crucial to note that migration strategies are not universally applicable. This guide provides a detailed methodology, based on certain assumptions detailed throughout, emphasizing the importance of robust engineering practices to ensure a successful migration.


## Key Components of the Solution

### Elasticsearch/OpenSearch Source
Your source cluster in this solution operates on Elasticsearch or OpenSearch, hosted on EC2 instances or similar computing environments. A proxy is set up to interact with this source cluster, either positioned in front of or directly on the coordinating nodes of the cluster.

### Migration Management Console
A console that provides a migration-specific CLI and offers a variety of tools to streamline the migration process.  Everything necessary for completing a migration, other than cleaning up the migration resources, can be done via this Console.

### Traffic Capture Proxy
This component is designed for HTTP RESTful traffic, playing a dual role. It not only forwards traffic to the source cluster but also splits and channels this traffic to a stream-processing service for later playback.

### Traffic Replayer
Acting as a traffic simulation tool, the Traffic Replayer replays recorded request traffic to a target cluster, mirroring source traffic patterns. It links original requests and their responses to those directed at the target cluster, facilitating comparative analysis.

### Metadata Migration Tool
A tool integrated into the Migration CLI that can also be used independently to migrate cluster metadata, including index mappings, index configuration settings, templates, component templates, and aliases.

### Reindex-from-Snapshot
Reindexing data from an existing snapshot on Elastic Container Service (ECS) workers that coordinate the migration of documents from an existing snapshot, reindexing the documents in parallel to a target cluster.

### Target Cluster
The destination cluster for migration or comparison in an A/B test.

### Architecture Overview
This architecture is based on the use of AWS cloud infrastructure, but most tools are designed to be cloud-independent. A local containerized version of this solution is also available.

The design deployed in AWS is as follows: 

![Migration architecture overview]({{site.url}}{{site.baseurl}}/images/migrations/migration-architecture-overview.svg)

1. Client traffic is directed to the existing cluster.
2. An ALB with Capture Proxies relaying traffic to source while replicating to Amazon MSK.
3. With continuous traffic capture in place, a Reindex-from-Snapshot (RFS) is initiated by the user via Migration Console.
4. Once Reindex-from-Snapshot is complete, traffic captured is replayed from MSK by Traffic Replayer.
5. Performance and behavior of traffic sent to source and target clusters are compared by reviewing logs and metrics.
6. After confirming the target cluster’s functionality meets expectations the use redirects clients to new target.
