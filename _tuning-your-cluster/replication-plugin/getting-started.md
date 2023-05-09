---
layout: default
title: Getting started
nav_order: 15
parent: Cross-cluster replication
redirect_from:
  - /replication-plugin/get-started/
---

# Getting started with cross-cluster replication

With cross-cluster replication, you index data to a leader index, and OpenSearch replicates that data to one or more read-only follower indexes. All subsequent operations on the leader are replicated on the follower, such as creating, updating, or deleting documents.

## Prerequisites

Cross-cluster replication has the following prerequisites:
- Both the leader and follower cluster must have the replication plugin installed.
- If you've overridden `node.roles` in `opensearch.yml` on the follower cluster, make sure it also includes the `remote_cluster_client` role:

   ```yaml
   node.roles: [<other_roles>, remote_cluster_client]
   ```

## Permissions

Make sure the Security plugin is either enabled on both clusters or disabled on both clusters. If you disabled the Security plugin, you can skip this section. However, we strongly recommend enabling the Security plugin in production scenarios.

If the Security plugin is enabled, make sure that non-admin users are mapped to the appropriate permissions so they can perform replication actions. For index and cluster-level permissions requirements, see [Cross-cluster replication permissions]({{site.url}}{{site.baseurl}}/replication-plugin/permissions/).

In addition, verify and add the distinguished names (DNs) of each follower cluster node on the leader cluster to allow connections from the followers to the leader.

First, get the node's DN from each follower cluster:

  ```bash
curl -XGET -k -u 'admin:admin' 'https://localhost:9200/_opendistro/_security/api/ssl/certs?pretty'

{
   "transport_certificates_list": [
      {
         "issuer_dn" : "CN=Test,OU=Server CA 1B,O=Test,C=US",
         "subject_dn" : "CN=follower.test.com", # To be added under leader's nodes_dn configuration
         "not_before" : "2021-11-12T00:00:00Z",
         "not_after" : "2022-12-11T23:59:59Z"
      }
   ]
}
  ```

Then verify that it's part of the leader cluster configuration in `opensearch.yml`. Otherwise, add it under the following setting:

  ```yaml
plugins.security.nodes_dn:
  - "CN=*.leader.com, OU=SSL, O=Test, L=Test, C=DE" # Already part of the configuration
  - "CN=follower.test.com" # From the above response from follower
  ```
## Example setup

To start two single-node clusters on the same network, save this sample file as `docker-compose.yml` and run `docker-compose up`:

```yml
version: '3'
services:
  replication-node1:
    image: opensearchproject/opensearch:{{site.opensearch_version}}
    container_name: replication-node1
    environment:
      - cluster.name=leader-cluster
      - discovery.type=single-node
      - bootstrap.memory_lock=true
      - "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - opensearch-data2:/usr/share/opensearch/data
    ports:
      - 9201:9200
      - 9700:9600 # required for Performance Analyzer
    networks:
      - opensearch-net
  replication-node2:
    image: opensearchproject/opensearch:{{site.opensearch_version}}
    container_name: replication-node2
    environment:
      - cluster.name=follower-cluster
      - discovery.type=single-node
      - bootstrap.memory_lock=true
      - "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - opensearch-data1:/usr/share/opensearch/data
    ports:
      - 9200:9200
      - 9600:9600 # required for Performance Analyzer
    networks:
      - opensearch-net

volumes:
  opensearch-data1:
  opensearch-data2:

networks:
  opensearch-net:
```

After the clusters start, verify the names of each:

```bash
curl -XGET -u 'admin:admin' -k 'https://localhost:9201'
{
  "cluster_name" : "leader-cluster",
  ...
}

curl -XGET -u 'admin:admin' -k 'https://localhost:9200'
{
  "cluster_name" : "follower-cluster",
  ...
}
```

For this example, use port 9201 (`replication-node1`) as the leader and port 9200 (`replication-node2`) as the follower cluster.

To get the IP address for the leader cluster, first identify its container ID:

```bash
docker ps
CONTAINER ID    IMAGE                                       PORTS                                                      NAMES
3b8cdc698be5    opensearchproject/opensearch:{{site.opensearch_version}}   0.0.0.0:9200->9200/tcp, 0.0.0.0:9600->9600/tcp, 9300/tcp   replication-node2
731f5e8b0f4b    opensearchproject/opensearch:{{site.opensearch_version}}   9300/tcp, 0.0.0.0:9201->9200/tcp, 0.0.0.0:9700->9600/tcp   replication-node1
```

Then get that container's IP address:

```bash
docker inspect --format='{% raw %}{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}{% endraw %}' 731f5e8b0f4b
172.22.0.3
```

## Set up a cross-cluster connection

Cross-cluster replication follows a "pull" model, so most changes occur on the follower cluster, not the leader cluster. 

On the follower cluster, add the IP address (with port 9300) for each seed node. Because this is a single-node cluster, you only have one seed node. Provide a descriptive name for the connection, which you'll use in the request to start replication:

