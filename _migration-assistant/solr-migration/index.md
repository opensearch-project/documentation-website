---
layout: default
title: Solr migration
nav_order: 60
has_children: true
has_toc: true
permalink: /migration-assistant/solr-migration/
---

# Solr migration

This page describes how to migrate from Apache Solr 8.x to OpenSearch 3.x using Migration Assistant. Solr migrations use a different architecture than Elasticsearch migrations because Solr and OpenSearch have fundamentally different HTTP APIs, query syntax, and schema formats.

## Supported versions

| Source | Target |
|:-------|:-------|
| Apache Solr 8.x (SolrCloud or Standalone) | OpenSearch 3.x |

## What makes Solr migrations different

Unlike Elasticsearch — which shares a common Lucene data format and similar REST API with OpenSearch — Solr uses its own HTTP API (`/solr/{collection}/select`), schema format (`schema.xml`), and query syntax. Solr migrations require two specialized components:

1. **SolrReader** — Reads Solr backup data and translates Solr schemas to OpenSearch mappings
2. **Transformation Shim** — A real-time HTTP proxy that translates Solr API requests to OpenSearch and back. See [Running the Transform Proxy]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/running-the-transform-proxy/) for supported features, operating modes, and validation.

## Migration phases

### Phase 1: Data migration (backfill)

1. **Create a Solr backup** — Use Solr's backup API for SolrCloud collections, or file-system copy for standalone cores
2. **Run SolrReader** — Reads the Solr backup's Lucene segment files, extracts documents, and translates Solr `schema.xml` field types into OpenSearch mappings
3. **Bulk-index into OpenSearch** — Documents are indexed into the target with translated mappings

SolrReader handles schema translation automatically:

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

### Phase 2: Shadow validation

Deploy the Transformation Shim in dual-target mode with Solr as the primary. Your application continues talking to Solr through the shim, while the shim simultaneously sends translated queries to OpenSearch and validates the responses match.

Every response includes validation headers:
- `X-Validation-Status: PASS` or `FAIL`
- `X-Validation-Details: field-equality:PASS, doc-count:PASS`

### Phase 3: Cutover

Switch the shim to OpenSearch-primary mode. OpenSearch now serves production queries. Solr remains as a safety net — switch back with a single configuration change.

### Phase 4: Decommission Solr

Once confident in OpenSearch, either:
- Switch to OpenSearch-only mode (remove Solr from the shim targets)
- Remove the shim entirely and point applications directly at OpenSearch

## What's migrated

| Component | Supported | Notes |
|:----------|:----------|:------|
| Documents | ✓ | Extracted from Solr backup Lucene segment files |
| Schema (field types) | ✓ | `schema.xml` → OpenSearch mappings |
| Query traffic (`/select`) | ✓ | Via Transformation Shim |
| Facets, highlighting, pagination | ✓ | See [Running the Transform Proxy]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/running-the-transform-proxy/) for coverage |
| Solr plugins | ✗ | Must be reimplemented or removed |
| ZooKeeper configuration | ✗ | Not applicable to OpenSearch |
| Custom request handlers | ✗ | Only `/select` is translated |

## Known limitations

- **Terms facet offset**: OpenSearch `terms` aggregation has no `offset` equivalent. The shim over-fetches and clients must trim leading buckets.
- **Multi-unit date range gaps**: Gaps like `+2MONTHS` are approximated using fixed intervals (30 days/month, 365 days/year).
- **Cursor pagination uniqueKey**: The shim assumes `id` as the Solr `uniqueKey` field.
- **Only `/select` endpoint**: Update, admin, and custom handler requests are not translated.

A race condition in dual-target mode where both targets shared a mutable request map was fixed in version 2.9.0. If you experience intermittent failures in dual-target mode, ensure you are running 2.9.0 or later.
{: .note }
