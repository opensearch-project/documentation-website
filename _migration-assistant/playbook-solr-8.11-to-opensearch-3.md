---
layout: default
title: "Apache Solr 8.x and 9.x → OpenSearch 3"
nav_order: 3
parent: Playbooks
permalink: /migration-assistant/playbook-solr-8.11-to-opensearch-3/
redirect_from:
  - /migration-assistant/playbook-solr-8-to-opensearch-3/
---

# Playbook: Apache Solr 8.x or 9.x → OpenSearch 3.x

This playbook assumes Migration Assistant is already deployed on Kubernetes or Amazon EKS. If it is not, see [Choose your deployment]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/) first. The playbook covers the end-to-end process for migrating from Apache Solr 8.x or 9.x to OpenSearch 3.x using snapshot-based document backfill.

The example commands and config snippets target SolrCloud 8.11 against OpenSearch 3.x, but the same workflow applies to standalone Solr and to Solr 6.x–9.x — only the version string changes (for example, `SOLR 8.11.0` or `SOLR 9.7.0`).
{: .note }

Solr migrations support **backfill only** — Capture and Replay is not supported for Solr sources. If you need to migrate live traffic, plan a write pause around the backfill window.
{: .note }

## 1. Understand the Solr migration architecture

Solr migrations differ from Elasticsearch migrations because Solr uses a different HTTP API, schema format (`schema.xml`), and query syntax. A specialized component handles this:

- **SolrReader** — Reads Solr backup data (Lucene segment files), translates `schema.xml` field types to OpenSearch mappings, and bulk-indexes documents

See [Solr migration overview]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/) for details.

> **Targeting Amazon OpenSearch Serverless instead?** This playbook still applies end-to-end. The only differences are the target endpoint and `authConfig.sigv4.service` value (`aoss` instead of `es`), plus a one-time AOSS data access policy. See [Migrate to OpenSearch Serverless]({{site.url}}{{site.baseurl}}/migration-assistant/amazon-opensearch-serverless/) for the target config, then return here.
{: .tip }

## 2. Create a Solr backup

Migration Assistant reads from Solr's native backup format. Use Solr's backup API for both SolrCloud and standalone — never copy data files from a running Solr installation, because segment merges or in-flight commits can corrupt the resulting backup.

For SolrCloud, the backup target must be a shared file system mounted at the same path on every node, or an [`S3BackupRepository`](https://solr.apache.org/guide/solr/latest/deployment-guide/backup-restore.html#s3backuprepository). See [Apache Solr — SolrCloud backup/restore requirements](https://solr.apache.org/guide/solr/latest/deployment-guide/backup-restore.html#solrcloud-clusters) for the cluster-wide constraints.
{: .note }

If you want to skip the local-or-shared-FS step entirely and have Solr write the backup directly to S3, configure Solr's `S3BackupRepository` and follow the [Solr backfill guide]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/solr-backfill-guide/) instead — Migration Assistant will read the backup from S3 in place.

**SolrCloud (Collections API):**

```bash
curl "http://<SOLR_HOST>:<SOLR_PORT>/solr/admin/collections?action=BACKUP&name=my-backup&collection=<COLLECTION>&location=/path/to/shared-backup"
```
{% include copy.html %}

Poll until the async task reports `completed`:

```bash
curl "http://<SOLR_HOST>:<SOLR_PORT>/solr/admin/collections?action=REQUESTSTATUS&requestid=<REQUEST_ID>"
```
{% include copy.html %}

**Standalone Solr (Replication handler):**

```bash
curl "http://<SOLR_HOST>:<SOLR_PORT>/solr/<CORE>/replication?command=backup&name=my-backup&location=/path/to/backup"
```
{% include copy.html %}

Confirm the backup finished by checking `details.backup.status` in the response:

```bash
curl "http://<SOLR_HOST>:<SOLR_PORT>/solr/<CORE>/replication?command=details"
```
{% include copy.html %}

If you used a local file system instead of `S3BackupRepository`, upload the resulting backup to S3 so Migration Assistant can read it:

```bash
aws s3 sync /path/to/backup/ s3://<BUCKET>/solr-backup/
```
{% include copy.html %}

## 3. Configure the workflow

Connect to the Migration Console and load the sample configuration:

```bash
kubectl exec -it migration-console-0 -n ma -- /bin/bash
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
      "endpoint": "http://<SOLR_HOST>:<SOLR_PORT>",
      "allowInsecure": true,
      "version": "SOLR 8.11.4",
      "snapshotInfo": {
        "repos": {
          "default-s3": {
            "awsRegion": "<REGION>",
            "s3RepoPathUri": "s3://<BUCKET>/solr-backup"
          }
        },
        "snapshots": {
          "solr-migration-snapshot": {
            "config": { "createSnapshotConfig": {} },
            "repoName": "default-s3"
          }
        }
      }
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
      "perSnapshotConfig": {
        "solr-migration-snapshot": [
          {
            "metadataMigrationConfig": {
              "skipEvaluateApproval": true,
              "skipMigrateApproval": true
            },
            "documentBackfillConfig": {
              "podReplicas": 4
            }
          }
        ]
      }
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
workflow manage    # Interactive TUI (Terminal User Interface)
```
{% include copy.html %}

The workflow will:
1. Read the Solr backup data
2. Translate `schema.xml` field types to OpenSearch mappings
3. Bulk-index documents into the target

## 6. Verify the migration

```bash
# Check document counts on target
console clusters cat-indexes

# Verify a specific collection
console clusters curl target /<collection>/_count

# Test a query
console clusters curl target /<collection>/_search --json '{"query":{"match_all":{}},"size":5}'
```
{% include copy.html %}

## 7. Schema translation reference

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

## 8. If you get stuck

- [Troubleshooting]({{site.url}}{{site.baseurl}}/migration-assistant/troubleshooting/)
- Start with a single collection to isolate issues before migrating all data

## See also

- [Solr migration overview]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/)
- [Solr backfill guide]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/solr-backfill-guide/) — Step-by-step S3 backup setup and workflow configuration for Solr
- [Supported migration paths]({{site.url}}{{site.baseurl}}/migration-assistant/is-migration-assistant-right-for-you/)
