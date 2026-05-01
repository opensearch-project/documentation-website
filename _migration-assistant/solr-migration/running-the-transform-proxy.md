---
layout: default
title: Running the Transform Proxy
nav_order: 1
parent: Solr migration
permalink: /migration-assistant/solr-migration/running-the-transform-proxy/
redirect_from:
  - /migration-assistant/solr-migration/query-translation-shim/
---

# Running the Transform Proxy

This feature is in preview and subject to change. Not all Solr query types are supported. See [Supported query features](#supported-query-features) for details.
{: .warning }

The Transformation Shim is a Netty-based HTTP proxy that translates Apache Solr HTTP API requests into OpenSearch `_search` API requests and converts responses back to Solr format. It helps customers identify a viable migration path from Solr to OpenSearch by validating query compatibility before making application changes.

## Request translation

| Solr | OpenSearch |
|:-----|:-----------|
| `GET /solr/{collection}/select?q=...` | `POST /{collection}/_search` with JSON body |
| `q=*:*` | `{"query":{"match_all":{}}}` |
| `q=title:search` | `{"query":{"term":{"title":"search"}}}` |
| `q="exact phrase"` | `{"query":{"query_string":{"query":"\"exact phrase\""}}}` |
| `fq=category:books` | Added to `bool.filter` |
| `rows=10&start=20` | `{"size":10,"from":20}` |
| `sort=date desc` | `{"sort":[{"date":"desc"}]}` |
| `fl=id,title` | `{"_source":["id","title"]}` |

## Operating modes

| Mode | Description | Use case |
|:-----|:------------|:---------|
| **Solr-only passthrough** | Proxy to Solr, no transforms | Baseline verification |
| **OpenSearch-only** | Transform requests → OpenSearch | Production after decommissioning Solr |
| **Dual-target, Solr-primary** | Both backends, return Solr response, validate against OpenSearch | Shadow validation before cutover |
| **Dual-target, OpenSearch-primary** | Both backends, return OpenSearch response, validate against Solr | Cutover with Solr safety net |

## Supported query features

The following features are natively translated by the shim's transform pipeline. Queries using unsupported constructs fall back to OpenSearch's `query_string` passthrough, which may or may not produce correct results depending on the query.

### Search queries

| Feature | Solr syntax | Status |
|:--------|:------------|:-------|
| Match all | `q=*:*` | ✓ Translated |
| Field term query | `q=title:search` | ✓ Translated |
| Phrase query | `q=title:"exact phrase"` | ✓ Translated |
| Bare term (no field) | `q=search` | ✓ Translated (via `query_string`) |
| Boolean operators | `q=title:search AND category:books` | ✓ Translated |
| Range query | `q=price:[10 TO 100]` | ✓ Translated |
| Boosting | `q=title:search^2` | ✓ Translated |
| Grouping (parentheses) | `q=(a OR b) AND c` | ✓ Translated |
| Default field | `df=title` | ✓ Applied via `solrconfig-defaults` or param |
| Filter query | `fq=category:books` | ✓ Translated |
| Wildcard | `q=titl*` | ✗ Falls back to `query_string` passthrough |
| Fuzzy | `q=serch~2` | ✗ Falls back to `query_string` passthrough |
| DisMax / eDisMax | `defType=dismax` | ✗ Not supported |
| Function queries | `{!func}` | ✗ Not supported |
| More Like This | `mlt=true` | ✗ Not supported |

### Pagination and sorting

| Feature | Solr syntax | Status |
|:--------|:------------|:-------|
| Rows / start | `rows=10&start=20` | ✓ Translated |
| Sort | `sort=date desc,score asc` | ✓ Translated |
| Cursor pagination | `cursorMark=*` | ✓ Translated (assumes `id` as uniqueKey) |

### Facets (JSON Facet API only)

Only the Solr JSON Facet API (`json.facet`) is supported. Traditional facet parameters (`facet.field`, `facet.range`, `facet.pivot`) are **not** translated.

| Feature | Solr syntax | Status |
|:--------|:------------|:-------|
| Terms facet | `json.facet={"cat":{"type":"terms","field":"category"}}` | ✓ Translated |
| Range facet | `json.facet={"price":{"type":"range",...}}` | ✓ Translated |
| Date range facet | Date gap in `json.facet` | ✓ Translated (single-unit gaps; multi-unit approximated) |
| Query facet | `json.facet={"expensive":{"type":"query",...}}` | ✓ Translated |
| Nested facets | Nested `facet` within a facet definition | ✓ Translated |
| Traditional `facet.field` | `facet=true&facet.field=category` | ✗ Not supported |
| Traditional `facet.range` | `facet=true&facet.range=price` | ✗ Not supported |
| Traditional `facet.pivot` | `facet.pivot=category,brand` | ✗ Not supported |

### Other features

| Feature | Solr syntax | Status |
|:--------|:------------|:-------|
| Highlighting | `hl=true&hl.fl=title` | ✓ Translated |
| Field list | `fl=id,title,score` | ✓ Translated |
| `solrconfig.xml` defaults | Auto-discovered from mount path | ✓ Applied |

## Validation

In dual-target mode, the shim runs validators on every request and reports results in HTTP response headers.

### Built-in validators

| Validator | What it checks |
|:----------|:---------------|
| **field-equality** | Deep JSON diff of responses |
| **doc-count** | Document count matches between targets |
| **doc-ids** | Same document IDs returned |
| **JavaScript** | Custom validator via GraalVM |

## Known limitations

| Shortcode | Summary |
|:----------|:--------|
| TERMS-OFFSET | OpenSearch `terms` aggregation has no `offset` — shim over-fetches, clients must trim leading buckets |
| DATE-RANGE-GAP | Multi-unit gaps like `+2MONTHS` approximated using fixed intervals |
| CURSOR-UNIQUEKEY | Cursor pagination assumes `id` as Solr `uniqueKey` field |
| CURSOR-REPLAY | Offline traffic replay with `cursorMark` tokens not supported |

A race condition in dual-target mode was fixed in version 2.9.0. Ensure you are running 2.9.0 or later if using dual-target mode.
{: .note }
