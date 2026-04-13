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

Example (dual-target; exact set can vary by release):

```
X-Shim-Primary: solr
X-Shim-Targets: solr,opensearch
X-Target-solr-StatusCode: 200
X-Target-opensearch-StatusCode: 200
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

## Build, run, and test

The shim and Solr transformation assets live in the **opensearch-migrations** repository on GitHub (not in the Migration Assistant Helm chart). If your local clone does not contain `TrafficCapture/SolrTransformations` or `TrafficCapture/transformationShim`, **update to a commit or release** that includes those paths.

### 1. Clone and build

From the repository root ([opensearch-migrations](https://github.com/opensearch-project/opensearch-migrations)):

```bash
# Shim image (Docker)
./gradlew :TrafficCapture:transformationShim:jibDockerBuild

# TypeScript transforms used by the shim
cd TrafficCapture/SolrTransformations/transforms
npm install
npm run build
```
{% include copy.html %}

### 2. Start with Docker Compose

```bash
cd TrafficCapture/SolrTransformations

# Full validation stack (exercises multiple operating modes — see compose file for ports)
docker compose -f docker/docker-compose.validation.yml up -d

# Or a simpler single-mode stack
docker compose -f docker/docker-compose.yml up -d
```
{% include copy.html %}

Published port numbers and service names are defined in those compose files. After `up`, check which host port maps to the shim (often something like `localhost:<port>` in the compose output or `docker compose ps`).

### 3. Send sample Solr-style queries

The shim speaks the Solr HTTP API. Point `curl` at the shim listener (replace `<SHIM_HOST>`, `<PORT>`, and `<collection>` with values from your stack; `<collection>` should match an OpenSearch **index** name exposed through the shim):

```bash
# Match all (Solr query syntax → translated to OpenSearch _search)
curl -sS "http://<SHIM_HOST>:<PORT>/solr/<collection>/select?q=*:*&rows=5"

# Term-style query and field list
curl -sS "http://<SHIM_HOST>:<PORT>/solr/<collection>/select?q=title:test&fl=id,title&rows=10"

# Filter query + facet (if your index has the field)
curl -sS "http://<SHIM_HOST>:<PORT>/solr/<collection>/select?q=*:*&facet=true&facet.field=<field_name>&rows=0"
```
{% include copy.html %}

Use `curl -i` to inspect **validation and latency headers** (`X-Validation-*`, `X-Target-*`) in dual-target mode.

Compare the same logical query against OpenSearch directly to sanity-check the target index (bypassing the shim):

```bash
curl -sS -u "user:pass" -X POST "https://<opensearch-host>:9200/<collection>/_search" \
  -H 'Content-Type: application/json' \
  -d '{"query":{"match_all":{}},"size":5}'
```
{% include copy.html %}

### 4. Automated tests

```bash
# Java: proxy, validators, regression
./gradlew :TrafficCapture:transformationShim:test

# End-to-end (Docker / Testcontainers — Solr + OpenSearch)
./gradlew :TrafficCapture:SolrTransformations:isolatedTest

# TypeScript transforms
cd TrafficCapture/SolrTransformations/transforms && npm test
```
{% include copy.html %}

### 5. Teardown

```bash
cd TrafficCapture/SolrTransformations
docker compose -f docker/docker-compose.validation.yml down -v
```
{% include copy.html %}

### In-repo documentation (GitHub)

- [DEMO.md](https://github.com/opensearch-project/opensearch-migrations/blob/main/TrafficCapture/SolrTransformations/docs/DEMO.md) — hands-on walkthrough
- [TRANSFORMS.md](https://github.com/opensearch-project/opensearch-migrations/blob/main/TrafficCapture/SolrTransformations/docs/TRANSFORMS.md) — transform design
- [LIMITATIONS.md](https://github.com/opensearch-project/opensearch-migrations/blob/main/TrafficCapture/SolrTransformations/docs/LIMITATIONS.md) — limitations and workarounds
- [ARCHITECTURE.md](https://github.com/opensearch-project/opensearch-migrations/blob/main/TrafficCapture/transformationShim/docs/ARCHITECTURE.md) — shim internals
