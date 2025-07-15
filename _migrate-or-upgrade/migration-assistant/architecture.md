---
layout: default
title: Architecture
nav_order: 15
parent: Migration Assistant for OpenSearch
permalink: /migration-assistant/architecture/
---

# Architecture

The Migration Assistant architecture is based on the use of an AWS Cloud infrastructure, but most tools are designed to be cloud independent. A local containerized version of this solution is also available.

The design deployed on AWS uses the following architecture.

![Migration architecture overview]({{site.url}}{{site.baseurl}}/images/migrations/migrations-architecture-overview.png)

Each node in the diagram correlates to the following steps in the migration process:

1. Client traffic is directed to the existing cluster.
2. An Application Load Balancer with capture proxies relays traffic to a source while replicating data to Amazon Managed Streaming for Apache Kafka (Amazon MSK).
3. Using the migration console, a point-in-time snapshot is taken. Once the snapshot completes, `Metadata-Migration-Tool` is used to establish indexes, templates, component templates, and aliases on the target cluster. With continuous traffic capture in place, `Reindex-from-Snapshot` process to migrate data from source.
4. Once `Reindex-from-Snapshot` is complete, captured traffic is replayed from Amazon MSK to the target cluster by `Traffic-Capture-Replayer`.
5. Performance and behavior of traffic sent to the source and target clusters are compared by reviewing logs and metrics.
6. After confirming that the target cluster's functionality meets expectations, clients are redirected to the new target.