---
layout: default
title: OpenSearch Version Upgrade
parent: Upgrading OpenSearch
nav_order: 10
---

# OpenSearch Rolling Upgrade

Rolling upgrades, sometimes referred to as "node replacement upgrades," can be performed on running clusters with virtually no downtime. Nodes are dismissed from the cluster and replaced one at a time by nodes running the target version. During this process you can continue to index and query data in your cluster.

This guide assumes that you are comfortable working from the Linux command line interface (CLI). You should understand how to input commands, navigate between directories, and edit text files. For help with [Docker](https://www.docker.com/) or [Docker Compose](https://github.com/docker/compose), refer to the official documentation on their websites.
{:.note}

### About this guide

The sample outputs and API responses included in this document were generated in a development environment. Testing and validation was performed by upgrading an Elasticsearch 7.10.2 cluster of 4 nodes to OpenSearch 1.3.7. However, this process can be applied to any **N → N+1** version upgrade of OpenSearch.

### Prepare to upgrade

Review [Upgrading OpenSearch]({{site.url}}{{site.baseurl}}/upgrade-opensearch/index/) for recommendations about backing up your configuration files and creating a snapshot of the cluster state and indexes before you make any changes to your OpenSearch cluster.

OpenSearch nodes cannot be downgraded. If you need to revert the upgrade, then you will need to perform a fresh installation of OpenSearch and restore the cluster from a snapshot. Take a snapshot and store it in a remote repository before beginning the upgrade procedure.
{: .note}

### Rolling upgrade

1. Verify the health of your OpenSearch cluster before you begin. You should resolve any index or shard allocation issues prior to upgrading to ensure that your data is preserved. A status of **green** indicates that all primary and replica shards are allocated. See [Cluster health]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-health/) for more information.
  ```bash
  curl "http://localhost:9201/_cluster/health?pretty"
  ```
  **Sample response:**
  ```bash
  {
    "cluster_name" : "opensearch-dev-cluster",
    "status" : "green",
    "timed_out" : false,
    "number_of_nodes" : 4,
    "number_of_data_nodes" : 4,
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
1. Disable shard replication to prevent shard replicas from being created while nodes are being taken offline. This stops the movement of Lucene index segments on nodes in your cluster.
  ```bash
  curl -X PUT "http://localhost:9201/_cluster/settings?pretty" -H 'Content-type: application/json' -d'{"persistent":{"cluster.routing.allocation.enable":"primaries"}}'
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
1. Perform a flush operation on the cluster to commit transaction log entries to the Lucene index.
  ```bash
  curl -X POST "http://localhost:9201/_flush?pretty"
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
1. Review your cluster and identify the first node to upgrade. Eligible cluster manager nodes should be upgraded last because OpenSearch nodes can join a cluster with manager nodes running an older version, but they cannot join a cluster with all manager nodes running a newer version.
  ```bash
  docker container ls
  ```
  **Sample output:**
  ```bash
  CONTAINER ID   IMAGE                                                      COMMAND                  CREATED          STATUS          PORTS                                                                                            NAMES
  a50a9617991b   docker.elastic.co/elasticsearch/elasticsearch-oss:7.10.2   "/tini -- /usr/local…"   18 minutes ago   Up 18 minutes   9300/tcp, 0.0.0.0:9204->9200/tcp, :::9204->9200/tcp, 0.0.0.0:9604->9600/tcp, :::9604->9600/tcp   os-node-04
  fac35167fcbd   docker.elastic.co/elasticsearch/elasticsearch-oss:7.10.2   "/tini -- /usr/local…"   18 minutes ago   Up 18 minutes   9300/tcp, 0.0.0.0:9203->9200/tcp, :::9203->9200/tcp, 0.0.0.0:9603->9600/tcp, :::9603->9600/tcp   os-node-03
  fa4efbe64cbf   docker.elastic.co/elasticsearch/elasticsearch-oss:7.10.2   "/tini -- /usr/local…"   18 minutes ago   Up 18 minutes   9300/tcp, 0.0.0.0:9202->9200/tcp, :::9202->9200/tcp, 0.0.0.0:9602->9600/tcp, :::9602->9600/tcp   os-node-02
  17e898d67ac2   docker.elastic.co/elasticsearch/elasticsearch-oss:7.10.2   "/tini -- /usr/local…"   18 minutes ago   Up 18 minutes   9300/tcp, 0.0.0.0:9201->9200/tcp, :::9201->9200/tcp, 0.0.0.0:9601->9600/tcp, :::9601->9600/tcp   os-node-01
  ```
1. Query `_cat/nodes` to verify which node has been elected as cluster manager. Note that OpenSearch 1.x versions use the heading "master," which has been deprecated and replaced by "cluster_manager" in OpenSearch 2.x and later.
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
1. Stop the node you are upgrading.
  ```bash
  docker stop <containerName> && docker container rm <containerName>
  ```
  Sample output:
  ```bash
  $ docker stop os-node-01 && docker container rm os-node-01
  os-node-01
  os-node-01
  ```
  **Important:** Do not delete the volume associated with the container when you delete the container. The new OpenSearch container will use the existing volume. **Deleting the volume will result in data loss.**
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
1. Deploy a new container running the desired version of OpenSearch, mapped to the same volume as the container you deleted. The command used in the dev environment is included below. 
  ```bash
  docker run -d \
      -p 9201:9200 -p 9601:9600 \
      -e "discovery.seed_hosts=os-node-01,os-node-02,os-node-03,os-node-04" -e "DISABLE_SECURITY_PLUGIN=true" \
      -e "DISABLE_INSTALL_DEMO_CONFIG=true" -e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
      -e "cluster.name=opensearch-dev-cluster" -e "node.name=os-node-01" \
      -e "cluster.initial_master_nodes=os-node-01,os-node-02,os-node-03,os-node-04" \
      -e "bootstrap.memory_lock=true" -e "path.repo=/mnt/snapshots" \
      --ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
      -v data-01:/usr/share/opensearch/data \
      -v repo-01:/mnt/snapshots \
      --network opensearch-dev-net \
      --name os-node-01 \
      opensearchproject/opensearch:1.3.7
  ```
  Sample output:
  ```bash
  b6d06de7a016aa3bb76c133c55ba4e0e605f522c7a6a4ebd2aa6c6a6d3f49728
  ```
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
  In the sample output, the new OpenSearch node reports a running version of `7.10.2` to the cluster for compatibility purposes. You can manually confirm the version by reviewing the output of the `/_nodes` API endpoint, like the following command. Replace `<nodeName>` with the name of your node. See [Nodes API]({{site.url}}{{site.baseurl}}/latest/api-reference/nodes-apis/index/) to learn more.
  ```bash
  curl -s -X GET 'localhost:9201/_nodes/<nodeName>?pretty=true' | jq -r '.nodes | .[] | "\(.name) v\(.version)"'
  ```
  Sample output:
  ```bash
  $ curl -s -X GET 'localhost:9201/_nodes/os-node-01?pretty=true' | jq -r '.nodes | .[] | "\(.name) v\(.version)"'
  os-node-01 v1.3.7
  ```
1. Repeat steps 5 through 9 for each node in your cluster. Remember to upgrade an eligible cluster manager node last. When you are finished replacing the last node, query `_cat/nodes` to confirm that all nodes have joined the cluster. The cluster is now bootstrapped to the new version of OpenSearch.
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
  There are no longer any eligible cluster manager nodes running the old version, so a cluster manager running the new version was elected. The cluster has now been bootstrapped to the new version.
1. Reenable shard replication.
  ```bash
  curl -X PUT "http://localhost:9201/_cluster/settings?pretty" -H 'Content-type: application/json' -d'{"persistent":{"cluster.routing.allocation.enable":"all"}}'
  ```
  Sample output:
  ```bash
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
