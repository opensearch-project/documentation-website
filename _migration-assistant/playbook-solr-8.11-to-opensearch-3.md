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

This playbook assumes Migration Assistant is already deployed on Kubernetes or Amazon Elastic Kubernetes Service (Amazon EKS). To learn how to deploy Migration Assistant, see [Choose your deployment]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/deploy/). The playbook describes the end-to-end process for migrating from Apache Solr 8.x or 9.x to OpenSearch 3.x using snapshot-based document backfill.

The example commands and configuration snippets target SolrCloud 8.11 against OpenSearch 3.x, but the same workflow applies to standalone Solr and to Solr 6.x--9.x---only the version string changes (for example, `SOLR 8.11.0` or `SOLR 9.7.0`).
{: .note }

Solr migrations support **backfill only**---Capture and Replay is not supported for Solr sources. If your application requires continuous writes during migration, pause writes to the source cluster for the duration of the backfill.
{: .note }

## Solr migration architecture

Solr migrations differ from Elasticsearch migrations because Solr uses a different HTTP API, schema format (`schema.xml`), and query syntax. Migration Assistant uses a specialized component called SolrReader to read Solr backup data (Lucene segment files), translate `schema.xml` field types to OpenSearch mappings, and bulk-index documents. For more information, see [Solr migration overview]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/).

If your target is Amazon OpenSearch Serverless, this playbook still applies. The only differences are the target endpoint, the `authConfig.sigv4.service` value (`aoss` instead of `es`), and a one-time data access policy configuration. For the Serverless-specific target configuration, see [Migrate to OpenSearch Serverless]({{site.url}}{{site.baseurl}}/migration-assistant/amazon-opensearch-serverless/).
{: .tip }

## Step 1: Create a Solr backup

Migration Assistant reads from Solr's native backup format. Use Solr's backup API for both SolrCloud and standalone. Do not copy data files from a running Solr installation because segment merges or pending commits can corrupt the resulting backup.

For SolrCloud, the backup target must be a shared file system mounted at the same path on every node, or an [`S3BackupRepository`](https://solr.apache.org/guide/solr/latest/deployment-guide/backup-restore.html#s3backuprepository). For cluster-wide constraints, see [Apache Solr---SolrCloud backup/restore requirements](https://solr.apache.org/guide/solr/latest/deployment-guide/backup-restore.html#solrcloud-clusters).
{: .note }

Alternatively, you can configure Solr to write backups directly to Amazon Simple Storage Service (Amazon S3) using `S3BackupRepository`, which eliminates the need for a shared filesystem. For this approach, see the [Solr backfill guide]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/solr-backfill-guide/).
{: .tip }

#### SolrCloud

To create a backup in SolrCloud, run the following command:

```bash
curl "http://<SOLR_HOST>:<SOLR_PORT>/solr/admin/collections?action=BACKUP&name=my-backup&collection=<COLLECTION>&location=/path/to/shared-backup"
```
{% include copy.html %}

To check the backup status, poll the request status API until it reports `completed`:

```bash
curl "http://<SOLR_HOST>:<SOLR_PORT>/solr/admin/collections?action=REQUESTSTATUS&requestid=<REQUEST_ID>"
```
{% include copy.html %}

#### Standalone Solr

For standalone Solr, use the replication handler to create a backup:

```bash
curl "http://<SOLR_HOST>:<SOLR_PORT>/solr/<CORE>/replication?command=backup&name=my-backup&location=/path/to/backup"
```
{% include copy.html %}

To verify that the backup completed, query the replication details and confirm that `details.backup.status` returns `success`:

```bash
curl "http://<SOLR_HOST>:<SOLR_PORT>/solr/<CORE>/replication?command=details"
```
{% include copy.html %}

If you used a local file system instead of `S3BackupRepository`, upload the resulting backup to S3 so Migration Assistant can read it:

```bash
aws s3 sync /path/to/backup/ s3://<BUCKET>/solr-backup/
```
{% include copy.html %}

## Step 2: Configure the workflow

Connect to the Migration Console and load the sample configuration:

```bash
kubectl exec -it migration-console-0 -n ma -- /bin/bash
workflow configure sample --load
workflow configure edit
```
{% include copy.html %}

Set the source as your Solr backup location and the target as your OpenSearch 3.5 cluster. The schema translation (Solr field types → OpenSearch mappings) is handled automatically by SolrReader.

### Sample workflow configuration

The following example shows a workflow configuration for migrating a Solr source to OpenSearch:

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

Always verify field names against `workflow configure sample` for your installed version, or browse the [Migration Assistant Schema Viewer](https://opensearch-project.github.io/opensearch-migrations/) for an interactive field reference.
{: .note }

## Step 3: Submit and monitor the workflow

Submit the workflow and open the monitoring interface:

```bash
workflow submit
workflow manage    # Interactive TUI (Terminal User Interface)
```
{% include copy.html %}

The workflow performs the following steps:

1. Reads the Solr backup data.
2. Translates `schema.xml` field types to OpenSearch mappings.
3. Bulk-indexes documents into the target.

## Step 4: Verify the migration

Run the following commands to verify document counts and query results:

```bash
# Check document counts on target
console clusters cat-indices

# Verify a specific collection
console clusters curl target /<collection>/_count

# Test a query
console clusters curl target /<collection>/_search --json '{"query":{"match_all":{}},"size":5}'
```
{% include copy.html %}

## Schema translation reference

SolrReader automatically translates the following Solr field types.

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

## Troubleshooting

If you encounter issues, see [Troubleshooting]({{site.url}}{{site.baseurl}}/migration-assistant/troubleshooting/). To isolate problems, start with a single collection before migrating all data.

## Related documentation

For more information, see the following resources:

- [Solr migration overview]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/)
- [Solr backfill guide]({{site.url}}{{site.baseurl}}/migration-assistant/solr-migration/solr-backfill-guide/) -- Step-by-step Amazon S3 backup configuration and workflow configuration for Solr.
- [Supported migration paths]({{site.url}}{{site.baseurl}}/migration-assistant/is-migration-assistant-right-for-you/)
- [Migration Assistant Schema Viewer](https://opensearch-project.github.io/opensearch-migrations/)
