---
layout: default
title: Source coordination
nav_order: 12
parent: Managing Data Prepper
---

# Source coordination

Source coordination is the concept of coordinating and distributing work between pull
based sources of Data Prepper in a multi-node environment. Some sources of Data Prepper,
such as Kinesis or SQS, handle this functionality out of the box. Other sources, such as OpenSearch, S3, DynamoDb,
or JDBC/ODBC do not support this distribution of work. 

Source coordination in Data Prepper decides which partition of work is done by 
each node in the Data Prepper cluster, and ensures that no duplicate partitions of work are completed.

Inspired by the Kinesis Client Library (https://docs.aws.amazon.com/streams/latest/dev/shared-throughput-kcl-consumers.html),
Data Prepper utilizes a distributed store in the form of a Lease Table to handle the distribution and deduplication of work.

### Partition item format
Data Prepper source coordination deals with the concept of partitions of work. For example, this may be an S3 object in the case
of S3, or an OpenSearch index for OpenSearch.

Data Prepper will take each partition of work that is chosen by the source, and
will create corresponding items in the distributed store that Data Prepper is using for source coordination.
Each of these items will have the following standard format, which can be extended by the distributed store implementation.

| Value              | Type       | Description                                                                                                                                                                                                                                         |
|--------------------|------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `sourceIdentifier` | String     | The identifier for which Data Prepper pipeline will work on this partition. By default, the `sourceIdentifier` is prefixed by the sub-pipeline name, but an additional prefix can be configured with `partition_prefix` in the data-prepper-config.yaml |
| `sourcePartitionKey` | String     | The identifier for the partition of work associated with this item. For example, for the s3 source with scan, this is the bucket                                                                                                                    |objectKey combination. |
| `partitionOwner` | String     | An identifier for the node that actively owns and is working on this partition. This id currently contains the hostname of the node, and is null when this partition is not owned                                                                   |
| `partitionProgressState` | String     | An JSON string object representing the progress made on a partition of work, or any additional metadata that may be needed by the source in the case of another node picking up where the last node left off in the case of a crash.                |
| `partitionOwnershipTimeout` | Timestamp  | Whenever a Data Prepper node acquires a partition, a 10 minute timeout is given to the ownership of this partition to handle the case of a node crashing. This ownership is renewed with another 10 minutes when state is saved for the partition.  |
| `sourcePartitionStatus` | Enum       | Represents the current state of the partition: ASSIGNED (currently being processed), UNASSIGNED (waiting to be processed), CLOSED (waiting to be processed at a later date), and COMPLETED (already processed)                                      |
| `reOpenAt` | Timestamp  | Only applicable to CLOSED partitions. Represents the time that CLOSED partitions re-open and are considered available for processing                                                                                                                |
| `closedCount` | Long       | Tracks how many times the partition has been marked as CLOSED                                                                                                                                                                                       |


### Acquiring items
Items are acquired in the order that they are returned in the `List<PartitionIdentifer>` provided by the source.
When a node attempts to acquire a partition, the ASSIGNED partitions are first queried to check if any of these ASSIGNED partitions
have expired partition ownerships. This is intended to give priority to partitions that had nodes crash in the middle of processing,
which can allow for using a partition state that may be time sensitive. After querying ASSIGNED partitions, the CLOSED partitions are queried
to see if any of their `reOpenAt` timestamps have been reached. If there are no ASSIGNED or CLOSED partitions available, then the UNASSIGNED partitions
are queried and one of them is acquired.

If this flow occurs, and no partition is acquired by the node, then the partition supplier Function provided in the `getNextPartition` method of `SourceCoordinator`
will be run to create new partitions, and after that is done then the partitions are queried again for ASSIGNED, CLOSED, and then UNASSIGNED partitions.

### Global state
The Function that is passed to the `getNextPartition` method that creates new partitions will be provided with a global state `Map<String, Object>`. This state is shared between all of the nodes in the cluster,
and is guaranteed to only be run by a single node at a time. This source can use this global state as it sees fit.

## Configuration

The following tables provide optional configuration values for `source_coordination`.

#### Source coordination configuration

| Value              | Type     | Description |
|--------------------|----------|  ----------- |
| `partition_prefix` | String   | A prefix to the `sourceIdentifier`. Can be used to differentiate between Data Prepper clusters that are sharing the same distributed store |
| `store` | Object   | The Object that makes up the configuration for the Store to be used, where the key is the name of the store (i.e. `in_memory`, `dynamodb`) and the value is any configurations available on that store type |

### Distributed Stores
The type of store used is configurable, and can be implemented as a Data Prepper Plugin.
Data Prepper currently only supports two types of store, `in_memory` and `dynamodb`. The `in_memory` store is the
default when no `source_coordination` settings are configured in the `data-prepper-config.yaml`, and it is only
useful for single node instances of Data Prepper.

The `dynamodb` store can be utilized by multi-node environments of Data Prepper. The `dynamodb` store
can be shared between one or more Data Prepper clusters that need to utilize source coordination.

##### DynamoDB store

Data Prepper will attempt to create the `dynamodb` table on startup unless the `skip_table_creation` flag is configured to `true`. Optionally,
`ttl` can be configured on the table as well, which will result in the items being cleaned up over time. Some sources will rely on source coordination for deduplication
of data, so be sure to configure a large enough `ttl` depending on how long the pipeline will be running for your use case. If `ttl` is not configured on the table, the items 
would need to be cleaned up manually when they are no longer needed.

The full set of permissions needed for Data Prepper to create the table, enable `ttl`, and interact with the table is

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
    "arn:aws:dynamodb:${REGION}:${AWS_ACCOUNT_ID}:table/${TABLE_NAME}",
    "arn:aws:dynamodb:${REGION}:${AWS_ACCOUNT_ID}:table/${TABLE_NAME}/index/source-status"
  ]
}
```

| Value                              | Type     | Description                                                                                                                                                                              |
|------------------------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `table_name`                       | String   | Required. The name of the table to be used for source coordination                                                                                                                       |
| `region`                           | String   | Required. The region of the table                                                                                                                                                        |
| `sts_role_arn`                     | String   | Optional. A role to be assumed that contains permissions to the table. If not provided, default credentials will be used                                                                 |
| `sts_external_id`                  | String   | Optional. The external id to be used in the call to assume the `sts_role_arn`                                                                                                            |
| `skip_table_creation`              | Boolean  | Optional. Defaults to false. Can be set to true if using an existing store, and the attempt to create the store will be skipped.                                                         |
| `provisioned_write_capacity_units` | Integer  | Optional. The number of write capacity units to configure on the table. Defaults to 10.                                                                                                  |
| `provisioned_read_capacity_units`  | Integer  | Optional. The number of read capacity units to configure on the table. Defaults to 10.                                                                                                   |
| `ttl`                              | Duration | Optional. The duration of the time to live for the items in the table. This TTL is extended by this duration when an update is made to the item. Defaults to no TTL being used on the table. |
  
Full configuration example

```yaml
source_coordination:
  store:
     dynamodb:
       table_name: "DataPrepperSourceCoordinationStore"
       region: "us-east-1"
       sts_role_arn: "arn:aws:iam::870201406020:role/SourceCoordinationTableRole"
       ttl: "P7D"
       skip_table_creation: true
