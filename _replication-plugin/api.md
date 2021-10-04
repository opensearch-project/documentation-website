---
layout: default
title: API
nav_order: 50
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
`use_roles` |  The roles to use for all subsequent backend replication tasks between the indices. Specify a `leader_cluster_role` and `follower_cluster_role`. See [Map the leader and follower cluster roles]({{site.url}}{{site.baseurl}}/replication-plugin/permissions/#map-the-leader-and-follower-cluster-roles). | `string` | If security plugin is enabled

#### Sample response

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

#### Sample response

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

#### Sample response

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

#### Sample response

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

#### Sample response

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

The leader and follower checkpoint values begin as negative integers and reflect the number of shards you have (-1 for one shard, -5 for five shards, and so on). The values increment to positive integers with each change that you make. For example, when you make a change on the leader index, the `leader_checkpoint` becomes `0`. The `follower_checkpoint` is initially still `-1` until the follower index pulls the change from the leader, at which point it increments to `0`. If the values are the same, it means the indices are fully synced.

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

#### Sample response

```json
{
   "acknowledged": true
}
```

## Create replication rule
Introduced 1.1
{: .label .label-purple }

Automatically starts replication on indices matching a specified pattern. If a new index on the leader cluster matches the pattern, OpenSearch automatically creates a follower index and begins replication. You can also use this API to update existing replication rules.

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
`pattern` |  An array of index patterns to match against indices in the specified leader cluster. Supports wildcard characters. For example, `leader-*`. | `string` | Yes
`use_roles` |  The roles to use for all subsequent backend replication tasks between the indices. Specify a `leader_cluster_role` and `follower_cluster_role`. See [Map the leader and follower cluster roles]({{site.url}}{{site.baseurl}}/replication-plugin/permissions/#map-the-leader-and-follower-cluster-roles). | `string` | If security plugin is enabled

#### Sample response

```json
{
   "acknowledged": true
}
```

## Delete replication rule
Introduced 1.1
{: .label .label-purple }

Deletes the specified replication rule. This operation prevents any new indices from being replicated but does not stop existing replication that the rule has already initiated.

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

#### Sample response

```json
{
   "acknowledged": true
}
```
