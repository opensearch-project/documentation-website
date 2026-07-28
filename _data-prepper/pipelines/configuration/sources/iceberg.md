---
layout: default
title: Iceberg
parent: Sources
grand_parent: Pipelines
nav_order: 35
---

# Iceberg source

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/data-prepper/issues/6552).
{: .warning}

The `iceberg` source provides change data capture (CDC) on [Apache Iceberg](https://iceberg.apache.org/) tables. It polls for new Iceberg snapshots and detects `INSERT`, `UPDATE`, and `DELETE` operations by computing changes between snapshots using the [`IncrementalChangelogScan`](https://iceberg.apache.org/javadoc/latest/org/apache/iceberg/IncrementalChangelogScan.html) API.

The source supports the following:
- Iceberg table format v1, v2, and v3.
- Copy-on-Write (CoW) tables only. Merge-on-Read (MoR) tables are not supported.
- Parquet, Avro, and ORC file formats.
- Any Iceberg catalog implementation, including AWS Glue Data Catalog, Hive Metastore, and REST catalogs.

The source includes two ingestion modes:

1. **Export**: An initial snapshot load that reads the current state of the table.
2. **Stream**: Polls for new snapshots and processes incremental changelog events.

## Prerequisites

To use the Iceberg source, you must enable the experimental `iceberg` plugin in `data-prepper-config.yaml`:

```yaml
experimental:
  enabled_plugins:
    source:
      - iceberg
```
{% include copy.html %}

## Usage

The following example pipeline specifies an `iceberg` source. It reads incremental changes from an Iceberg table using a REST catalog with Amazon S3 storage. The `catalog` is defined at the top level so that all tables share the same catalog configuration.

In the sink configuration, `action` is set to `${getMetadata("bulk_action")}` so that `INSERT` and `UPDATE` operations upsert the document while `DELETE` operations remove it. The `document_id` is set to `${getMetadata("document_id")}`, which concatenates the `identifier_columns` values using a `|` separator so that each Iceberg row maps to a unique OpenSearch document:

```yaml
version: "2"
iceberg-cdc-pipeline:
  source:
    iceberg:
      catalog:
        type: rest
        uri: "http://iceberg-rest-catalog:8181"
        io-impl: "org.apache.iceberg.aws.s3.S3FileIO"
        client.region: "us-east-1"
      tables:
        - table_name: "my_database.my_table"
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
{% include copy.html %}

To use a different catalog for a specific table, specify `catalog` at the table level to override the top-level definition:

```yaml
iceberg:
  catalog:
    type: rest
    uri: "http://iceberg-rest-catalog:8181"
    io-impl: "org.apache.iceberg.aws.s3.S3FileIO"
  tables:
    - table_name: "db.table_a"
      identifier_columns: ["id"]
    - table_name: "db.table_b"
      identifier_columns: ["id"]
      catalog:
        type: glue
        warehouse: "s3://other-bucket/warehouse"
        io-impl: "org.apache.iceberg.aws.s3.S3FileIO"
```
{% include copy.html %}

## Configuration options

The `iceberg` source supports the following configuration options.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`catalog` | No | Map | Default catalog properties applied to all tables. When a table specifies its own `catalog`, the table-level definition fully replaces the top-level one. For common properties, see [catalog](#catalog).
`tables` | Yes | List | A list of Iceberg table configurations. For supported options, see [tables](#tables).
`polling_interval` | No | Duration | How often the leader node polls for new snapshots. Supports [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601#Durations) duration notation such as `PT30S` or `PT5M`. Default is `PT30S`.
`acknowledgments` | No | Boolean | When `true`, enables [end-to-end acknowledgments]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/pipelines#end-to-end-acknowledgments). Default is `true`.
`shuffle` | No | Object | Configuration for the distributed shuffle used when processing snapshots with `DELETE` operations. For supported options, see [shuffle](#shuffle).

<!-- vale off -->
### tables
<!-- vale on -->

Use the following options for each table entry.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`table_name` | Yes | String | The fully qualified Iceberg table name (for example, `my_database.my_table`).
`catalog` | No | Map | A map of Apache Iceberg catalog properties. When specified, fully replaces the top-level `catalog`. For common properties, see [catalog](#catalog).
`identifier_columns` | No | List | A list of column names used as the document identifier for `UPDATE` and `DELETE` detection. Required when processing tables with `UPDATE` or `DELETE` operations. If not specified, the source cannot determine document IDs or correctly detect updates.
`disable_export` | No | Boolean | When `true`, skips the initial snapshot export and starts with CDC only. Default is `false`.

<!-- vale off -->
### catalog
<!-- vale on -->

The `catalog` option accepts any property supported by the Apache Iceberg catalog implementation. For the full list of available properties, see the documentation for each catalog type, such as the [REST catalog](https://iceberg.apache.org/rest-catalog-spec/), [AWS Glue](https://iceberg.apache.org/docs/latest/aws/#glue-catalog), or [Hive Metastore](https://iceberg.apache.org/docs/latest/hive/#global-hive-catalog). The following table lists the common properties.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`type` | Yes | String | The catalog type. Supported values include `glue`, `hive`, `rest`, and other Iceberg catalog implementations.
`io-impl` | No | String | The FileIO implementation class. For example, `org.apache.iceberg.aws.s3.S3FileIO` for Amazon S3 or `org.apache.iceberg.hadoop.HadoopFileIO` for HDFS. When not specified, each catalog uses its own default (REST catalogs use `ResolvingFileIO`, which is selected automatically based on file path scheme, Glue uses `S3FileIO`, Hadoop and JDBC use `HadoopFileIO`).

For AWS-specific catalog and S3 properties, see the [Apache Iceberg AWS integration documentation](https://iceberg.apache.org/docs/latest/aws/).

<!-- vale off -->
### shuffle
<!-- vale on -->

When processing snapshots that contain `DELETE` operations (`UPDATE` or `DELETE` in Copy-on-Write tables), the source uses a distributed shuffle to ensure correct results across multiple nodes. The shuffle routes all records containing the same `identifier_columns` values to the same node so that matching `INSERT` and `DELETE` pairs can be resolved correctly.

The shuffle activates automatically when a snapshot contains `DELETE` operations. For `INSERT`-only snapshots, the shuffle is not used.

The following table lists the `shuffle` configuration options.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`partitions` | No | Integer | The number of hash partitions. Must be 1--10,000. Default is `64`.
`target_partition_size` | No | String | The target size for coalesced shuffle read tasks. Small adjacent partitions are merged to reduce the number of tasks. Default is `64mb`.
`storage_path` | No | String | The local directory for intermediate shuffle files. Default is `${data-prepper.dir}/data/shuffle` when `data-prepper.dir` is set, otherwise `${java.io.tmpdir}/data-prepper-shuffle`.
`port` | No | Integer | The port for the HTTP server used for node-to-node shuffle data transfer. Default is `4995`.
`ssl` | No | Boolean | When `true`, enables Transport Layer Security (TLS) for the shuffle HTTP server. Default is `true`.
`ssl_certificate_file` | Conditionally | String | The path to the TLS certificate file in PEM format. Supports local file paths and Amazon S3 URIs (for example, `s3://my-bucket/certs/cert.pem`). Required when `ssl` is `true` and `use_acm_certificate_for_ssl` is `false`.
`ssl_key_file` | Conditionally | String | The path to the TLS private key file in PEM format. Supports local file paths and Amazon S3 URIs (for example, `s3://my-bucket/certs/key.pem`). Required when `ssl` is `true` and `use_acm_certificate_for_ssl` is `false`.
`use_acm_certificate_for_ssl` | No | Boolean | When `true`, uses AWS Certificate Manager (ACM) for TLS certificates instead of `ssl_certificate_file` and `ssl_key_file`. Default is `false`.
`acm_certificate_arn` | Conditionally | String | The ACM certificate ARN. Required when `use_acm_certificate_for_ssl` is `true`.
`aws_region` | Conditionally | String | The AWS Region for ACM or S3 certificate access. Required when `use_acm_certificate_for_ssl` is `true` or when certificate files are in Amazon S3.
`ssl_client_auth` | No | Boolean | When `true`, enables mutual TLS (mTLS) for node-to-node authentication. All nodes must present a valid client certificate during shuffle communication. Default is `false`.
`ssl_insecure_disable_verification` | No | Boolean | When `true`, disables TLS certificate verification for node-to-node shuffle communication. Default is `false`.

When running multiple Data Prepper nodes, each node must be able to reach the other nodes on the configured `port`.
{: .note}

## Exposed metadata attributes

The following metadata attributes are added to each event processed by the `iceberg` source. These attributes can be accessed using the [expression syntax `getMetadata` function]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/get-metadata/):

- `bulk_action`: The recommended bulk action for the OpenSearch sink. Set to `index` for `INSERT` and `UPDATE` operations, or `delete` for `DELETE` operations.
- `document_id`: The document identifier, composed by joining the `identifier_columns` values with a `|` separator. Only set when `identifier_columns` is configured.
- `iceberg_operation`: The CDC operation type. Set to `INSERT` or `DELETE`. When a row is updated in Iceberg, the source receives a `DELETE` and `INSERT` pair with the same `identifier_columns` values. The source recognizes this as an update and emits only the `INSERT` event, because upserting by `document_id` produces the correct result without a separate delete.
- `iceberg_table_name`: The name of the source Iceberg table.
- `iceberg_snapshot_id`: The snapshot ID from which the event originated.

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
{% include copy.html %}
