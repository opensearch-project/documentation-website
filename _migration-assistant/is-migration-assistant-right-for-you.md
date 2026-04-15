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

Whether Migration Assistant is right for you depends on your upgrade path, infrastructure complexity, and operational goals. This page helps you evaluate whether Migration Assistant fits your use case.

Migration Assistant addresses key limitations in traditional migration approaches. For example, if you're upgrading across multiple major versions — such as from Elasticsearch 6.8 to OpenSearch 2.19 — you can use Migration Assistant to complete the process in a single step. Other methods, like rolling upgrades or snapshot restoration, require upgrading through each major version and often reindexing at every stage.

## Supported migration paths

The following matrix shows which source versions can be directly migrated to which OpenSearch target versions:

| Source version | OpenSearch 1.x | OpenSearch 2.x | OpenSearch 3.x |
|:---------------|:--------------:|:--------------:|:--------------:|
| Elasticsearch 1.x–2.x | ✓* | ✓* | ✓* |
| Elasticsearch 5.x | ✓ | ✓ | ✓ |
| Elasticsearch 6.x | ✓ | ✓ | ✓ |
| Elasticsearch 7.x | ✓ | ✓ | ✓ |
| Elasticsearch 8.x | | ✓ | ✓ |
| OpenSearch 1.x | | ✓ | ✓ |
| OpenSearch 2.x | | ✓ | ✓ |
| Apache Solr 8.x | | | ✓* |

\* Backfill only — Capture and Replay is not supported for these source versions.
{: .note }

### Version-specific notes

**Elasticsearch 6.x**: Requires handling for multiple mapping types per index. Configure `multiTypeBehavior` in your migration config. Run `workflow configure edit` to see available options.

**Elasticsearch 8.x**: Supported with compatibility handling for post-fork features. Some 8.x-specific features may not have OpenSearch equivalents. Test metadata migration first.

**Apache Solr 8.x**: Uses a different migration architecture than Elasticsearch (backfill only). See [Solr migration]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/) for details.

## Supported platforms

| Platform | Source | Target |
|:---------|:-------|:-------|
| Self-managed (on-premises) | ✓ | ✓ |
| Amazon OpenSearch Service | ✓ | ✓ |
| Amazon OpenSearch Serverless | ✗ | ✓ |
| Third-party cloud providers (Elastic Cloud, etc.) | ✓ | ✓ |
| AWS EC2 | ✓ | ✓ |
| Apache Solr (SolrCloud/Standalone) | ✓ | ✗ |

## Deployment options

Migration Assistant runs on Kubernetes and can be deployed to:

- **Amazon EKS** (recommended for production) with CloudFormation and the bootstrap script
- **Any Kubernetes cluster** (minikube, kind, GKE, AKS, self-managed) using Helm charts

## Component support

| Component | Supported | Recommendation |
|:----------|:----------|:---------------|
| Documents | ✓ | Migrate using RFS (backfill) or Capture and Replay |
| Index settings | ✓ | Migrated automatically |
| Index mappings | ✓ | Migrated automatically |
| Index templates | ✓ | Migrated automatically |
| Component templates | ✓ | Migrated automatically |
| Aliases | ✓ | Migrated automatically |
| Data streams | ✗ | Manually recreate on target |
| ISM/ILM policies | ✗ | Manually recreate on target |
| Security configuration | ✗ | Configure separately on target |
| Kibana/Dashboards objects | ✗ | Export/import using Dashboards UI |
| Ingest pipelines | ✗ | Manually recreate |
| Cluster settings | ✗ | Configure separately |

## Checklist

Use this checklist to determine whether Migration Assistant is the right fit:

- Are you migrating across one or more major versions in a single step?
- Do you need to maintain high service availability with minimal or zero downtime?
- Do you need to validate a new OpenSearch cluster before switching over?
- Are you looking for tooling to migrate index settings and other metadata?
- Do you need a high-performance backfill solution with pause, resume, and checkpoint recovery?
- Are you migrating from Apache Solr and need query compatibility validation?

If you answered "yes" to most of these questions, Migration Assistant is likely the right solution.

## Assumptions and limitations

### Reindex-from-Snapshot (RFS)

- The `_source` field must be enabled on all indexes to be migrated
- The source cluster must have the Amazon S3 plugin installed (for S3-based snapshots)
- Shards of up to **80 GiB** are supported by default
- Snapshots of indexes using zstd or zstd_no_dict codecs (OpenSearch 2.9+) are not supported — reindex with `default` or `best_compression` first

### Capture and Replay

- Automatically generated document IDs are **not preserved** during replay — clients must explicitly provide document IDs
- Live capture is recommended only for workloads with **< 4 TB/day** of incoming traffic

### Networking

- The Kubernetes cluster must have network connectivity to both source and target clusters
- For EKS deployments, source and target cluster security groups must allow inbound traffic from the EKS cluster security group

## Pre-migration checklist

- [ ] Verify source and target versions are in the compatibility matrix above
- [ ] Identify unsupported components and plan manual migration
- [ ] Plan index scope using index allowlists
- [ ] Test with a subset of 1–2 representative indexes first
- [ ] Check for multi-type indexes (ES 6.x)
