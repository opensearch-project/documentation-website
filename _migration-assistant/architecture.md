---
layout: default
title: Architecture
nav_order: 15
permalink: /migration-assistant/architecture/
redirect_from:
  - /migration-assistant/overview/architecture/
---

# Architecture

Migration Assistant runs on Kubernetes and uses [Argo Workflows](https://argoproj.github.io/workflows/) for orchestration. The architecture works equivalently on any Kubernetes distribution, including minikube, kind, Amazon EKS, GKE, AKS, and self-managed clusters.

The following diagram illustrates a typical deployment on Amazon EKS (control plane, Migration Assistant workloads, and supporting services). Other Kubernetes distributions follow the same logical layout with different networking and IAM details.

<img src="{{ site.url }}{{ site.baseurl }}/images/migration-assistant/eks-architecture.svg" alt="Diagram of Migration Assistant on EKS showing users, migration console, Argo workflows, reindex-from-snapshot workers, capture proxy, traffic replayer, Kafka, and connections to source and target clusters" width="900" loading="lazy">

## Core components

| Component | Description |
|:----------|:------------|
| **Migration Console** | A Kubernetes pod providing the CLI interface for configuring, submitting, and monitoring migrations |
| **Workflow CLI** | Command-line tool within the Migration Console for defining migrations in YAML and submitting them as workflows |
| **Argo Workflows** | Kubernetes-native workflow engine that orchestrates migration tasks with parallel execution, retry logic, and approval gates |
| **Reindex-from-Snapshot (RFS)** | High-performance document migration engine that reads directly from Lucene segment files in snapshots |
| **Capture Proxy** | Records live traffic to Kafka for zero-downtime migrations |
| **Traffic Replayer** | Replays captured traffic against the target cluster |
| **Strimzi** | Kubernetes operator for managing Kafka clusters used by Capture and Replay |
| **Prometheus and Grafana** | Monitoring and dashboards for migration progress |

## Migration process overview

### Step 1: Prepare ingestion traffic

Before starting a migration, decide how to handle ongoing writes to your source cluster:

- **Downtime approach**: Temporarily disable ingestion to the source cluster during migration. This is the simplest approach and ensures data consistency.
- **Live capture approach**: Use Migration Assistant's Capture and Replay to record ongoing writes while migration proceeds, allowing zero-downtime migration.

### Step 2: Configure and submit workflow

Configure and submit a migration workflow from the Migration Console:

```bash
workflow configure edit    # Edit configuration
workflow submit            # Submit to Argo Workflows
```

The workflow orchestrates:
1. Point-in-time snapshot of the source cluster
2. Metadata migration (indexes, templates, component templates, aliases)
3. **Approval gate** — workflow pauses for user confirmation before document migration
4. Resource provisioning for Reindex-from-Snapshot (RFS) backfill
5. Resource scale-down when backfill completes

### Step 3: Monitor migration progress

Monitor progress using the Workflow CLI:

```bash
workflow status            # Workflow step completion
workflow manage            # Interactive monitoring TUI
workflow output            # View step logs and output
```

Additional monitoring options:
- **Prometheus and Grafana**: Dashboards for pod metrics and migration progress
- **Amazon CloudWatch**: Container Insights for pod metrics and logs (EKS deployments)
- **Kubernetes**: `kubectl` commands for pod and resource status

### Step 4: Redirect traffic and decommission

Traffic switchover is outside Migration Assistant's scope. You are responsible for updating DNS records, load balancer configuration, or application connection strings to point to the target cluster.

Recommended approach:
1. Update routing to point to target cluster
2. Keep source cluster available as fallback (24–72 hours recommended)
3. Decommission source cluster once confident in target stability

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

### Argo Workflows

Argo Workflows orchestrates the migration process:
- **Workflow templates**: Pre-built templates for migration scenarios
- **Parallel execution**: Run multiple migration tasks simultaneously
- **Retry logic**: Automatic retry on transient failures
- **Approval gates**: Human checkpoints before critical operations
- **Progress tracking**: Visual workflow status and step completion
