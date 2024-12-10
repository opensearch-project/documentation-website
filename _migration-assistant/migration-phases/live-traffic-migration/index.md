---
layout: default
title: Live traffic migration
nav_order: 99
parent: Migration phases
has_toc: false
has_children: true
---

# Live traffic migration

Live traffic migration intercepts HTTP requests to a source cluster and stores them in a durable stream before forwarding them to the source cluster. The stored requests are then duplicated and replayed to the target cluster. This process synchronizes the source and target clusters while highlighting behavioral and performance differences between them. Kafka is used to manage the data flow and reconstruct HTTP requests. You can monitor the replication process through CloudWatch metrics and the [migration console]({{site.url}}{{site.baseurl}}/migration-console/), which provides results in JSON format for analysis.

To start with live traffic migration, use the following steps:

1. [Using Traffic Replayer]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/using-traffic-replayer/)
2. [Switching traffic from the source cluster]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/switching-traffic-from-the-source-cluster/)

