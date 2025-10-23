---
layout: default
title: Backfill workflow
parent: Migration phases
grand_parent: Migration Assistant for OpenSearch
nav_order: 50
permalink: /migration-assistant/migration-phases/backfill-workflow/
---

# Backfill workflow

{: .warning }
> **Experimental Feature**: This workflow-based backfill approach is experimental and intended for the 3.x Kubernetes-based release. For the stable 2.x approach, see [Backfill]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/).

This page describes how to perform document backfill using the workflow CLI on Kubernetes. The workflow-based approach provides declarative configuration, automatic retry handling, and progress monitoring through Argo Workflows.

## Overview

The backfill workflow migrates documents from your source cluster to your target cluster using snapshot-based reindexing (RFS). Unlike the traditional approach where you run commands manually, the workflow approach uses Argo Workflows to orchestrate the entire process.

### What the workflow does

The backfill workflow performs these steps automatically:

1. **Create snapshot**: Creates a snapshot of specified indices on the source cluster
2. **Register snapshot**: Makes the snapshot available to the target cluster
3. **Migrate metadata** (optional): Transfers index templates and settings
4. **Load documents**: Reindexes documents from the snapshot to the target cluster
5. **Cleanup**: Removes temporary state and coordination data

## Prerequisites

Before running a backfill workflow:

- Have access to the migration console on your Kubernetes cluster
- Have Argo Workflows installed and running
- Ensure source and target clusters are accessible
- Have an S3 bucket configured for snapshots (if not using existing snapshots)

## Configuring a backfill workflow

### Basic configuration

A minimal backfill configuration includes:

```yaml
sourceClusters:
  my-source:
    endpoint: https://source-cluster:9200
    version: "7.10.2"
    authConfig:
      basic:
        username: admin
        password: password

targetClusters:
  my-target:
    endpoint: https://target-cluster:9200
    version: "2.11.0"
    authConfig:
      basic:
        username: admin
        password: password

migrations:
  - sourceCluster: my-source
    targetCluster: my-target
    snapshotMigrations:
      - indices: ["*"]
        metadataMigration:
          enabled: true
        documentBackfill:
          enabled: true
```

### Configuration options

#### Index selection

Specify which indices to migrate using patterns:

```yaml
snapshotMigrations:
  # All indices
  - indices: ["*"]
  
  # Specific patterns
  - indices: ["logs-*", "metrics-*"]
  
  # Multiple specific indices
  - indices: ["users", "orders", "products"]
```

#### Metadata migration

Control whether to migrate index templates and settings:

```yaml
metadataMigration:
  enabled: true   # Migrate templates, mappings, settings
  # or
  enabled: false  # Skip metadata, documents only
```

#### Document backfill

Enable or disable document migration:

```yaml
documentBackfill:
  enabled: true   # Migrate documents
  # or
  enabled: false  # Skip documents (metadata only)
```

#### S3 snapshot configuration

If using S3 for snapshots:

```yaml
sourceClusters:
  my-source:
    endpoint: https://source-cluster:9200
    version: "7.10.2"
    snapshotRepo:
      s3RepoPathUri: s3://my-bucket/snapshots
      aws_region: us-east-1
```

## Running a backfill workflow

### Step 1: Create configuration

Access the migration console and create your configuration:

```bash
# Load sample and customize
workflow configure sample --load
workflow configure edit
```
{% include copy.html %}

### Step 2: Submit workflow

Submit the workflow to Argo:

```bash
workflow submit
```
{% include copy.html %}

Note the workflow name from the output for monitoring.

### Step 3: Monitor progress

Check workflow status:

```bash
workflow status <workflow-name>
```
{% include copy.html %}

Example output:

```
[*] Workflow: migration-abc123
  Phase: Running
  Started: 2024-01-15T10:30:00Z

📋 Workflow Steps
├── ✓ Initialize (Succeeded)
├── ✓ Create Snapshot (Succeeded)
├── ✓ Register Snapshot (Succeeded)
├── ▶ Migrate Metadata (Running)
├── ○ Restore Documents (Pending)
└── ○ Cleanup (Pending)
```

### Step 4: Wait for completion

The workflow runs asynchronously. Monitor until all steps succeed:

```bash
watch -n 10 workflow status <workflow-name>
```
{% include copy.html %}

Or submit with the `--wait` flag to block until completion:

```bash
workflow submit --wait --timeout 3600
```
{% include copy.html %}

## Advanced scenarios

### Multiple index groups

Migrate different sets of indices with different configurations:

```yaml
migrations:
  - sourceCluster: my-source
    targetCluster: my-target
    snapshotMigrations:
      # Critical data: full migration
      - indices: ["orders-*", "customers-*"]
        metadataMigration:
          enabled: true
        documentBackfill:
          enabled: true
      
      # Historical logs: documents only
      - indices: ["logs-2023-*"]
        metadataMigration:
          enabled: false
        documentBackfill:
          enabled: true
      
      # Templates only: no documents
      - indices: ["templates-*"]
        metadataMigration:
          enabled: true
        documentBackfill:
          enabled: false
```

