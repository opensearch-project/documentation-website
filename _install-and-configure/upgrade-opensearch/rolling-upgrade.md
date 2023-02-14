---
layout: default
title: Rolling Upgrade
parent: Upgrading OpenSearch
nav_order: 10
---

# Rolling Upgrade

Rolling upgrades, sometimes referred to as "node replacement upgrades," can be performed on running clusters with virtually no downtime. Nodes are individually stopped and upgraded in place. Alternatively, nodes can be stopped and replaced, one at a time, by hosts running the new version. During this process you can continue to index and query data in your cluster.

The sample outputs and API responses included in this document were generated in a development environment using Docker containers. Validation was performed by upgrading an Elasticsearch 7.10.2 cluster to OpenSearch 1.3.7; however, this process can be applied to any **N→N+1** version upgrade of OpenSearch on any platform. Certain commands, such as listing running containers in Docker, are included as an aid to the reader but the specific commands used on your host(s) will be different depending on your distribution and host operating system.

This guide assumes that you are comfortable working from the Linux command line interface (CLI). You should understand how to input commands, navigate between directories, and edit text files. For help with [Docker](https://www.docker.com/) or [Docker Compose](https://github.com/docker/compose), refer to the official documentation on their websites.
{:.note}

## Preparing to upgrade

Review [Upgrading OpenSearch]({{site.url}}{{site.baseurl}}/upgrade-opensearch/index/) for recommendations about backing up your configuration files and creating a snapshot of the cluster state and indexes before you make any changes to your OpenSearch cluster.

**Important:** OpenSearch nodes cannot be downgraded. If you need to revert the upgrade, then you will need to perform a fresh installation of OpenSearch and restore the cluster from a snapshot. Take a snapshot and store it in a remote repository before beginning the upgrade procedure.
{: .important}

## Upgrade steps

1. Verify the health of your OpenSearch cluster before you begin. You should resolve any index or shard allocation issues prior to upgrading to ensure that your data is preserved. A status of **green** indicates that all primary and replica shards are allocated. See [Cluster health]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-health/) for more information.
   ```bash
   curl "http://localhost:9201/_cluster/health?pretty"
   ```
   Sample output:
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
1. Disable shard replication to prevent shard replicas from being created while nodes are being taken offline. This stops the movement of Lucene index segments on nodes in your cluster.
   ```bash
   curl -X PUT "http://localhost:9201/_cluster/settings?pretty" -H 'Content-type: application/json' -d'{"persistent":{"cluster.routing.allocation.enable":"primaries"}}'
   ```
   Sample output:
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
1. Perform a flush operation on the cluster to commit transaction log entries to the Lucene index.
   ```bash
   curl -X POST "http://localhost:9201/_flush?pretty"
   ```
   Sample output:
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
1. Query the `_cat/nodes` endpoint to verify which node was promoted to cluster manager. Note that OpenSearch 1.x versions use the term "master," which has been deprecated and replaced by "cluster_manager" in OpenSearch 2.x and later.
   ```bash
   curl -s "http://localhost:9201/_cat/nodes?v&h=name,version,node.role,master" | column -t
   ```
   Sample output:
   ```bash
   name        version  node.role  master
   os-node-01  7.10.2   dimr       -
   os-node-04  7.10.2   dimr       -
   os-node-03  7.10.2   dimr       -
   os-node-02  7.10.2   dimr       *
   ```
1. Stop the node you are upgrading. Do not delete the volume associated with the container when you delete the container. The new OpenSearch container will use the existing volume. **Deleting the volume will result in data loss.**
1. Confirm that the associated node has been dismissed from the cluster.
   ```bash
   curl -s "http://localhost:9202/_cat/nodes?v&h=name,version,node.role,master" | column -t
   ```
   Sample output:
   ```bash
   name        version  node.role  master
   os-node-02  7.10.2   dimr       *
   os-node-04  7.10.2   dimr       -
   os-node-03  7.10.2   dimr       -
   ```
   `os-node-01` is no longer listed because the container has been stopped and deleted.
1. Deploy a new container running the desired version of OpenSearch, mapped to the same volume as the container you deleted.
1. Query the `_cat/nodes` endpoint after OpenSearch is running on the new node to confirm that it has joined the cluster.
   ```bash
   curl -s "http://localhost:9201/_cat/nodes?v&h=name,version,node.role,master" | column -t
   ```
   Sample output:
   ```bash
   name        version  node.role  master
   os-node-02  7.10.2   dimr       *
   os-node-04  7.10.2   dimr       -
   os-node-01  7.10.2   dimr       -
   os-node-03  7.10.2   dimr       -
   ```
   In the sample output, the new OpenSearch node reports a running version of `7.10.2` to the cluster. This is the result of `compatibility.override_main_response_version`, which is used when connecting to a cluster with legacy clients that check for a version. You can manually confirm the version of the node by calling the `/_nodes` API endpoint, as in the following command. Replace `<nodeName>` with the name of your node. See [Nodes API]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/index/) to learn more.
   ```
   curl -s -X GET 'localhost:9201/_nodes/<nodeName>?pretty=true' | jq -r '.nodes | .[] | "\(.name) v\(.version)"'
   ```
   Sample output:
   ```
   $ curl -s -X GET 'localhost:9201/_nodes/os-node-01?pretty=true' | jq -r '.nodes | .[] | "\(.name) v\(.version)"'
   os-node-01 v1.3.7
   ```
1. Repeat steps 5 through 9 for each node in your cluster. Remember to upgrade an eligible cluster manager node last. After replacing the last node, query the `_cat/nodes` endpoint to confirm that all nodes have joined the cluster. The cluster is now bootstrapped to the new version of OpenSearch.
   ```bash
   curl -s "http://localhost:9201/_cat/nodes?v&h=name,version,node.role,master" | column -t
   ```
   Sample output:
   ```bash
   name        version  node.role  master
   os-node-04  1.3.7    dimr       -
   os-node-02  1.3.7    dimr       *
   os-node-01  1.3.7    dimr       -
   os-node-03  1.3.7    dimr       -
   ```
1. Reenable shard replication.
   ```bash
   curl -X PUT "http://localhost:9201/_cluster/settings?pretty" -H 'Content-type: application/json' -d'{"persistent":{"cluster.routing.allocation.enable":"all"}}'
   ```
   Sample output:
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
1. Confirm that the cluster is healthy.
   ```bash
   curl "http://localhost:9201/_cluster/health?pretty"
   ```
   Sample output:
   ```bash
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
1. The upgrade is complete and you can begin enjoying the latest features and fixes!

### Related articles

- [OpenSearch configuration]({{site.url}}{{site.baseurl}}/install-and-configure/configuration/)
- [Performance analyzer]({{site.url}}{{site.baseurl}}/monitoring-plugins/pa/index/)
- [Install and configure OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/)
- [About Security in OpenSearch]({{site.url}}{{site.baseurl}}/security/index/)
