---
layout: default
title: Architecture
nav_order: 15
permalink: /migration-assistant/architecture/
redirect_from:
  - /migration-assistant/overview/architecture/
canonical_url: https://docs.opensearch.org/latest/migration-assistant/architecture/
---

# Architecture

Migration Assistant follows this operating model:

1. You describe the migration in workflow configuration.
2. The Workflow CLI submits that configuration to Kubernetes.
3. Kubernetes and Argo Workflows create the pods and services required for each phase.
4. You observe progress, approve gated steps, validate results, and switch traffic to the target.

Internally, workflows are executed by [Argo Workflows](https://argoproj.github.io/workflows/), but you operate Migration Assistant through the Migration Console and Workflow CLI rather than through Argo directly.

The following diagram illustrates a typical deployment on Amazon Elastic Kubernetes Service (EKS). Other Kubernetes distributions follow the same logical migration model, but EKS adds AWS-specific identity, networking, image, and observability integrations.

![Migration Assistant Architecture on EKS]({{site.url}}{{site.baseurl}}/images/migration-assistant/eks-architecture.svg)

## System layers

Migration Assistant separates concerns into two layers. You describe the migration once, and the platform executes it as managed workloads:

- A **control plane** that manages migration workflows.
- A **data plane** that performs the actual snapshot, metadata, backfill, capture, and replay work.

## Control plane

The following table lists the control plane components.

| Component | Description |
|:----------|:------------|
| **Migration Console** | The pod where you run `console` and `workflow` commands |
| **Workflow CLI** | The primary interface for configuration, submission, approval, and status |
| **Argo Workflows** | The workflow engine that sequences tasks, retries failures, and tracks state |
| **Kubernetes** | The platform that schedules pods, creates services, manages secrets, and cleans up resources |

## Data plane

The following table lists the data plane components.

| Component | Description |
|:----------|:------------|
| **Reindex-from-Snapshot (RFS)** | High-performance backfill engine that reads Lucene segments from snapshots instead of reading documents through the source cluster API |
| **Metadata migration** | Transfers index settings, mappings, templates, and aliases |
| **Capture Proxy** | Records live traffic to Apache Kafka during zero-downtime migrations |
| **Traffic Replayer** | Replays captured traffic against the target cluster to catch it up |
| **Strimzi** | Manages Kafka for Capture and Replay workflows |
| **Observability stack** | Prometheus-compatible metrics, logs, and dashboards; on EKS this extends into CloudWatch |

## Migration process overview

Each numbered node in the architecture diagram corresponds to a step in the migration process.

### Step 1: Client traffic is directed to the existing cluster

Client traffic flows to the source cluster as normal. If you are performing a zero-downtime migration using Capture and Replay, a Kubernetes Service routes traffic through the capture proxy fleet, which forwards requests to the source while simultaneously recording them to Kafka.

### Step 2: Capture proxy replicates traffic to Kafka

The capture proxy relays traffic to the source cluster and simultaneously replicates the raw request/response streams to Kafka (managed by Strimzi). This provides a durable record of all writes during the migration window. This step does not apply to backfill-only migrations.

### Step 3: Snapshot and backfill through Reindex-from-Snapshot

With continuous traffic capture in place (or after pausing writes), you submit a migration workflow from the Migration Console. The workflow creates a point-in-time snapshot of the source cluster, migrates metadata (indexes, templates, aliases), and then launches Reindex-from-Snapshot (RFS) workers that read directly from the snapshot in Amazon S3 and bulk-index documents into the target cluster.

### Step 4: Traffic Replayer catches up the target

After the backfill completes, the Traffic Replayer reads captured traffic from Kafka and replays it against the target cluster, transforming requests as needed (authentication, index names). The Replayer catches the target up to real-time, closing the gap between the snapshot point-in-time and the current state.

### Step 5: Validate and compare

The performance and behavior of traffic routed to the source and target clusters are analyzed by reviewing logs, metrics, and document counts. Use `console clusters curl` to run comparison queries against both clusters. On generic Kubernetes this usually means your cluster logging and metrics stack; on EKS the bootstrap path also wires in CloudWatch dashboards and logs.

### Step 6: Redirect traffic and decommission

After confirming the target cluster's functionality meets expectations, redirect clients to the new target by updating DNS records, load balancer configuration, or application connection strings. Keep the source cluster available as a fallback (24--72 hours recommended), then decommission the source and remove Migration Assistant infrastructure.

## Error recovery

The following are common error recovery symptoms and resolutions.

### Workflow failures

If a workflow step fails, perform the following steps:

1. Check the error with `workflow status` and `workflow log all`.
2. Fix the underlying issue such as connectivity, permissions, or configuration.
3. Retry or resubmit from the workflow model instead of patching pods manually.

### RFS backfill resumption

RFS tracks progress automatically. If backfill is interrupted, the following behavior applies:
- RFS automatically resumes from the last checkpoint when restarted.
- Already-migrated shards are skipped.
- No data is duplicated.

## Component details

The following components make up the Migration Assistant architecture.

### Reindex-from-Snapshot

RFS takes a fundamentally different approach from traditional migration tools. Instead of reading documents through the source cluster's HTTP API, it:

1. Takes a **one-time snapshot** of the source cluster (the only time the source is touched)
2. Reads the **raw Lucene segment files** directly from the snapshot in storage (S3)
3. Extracts documents, applies transformations, and **bulk-indexes them on the target**

This approach produces **no ongoing source load**, **no version compatibility limit** (works across any supported gap), **parallel processing** (one worker per shard), and the ability to **resume where it left off** (failed shards are retried without restarting).

{% include migration-phase-navigation.html %}
