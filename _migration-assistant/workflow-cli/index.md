---
layout: default
title: Workflow CLI
nav_order: 50
has_children: true
has_toc: true
permalink: /migration-assistant/workflow-cli/
---

# Workflow CLI

The Workflow CLI provides a declarative, workflow-driven approach to managing OpenSearch migrations on Kubernetes. Instead of running individual commands, you define your migration configuration in YAML and submit it as a workflow that Argo Workflows orchestrates.

## Key concepts

### Declarative configuration

Instead of running commands step-by-step, you declare what you want to migrate. The configuration schema defines source clusters, target clusters, authentication, snapshot repositories, and migration options.

To see the complete configuration schema for your installed version:

```bash
workflow configure sample
```
{% include copy.html %}

### Argo Workflows orchestration

Argo Workflows provides parallel execution, retry logic, progress tracking, resource management, and approval gates. You don't interact with Argo Workflows directly — the Workflow CLI handles this for you.

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
