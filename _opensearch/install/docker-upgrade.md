---
layout: default
title: Upgrade OpenSearch - Docker
parent: Install OpenSearch
nav_order: 1000
---

# Upgrade OpenSearch - Docker

It's important to keep OpenSearch updated to ensure that your workflow 

This guide assumes that you are comfortable working from the Linux command line interface (CLI). You should understand how to input commands, navigate between directories, and edit text files. For help with [Docker](https://www.docker.com/) or [Docker Compose](https://github.com/docker/compose), refer to the official documentation on their websites.
{:.note}

The Docker Compose commands used in this guide are written with a hyphen (for example, `docker-compose`). If you installed Docker Desktop on your machine, which automatically installs a bundled version of Docker Compose, then you should remove the hyphen. For example, change `docker-compose` to `docker compose`.
{:.note}

## Prepare to upgrade

To mitigate the risk of data loss, you should back up any important files before upgrading. Generally speaking, these files will be located in `opensearch/config` (OpenSearch) and `opensearch-dashboards/config` (OpenSearch Dashboards). Some examples include `opensearch.yml`, `opensearch_dashboards.yml`, security plugin backup YAML files, and TLS certificates. Once you identify which files you want to back up, copy them to remote storage so they can be restored if necessary.

We also recommend that you back up your cluster using [Snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/index/).

[Restart upgrade](#restart-upgrade) 

[Rolling upgrade](#rolling-upgrade)















-- Moving this down and writing above it --

## Minor version upgrade

Upgrading your OpenSearch cluster to a newer **minor** version is straightforward because a minor version upgrade will inherit the configuration and data that already exist in your cluster. You should still create and store a remote backup of your cluster to mitigate any risk of data loss. See [Snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/index/) for more information.

1. Stop the cluster.
    ```bash
    docker-compose down
    ```
1. Modify your Compose file by changing the specified `image` to the target upgrade version. You might also want to modify settings or environment variables to enable a newly released feature.
1. Start the cluster with the updated Docker Compose file.
    ```bash
    docker-compose up
    ```
1. Wait for the containers to start, then query the [CAT nodes]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-nodes/) API endpoint to confirm that the version upgrade was successful.
    ```bash
    # This sample response is from a cluster that was upgraded from 2.3.0 to 2.4.0.
    $ curl "https://localhost:9200/_cat/nodes?v&h=name,version&format=json&pretty" -ku admin:admin
    [
    {
        "name" : "opensearch-node2",
        "version" : "2.4.0"
    },
    {
        "name" : "opensearch-node1",
        "version" : "2.4.0"
    }
    ]
    ```

## Major version upgrade

There are several methods available for upgrading across major versions of OpenSearch. Which method you choose depends on your specific requirements.

- Snapshot and restore
    - Should be performed for any method because it provides a rollback option
    - Security options don't seem to carry over
- Cluster Restart Upgrade
    - Cluster is taken down and brought back up with new version (same infra)
- Rolling Upgrade
    - Nodes are taken down one at a time, upgraded, and added back to the cluster
- Node replacement
    - Nodes are taken out of service and replaced with a new node running the upgraded version
- Remote reindexing
    - Reindexing is the option to “replay” all of the original source documents into the new cluster. Reindexing needs to be used in conjunction with some of the other approaches in some contexts (e.g. if you are doing a rolling upgrade across multiple major versions, you currently need to reindex within the cluster between major versions), but it can also be used as a standalone method.

Remote reindexing is used in tandem with other methods. Open Q - does remote reindexing force an admin to run two clusters simultaneously?



Test methodology:

Create 1.x OS cluster locally - DONE
Prep remote host (VM) with Docker/Docker Compose and system updates - DONE
Configure local OS cluster (index data and create an internal user) - DONE
Configure snapshot and repository locally - DONE
Save current state of local cluster in snapshot and store in S3 repository - DONE
Restore from snapshot using newer version
Remote reindexing from local machine (can't do it the other way since my laptop isn't accessible from the public internet) (???)



Results/Notes:

Snapshot taken from 1.3.6 cluster cannot be restored to 2.4.0 cluster:
```
$ curl -H 'Content-Type: application/json' -X POST "https://localhost:9200/_snapshot/s3-snapshot-repository/v1-3-6-snapshot/_restore?pretty=true" -ku admin:admin
{
  "error" : {
    "root_cause" : [
      {
        "type" : "security_exception",
        "reason" : "no permissions for [] and User [name=admin, backend_roles=[admin], requestedTenant=null]"
      }
    ],
    "type" : "security_exception",
    "reason" : "no permissions for [] and User [name=admin, backend_roles=[admin], requestedTenant=null]"
  },
  "status" : 403
}
```

Looks like there are issues/conflicts with existing indices. The following command worked for restoring the snapshot, but only because I excluded several indexes:
```bash
$ curl -H 'Content-Type: application/json' -X POST "https://localhost:9200/_snapshot/s3-snapshot-repository/v1-3-6-snapshot/_restore?pretty=true" -d'{"indices":"-.opendistro_security,-.kibana_92668751_admin_1,-security-auditlog-2022.12.06,-.kibana_1","include_global_state":false}' -ku admin:admin
{
  "accepted" : true
}
```

Here's what indexes exist on the vanilla 2.4.0 cluster:
```bash
$ curl "https://localhost:9200/_cat/indices?v&expand_wildcards=all" -ku admin:admin
health status index                        uuid                   pri rep docs.count docs.deleted store.size pri.store.size
green  open   security-auditlog-2022.12.07 CMV0wahaQ-KozeMpaAW9Sg   1   1         11            0      172kb           45kb
green  open   .opendistro_security         PC3HoaAWRLGAA95zPbSI8Q   1   1         10            0    140.1kb         71.8kb
green  open   .kibana_1                    LsTNN5_ZQMuA529Z3q88_Q   1   1          0            0       416b           208b
```

Restoration from the snapshot without excluding indexes fails:
```bash
$ curl -H 'Content-Type: application/json' -X POST "https://localhost:9200/_snapshot/s3-snapshot-repository/v1-3-6-snapshot/_restore?pretty=true" -ku admin:admin
{
  "error" : {
    "root_cause" : [
      {
        "type" : "security_exception",
        "reason" : "no permissions for [] and User [name=admin, backend_roles=[admin], requestedTenant=null]"
      }
    ],
    "type" : "security_exception",
    "reason" : "no permissions for [] and User [name=admin, backend_roles=[admin], requestedTenant=null]"
  },
  "status" : 403
}
```


From docker-compose-2.4.yml, fresh cluster:

$ curl "https://localhost:9200/_cat/indices?v&expand_wildcards=all" -ku admin:admin
health status index                uuid                   pri rep docs.count docs.deleted store.size pri.store.size
green  open   .kibana_1            bLHGoZMWTd-V2ROzPUVAsQ   1   1          0            0       416b           208b
green  open   .opendistro_security FCJr5Hy9THCd22Njv0S_Jw   1   1         10            0    143.6kb         71.8kb

Register S3 Repo (order of steps, must be run on EACH NODE):
./bin/opensearch-plugin install repository-s3
./bin/opensearch-keystore add s3.client.default.access_key
Access key ID: redacted
./bin/opensearch-keystore add s3.client.default.secret_key
Secret access key: redacted
curl -X POST https://localhost:9200/_nodes/reload_secure_settings -ku admin:admin
--restart container--
curl -H 'Content-Type: application/json' -X PUT "https://localhost:9200/_snapshot/s3-snapshot-repository" -ku admin:admin -d'{"type":"s3","settings":{"bucket":"jeffh-snapshots","base_path":"snapshots/"}}'

Ispect the desired snapshot:
$ curl -H 'Content-Type: application/json' -X GET "https://localhost:9200/_snapshot/s3-snapshot-repository/v136-global-state-false?pretty=true" -ku admin:admin
{
  "snapshots" : [
    {
      "snapshot" : "v136-global-state-false",
      "uuid" : "hJGKVGUzQR-kv4ZUjep_dg",
      "version_id" : 135248427,
      "version" : "1.3.6",
      "indices" : [
        "security-auditlog-2022.12.09",
        "security-auditlog-2022.12.06",
        ".opensearch-observability",
        ".kibana_101107607_jhuss_1",
        "ecommerce",
        ".kibana_1",
        ".opendistro_security",
        ".kibana_92668751_admin_1"
      ],
      "data_streams" : [ ],
      "include_global_state" : false,
      "state" : "SUCCESS",
      "start_time" : "2022-12-12T22:01:41.624Z",
      "start_time_in_millis" : 1670882501624,
      "end_time" : "2022-12-12T22:01:42.426Z",
      "end_time_in_millis" : 1670882502426,
      "duration_in_millis" : 802,
      "failures" : [ ],
      "shards" : {
        "total" : 8,
        "failed" : 0,
        "successful" : 8
      }
    }
  ]
}

Copy security plugin YAML files:
docker cp . <containerId>:/usr/share/opensearch/config/opensearch-security/backups/

Restore security config from backed up files (from one of the containers)
./securityadmin.sh -cd /usr/share/opensearch/config/opensearch-security/backups/ -icl -nhnv \
  -cacert ../../../config/root-ca.pem \
  -cert ../../../config/kirk.pem \
  -key ../../../config/kirk-key.pem

Restore from snapshot:
$ curl -H 'Content-Type: application/json' -X POST "https://localhost:9200/_snapshot/s3-snapshot-repository/v136-global-state-false/_restore?pretty=true" -d'{"indices":"ecommerce","include_global_state":false}' -ku admin:admin
{
  "accepted" : true
}

As a sanity check here I did a diff on the YAML files from my origin cluster (running 1.3.6) and my target cluster (running 2.4.0). This is after the security settings and index have been restored.
b0be8382702a:tmp jeffhuss$ diff opensearch-1.3.6-default.yml opensearch-2.4-default.yml 
b0be8382702a:tmp jeffhuss$ diff opensearch_dashboards-1.3.6-default.yml opensearch_dashboards-2.4-default.yml 
175a176,194
> # Set the value of this setting to false to suppress search usage telemetry
> # for reducing the load of OpenSearch cluster.
> # data.search.usageTelemetry.enabled: false
> 
> # 2.4 renames 'wizard.enabled: false' to 'vis_builder.enabled: false'
> # Set the value of this setting to false to disable VisBuilder
> # functionality in Visualization.
> # vis_builder.enabled: false
> 
> # 2.4 New Experimental Feature
> # Set the value of this setting to true to enable the experimental multiple data source
> # support feature. Use with caution.
> # data_source.enabled: false
> # Set the value of these settings to customize crypto materials to encryption saved credentials
> # in data sources.
> # data_source.encryption.wrappingKeyName: 'changeme'
> # data_source.encryption.wrappingKeyNamespace: 'changeme'
> # data_source.encryption.wrappingKey: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
> 

Also rechecked this query to confirm it is returning mathces from the ecommerce index. This worked - response is too long to paste here but it did match as expected.
$ curl -H 'Content-Type: application/json' -X GET "https://localhost:9200/ecommerce/_search?pretty=true" -ku admin:admin -d' {"query":{"match":{"customer_first_name":"Sonya"}}}'



NEW METHOD! I'm scrapping everything relating to `docker compose` for these upgrades because without some fancy footwork it really seems to make the process difficult.

The new process is to stand up a large-ish `1.3.7` cluster. Then I will ingest data using the ecommerce data from Dashboards, create a snapshot, and start a node replacement upgrade, with no downtime. A snapshot will be taken as well for testing against a cluster restart upgrade.

The new nodes:

```bash
#! /bin/bash

# Each function defines and launches a container
launch_node_01()    {
    docker run -d \
	-p 9201:9200 -p 9601:9600 \
	-e "discovery.seed_hosts=os-node-01,os-node-02" -e "DISABLE_SECURITY_PLUGIN=true" \
	-e "DISABLE_INSTALL_DEMO_CONFIG=true" -e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
	-e "cluster.name=opensearch-dev-cluster" -e "node.name=os-node-01" \
	-e "cluster.initial_master_nodes=os-node-01,os-node-02,os-node-03,os-node-04" \
	-e "bootstrap.memory_lock=true" -e "path.repo=/mnt/snapshots" \
	--ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
	-v os-data-01:/usr/share/opensearch/data \
  	-v /Users/jeffhuss/Documents/opensearch/snapshots/repo-01:/mnt/snapshots \
	--network opensearch-dev-net \
	--name os-node-01 \
	opensearchproject/opensearch:1.3.7
}

launch_node_02()    {
    docker run -d \
	-p 9202:9200 -p 9602:9600 \
	-e "discovery.seed_hosts=os-node-01,os-node-02" -e "DISABLE_SECURITY_PLUGIN=true" \
	-e "DISABLE_INSTALL_DEMO_CONFIG=true" -e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
	-e "cluster.name=opensearch-dev-cluster" -e "node.name=os-node-02" \
	-e "cluster.initial_master_nodes=os-node-01,os-node-02,os-node-03,os-node-04" \
	-e "bootstrap.memory_lock=true" -e "path.repo=/mnt/snapshots" \
	--ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
	-v os-data-02:/usr/share/opensearch/data \
  	-v /Users/jeffhuss/Documents/opensearch/snapshots/repo-01:/mnt/snapshots \
	--network opensearch-dev-net \
	--name os-node-02 \
	opensearchproject/opensearch:1.3.7
}
launch_node_03()    {
    docker run -d \
	-p 9203:9200 -p 9603:9600 \
	-e "discovery.seed_hosts=os-node-01,os-node-02" -e "DISABLE_SECURITY_PLUGIN=true" \
	-e "DISABLE_INSTALL_DEMO_CONFIG=true" -e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
	-e "cluster.name=opensearch-dev-cluster" -e "node.name=os-node-03" \
	-e "cluster.initial_master_nodes=os-node-01,os-node-02,os-node-03,os-node-04" \
	-e "bootstrap.memory_lock=true" -e "path.repo=/mnt/snapshots" \
	--ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
	-v os-data-03:/usr/share/opensearch/data \
  	-v /Users/jeffhuss/Documents/opensearch/snapshots/repo-01:/mnt/snapshots \
	--network opensearch-dev-net \
	--name os-node-03 \
	opensearchproject/opensearch:1.3.7
}

launch_node_04()    {
	docker run -d \
		-p 9204:9200 -p 9604:9600 \
		-e "discovery.seed_hosts=os-node-01,os-node-02" -e "DISABLE_SECURITY_PLUGIN=true" \
		-e "DISABLE_INSTALL_DEMO_CONFIG=true" -e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
		-e "cluster.name=opensearch-dev-cluster" -e "node.name=os-node-04" \
		-e "cluster.initial_master_nodes=os-node-01,os-node-02,os-node-03,os-node-04" \
		-e "bootstrap.memory_lock=true" -e "path.repo=/mnt/snapshots" \
		--ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
		-v os-data-04:/usr/share/opensearch/data \
	  	-v /Users/jeffhuss/Documents/opensearch/snapshots/repo-01:/mnt/snapshots \
		--network opensearch-dev-net \
		--name os-node-04 \
		opensearchproject/opensearch:1.3.7
}

launch_node_05()    {
	docker run -d \
		-p 9205:9200 -p 9605:9600 \
		-e "discovery.seed_hosts=os-node-01,os-node-02" -e "DISABLE_SECURITY_PLUGIN=true" \
		-e "DISABLE_INSTALL_DEMO_CONFIG=true" -e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
		-e "cluster.name=opensearch-dev-cluster" -e "node.name=os-node-05" \
		-e "cluster.initial_master_nodes=os-node-01,os-node-02,os-node-03,os-node-04" \
		-e "bootstrap.memory_lock=true" -e "path.repo=/mnt/snapshots" \
		--ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
		-v os-data-05:/usr/share/opensearch/data \
	  	-v /Users/jeffhuss/Documents/opensearch/snapshots/repo-01:/mnt/snapshots \
		--network opensearch-dev-net \
		--name os-node-05 \
		opensearchproject/opensearch:1.3.7
}

launch_node_06()    {
	docker run -d \
		-p 9206:9200 -p 9606:9600 \
		-e "discovery.seed_hosts=os-node-01,os-node-02" -e "DISABLE_SECURITY_PLUGIN=true" \
		-e "DISABLE_INSTALL_DEMO_CONFIG=true" -e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
		-e "cluster.name=opensearch-dev-cluster" -e "node.name=os-node-06" \
		-e "cluster.initial_master_nodes=os-node-01,os-node-02,os-node-03,os-node-04" \
		-e "bootstrap.memory_lock=true" -e "path.repo=/mnt/snapshots" \
		--ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
		-v os-data-06:/usr/share/opensearch/data \
	  	-v /Users/jeffhuss/Documents/opensearch/snapshots/repo-01:/mnt/snapshots \
		--network opensearch-dev-net \
		--name os-node-06 \
		opensearchproject/opensearch:1.3.7
}

launch_node_07()    {
	docker run -d \
		-p 9207:9200 -p 9607:9600 \
		-e "discovery.seed_hosts=os-node-01,os-node-02" -e "DISABLE_SECURITY_PLUGIN=true" \
		-e "DISABLE_INSTALL_DEMO_CONFIG=true" -e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
		-e "cluster.name=opensearch-dev-cluster" -e "node.name=os-node-07" \
		-e "cluster.initial_master_nodes=os-node-01,os-node-02,os-node-03,os-node-04" \
		-e "bootstrap.memory_lock=true" -e "path.repo=/mnt/snapshots" \
		--ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
		-v os-data-07:/usr/share/opensearch/data \
	  	-v /Users/jeffhuss/Documents/opensearch/snapshots/repo-01:/mnt/snapshots \
		--network opensearch-dev-net \
		--name os-node-07 \
		opensearchproject/opensearch:1.3.7
}

launch_node_dashboards()	{
	docker run -d \
		-p 5601:5601 --expose 5601 \
		-e "DISABLE_SECURITY_DASHBOARDS_PLUGIN=true" \
		-e 'OPENSEARCH_HOSTS=["http://os-node-01:9200","http://os-node-02:9200"]' \
		--network opensearch-dev-net \
		--name os-dashboards-01 \
		opensearchproject/opensearch-dashboards:1.3.7
}

launch_node_01
launch_node_02
launch_node_03
launch_node_04
launch_node_05
launch_node_06
launch_node_07
launch_node_dashboards
```

Register snapshot repo:
```bash
curl -H 'Content-Type: application/json' -X PUT http://localhost:9200/_snapshot/snapshots -d'{"type":"fs","settings":{"location":"/mnt/snapshots"}}'
```

Take a snapshot that includes everything:
```bash
curl -H 'Content-Type: application/json' -X PUT "http://localhost:9200/_snapshot/snapshots/snapshot-name"
```

Disable allocation of shard replicas:
```bash
$ curl -X PUT "http://localhost:9201/_cluster/settings?pretty" -H 'Content-type: application/json' -d'{"persistent":{"cluster.routing.allocation.enable":"primaries"}}'
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

Initially `os-node-04` was elected leader, so I stopped and started that node, which forced `os-node-01` to become the cluster leader. This isn't part of the process, but it helped confirm for me that the cluster is able to recover.

```bash
$ curl "http://localhost:9201/_cat/nodes"
172.28.0.3 23 99 4 0.25 0.30 0.49 dimr - os-node-02
172.28.0.5 40 99 4 0.25 0.30 0.49 dimr - os-node-04
172.28.0.7 48 99 4 0.25 0.30 0.49 dimr - os-node-06
172.28.0.2 64 99 4 0.25 0.30 0.49 dimr * os-node-01
172.28.0.4 43 99 4 0.25 0.30 0.49 dimr - os-node-03
172.28.0.6 53 99 4 0.25 0.30 0.49 dimr - os-node-05
172.28.0.8 18 99 4 0.25 0.30 0.49 dimr - os-node-07

$ curl "http://localhost:9201/_cat/shards"
ecommerce                       0 p STARTED 4675  3.9mb 172.28.0.2 os-node-01
ecommerce                       0 r STARTED 4675  3.9mb 172.28.0.8 os-node-07
.opendistro-reports-definitions 0 p STARTED    0   208b 172.28.0.8 os-node-07
.opendistro-reports-definitions 0 r STARTED    0   208b 172.28.0.5 os-node-04
.opendistro-reports-definitions 0 r STARTED    0   208b 172.28.0.7 os-node-06
.kibana_1                       0 p STARTED    2  8.7kb 172.28.0.4 os-node-03
.kibana_1                       0 r STARTED    2 13.5kb 172.28.0.2 os-node-01
.opendistro-reports-instances   0 r STARTED    0   208b 172.28.0.4 os-node-03
.opendistro-reports-instances   0 p STARTED    0   208b 172.28.0.6 os-node-05
.opendistro-reports-instances   0 r STARTED    0   208b 172.28.0.3 os-node-02
```

Sample query to demonstrate that data is there (truncated because the response is huge):
```bash
$ curl -H 'Content-Type: application/json' -X GET "http://localhost:9201/ecommerce/_search?pretty=true" -d'{"query":{"match":{"customer_first_name":"Sonya"}}}'
{
  "took" : 116,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
```

Flush the data streams and indexes so that anything in the transaction log is permanently written to the Lucene index:
```bash
$ curl -X POST "http://localhost:9201/_flush?pretty"
{
  "_shards" : {
    "total" : 10,
    "successful" : 10,
    "failed" : 0
  }
}
```

Stop and remove the first node I want to upgrade:
```bash
$ docker container stop os-node-01 && docker rm os-node-01 && docker volume rm os-data-01
```

Create and start new container with the same settings, called `os-node-01`:
```bash
docker run -d \
	-p 9201:9200 -p 9601:9600 \
	-e "discovery.seed_hosts=os-node-01,os-node-02" -e "DISABLE_SECURITY_PLUGIN=true" \
	-e "DISABLE_INSTALL_DEMO_CONFIG=true" -e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
	-e "cluster.name=opensearch-dev-cluster" -e "node.name=os-node-01" \
	-e "cluster.initial_cluster_manager_nodes=os-node-01,os-node-02,os-node-03,os-node-04" \
	-e "bootstrap.memory_lock=true" -e "path.repo=/mnt/snapshots" \
	--ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
	-v os-data-01:/usr/share/opensearch/data \
  	-v /Users/jeffhuss/Documents/opensearch/snapshots/repo-01:/mnt/snapshots \
	--network opensearch-dev-net \
	--name os-node-01 \
	opensearchproject/opensearch:2.4.1
```

The new node is reachable and an old node has been elected leader:
```bash
$ curl -s "http://localhost:9201/_cat/nodes?v&h=name,version,node.role,master" | column -t
name        version  node.role  master
os-node-06  1.3.7    dimr       -
os-node-05  1.3.7    dimr       -
os-node-04  1.3.7    dimr       *
os-node-03  1.3.7    dimr       -
os-node-07  1.3.7    dimr       -
os-node-01  2.4.1    dimr       -
os-node-02  1.3.7    dimr       -
```

Remove `os-node-07` (since my discover.seed_hosts only includes `os-node-01` and `os-node-02` I don't want to move up the node order sequentially or I'm afraid the new nodes won't be able to discover a master eligible node):
```bash
$ docker container stop os-node-07 && docker rm os-node-07 && docker volume rm os-data-07
os-node-07
os-node-07
os-data-07
```

Create and start new container:
```bash
docker run -d \
	-p 9207:9200 -p 9607:9600 \
	-e "discovery.seed_hosts=os-node-01,os-node-02" -e "DISABLE_SECURITY_PLUGIN=true" \
	-e "DISABLE_INSTALL_DEMO_CONFIG=true" -e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
	-e "cluster.name=opensearch-dev-cluster" -e "node.name=os-node-07" \
	-e "cluster.initial_cluster_manager_nodes=os-node-01,os-node-02,os-node-03,os-node-04" \
	-e "bootstrap.memory_lock=true" -e "path.repo=/mnt/snapshots" \
	--ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
	-v os-data-07:/usr/share/opensearch/data \
  	-v /Users/jeffhuss/Documents/opensearch/snapshots/repo-01:/mnt/snapshots \
	--network opensearch-dev-net \
	--name os-node-07 \
	opensearchproject/opensearch:2.4.1
```

Confirm nodes:
```bash
$ curl -s "http://localhost:9201/_cat/nodes?v&h=name,version,node.role,master" | column -t
name        version  node.role  master
os-node-01  2.4.1    dimr       -
os-node-04  1.3.7    dimr       *
os-node-02  1.3.7    dimr       -
os-node-07  2.4.1    dimr       -
os-node-03  1.3.7    dimr       -
os-node-06  1.3.7    dimr       -
os-node-05  1.3.7    dimr       -
```

Remove `os-node-06`:
```bash
$  docker container stop os-node-06 && docker rm os-node-06 && docker volume rm os-data-06
os-node-06
os-node-06
os-data-06
```

Replace with new node:
```bash
docker run -d \
	-p 9206:9200 -p 9606:9600 \
	-e "discovery.seed_hosts=os-node-01,os-node-02" -e "DISABLE_SECURITY_PLUGIN=true" \
	-e "DISABLE_INSTALL_DEMO_CONFIG=true" -e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
	-e "cluster.name=opensearch-dev-cluster" -e "node.name=os-node-06" \
	-e "cluster.initial_cluster_manager_nodes=os-node-01,os-node-02,os-node-03,os-node-04" \
	-e "bootstrap.memory_lock=true" -e "path.repo=/mnt/snapshots" \
	--ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
	-v os-data-06:/usr/share/opensearch/data \
  	-v /Users/jeffhuss/Documents/opensearch/snapshots/repo-01:/mnt/snapshots \
	--network opensearch-dev-net \
	--name os-node-06 \
	opensearchproject/opensearch:2.4.1
```

Confirm:
```bash
$ curl -s "http://localhost:9201/_cat/nodes?v&h=name,version,node.role,master" | column -t
name        version  node.role  master
os-node-06  2.4.1    dimr       -
os-node-05  1.3.7    dimr       -
os-node-01  2.4.1    dimr       -
os-node-07  2.4.1    dimr       -
os-node-03  1.3.7    dimr       -
os-node-02  1.3.7    dimr       -
os-node-04  1.3.7    dimr       *
```

Remove `os-node-05`:
```bash
$  docker container stop os-node-05 && docker rm os-node-05 && docker volume rm os-data-05
os-node-05
os-node-05
os-data-05
```

Replace:
```bash
docker run -d \
	-p 9205:9200 -p 9605:9600 \
	-e "discovery.seed_hosts=os-node-01,os-node-02" -e "DISABLE_SECURITY_PLUGIN=true" \
	-e "DISABLE_INSTALL_DEMO_CONFIG=true" -e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
	-e "cluster.name=opensearch-dev-cluster" -e "node.name=os-node-05" \
	-e "cluster.initial_cluster_manager_nodes=os-node-01,os-node-02,os-node-03,os-node-04" \
	-e "bootstrap.memory_lock=true" -e "path.repo=/mnt/snapshots" \
	--ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
	-v os-data-05:/usr/share/opensearch/data \
  	-v /Users/jeffhuss/Documents/opensearch/snapshots/repo-01:/mnt/snapshots \
	--network opensearch-dev-net \
	--name os-node-05 \
	opensearchproject/opensearch:2.4.1
```

Confirm:
```bash
$ curl -s "http://localhost:9201/_cat/nodes?v&h=name,version,node.role,master" | column -t
name        version  node.role  master
os-node-07  2.4.1    dimr       -
os-node-04  1.3.7    dimr       *
os-node-01  2.4.1    dimr       -
os-node-03  1.3.7    dimr       -
os-node-06  2.4.1    dimr       -
os-node-02  1.3.7    dimr       -
os-node-05  2.4.1    dimr       -
```

Remove `os-node-04`:
```bash
$  docker container stop os-node-04 && docker rm os-node-04 && docker volume rm os-data-04
os-node-04
os-node-04
os-data-04
```

Add:
```bash
docker run -d \
	-p 9204:9200 -p 9604:9600 \
	-e "discovery.seed_hosts=os-node-01,os-node-02" -e "DISABLE_SECURITY_PLUGIN=true" \
	-e "DISABLE_INSTALL_DEMO_CONFIG=true" -e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
	-e "cluster.name=opensearch-dev-cluster" -e "node.name=os-node-04" \
	-e "cluster.initial_cluster_manager_nodes=os-node-01,os-node-02,os-node-03,os-node-04" \
	-e "bootstrap.memory_lock=true" -e "path.repo=/mnt/snapshots" \
	--ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
	-v os-data-04:/usr/share/opensearch/data \
  	-v /Users/jeffhuss/Documents/opensearch/snapshots/repo-01:/mnt/snapshots \
	--network opensearch-dev-net \
	--name os-node-04 \
	opensearchproject/opensearch:2.4.1
```

Confirm:
```bash
$ curl -s "http://localhost:9201/_cat/nodes?v&h=name,version,node.role,master" | column -t
name        version  node.role  master
os-node-07  2.4.1    dimr       -
os-node-01  2.4.1    dimr       -
os-node-06  2.4.1    dimr       -
os-node-05  2.4.1    dimr       -
os-node-04  2.4.1    dimr       -
os-node-02  1.3.7    dimr       -
os-node-03  1.3.7    dimr       *
```

Remove `os-node-03`:
```bash
$  docker container stop os-node-03 && docker rm os-node-03 && docker volume rm os-data-03
os-node-03
os-node-03
os-data-03
```

Add:
```bash
docker run -d \
	-p 9203:9200 -p 9603:9600 \
	-e "discovery.seed_hosts=os-node-01,os-node-02" -e "DISABLE_SECURITY_PLUGIN=true" \
	-e "DISABLE_INSTALL_DEMO_CONFIG=true" -e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
	-e "cluster.name=opensearch-dev-cluster" -e "node.name=os-node-03" \
	-e "cluster.initial_cluster_manager_nodes=os-node-01,os-node-02,os-node-03,os-node-04" \
	-e "bootstrap.memory_lock=true" -e "path.repo=/mnt/snapshots" \
	--ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
	-v os-data-03:/usr/share/opensearch/data \
  	-v /Users/jeffhuss/Documents/opensearch/snapshots/repo-01:/mnt/snapshots \
	--network opensearch-dev-net \
	--name os-node-03 \
	opensearchproject/opensearch:2.4.1
```

Confirm:
```bash
$ curl -s "http://localhost:9201/_cat/nodes?v&h=name,version,node.role,master" | column -t
name        version  node.role  master
os-node-03  2.4.1    dimr       -
os-node-02  1.3.7    dimr       -
os-node-06  2.4.1    dimr       -
os-node-01  2.4.1    dimr       -
os-node-04  2.4.1    dimr       -
os-node-07  2.4.1    dimr       -
os-node-05  2.4.1    dimr       *
```

Remove `os-node-02`:
```bash
$  docker container stop os-node-02 && docker rm os-node-02 && docker volume rm os-data-02
os-node-02
os-node-02
os-data-02
```

Add:
```bash
docker run -d \
	-p 9202:9200 -p 9602:9600 \
	-e "discovery.seed_hosts=os-node-01,os-node-02" -e "DISABLE_SECURITY_PLUGIN=true" \
	-e "DISABLE_INSTALL_DEMO_CONFIG=true" -e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
	-e "cluster.name=opensearch-dev-cluster" -e "node.name=os-node-02" \
	-e "cluster.initial_cluster_manager_nodes=os-node-01,os-node-02,os-node-03,os-node-04" \
	-e "bootstrap.memory_lock=true" -e "path.repo=/mnt/snapshots" \
	--ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
	-v os-data-02:/usr/share/opensearch/data \
  	-v /Users/jeffhuss/Documents/opensearch/snapshots/repo-01:/mnt/snapshots \
	--network opensearch-dev-net \
	--name os-node-02 \
	opensearchproject/opensearch:2.4.1
```

Confirm:
```bash
$ curl -s "http://localhost:9201/_cat/nodes?v&h=name,version,node.role,master" | column -t
name        version  node.role  master
os-node-06  2.4.1    dimr       -
os-node-05  2.4.1    dimr       *
os-node-02  2.4.1    dimr       -
os-node-07  2.4.1    dimr       -
os-node-03  2.4.1    dimr       -
os-node-01  2.4.1    dimr       -
os-node-04  2.4.1    dimr       -
```

Shards are all unassigned:
```bash
$ curl "http://localhost:9201/_cat/shards"
.opendistro-reports-instances   0 p UNASSIGNED    
.opendistro-reports-instances   0 r UNASSIGNED    
.opendistro-reports-instances   0 r UNASSIGNED    
ecommerce                       0 p UNASSIGNED    
ecommerce                       0 r UNASSIGNED    
.opendistro-reports-definitions 0 p UNASSIGNED    
.opendistro-reports-definitions 0 r UNASSIGNED    
.opendistro-reports-definitions 0 r UNASSIGNED    
.kibana_1                       0 p UNASSIGNED    
.kibana_1                       0 r UNASSIGNED 
```

```bash
$ curl "http://localhost:9201/_cluster/health?pretty"
{
  "cluster_name" : "opensearch-dev-cluster",
  "status" : "red",
  "timed_out" : false,
  "number_of_nodes" : 7,
  "number_of_data_nodes" : 7,
  "discovered_master" : true,
  "discovered_cluster_manager" : true,
  "active_primary_shards" : 0,
  "active_shards" : 0,
  "relocating_shards" : 0,
  "initializing_shards" : 0,
  "unassigned_shards" : 10,
  "delayed_unassigned_shards" : 0,
  "number_of_pending_tasks" : 0,
  "number_of_in_flight_fetch" : 0,
  "task_max_waiting_in_queue_millis" : 0,
  "active_shards_percent_as_number" : 0.0
}
```

Re-enable shard allocation:
```bash
$ curl -X PUT "http://localhost:9201/_cluster/settings?pretty" -H 'Content-type: application/json' -d'{"persistent":{"cluster.routing.allocation.enabl"all"}}'
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

All the shards are gone?
```bash
$ curl "http://localhost:9201/_cluster/allocation/explain?include_yes_decisions=true&pretty"
{
  "index" : "ecommerce",
  "shard" : 0,
  "primary" : true,
  "current_state" : "unassigned",
  "unassigned_info" : {
    "reason" : "NODE_LEFT",
    "at" : "2022-12-14T21:37:11.280Z",
    "details" : "node_left [MkhnDKBtTOWBd-7QxUlBSw]",
    "last_allocation_status" : "no_valid_shard_copy"
  },
  "can_allocate" : "no_valid_shard_copy",
  "allocate_explanation" : "cannot allocate because a previous copy of the primary shard existed but can no longer be found on the nodes in the cluster",
  "node_allocation_decisions" : [
    {
      "node_id" : "2L4W085XSGaRHDxkE-5L8Q",
      "node_name" : "os-node-01",
      "transport_address" : "172.28.0.2:9300",
      "node_attributes" : {
        "shard_indexing_pressure_enabled" : "true"
      },
      "node_decision" : "no",
      "store" : {
        "found" : false
      }
    },
    {
      "node_id" : "8EwXgQBAQX2zP89nrgrKFA",
      "node_name" : "os-node-07",
      "transport_address" : "172.28.0.8:9300",
      "node_attributes" : {
        "shard_indexing_pressure_enabled" : "true"
      },
      "node_decision" : "no",
      "store" : {
        "found" : false
      }
    },
    {
      "node_id" : "Ih-SG920RC6DPidgcXNvJA",
      "node_name" : "os-node-06",
      "transport_address" : "172.28.0.7:9300",
      "node_attributes" : {
        "shard_indexing_pressure_enabled" : "true"
      },
      "node_decision" : "no",
      "store" : {
        "found" : false
      }
    },
    {
      "node_id" : "L0mkCS3kQFKBNa5yOJPYDQ",
      "node_name" : "os-node-05",
      "transport_address" : "172.28.0.6:9300",
      "node_attributes" : {
        "shard_indexing_pressure_enabled" : "true"
      },
      "node_decision" : "no",
      "store" : {
        "found" : false
      }
    },
    {
      "node_id" : "ePSKdgWdRTWh-p21ix2LRw",
      "node_name" : "os-node-04",
      "transport_address" : "172.28.0.5:9300",
      "node_attributes" : {
        "shard_indexing_pressure_enabled" : "true"
      },
      "node_decision" : "no",
      "store" : {
        "found" : false
      }
    },
    {
      "node_id" : "oBfqwDTkSKOmTN6jxBBQ2w",
      "node_name" : "os-node-03",
      "transport_address" : "172.28.0.4:9300",
      "node_attributes" : {
        "shard_indexing_pressure_enabled" : "true"
      },
      "node_decision" : "no",
      "store" : {
        "found" : false
      }
    },
    {
      "node_id" : "v0emxjXpSJSmoKAqKQ1a8g",
      "node_name" : "os-node-02",
      "transport_address" : "172.28.0.3:9300",
      "node_attributes" : {
        "shard_indexing_pressure_enabled" : "true"
      },
      "node_decision" : "no",
      "store" : {
        "found" : false
      }
    }
  ]
}
```

The snapshot is still accessible, though. But at this point the "zero downtime" upgrade process is failed due to the lack of shard availability.
```bash
$ curl -H 'Content-Type: application/json' -X GET "http://localhost:9201/_snapshot/snapshots/_all?pretty=true"
{
  "snapshots" : [
    {
      "snapshot" : "snapshot-137-all",
      "uuid" : "NQDJaX5ISBmjJYkk-muyQQ",
      "version_id" : 135248527,
      "version" : "1.3.7",
      "indices" : [
        ".opendistro-reports-definitions",
        ".opendistro-reports-instances",
        "ecommerce",
        ".kibana_1"
      ],
      "data_streams" : [ ],
      "include_global_state" : true,
      "state" : "SUCCESS",
      "start_time" : "2022-12-14T20:45:43.454Z",
      "start_time_in_millis" : 1671050743454,
      "end_time" : "2022-12-14T20:45:43.854Z",
      "end_time_in_millis" : 1671050743854,
      "duration_in_millis" : 400,
      "failures" : [ ],
      "shards" : {
        "total" : 4,
        "failed" : 0,
        "successful" : 4
      }
    }
  ]
}
```

Snapshot restore fails:
```bash
$ curl -H 'Content-Type: application/json' -X POST "http://localhost:9201/_snapshot/snapshots/snapshot-137-all/_restore?pretty"
{
  "error" : {
    "root_cause" : [
      {
        "type" : "snapshot_restore_exception",
        "reason" : "[snapshots:snapshot-137-all/NQDJaX5ISBmjJYkk-muyQQ] cannot restore index [ecommerce] because an open index with same name already exists in the cluster. Either close or delete the existing index or restore the index under a different name by providing a rename pattern and replacement name"
      }
    ],
    "type" : "snapshot_restore_exception",
    "reason" : "[snapshots:snapshot-137-all/NQDJaX5ISBmjJYkk-muyQQ] cannot restore index [ecommerce] because an open index with same name already exists in the cluster. Either close or delete the existing index or restore the index under a different name by providing a rename pattern and replacement name"
  },
  "status" : 500
}
```






Attempt #2 - this time without doing a `docker volume rm` after removing each node. Also, only using the first 4 nodes (`os-node-0[1,4]`)

```bash
curl -H 'Content-Type: application/json' -X PUT http://localhost:9201/_snapshot/snapshots -d'{"type":"fs","settings":{"location":"/mnt/snapshots"}}'
```

Query returns a good response:
```bash
curl -H 'Content-Type: application/json' -X GET "http://localhost:9201/ecommerce/_search?pretty=true" -d'{"query":{"match":{"customer_first_name":"Sonya"}}}'
```

```bash
$ curl -s "http://localhost:9201/_cat/nodes?v&h=name,version,node.role,master" | column -t
name        version  node.role  master
os-node-03  1.3.7    dimr       -
os-node-04  1.3.7    dimr       -
os-node-01  1.3.7    dimr       *
os-node-02  1.3.7    dimr       -
```

```bash
$ curl "http://localhost:9201/_cat/shards"
.opendistro-reports-definitions 0 p STARTED    0  208b 172.29.0.3 os-node-02
.opendistro-reports-definitions 0 r STARTED    0  208b 172.29.0.5 os-node-04
.opendistro-reports-definitions 0 r STARTED    0  208b 172.29.0.2 os-node-01
.opendistro-reports-instances   0 r STARTED    0  208b 172.29.0.5 os-node-04
.opendistro-reports-instances   0 p STARTED    0  208b 172.29.0.2 os-node-01
.opendistro-reports-instances   0 r STARTED    0  208b 172.29.0.4 os-node-03
ecommerce                       0 r STARTED 4675 3.9mb 172.29.0.3 os-node-02
ecommerce                       0 p STARTED 4675 3.9mb 172.29.0.4 os-node-03
.kibana_1                       0 p STARTED    0  208b 172.29.0.3 os-node-02
.kibana_1                       0 r STARTED    0  208b 172.29.0.5 os-node-04
```

Remove `os-node-01`:
```bash
$  docker container stop os-node-01 && docker rm os-node-01
```

Add:
```bash
$ docker run -d \
> -p 9201:9200 -p 9601:9600 \
> -e "discovery.seed_hosts=os-node-01,os-node-02,os-node-03,os-node-04" -e "DISABLE_SECURITY_PLUGIN=true" \
> -e "DISABLE_INSTALL_DEMO_CONFIG=true" -e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
> -e "cluster.name=opensearch-dev-cluster" -e "node.name=os-node-01" \
> -e "cluster.initial_cluster_manager_nodes=os-node-01,os-node-02,os-node-03,os-node-04" \
> -e "bootstrap.memory_lock=true" -e "path.repo=/mnt/snapshots" \
> --ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
> -v os-data-01:/usr/share/opensearch/data \
>   -v /Users/jeffhuss/Documents/opensearch/snapshots/repo-01:/mnt/snapshots \
> --network opensearch-dev-net \
> --name os-node-01 \
> opensearchproject/opensearch:2.4.1
c310ca8886dd5b19002c5bc080c6f2544a8b92c4178a49314e4b23bdb5ffff80
```

Confirm:
```bash
$ curl -s "http://localhost:9201/_cat/nodes?v&h=name,version,node.role,master" | column -t
name        version  node.role  master
os-node-02  1.3.7    dimr       -
os-node-01  2.4.1    dimr       -
os-node-03  1.3.7    dimr       *
os-node-04  1.3.7    dimr       -
```

Shards:
```bash
$ curl "http://localhost:9201/_cat/shards"
.kibana_1                       0 p STARTED    0  208b 172.29.0.3 os-node-02
.kibana_1                       0 r STARTED    0  208b 172.29.0.5 os-node-04
.opendistro-reports-definitions 0 p STARTED    0  208b 172.29.0.3 os-node-02
.opendistro-reports-definitions 0 r STARTED    0  208b 172.29.0.5 os-node-04
.opendistro-reports-definitions 0 r STARTED    0  208b 172.29.0.2 os-node-01
ecommerce                       0 r STARTED 4675 3.9mb 172.29.0.3 os-node-02
ecommerce                       0 p STARTED 4675 3.9mb 172.29.0.4 os-node-03
.opendistro-reports-instances   0 p STARTED    0  208b 172.29.0.5 os-node-04
.opendistro-reports-instances   0 r STARTED    0  208b 172.29.0.2 os-node-01
.opendistro-reports-instances   0 r STARTED    0  208b 172.29.0.4 os-node-03
```

```bash
$ curl "http://localhost:9201/_cluster/health?pretty"
{
  "cluster_name" : "opensearch-dev-cluster",
  "status" : "green",
  "timed_out" : false,
  "number_of_nodes" : 4,
  "number_of_data_nodes" : 4,
  "discovered_master" : true,
  "discovered_cluster_manager" : true,
  "active_primary_shards" : 4,
  "active_shards" : 10,
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

I continued down this path and upon replacing all nodes:
```bash
$ curl -s "http://localhost:9201/_cat/nodes?v&h=name,version,node.role,master" | column -t
name        version  node.role  master
os-node-02  2.4.1    dimr       -
os-node-03  2.4.1    dimr       *
os-node-01  2.4.1    dimr       -
os-node-04  2.4.1    dimr       -

$ curl "http://localhost:9201/_cat/shards"
.kibana_1                       0 p STARTED    0  208b 172.29.0.3 os-node-02
.kibana_1                       0 r STARTED    0  208b 172.29.0.5 os-node-04
.opendistro-reports-definitions 0 r STARTED    0  208b 172.29.0.3 os-node-02
.opendistro-reports-definitions 0 r STARTED    0  208b 172.29.0.5 os-node-04
.opendistro-reports-definitions 0 p STARTED    0  208b 172.29.0.2 os-node-01
ecommerce                       0 p STARTED 4675 3.9mb 172.29.0.3 os-node-02
ecommerce                       0 r STARTED 4675 3.9mb 172.29.0.4 os-node-03
.opendistro-reports-instances   0 r STARTED    0  208b 172.29.0.5 os-node-04
.opendistro-reports-instances   0 p STARTED    0  208b 172.29.0.2 os-node-01
.opendistro-reports-instances   0 r STARTED    0  208b 172.29.0.4 os-node-03

$ curl -H 'Content-Type: application/json' -X GET "http://localhost:9201/ecommerce/_search?pretty=true" -d'{"query":{"match":{"customer_first_name":"Sonya"}}}'
{
  "took" : 7,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 106,
      "relation" : "eq"
    },
    "max_score" : 3.9562898,
[...]
            "region_name" : "Bogota D.C.",
            "continent_name" : "South America",
            "city_name" : "Bogotu00e1"
          },
          "event" : {
            "dataset" : "sample_ecommerce"
          }
        }
      }
    ]
  }
}
```
