---
layout: default
title: Rolling upgrade
nav_order: 20
has_toc: true
permalink: /migrate-or-upgrade/rolling-upgrade/
nav_exclude: false
redirect_from: 
 - /upgrade-opensearch/
 - /rolling-upgrade/index/
 - /migrate-or-upgrade/rolling-upgrade/appendix/
---

# Rolling upgrade

Rolling upgrades, sometimes referred to as "node replacement upgrades," can be performed on running clusters with virtually no downtime. Nodes are individually stopped and upgraded in place. Alternatively, nodes can be stopped and replaced, one at a time, by hosts running the new version. During this process, you can continue to index and query data in your cluster.

This document serves as a high-level, platform-agnostic overview of the rolling upgrade procedure. For specific examples of commands, scripts, and configuration files, refer to the [Rolling upgrade lab]({{site.url}}{{site.baseurl}}/migrate-or-upgrade/rolling-upgrade/rolling-upgrade-lab/).

## Preparing to upgrade

Review [Upgrading OpenSearch]({{site.url}}{{site.baseurl}}/migrate-or-upgrade/rolling-upgrade/) for recommendations about backing up your configuration files and creating a snapshot of the cluster state and indexes before you make any changes to your OpenSearch cluster.

**Important:** OpenSearch nodes cannot be downgraded. If you need to revert the upgrade, then you will need to perform a fresh installation of OpenSearch and restore the cluster from a snapshot. Take a snapshot and store it in a remote repository before beginning the upgrade procedure.
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
1. Review your cluster and identify the first node to upgrade. Eligible cluster manager nodes should be upgraded last because OpenSearch nodes can join a cluster with manager nodes running an older version, but they cannot join a cluster with all manager nodes running a newer version.
1. Query the `_cat/nodes` endpoint to identify which node was promoted to cluster manager. The following command includes additional query parameters that request only the name, version, node.role, and master headers. Note that OpenSearch 1.x versions use the term "master," which has been deprecated and replaced by "cluster_manager" in OpenSearch 2.x and later.
   ```bash
   GET "/_cat/nodes?v&h=name,version,node.role,master" | column -t
   ```
   The response should look similar to the following example:
   ```bash
   name        version  node.role  master
   os-node-01  7.10.2   dimr       -
   os-node-04  7.10.2   dimr       -
   os-node-03  7.10.2   dimr       -
   os-node-02  7.10.2   dimr       *
   ```
1. Stop the node you are upgrading. Do not delete the volume associated with the container when you delete the container. The new OpenSearch container will use the existing volume. **Deleting the volume will result in data loss**.
1. Confirm that the associated node has been dismissed from the cluster by querying the `_cat/nodes` API endpoint:
   ```bash
   GET "/_cat/nodes?v&h=name,version,node.role,master" | column -t
   ```
   The response should look similar to the following example:
   ```bash
   name        version  node.role  master
   os-node-02  7.10.2   dimr       *
   os-node-04  7.10.2   dimr       -
   os-node-03  7.10.2   dimr       -
   ```
   `os-node-01` is no longer listed because the container has been stopped and deleted.
1. Deploy a new container running the desired version of OpenSearch and mapped to the same volume as the container you deleted.
1. Query the `_cat/nodes` endpoint after OpenSearch is running on the new node to confirm that it has joined the cluster:
   ```bash
   GET "/_cat/nodes?v&h=name,version,node.role,master" | column -t
   ```
   The response should look similar to the following example:
   ```bash
   name        version  node.role  master
   os-node-02  7.10.2   dimr       *
   os-node-04  7.10.2   dimr       -
   os-node-01  7.10.2   dimr       -
   os-node-03  7.10.2   dimr       -
   ```
   In the example output, the new OpenSearch node reports a running version of `7.10.2` to the cluster. This is the result of `compatibility.override_main_response_version`, which is used when connecting to a cluster with legacy clients that check for a version. You can manually confirm the version of the node by calling the `/_nodes` API endpoint, as in the following command. Replace `<nodeName>` with the name of your node. See [Nodes API]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/index/) to learn more.
   ```bash
   GET "/_nodes/<nodeName>?pretty=true" | jq -r '.nodes | .[] | "\(.name) v\(.version)"'
   ```
   The response should look similar to the following example:
   ```bash
   os-node-01 v1.3.7
   ```
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
1. Repeat steps 2 through 11 for each node in your cluster. Remember to upgrade an eligible cluster manager node last. After replacing the last node, query the `_cat/nodes` endpoint to confirm that all nodes have joined the cluster. The cluster is now bootstrapped to the new version of OpenSearch. You can verify the cluster version by querying the `_cat/nodes` API endpoint:
   ```bash
   GET "/_cat/nodes?v&h=name,version,node.role,master" | column -t
   ```
   The response should look similar to the following example:
   ```bash
   name        version  node.role  master
   os-node-04  1.3.7    dimr       -
   os-node-02  1.3.7    dimr       *
   os-node-01  1.3.7    dimr       -
   os-node-03  1.3.7    dimr       -
   ```