```bash
curl -XPUT -k -H 'Content-Type: application/json' -u 'admin:admin' 'https://localhost:9200/_cluster/settings?pretty' -d '
{
  "persistent": {
    "cluster": {
      "remote": {
        "my-connection-alias": {
          "seeds": ["172.22.0.3:9300"]
        }
      }
    }
  }
}'
```

## Start replication

To get started, create an index called `leader-01` on the leader cluster:

```bash
curl -XPUT -k -H 'Content-Type: application/json' -u 'admin:admin' 'https://localhost:9201/leader-01?pretty'
```

Then start replication from the follower cluster. In the request body, provide the connection name and leader index that you want to replicate, along with the security roles you want to use:

```bash
curl -XPUT -k -H 'Content-Type: application/json' -u 'admin:admin' 'https://localhost:9200/_plugins/_replication/follower-01/_start?pretty' -d '
{
   "leader_alias": "my-connection-alias",
   "leader_index": "leader-01",
   "use_roles":{
      "leader_cluster_role": "all_access",
      "follower_cluster_role": "all_access"
   }
}'
```

If the Security plugin is disabled, omit the `use_roles` parameter. If it's enabled, however, you must specify the leader and follower cluster roles that OpenSearch will use to authenticate the request. This example uses `all_access` for simplicity, but we recommend creating a replication user on each cluster and [mapping it accordingly]({{site.url}}{{site.baseurl}}/replication-plugin/permissions/#map-the-leader-and-follower-cluster-roles).
{: .tip }

This command creates an identical read-only index named `follower-01` on the follower cluster that continuously stays updated with changes to the `leader-01` index on the leader cluster. Starting replication creates a follower index from scratch -- you can't convert an existing index to a follower index. 

## Confirm replication

After replication starts, get the status:

```bash
curl -XGET -k -u 'admin:admin' 'https://localhost:9200/_plugins/_replication/follower-01/_status?pretty'

{
  "status" : "SYNCING",
  "reason" : "User initiated",
  "leader_alias" : "my-connection-alias",
  "leader_index" : "leader-01",
  "follower_index" : "follower-01",
  "syncing_details" : {
    "leader_checkpoint" : -1,
    "follower_checkpoint" : -1,
    "seq_no" : 0
  }
}
```

Possible statuses are `SYNCING`, `BOOTSTRAPPING`, `PAUSED`, and `REPLICATION NOT IN PROGRESS`. 

The leader and follower checkpoint values begin as negative numbers and reflect the shard count (-1 for one shard, -5 for five shards, and so on). The values increment with each change and illustrate how many updates the follower is behind the leader. If the indexes are fully synced, the values are the same.

To confirm that replication is actually happening, add a document to the leader index:

```bash
curl -XPUT -k -H 'Content-Type: application/json' -u 'admin:admin' 'https://localhost:9201/leader-01/_doc/1?pretty' -d '{"The Shining": "Stephen King"}'
```

Then validate the replicated content on the follower index:

```bash
curl -XGET -k -u 'admin:admin' 'https://localhost:9200/follower-01/_search?pretty'

{
  ...
  "hits": [{
    "_index": "follower-01",
    "_id": "1",
    "_score": 1.0,
    "_source": {
      "The Shining": "Stephen King"
    }
  }]
}
```

## Pause and resume replication

You can temporarily pause replication of an index if you need to remediate issues or reduce load on the leader cluster:

```bash
curl -XPOST -k -H 'Content-Type: application/json' -u 'admin:admin' 'https://localhost:9200/_plugins/_replication/follower-01/_pause?pretty' -d '{}'
```

To confirm that replication is paused, get the status:

```bash
curl -XGET -k -u 'admin:admin' 'https://localhost:9200/_plugins/_replication/follower-01/_status?pretty'

{
  "status" : "PAUSED",
  "reason" : "User initiated",
  "leader_alias" : "my-connection-alias",
  "leader_index" : "leader-01",
  "follower_index" : "follower-01"
}
```

When you're done making changes, resume replication:

```bash
curl -XPOST -k -H 'Content-Type: application/json' -u 'admin:admin' 'https://localhost:9200/_plugins/_replication/follower-01/_resume?pretty' -d '{}'
```

When replication resumes, the follower index picks up any changes that were made to the leader index while replication was paused.

Note that you can't resume replication after it's been paused for more than 12 hours. You must [stop replication]({{site.url}}{{site.baseurl}}/replication-plugin/api/#stop-replication), delete the follower index, and restart replication of the leader.

## Stop replication

When you no longer need to replicate an index, terminate replication from the follower cluster:

```bash
curl -XPOST -k -H 'Content-Type: application/json' -u 'admin:admin' 'https://localhost:9200/_plugins/_replication/follower-01/_stop?pretty' -d '{}'
```

When you stop replication, the follower index un-follows the leader and becomes a standard index that you can write to. You can't restart replication after stopping it. 

Get the status to confirm that the index is no longer being replicated:

```bash
curl -XGET -k -u 'admin:admin' 'https://localhost:9200/_plugins/_replication/follower-01/_status?pretty'

{
  "status" : "REPLICATION NOT IN PROGRESS"
}
```

You can further confirm that replication is stopped by making modifications to the leader index and confirming they don't show up on the follower index.


