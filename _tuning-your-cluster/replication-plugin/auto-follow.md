---
layout: default
title: Auto-follow
nav_order: 20
parent: Cross-cluster replication
redirect_from:
  - /replication-plugin/auto-follow/
---

# Auto-follow for cross-cluster replication

Auto-follow lets you automatically replicate indexes created on the leader cluster based on matching patterns. When you create an index on the leader cluster with a name that matches a specified pattern (for example, `index-01*`), a corresponding follower index is automatically created on the follower cluster. 

You can configure multiple replication rules for a single cluster. The patterns currently only support wildcard matching. 

## Prerequisites

You need to [set up a cross-cluster connection]({{site.url}}{{site.baseurl}}/replication-plugin/get-started/#set-up-a-cross-cluster-connection) between two clusters before you can enable auto-follow. 

## Permissions

If the Security plugin is enabled, make sure that non-admin users are mapped to the appropriate permissions so they can perform replication actions. For index and cluster-level permissions requirements, see [Cross-cluster replication permissions]({{site.url}}{{site.baseurl}}/replication-plugin/permissions/).

## Get started with auto-follow

Replication rules are a collection of patterns that you create against a single follower cluster. When you create a replication rule, it starts by automatically replicating any *existing* indexes that match the pattern. It will then continue to replicate any *new* indexes that you create that match the pattern.

Create a replication rule on the follower cluster:

```bash
curl -XPOST -k -H 'Content-Type: application/json' -u 'admin:<custom-admin-password>' 'https://localhost:9200/_plugins/_replication/_autofollow?pretty' -d '
{
   "leader_alias" : "my-connection-alias",
   "name": "my-replication-rule",
   "pattern": "movies*",
   "use_roles":{
      "leader_cluster_role": "all_access",
      "follower_cluster_role": "all_access"
   }
}'
```

If the Security plugin is disabled, you can leave out the `use_roles` parameter. If it's enabled, however, you need to specify the leader and follower cluster roles that OpenSearch uses to authenticate requests. This example uses `all_access` for simplicity, but we recommend creating a replication user on each cluster and [mapping it accordingly]({{site.url}}{{site.baseurl}}/replication-plugin/permissions/#map-the-leader-and-follower-cluster-roles).
{: .tip }

## Customize follower index names with follower_index_pattern

By default, auto-follow creates follower indexes with the same name as the matching leader index. You can override this behavior using the `follower_index_pattern` parameter to apply a custom naming convention to all follower indexes created by a replication rule.

The `follower_index_pattern` parameter accepts a string that can include the `{{leader_index}}` placeholder, which is replaced at replication time with the name of the matched leader index. This lets you add prefixes, suffixes, or any static text around the leader index name. This is useful for avoiding name collisions when a same-named local index already exists on the follower cluster or when replicating from multiple leader clusters.

The following example creates a replication rule that appends a `-replica` suffix to all replicated index names:

```bash
curl -XPOST -k -H 'Content-Type: application/json' -u 'admin:<custom-admin-password>' 'https://localhost:9200/_plugins/_replication/_autofollow?pretty' -d '
{
   "leader_alias" : "my-connection-alias",
   "name": "my-replication-rule",
   "pattern": "movies*",
   "follower_index_pattern": "{{leader_index}}-replica",
   "use_roles":{
      "leader_cluster_role": "all_access",
      "follower_cluster_role": "all_access"
   }
}'
```

With this rule, a leader index named `movies-2025` is automatically replicated to a follower index named `movies-2025-replica`.

If `follower_index_pattern` is omitted, the follower index is given the same name as the leader index.

To test the rule, create a matching index on the leader cluster:

```bash
curl -XPUT -k -H 'Content-Type: application/json' -u 'admin:<custom-admin-password>' 'https://localhost:9201/movies-0001?pretty'
```

And confirm its replica shows up on the follower cluster:

```bash
curl -XGET -u 'admin:<custom-admin-password>' -k 'https://localhost:9200/_cat/indices?v'
```

It might take several seconds for the index to appear.

```bash
health status index        uuid                     pri rep docs.count docs.deleted store.size pri.store.size
yellow open   movies-0001  kHOxYYHxRMeszLjTD9rvSQ     1   1          0            0       208b           208b
```

## Retrieve replication rules

To retrieve a list of existing replication rules that are configured on a cluster, send the following request:

```bash
curl -XGET -u 'admin:<custom-admin-password>' -k 'https://localhost:9200/_plugins/_replication/autofollow_stats'

{
   "num_success_start_replication": 1,
   "num_failed_start_replication": 0,
   "num_failed_leader_calls": 0,
   "failed_indices":[
      
   ],
   "autofollow_stats":[
      {
         "name":"my-replication-rule",
         "pattern":"movies*",
         "num_success_start_replication": 1,
         "num_failed_start_replication": 0,
         "num_failed_leader_calls": 0,
         "failed_indices":[
            
         ]
      }
   ]
}
```

## Delete a replication rule

To delete a replication rule, send the following request to the follower cluster:

```bash
curl -XDELETE -k -H 'Content-Type: application/json' -u 'admin:<custom-admin-password>' 'https://localhost:9200/_plugins/_replication/_autofollow?pretty' -d '
{
   "leader_alias" : "my-connection-alias",
   "name": "my-replication-rule"
}'
```

When you delete a replication rule, OpenSearch stops replicating *new* indexes that match the pattern, but existing indexes that the rule previously created remain read-only and continue to replicate. If you need to stop existing replication activity and open the indexes up for writes, use the [stop replication API operation]({{site.url}}{{site.baseurl}}/replication-plugin/api/#stop-replication).
