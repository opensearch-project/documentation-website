---
layout: default
title: Backfill
nav_order: 6
parent: Migration workflows
permalink: /migration-assistant/migration-phases/backfill/
redirect_from:
  - /migration-phases/backfill/
  - /migration-assistant/migration-phases/create-snapshot/
  - /migration-phases/create-snapshot/
---

# Backfill

Backfill is the document-migration phase of a snapshot workflow. Migration Assistant creates or reuses a source snapshot, migrates metadata, and then uses Reindex-from-Snapshot (RFS) to load documents into the target.

The key idea is simple: RFS reads shard data from the snapshot, not from the live source cluster API. That is why it scales well and keeps steady pressure off the source cluster during the document phase.

## What happens during backfill

A typical snapshot migration includes:

1. Create a snapshot, or reference an existing snapshot
2. Evaluate metadata
3. Migrate metadata
4. Run document backfill with RFS
5. Validate the target before cutover or replay

You do not run these as unrelated commands. You define them in one workflow and let the platform orchestrate them.

## Start with a pilot

Backfill is safest when you run a small pilot first.

Use a limited snapshot scope or a small metadata and RFS allowlist so you can prove:

- snapshot creation works
- source S3 access works
- mappings migrate cleanly
- target indexing capacity is sufficient
- document-level failures are understood before you scale up

## Configure the workflow

Always start from the version-matched sample:

```bash
workflow configure sample --load
workflow configure edit
```
{% include copy.html %}

Then configure the snapshot migration section for your source, target, and snapshot repository.

## Understand the three different allowlists

This is one of the easiest places to make mistakes.

### Snapshot allowlist

The snapshot creation allowlist is evaluated by the source cluster when the snapshot is created. It uses the source cluster's native multi-index expression syntax such as:

- `logs-*`
- `orders-2024-*`
- `-*-archive`

This is **not** regex syntax.

### Metadata allowlist

The metadata allowlist is evaluated after the snapshot exists. It supports exact names and `regex:` patterns such as:

- `orders`
- `regex:logs-.*`

### RFS allowlist

The RFS allowlist is also evaluated after the snapshot exists and uses the same exact-name or `regex:` pattern format.

If an index is excluded at the snapshot layer, downstream stages cannot bring it back.
{: .warning }

## Using an existing snapshot

If you already created the snapshot outside the workflow, configure:

```text
snapshotConfig.snapshotNameConfig.externallyManagedSnapshotName
```

Use `workflow configure sample --load` to confirm the exact structure for your installed version.

## Run and monitor the workflow

```bash
workflow submit
workflow manage
```
{% include copy.html %}

Useful supporting commands:

```bash
workflow status
workflow output --follow
```
{% include copy.html %}

## What to approve

If approvals are enabled, expect manual checkpoints around metadata and backfill transitions. Approve only after you have checked the logs or validation output you care about.

```bash
workflow approve <STEP_NAME>
```
{% include copy.html %}

## Performance model

RFS scales mainly with:

- total data volume
- number of primary shards
- available Kubernetes resources
- target cluster ingest capacity

Because RFS reads from snapshot storage, increasing worker count does not add live read load to the source cluster. It mostly changes how hard you drive the target cluster.

## Common tuning and recovery options

Useful RFS settings include:

- `podReplicas` for parallelism
- `maxShardSizeBytes` for ephemeral-storage sizing
- `allowedDocExceptionTypes` for document-level errors you intentionally want to treat as successful

`allowedDocExceptionTypes` is powerful and should be used carefully. Matching errors are accepted as successes, not just ignored for retry purposes.

## Validate after backfill

After the workflow completes, compare the source and target:

```bash
console clusters curl source -- "/_cat/indices?v"
console clusters curl target -- "/_cat/indices?v"
console clusters curl target -- "/<index>/_count"
```
{% include copy.html %}

If you are doing zero-downtime migration, backfill validation happens before replay becomes the final synchronization step.

{% include migration-phase-navigation.html %}
