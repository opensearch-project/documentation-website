---
layout: default
title: Migrating to remote-backed storage
nav_order: 5
parent: Remote-backed storage
grand_parent: Availability and recovery
canonical_url: https://docs.opensearch.org/docs/latest/tuning-your-cluster/availability-and-recovery/remote-store/migrating-to-remote/
---

# Migrating to remote-backed storage

Introduced 2.15
{: .label .label-purple }

Remote-backed storage offers a new way to protect against data loss by automatically creating backups of all index transactions and sending them to remote storage. To use this feature, [segment replication]({{site.url}}{{site.baseurl}}/opensearch/segment-replication/) must be enabled.

You can migrate a document-replication-based cluster to remote-backed storage through the rolling upgrade mechanism.

Rolling upgrades, sometimes referred to as *node replacement upgrades*, can be performed on running clusters with virtually no downtime. Nodes are individually stopped and migrated in place. Alternatively, nodes can be stopped and replaced, one at a time, by remote-backed hosts. During this process you can continue to index and query data in your cluster.

## Preparing to migrate

Review [Upgrading OpenSearch]({{site.url}}{{site.baseurl}}/upgrade-opensearch/index/) for recommendations about backing up your configuration files and creating a snapshot of the cluster state and indexes before you make any changes to your OpenSearch cluster.

Before migrating to remote-backed storage, upgrade to OpenSearch 2.15 or later.

Before upgrading to OpenSearch 2.15, take a cluster snapshot and store it remotely. OpenSearch 2.15 nodes cannot revert to document replication. If a migration needs to be undone, perform a fresh OpenSearch installation and restore from the remote snapshot. Storing the snapshot remotely allows you to retrieve and restore it if issues arise during migration.
{: .important}

## Performing the upgrade

1. Verify the health of your OpenSearch cluster before you begin using the [Cluster Health API]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-health/). Resolve any index or shard allocation issues prior to upgrading to ensure that your data is preserved. A status of **green** indicates that all primary and replica shards are allocated. You can query the `_cluster/health` API endpoint using a command similar to the following:

   ```json
   GET "/_cluster/health?pretty"
   ```

   You should receive a response similar to the following:

   ```json
   {
       "cluster_name":"opensearch-dev-cluster",
       "status":"green",
       "timed_out":false,
       "number_of_nodes":4,
       "number_of_data_nodes":4,
       "active_primary_shards":1,
       "active_shards":4,
       "relocating_shards":0,
       "initializing_shards":0,
       "unassigned_shards":0,
       "delayed_unassigned_shards":0,
       "number_of_pending_tasks":0,
       "number_of_in_flight_fetch":0,
       "task_max_waiting_in_queue_millis":0,
       "active_shards_percent_as_number":100.0
   }
   ```
   
1. Disable shard replication to prevent shard replicas from being created while nodes are being taken offline. This stops the movement of Lucene index segments on nodes in your cluster. You can disable shard replication by querying the `_cluster/settings` API endpoint, as shown in the following example:

   ```json
   PUT "/_cluster/settings?pretty"
   {
       "persistent": {
           "cluster.routing.allocation.enable": "primaries"
       }
   }
   ```
   You should receive a response similar to the following:
   
   ```json
   {
     "acknowledged" : true,
     "persistent" : {
       "cluster" : {
         "routing" : {
           "allocation" : {
             "enable" : "primaries"
           }
         }
       }
     },
     "transient" : { }
   }
   ```

1. Perform the following flush operation on the cluster to commit transaction log entries to the Lucene index:

   ```json
   POST "/_flush?pretty"
   ```

   You should receive a response similar to the following:
   
   ```json
   {
     "_shards" : {
       "total" : 4,
       "successful" : 4,
       "failed" : 0
     }
   }
   ```

1. Set the `cluster.remote_store.compatibility_mode` setting to `mixed` to allow remote-backed storage nodes to join the cluster. Then set `cluster.migration.direction` to `remote_store`, which allocates new indexes to remote-backed data nodes. The following example updates the aforementioned setting using the Cluster Settings API:

   ```json
   PUT "/_cluster/settings?pretty"
   {
       "persistent": {
           "cluster.remote_store.compatibility_mode": "mixed",
           "cluster.migration.direction" :  "remote_store"
       }
   }
   ```
   You should receive a response similar to the following:
   
   ```json
   {
     "acknowledged" : true,
     "persistent" : {
        "cluster" : { 
        "remote_store" : {
          "compatibility_mode" : "mixed",
          "migration.direction" :  "remote_store"
        }
      },
      "transient" : { }
    }
   }
   ```
   
