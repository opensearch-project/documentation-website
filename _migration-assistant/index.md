---
layout: default
title: Migration Assistant for OpenSearch
nav_order: 1
has_children: false
nav_exclude: true
has_toc: false
permalink: /migration-assistant/
redirect_from:
  - /migration-assistant/index/
  - /upgrade-to/index/
  - /upgrade-to/
canonical_url: https://docs.opensearch.org/latest/migration-assistant/
---

# Migration Assistant for OpenSearch

Migration Assistant for OpenSearch aids you in successfully performing an end-to-end, zero-downtime migration to OpenSearch from other search providers. It helps with the following scenarios:

- **Metadata migration**: Migrating cluster metadata, such as index settings, aliases, and templates.
- **Backfill migration**: Migrating existing or historical data from a source to a target cluster.
- **Live traffic migration**: Replicating live ongoing traffic from a source to a target cluster.
- **Comparative tooling**: Comparing the performance and behaviors of an existing cluster with a prospective new one.

This user guide focuses on conducting a comprehensive migration involving both existing and live data with zero downtime and the option to back out of a migration.

It's crucial to note that migration strategies are not universally applicable. This guide provides a detailed methodology, based on certain assumptions detailed throughout, emphasizing the importance of robust engineering practices to ensure a successful migration.
{: .tip }

## Key components 

The following are the key components of Migration Assistant.

### Elasticsearch/OpenSearch source

Your source cluster in this solution operates on Elasticsearch or OpenSearch, hosted on EC2 instances or similar computing environments. A proxy is set up to interact with this source cluster, either positioned in front of or directly on the coordinating nodes of the cluster.

### Migration management console

A console that provides a migration-specific CLI and offers a variety of tools to streamline the migration process.  Everything necessary for completing a migration, other than cleaning up the migration resources, can be done via this Console.

### Traffic capture proxy

This component is designed for HTTP RESTful traffic. It forwards traffic to the source cluster and also splits and channels this traffic to a stream processing service for later playback.

### Traffic Replayer

Acting as a traffic simulation tool, the Traffic Replayer replays recorded request traffic to a target cluster, mirroring source traffic patterns. It links original requests and their responses to those directed at the target cluster, facilitating comparative analysis.

### Metadata migration tool

The Metadata migration tool integrated into the Migration CLI can be used independently to migrate cluster metadata, including index mappings, index configuration settings, templates, component templates, and aliases.

### Reindex-from-Snapshot

`Reindex-from-Snapshot` (RFS) reindexes data from an existing snapshot. Workers on Amazon Elastic Container Service (Amazon ECS) coordinate the migration of documents from an existing snapshot, reindexing the documents in parallel to a target cluster.

### Target cluster

The destination cluster for migration or comparison in an A/B test.

## Architecture overview

The Migration Assistant architecture is based on the use of an AWS Cloud infrastructure, but most tools are designed to be cloud independent. A local containerized version of this solution is also available.

The design deployed in AWS is as follows: 

![Migration architecture overview]({{site.url}}{{site.baseurl}}/images/migrations/migrations-architecture-overview.png)

1. Client traffic is directed to the existing cluster.
2. An Application Load Balancer with capture proxies relays traffic to a source while replicating data to Amazon Managed Streaming for Apache Kafka (Amazon MSK).
3. Using the migration console, you can initiate metadata migration to establish indexes, templates, component templates, and aliases on the target cluster.
4. With continuous traffic capture in place, you can use a `reindex-from-snapshot` process to capture data from your current index.
4. Once `Reindex-from-Snapshot` is complete, captured traffic is replayed from Amazon MSK to the target cluster by the traffic replayer.
5. Performance and behavior of traffic sent to the source and target clusters are compared by reviewing logs and metrics.
6. After confirming that the target cluster's functionality meets expectations, clients are redirected to the new target.
