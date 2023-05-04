---
layout: default
title: API
nav_order: 50
parent: Cross-cluster replication
redirect_from:
  - /replication-plugin/api/
---

# Cross-cluster replication API

Use these replication operations to programmatically manage cross-cluster replication.

#### Table of contents
- TOC
{:toc}

## Start replication
Introduced 1.1
{: .label .label-purple }

Initiate replication of an index from the leader cluster to the follower cluster. Send this request to the follower cluster.


#### Request

```json
PUT /_plugins/_replication/<follower-index>/_start
{
   "leader_alias":"<connection-alias-name>",
   "leader_index":"<index-name>",
   "use_roles":{
      "leader_cluster_role":"<role-name>",
      "follower_cluster_role":"<role-name>"
   }
}
```

Specify the following options:

Options | Description | Type | Required
:--- | :--- |:--- |:--- |
`leader_alias` |  The name of the cross-cluster connection. You define this alias when you [set up a cross-cluster connection]({{site.url}}{{site.baseurl}}/replication-plugin/get-started/#set-up-a-cross-cluster-connection). | `string` | Yes
`leader_index` |  The index on the leader cluster that you want to replicate. | `string` | Yes
`use_roles` |  The roles to use for all subsequent backend replication tasks between the indexes. Specify a `leader_cluster_role` and `follower_cluster_role`. See [Map the leader and follower cluster roles]({{site.url}}{{site.baseurl}}/replication-plugin/permissions/#map-the-leader-and-follower-cluster-roles). | `string` | If Security plugin is enabled

#### Example response

```json
{
   "acknowledged": true
}
```

## Stop replication
Introduced 1.1
{: .label .label-purple }

Terminates replication and converts the follower index to a standard index. Send this request to the follower cluster.

#### Request

```json
POST /_plugins/_replication/<follower-index>/_stop
{}
```

#### Example response

```json
{
   "acknowledged": true
}
```

## Pause replication
Introduced 1.1
{: .label .label-purple }

Pauses replication of the leader index. Send this request to the follower cluster.

#### Request

```json
POST /_plugins/_replication/<follower-index>/_pause 
{}
```

You can't resume replication after it's been paused for more than 12 hours. You must [stop replication]({{site.url}}{{site.baseurl}}/replication-plugin/api/#stop-replication), delete the follower index, and restart replication of the leader.

#### Example response

```json
{
   "acknowledged": true
}
```

## Resume replication
Introduced 1.1
{: .label .label-purple }

Resumes replication of the leader index. Send this request to the follower cluster.

#### Request

```json
POST /_plugins/_replication/<follower-index>/_resume
{}
```

#### Example response

```json
{
   "acknowledged": true
}
```

## Get replication status
Introduced 1.1
{: .label .label-purple }

Gets the status of index replication. Possible statuses are `SYNCING`, `BOOTSTRAPING`, `PAUSED`, and `REPLICATION NOT IN PROGRESS`. Use the syncing details to measure replication lag. Send this request to the follower cluster.

#### Request

```json
GET /_plugins/_replication/<follower-index>/_status
```

#### Example response

```json
{
  "status" : "SYNCING",
  "reason" : "User initiated",
  "leader_alias" : "my-connection-name",
  "leader_index" : "leader-01",
  "follower_index" : "follower-01",
  "syncing_details" : {
    "leader_checkpoint" : 19,
    "follower_checkpoint" : 19,
    "seq_no" : 0
  }
}
```
To include shard replication details in the response, add the `&verbose=true` parameter.

The leader and follower checkpoint values begin as negative integers and reflect the shard count (-1 for one shard, -5 for five shards, and so on). The values increment toward positive integers with each change that you make. For example, when you make a change on the leader index, the `leader_checkpoint` becomes `0`. The `follower_checkpoint` is initially still `-1` until the follower index pulls the change from the leader, at which point it increments to `0`. If the values are the same, it means the indexes are fully synced.

## Get leader cluster stats
Introduced 1.1
{: .label .label-purple }

Gets information about replicated leader indexes on a specified cluster. 

#### Request

```json
GET /_plugins/_replication/leader_stats
```

#### Example response

```json
{
   "num_replicated_indices": 2,
   "operations_read": 15,
   "translog_size_bytes": 1355,
   "operations_read_lucene": 0,
   "operations_read_translog": 15,
   "total_read_time_lucene_millis": 0,
   "total_read_time_translog_millis": 659,
   "bytes_read": 1000,
   "index_stats":{
      "leader-index-1":{
         "operations_read": 7,
         "translog_size_bytes": 639,
         "operations_read_lucene": 0,
         "operations_read_translog": 7,
         "total_read_time_lucene_millis": 0,
         "total_read_time_translog_millis": 353,
         "bytes_read":466
      },
      "leader-index-2":{
         "operations_read": 8,
         "translog_size_bytes": 716,
         "operations_read_lucene": 0,
         "operations_read_translog": 8,
         "total_read_time_lucene_millis": 0,
         "total_read_time_translog_millis": 306,
         "bytes_read": 534
      }
   }
}
```

## Get follower cluster stats
Introduced 1.1
{: .label .label-purple }

Gets information about follower (syncing) indexes on a specified cluster. 

#### Request

```json
GET /_plugins/_replication/follower_stats
```

#### Example response

```json
{
   "num_syncing_indices": 2,
   "num_bootstrapping_indices": 0,
   "num_paused_indices": 0,
   "num_failed_indices": 0,
   "num_shard_tasks": 2,
   "num_index_tasks": 2,
   "operations_written": 3,
   "operations_read": 3,
   "failed_read_requests": 0,
   "throttled_read_requests": 0,
   "failed_write_requests": 0,
   "throttled_write_requests": 0,
   "follower_checkpoint": 1,
   "leader_checkpoint": 1,
   "total_write_time_millis": 2290,
   "index_stats":{
      "follower-index-1":{
         "operations_written": 2,
         "operations_read": 2,
         "failed_read_requests": 0,
         "throttled_read_requests": 0,
         "failed_write_requests": 0,
         "throttled_write_requests": 0,
         "follower_checkpoint": 1,
         "leader_checkpoint": 1,
         "total_write_time_millis": 1355
      },
      "follower-index-2":{
         "operations_written": 1,
         "operations_read": 1,
         "failed_read_requests": 0,
         "throttled_read_requests": 0,
         "failed_write_requests": 0,
         "throttled_write_requests": 0,
         "follower_checkpoint": 0,
         "leader_checkpoint": 0,
         "total_write_time_millis": 935
      }
   }
}
```

## Get auto-follow stats
Introduced 1.1
{: .label .label-purple }

Gets information about auto-follow activity and any replication rules configured on the specified cluster.

#### Request

```json
GET /_plugins/_replication/autofollow_stats
```

#### Example response

```json
{
   "num_success_start_replication": 2,
   "num_failed_start_replication": 0,
   "num_failed_leader_calls": 0,
   "failed_indices":[
      
   ],
   "autofollow_stats":[
      {
         "name":"my-replication-rule",
         "pattern":"movies*",
         "num_success_start_replication": 2,
         "num_failed_start_replication": 0,
         "num_failed_leader_calls": 0,
         "failed_indices":[
            
         ]
      }
   ]
}
```

## Update settings
Introduced 1.1
{: .label .label-purple }

Updates settings on the follower index.

#### Request

```json
PUT /_plugins/_replication/<follower-index>/_update
{
   "settings":{
      "index.number_of_shards": 4,
      "index.number_of_replicas": 2
   }
}
```

#### Example response

```json
{
   "acknowledged": true
}
```

## Create replication rule
Introduced 1.1
{: .label .label-purple }

Automatically starts replication on indexes matching a specified pattern. If a new index on the leader cluster matches the pattern, OpenSearch automatically creates a follower index and begins replication. You can also use this API to update existing replication rules.

Send this request to the follower cluster.

Make sure to note the names of all auto-follow patterns after you create them. The replication plugin currently does not include an API operation to retrieve a list of existing patterns.
{: .tip }

#### Request

```json
POST /_plugins/_replication/_autofollow
{
   "leader_alias" : "<connection-alias-name>",
   "name": "<auto-follow-pattern-name>",
   "pattern": "<pattern>",
   "use_roles":{
      "leader_cluster_role": "<role-name>",
      "follower_cluster_role": "<role-name>"
   }
}
```

Specify the following options:

Options | Description | Type | Required
:--- | :--- |:--- |:--- |
`leader_alias` |  The name of the cross-cluster connection. You define this alias when you [set up a cross-cluster connection]({{site.url}}{{site.baseurl}}/replication-plugin/get-started/#set-up-a-cross-cluster-connection). | `string` | Yes
`name` |  A name for the auto-follow pattern. | `string` | Yes
`pattern` |  An array of index patterns to match against indexes in the specified leader cluster. Supports wildcard characters. For example, `leader-*`. | `string` | Yes
`use_roles` |  The roles to use for all subsequent backend replication tasks between the indexes. Specify a `leader_cluster_role` and `follower_cluster_role`. See [Map the leader and follower cluster roles]({{site.url}}{{site.baseurl}}/replication-plugin/permissions/#map-the-leader-and-follower-cluster-roles). | `string` | If Security plugin is enabled

#### Example response

```json
{
   "acknowledged": true
}
```

## Delete replication rule
Introduced 1.1
{: .label .label-purple }

Deletes the specified replication rule. This operation prevents any new indexes from being replicated but does not stop existing replication that the rule has already initiated. Replicated indexes remain read-only until you stop replication.

Send this request to the follower cluster.

#### Request

```json
DELETE /_plugins/_replication/_autofollow
{
   "leader_alias" : "<connection-alias-name>",
   "name": "<auto-follow-pattern-name>",
}
```

Specify the following options:

Options | Description | Type | Required
:--- | :--- |:--- |:--- |
`leader_alias` |  The name of the cross-cluster connection. You define this alias when you [set up a cross-cluster connection]({{site.url}}{{site.baseurl}}/replication-plugin/get-started/#set-up-a-cross-cluster-connection). | `string` | Yes
`name` |  The name of the pattern. | `string` | Yes

#### Example response

```json
{
   "acknowledged": true
}
```
