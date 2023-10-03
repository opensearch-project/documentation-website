---
layout: default
title: Migrating from Elasticsearch OSS to OpenSearch
nav_order: 15
---

# Migrating from Elasticsearch OSS to OpenSearch

If you want to migrate from an existing Elasticsearch OSS cluster to OpenSearch and find the [snapshot approach]({{site.url}}{{site.baseurl}}/upgrade-to/snapshot-migrate/) unappealing, you can migrate your existing nodes from Elasticsearch OSS to OpenSearch.

If your existing cluster runs an older version of Elasticsearch OSS, the first step is to upgrade to version 6.x or 7.x.

Before deciding on the version of Elasticsearch OSS for your upgrade, refer to the [Migrating to OpenSearch and limits on the number of nested JSON objects]({{site.url}}{{site.baseurl}}/breaking-changes/#migrating-to-opensearch-and-limits-on-the-number-of-nested-json-objects) documentation in Breaking changes to see whether the issue will have an impact on your cluster and, therefore, your decisions about upgrades and migration.
{: .important }

Elasticsearch OSS supports two types of upgrades: rolling and cluster restart.

- Rolling upgrades let you shut down one node at a time for minimal disruption of service.

  Rolling upgrades work between minor versions (for example, 6.5 to 6.8) and also support a single path to the next major version (for example, 6.8 to 7.10.2). Performing these upgrades might require intermediate upgrades to arrive at your desired version and can affect cluster performance as nodes leave and rejoin, but the cluster remains available throughout the process.

- Cluster restart upgrades require you to shut down all nodes, perform the upgrade, and restart the cluster.

  Cluster restart upgrades work between minor versions (for example, 6.5 to 6.8) and the next major version (for example, 6.x to 7.10.2). Cluster restart upgrades are faster to perform and require fewer intermediate upgrades, but require downtime.

To migrate a post-fork version of Elasticsearch (7.11+) to OpenSearch, you can use Logstash.  You'll need to employ the Elasticsearch input plugin within Logstash to extract data from the Elasticsearch cluster, and the [Logstash Output OpenSearch plugin](https://github.com/opensearch-project/logstash-output-opensearch#configuration-for-logstash-output-opensearch-plugin) to write the data to the OpenSearch 2.x cluster. We suggest using Logstash version 7.13.4 or earlier, as newer versions may encounter compatibility issues when establishing a connection with OpenSearch due to changes introduced by Elasticsearch subsequent to the fork. We strongly recommend that users test this solution with their own data to ensure effectiveness. 
{: .note} 

## Migration paths

Elasticsearch OSS version | Rolling upgrade path | Cluster restart upgrade path
:--- | :--- | :---
5.x | Upgrade to 5.6, upgrade to 6.8, reindex all 5.x indexes, upgrade to 7.10.2, and migrate to OpenSearch. | Upgrade to 6.8, reindex all 5.x indexes, and migrate to OpenSearch.
6.x | Upgrade to 6.8, upgrade to 7.10.2, and migrate to OpenSearch. | Migrate to OpenSearch.
7.x | Migrate to OpenSearch. | Migrate to OpenSearch.

If you are migrating an Open Distro for Elasticsearch cluster, we recommend first upgrading to ODFE 1.13 and then migrating to OpenSearch.
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

   For tarball installations, extract to a new directory to ensure you **do not overwrite** your `config`, `data`, and `logs` directories. Ideally, these directories should have their own, independent paths and *not* be colocated with the Elasticsearch application directory. Then set the `ES_PATH_CONF` environment variable to the directory that contains `elasticsearch.yml` (for example, `/etc/elasticsearch/`). In `elasticsearch.yml`, set `path.data` and `path.logs` to your `data` and `logs` directories (for example, `/var/lib/elasticsearch` and `/var/log/opensearch`).

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
   # Open Distro for Elasticsearch with Security plugin enabled
   curl -XGET 'https://localhost:9200/_nodes/_all?pretty=true' -u 'admin:admin' -k
   ```

   Specifically, check the `nodes.<node-id>.version` portion of the response. Also check `_cat/indices?v` for a green status on all indexes.

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

1. If you upgraded from 5.x to 6.x, [reindex]({{site.url}}{{site.baseurl}}/opensearch/reindex-data/) all indexes.

1. Repeat all steps as necessary until you arrive at your desired Elasticsearch OSS version.


## Migrate to OpenSearch

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

   1. Set the `OPENSEARCH_PATH_CONF` environment variable to the directory that contains `opensearch.yml` (for example, `/etc/opensearch`).

   1. In `opensearch.yml`, set `path.data` and `path.logs`. You might also want to disable the Security plugin for now. `opensearch.yml` might look something like this:

      ```yml
      path.data: /var/lib/opensearch
      path.logs: /var/log/opensearch
      plugins.security.disabled: true
      ```

   1. Port your settings from `elasticsearch.yml` to `opensearch.yml`. Most settings use the same names. At a minimum, specify `cluster.name`, `node.name`, `discovery.seed_hosts`, and `cluster.initial_cluster_manager_nodes`.

   1. (Optional) If you're actively connecting to the cluster with legacy clients that check for a particular version number, such as Logstash OSS, add a [compatibility setting]({{site.url}}{{site.baseurl}}/tools/index/) to `opensearch.yml`:

      ```yml
      compatibility.override_main_response_version: true
      ```

   1. (Optional) Add your certificates to your `config` directory, add them to `opensearch.yml`, and initialize the Security plugin.

1. Start OpenSearch on the node (rolling) or all nodes (cluster restart).

   For the tarball, run `./bin/opensearch -d`.

1. Wait for the OpenSearch node to rejoin the cluster (rolling) or for the cluster to start (cluster restart). Check the `_nodes` summary to verify that all nodes are available and running the expected version:

   ```bash
   # Security plugin disabled
   curl -XGET 'localhost:9200/_nodes/_all?pretty=true'
   # Security plugin enabled
   curl -XGET -k -u 'admin:admin' 'https://localhost:9200/_nodes/_all?pretty=true'
   ```

   Specifically, check the `nodes.<node-id>.version` portion of the response. Also check `_cat/indices?v` for a green status on all indexes.

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

## Upgrade tool

The `opensearch-upgrade` tool lets you automate some of the steps in [Migrate to OpenSearch]({{site.url}}{{site.baseurl}}/upgrade-to/upgrade-to/#migrate-to-opensearch), eliminating the need for error-prone manual operations.

The `opensearch-upgrade` tool performs the following functions:

- Imports any existing configurations and applies it to the new installation of OpenSearch.
- Installs any existing core plugins.

### Limitations

The `opensearch-upgrade` tool doesn't perform an end-to-end upgrade:

- You need to run the tool on each node of the cluster individually as part of the upgrade process.
- The tool doesn't provide a rollback option after you've upgraded a node, so make sure you follow best practices and take backups.
- You must install all community plugins (if available) manually.
- The tool only validates any keystore settings at service start-up time, so you must manually remove any unsupported settings for the service to start.

### Using the upgrade tool

To perform a rolling upgrade using the [OpenSearch tarball]({{site.url}}{{site.baseurl}}/opensearch/install/tar/) distribution:

Check [Migration paths]({{site.url}}{{site.baseurl}}/upgrade-to/upgrade-to/#migration-paths) to make sure that the version you’re upgrading to is supported and whether you need to upgrade to a supported Elasticsearch OSS version first.
{: .note }

1. Disable shard allocation to prevent Elasticsearch OSS from replicating shards as you shut down nodes:

   ```json
   PUT _cluster/settings
   {
     "persistent": {
       "cluster.routing.allocation.enable": "primaries"
     }
   }
   ```

1. On any one of the nodes, download and extract the OpenSearch tarball to a new directory.

1. Make sure the following environment variables are set:

    - `ES_HOME` - Path to the existing Elasticsearch installation home.

      ```bash
      export ES_HOME=/home/workspace/upgrade-demo/node1/elasticsearch-7.10.2
      ```

    - `ES_PATH_CONF` - Path to the existing Elasticsearch config directory.

      ```bash
      export ES_PATH_CONF=/home/workspace/upgrade-demo/node1/os-config
      ```

    - `OPENSEARCH_HOME` - Path to the OpenSearch installation home.

      ```bash
      export OPENSEARCH_HOME=/home/workspace/upgrade-demo/node1/opensearch-1.0.0
      ```

    - `OPENSEARCH_PATH_CONF` - Path to the OpenSearch config directory.

      ```bash
      export OPENSEARCH_PATH_CONF=/home/workspace/upgrade-demo/node1/opensearch-config
      ```

1. The `opensearch-upgrade` tool is in the `bin` directory of the distribution. Run the following command from the distribution home:

   Make sure you run this tool as the same user running the current Elasticsearch service.
   {: .note }

   ```json
   ./bin/opensearch-upgrade
   ```

1. Stop Elasticsearch OSS on the node.

   On Linux distributions that use systemd, use this command:

   ```bash
   sudo systemctl stop elasticsearch.service
   ```

   For tarball installations, find the process ID (`ps aux`) and kill it (`kill <pid>`).

1. Start OpenSearch on the node:

   ```json
   ./bin/opensearch -d.
   ```

1. Repeat steps 2--6 until all nodes are using the new version.

1. After all nodes are using the new version, re-enable shard allocation:

   ```json
   PUT _cluster/settings
   {
    "persistent": {
       "cluster.routing.allocation.enable": "all"
     }
   }
   ```

### How it works

Behind the scenes, the `opensearch-upgrade` tool performs the following tasks in sequence:

1. Looks for a valid Elasticsearch installation on the current node. After it finds the installation, it reads the `elasticsearch.yml` file to get the endpoint details and connects to the locally running Elasticsearch service. If the tool can't find an Elasticsearch installation, it tries to get the path from the `ES_HOME` location.
1. Verifies if the existing version of Elasticsearch is compatible with the OpenSearch version. It prints a summary of the information gathered to the console and prompts you for a confirmation to proceed.
1. Imports the settings from the `elasticsearch.yml` config file into the `opensearch.yml` config file.
1. Copies across any custom JVM options from the `$ES_PATH_CONF/jvm.options.d` directory into the `$OPENSEARCH_PATH_CONF/jvm.options.d` directory. Similarly, it also imports the logging configurations from the `$ES_PATH_CONF/log4j2.properties` file into the `$OPENSEARCH_PATH_CONF/log4j2.properties` file.
1. Installs the core plugins that you’ve currently installed in the `$ES_HOME/plugins` directory. You must install all other third-party community plugins manually.
1. Imports the secure settings from the `elasticsearch.keystore` file (if any) into the `opensearch.keystore` file. If the keystore file is password protected, the `opensearch-upgrade` tool prompts you to enter the password.