```

##### In memory store (default)

No additional configurations available. This store is only useful for single-node environments of Data Prepper. Full configuration example:

```yaml
source_coordination:
  store:
    in_memory:
```


## Sources using source coordination
* S3 source with `scan`, where each partition is an S3 object identified in the format of `bucket|key`

## Metrics

Source coordination has metrics that are interpreted differently depending on which source is configured. The format of all metrics will be
`<sub-pipeline-name>_source_coordinator_<metric-name>`, and sub-pipeline name is used to identify which source these metrics are for, as each sub-pipeline
is unique to a single source.

Progress metrics

* `partitionsCreatedCount` - The number of partition items that have been created. For S3 scan, this is the number of objects that have had partitions created for them.
* `partitionsCompleted` - The number of partitions that have been fully processed and marked as COMPLETED. For S3 scan, this is the number of objects that have been processed.
* `noPartitionsAcquired` - The number of times that a node has attempted to acquire a partition to do work on, but has found no available partitions in the store. Can be used to indicate that there is no more data coming in the source.
* `partitionsAcquired` - The number of partitions that have been acquired by nodes to do work on. In non-error scenarios, this should be equal to the number of partitions created.
* `partitionsClosed` - The number of partitions that have been marked as CLOSED. Only applicable to sources that use the CLOSED functionality

Error metrics

* `partitionNotFoundErrors` - Indicates that a partition item that is actively owned by a node does not have a corresponding store item. This should only happen if the item in the table has been manually deleted
* `partitionNotOwnedErrors` - Indicates an issue where the node that owns a partition loses ownership due to the partition ownership timeout expiring. Unless the source is able to checkpoint with `saveState`, this will result in duplicate processing
* `partitionUpdateErrors` - The number of errors that were received when an update to the store for this partition item failed. Is prefixed with either `saveState`, `close`, or `complete` to indicate which update action is failing.


## Using source coordination for new sources

In order to use source coordination with new sources, the source plugin should implement the `UsesSourceCoordination` interface,
and this will cause the plugin to be provided with a `SourceCoordinator` object with APIs for acquiring and completing partitions.
For more details, see https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-api/src/main/java/org/opensearch/dataprepper/model/source/coordinator/SourceCoordinator.java.

The source plugin must decide how it would like to partition the data that it needs to process, and implement a Function that will return a `List<PartitionIdentifer>` that contains the unique identifier for each partition.
These items will be acquired in the order that they are returned in the `List<PartitionIdentifier>`. Note that this does not guarantee the items reach the destination sink in the same order as they are acquired, but the priority of which
partitions should be acquired will be honored.
For a full example, see https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-plugins/s3-source/src/main/java/org/opensearch/dataprepper/plugins/source/S3ScanPartitionCreationSupplier.java