---
layout: default
title: Upgrade from Elasticsearch OSS to OpenSearch
nav_order: 15
canonical_url: https://docs.opensearch.org/latest/upgrade-to/upgrade-to/
---

# Upgrade from Elasticsearch OSS to OpenSearch

If you want to upgrade from an existing Elasticsearch OSS cluster to OpenSearch and find the [snapshot approach]({{site.url}}{{site.baseurl}}/upgrade-to/snapshot-migrate/) unappealing, you can upgrade your existing nodes from Elasticsearch OSS to OpenSearch.

If your existing cluster runs an older version of Elasticsearch OSS, the first step is to upgrade to version 6.x or 7.x. Elasticsearch OSS supports two types of upgrades: rolling and cluster restart.

- Rolling upgrades let you shut down one node at a time for minimal disruption of service.

  Rolling upgrades work between minor versions (e.g. 6.5 to 6.8) and also support a single path to the next major version (e.g. 6.8 to 7.10.2). Performing these upgrades might require intermediate upgrades to arrive at your desired version and can affect cluster performance as nodes leave and rejoin, but the cluster remains available throughout the process.

- Cluster restart upgrades require you to shut down all nodes, perform the upgrade, and restart the cluster.

  Cluster restart upgrades work between minor versions (e.g. 6.5 to 6.8) and the next major version (for example, 6.x to 7.10.2). Cluster restart upgrades are faster to perform and require fewer intermediate upgrades, but require downtime.


## Upgrade paths

Elasticsearch OSS version | Rolling upgrade path | Cluster restart upgrade path
:--- | :--- | :---
5.x | Upgrade to 5.6, upgrade to 6.8, reindex all 5.x indices, upgrade to 7.10.2, and upgrade to OpenSearch. | Upgrade to 6.8, reindex all 5.x indices, and upgrade to OpenSearch.
6.x | Upgrade to 6.8, upgrade to 7.10.2, and upgrade to OpenSearch. | Upgrade to OpenSearch.
7.x | Upgrade to OpenSearch. | Upgrade to OpenSearch.

If you are upgrading an Open Distro for Elasticsearch cluster, we recommend first upgrading to ODFE 1.13 and then upgrading to OpenSearch.
{: .note }


## Upgrade Elasticsearch OSS

1. Disable shard allocation to prevent Elasticsearch OSS from replicating shards as you shut down nodes:

   ```json
   PUT _cluster/settings
   {
     "persistent": {
       "cluster.routing.allocation.enable": "primaries"
     }
   }
   ```

1. Stop Elasticsearch OSS on one node (rolling upgrade) or all nodes (cluster restart upgrade).

   On Linux distributions that use systemd, use this command:

   ```bash
   sudo systemctl stop elasticsearch.service
   ```

   For tarball installations, find the process ID (`ps aux`) and kill it (`kill <pid>`).

1. Upgrade the node (rolling) or all nodes (cluster restart).

   The exact command varies by package manager, but likely looks something like this:

   ```bash
   sudo yum install elasticsearch-oss-7.10.2 --enablerepo=elasticsearch
   ```

   For tarball installations, extract to a new directory to ensure you **do not overwrite** your `config`, `data`, and `logs` directories. Ideally, these directories should have their own, independent paths and *not* be colocated with the Elasticsearch application directory. Then set the `ES_PATH_CONF` environment variable to the directory that contains `elasticsearch.yml` (e.g. `/etc/elasticesarch/`). In `elasticsearch.yml`, set `path.data` and `path.logs` to your `data` and `logs` directories (e.g. `/var/lib/elasticsearch` and `/var/log/opensearch`).

1. Restart Elasticsearch OSS on the node (rolling) or all nodes (cluster restart).

   On Linux distributions that use systemd, use this command:

   ```bash
   sudo systemctl start elasticsearch.service
   ```

   For tarball installations, run `./bin/elasticsearch -d`.

