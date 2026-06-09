---
layout: default
title: Solr migration
nav_order: 60
has_children: true
has_toc: true
permalink: /migration-assistant/solr-migration/
canonical_url: https://docs.opensearch.org/latest/migration-assistant/solr-migration/
---

# Solr migration

Solr migrations use a different architecture than Elasticsearch migrations because Solr and OpenSearch have fundamentally different schema formats and data layouts.

## Supported versions

The following table lists the supported source and target versions.

| Source | Target |
|:-------|:-------|
| Apache Solr 6.x--9.x (SolrCloud or Standalone) | OpenSearch 1.x, 2.x, or 3.x |

The version string in your workflow configuration must match the format `SOLR <major>.<minor>.<patch>`. Examples: `SOLR 8.11.4`, `SOLR 9.7.0`, `SOLR 6.6.0`.

## Solr migration differences

Unlike Elasticsearch, which shares a common Lucene data format and similar REST API with OpenSearch, Solr uses its own schema format (`schema.xml`) and a different Lucene index layout. Solr migrations use a specialized component called SolrReader, which reads Solr backup data and translates Solr schemas to OpenSearch mappings. For step-by-step S3 backup setup and workflow configuration, see the [Solr backfill guide]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/solr-backfill-guide/).

## Migration phases

Solr migrations follow these phases.

### Phase 1: Data migration (backfill)

1. **Create a Solr backup** -- Use Solr's backup API for SolrCloud collections, or file-system copy for standalone cores.
2. **Run SolrReader** -- Reads the Solr backup's Lucene segment files, extracts documents, and translates Solr `schema.xml` field types into OpenSearch mappings.
3. **Bulk-index into OpenSearch** -- Documents are indexed into the target with translated mappings.

The following table shows how SolrReader performs schema translation.

| Solr field type | OpenSearch mapping |
|:----------------|:-------------------|
| `solr.TextField` | `text` |
| `solr.StrField` | `keyword` |
| `solr.IntPointField` | `integer` |
| `solr.LongPointField` | `long` |
| `solr.FloatPointField` | `float` |
| `solr.DoublePointField` | `double` |
| `solr.BoolField` | `boolean` |
| `solr.DatePointField` | `date` |

### Phase 2: Validate and cutover

After backfill completes, validate document counts and sample queries against the target. Once confident, point your application directly at OpenSearch.

Solr migrations support **backfill only**---Capture and Replay (live traffic migration) is not supported for Solr sources. You will need to update your application's query layer to use the OpenSearch API.
{: .warning }

## Migrated components

| Component | Supported | Notes |
|:----------|:----------|:------|
| Documents | Yes | Extracted from Solr backup Lucene segment files |
| Schema (field types) | Yes | `schema.xml` → OpenSearch mappings |
| Solr plugins | No | Must be reimplemented or removed |
| ZooKeeper configuration | No | Not applicable to OpenSearch |
| Query traffic | No | Application must be updated to use OpenSearch API |
