---
layout: default
title: Is Migration Assistant right for you?
nav_order: 10
permalink: /migration-assistant/is-migration-assistant-right-for-you/
redirect_from:
  - /migration-assistant/overview/is-migration-assistant-right-for-you/
  - /migration-assistant/migration-paths/
---

# Is Migration Assistant right for you?
Whether Migration Assistant is right for you depends on your migration path, downtime target, and how much platform work you want to own yourself.

Migration Assistant is designed for teams that want a **workflow-driven migration platform** rather than a single-use upgrade procedure. It is especially useful when:

- You need to migrate across one or more major versions in a single step.
- You want to validate the target before cutover.
- You need a repeatable backfill process with retries and progress tracking.
- You want a zero-downtime option through Capture and Replay.

Compared with traditional upgrade methods, Migration Assistant reduces the amount of manual coordination required between snapshot creation, metadata changes, backfill, validation, and cutover.

## Migration concepts

If you're new to Migration Assistant, you see a few terms repeatedly. The [migration phases overview]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/) explains how they fit together. The shortest definitions are:

- **Backfill** -- Bulk migration of historical documents from a snapshot. Used for both planned-downtime and zero-downtime migrations.
- **Reindex-from-Snapshot (RFS)** -- The mechanism Migration Assistant uses for backfill. RFS reads shard data from a snapshot in object storage instead of querying the live source cluster, which is why it scales well and keeps load off the source.
- **Capture and Replay** -- Zero-downtime path that captures live writes from the source through a proxy, buffers them in Kafka, and replays them against the target after backfill catches up.
- **Migration phases** -- The ordered steps the workflow runs: assess, deploy, migrate metadata, backfill, optional Capture and Replay, validate, and switch traffic to the target.

## Supported migration paths

The following matrix shows which source versions can be directly migrated to which OpenSearch target versions.

| Source version | OpenSearch 1.x | OpenSearch 2.x | OpenSearch 3.x |
|:---------------|:--------------:|:--------------:|:--------------:|
| Elasticsearch 1.x--2.x | Yes* | Yes* | Yes* |
| Elasticsearch 5.x--7.x | Yes | Yes | Yes |
| Elasticsearch 8.x | No | Yes | Yes |
| OpenSearch 1.x--2.x | No | Yes | Yes |
| Apache Solr 6.x--9.x | No | No | Yes* |

\* Backfill only---Capture and Replay is not supported for these source versions.

### Version-specific notes

**Elasticsearch 6.x**: Elasticsearch 6.x generally uses single-type indexes, but upgraded or legacy datasets may still contain mappings that need type-handling decisions. Run metadata evaluation first; set `multiTypeBehavior` only if the evaluation reports multi-type mapping issues.

**Elasticsearch 8.x**: Supported with compatibility support for post-fork features. Some 8.x-specific features may not have OpenSearch equivalents. Test metadata migration first.

**Apache Solr 6.x--9.x**: Only the backfill migration approach is supported (no Capture and Replay). Migration Assistant auto-detects whether the source is SolrCloud or standalone. For more information, see [Solr migration]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/).

## Supported platforms

The following table lists supported source and target platforms.

| Platform | Source | Target |
|:---------|:-------|:-------|
| Self-managed (on-premises) | Yes | Yes |
| Self-managed on a cloud provider (for example, AWS EC2 or GCP Compute Engine) | Yes | Yes |
| Amazon OpenSearch Service | Yes | Yes |
| [Amazon OpenSearch Serverless NextGen]({{site.url}}{{site.baseurl}}/migration-assistant/amazon-opensearch-serverless/) | No | Yes |
| Other managed OpenSearch or Elasticsearch services | Yes | Yes |
| Apache Solr (SolrCloud/Standalone) | Yes | No |

## Deployment options

Migration Assistant runs on Kubernetes and can be deployed to:

- **Amazon EKS** for the recommended AWS production path, with bootstrap automation, pod identity, image mirroring, snapshot helpers, and Amazon CloudWatch integration.
- **Google Kubernetes Engine (GKE)** for the recommended GCP production path, with a Terraform module for the cluster, VPC networking, Cloud Storage snapshots, and Workload Identity.
- **Any other Kubernetes cluster** when you self-manage your own platform (on any cloud) or you are evaluating locally.

