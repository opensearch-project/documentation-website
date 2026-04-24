---
layout: default
title: "Apache Solr 8.11 → OpenSearch 3.5"
nav_order: 3
parent: Playbooks
permalink: /migration-assistant/playbook-solr-8.11-to-opensearch-3/
redirect_from:
  - /migration-assistant/playbook-solr-8-to-opensearch-3/
---

# Playbook: Apache Solr 8.11 → OpenSearch 3.5

This playbook assumes **Migration Assistant is already deployed** on Kubernetes or Amazon EKS. It covers the end-to-end process for migrating from Apache Solr 8.11 to OpenSearch 3.5, including document backfill and query compatibility validation using the Transformation Shim.

Solr migrations support **backfill only** — Capture and Replay is not supported for Solr sources.
{: .warning }

## 1. Understand the Solr migration architecture

Solr migrations differ from Elasticsearch migrations because Solr uses a different HTTP API, schema format (`schema.xml`), and query syntax. Two specialized components handle this:

- **SolrReader** — Reads Solr backup data (Lucene segment files), translates `schema.xml` field types to OpenSearch mappings, and bulk-indexes documents
- **Transformation Shim** — HTTP proxy that translates Solr `/select` requests to OpenSearch `_search` API for query compatibility validation

See [Solr migration overview]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/) and [Running the Transform Proxy]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/running-the-transform-proxy/) for details.

> **Targeting Amazon OpenSearch Serverless instead?** This playbook still applies end-to-end. The only differences are the target endpoint and `authConfig.sigv4.service` value (`aoss` instead of `es`), plus a one-time AOSS data access policy. See [Migrate to OpenSearch Serverless]({{site.url}}{{site.baseurl}}/migration-assistant/amazon-opensearch-serverless/) for the target config, then return here.
{: .tip }

## 2. Create a Solr backup

**SolrCloud:**

```bash
curl "http://<SOLR_HOST>:8983/solr/admin/collections?action=BACKUP&name=my-backup&collection=<COLLECTION>&location=/path/to/backup"
```
{% include copy.html %}

**Standalone Solr:**

Copy the core's data directory:

```bash
cp -r /var/solr/data/<CORE>/data /path/to/backup/
cp /var/solr/data/<CORE>/conf/schema.xml /path/to/backup/
```
{% include copy.html %}

Upload the backup to S3 for Migration Assistant to access:

```bash
aws s3 sync /path/to/backup/ s3://<BUCKET>/solr-backup/
```
{% include copy.html %}

## 3. Configure the workflow

Connect to the Migration Console and load the sample configuration:

```bash
kubectl exec -it migration-console-0 -n ma -- bash
workflow configure sample --load
workflow configure edit
```
{% include copy.html %}

Set the source as your Solr backup location and the target as your OpenSearch 3.5 cluster. The schema translation (Solr field types → OpenSearch mappings) is handled automatically by SolrReader.

## 4. Sample workflow configuration

```json
{
  "sourceClusters": {
    "solr-source": {
      "endpoint": "http://<SOLR_HOST>:8983",
      "allowInsecure": true,
      "version": "Solr 8"
    }
  },
  "targetClusters": {
    "target": {
      "endpoint": "https://<OPENSEARCH_HOST>:9200",
      "allowInsecure": true,
      "authConfig": {
        "basic": { "secretName": "target-creds" }
      }
    }
  },
  "snapshotMigrationConfigs": [
    {
      "fromSource": "solr-source",
      "toTarget": "target",
      "snapshotExtractAndLoadConfigs": [
        {
          "createSnapshotConfig": {},
          "snapshotConfig": {
            "snapshotNameConfig": { "snapshotNamePrefix": "solr-migration" },
            "repoName": "solr-backup-repo"
          },
          "migrations": [
            {
              "metadataMigrationConfig": {},
              "documentBackfillConfig": {
                "podReplicas": 4
              }
            }
          ]
        }
      ]
    }
  ]
}
```
{% include copy.html %}

Always verify field names against `workflow configure sample` for your installed version.
{: .note }

## 5. Submit and monitor

```bash
workflow submit
workflow manage    # Interactive TUI
```
{% include copy.html %}

The workflow will:
1. Read the Solr backup data
2. Translate `schema.xml` field types to OpenSearch mappings
3. Bulk-index documents into the target

## 6. Verify the migration

```bash
# Check document counts on target
console clusters curl target -- "/_cat/indices?v"

# Verify a specific collection
console clusters curl target -- "/<collection>/_count"

# Test a query
console clusters curl target -- "/<collection>/_search" --json '{"query":{"match_all":{}},"size":5}'
```
{% include copy.html %}

## 7. Validate query compatibility with the Transformation Shim

After documents are migrated, deploy the Transformation Shim to validate that your Solr queries produce equivalent results on OpenSearch.

### Deploy in dual-target mode (Solr-primary)

Run the shim with both Solr and OpenSearch as backends. Solr serves production responses while OpenSearch runs in shadow mode with validation:

```bash
# See the Solr Transformations demo for Docker Compose setup
cd opensearch-migrations/TrafficCapture/SolrTransformations
docker compose -f docker/docker-compose.validation.yml up -d
```
{% include copy.html %}

### Check validation headers

Every response includes validation results:

```bash
curl -v "http://localhost:8083/solr/<collection>/select?q=*:*" 2>&1 | grep X-Validation
```

Look for:
- `X-Validation-Status: PASS` — query results match
- `X-Validation-Status: FAIL` — results differ (investigate before cutover)

### Supported query features

See [Running the Transform Proxy]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/running-the-transform-proxy/) for the full list. Key supported features: match_all, field queries, phrase queries, boolean operators, range queries, JSON facets, highlighting, cursor pagination, and sort.

Not supported: wildcard, fuzzy, DisMax/eDisMax, function queries, traditional `facet.field`/`facet.range`/`facet.pivot` (only JSON Facet API).
{: .note }

## 8. Schema translation reference

SolrReader automatically translates these Solr field types:

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

## 9. If you get stuck

- [Troubleshooting]({{site.url}}{{site.baseurl}}/migration-assistant/troubleshooting/)
- [Running the Transform Proxy — Known limitations]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/running-the-transform-proxy/#known-limitations)
- Start with a single collection to isolate issues before migrating all data

## See also

- [Solr migration overview]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/)
- [Solr backfill guide]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/solr-backfill-guide/) — Step-by-step S3 backup setup and workflow configuration for Solr
- [Running the Transform Proxy]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/running-the-transform-proxy/)
- [Supported migration paths]({{site.url}}{{site.baseurl}}/migration-assistant/is-migration-assistant-right-for-you/)
