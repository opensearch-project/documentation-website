---
layout: default
title: Live traffic migration
nav_order: 99
parent: Migration phases
has_children: true
---

# Live traffic migration

Live traffic migration intercepts HTTP requests and stores them in a robust, expandable stream before sending them to the original cluster. It then duplicates these stored requests, sending them to both the original and new clusters. This process allows for performance testing of the new cluster, maintains synchronization between clusters, and highlights any differences between them. The system uses Kafka to manage the data flow and reconstruct the HTTP requests. Users can monitor the replication process using CloudWatch metrics and the Migration Management Console, which provides results in JSON format for easy analysis.

To start with live traffic migration, use the following steps:

1. [Using traffic replayer]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/using-traffic-replayer/)
2. [Switching traffic from the source cluster]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/switching-traffic-from-the-source-cluster/)