The migration engine is the same in every case. The difference is how much of the surrounding platform is prepared for you.

## Component support

The following table lists the components that Migration Assistant can migrate automatically and those that require manual migration.

| Component | Supported | Recommendation |
|:----------|:----------|:---------------|
| Documents | Yes | Migrate using RFS (backfill) or Capture and Replay |
| Index settings | Yes | Migrated automatically |
| Index mappings | Yes | Migrated automatically |
| Index templates | Yes | Migrated automatically |
| Component templates | Yes | Migrated automatically |
| Aliases | Yes | Migrated automatically |
| Data streams | No | Manually recreate on target |
| ISM/ILM policies | No | Manually recreate on target |
| Security configuration | No | Configure separately on target |
| Kibana/Dashboards objects | No | Export/import using Dashboards UI |
| Ingest pipelines | No | Manually recreate |
| Cluster settings | No | Configure separately |

## Checklist

Use this checklist to determine whether Migration Assistant is the right fit:

- Are you migrating across one or more major versions in a single step?
- Do you need to maintain high service availability with minimal or zero downtime?
- Do you need to validate a new OpenSearch cluster before switching over?
- Are you looking for tooling to migrate index settings and other metadata?
- Do you need a high-performance backfill solution with pause, resume, and checkpoint recovery?
- Are you migrating from Apache Solr and need a snapshot-based backfill solution?

If you answered "yes" to most of these questions, Migration Assistant is likely the right solution.

If you also want the deployment tooling to prepare the cloud environment around the migration, use a managed-cloud path (Amazon EKS on AWS or GKE on GCP).

## Assumptions and limitations

Migration Assistant has the following assumptions and limitations.

### Reindex-from-Snapshot

For Elasticsearch and OpenSearch sources:

- The source cluster must have the snapshot-repository plugin for your object storage installed: [`repository-s3`](https://opensearch.org/docs/latest/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore/#amazon-s3) for Amazon S3, or `repository-gcs` for Google Cloud Storage. Elasticsearch 8.0 and later and OpenSearch bundle these; Elasticsearch 7.x and earlier require installing the plugin on every source node.
- Shards of up to **80 GiB** are supported by default. This can be configured to support larger shards up to the limits of your node storage. (On Amazon EKS, AWS GovCloud regions are limited to 80 GiB.)
- Snapshots of indexes using `zstd` or `zstd_no_dict` codecs (OpenSearch 2.9+) are not supported---reindex with `default` or `best_compression` first.

For Apache Solr sources:

- The source cluster must have the [Solr S3 backup plugin](https://solr.apache.org/guide/solr/latest/deployment-guide/backup-restore.html#s3backuprepository) installed and a backup repository configured in `solr.xml`. Solr writes the backup directly to S3, and Migration Assistant reads it from there. See the [Solr backfill guide]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/solr-backfill-guide/) for the full prerequisite list.
- The Solr backup repository must use Amazon S3 (`s3://`) or a local file path (`file://`). Google Cloud Storage (`gs://`) backups are not supported for Solr in this release, even when Migration Assistant runs on Google Kubernetes Engine (GKE). This limit applies only to Solr sources; Elasticsearch and OpenSearch sources support Google Cloud Storage snapshots.

### Capture and Replay

Capture and Replay has the following limitations:

- Automatically generated document IDs are **not preserved** during replay---clients must explicitly provide document IDs to maintain consistency between source and target.
- Live capture is recommended only for workloads with **< 4 TB/day** of incoming traffic.

### Networking

The following networking requirements apply:

- The Kubernetes cluster must have network connectivity to both source and target clusters.
- The source and target clusters must allow inbound traffic from the migration cluster. On Amazon EKS, this means the source and target security groups allow the EKS cluster security group; on GKE, it means firewall rules (or the private-networking legs) permit the migration cluster's ranges. For GKE private-networking options, see [Private networking on GKE]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/private-networking-on-gke/).

## Pre-migration checklist

Complete the following steps before starting a migration:

- Verify source and target versions are in the preceding compatibility matrix.
- Identify unsupported components and plan manual migration.
- Plan index scope using index allow lists.
- Test with a subset of 1--2 representative indexes first.
- Verify whether multi-type indexes exist (ES 5.x and 6.x).
