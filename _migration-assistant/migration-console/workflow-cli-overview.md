---
layout: default
title: Workflow CLI overview
parent: Migration console
grand_parent: Migration Assistant for OpenSearch
nav_order: 10
permalink: /migration-assistant/migration-console/workflow-cli-overview/
---

# Workflow CLI overview

{: .warning }
> **Experimental Feature**: The Workflow CLI is an experimental feature for Kubernetes-based deployments (3.x release). For the stable ECS-based approach (2.x), see [Migration console commands]({{site.url}}{{site.baseurl}}/migration-assistant/migration-console/migration-console-commands-references/).

The Workflow CLI provides a declarative, workflow-driven approach to managing OpenSearch migrations on Kubernetes. Instead of running individual commands, you define your migration configuration in YAML and submit it as a workflow that Argo Workflows orchestrates.

## What is the Workflow CLI?

The Workflow CLI is a command-line tool available in the migration console that lets you:

- **Configure** migrations using declarative YAML
- **Submit** migrations as Argo Workflows
- **Monitor** workflow execution and progress
- **Manage** workflow lifecycle (approve, stop, etc.)

The CLI abstracts the complexity of Kubernetes and Argo Workflows, providing a simple interface for migration tasks.

## Key concepts

### Declarative configuration

Instead of running commands step-by-step, you declare what you want to migrate:

```yaml
sourceClusters:
  my-source:
    endpoint: https://source-cluster:9200
    version: "7.10.2"

targetClusters:
  my-target:
    endpoint: https://target-cluster:9200
    version: "2.11.0"

migrations:
  - sourceCluster: my-source
    targetCluster: my-target
    snapshotMigrations:
      - indices: ["logs-*", "metrics-*"]
        metadataMigration:
          enabled: true
        documentBackfill:
          enabled: true
```

The system determines how to execute the migration based on your configuration.

### Workflow templates

Pre-built workflow templates handle common migration scenarios:

- **Full migration**: Snapshots, metadata, and document backfill
- **Snapshot migration**: Create and restore snapshots
- **Metadata migration**: Migrate index templates and settings
- **Document bulk load**: Efficient document loading using RFS

These templates are pre-deployed on your Kubernetes cluster and don't need to be managed individually.

### Argo Workflows orchestration

Argo Workflows provides:

- **Parallel execution**: Multiple migration tasks run simultaneously
- **Retry logic**: Automatic retry on transient failures
- **Progress tracking**: Visual workflow status
- **Resource management**: Controlled pod scheduling

You don't interact with Argo Workflows directly—the Workflow CLI handles this for you.

### State management with etcd

Workflow state and coordination data are stored in etcd:

- **Configuration**: Runtime settings accessible to all workflow steps
- **Coordination**: Synchronization between parallel tasks
- **Status**: Shared state for monitoring progress

This state is managed automatically; you don't need to interact with etcd directly.

## How it works

### 1. Configuration phase

You create a migration configuration file using the `workflow configure` commands:

```bash
# Load a sample configuration
workflow configure sample --load

# Edit the configuration
workflow configure edit

# View the configuration
workflow configure view
```

### 2. Submission phase

Submit your configuration as a workflow:

```bash
workflow submit
```

This command:
- Validates your configuration
- Transforms it to Argo Workflow format
- Initializes etcd state
- Submits to Argo Workflows
- Returns a workflow name for tracking

### 3. Execution phase

Argo Workflows executes the migration in stages:

1. **Initialize**: Set up workflow environment
2. **Create snapshots**: Snapshot source cluster indices
3. **Register snapshots**: Make snapshots available to target
4. **Migrate metadata**: Transfer index templates and settings
5. **Load documents**: Bulk load documents from snapshots
6. **Cleanup**: Remove temporary state

### 4. Monitoring phase

Track progress with status commands:

```bash
# View all workflows
workflow status

# Check specific workflow
workflow status migration-abc123

# Approve manual steps if needed
workflow approve migration-abc123
```

## Workflow CLI vs. console commands

The Workflow CLI differs from traditional migration console commands:

| Aspect | Workflow CLI | Console Commands |
|--------|--------------|------------------|
| Approach | Declarative | Imperative |
| Configuration | YAML file | Command parameters |
| Orchestration | Argo Workflows | Manual |
| Parallelism | Automatic | Manual coordination |
| Retry | Built-in | Manual |
| State | etcd | In-memory |
| Platform | Kubernetes | ECS |

## When to use Workflow CLI

Consider using the Workflow CLI if you:

- Want declarative migration configuration
- Need automatic retry and error handling
- Prefer workflow orchestration over manual coordination
- Are deploying on Kubernetes
- Have complex migrations with multiple index groups

For simpler migrations or ECS deployments, traditional console commands may be more appropriate.

## Architecture

The Workflow CLI system architecture:

```
┌─────────────────────────────────────────┐
│   User Configuration (YAML)             │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   Workflow CLI                          │
│   - Validation                          │
│   - Transformation                      │
│   - Submission                          │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   Argo Workflows                        │
│   - Orchestration                       │
│   - Parallelism                         │
│   - Retry logic                         │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   Migration Execution                   │
│   - Snapshot operations                 │
│   - Metadata migration                  │
│   - Document loading                    │
└─────────────────────────────────────────┘
```

## Benefits

### Declarative configuration

- Define what to migrate, not how
- Configuration is version-controlled
- Easy to review and audit
- Repeatable migrations

### Workflow orchestration

- Automatic parallelism
- Built-in retry logic
- State management
- Progress tracking

### Kubernetes-native

- Leverages Kubernetes scheduling
- Resource limits and requests
- Integration with Kubernetes ecosystem
- Scalable execution

## Limitations

{: .warning }
The Workflow CLI has some limitations in this experimental release:

- Limited to backfill migrations (no live capture/replay)
- Requires Kubernetes and Argo Workflows expertise
- Less mature than console commands approach
- Fewer examples and documentation
- API may change in future releases

## Next steps

1. Follow the [Getting started guide]({{site.url}}{{site.baseurl}}/migration-assistant/migration-console/workflow-cli-getting-started/) for your first workflow
2. Learn about [Backfill workflows]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill-workflow/)

## Related documentation

- [Traditional console commands]({{site.url}}{{site.baseurl}}/migration-assistant/migration-console/migration-console-commands-references/) - ECS-based approach

## Feedback

The Workflow CLI is experimental. If you encounter issues or have suggestions, provide feedback through the [opensearch-migrations repository](https://github.com/opensearch-project/opensearch-migrations).
