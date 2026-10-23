---
layout: default
title: Source coordination
nav_order: 35
parent: Managing OpenSearch Data Prepper
---

# Source coordination

_Source coordination_ is the concept of coordinating and distributing work between OpenSearch Data Prepper data sources in a multi-node environment. Some data sources, such as Amazon Kinesis or Amazon Simple Queue Service (Amazon SQS), handle coordination natively. Other data sources, such as OpenSearch, Amazon Simple Storage Service (Amazon S3), Amazon DynamoDB, and JDBC/ODBC, do not support source coordination.

Data Prepper source coordination decides which partition of work is performed by each node in the Data Prepper cluster and prevents duplicate partitions of work.

Inspired by the [Kinesis Client Library](https://docs.aws.amazon.com/streams/latest/dev/shared-throughput-kcl-consumers.html), Data Prepper utilizes a distributed store in the form of a lease to handle the distribution and deduplication of work.

## Formatting partitions

Source coordination separates sources into "partitions of work." For example, an S3 object would be a partition of work for Amazon S3, or an OpenSearch index would be a partition of work for OpenSearch.

Data Prepper takes each partition of work that is chosen by the source and creates corresponding items in the distributed store that Data Prepper uses for source coordination. Each of these items has the following standard format, which can be extended by the distributed store implementation.

| Value | Type | Description |
| :--- | :--- | :--- |
| `sourceIdentifier` | String  | The identifier for which the Data Prepper pipeline works on this partition. By default, the `sourceIdentifier` is prefixed by the sub-pipeline name, but an additional prefix can be configured with `partition_prefix` in your data-prepper-config.yaml file. |
| `sourcePartitionKey` | String  | The identifier for the partition of work associated with this item. For example, for an `s3` source with scan capabilities, this identifier is the S3 bucket's `objectKey` combination.
| `partitionOwner` | String   | An identifier for the node that actively owns and is working on this partition. This ID contains the hostname of the node but is `null` when this partition is not owned. |
| `partitionProgressState` | String  | A JSON string object representing the progress made on a partition of work or any additional metadata that may be needed by the source in the case of another node resuming where the last node stopped during a crash.  |
| `partitionOwnershipTimeout` | Timestamp  | Whenever a Data Prepper node acquires a partition, a 10-minute timeout is given to the owner of the partition to handle the event of a node crashing. The ownership is renewed with another 10 minutes when the owner saves the state of the partition.  |
| `sourcePartitionStatus` | Enum | Represents the current state of the partition: `ASSIGNED` means the partition is currently being processed, `UNASSIGNED` means the partition is waiting to be processed, `CLOSED` means the partition is waiting to be processed at a later date, and `COMPLETED` means the partition has already been processed. |           
| `reOpenAt` | Timestamp  | Represents the time at which CLOSED partitions reopen and are considered to be available for processing. Only applies to CLOSED partitions. |
| `closedCount` | Long | Tracks how many times the partition has been marked as `CLOSED`.|


## Acquiring partitions

Partitions are acquired in the order that they are returned in the `List<PartitionIdentifer>` provided by the source. When a node attempts to acquire a partition, Data Prepper performs the following steps:

1. Data Prepper queries the `ASSIGNED` partitions to check whether any `ASSIGNED` partitions have expired partition owners. This is intended to assign priority to partitions that have had nodes crash in the middle of processing, which can allow for using a partition state that may be time sensitive. 
2. After querying `ASSIGNED` partitions, Data Prepper queries the `CLOSED` partitions to determine whether any of the partition's `reOpenAt` timestamps have been reached. 
3. If there are no `ASSIGNED` or `CLOSED` partitions available, then Data Prepper queries the `UNASSIGNED` partitions until on of these partitions is `ASSIGNED`.

If this flow occurs and no partition is acquired by the node, then the partition supplier function provided in the `getNextPartition` method of `SourceCoordinator` will create new partitions. After the supplier function completes, Data Prepper again queries the partitions for `ASSIGNED`, `CLOSED`, and `UNASSIGNED`.

## Global state

Any function that is passed to the `getNextPartition` method creates new partitions with a global state of `Map<String, Object>`. This state is shared between all of the nodes in the cluster and will only be run by a single node at a time, as determined by the source.

## Configuration

The following table provides optional configuration values for `source_coordination`.

| Value | Type | Description |
| :--- | :--- | :--- |
| `partition_prefix` | String | A prefix to the `sourceIdentifier` used to differentiate between Data Prepper clusters that share the same distributed store. |
| `store` | Object  | An object containing a key-value pair that configures the store. The key is the store name, such as `in_memory` or `dynamodb`, and the value is an object containing the options for that store. For a list of all supported stores, see [Supported stores](#supported-stores). |

### Supported stores

Data Prepper supports the following source coordination stores.

| Store | Environment | Description |
| :--- | :--- | :--- |
| `in_memory` | Single node | The default store when no `source_coordination` settings are configured in the `data-prepper-config.yaml` file. For more information, see [In-memory store](#in-memory-store). |
| `dynamodb` | Multi-node | Stores coordination data in Amazon DynamoDB. Multiple Data Prepper clusters that use source coordination can share the store. For more information, see [DynamoDB store](#dynamodb-store). |
| `jdbc` | Multi-node | Stores coordination data in PostgreSQL or MySQL. For more information, see [JDBC store](#jdbc-store). |

#### In-memory store

The `in_memory` store is the default store and does not have any options. Use it only for single-node Data Prepper deployments.

The following example configures the `in_memory` store:

```yaml
source_coordination:
  store:
    in_memory:
```
{% include copy.html %}

#### DynamoDB store

The `dynamodb` store uses an Amazon DynamoDB table to coordinate work across Data Prepper nodes. Multiple Data Prepper clusters can share the same table. To differentiate between the clusters, configure `partition_prefix`.

By default, Data Prepper creates the table and its index when the store starts. Set `skip_table_creation` to `true` when the table already exists. The following policy statement grants the permissions that Data Prepper requires to create the table, enable TTL, and read and write items:

```json
{
  "Sid": "ReadWriteSourceCoordinationDynamoStore",
  "Effect": "Allow",
  "Action": [
    "dynamodb:DescribeTimeToLive",
    "dynamodb:UpdateTimeToLive",
    "dynamodb:DescribeTable",
    "dynamodb:CreateTable",
    "dynamodb:GetItem",
    "dynamodb:PutItem",
    "dynamodb:Query"
  ],
  "Resource": [
    "arn:aws:dynamodb:<region>:<account-id>:table/<table-name>",
    "arn:aws:dynamodb:<region>:<account-id>:table/<table-name>/index/source-status"
  ]
}
```
{% include copy.html %}

You can configure `ttl` to enable DynamoDB [Time to Live (TTL)](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html), which removes expired items from the table. Some sources use these items to prevent duplicate processing, so configure a `ttl` that exceeds the expected pipeline duration. If you don't configure `ttl`, you must manually delete items that are no longer needed.

When `skip_table_creation` is `true`, Data Prepper does not enable TTL on the table. If you configure `ttl` for an existing table, enable TTL on the table's `expirationTime` attribute before starting Data Prepper.

The `dynamodb` store supports the following options.

| Option | Required | Type | Description |
| :--- | :--- | :--- | :--- |
| `table_name` | Yes | String | The name of the table used for source coordination. |
| `region` | Yes | String | The AWS Region of the DynamoDB table. |
| `sts_role_arn` | No | String | The Amazon Resource Name (ARN) of the AWS Identity and Access Management (IAM) role that has the table permissions. If not provided, Data Prepper uses the default credentials. |
| `sts_external_id` | No | String | The external ID used in the API call to assume the `sts_role_arn` role. |
| `skip_table_creation` | No | Boolean | When set to `true`, Data Prepper does not create the table. Default is `false`. |
| `provisioned_write_capacity_units` | No | Integer | The number of write capacity units to configure on the table. Default is `10`. |
| `provisioned_read_capacity_units` | No | Integer | The number of read capacity units to configure on the table. Default is `10`. |
| `ttl` | No | Duration | The duration used to set the expiration time for items in the table. Use ISO 8601 duration format, such as `P7D`. Data Prepper extends the expiration time when it updates an item. By default, items do not expire. |

The following example configures a DynamoDB table as the source coordination store:

```yaml
source_coordination:
  store:
    dynamodb:
      table_name: "DataPrepperSourceCoordinationStore"
      region: "us-east-1"
      sts_role_arn: "arn:aws:iam::123456789012:role/SourceCoordinationTableRole"
      ttl: "P7D"
      skip_table_creation: true
```
{% include copy.html %}

#### JDBC store

The `jdbc` store uses a relational database to coordinate work across Data Prepper nodes. Data Prepper includes Java Database Connectivity (JDBC) drivers for PostgreSQL and MySQL.

By default, Data Prepper creates the coordination table and its index when the store starts. The database user must have privileges to create the table and index and to select, insert, update, and delete rows. Set `skip_table_creation` to `true` when the required table and index already exist.

You can configure `ttl` to periodically remove expired partition records. Some sources use these records to prevent duplicate processing, so configure a `ttl` that exceeds the expected pipeline duration.

The `jdbc` store supports the following options.

| Option | Required | Type | Description |
| :--- | :--- | :--- | :--- |
| `url` | Yes | String | The JDBC connection URL. |
| `username` | Yes | String | The database username. |
| `password` | Yes | String | The database password. |
| `table_name` | No | String | The name of the table used for source coordination. You can specify an unqualified name or a schema-qualified name, such as `schema.table`. Default is `source_coordination`. |
| `skip_table_creation` | No | Boolean | When set to `true`, Data Prepper does not create the coordination table or its index. Default is `false`. |
| `max_pool_size` | No | Integer | The maximum number of connections in the JDBC connection pool. Minimum is `1`. Default is `5`. |
| `ttl` | No | Duration | The duration used to set the expiration time for partition records. Use ISO 8601 duration format, such as `P7D`. Data Prepper extends the expiration time when it updates a record. By default, records do not expire. |
| `connection_properties` | No | Map | JDBC driver properties to pass to each database connection. |

The following example configures a PostgreSQL database as the source coordination store:

```yaml
source_coordination:
  store:
    jdbc:
      url: "jdbc:postgresql://db:5432/dataprepper"
      username: "dp_user"
      password: {% raw %}"${{aws_secrets:db-secrets:password}}"{% endraw %}
      table_name: "source_coordination"
      max_pool_size: 5
      ttl: "P7D"
      connection_properties:
        ssl: "true"
```
{% include copy.html %}

## Metrics

Source coordination metrics are interpreted differently depending on which source is configured. The format of a source coordination metric is `<sub-pipeline-name>_source_coordinator_<metric-name>`. You can use the sub-pipeline name to identify the source for these metrics because each sub-pipeline is unique to each source.

### Progress metrics

The following are metrics related to partition progress:

* `partitionsCreatedCount`: The number of partition items that have been created. For an S3 scan, this is the number of objects that have had partitions created for them.
* `partitionsCompleted`: The number of partitions that have been fully processed and marked as `COMPLETED`. For an S3 scan, this is the number of objects that have been processed.
* `noPartitionsAcquired`: The number of times that a node has attempted to acquire a partition on which to perform work but has found no available partitions in the store. Use this to indicate that there is no more data coming into the source.
* `partitionsAcquired`: The number of partitions that have been acquired by nodes on which to perform work. In non-error scenarios, this should be equal to the number of partitions created.
* `partitionsClosed`: The number of partitions that have been marked as `CLOSED`. This is only applicable to sources that use the CLOSED functionality.

The following are metrics related to partition errors:

* `partitionNotFoundErrors`: Indicates that a partition item that is actively owned by a node does not have a corresponding store item. This should only occur if an item in the table has been manually deleted.
* `partitionNotOwnedErrors`: Indicates that a node that owns a partition has lost ownership due to the partition ownership timeout expiring. Unless the source is able to checkpoint the partition with `saveState`, this error results in duplicate item processing.
* `partitionUpdateErrors`: The number of errors that were received when an update to the store for this partition item failed. Is prefixed with either `saveState`, `close`, or `complete` to indicate which update action is failing.

