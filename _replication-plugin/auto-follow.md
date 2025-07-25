---
layout: default
title: Auto-follow
nav_order: 20
has_children: false

canonical_url: https://docs.opensearch.org/latest/tuning-your-cluster/replication-plugin/auto-follow/
---

# Auto-follow for cross-cluster replication

Auto-follow lets you automatically replicate indices created on the leader cluster based on matching patterns. When you create an index on the leader cluster with a name that matches a specified pattern (for example, `index-01*`), a corresponding follower index is automatically created on the follower cluster. 

You can configure multiple replication rules for a single cluster. The patterns currently only support wildcard matching. 

## Prerequisites

You need to [set up a cross-cluster connection]({{site.url}}{{site.baseurl}}/replication-plugin/get-started/#set-up-a-cross-cluster-connection) between two clusters before you can enable auto-follow. 

## Permissions

If the security plugin is enabled, non-admin users need to be mapped to the appropriate permissions in order to perform replication actions. For index and cluster-level permissions requirements, see [Cross-cluster replication permissions]({{site.url}}{{site.baseurl}}/replication-plugin/permissions/).

## Get started with auto-follow

Replication rules are a collection of patterns that you create against a single remote cluster. When you create a replication rule, it automatically starts replicating any *new* indices that match the pattern, but does not replicate matching indices that were previously created. 

Create a replication rule on the follower cluster:

```bash
curl -XPOST -k -H 'Content-Type: application/json' -u 'admin:admin' 'https://localhost:9200/_plugins/_replication/_autofollow?pretty' -d '
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

If the security plugin is disabled, you can leave out the `use_roles` parameter. If it's enabled, however, you need to specify the leader and follower cluster roles that OpenSearch uses to authenticate requests. This example uses `all_access` for simplicity, but we recommend creating a replication user on each cluster and [mapping it accordingly]({{site.url}}{{site.baseurl}}/replication-plugin/permissions/#map-the-leader-and-follower-cluster-roles).
{: .tip }

To test the rule, create a matching index on the leader cluster:

```bash
curl -XPUT -k -H 'Content-Type: application/json' -u 'admin:admin' 'https://localhost:9201/movies-0001?pretty'
```

And confirm its replica shows up on the follower cluster:

```bash
curl -XGET -u 'admin:admin' -k 'https://localhost:9200/_cat/indices?v'
```

It might take several seconds for the index to appear.

```bash
health status index        uuid                     pri rep docs.count docs.deleted store.size pri.store.size
yellow open   movies-0001  kHOxYYHxRMeszLjTD9rvSQ     1   1          0            0       208b           208b
```

## Retrieve replication rules

To retrieve a list of existing replication rules configured on a cluster, send the following request:

```bash
curl -XGET -u 'admin:admin' -k 'https://localhost:9200/_plugins/_replication/autofollow_stats'

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

When you delete a replication rule, OpenSearch stops replicating *new* indices that match the pattern, but existing indices that the rule previously created continue to replicate. If you need to stop existing replication activity, use the [stop replication API operation]({{site.url}}{{site.baseurl}}/replication-plugin/api/#stop-replication).

```bash
curl -XDELETE -k -H 'Content-Type: application/json' -u 'admin:admin' 'https://localhost:9200/_plugins/_replication/_autofollow?pretty' -d '
{
   "leader_alias" : "my-conection-alias",
   "name": "my-replication-rule"
}'
```

