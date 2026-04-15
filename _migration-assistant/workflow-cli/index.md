---
layout: default
title: Workflow CLI
nav_order: 50
has_children: true
has_toc: true
permalink: /migration-assistant/workflow-cli/
---

# Workflow CLI

The Workflow CLI provides a declarative, workflow-driven approach to managing OpenSearch migrations on Kubernetes. Instead of running individual commands, you define your migration configuration in YAML and submit it as a workflow that the Workflow CLI orchestrates.

## Key concepts

### Declarative configuration

Instead of running commands step-by-step, you declare what you want to migrate. The configuration schema defines source clusters, target clusters, authentication, snapshot repositories, and migration options.

To see the complete configuration schema for your installed version:

```bash
workflow configure sample
```
{% include copy.html %}

### Workflow orchestration

The Workflow CLI provides parallel execution, retry logic, progress tracking, resource management, and approval gates. The underlying orchestration is handled automatically — you interact only through the `workflow` commands.

### Approval gates

Certain workflow steps require manual approval before proceeding. This provides checkpoints to verify the migration is progressing correctly. The `⟳` status symbol indicates a step waiting for approval.

```bash
# Using the interactive TUI (recommended)
workflow manage

# Approve a specific step
workflow approve source.target.metadataMigrate

# Approve multiple steps matching a pattern
workflow approve "*.metadataMigrate"
```
{% include copy.html %}

## The `workflow manage` TUI

The `workflow manage` command launches an interactive terminal interface for monitoring and controlling your workflow:

- **Live status view**: See all workflow steps and their current state
- **Log viewer**: Drill into logs for any step without leaving the interface
- **Approval handling**: Approve pending steps directly from the TUI
- **Progress tracking**: Watch steps transition through states in real-time

This is the recommended way to monitor long-running migrations.

## Command reference

### Configuration commands

| Command | Description |
|:--------|:------------|
| `workflow configure sample` | Display sample configuration schema for your version |
| `workflow configure sample --load` | Load sample as starting point |
| `workflow configure edit` | Edit configuration in default editor |
| `workflow configure view` | Display current configuration |
| `workflow configure clear` | Clear current configuration |

### Execution commands

| Command | Description |
|:--------|:------------|
| `workflow submit` | Submit workflow for execution |
| `workflow stop` | Stop a running workflow |

### Management commands

| Command | Description |
|:--------|:------------|
| `workflow manage` | Interactive TUI: approve steps, view logs, monitor progress |
| `workflow approve <step>` | Approve a single step that is currently blocked |
| `workflow approve "*.pattern"` | Approve all matching steps (glob pattern) |

### Monitoring commands

| Command | Description |
|:--------|:------------|
| `workflow status` | Show workflow progress and task states |
| `workflow output` | View workflow logs across all pods |
| `workflow output --follow` | Stream logs as they are written |
| `workflow output -l key=value` | Filter logs using label selectors |

### Console commands

| Command | Description |
|:--------|:------------|
| `console --version` | Check installed version |
| `console clusters connection-check` | Test connectivity to source and target |
| `console clusters curl source -- "/_cat/indices?v"` | Run API calls against clusters |

## Status symbols

| Symbol | Meaning |
|:-------|:--------|
| `✓` | Succeeded |
| `▶` | Running |
| `○` | Pending |
| `✗` | Failed |
| `⟳` | Waiting for approval |

## Configuration schema (`workflowMigration.schema.json`)

Every Migration Assistant release publishes a `workflowMigration.schema.json` file as a [GitHub release asset](https://github.com/opensearch-project/opensearch-migrations/releases). This is a JSON Schema (draft-07) that fully describes every field, type, default, and constraint in the workflow configuration.

### What it provides

- **Autocompletion and validation** in editors that support JSON Schema (VS Code, IntelliJ, etc.) — add `"$schema": "https://opensearch.org/schemas/workflowMigration.schema.json"` to the top of your config file
- **Agentic development** — AI coding assistants and automation tools can consume the schema to generate valid workflow configurations, validate user input, and provide contextual help without needing to run `workflow configure sample`
- **CI/CD validation** — validate workflow configs in pipelines before submitting to the cluster

### Using the schema

On the Migration Console, the schema is available at `/root/.workflowUser.schema.json`. The `workflow configure edit` command automatically uses it for validation.

For local development or automation:

```bash
# Download the schema for your version
curl -sL -o workflowMigration.schema.json \
  "https://github.com/opensearch-project/opensearch-migrations/releases/latest/download/workflowMigration.schema.json"
```
{% include copy.html %}

Add the schema reference to your workflow config for editor support:

```json
{
  "$schema": "https://opensearch.org/schemas/workflowMigration.schema.json",
  "sourceClusters": { ... },
  "targetClusters": { ... },
  "snapshotMigrationConfigs": [ ... ]
}
```
{% include copy.html %}

The schema includes Strimzi Kafka CRD definitions when built against a live cluster, enabling full validation of Kafka cluster configuration overrides.

## Related guides

| Topic | Link |
|:------|:-----|
| Cross-version (ES 6.8 → OpenSearch 3.x on Kubernetes) | [Playbook]({{site.url}}{{site.baseurl}}/migration-assistant/playbook-elasticsearch-6-8-to-opensearch-3-kubernetes/) |
| Managed domain → OpenSearch Serverless | [Playbook]({{site.url}}{{site.baseurl}}/migration-assistant/playbook-amazon-opensearch-service-to-serverless/) |
| Step-by-step configuration | [Getting started]({{site.url}}{{site.baseurl}}/migration-assistant/workflow-cli/getting-started/) |