1. The upgrade is now complete, and you can begin enjoying the latest features and fixes!

## Rolling restart

A rolling restart follows the same step-by-step procedure as a rolling upgrade, with the exception of upgrading of actual nodes. During a rolling restart, nodes are restarted one at a time—typically to apply configuration changes, refresh certificates, or perform system-level maintenance—without disrupting cluster availability.

To perform a rolling restart, follow the steps outlined in [Performing the upgrade](#performing-the-upgrade), excluding the steps that involve upgrading the OpenSearch binary or container image:

1. **Check cluster health**  
   Ensure the cluster status is green and all shards are assigned.  
   _(See [step 1](#performing-the-upgrade) in the rolling upgrade procedure)_

2. **Disable shard allocation**  
   Prevent OpenSearch from trying to reallocate shards while nodes are offline.  
   _(See [step 2](#performing-the-upgrade) in the rolling upgrade procedure)_

3. **Flush transaction logs**  
   Commit recent operations to Lucene to reduce recovery time.  
   _(See [step 3](#performing-the-upgrade) in the rolling upgrade procedure)_

4. **Review and identify the next node to restart**  
   Ensure you restart the current cluster manager node last.  
   _(See [step 4](#performing-the-upgrade) in the rolling upgrade procedure)_

5. **Check which node is the current cluster manager**  
   Use the `_cat/nodes` API to determine which node is the current active cluster manager.  
   _(See [step 5](#performing-the-upgrade) in the rolling upgrade procedure)_

6. **Stop the node**  
   Shut down the node gracefully. Do not delete the associated data volume.  
   _(See [step 6](#performing-the-upgrade) in the rolling upgrade procedure)_

7. **Confirm the node has left the cluster**  
   Use `_cat/nodes` to verify that it's no longer listed.  
   _(See [step 7](#performing-the-upgrade) in the rolling upgrade procedure)_

8. **Restart the node**  
   Start the same node (same binary/version/config) and let it rejoin the cluster.  
   _(See [step 8](#performing-the-upgrade) in the rolling upgrade procedure — without upgrading the binary)_

9. **Verify that the restarted node has rejoined**  
   Check `_cat/nodes` to confirm that the node is present and healthy.  
   _(See [step 9](#performing-the-upgrade) in the rolling upgrade procedure)_

10. **Reenable shard allocation**  
    Restore full shard movement capability.  
    _(See [step 10](#performing-the-upgrade) in the rolling upgrade procedure)_

11. **Confirm cluster health is green**  
    Validate stability before restarting the next node.  
    _(See [step 11](#performing-the-upgrade) in the rolling upgrade procedure)_

12. **Repeat the process for all other nodes**  
    Restart each node one at a time. If a node is eligible for the cluster manager role, restart it last.  
    _(See [step 12](#performing-the-upgrade) in the rolling upgrade procedure — again, no upgrade step)_

By preserving quorum and restarting nodes sequentially, rolling restarts ensure zero downtime and full data continuity.

## Related articles

- [Rolling upgrade lab]({{site.url}}{{site.baseurl}}/migrate-or-upgrade/rolling-upgrade/rolling-upgrade-lab/) -- A hands-on lab with step-by-step instructions for practicing rolling upgrades in a test environment.
- [OpenSearch configuration]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/)
- [Performance analyzer]({{site.url}}{{site.baseurl}}/monitoring-plugins/pa/index/)
- [Install and configure OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/)
- [About Security in OpenSearch]({{site.url}}{{site.baseurl}}/security/index/)
