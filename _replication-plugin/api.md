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

Initiate replication of an index from the leader cluster to the follower cluster. Run this operation on the follower cluster.


#### Request

```json
PUT /_plugins/_replication/<follower-index>/_start
{
   "leader_alias":"<leader-cluster-name>",
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
`leader_alias` |  The name of the leader cluster. | `string` | Yes
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

Terminates replication and converts the follower index to a standard index.

#### Request

```json
POST /_plugins/_replication/<follower-index>/_stop
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

Pauses replication of the leader index. If you don't resume replication after 12 hours, it stops completely and the follower index is converted to a standard index.

#### Request

```json
PUT /_plugins/_replication/<follower-index>/_pause
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

Resumes replication of the leader index. 

#### Request

```json
PUT /_plugins/_replication/<follower-index>/_resume
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

Gets the status of index replication. You can use this API to measure replication lag. Run this command from the leader cluster.

#### Request

```json
GET /_plugins/_replication/<follower-index>/_status
```

#### Sample response

```json
{
   "status":"SYNCING",
   "reason":"User initiated",
   "remote_cluster":"remote-cluster",
   "leader_index":"leader-01",
   "follower_index":"follower-01",
   "syncing_details":{
      "remote_checkpoint": 19,
      "local_checkpoint": 19,
      "seq_no": 20
   }
}
```

To include shard replication details in the response, add `&verbose=true`.

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

Automatically starts replication on indices matching a specified pattern. Newly created indices on the remote cluster that match one of the specified patterns will be automatically configured as follower indices. You can also use this API to update existing auto-follow patterns.

Run this command on the follower cluster.

Make sure to note the names of all auto-follow patterns after you create them. The replication plugin currently does not include an API operation to retrieve a list of existing patterns.
{: .tip }

#### Request

```json
POST /_plugins/_replication/_autofollow
{
   "leader_alias" : "<leader-cluster-name>",
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
`leader_alias` |  The name of the remote cluster to associate the pattern with. | `string` | Yes
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

Run this command on the follower cluster.

#### Request

```json
DELETE /_plugins/_replication/_autofollow
{
   "leader_alias" : "<leader-cluster-name>",
   "name": "<auto-follow-pattern-name>",
}
```

Specify the following options:

Options | Description | Type | Required
:--- | :--- |:--- |:--- |
`leader_alias` |  The name of the remote cluster that the pattern is associated with. | `string` | Yes
`name` |  The name of the pattern. | `string` | Yes

#### Sample response

```json
{
   "acknowledged": true
}
```
