---
layout: default
title: Workflow CLI getting started
parent: Migration console
grand_parent: Migration Assistant for OpenSearch
nav_order: 11
permalink: /migration-assistant/migration-console/workflow-cli-getting-started/
---

# Getting started with Workflow CLI

{: .warning }
> **Experimental Feature**: The Workflow CLI is an experimental feature for Kubernetes-based deployments (3.x release). For the stable ECS-based approach (2.x), see [Migration console commands]({{site.url}}{{site.baseurl}}/migration-assistant/migration-console/migration-console-commands-references/).

This guide walks you through your first OpenSearch migration using the Workflow CLI. You'll learn how to configure, submit, and monitor a migration workflow.

## Prerequisites

Before starting, ensure:

- You have access to the migration console on your Kubernetes cluster
- Argo Workflows is installed and running
- Source and target clusters are accessible
- You've reviewed the [Workflow CLI overview]({{site.url}}{{site.baseurl}}/migration-assistant/migration-console/workflow-cli-overview/)

## Step 1: Access the migration console

Connect to the migration console pod:

```bash
kubectl exec -it <migration-console-pod> -n migration-assistant -- bash
```
{% include copy.html %}

Verify the `workflow` command is available:

```bash
workflow --help
```
{% include copy.html %}

## Step 2: View a sample configuration

Before creating your configuration, review a sample:

```bash
workflow configure sample
```
{% include copy.html %}

This displays a template showing all available options:

```yaml
sourceClusters:
  <CLUSTER_NAME>:
    endpoint: https://your-source-cluster:9200
    version: "7.10.2"
    authConfig:
      basic:
        username: admin
        password: password

targetClusters:
  <CLUSTER_NAME>:
    endpoint: https://your-target-cluster:9200
    version: "2.11.0"
    authConfig:
      basic:
        username: admin
        password: password

migrations:
  - sourceCluster: <SOURCE_NAME>
    targetCluster: <TARGET_NAME>
    snapshotMigrations:
      - indices: ["index-pattern-*"]
        metadataMigration:
          enabled: true
        documentBackfill:
          enabled: true
```

## Step 3: Load the sample as a starting point

Load the sample configuration:

```bash
workflow configure sample --load
```
{% include copy.html %}

You should see:

```
Sample configuration loaded successfully

Use 'workflow configure view' to see it
Use 'workflow configure edit' to modify it
```

## Step 4: Edit the configuration

Customize the configuration for your clusters:

```bash
workflow configure edit
```
{% include copy.html %}

This opens your default editor. Update these sections:

**Source cluster:**

```yaml
sourceClusters:
  my-es-source:
    endpoint: https://source.example.com:9200
    version: "7.10.2"
    authConfig:
      basic:
        username: admin
        password: your-password
```

**Target cluster:**

```yaml
targetClusters:
  my-os-target:
    endpoint: https://target.example.com:9200
    version: "2.11.0"
    authConfig:
      basic:
        username: admin
        password: your-password
```

**Migration configuration:**

```yaml
migrations:
  - sourceCluster: my-es-source
    targetCluster: my-os-target
    snapshotMigrations:
      - indices: ["logs-*", "metrics-*"]
        metadataMigration:
          enabled: true
        documentBackfill:
          enabled: true
```

Save and exit (in vi: `Esc`, then `:wq`, then `Enter`).

## Step 5: Verify your configuration

Check that your configuration was saved:

```bash
workflow configure view
```
{% include copy.html %}

Review the output to ensure:
- Cluster endpoints are correct
- Credentials are accurate
- Index patterns match what you want to migrate
- Cluster names are referenced correctly

## Step 6: Submit the workflow

Submit your migration workflow:

```bash
workflow submit
```
{% include copy.html %}

You'll see output like:

```
Initializing workflow from session: default
Workflow initialized with prefix: a1b2c3d4-e5f6-7890-abcd-ef1234567890

Submitting workflow to namespace: migration-assistant

Workflow submitted successfully
  Name: migration-xwz9r
  Prefix: a1b2c3d4-e5f6-7890-abcd-ef1234567890
  Namespace: migration-assistant
```

**Important:** Note the workflow name (`migration-xwz9r` in this example) for monitoring.

## Step 7: Monitor workflow progress

Check the status of your workflow:

```bash
workflow status
```
{% include copy.html %}

For detailed status of your specific workflow:

```bash
workflow status migration-xwz9r
```
{% include copy.html %}

You'll see a tree view showing progress:

```
[*] Workflow: migration-xwz9r
  Phase: Running
  Started: 2024-01-15T10:30:00Z

📋 Workflow Steps
├── ✓ Initialize (Succeeded)
├── ▶ Create Snapshot (Running)
│   ├── ✓ Validate Indices (Succeeded)
│   └── ▶ Snapshot Creation (Running)
├── ○ Register Snapshot (Pending)
├── ○ Migrate Metadata (Pending)
└── ○ Restore Documents (Pending)
```