### Parallel migrations

Migrate from multiple sources simultaneously:

```yaml
sourceClusters:
  source-1:
    endpoint: https://source1:9200
  source-2:
    endpoint: https://source2:9200

targetClusters:
  target:
    endpoint: https://target:9200

migrations:
  - sourceCluster: source-1
    targetCluster: target
    snapshotMigrations:
      - indices: ["source1-*"]
  
  - sourceCluster: source-2
    targetCluster: target
    snapshotMigrations:
      - indices: ["source2-*"]
```

The workflow engine executes these migrations in parallel where possible.

### Using existing snapshots

If you have existing snapshots, configure the snapshot repository:

```yaml
sourceClusters:
  my-source:
    endpoint: https://source:9200
    snapshotRepo:
      s3RepoPathUri: s3://existing-bucket/existing-snapshots
      aws_region: us-west-2
```

## Monitoring and troubleshooting

### Check workflow status

View all running workflows:

```bash
workflow status
```
{% include copy.html %}

View specific workflow details:

```bash
workflow status <workflow-name>
```
{% include copy.html %}

### View workflow logs

Check logs for a specific workflow:

```bash
kubectl logs -n migration-assistant -l workflows.argoproj.io/workflow=<workflow-name>
```
{% include copy.html %}

### Common issues

#### Workflow stuck in Pending

**Problem:** Workflow shows all steps as Pending.

**Solutions:**
- Check if workflow templates are deployed: `kubectl get workflowtemplates -n migration-assistant`
- Verify Argo Workflows is running: `kubectl get pods -n argo`
- Check resource availability: `kubectl describe pod -n migration-assistant`

#### Snapshot creation failed

**Problem:** Snapshot creation step fails.

**Solutions:**
- Verify S3 bucket permissions
- Check source cluster has snapshot repository configured
- Ensure indices exist and are accessible
- Review snapshot step logs for specific errors

#### Document loading slow or stalled

**Problem:** Document restore is taking too long or appears stuck.

**Solutions:**
- Check target cluster health and capacity
- Monitor shard allocation: `curl http://target:9200/_cat/shards?v`
- Verify network connectivity between clusters
- Check if target cluster has sufficient disk space

#### Metadata migration errors

**Problem:** Metadata migration fails with compatibility errors.

**Solutions:**
- Review breaking changes between source and target versions
- Check for unsupported field types
- See [Migrate metadata]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/) for handling breaking changes

### Stopping a workflow

If you need to stop a running workflow:

```bash
workflow stop <workflow-name>
```
{% include copy.html %}

This gracefully terminates the workflow and cleans up resources.

## Performance considerations

### Parallelism

The workflow engine supports parallel execution of independent tasks. Configure parallelism based on your cluster capacity:

- Default: Up to 100 concurrent pods
- Limited by Kubernetes cluster resources
- Balanced against source and target cluster capacity

### Resource limits

Workflow pods use default resource limits. For large migrations, you may need to adjust:

- CPU and memory requests/limits
- Storage for temporary data
- Network bandwidth

### Migration duration

Factors affecting migration time:

- Total data volume
- Number of indices and shards
- Source cluster load
- Target cluster capacity
- Network bandwidth between clusters
- S3 snapshot transfer speeds

## Verification

After the workflow completes:

1. **Check workflow status**:

   ```bash
   workflow status <workflow-name>
   ```
   {% include copy.html %}

2. **Verify document counts**:

   ```bash
   # Source cluster
   curl http://source:9200/_cat/indices?v
   
   # Target cluster
   curl http://target:9200/_cat/indices?v
   ```
   {% include copy.html %}

3. **Compare index settings**:

   ```bash
   # Check target cluster indices
   curl http://target:9200/<index>/_settings
   ```
   {% include copy.html %}

4. **Test queries** on the target cluster to ensure data is accessible

## Next steps

After completing the backfill workflow:

1. Verify all data migrated successfully
2. Test application connectivity to the target cluster

## Related documentation

- [Workflow CLI overview]({{site.url}}{{site.baseurl}}/migration-assistant/migration-console/workflow-cli-overview/) - Learn about the workflow approach
- [Getting started with Workflow CLI]({{site.url}}{{site.baseurl}}/migration-assistant/migration-console/workflow-cli-getting-started/) - Step-by-step tutorial
- [Traditional backfill]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill/) - ECS-based approach

## Feedback

This is an experimental feature. Provide feedback through the [opensearch-migrations repository](https://github.com/opensearch-project/opensearch-migrations).

{% include migration-phase-navigation.html %}
