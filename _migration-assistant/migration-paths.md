---
layout: default
title: Migration paths
nav_order: 12
permalink: /migration-assistant/migration-paths/
---

# Migration paths

This page describes the supported migration paths, version compatibility, and what components can be migrated using Migration Assistant.

## Supported source and target versions

| Source platform | Source versions | Target versions |
|:----------------|:----------------|:----------------|
| Elasticsearch | 1.x–8.x | OpenSearch 1.x, 2.x, 3.x |
| OpenSearch | 1.x | OpenSearch 2.x, 3.x |
| OpenSearch | 2.x | OpenSearch 2.x, 3.x |
| Apache Solr | 8.x | OpenSearch 3.x |

### Version-specific notes

**Elasticsearch 6.x**: Requires handling for multiple mapping types per index. Configure `multiTypeBehavior` in your migration config. Run `workflow configure edit` to see available options.

**Elasticsearch 8.x**: Supported with compatibility handling for post-fork features. Some 8.x-specific features may not have OpenSearch equivalents. Test metadata migration first.

**Apache Solr 8.x**: Uses a different migration architecture than Elasticsearch. See [Solr migration]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/) for details.

## Supported platforms

| Platform | Source | Target |
|:---------|:-------|:-------|
| Self-managed (on-premises) | ✓ | ✓ |
| Amazon OpenSearch Service | ✓ | ✓ |
| Amazon OpenSearch Serverless | ✗ | ✓ |
| Elastic Cloud | ✓ | ✓ |
| AWS EC2 | ✓ | ✓ |
| Apache Solr (SolrCloud/Standalone) | ✓ | ✗ |

Amazon OpenSearch Serverless is supported as a target for document backfill and index metadata migration.
{: .note }

## Component support

### Fully supported

| Component | Description |
|:----------|:------------|
| Documents | All documents in selected indexes |
| Index settings | Shard count, replica count, refresh interval, analyzers |
| Index mappings | Field mappings, dynamic templates, mapping parameters |
| Index templates | Legacy and composable index templates |
| Component templates | Reusable template components (Elasticsearch 7.8+/OpenSearch) |
| Aliases | Index aliases and their configurations |

### Not supported

| Component | Reason | Workaround |
|:----------|:-------|:-----------|
| Data streams | Not currently supported | Manually recreate on target |
| ISM/ILM policies | Different syntax between ES and OS | Manually recreate on target |
| Security configuration | Cluster-specific | Configure separately on target |
| Kibana/Dashboards objects | Separate application data | Export/import using Dashboards UI |
| Ingest pipelines | May contain version-specific processors | Manually recreate |
| Cluster settings | Cluster-specific tuning | Configure separately |

## Pre-migration checklist

- [ ] Verify source and target versions are in the compatibility matrix
- [ ] Identify unsupported components and plan manual migration
- [ ] Plan index scope using index allowlists
- [ ] Test with a subset of 1–2 representative indexes first
- [ ] Check for multi-type indexes (ES 6.x)
