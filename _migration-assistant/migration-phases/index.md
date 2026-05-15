---
layout: default
title: Migration workflows
nav_order: 40
nav_exclude: false
has_children: true
has_toc: false
permalink: /migration-assistant/migration-phases/
redirect_from:
  - /migration-assistant/overview/migration-phases/
  - /migration-phases/
---

# Migration workflows

Migration Assistant is workflow-driven. You do not run a migration by manually chaining together unrelated commands. You choose a migration pattern, configure it once, run a pilot, validate the result, and then execute the real cutover.

## Common lifecycle

Most migrations follow the same lifecycle:

1. **Assess** compatibility, unsupported components, and downtime needs.
2. **Deploy** Migration Assistant on Kubernetes or Amazon EKS.
3. **Configure** the workflow from the sample for your installed version.
4. **Run a pilot** on a small allowlist.
5. **Submit the real workflow** and monitor it through the Workflow CLI.
6. **Approve** gated transitions only after validation.
7. **Cut over** to the target.
8. **Remove infrastructure** only after the rollback window has passed.

## Scenario 1: Backfill only

Best for clusters where you can tolerate a brief write freeze or where writes can be paused and replayed from an external queue.

```
Snapshot source → Migrate metadata → Backfill documents → Verify → Switch traffic
```

## Scenario 2: Capture and Replay only

Best when the data is small enough that live replay alone can synchronize the target, or when you want to replay traffic against multiple target clusters to compare results.

```
Reroute traffic to capture proxy → Migrate metadata → Replay traffic → Verify → Switch traffic to target
```

## Scenario 3: Backfill + Capture and Replay (zero-downtime)

The most comprehensive approach. Capture begins first so no writes are lost, then backfill brings over historical data, then replay catches the target up to real-time.

```
Reroute traffic to capture proxy → Snapshot source → Migrate metadata → Backfill documents → Replay captured traffic → Verify → Switch traffic to target
```

## Phase overview

| Phase | Description | Guide |
|:------|:------------|:------|
| [Assessment]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/assessment/) | Review breaking changes and plan your migration | Version-agnostic |
| [Choose your deployment]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/) | Deploy Migration Assistant on Kubernetes or EKS | [Kubernetes]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-kubernetes/) / [EKS]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/) |
| [Reroute client traffic to capture proxy]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/reroute-source-to-proxy/) | Route traffic through the capture proxy to record writes | Capture and Replay only |
| [Migrate metadata]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/) | Transfer index settings, mappings, templates, and aliases | Workflow CLI |
| [Backfill]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/) | Migrate documents using snapshot-based reindexing (RFS) | Workflow CLI |
| [Replay captured traffic]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/replay-captured-traffic/) | Replay recorded traffic to catch the target up to real-time | Capture and Replay only |
| [Switch traffic to the target]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/switch-traffic-to-target/) | Redirect clients from capture proxy to the target cluster | Capture and Replay only |
| [Remove infrastructure]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/remove-migration-infrastructure/) | Clean up Migration Assistant resources | Helm/CloudFormation |

## What Migration Assistant does not migrate automatically

Plan separate work for:

- security configuration,
- ISM or ILM policies,
- ingest pipelines,
- Dashboards or Kibana saved objects,
- data streams,
- and cluster-level tuning.

## What to do next

- Start with [Choose your deployment]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/) if the platform is not running yet.
- Go to [Workflow CLI]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/) if you want the operating model.
- Go to [Playbooks]({{site.url}}{{site.baseurl}}/migration-assistant/playbooks/) if you already know your source and target path.

{% include migration-phase-navigation.html %}
