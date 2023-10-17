---
layout: default
title: Replication security
nav_order: 30
parent: Cross-cluster replication
redirect_from:
  - /replication-plugin/permissions/
---

# Cross-cluster replication security

You can use the [Security plugin]({{site.url}}{{site.baseurl}}/security/index/) with cross-cluster replication to limit users to certain actions. For example, you might want certain users to only perform replication activity on the leader or follower cluster.

Because cross-cluster replication involves multiple clusters, it's possible that clusters might have different security configurations. The following configurations are supported:

- Security plugin fully enabled on both clusters
- Security plugin enabled only for TLS on both clusters (`plugins.security.ssl_only`)
- Security plugin absent or disabled on both clusters (not recommended)

Enable node-to-node encryption on both the leader and the follower cluster to ensure that replication traffic between the clusters is encrypted.

## Basic permissions

In order for non-admin users to perform replication activities, they must be mapped to the appropriate permissions.  

The Security plugin has two built-in roles that cover most replication use cases: `cross_cluster_replication_leader_full_access`, which provides replication permissions on the leader cluster, and `cross_cluster_replication_follower_full_access`, which provides replication permissions on the follower cluster. For descriptions of each, see [Predefined roles]({{site.url}}{{site.baseurl}}/security/access-control/users-roles#predefined-roles).

If you don't want to use the default roles, you can combine individual replication [permissions]({{site.url}}{{site.baseurl}}/tuning-your-cluster/replication-plugin/permissions/#replication-permissions) to meet your needs. Most permissions correspond to specific REST API operations. For example, the `indices:admin/plugins/replication/index/pause` permission lets you pause replication.

## Map the leader and follower cluster roles

The [start replication]({{site.url}}{{site.baseurl}}/replication-plugin/api/#start-replication) and [create replication rule]({{site.url}}{{site.baseurl}}/replication-plugin/api/#create-replication-rule) operations are special cases. They involve background processes on the leader and follower clusters that must be associated with roles. When you perform one of these actions, you must explicitly pass the `leader_cluster_role` and
`follower_cluster_role` in the request, which OpenSearch then uses in all backend replication tasks.

To enable non-admins to start replication and create replication rules, create an identical user on each cluster (for example, `replication_user`) and map them to the `cross_cluster_replication_leader_full_access` role on the remote cluster and `cross_cluster_replication_follower_full_access` on the follower cluster. For instructions, see [Map users to roles]({{site.url}}{{site.baseurl}}/security/access-control/users-roles/#map-users-to-roles).

Then add those roles to the request, and sign it with the appropriate credentials:

```bash
curl -XPUT -k -H 'Content-Type: application/json' -u 'replication_user:password' 'https://localhost:9200/_plugins/_replication/follower-01/_start?pretty' -d '
{
   "leader_alias": "leader-cluster",
   "leader_index": "leader-01",
   "use_roles":{
      "leader_cluster_role": "cross_cluster_replication_leader_full_access",
      "follower_cluster_role": "cross_cluster_replication_follower_full_access"
   }
}'
```

You can create your own, custom leader and follower cluster roles using individual permissions, but we recommend using the default roles, which are a good fit for most use cases.

## Replication permissions

The following sections list the available index and cluster-level permissions for cross-cluster replication.

### Follower cluster

The Security plugin supports these permissions for the follower cluster:

```
indices:admin/plugins/replication/index/setup/validate
indices:admin/plugins/replication/index/start
indices:admin/plugins/replication/index/pause
indices:admin/plugins/replication/index/resume
indices:admin/plugins/replication/index/stop
indices:admin/plugins/replication/index/update
indices:admin/plugins/replication/index/status_check
indices:data/write/plugins/replication/changes
cluster:admin/plugins/replication/autofollow/update
```

### Leader cluster

The Security plugin supports these permissions for the leader cluster:

```
indices:admin/plugins/replication/validate
indices:data/read/plugins/replication/file_chunk
indices:data/read/plugins/replication/changes
```
