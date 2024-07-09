---
layout: default
title: Recover index
parent: Index APIs
nav_order: 62
---

# Recover Index 
Introduced 1.0
{: .label .label-purple }

The Recover Index API gives information about any completed or ongoing shard recoveries for one or more indexes. If a data stream is listed, the API returns information about that data stream's backing index. 

Shard recovery is the process of starting a shard copy for restoring a primary shard from a snapshot or syncing a replica shard. Once a shard recovery is complete, the recovered shard becomes available for searching and indexing operations.

Shard recovery occurs automatically in the following scenarios:

- Node startup, known as a local store recovery.
- Replication of a primary shard.
- Relocation of a shard to a different node within the same cluster.
- Restoration of a snapshot.
- Clone, shrink, or split operations.

The Recover Index API provides information only about completed recoveries for shard copies that currently exist in the cluster. It reports only the most recent recovery for each shard copy and does not include historical information about previous recoveries or information about recoveries of shard copies that no longer exist. Consequently, if a shard copy completes a recovery and is subsequently relocated to a different node, the information about the original recovery will not be displayed in the Recover Index API.


## HTTP and Path Methods

```
GET /_recovery
GET /<index-name>/recovery/
```

## Path parameters

Parameter | Type | Description 
:--- | :--- 
`index-name` | String | The index name. Must conform to the [index naming restrictions](#index-naming-restrictions). Required. 


## Query parameters

All of the following query parameters are optional.

Parameter | Type | Description 
:--- | :--- | :---  
`active_only` | Boolean | When `true`, the response only includes active shard recoveries. Default is `false`.
`detailed` | Boolean | When `true`, gives detailed information about shard recoveries. Default is `false`.
`index`  | String | A comma-separated list or wildcard expression of index names used to limit the request.

## Response body

The API responds with the following information about the recovery shard:

Parameter | Type | Description 
:--- | :--- | :--- 
`id` | Integer | The ID of the shard. 
`type` | String | The cecovery source for the shard. Returned values include: <br> - `EMPTY_STORE`: An empty store. Indicates a new primary shard or the forced allocation of an empty primary shard using the cluster reroute API. <br> - `EXISTING_STORE`: The store of an existing primary shard. Indicates recovery is related to node startup or the allocation of an existing primary shard. <br> - `LOCAL_SHARDS`: Shards of another index on the same node. Indicates recovery is related to a clone, shrink, or split operation. <br> - `PEER`: A primary shard on another node. Indicates recovery is related to shard replication. <br> - `SNAPSHOT`: A snapshot. Indicates recovery is related to a snapshot restore operation. 
`STAGE` | String | The recovery stage. Returned values can include: <br> - `INIT`: Recovery has not started. <br> - `INDEX`: Reading index metadata and copying bytes from source to destination. <br> - `VERIFY_INDEX`: Verifying the integrity of the index. <br> - `TRANSLOG`: Replaying transaction log. <br> - `FINALIZE`: Cleanup. <br> - `DONE`: Complete. 
`primary` | Boolean | When `true`, the shard is a primary shard. 
`start_time` | String | The timestamp for when the recovery started. 
`stop_time` | String | The timestamp for when the recovery finished. 
`total_time_in_millis` | String | The total time to recover shard in milliseconds. 
`source` | Object | The recovery source. This can include  repository description if recovery is from a snapshot or a description of source node. 
`target` | Object | The destination node. 
`index` | Object | The statistics about physical index recovery. 
`translog` | Object | The statistics about translog recovery. 
 `start` | Object | The statistics about time to open and start the index. 

## Example requests

The following examples show how the Recover Index API works.

### Recover information from several or all indexes

The following example request returns recovery information about several indexes 