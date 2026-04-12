---
layout: default
title: Getting started
nav_order: 1
parent: Workflow CLI
permalink: /migration-assistant/workflow-cli/getting-started/
---

# Getting started with the Workflow CLI

This guide walks you through configuring and running your first OpenSearch migration using the Workflow CLI.

## Prerequisites

- Migration Console accessible on your Kubernetes cluster (see [Deploy]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/))
- Source and target clusters accessible from the cluster
- S3 bucket for snapshots (or persistent volume)

## Step 1: Access the Migration Console

```bash
# For EKS deployments
aws eks update-kubeconfig --region <REGION> --name migration-eks-cluster-<STAGE>-<REGION>

# Connect to the Migration Console pod
kubectl exec -it migration-console-0 -n ma -- /bin/bash
```
{% include copy.html %}

## Step 2: Check your version

```bash
console --version
```
{% include copy.html %}

## Step 3: Load the sample configuration

Use the sample configuration as your starting point. This ensures you're working with the correct schema for your installed version:

```bash
workflow configure sample --load
```
{% include copy.html %}

## Step 4: Edit the configuration

```bash
workflow configure edit
```
{% include copy.html %}

Customize the loaded sample for your environment:

- Set source and target cluster endpoints
- Configure authentication
- Set snapshot repository location
- Define which indexes to migrate

View your changes:

```bash
workflow configure view
```
{% include copy.html %}

## Step 5: Create Kubernetes secrets

Cluster credentials are stored as Kubernetes secrets:

```bash
# Source cluster credentials
kubectl create secret generic source-credentials \
  --from-literal=username=<USERNAME> \
  --from-literal=password=<PASSWORD> \
  -n ma
```
{% include copy.html %}

```bash
# Target cluster credentials
kubectl create secret generic target-credentials \
  --from-literal=username=<USERNAME> \
  --from-literal=password=<PASSWORD> \
  -n ma
```
{% include copy.html %}

Reference these secret names in your configuration under `authConfig.basic.secretName`.

### Authentication options

| Method | Use case |
|:-------|:---------|
| `basic` | Username/password via Kubernetes secret |
| `sigv4` | AWS SigV4 for Amazon OpenSearch Service (`service: es`) or Serverless (`service: aoss`) |
| `mtls` | Mutual TLS with client certificates |

## Step 6: Submit the workflow

```bash
workflow submit
```
{% include copy.html %}

This prints the workflow name and returns immediately — the workflow runs asynchronously.

## Step 7: Monitor progress

### Using the interactive TUI (recommended)

```bash
workflow manage
```
{% include copy.html %}

The TUI lets you watch progress, view logs, and approve steps all in one interface.

### Using status commands

```bash
workflow status
```
{% include copy.html %}

## Step 8: Handle approvals

When a step shows `⟳`, it's waiting for your approval to proceed:

```bash
# Approve via TUI
workflow manage

# Or approve directly
workflow approve <STEP_NAME>
```
{% include copy.html %}

## Step 9: Verify the migration

After the workflow completes, verify the migration:

```bash
# Check document counts on source
console clusters curl source -- "/_cat/indices?v"

# Check document counts on target
console clusters curl target -- "/_cat/indices?v"
```
{% include copy.html %}

## Step 10: Handle failures

If a step shows `✗` (Failed):

1. Check logs:
   ```bash
   workflow output
   ```

2. Fix the configuration if needed:
   ```bash
   workflow configure edit
   ```

3. Resubmit the workflow:
   ```bash
   workflow submit
   ```

RFS checkpoints allow document backfill to resume from where it left off.

## Quick reference

```bash
console --version                 # Check installed version
workflow configure sample         # View configuration schema
workflow configure sample --load  # Load sample as starting point
workflow configure edit           # Edit configuration
workflow configure view           # Show configuration
workflow submit                   # Submit workflow (async)
workflow manage                   # Interactive TUI
workflow status                   # Show workflow status
workflow approve <STEP>           # Approve a blocked step
workflow stop                     # Stop a running workflow
workflow output                   # View workflow logs
```

## Example configuration

The following is a minimal working configuration for migrating from Elasticsearch 7.10 to OpenSearch, tested end-to-end:

```json
{
  "skipApprovals": true,
  "sourceClusters": {
    "source": {
      "endpoint": "http://<SOURCE_HOST>:9200",
      "allowInsecure": true,
      "version": "ES 7.10",
      "snapshotRepos": {
        "migration-repo": {
          "awsRegion": "us-east-2",
          "s3RepoPathUri": "s3://<BUCKET_NAME>/snapshots"
        }
      }
    }
  },
  "targetClusters": {
    "target": {
      "endpoint": "http://<TARGET_HOST>:9200",
      "allowInsecure": true
    }
  },
  "migrationConfigs": [
    {
      "fromSource": "source",
      "toTarget": "target",
      "snapshotExtractAndLoadConfigs": [
        {
          "createSnapshotConfig": {},
          "snapshotConfig": {
            "snapshotNameConfig": {
              "snapshotNamePrefix": "migration"
            },
            "repoName": "migration-repo"
          },
          "migrations": [
            {
              "metadataMigrationConfig": {},
              "documentBackfillConfig": {
                "podReplicas": 2
              }
            }
          ]
        }
      ]
    }
  ]
}
```
{% include copy.html %}

`createSnapshotConfig` is required even if empty — omitting it causes a validation error. The `migrations` array is also required inside `snapshotExtractAndLoadConfigs`.
{: .warning }