1. Review your cluster and identify the first node to be upgraded.
1. Provide the remote store repository details as node attributes in `opensearch.yml`, as shown in the following example:

   ```yml
   # Repository name
   node.attr.remote_store.segment.repository: my-repo-1
   node.attr.remote_store.translog.repository: my-repo-2
   node.attr.remote_store.state.repository: my-repo-3
   
   # Segment repository settings
   node.attr.remote_store.repository.my-repo-1.type: s3
   node.attr.remote_store.repository.my-repo-1.settings.bucket: <Bucket Name 1>
   node.attr.remote_store.repository.my-repo-1.settings.base_path: <Bucket Base Path 1>
   node.attr.remote_store.repository.my-repo-1.settings.region: us-east-1
   
   # Translog repository settings
   node.attr.remote_store.repository.my-repo-2.type: s3
   node.attr.remote_store.repository.my-repo-2.settings.bucket: <Bucket Name 2>
   node.attr.remote_store.repository.my-repo-2.settings.base_path: <Bucket Base Path 2>
   node.attr.remote_store.repository.my-repo-2.settings.region: us-east-1
   
   # Enable Remote cluster state cluster setting
   cluster.remote_store.state.enabled: true
   
   # Remote cluster state repository settings
   node.attr.remote_store.repository.my-remote-state-repo.type: s3
   node.attr.remote_store.repository.my-remote-state-repo.settings.bucket: <Bucket Name 3>
   node.attr.remote_store.repository.my-remote-state-repo.settings.base_path: <Bucket Base Path 3>
   node.attr.remote_store.repository.my-remote-state-repo.settings.region: <Bucket region>
   
   ```

1. Stop the node you are migrating. Do not delete the volume associated with the container when you delete the container. The new OpenSearch container will use the existing volume. **Deleting the volume will result in data loss**.

1. Deploy a new container running the same version of OpenSearch and mapped to the same volume as the container you deleted.

1. Query the `_cat/nodes` endpoint after OpenSearch is running on the new node to confirm that it has joined the cluster. Wait for the cluster to become green again.

1. Repeat steps 2 through 5 for each node in your cluster. 

1. Reenable shard replication, using a command similar to the following:

   ```json
   PUT "/_cluster/settings?pretty"
   {
       "persistent": {
           "cluster.routing.allocation.enable": "all"
       }
   }
   ```
   
   You should receive a response similar to the following:
   
   ```json
   {
     "acknowledged" : true,
     "persistent" : {
       "cluster" : {
         "routing" : {
           "allocation" : {
             "enable" : "all"
           }
         }
       }
     },
     "transient" : { }
   }
   ```
   
1. Confirm that the cluster is healthy by using the Cluster Health API, as shown in the following command:

   ```bash
   GET "/_cluster/health?pretty"
   ```
   You should receive a response similar to the following:
   ```json
   {
     "cluster_name" : "opensearch-dev-cluster",
     "status" : "green",
     "timed_out" : false,
     "number_of_nodes" : 4,
     "number_of_data_nodes" : 4,
     "discovered_master" : true,
     "active_primary_shards" : 1,
     "active_shards" : 4,
     "relocating_shards" : 0,
     "initializing_shards" : 0,
     "unassigned_shards" : 0,
     "delayed_unassigned_shards" : 0,
     "number_of_pending_tasks" : 0,
     "number_of_in_flight_fetch" : 0,
     "task_max_waiting_in_queue_millis" : 0,
     "active_shards_percent_as_number" : 100.0
   }
   ```
   
1. Clear the `remote_store.compatibility_mode` and `migration.direction` settings by using the following command so that non-remote nodes are not allowed to join the cluster:
 
   ```json
   PUT "/_cluster/settings?pretty"
   {
       "persistent": {
           "cluster.remote_store.compatibility_mode": null,
            "cluster.migration.direction" :  null
       }
   }
   ```

   You should receive a response similar to the following:
   ```json
   {
     "acknowledged" : true,
     "persistent" : { 
        "cluster.remote_store.compatibility_mode": null,
         "cluster.migration.direction" :  null
      },
      "transient" : { }
   }
   ```
   
The migration to the remote store is now complete. 


## Related cluster settings

Use the following cluster settings to enable migration to a remote-backed cluster.

| Field                                     | Data type | Description |
|:------------------------------------------|:--- |:---|
| `cluster.remote_store.compatibility_mode` | String  | When set to `strict`, only allows the creation of either non-remote or remote nodes, depending on the initial cluster type. When set to `mixed`, allows both remote and non-remote nodes to join the cluster. Default is `strict`. |  
| `cluster.migration.direction`             | String |  Creates new shards only on remote-backed storage nodes. Default is `None`. |                                                                                                                                                                                            

