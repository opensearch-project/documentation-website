---
layout: default
title: Upgrading OpenSearch
parent: Upgrade Overview
nav_order: 10
redirect_from:
  - /upgrade-opensearch/version-upgrade/
---

# OpenSearch Version Upgrades

This guide assumes that you are comfortable working from the Linux command line interface (CLI). You should understand how to input commands, navigate between directories, and edit text files. For help with [Docker](https://www.docker.com/) or [Docker Compose](https://github.com/docker/compose), refer to the official documentation on their websites.
{:.note}

### About this guide

Sample output and API responses included in this document were generated in a development environment. Testing was performed by upgrading an Elasticsearch 7.10.2 cluster to OpenSearch 1.3.7. However, this process can be applied to any **N → N+1** version upgrade of OpenSearch.

### Prepare to upgrade

Before you upgrade, review [Upgrade Overview]({{site.url}}{{site.baseurl}}/upgrade-opensearch/index/) for recommendations about backing up your configuration files and creating a snapshot of the cluster state and indexes before you make any changes to your OpenSearch cluster.

OpenSearch nodes cannot be downgraded. If you need to revert the upgrade, then you will need to perform a fresh installation of OpenSearch and restore the cluster from a snapshot. Take a snapshot and store it in a remote repository before beginning the upgrade procedure.
{: .note}

### Rolling upgrade

1. Perform a flush operation on the cluster to commit transaction log entries to the Lucene index.
```bash
curl -X POST "http://localhost:9200/_flush?pretty"
```
**Sample response:**
```bash
{
  "_shards" : {
    "total" : 4,
    "successful" : 4,
    "failed" : 0
  }
}
```
1. Disable shard replication to prevent shard replicas from being created while nodes are being taken offline.
```bash
curl -X PUT "http://localhost:9200/_cluster/settings?pretty" -H 'Content-type: application/json' -d'{"persistent":{"cluster.routing.allocation.enable":"primaries"}}'
```
**Sample response:**
```bash
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
1. Verify the health of your OpenSearch cluster.
```bash
curl "http://localhost:9200/_cluster/health?pretty"
```
A status of **green** indicates that all primary and replica shards are allocated.
**Sample response:**
```bash
{
  "cluster_name" : "opensearch-dev-cluster",
  "status" : "green",
  "timed_out" : false,
  "number_of_nodes" : 4,
  "number_of_data_nodes" : 4,
  "discovered_master" : true,
  "active_primary_shards" : 2,
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
1. List the running containers in your OpenSearch cluster and make a note of the container IDs and names.
```bash
docker container ls
```
**Sample output:**
```bash
CONTAINER ID   IMAGE                                           COMMAND                  CREATED         STATUS         PORTS                                                                NAMES
af1ec1c3fef7   opensearchproject/opensearch:1.3.7              "./opensearch-docker…"   4 minutes ago   Up 4 minutes   9300/tcp, 9650/tcp, 0.0.0.0:9200->9200/tcp, 0.0.0.0:9600->9600/tcp   os-node-04
1d47c0da60ad   opensearchproject/opensearch:1.3.7              "./opensearch-docker…"   4 minutes ago   Up 4 minutes   9300/tcp, 9650/tcp, 0.0.0.0:9200->9200/tcp, 0.0.0.0:9600->9600/tcp   os-node-03
f553b5ec870b   opensearchproject/opensearch:1.3.7              "./opensearch-docker…"   4 minutes ago   Up 4 minutes   9300/tcp, 9650/tcp, 0.0.0.0:9200->9200/tcp, 0.0.0.0:9600->9600/tcp   os-node-02
934e4325d9a4   opensearchproject/opensearch:1.3.7              "./opensearch-docker…"   4 minutes ago   Up 4 minutes   9300/tcp, 9650/tcp, 0.0.0.0:9200->9200/tcp, 0.0.0.0:9600->9600/tcp   os-node-01
```
1. Query `_cat/nodes` to determine which node is operating as the cluster manager. Note that OpenSearch 1.x versions use the heading "master," which has been deprecated and replaced by "cluster_manager" in OpenSearch 2.x versions.
```bash
curl -s "http://localhost:9200/_cat/nodes?v&h=name,version,node.role,master" | column -t
```
**Sample output:**
```bash
name        version  node.role  master
os-node-03  1.3.7    dimr       -
os-node-04  1.3.7    dimr       -
os-node-01  1.3.7    dimr       -
os-node-02  1.3.7    dimr       *
```
1. Select a node to upgrade first. Cluster manager-eligible nodes should be upgraded last because nodes cannot join an OpenSearch cluster if they are running an older version of OpenSearch than the elected cluster manager.
```bash
docker stop <containerId> && docker container rm <containerId>
```
**Sample output:**
```bash
$ docker stop 934e4325d9a4 && docker rm 934e4325d9a4
934e4325d9a4
934e4325d9a4
```
**Important:** Do not delete the volume associated with the container when you delete the container. The new OpenSearch container will use the existing volume. Deleting the volume will result in data loss.
1. Confirm that the associated node has been dismissed from the cluster.
```bash
curl -s "http://localhost:9200/_cat/nodes?v&h=name,version,node.role,master" | column -t
```
**Sample output:**
```bash
name        version  node.role  master
os-node-03  1.3.7    dimr       -
os-node-04  1.3.7    dimr       -
os-node-02  1.3.7    dimr       *
```
`os-node-01` is no longer listed because the container has been stopped and deleted.
1. Deploy a new container running the desired version of OpenSearch, mapped to the same volume as the container you deleted.
```bash
docker run -d \
	-p 9200:9200 -p 9600:9600 \
	-e "discovery.seed_hosts=os-node-01,os-node-02,os-node-03,os-node-04" -e "DISABLE_SECURITY_PLUGIN=true" \
	-e "DISABLE_INSTALL_DEMO_CONFIG=true" -e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
	-e "cluster.name=opensearch-dev-cluster" -e "node.name=os-node-01" \
	-e "cluster.initial_cluster_manager_nodes=os-node-01,os-node-02,os-node-03,os-node-04" \
	-e "bootstrap.memory_lock=true" -e "path.repo=/mnt/snapshots" \
	--ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
	-v os-data-01:/usr/share/opensearch/data \
  -v /Users/username/Documents/opensearch/snapshots/repo-01:/mnt/snapshots \
	--network opensearch-dev-net \
	--name os-node-01 \
	opensearchproject/opensearch:2.4.1
```
**Sample output:**
```bash
778e33168157e39814cb66ff81523c9d40772d122472c718bb3839e0c365cfe2
```
1. Give the new container time to start, then query `_cat/nodes` to confirm that the new node has joined the cluster, and that it is running the desired version of OpenSearch.
```bash
curl -s "http://localhost:9200/_cat/nodes?v&h=name,version,node.role,master" | column -t
```
**Sample output:**
```bash
name        version  node.role  master
os-node-03  1.3.7    dimr       -
os-node-04  1.3.7    dimr       -
os-node-02  1.3.7    dimr       *
os-node-01  2.4.1    dimr       -
```
1. Repeat steps 5 through 9 for each node in your cluster. Remember to upgrade an eligible cluster manager node last. When you are finished replacing the last node, query `_cat/nodes` to confirm that all nodes have joined the cluster and are running the desired version of OpenSearch.
```bash
curl -s "http://localhost:9200/_cat/nodes?v&h=name,version,node.role,master" | column -t
```
**Sample output:**
```bash
name        version  node.role  master
os-node-02  2.4.1    dimr       -
os-node-03  2.4.1    dimr       *
os-node-04  2.4.1    dimr       -
os-node-01  2.4.1    dimr       -
```
There are no longer any cluster manager-eligible nodes running the old version, so a cluster manager running the new version is elected. The cluster has now been bootstrapped with the new version.
1. Reenable shard replication.
```bash
curl -X PUT "http://localhost:9200/_cluster/settings?pretty" -H 'Content-type: application/json' -d'{"persistent":{"cluster.routing.allocation.enable":null}}'
```
**Sample output:**
```bash
{
  "acknowledged" : true,
  "persistent" : { },
  "transient" : { }
}
```
1. Confirm that the cluster is healthy.
```bash
curl "http://localhost:9200/_cluster/health?pretty"
```
**Sample output:**
```bash
{
  "cluster_name" : "opensearch-dev-cluster",
  "status" : "green",
  "timed_out" : false,
  "number_of_nodes" : 4,
  "number_of_data_nodes" : 4,
  "discovered_master" : true,
  "discovered_cluster_manager" : true,
  "active_primary_shards" : 2,
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
```version-