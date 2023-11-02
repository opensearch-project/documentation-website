---
layout: default
title: Core settings
parent: Configuring OpenSearch
nav_order: 10
---

# Core settings

The following settings apply specifically to the OpenSearch core:

- `network.host`: Bind OpenSearch to the correct network interface. Use 0.0.0.0 to include all available interfaces, or specify an IP address assigned to a specific interface. The `network.host` setting is a combination of `network.bind_host` and `network.publish_host` if they are the same value. An alternative to `network.host` could be to configure `network.bind_host` and `network.publish_host` separately as needed.

- `http.port`: Used for setting the custom port for HTTP. 

- `discovery.seed_hosts`: The list of hosts that perform discovery when a node is started. The default list of hosts is `["127.0.0.1", "[::1]"]`.

- `cluster.initial_cluster_manager_nodes`: A list of cluster-manager-eligible nodes used to bootstrap the cluster. 

- `discovery.zen.minimum_master_nodes`: The minimum number of cluster manager nodes. Set to 1 to allow single node clusters. 

- `gateway.recover_after_nodes`: After a full cluster restart, the number of nodes that must start before recovery can begin.

- `discovery.type`: Before configuring a cluster, set discovery.type to single-node to prevent the bootstrap checks from failing when you start the service. 

- `cluster.name`: The cluster name. 

- `node.name`: A descriptive name for the node.

- `node.attr.rack`: Custom attributes for the node.

- `path.data`: A path to the directory where your data is stored. Separate multiple locations with commas. 

- `path.logs`: A path to log files.

- `bootstrap.memory_lock`: Locks the memory at startup. We recommend setting the heap size to about half the memory available on the system and that the owner of the process is allowed to use this limit. OpenSearch doesn't perform well when the system is swapping the memory. 

- `action.destructive_requires_name`: Determines whether explicit names are required to delete indexes. Default is `true`. 

- `cluster.remote_store.enabled`: Determines whether the cluster forces index creation when remote store is enabled. Default is `true`. 

- `cluster.remote_store.repository`: The repository used for segment upload when enforcing remote store for an index. 

- `cluster.remote_store.translog.enabled`: Determines whether the cluster forces index creation when translog remote store is enabled. Default is `true`. 

- `cluster.remote_store.translog.repository`: The repository used for translog upload when enforcing remote store for an index. 


## Core settings examples

```yml
network.host: 192.168.0.1
http.port: 9200
discovery.seed_hosts: ["host1", "host2"]
cluster.initial_cluster_manager_nodes: ["node-1", "node-2"]
discovery.zen.minimum_master_nodes: 1
gateway.recover_after_nodes: 3
discovery.type: single-node
cluster.name: my-application
node.name: node-1
node.attr.rack: r1
path.data: path/to/data/datafile/
path.logs: path/to/logs/logfile/
bootstrap.memory_lock: true
action.destructive_requires_name: true
cluster.remote_store.enabled: true
cluster.remote_store.repository: my-repo-1
cluster.remote_store.translog.enabled: true
cluster.remote_store.translog.repository: my-repo-1
```