1. Wait for the node to rejoin the cluster (rolling) or for the cluster to start (cluster restart). Check the `_nodes` summary to verify that all nodes are available and running the expected version:

   ```bash
   # Elasticsearch OSS
   curl -XGET 'localhost:9200/_nodes/_all?pretty=true'
   # Open Distro for Elasticsearch with security plugin enabled
   curl -XGET 'https://localhost:9200/_nodes/_all?pretty=true' -u 'admin:admin' -k
   ```

   Specifically, check the `nodes.<node-id>.version` portion of the response. Also check `_cat/indices?v` for a green status on all indices.

1. (Rolling) Repeat steps 2--5 until all nodes are using the new version.

1. After all nodes are using the new version, re-enable shard allocation:

   ```json
   PUT _cluster/settings
   {
     "persistent": {
       "cluster.routing.allocation.enable": "all"
     }
   }
   ```

1. If you upgraded from 5.x to 6.x, [reindex]({{site.url}}{{site.baseurl}}/opensearch/reindex-data/) all indices.

1. Repeat all steps as necessary until you arrive at your desired Elasticsearch OSS version.


## Upgrade to OpenSearch

1. Disable shard allocation to prevent Elasticsearch OSS from replicating shards as you shut down nodes:

   ```json
   PUT _cluster/settings
   {
     "persistent": {
       "cluster.routing.allocation.enable": "primaries"
     }
   }
   ```

1. Stop Elasticsearch OSS on one node (rolling upgrade) or all nodes (cluster restart upgrade).

   On Linux distributions that use systemd, use this command:

   ```bash
   sudo systemctl stop elasticsearch.service
   ```

   For tarball installations, find the process ID (`ps aux`) and kill it (`kill <pid>`).

1. Upgrade the node (rolling) or all nodes (cluster restart).

   1. Extract the OpenSearch tarball to a new directory to ensure you **do not overwrite** your Elasticsearch OSS `config`, `data`, and `logs` directories.

   1. (Optional) Copy or move your Elasticsearch OSS `data` and `logs` directories to new paths. For example, you might move `/var/lib/elasticsearch` to `/var/lib/opensearch`.

   1. Set the `OPENSEARCH_PATH_CONF` environment variable to the directory that contains `opensearch.yml` (e.g. `/etc/opensearch`).

   1. In `opensearch.yml`, set `path.data` and `path.logs`. You might also want to disable the security plugin for now. `opensearch.yml` might look something like this:

      ```yml
      path.data: /var/lib/opensearch
      path.logs: /var/log/opensearch
      plugins.security.disabled: true
      ```

   1. Port your settings from `elasticsearch.yml` to `opensearch.yml`. Most settings use the same names. At a minimum, specify `cluster.name`, `node.name`, `discovery.seed_hosts`, and `cluster.initial_master_nodes`.

   1. (Optional) If you're actively connecting to the cluster with legacy clients that check for a particular version number, such as Logstash OSS, add a [compatibility setting]({{site.url}}{{site.baseurl}}/clients/agents-and-ingestion-tools/) to `opensearch.yml`:

      ```yml
      compatibility.override_main_response_version: true
      ```

   1. (Optional) Add your certificates to your `config` directory, add them to `opensearch.yml`, and initialize the security plugin.

1. Start OpenSearch on the node (rolling) or all nodes (cluster restart).

   For the tarball, run `./bin/opensearch -d`.

1. Wait for the OpenSearch node to rejoin the cluster (rolling) or for the cluster to start (cluster restart). Check the `_nodes` summary to verify that all nodes are available and running the expected version:

   ```bash
   # Security plugin disabled
   curl -XGET 'localhost:9200/_nodes/_all?pretty=true'
   # Security plugin enabled
   curl -XGET -k -u 'admin:admin' 'https://localhost:9200/_nodes/_all?pretty=true'
   ```

   Specifically, check the `nodes.<node-id>.version` portion of the response. Also check `_cat/indices?v` for a green status on all indices.

1. (Rolling) Repeat steps 2--5 until all nodes are using OpenSearch.

1. After all nodes are using the new version, re-enable shard allocation:

   ```json
   PUT _cluster/settings
   {
     "persistent": {
       "cluster.routing.allocation.enable": "all"
     }
   }
   ```
