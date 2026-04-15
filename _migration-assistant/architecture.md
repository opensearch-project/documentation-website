---
layout: default
title: Architecture
nav_order: 15
permalink: /migration-assistant/architecture/
redirect_from:
  - /migration-assistant/overview/architecture/
---

# Architecture

Migration Assistant runs on Kubernetes and uses the Workflow CLI to orchestrate migrations. Under the hood, workflows are executed by [Argo Workflows](https://argoproj.github.io/workflows/), but you interact exclusively through the Workflow CLI — not Argo directly. The architecture works equivalently on any Kubernetes distribution, including minikube, kind, Amazon EKS, GKE, AKS, and self-managed clusters.

The following diagram illustrates a typical deployment on Amazon EKS (control plane, Migration Assistant workloads, and supporting services). Other Kubernetes distributions follow the same logical layout with different networking and IAM details.

<img src="{{ site.url }}{{ site.baseurl }}/images/migration-assistant/eks-architecture.svg" alt="Diagram of Migration Assistant on EKS showing users, migration console, Argo workflows, reindex-from-snapshot workers, capture proxy, traffic replayer, Kafka, and connections to source and target clusters" width="900" loading="lazy">

## Core components

| Component | Description |
|:----------|:------------|
| **Migration Console** | A Kubernetes pod providing the CLI interface for configuring, submitting, and monitoring migrations |
| **Workflow CLI** | Command-line tool within the Migration Console for defining migrations in YAML and submitting them as workflows |
| **Workflow Engine** | Orchestrates migration tasks with parallel execution, retry logic, and approval gates (powered by Argo Workflows internally) |
| **Reindex-from-Snapshot (RFS)** | High-performance document migration engine that reads directly from Lucene segment files in snapshots |
| **Capture Proxy** | Records live traffic to Kafka for zero-downtime migrations |
| **Traffic Replayer** | Replays captured traffic against the target cluster |
| **Strimzi** | Kubernetes operator for managing Kafka clusters used by Capture and Replay |
| **Prometheus and Grafana** | Monitoring and dashboards for migration progress |

## Migration process overview

Each numbered node in the architecture diagram corresponds to the following steps in the migration process:

### Step 1: Client traffic is directed to the existing cluster

Client traffic flows to the source cluster as normal. If you are performing a zero-downtime migration with Capture and Replay, a Kubernetes Service routes traffic through the capture proxy fleet, which forwards requests to the source while simultaneously recording them to Kafka.

### Step 2: Capture proxy replicates traffic to Kafka

The capture proxy relays traffic to the source cluster and simultaneously replicates the raw request/response streams to Kafka (managed by Strimzi). This provides a durable record of all writes during the migration window. If you are performing a backfill-only migration, this step is skipped.

### Step 3: Snapshot and backfill via Reindex-from-Snapshot

With continuous traffic capture in place (or after pausing writes), the user submits a migration workflow from the Migration Console. The workflow creates a point-in-time snapshot of the source cluster, migrates metadata (indexes, templates, aliases), and then launches Reindex-from-Snapshot (RFS) workers that read directly from the snapshot in S3 and bulk-index documents into the target cluster.

### Step 4: Traffic Replayer catches up the target

After the backfill completes, the Traffic Replayer reads captured traffic from Kafka and replays it against the target cluster, transforming requests as needed (authentication, index names). The replayer catches the target up to real-time, closing the gap between the snapshot point-in-time and the current state.

### Step 5: Validate and compare

The performance and behavior of traffic routed to the source and target clusters are analyzed by reviewing logs, metrics, and document counts. Use `console clusters curl` to run comparison queries against both clusters. Prometheus and Grafana dashboards (or Amazon CloudWatch on EKS) provide operational metrics.

### Step 6: Redirect traffic and decommission

After confirming the target cluster's functionality meets expectations, redirect clients to the new target by updating DNS records, load balancer configuration, or application connection strings. Keep the source cluster available as a fallback (24–72 hours recommended), then decommission the source and remove Migration Assistant infrastructure.

## Error recovery

### Workflow failures

If a workflow step fails:
1. Check the error with `workflow status` and `workflow output`
2. Fix the underlying issue (connectivity, permissions, configuration)
3. Use `workflow retry` to retry the failed step

### RFS backfill resumption

RFS tracks progress automatically. If backfill is interrupted:
- RFS automatically resumes from the last checkpoint when restarted
- Already-migrated shards are skipped
- No data is duplicated

## Component details

### Reindex-from-Snapshot (RFS)

RFS takes a fundamentally different approach from traditional migration tools. Instead of reading documents through the source cluster's HTTP API, it:

1. Takes a **one-time snapshot** of the source cluster (the only time the source is touched)
2. Reads the **raw Lucene segment files** directly from the snapshot in storage (S3)
3. Extracts documents, applies transformations, and **bulk-indexes them on the target**

This means: **zero ongoing source load**, **no version compatibility limit** (works across any supported gap), **massive parallelism** (one worker per shard), and **full resumability** (failed shards are retried without restarting).

### Workflow Engine

The workflow engine orchestrates the migration process:
- **Workflow templates**: Pre-built templates for migration scenarios
- **Parallel execution**: Run multiple migration tasks simultaneously
- **Retry logic**: Automatic retry on transient failures
- **Approval gates**: Human checkpoints before critical operations
- **Progress tracking**: Visual workflow status and step completion
