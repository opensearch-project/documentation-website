---
layout: default
title: Migrating from Apache Solr
nav_order: 25
parent: Migration Assistant for OpenSearch
permalink: /migration-assistant/solr-migration/
---

# Migrating from Apache Solr

Migration Assistant supports migrating from Apache Solr 8.x to OpenSearch 3.x. Solr migrations use a different architecture than Elasticsearch migrations because Solr and OpenSearch have fundamentally different HTTP APIs, query syntax, and schema formats.

## Supported versions

| Source | Target |
| :--- | :--- |
| Apache Solr 8.x (SolrCloud or Standalone) | OpenSearch 3.x |

## How Solr migrations differ

Unlike Elasticsearch—which shares a common Lucene data format and similar REST API with OpenSearch—Solr uses its own HTTP API (`/solr/{collection}/select`), schema format (`schema.xml`), and query syntax. Solr migrations require two specialized components:

- **SolrReader**: Reads Solr backup data (Lucene segment files) and translates Solr `schema.xml` field types to OpenSearch mappings.
- **Transformation Shim**: A real-time HTTP proxy that translates Solr API requests to OpenSearch `_search` API requests and converts responses back to Solr format.

## Migration phases

A Solr-to-OpenSearch migration has four phases.

### Phase 1: Data migration (backfill)

Migrate existing documents and schema from Solr to OpenSearch:

1. **Create a Solr backup**: Use the Solr backup API for SolrCloud collections or a file-system copy for standalone cores.
2. **Run SolrReader**: SolrReader reads the Solr backup's Lucene segment files, extracts documents, and translates Solr `schema.xml` field types into OpenSearch mappings.
3. **Bulk-index into OpenSearch**: Documents are indexed into the target OpenSearch cluster with the translated mappings.

The following Solr field types are translated automatically:

| Solr field type | OpenSearch mapping |
| :--- | :--- |
| `solr.TextField` | `text` |
| `solr.StrField` | `keyword` |
| `solr.IntPointField` | `integer` |
| `solr.LongPointField` | `long` |
| `solr.FloatPointField` | `float` |
| `solr.DoublePointField` | `double` |
| `solr.BoolField` | `boolean` |
| `solr.DatePointField` | `date` |

### Phase 2: Shadow validation

Deploy the Transformation Shim in dual-target mode with Solr as the primary. Your application continues talking to Solr as normal through the shim, while the shim simultaneously sends translated queries to OpenSearch and validates that the responses match.

Every response includes validation headers:
- `X-Validation-Status: PASS` or `FAIL`
- `X-Validation-Details: field-equality:PASS, doc-count:PASS`

This phase lets you identify and fix query translation gaps before any production cutover.

### Phase 3: Cutover

Switch the shim to OpenSearch-primary mode. OpenSearch now serves production queries. Solr remains as a safety net—if issues arise, you can switch back to Solr-primary with a single configuration change.

### Phase 4: Decommission Solr

Once you are confident in OpenSearch, either switch to OpenSearch-only mode (remove Solr from the shim targets) or remove the shim entirely and point applications directly at OpenSearch.

## Supported Solr query features

The Transformation Shim supports the following Solr query features:

| Feature | Status |
| :--- | :--- |
| Term, phrase, boolean, wildcard, fuzzy, range queries | Supported |
| Filter queries (`fq`) | Supported |
| Pagination (`rows`, `start`, `cursorMark`) | Supported |
| Sort | Supported |
| Field list (`fl`) | Supported |
| Facets (terms, range, date range, JSON facets, pivot) | Supported |
| Highlighting | Supported |
| Function queries | Supported |
| DisMax / eDisMax | Supported |
| More Like This | Supported |

## Solr component support

| Component | Supported | Notes |
| :--- | :--- | :--- |
| Documents | Yes | Extracted from Solr backup Lucene segment files |
| Schema (field types and mappings) | Yes | Solr `schema.xml` translated to OpenSearch mappings |
| Query translation (`/select`) | Yes | Via the Transformation Shim |
| Solr plugins | No | Must be reimplemented or removed |
| ZooKeeper configuration | No | Not applicable to OpenSearch |
| Custom request handlers | No | Only the `/select` endpoint is translated |
| UpdateProcessorChain | No | Recreate equivalent logic using OpenSearch ingest pipelines |
| DIH (Data Import Handler) | No | Replace with an external indexing pipeline |

## Known limitations

The following are known limitations for Solr migrations:

- **Terms facet offset**: The OpenSearch `terms` aggregation has no `offset` parameter. The shim over-fetches results, and clients must discard leading buckets.
- **Multi-unit date range gaps**: Gaps such as `+2MONTHS` are approximated using fixed intervals (30 days/month, 365 days/year). Bucket boundaries may drift slightly.
- **Cursor pagination uniqueKey**: The shim assumes `id` as the Solr `uniqueKey` field. Deployments using a custom `uniqueKey` may see incorrect behavior.
- **Only `/select` endpoint**: The shim translates Solr select (search) requests. Update, admin, and custom handler requests are not translated.

## Getting started

For detailed instructions, see the [Solr Migration Overview](https://github.com/opensearch-project/opensearch-migrations/wiki/Solr-Migration-Overview) in the opensearch-migrations wiki.

### Quick local demo

The developer sandbox spins up Solr 8 + OpenSearch 3.x + the Transformation Shim locally with one command:

```bash
git clone https://github.com/opensearch-project/opensearch-migrations
cd opensearch-migrations/solrMigrationDevSandbox
./run.sh
```

This generates 200,000 synthetic documents, loads them into both clusters, and keeps the services running for manual testing.

### Additional resources

- [Solr Query Translation Shim](https://github.com/opensearch-project/opensearch-migrations/wiki/Solr-Query-Translation-Shim): Supported query types, validation modes, and limitations.
- [Shim demo walkthrough](https://github.com/opensearch-project/opensearch-migrations/tree/main/TrafficCapture/SolrTransformations/docs/DEMO.md): A 30-minute hands-on walkthrough.
- [Known limitations](https://github.com/opensearch-project/opensearch-migrations/tree/main/TrafficCapture/SolrTransformations/docs/LIMITATIONS.md): Complete limitation details with workarounds.
