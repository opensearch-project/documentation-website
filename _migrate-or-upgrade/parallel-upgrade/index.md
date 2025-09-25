---
layout: default
title: Parallel upgrade
nav_order: 80
permalink: /migrate-or-upgrade/parallel-upgrade/
---

# Parallel (blue‑green) upgrade (forking model)

Standing up a new target cluster in parallel, copying older indexes, continuously syncing data, and switching client traffic is a robust way to upgrade OpenSearch with minimal downtime and a quick rollback path. This pattern is commonly called a **blue‑green** or **forking** upgrade.

This method is useful when you want a predictable cutover window, need to jump multiple versions, or plan to change cluster topology or security configuration during the upgrade.

## High‑level workflow

1. **Stand up** the target cluster and align settings, plugins, index templates, and security.
2. **Backfill** historical data to the target (snapshot/restore or remote reindex).
3. **Keep in sync** (CDC) using CCR, Migration Assistant live capture, or dual‑write.
4. **Validate** data, queries, dashboards, and permissions against the target.
5. **Cut over** client traffic to the target.
6. **Rollback** if needed by repointing traffic to the source.
7. **Decommission** the source after a steady‑state period, then clean up replication and remote settings.

## Step 1: Prepare the target cluster

Align the target cluster's configuration with the source:
- Node roles and sizing, index templates, analyzers, and mappings.
- Install any additional plugins.
- User/role mappings and tenants. Use `securityadmin.sh` to retrieve and copy all security configuration.

Verify that the target cluster is healthy before proceeding:

```json
GET "/_cluster/health?pretty"
```
{% include copy.html %}

A status of `green` indicates that all primary and replica shards are allocated.

## Step 2: Backfill the indexes

###  Snapshot and restore

You can use snapshot and restore method by pointing to the same snapshot repo, we recommend to register the snapshot repo on the new cluster as `readonly: true`. See [Snapshots]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/index/) for further details.

#### 1. Register a snapshot repository on the **source**

The following example registers an FS repository. Adjust the type and settings for your environment.

```json
PUT /_snapshot/os-fs-repo
{
  "type": "fs",
  "settings": {
    "location": "/path/to//backup",
    "compress": true
  }
}
```
{% include copy.html %}

#### 2. Create a point‑in‑time snapshot on the **source**

Include only the indexes you want to migrate. Use `wait_for_completion` for a blocking operation during backfill.

```json
PUT _snapshot/os-fs-repo/snap-001?wait_for_completion=true
{
  "indices": "test-a,test-b,test-c",
  "include_global_state": false
}
```
{% include copy.html %}

#### 3. Register the same repository on the **target** as `readonly` and restore

```json
PUT /_snapshot/os-fs-repo
{
  "type": "fs",
  "settings": {
    "location": "/path/to//backup",
    "compress": true,
    "readonly": true
  }
}
```
{% include copy.html %}

Restore the snapshot to the target. You can rename indexes during restore if desired.

```json
POST /_snapshot/os-fs-repo/snap-001/_restore
{
  "indices": "test-a,test-b,test-c",
  "include_global_state": false,
  "index_settings": { "index.number_of_replicas": 0 }
}
```
{% include copy.html %}

Wait for the restore to complete and the cluster to become green again.

### Remote reindex

You can also backfill using reindex method which is flexible and supports filtering and transform. In order to do this configure a **remote** source and reindex to the target. For full details see [Reindex from a remote cluster]({{site.url}}{{site.baseurl}}/im-plugin/reindex-data/#reindex-from-a-remote-cluster).

## Step 3: Keep the target in sync

Choose one of the following methods to keep the new cluster up to date.

### Cross‑cluster replication

You can use Cross-Cluster Replication to replicate any changes to the indexes from the source cluster. See [Cross-cluster replication]({{site.url}}{{site.baseurl}}/tuning-your-cluster/replication-plugin/index/) for further details.

For time‑based indexes, use an `auto-follow` pattern. See [Auto-follow for cross-cluster replication]({{site.url}}{{site.baseurl}}/tuning-your-cluster/replication-plugin/auto-follow/) for further details.


### Migration Assistant live capture

Use the **Migration Assistant** to backfill and capture ongoing writes, then perform guided cutover. See [Migration Assistant]({{site.url}}{{site.baseurl}}/migrate-or-upgrade/migration-assistant/) for prerequisites and steps.

### Dual‑write at ingestion

Configure your pipeline, for example, Data Prepper or Logstash, to write to **both** clusters for the overlap period. Ensure idempotent indexing (stable document IDs) to avoid duplicates.

## Step 4: Validate the target

Compare document counts and run representative searches and aggregations against the target. Validate dashboards, alerting monitors, transformations, and security permissions.

## Step 5: Cut over traffic

1. Place a temporary write block on the source during cutover:

```json
PUT "/logs-*/_settings?pretty"
{
  "index.blocks.write": true
}
```
{% include copy.html %}

2. If using CCR, stop replication on the target indexes:

See [Stop replication]({{site.url}}{{site.baseurl}}/tuning-your-cluster/replication-plugin/getting-started/#stop-replication) for further details.

3. Switch clients to the target cluster using DNS update, load balancer change, or application configuration.

## Step 6: Roll back if needed

If validation fails after cutover, repoint clients back to the source cluster. If you blocked writes on the source, remove the block:

Investigate discrepancies, then repeat validation and cutover when ready.

## Step 7: Decommission the source

After a steady‑state period on the target:

- Disable/clean up CCR auto-follow patterns and remote cluster aliases.
- Stop dual‑writes or Migration Assistant capture.
- Take a final snapshot of the source (optional), then decommission it.
- Update runbooks and monitoring to point at the target.

## Pros and cons

**Pros**
- Minimal to zero downtime.
- Clear, fast rollback by repointing traffic.
- Works even when jumping multiple versions or changing topology/plugins.

**Cons**
- Temporary extra infrastructure cost for the overlap.
- Operational complexity: double‑writes/CDC, permission parity, plugin parity.

## Related pages

- [Snapshot and restore]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore/)
- [Rolling upgrade]({{site.url}}{{site.baseurl}}/migrate-or-upgrade/rolling-upgrade/)
- [Migration Assistant]({{site.url}}{{site.baseurl}}/migrate-or-upgrade/migration-assistant/)
- [Cross-Cluster Replication]({{site.url}}{{site.baseurl}}/tuning-your-cluster/replication-plugin/index/)
