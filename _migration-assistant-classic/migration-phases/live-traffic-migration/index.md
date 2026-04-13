---
layout: default
title: Live traffic migration
parent: Migration phases
nav_order: 99
nav_exclude: true
permalink: /classic/migration-assistant/live-traffic-migration/
has_toc: false
has_children: true
---
<p class="classic-version-warning">You're viewing the <strong>classic</strong> version of Migration Assistant documentation (ECS/CDK-based). For the latest Kubernetes-based version, see the <a href="/latest/migration-assistant/">current documentation</a>.</p>

# Live traffic migration

Live traffic migration intercepts HTTP requests sent to a source cluster and stores them in a durable stream before forwarding them to the source cluster. The stored requests are then duplicated and replayed to the target cluster. This process synchronizes the source and target clusters while highlighting behavioral and performance differences between them. Kafka is used to manage the data flow and reconstruct HTTP requests. You can monitor the replication process through Amazon CloudWatch metrics and the [migration console]({{site.url}}{{site.baseurl}}/classic/migration-assistant/migration-console/accessing-the-migration-console/), which provides results in JSON format for analysis.

To start with live traffic migration, use the following steps:

1. [Using Traffic Replayer]({{site.url}}{{site.baseurl}}/classic/migration-assistant/migration-phases/replay-captured-traffic/)
2. [Switching traffic from the source cluster]({{site.url}}{{site.baseurl}}/classic/migration-assistant/migration-phases/reroute-traffic-from-capture-proxy-to-target/)
