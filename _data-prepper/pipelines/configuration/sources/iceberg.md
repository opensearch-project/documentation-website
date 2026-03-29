---
layout: default
title: Iceberg
parent: Sources
grand_parent: Pipelines
nav_order: 35
---

# Iceberg

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/data-prepper/issues/6552).
{: .warning}

To use this plugin, you must enable experimental plugins in `data-prepper-config.yaml`:

```yaml
experimental:
  enabled_plugins:
    source:
      - iceberg
```

The `iceberg` source enables change data capture (CDC) on [Apache Iceberg](https://iceberg.apache.org/) tables. It polls for new Iceberg snapshots and detects `INSERT`, `UPDATE`, and `DELETE` operations by computing changes between snapshots using the [`IncrementalChangelogScan`](https://iceberg.apache.org/javadoc/latest/org/apache/iceberg/IncrementalChangelogScan.html) API.

The source supports the following:
- Iceberg table format v1, v2, and v3.
- Copy-on-Write (CoW) tables only. Merge-on-Read (MoR) tables are not supported.
- Parquet, Avro, and ORC file formats.
- Any Iceberg catalog implementation, including AWS Glue Data Catalog, Hive Metastore, and REST catalogs.

The source includes two ingestion modes:

1. **Export**: An initial snapshot load that reads the current state of the table.
2. **Stream**: Polls for new snapshots and processes incremental changelog events.

## Usage

The following example pipeline specifies an `iceberg` source. It reads incremental changes from an Iceberg table using a REST catalog with S3 storage.

In the sink configuration, `action` is set to `${getMetadata("bulk_action")}` so that INSERT and UPDATE operations are upserted while DELETE operations remove the corresponding document. The `document_id` is set to `${getMetadata("document_id")}`, which joins the `identifier_columns` values so that each Iceberg row maps to a unique OpenSearch document.

```yaml
version: "2"
iceberg-cdc-pipeline:
  source:
    iceberg:
      tables:
        - table_name: "my_database.my_table"
          catalog:
            type: rest
            uri: "http://iceberg-rest-catalog:8181"
            io-impl: "org.apache.iceberg.aws.s3.S3FileIO"
            client.region: "us-east-1"
          identifier_columns: ["id"]
      polling_interval: "PT30S"
      acknowledgments: true
  sink:
    - opensearch:
        hosts: ["https://localhost:9200"]
        index: "my-index"
        action: "${getMetadata(\"bulk_action\")}"
        document_id: "${getMetadata(\"document_id\")}"
```

## Configuration options

The following tables describe the configuration options for the `iceberg` source.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`tables` | Yes | List | A list of Iceberg table configurations. See [tables](#tables) for more information.
`polling_interval` | No | Duration | How often the leader node polls for new snapshots. Supports [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601#Durations) duration notation such as `PT30S` or `PT5M`. Default is `PT30S`.
`acknowledgments` | No | Boolean | When `true`, enables [end-to-end acknowledgments]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines#end-to-end-acknowledgments). Default is `true`.
`shuffle` | No | Object | Configuration for the distributed shuffle used when processing snapshots with DELETE operations. See [shuffle](#shuffle) for more information.

### tables

Use the following options for each table entry.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`table_name` | Yes | String | The fully qualified Iceberg table name (for example, `my_database.my_table`).
`catalog` | No | Map | A map of Apache Iceberg catalog properties. See [catalog](#catalog) for common properties.
`identifier_columns` | No | List | A list of column names used as the document identifier for UPDATE and DELETE detection. Required when processing tables with UPDATE or DELETE operations. Without this, the source cannot determine document IDs or correctly detect updates.
`disable_export` | No | Boolean | When `true`, skips the initial snapshot export and starts with CDC only. Default is `false`.

### catalog

The `catalog` option accepts any property supported by the Apache Iceberg catalog implementation. For the full list of available properties, refer to the documentation for each catalog type, such as the [REST catalog](https://iceberg.apache.org/rest-catalog-spec/), [AWS Glue](https://iceberg.apache.org/docs/latest/aws/#glue-catalog), or [Hive Metastore](https://iceberg.apache.org/docs/latest/hive/#global-hive-catalog). The following are common properties:

Option | Required | Type | Description
:--- | :--- | :--- | :---
`type` | Yes | String | The catalog type. Supported values include `glue`, `hive`, `rest`, and other Iceberg catalog implementations.
`io-impl` | No | String | The FileIO implementation class. For example, `org.apache.iceberg.aws.s3.S3FileIO` for Amazon S3 or `org.apache.iceberg.hadoop.HadoopFileIO` for HDFS.

For AWS-specific catalog and S3 properties, see the [Apache Iceberg AWS integration documentation](https://iceberg.apache.org/docs/latest/aws/).

### shuffle

When processing snapshots that contain DELETE operations (UPDATE or DELETE in Copy-on-Write tables), the source uses a distributed shuffle to ensure correct results across multiple nodes. The shuffle routes all records with the same `identifier_columns` values to the same node so that matching INSERT and DELETE pairs can be resolved correctly.

The shuffle activates automatically when a snapshot contains DELETE operations. For INSERT-only snapshots, the shuffle is not used.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`partitions` | No | Integer | The number of hash partitions. Must be between 1 and 10,000. Default is `64`.
`target_partition_size` | No | String | The target size for coalesced shuffle read tasks. Small adjacent partitions are merged to reduce the number of tasks. Default is `64mb`.
`server_port` | No | Integer | The port for the HTTP server used for node-to-node shuffle data transfer. Default is `4995`.
`ssl` | No | Boolean | When `true`, enables TLS for the shuffle HTTP server. Default is `true`.
`ssl_certificate_file` | Conditionally | String | The path to the TLS certificate file in PEM format. Supports local file paths and Amazon S3 URIs (for example, `s3://my-bucket/certs/cert.pem`). Required when `ssl` is `true`.
`ssl_key_file` | Conditionally | String | The path to the TLS private key file in PEM format. Supports local file paths and Amazon S3 URIs (for example, `s3://my-bucket/certs/key.pem`). Required when `ssl` is `true`.
`ssl_insecure_disable_verification` | No | Boolean | When `true`, disables TLS certificate verification for node-to-node shuffle communication. Default is `false`.

When running multiple Data Prepper nodes, each node must be able to reach the other nodes on the configured `server_port`.

## Exposed metadata attributes

The following metadata attributes are added to each event processed by the `iceberg` source. These attributes can be accessed using the [expression syntax `getMetadata` function]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/get-metadata/).

* `bulk_action`: The recommended bulk action for the OpenSearch sink. Set to `index` for INSERT and UPDATE operations, or `delete` for DELETE operations.
* `document_id`: The document identifier, composed by joining the `identifier_columns` values with a `|` separator. Only set when `identifier_columns` is configured.
* `iceberg_operation`: The CDC operation type. One of `INSERT`, `UPDATE`, or `DELETE`.
* `iceberg_table_name`: The name of the source Iceberg table.
* `iceberg_snapshot_id`: The snapshot ID from which the event originated.

## Permissions

The required permissions depend on the catalog type and storage backend. The following is an example of the minimum IAM permissions when using AWS Glue Data Catalog and Amazon S3:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "allowReadingFromS3",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket",
        "s3:GetBucketLocation"
      ],
      "Resource": [
        "arn:aws:s3:::my-iceberg-bucket",
        "arn:aws:s3:::my-iceberg-bucket/*"
      ]
    },
    {
      "Sid": "allowGlueCatalogAccess",
      "Effect": "Allow",
      "Action": [
        "glue:GetTable",
        "glue:GetTables",
        "glue:GetDatabase",
        "glue:GetDatabases"
      ],
      "Resource": [
        "arn:aws:glue:region:account-id:catalog",
        "arn:aws:glue:region:account-id:database/*",
        "arn:aws:glue:region:account-id:table/*/*"
      ]
    }
  ]
}
```
