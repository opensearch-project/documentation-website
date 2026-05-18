---
layout: default
title: Is Migration Assistant right for you?
nav_order: 10
permalink: /migration-assistant/is-migration-assistant-right-for-you/
redirect_from:
  - /migration-assistant/overview/is-migration-assistant-right-for-you/
  - /migration-assistant/migration-paths/
---

# Is Migration Assistant right for you
Whether Migration Assistant is right for you depends on your migration path, downtime target, and how much platform work you want to own yourself.

Migration Assistant is designed for users who want a **workflow-driven migration platform** rather than a one-off upgrade procedure. It is especially useful when:

- you need to migrate across one or more major versions in a single step
- you want to validate the target before cutover
- you need a repeatable backfill process with retries and checkpointing
- or you want a zero-downtime option through Capture and Replay

Compared with traditional upgrade methods, Migration Assistant reduces the amount of manual coordination required between snapshot creation, metadata changes, backfill, validation, and cutover.

## Migration concepts you'll see in these docs

If you're new to Migration Assistant, you'll see a few terms repeatedly. The shortest definitions are below; the [migration phases overview]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/) walks through how they fit together.

- **Backfill** — Bulk migration of historical documents from a snapshot. Used for both planned-downtime and zero-downtime migrations.
- **Reindex-from-Snapshot (RFS)** — The mechanism Migration Assistant uses for backfill. RFS reads shard data from a snapshot in object storage instead of querying the live source cluster, which is why it scales well and keeps load off the source.
- **Capture and Replay** — Zero-downtime path that captures live writes from the source through a proxy, buffers them in Kafka, and replays them against the target after backfill catches up.
- **Migration phases** — The ordered steps the workflow runs: assess, deploy, migrate metadata, backfill, optional Capture and Replay, validate, and switch traffic to the target.

## Supported migration paths

The following matrix shows which source versions can be directly migrated to which OpenSearch target versions:

| Source version | OpenSearch 1.x | OpenSearch 2.x | OpenSearch 3.x |
|:---------------|:--------------:|:--------------:|:--------------:|
| Elasticsearch 1.x–2.x | ✓* | ✓* | ✓* |
| Elasticsearch 5.x–7.x | ✓ | ✓ | ✓ |
| Elasticsearch 8.x | | ✓ | ✓ |
| OpenSearch 1.x–2.x | | ✓ | ✓ |
| Apache Solr 6.x–9.x | | | ✓* |

\* Backfill only — Capture and Replay is not supported for these source versions.
{: .note }

### Version-specific notes

**Elasticsearch 6.x**: Requires handling for multiple mapping types per index. Configure `multiTypeBehavior` in your migration config. Run `workflow configure edit` to see available options.

**Elasticsearch 8.x**: Supported with compatibility handling for post-fork features. Some 8.x-specific features may not have OpenSearch equivalents. Test metadata migration first.

**Apache Solr 6.x–9.x**: Only the backfill migration approach is supported (no Capture and Replay). Migration Assistant auto-detects SolrCloud compared to standalone deployments. See [Solr migration]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/) for details.

## Supported platforms

| Platform | Source | Target |
|:---------|:-------|:-------|
| Self-managed (on-premises) | ✓ | ✓ |
| Amazon OpenSearch Service | ✓ | ✓ |
| [Amazon OpenSearch Serverless]({{site.url}}{{site.baseurl}}/migration-assistant/amazon-opensearch-serverless/) |  | ✓ |
| Third-party cloud providers | ✓ | ✓ |
| AWS EC2 | ✓ | ✓ |
| Apache Solr (SolrCloud/Standalone) | ✓ |  |

## Deployment options

Migration Assistant runs on Kubernetes and can be deployed to:

- **Amazon EKS** for the recommended AWS production path with bootstrap automation, pod identity, image mirroring, snapshot helpers, and CloudWatch integration
- **Any Kubernetes cluster** when you already operate your own Kubernetes platform or you are evaluating locally

The migration engine is the same in both cases. The difference is how much of the surrounding platform is prepared for you.

## Component support

| Component | Supported | Recommendation |
|:----------|:----------|:---------------|
| Documents | ✓ | Migrate using RFS (backfill) or Capture and Replay |
| Index settings | ✓ | Migrated automatically |
| Index mappings | ✓ | Migrated automatically |
| Index templates | ✓ | Migrated automatically |
| Component templates | ✓ | Migrated automatically |
| Aliases | ✓ | Migrated automatically |
| Data streams |  | Manually recreate on target |
| ISM/ILM policies |  | Manually recreate on target |
| Security configuration |  | Configure separately on target |
| Kibana/Dashboards objects |  | Export/import using Dashboards UI |
| Ingest pipelines |  | Manually recreate |
| Cluster settings |  | Configure separately |

## Checklist

Use this checklist to determine whether Migration Assistant is the right fit:

- Are you migrating across one or more major versions in a single step?
- Do you need to maintain high service availability with minimal or zero downtime?
- Do you need to validate a new OpenSearch cluster before switching over?
- Are you looking for tooling to migrate index settings and other metadata?
- Do you need a high-performance backfill solution with pause, resume, and checkpoint recovery?
- Are you migrating from Apache Solr and need a snapshot-based backfill solution?

Use Amazon EKS if you also want the deployment tooling to prepare the AWS environment around the migration.

If you answered "yes" to most of these questions, Migration Assistant is likely the right solution.

## Assumptions and limitations

Migration Assistant has the following assumptions and limitations.

### Reindex-from-Snapshot

For Elasticsearch and OpenSearch sources:

- The source cluster must have the [Amazon S3 repository plugin](https://opensearch.org/docs/latest/tuning-your-cluster/availability-and-recovery/snapshots/snapshot-restore/#amazon-s3) installed (for S3-based snapshots).
- Shards of up to **80 GiB** are supported by default. This can be configured to support larger shards up to the limits of your EBS storage, except in AWS GovCloud regions which are limited to 80 GiB.
- Snapshots of indexes using zstd or zstd_no_dict codecs (OpenSearch 2.9+) are not supported — reindex with `default` or `best_compression` first.

For Apache Solr sources:

- The source cluster must have the [Solr S3 backup plugin](https://solr.apache.org/guide/solr/latest/deployment-guide/backup-restore.html#s3backuprepository) installed and a backup repository configured in `solr.xml`. Solr writes the backup directly to S3, and Migration Assistant reads it from there. See the [Solr backfill guide]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/solr-backfill-guide/) for the full prerequisite list.

### Capture and Replay

- Automatically generated document IDs are **not preserved** during replay — clients must explicitly provide document IDs to maintain consistency between source and target
- Live capture is recommended only for workloads with **< 4 TB/day** of incoming traffic

### Networking

- The Kubernetes cluster must have network connectivity to both source and target clusters
- For EKS deployments, source and target cluster security groups must allow inbound traffic from the EKS cluster security group

## Pre-migration checklist

- [ ] Verify source and target versions are in the compatibility matrix above
- [ ] Identify unsupported components and plan manual migration
- [ ] Plan index scope using index allowlists
- [ ] Test with a subset of 1–2 representative indexes first
- [ ] Check for multi-type indexes (ES 5.x and 6.x)
