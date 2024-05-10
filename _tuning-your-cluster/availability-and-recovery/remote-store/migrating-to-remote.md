---
layout: default
title: Migrating to Remote-backed storage
nav_order: 5
parent: Remote-backed storage
grand_parent: Availability and recovery
---

# Migrating to remote-backed storage

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/7986).    
{: .warning}

Introduced 2.14
{: .label .label-purple }

Remote-backed storage offers OpenSearch users a new way to protect against data loss by automatically creating backups of all index transactions and sending them to remote storage. In order to expose this feature, segment replication must also be enabled. See [Segment replication]({{site.url}}{{site.baseurl}}/opensearch/segment-replication/) for additional information.

We support migrating a document-replication based cluster to Remote-backed storage through Rolling Upgrade mechanism.

Rolling upgrades, sometimes referred to as "node replacement upgrades", can be performed on running clusters with virtually no downtime. Nodes are individually stopped and upgraded in place. Alternatively, nodes can be stopped and replaced, one at a time, by hosts running the new version. During this process you can continue to index and query data in your cluster.

## Preparing to migrate

Review [Upgrading OpenSearch]({{site.url}}{{site.baseurl}}/upgrade-opensearch/index/) for recommendations about backing up your configuration files and creating a snapshot of the cluster state and indices before you make any changes to your OpenSearch cluster.

Users need to move to OpenSearch 2.14 version as a pre-requisite of this migration.

**Important:** OpenSearch nodes cannot be migrated back to document replication as of 2.14. If you need to revert the migration, then you will need to perform a fresh installation of OpenSearch and restore the cluster from a snapshot. Take a snapshot and store it in a remote repository before beginning the upgrade procedure.
{: .important}

## Performing the upgrade

1. Verify the health of your OpenSearch cluster before you begin. You should resolve any index or shard allocation issues prior to upgrading to ensure that your data is preserved. A status of **green** indicates that all primary and replica shards are allocated. See [Cluster health]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-health/) for more information. The following command queries the `_cluster/health` API endpoint:
   ```json
   GET "/_cluster/health?pretty"
   ```
   The response should look similar to the following example:
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
1. Disable shard replication to prevent shard replicas from being created while nodes are being taken offline. This stops the movement of Lucene index segments on nodes in your cluster. You can disable shard replication by querying the `_cluster/settings` API endpoint:
   ```json
   PUT "/_cluster/settings?pretty"
   {
       "persistent": {
           "cluster.routing.allocation.enable": "primaries"
       }
   }
   ```
   The response should look similar to the following example:
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

1. Perform a flush operation on the cluster to commit transaction log entries to the Lucene index:
   ```json
   POST "/_flush?pretty"
   ```
   The response should look similar to the following example:
   ```json
   {
     "_shards" : {
       "total" : 4,
       "successful" : 4,
       "failed" : 0
     }
   }
   ```
1. Set the `remote_store.compatibility_mode` to `mixed` to allow remote-store backed nodes to join the cluster. Set `migration.direction` to ensure new indices are allocated to remote backed data nodes.
   ```json
   PUT "/_cluster/settings?pretty"
   {
       "persistent": {
           "remote_store.compatibility_mode": "mixed",
            "migration.direction" :  "remote_store"
       }
   }
   ```
   The response should look similar to the following example:
   ```json
   {
     "acknowledged" : true,
     "persistent" : { 
      "remote_store" : {
      "compatibility_mode" : "mixed",
      "migration.direction" :  "remote_store"
      },
      "transient" : { }
   }
   }
   ```
2. Review your cluster and identify the first node to upgrade.
2. Provide the remote store repository details as node attributes in `opensearch.yml`, as shown in the following example.

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
1. Reenable shard replication:
   ```json
   PUT "/_cluster/settings?pretty"
   {
       "persistent": {
           "cluster.routing.allocation.enable": "all"
       }
   }
   ```
   The response should look similar to the following example:
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
1. Confirm that the cluster is healthy:
   ```bash
   GET "/_cluster/health?pretty"
   ```
   The response should look similar to the following example:
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
1. Clear the `remote_store.compatibility_mode` to not allow non-remote nodes to join back the cluster and `migration.direction` as well.
   ```json
   PUT "/_cluster/settings?pretty"
   {
       "persistent": {
           "remote_store.compatibility_mode": null,
            "migration.direction" :  null
       }
   }
   ```
   The response should look similar to the following example:
   ```json
   {
     "acknowledged" : true,
     "persistent" : { },
      "transient" : { }
   }
   ```
1. The migration to remote store is now complete, and you can begin enjoying the durability and performance benefits.


## Related cluster settings

You can use the following cluster settings to enable migration. 

| Field | Data type | Description                                                                                                                                                                                              |
| :--- |:----------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| remote_store.compatibility_mode | String   | Defaults to`strict` mode where it only allows either non-remote or remote nodes depending upon the initial cluster type. When set to `mixed`, it allows remote and non-remote nodes to join the cluster. |                                                                                                      |
| migration.direction | String | Defaults to `none` . `remote_store` direction creates new shards only on remote store backed nodes.                                                                                                      |                                                                                                                                                                                            