**Status symbols:**
- `✓` - Step completed successfully
- `▶` - Step currently running
- `○` - Step pending (waiting to run)
- `✗` - Step failed
- `⟳` - Step waiting for approval

## Step 8: Wait for completion

The workflow runs asynchronously. You can monitor it in several ways:

**Option A:** Check manually

```bash
workflow status migration-xwz9r
```
{% include copy.html %}

**Option B:** Auto-refresh with watch

```bash
watch -n 10 workflow status migration-xwz9r
```
{% include copy.html %}

(Refreshes every 10 seconds. Press Ctrl+C to exit.)

**Option C:** Submit with wait flag

```bash
workflow submit --wait --timeout 3600
```
{% include copy.html %}

## Step 9: Handle approvals (if required)

If the workflow requires manual approval, you'll see:

```
├── ⟳ Manual Approval Gate - WAITING FOR APPROVAL
```

Approve to continue:

```bash
workflow approve migration-xwz9r
```
{% include copy.html %}

Then check status again:

```bash
workflow status migration-xwz9r
```
{% include copy.html %}

## Step 10: Verify success

When complete, you'll see:

```
[+] Workflow: migration-xwz9r
  Phase: Succeeded
  Started: 2024-01-15T10:30:00Z
  Finished: 2024-01-15T11:45:00Z

📋 Workflow Steps
├── ✓ Initialize (Succeeded)
├── ✓ Create Snapshot (Succeeded)
├── ✓ Register Snapshot (Succeeded)
├── ✓ Migrate Metadata (Succeeded)
└── ✓ Restore Documents (Succeeded)
```

Verify data in your target cluster to confirm the migration succeeded.

## Common scenarios

### Migrate specific indices only

```yaml
migrations:
  - sourceCluster: my-source
    targetCluster: my-target
    snapshotMigrations:
      - indices: ["user-data-*", "application-logs-2024-*"]
        metadataMigration:
          enabled: true
        documentBackfill:
          enabled: true
```

### Metadata only (no documents)

```yaml
migrations:
  - sourceCluster: my-source
    targetCluster: my-target
    snapshotMigrations:
      - indices: ["*"]
        metadataMigration:
          enabled: true
        documentBackfill:
          enabled: false
```

### Multiple index groups

```yaml
migrations:
  - sourceCluster: my-source
    targetCluster: my-target
    snapshotMigrations:
      # Critical data with metadata
      - indices: ["orders-*", "customers-*"]
        metadataMigration:
          enabled: true
        documentBackfill:
          enabled: true
      
      # Logs without metadata
      - indices: ["logs-*"]
        metadataMigration:
          enabled: false
        documentBackfill:
          enabled: true
```

## Troubleshooting

### Configuration won't save

**Problem:** Editor closes but configuration isn't saved.

**Solution:**
- Save the file before exiting (vi: `Esc` → `:wq` → `Enter`)
- Check for YAML syntax errors

### Workflow fails to submit

**Problem:** Error: "No workflow configuration found"

**Solution:**

```bash
# Check if configuration exists
workflow configure view

# If empty, create one
workflow configure edit
```
{% include copy.html %}

### Workflow stuck in Pending

**Problem:** All steps show "Pending"

**Solution:**

1. Check workflow templates are deployed:

   ```bash
   kubectl get workflowtemplates -n migration-assistant
   ```
   {% include copy.html %}

2. Check pod status:

   ```bash
   kubectl get pods -n migration-assistant
   ```
   {% include copy.html %}

3. View workflow logs:

   ```bash
   kubectl logs -n migration-assistant -l workflows.argoproj.io/workflow=migration-xwz9r
   ```
   {% include copy.html %}

## Quick reference

```bash
# Configuration commands
workflow configure sample --load    # Start with sample
workflow configure edit            # Edit configuration
workflow configure view            # Show configuration
workflow configure clear           # Clear configuration

# Execution commands
workflow submit                    # Submit workflow
workflow submit --wait             # Submit and wait for completion
workflow status                    # Show all workflows
workflow status <name>             # Show specific workflow

# Management commands
workflow approve <name>            # Approve manual steps
workflow stop <name>               # Stop a running workflow
```

## Next steps

Now that you've completed your first migration:

1. Verify data in your target cluster
2. Learn about [Backfill workflows]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/backfill-workflow/) for more details
3. Review the [Workflow CLI overview]({{site.url}}{{site.baseurl}}/migration-assistant/migration-console/workflow-cli-overview/) for architectural details
4. Explore more complex scenarios and configurations

## Getting help

If you encounter issues:

1. Check command help:

   ```bash
   workflow --help
   workflow configure --help
   workflow submit --help
   ```
   {% include copy.html %}

2. Enable verbose logging:

   ```bash
   workflow -vv status
   ```
   {% include copy.html %}

3. Check workflow logs:

   ```bash
   kubectl logs -n migration-assistant -l workflows.argoproj.io/workflow=<workflow-name>
   ```
   {% include copy.html %}

4. Provide feedback through the [opensearch-migrations repository](https://github.com/opensearch-project/opensearch-migrations)
