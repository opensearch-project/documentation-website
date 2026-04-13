---
layout: default
title: Migration phases
nav_order: 40
nav_exclude: false
has_children: true
has_toc: false
permalink: /migration-assistant/migration-phases/
redirect_from:
  - /migration-assistant/overview/migration-phases/
  - /migration-phases/
---

# Migration phases

This page outlines the phases of migrating with Migration Assistant. There are three migration scenarios, each consisting of a sequence of common steps.

## Scenario 1: Backfill only

Best for clusters where you can tolerate a brief write freeze or where writes can be paused and replayed from an external queue.

```
Snapshot source → Migrate metadata → Backfill documents → Verify → Switch traffic
```

## Scenario 2: Capture and Replay only

Best when the data is small enough that live replay alone can synchronize the target, or when you want to replay traffic against multiple target clusters to compare results.

```
Start capturing traffic → Migrate metadata → Replay traffic → Verify → Switch traffic
```

## Scenario 3: Backfill + Capture and Replay (zero-downtime)

The most comprehensive approach. Capture begins first so no writes are lost, then backfill brings over historical data, then replay catches the target up to real-time.

```
Start capturing traffic → Snapshot source → Migrate metadata → Backfill documents → Replay captured traffic → Verify → Switch traffic
```

## Phase overview

| Phase | Description | Guide |
|:------|:------------|:------|
| [Assessment]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/assessment/) | Review breaking changes and plan your migration | Version-agnostic |
| [Deploy]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/) | Deploy Migration Assistant on Kubernetes or EKS | [K8s]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-kubernetes/) / [EKS]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/) |
| [Migrate metadata]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/) | Transfer index settings, mappings, templates, and aliases | Workflow CLI |
| [Backfill]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/) | Migrate documents using snapshot-based reindexing (RFS) | Workflow CLI |
| [Capture and Replay]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/capture-and-replay/) | Record and replay live traffic for zero-downtime migration | Workflow CLI |
| [Remove infrastructure]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/remove-migration-infrastructure/) | Clean up Migration Assistant resources | Helm/CloudFormation |

{% include migration-phase-navigation.html %}
