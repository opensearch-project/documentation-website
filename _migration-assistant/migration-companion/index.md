---
layout: default
title: Migration Companion
nav_order: 5
has_children: true
has_toc: true
permalink: /migration-assistant/migration-companion/
---

# Migration Companion

Migration Companion is an AI-guided experience that walks you through your entire migration — from initial assessment through final cutover — within a single continuous conversation. Instead of reading docs, running CLI commands, and stitching together tools manually, you describe your migration goal and the companion handles assessment, planning, deployment, and execution.

You remain in control through approval gates and plan review, but the cognitive load shifts from you to the system.
{: .note }

## How it works

Migration Companion wraps the same Migration Assistant engine (Workflow CLI, Reindex-from-Snapshot, Capture and Replay) with an AI advisor that can:

- **Assess** your source cluster — detect version, analyze schemas, identify breaking changes, estimate target sizing
- **Plan** your migration — recommend backfill-only vs. capture-and-replay, choose target type (provisioned vs. serverless), generate transforms
- **Deploy** Migration Assistant infrastructure — bootstrap EKS, install Helm charts, configure networking
- **Execute** the migration — generate workflow configs, submit workflows, monitor progress, handle approvals
- **Validate** results — compare document counts, run test queries, verify metadata

## Choose your install modality

Migration Companion runs in three modalities. Each one gives you the same migration experience — only the bootstrap and credential setup differ.

| Modality | Best for | AI provider | Status |
|:---------|:---------|:------------|:-------|
| [IDE agent]({{site.url}}{{site.baseurl}}/migration-assistant/migration-companion/ide-agent/) | Developers with Cursor, VS Code + Cline, Kiro, or any AI-enabled IDE | Your IDE's built-in AI | Available |
| [AWS CloudShell]({{site.url}}{{site.baseurl}}/migration-assistant/migration-companion/cloudshell/) | AWS users who want to start from the console with no local setup | Amazon Bedrock | Coming soon |
| [Docker]({{site.url}}{{site.baseurl}}/migration-assistant/migration-companion/docker/) | Local or air-gapped environments, CI/CD pipelines | Configurable (Claude API, Bedrock, or bring your own) | Coming soon |

## The migration journey

Regardless of which modality you choose, the companion guides you through the same phases:

### 1. Assessment

The companion connects to your source cluster, detects the platform (Elasticsearch, OpenSearch, or Solr), and produces a readiness report:

- Source version and compatibility check against [supported migration paths]({{site.url}}{{site.baseurl}}/migration-assistant/is-migration-assistant-right-for-you/)
- Breaking changes analysis (field type incompatibilities, deprecated features)
- Target sizing recommendation using the [cluster sizing estimator](#sizing-estimator)
- Snapshot prerequisites (S3 plugin, IAM roles, bucket access)

### 2. Planning

Based on the assessment, the companion recommends a migration strategy:

- **Backfill only** — for clusters where writes can be paused briefly
- **Backfill + Capture and Replay** — for zero-downtime migrations
- **Solr backfill + shim validation** — for Solr sources

The companion generates a draft migration plan including target type (provisioned OpenSearch Service, OpenSearch Serverless, or self-managed), authentication model, snapshot location, and workflow configuration.

### 3. Deployment

With your approval, the companion deploys or attaches to Migration Assistant:

- On AWS: runs `aws-bootstrap.sh` to create the EKS cluster, install Helm charts, and configure CloudWatch dashboards
- On existing Kubernetes: installs the Migration Assistant Helm chart
- Configures source and target cluster access, creates Kubernetes secrets, validates network connectivity

### 4. Execution

The companion materializes a valid workflow configuration from the current schema, submits it, and monitors progress:

- Generates `workflow-config.yaml` from assessment outputs (not blank templates)
- Runs `console clusters connection-check` before submitting
- Submits via `workflow submit` and monitors via `workflow status`
- Handles approval gates automatically or prompts you for review
- Reports progress: snapshot creation, metadata migration, backfill, replay

### 5. Validation

After the workflow completes, the companion verifies the migration:

- Compares document counts between source and target
- Runs representative queries
- Reports any discrepancies
- Provides a readiness summary before traffic switchover

## Sizing estimator

The target cluster sizing estimator is a CLI tool and MCP server that recommends optimal OpenSearch configurations based on your source cluster's characteristics.

This feature is not yet available for all source types. Currently supports Elasticsearch and OpenSearch sources. Solr source analysis is planned.
{: .warning }

| Workload type | Key inputs | Optimization focus |
|:-------------|:-----------|:-------------------|
| Search | Data volume, query rate, latency SLA | Query performance, replica count |
| Time-series / Logs | Ingestion rate, retention period | Storage efficiency, warm/cold tiers |
| Vector search | Vector dimensions, index size, recall target | Memory capacity, k-NN engine selection |

The estimator provides recommendations for both provisioned clusters and serverless collections.

## Relationship to Migration Assistant

Migration Companion is the **front door** to Migration Assistant. Under the hood, it uses the same components:

- [Workflow CLI]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/) for migration orchestration
- [Reindex-from-Snapshot]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/) for document backfill
- [Capture and Replay]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/replay-captured-traffic/) for zero-downtime migration
- [EKS deployment]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/deploying-to-eks/) for infrastructure

All Migration Assistant documentation remains valid. The companion automates the steps described in those pages — it doesn't replace them. If you prefer to operate manually, follow the [Workflow CLI getting started]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/getting-started/) guide directly.
