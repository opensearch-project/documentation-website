---
layout: default
title: Migration assistant overview
nav_order: 15
---

# Migration assistant overview

This Overview outlines the process for successfully performing an end-to-end migration. The solution offered in this repository caters to several specific scenarios:

1. Migrating cluster metadata, such as index settings, aliases, and templates.
2. Migrating existing or historical data from a source to a target cluster.
3. Transferring ongoing or live traffic between clusters.
4. Conducting a comprehensive migration involving both existing and live data with zero downtime and the option to back out of a migration.
5. Upgrading an existing cluster.
6. Comparing an existing cluster with a prospective new one.

In this guide, we focus on scenario 4, guiding you through the migration of historical data from a source cluster while concurrently handling live production traffic, which will be captured and redirected to a target cluster. It's crucial to note that migration strategies are not universally applicable. This guide provides a detailed methodology, based on certain assumptions detailed throughout, emphasizing the importance of robust engineering practices and a systematic approach to ensure a successful migration.

## Key Components of the Solution

### Elasticsearch/OpenSearch Source
Your source cluster in this solution operates on Elasticsearch or OpenSearch, hosted on EC2 instances or similar computing environments. A proxy is set up to interact with this source cluster, either positioned in front of or directly on the coordinating nodes of the cluster.

### Capture Proxy
This component is designed for HTTP RESTful traffic, playing a dual role. It not only forwards traffic to the source cluster but also splits and channels this traffic to a stream-processing service for later playback.

### Traffic Replayer
Acting as a traffic simulation tool, the Traffic Replayer replays recorded request traffic to a target cluster, mirroring source traffic patterns. It links original requests and their responses to those directed at the target cluster, facilitating comparative analysis.

### Reindex-from-Snapshort
Reindexing data from an existing snapshot are Elastic Container Service (ECS) workers that coordinate the migration of documents from an existing snapshot, reindexing the documents in parallel to a target cluster.

### Migration Management Console
A conatiner within Elastic Container Service (ECS) that orchestrates the deployment of the Migration Assistant for Amazon OpenSearch Service, alongside a variety of tools to streamline the migration process.

### Architecture Overview
The solution architecture, adaptable for cloud deployment, unfolds as follows:

1. Incoming traffic reaches the existing cluster, targeting each coordinator node.
2. A Capture Proxy is placed before each coordinator node for traffic capture, storing data in an event stream.
3. With the continuous capture setup, historical data backfill is initiated.
4. Post-backfill, the captured traffic is replayed using the Traffic Replayer.
5. The results from directing traffic to both the original and new clusters are then evaluated.

This architecture is based on the use of AWS cloud infrastructure, but most tools are designed to be cloud-independent. A local containerized version of this solution is also available.


Deploying to AWS (covered later in the guide) will deploy the following system design:

![Migration architecture overview]({{site.url}}{{site.baseurl}}/images/migrations/migration-architecture-overview.svg)

1. Traffic is directed to the existing cluster.
2. An ALB with Capture Proxies are added allowing for traffic capture and storage in Amazon Managed Streaming for Apache Kafka (MSK).
3. With continuous traffic capture in place, a Reindex-from-Snapshot (RFS) is initiated by the user.
4. Once Reindex-from-Snapshot, traffic captured is replayed by the user using a Traffic Replayer.
5. The user evaluates the outcomes from routing traffic to both the original and the new cluster.
6. After confirming the target cluster’s functionality meets expectations, the user dismantles all related stacks, retaining only the new cluster’s setup.
    Additionally, the user may retire and discard the old cluster’s legacy infrastructure.