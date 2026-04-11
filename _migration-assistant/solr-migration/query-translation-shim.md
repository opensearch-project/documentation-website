---
layout: default
title: Query Translation Shim
nav_order: 1
parent: Solr migration
permalink: /migration-assistant/solr-migration/query-translation-shim/
---

# Solr Query Translation Shim

The Transformation Shim is a Netty-based HTTP proxy that translates Apache Solr HTTP API requests into OpenSearch `_search` API requests and converts responses back to Solr format. It enables Solr clients to query OpenSearch without application code changes.

## Request translation

| Solr | OpenSearch |
|:-----|:-----------|
| `GET /solr/{collection}/select?q=...` | `POST /{collection}/_search` with JSON body |
| `q=*:*` | `{"query":{"match_all":{}}}` |
| `q=title:search` | `{"query":{"query_string":{"query":"title:search"}}}` |
| `fq=category:books` | `{"query":{"bool":{"filter":[...]}}}` |
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

## Supported query types

### Search queries

| Feature | Status |
|:--------|:-------|
| Match all (`q=*:*`) | ✓ |
| Term query (`q=title:search`) | ✓ |
| Phrase query (`q="exact phrase"`) | ✓ |
| Boolean operators | ✓ |
| Wildcard, fuzzy, range | ✓ |
| Boosting (`q=title:search^2`) | ✓ |
| Filter query (`fq=...`) | ✓ |
| DisMax / eDisMax | ✓ |

### Facets

| Feature | Status |
|:--------|:-------|
| Terms facet | ✓ |
| Range facet | ✓ |
| Date range facet | ✓ |
| JSON facets | ✓ |
| Pivot facets | ✓ |

### Other features

| Feature | Status |
|:--------|:-------|
| Highlighting | ✓ |
| Cursor pagination (`cursorMark`) | ✓ |
| Field list (`fl=...`) | ✓ |
| Function queries | ✓ |
| More Like This | ✓ |

## Validation

In dual-target mode, the shim runs validators on every request and reports results in HTTP response headers.

### Validation headers

```
X-Validation-Status: PASS
X-Validation-Details: field-equality(solr,opensearch):PASS, doc-count(solr,opensearch):PASS
```

### Built-in validators

| Validator | What it checks |
|:----------|:---------------|
| **field-equality** | Deep JSON diff of responses |
| **doc-count** | Document count matches between targets |
| **doc-ids** | Same document IDs returned |
| **JavaScript** | Custom validator via GraalVM |

## Hot-reload

The shim supports live transform reloading with `--watchTransforms`. Edit a TypeScript transform file, and the next request uses the updated transform — no restart needed.
