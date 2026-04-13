---
layout: default
title: Backfill
nav_order: 6
parent: Migration phases
permalink: /migration-assistant/migration-phases/backfill/
redirect_from:
  - /migration-phases/backfill/
  - /migration-assistant/migration-phases/create-snapshot/
  - /migration-phases/create-snapshot/
---

# Backfill

After [migrating metadata]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/), use the backfill workflow to migrate documents from your source cluster to the target using snapshot-based reindexing (RFS).

## The backfill process

1. **Snapshot** — Create a point-in-time snapshot of source indexes
2. **Register** — Make the snapshot accessible to the migration tooling
3. **Metadata** — Transfer index mappings, settings, and templates to the target
4. **RFS Load** — Reindex documents from the snapshot to the target cluster
5. **Cleanup** — Remove temporary coordination state

Each phase completes before the next begins. Approval gates between phases let you verify progress before continuing.

## Running a backfill

### Configure and submit

Configure your migration using the Workflow CLI:

```bash
workflow configure sample --load
workflow configure edit
workflow submit
```
{% include copy.html %}

### Monitor progress

```bash
# Interactive TUI (recommended)
workflow manage

# Check status
workflow status

# Stream logs
workflow output --follow
```
{% include copy.html %}

### Handle approvals

When a step shows `⟳`, approve it to continue:

```bash
workflow approve <STEP_NAME>
```
{% include copy.html %}

## Index allowlist syntax

Allowlist entries are matched as exact literal strings by default. Use the `regex:` prefix for pattern matching:

| Entry | Matches |
|:------|:--------|
| `my-index` | Only "my-index" (exact match) |
| `regex:.*` | All indexes (regex wildcard) |
| `regex:logs-.*` | "logs-app", "logs-web", etc. |

Using `*` does not work as a wildcard. Use `regex:.*` instead.
{: .warning }

## Using existing snapshots

If you already have a snapshot, reference it in your configuration instead of creating a new one by setting `externallyManagedSnapshot`. See `workflow configure sample` for the exact field path.

## Verification

After the workflow completes:

```bash
# Compare document counts
console clusters curl source -- "/_cat/indices?v"
console clusters curl target -- "/_cat/indices?v"

# Check specific indexes
console clusters curl target -- "/<index>/_count"
```
{% include copy.html %}

## Parallelism and performance

RFS runs multiple workers in parallel, each reading shard data directly from the snapshot in S3. Because workers read from object storage — not the source cluster — scaling up workers has **zero impact on the source cluster**. The only constraint is the target cluster's indexing capacity and available Kubernetes resources.

| Factor | Impact |
|:-------|:-------|
| Total data volume | Primary factor in migration duration |
| Number of primary shards | Determines maximum parallelism (1 worker per shard) |
| Target cluster capacity | Indexing throughput is usually the bottleneck |
| Worker count | More workers = more parallel shards processed |

Start with defaults and increase if the target cluster has headroom.

## Error recovery

RFS tracks progress at the shard level. If a backfill fails partway through:

- Completed shards are recorded in the coordination index
- Resubmitting resumes from the last checkpoint
- Already-migrated documents are not re-processed

| Symptom | Likely cause | Resolution |
|:--------|:-------------|:-----------|
| Snapshot creation fails | S3 permissions, missing IAM role | Check `s3RoleArn` for AWS managed sources |
| Metadata migration fails | Version incompatibility | Review [Migration paths]({{site.url}}{{site.baseurl}}/migration-assistant/migration-paths/) |
| RFS stalls | Target cluster overloaded | Reduce parallelism, check cluster health |
| Authentication errors | Invalid credentials | Verify Kubernetes secrets exist and contain correct values |

{% include migration-phase-navigation.html %}
