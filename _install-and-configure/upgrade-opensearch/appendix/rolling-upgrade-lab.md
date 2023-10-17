---
layout: default
title: Rolling upgrade lab
parent: Upgrades appendix
grand_parent: Upgrading OpenSearch
nav_order: 50
redirect_from:
  - /upgrade-opensearch/appendix/rolling-upgrade-lab/
---

<!--
Testing out tabs for code blocks to identify example outputs and file names.
To use, invoke class="codeblock-label"
-->

<style>
.codeblock-label {
    display: inline-block;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    font-family: Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;
    font-size: .75rem;
    --bg-opacity: 1;
    background-color: #e1e7ef;
    background-color: rgba(224.70600000000002,231.07080000000002,239.394,var(--bg-opacity));
    padding: 0.25rem 0.75rem;
    border-top-width: 1px;
    border-left-width: 1px;
    border-right-width: 1px;
    --border-opacity: 1;
    border-color: #ccd6e0;
    border-color: rgba(204,213.85999999999999,224.39999999999998,var(--border-opacity));
    margin-bottom: 0;
}
</style>

# Rolling upgrade lab

You can follow these steps <OuiToken iconType="tokenStruct" size="xs" color="gray" /> on your own compatible host to recreate the same cluster state the OpenSearch Project used for testing [rolling upgrades]({{site.url}}{{site.baseurl}}/install-and-configure/upgrade-opensearch/rolling-upgrade/). This exercise is useful if you want to test the upgrade process in a development environment.

The steps used in this lab were validated on an arbitrarily chosen [Amazon Elastic Compute Cloud (Amazon EC2)](https://aws.amazon.com/ec2/) `t2.large` instance using [Amazon Linux 2](https://aws.amazon.com/amazon-linux-2/) kernel version `Linux 5.10.162-141.675.amzn2.x86_64` and [Docker](https://www.docker.com/) version `20.10.17, build 100c701`. The instance was provisioned with an attached 20 GiB gp2 [Amazon EBS](https://aws.amazon.com/ebs/) root volume. These specifications are included for informational purposes and do not represent hardware requirements for OpenSearch or OpenSearch Dashboards.

References in this procedure to the `$HOME` path on the host machine in this procedure are represented by the tilde character ("~") to make the instructions more portable. If you would prefer to specify an absolute path, modify the volume paths defined in `upgrade-demo-cluster.sh` and used throughout relevant commands in this document to reflect your environment.

## Setting up the environment

As you follow the steps in this document, you will define several Docker resources, including containers, volumes, and a dedicated Docker network, using a script we provide. You can clean up your environment with the following command if you want to restart the process:

```bash
docker container stop $(docker container ls -aqf name=os-); \
	docker container rm $(docker container ls -aqf name=os-); \
	docker volume rm -f $(docker volume ls -q | egrep 'data-0|repo-0'); \
	docker network rm opensearch-dev-net
```
{% include copy.html %}

The command removes container names matching the regular expression `os-*`, data volumes matching `data-0*` and `repo-0*`, and the Docker network named `opensearch-dev-net`. If you have other Docker resources running on your host, then you should review and modify the command to avoid removing other resources unintentionally. This command does not revert host configuration changes, like memory swapping behavior.
{: .warning}

After selecting a host, you can begin the lab:

1. Install the appropriate version of [Docker Engine](https://docs.docker.com/engine/install/) for your Linux distribution and system architecture. 
1. Configure [important system settings]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/#important-settings) on your host:
    1. Disable memory paging and swapping on the host to improve performance:
	   ```bash
	   sudo swapoff -a
	   ```
	   {% include copy.html %}
	1. Increase the number of memory maps available to OpenSearch. Open the `sysctl` configuration file for editing. This example command uses the [vim](https://www.vim.org/) text editor, but you can use any available text editor:
	   ```bash
	   sudo vim /etc/sysctl.conf
	   ```
	   {% include copy.html %}
	1. Add the following line to `/etc/sysctl.conf`:
	   ```bash
	   vm.max_map_count=262144
	   ```
	   {% include copy.html %}
	1. Save and quit. If you use the `vi` or `vim` text editors, you save and quit by switching to command mode, and entering `:wq!` or `ZZ`. 
	1. Apply the configuration change:
	   ```bash
	   sudo sysctl -p
	   ```
	   {% include copy.html %}
1. Create a new directory called `deploy` in your home directory, then navigate to it. You will use `~/deploy` for paths in the deployment script, configuration files, and TLS certificates:
   ```bash
   mkdir ~/deploy && cd ~/deploy
   ```
   {% include copy.html %}
1. Download `upgrade-demo-cluster.sh` from the OpenSearch Project [documentation-website](https://github.com/opensearch-project/documentation-website) repository:
   ```bash
   wget https://raw.githubusercontent.com/opensearch-project/documentation-website/main/assets/examples/upgrade-demo-cluster.sh
   ```
   {% include copy.html %}
1. Run the script without any modifications in order to deploy four containers running OpenSearch and one container running OpenSearch Dashboards, with custom, self-signed TLS certificates and a pre-defined set of internal users:
   ```bash
   sh upgrade-demo-cluster.sh
   ```
   {% include copy.html %}
1. Confirm that the containers were launched successfully:
   ```bash
   docker container ls
   ```
   {% include copy.html %}
   <p class="codeblock-label">Example response</p>
   ```bash
   CONTAINER ID   IMAGE                                           COMMAND                  CREATED          STATUS          PORTS                                                                                                      NAMES
   6e5218c8397d   opensearchproject/opensearch-dashboards:1.3.7   "./opensearch-dashbo…"   24 seconds ago   Up 22 seconds   0.0.0.0:5601->5601/tcp, :::5601->5601/tcp                                                                  os-dashboards-01
   cb5188308b21   opensearchproject/opensearch:1.3.7              "./opensearch-docker…"   25 seconds ago   Up 24 seconds   9300/tcp, 9650/tcp, 0.0.0.0:9204->9200/tcp, :::9204->9200/tcp, 0.0.0.0:9604->9600/tcp, :::9604->9600/tcp   os-node-04
   71b682aa6671   opensearchproject/opensearch:1.3.7              "./opensearch-docker…"   26 seconds ago   Up 25 seconds   9300/tcp, 9650/tcp, 0.0.0.0:9203->9200/tcp, :::9203->9200/tcp, 0.0.0.0:9603->9600/tcp, :::9603->9600/tcp   os-node-03
   f894054a9378   opensearchproject/opensearch:1.3.7              "./opensearch-docker…"   27 seconds ago   Up 26 seconds   9300/tcp, 9650/tcp, 0.0.0.0:9202->9200/tcp, :::9202->9200/tcp, 0.0.0.0:9602->9600/tcp, :::9602->9600/tcp   os-node-02
   2e9c91c959cd   opensearchproject/opensearch:1.3.7              "./opensearch-docker…"   28 seconds ago   Up 27 seconds   9300/tcp, 9650/tcp, 0.0.0.0:9201->9200/tcp, :::9201->9200/tcp, 0.0.0.0:9601->9600/tcp, :::9601->9600/tcp   os-node-01
   ```
1. The amount of time OpenSearch needs to initialize the cluster varies depending on the performance capabilities of the underlying host. You can follow container logs to see what OpenSearch is doing during the bootstrap process:
   1. Enter the following command to display logs for container `os-node-01` in the terminal window:
      ```bash
      docker logs -f os-node-01
      ```
      {% include copy.html %}
   1. You will see a log entry resembling the following example when the node is ready:
      <p class="codeblock-label">Example</p>
      ```
      [INFO ][o.o.s.c.ConfigurationRepository] [os-node-01] Node 'os-node-01' initialized
      ```
   1. Press `Ctrl+C` to stop following container logs and return to the command prompt.
1. Use cURL to query the OpenSearch REST API. In the following command, `os-node-01` is queried by sending the request to host port `9201`, which is mapped to port `9200` on the container:
   ```bash
   curl -s "https://localhost:9201" -ku admin:admin
   ```
   {% include copy.html %}
   <p class="codeblock-label">Example response</p>
   ```json
   {
       "name" : "os-node-01",
       "cluster_name" : "opensearch-dev-cluster",
       "cluster_uuid" : "g1MMknuDRuuD9IaaNt56KA",
       "version" : {
           "distribution" : "opensearch",
           "number" : "1.3.7",
           "build_type" : "tar",
           "build_hash" : "db18a0d5a08b669fb900c00d81462e221f4438ee",
           "build_date" : "2022-12-07T22:59:20.186520Z",
           "build_snapshot" : false,
           "lucene_version" : "8.10.1",
           "minimum_wire_compatibility_version" : "6.8.0",
           "minimum_index_compatibility_version" : "6.0.0-beta1"
       },
       "tagline" : "The OpenSearch Project: https://opensearch.org/"
   }
   ```

**Tip**: Use the `-s` option with `curl` to hide the progress meter and error messages.
{: .tip}

## Adding data and configuring OpenSearch Security

Now that the OpenSearch cluster is running, it's time to add data and configure some OpenSearch Security settings. The data you add and settings you configure will be validated again after the version upgrade is complete.

This section can be broken down into two parts:
- [Indexing data with the REST API](#indexing-data-with-the-rest-api)
- [Adding data using OpenSearch Dashboards](#adding-data-using-opensearch-dashboards)

### Indexing data with the REST API

1. Download the sample field mappings file:
   ```bash
   wget https://raw.githubusercontent.com/opensearch-project/documentation-website/main/assets/examples/ecommerce-field_mappings.json
   ```
   {% include copy.html %}
1. Next, download the bulk data that you will ingest into this index:
   ```bash
   wget https://raw.githubusercontent.com/opensearch-project/documentation-website/main/assets/examples/ecommerce.json
   ```
   {% include copy.html %}
1. Use the [Create index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/create-index/) API to create an index using the mappings defined in `ecommerce-field_mappings.json`:
   ```bash
   curl -H "Content-Type: application/x-ndjson" \
      -X PUT "https://localhost:9201/ecommerce?pretty" \
      --data-binary "@ecommerce-field_mappings.json" \
      -ku admin:admin
   ```
   {% include copy.html %}
   <p class="codeblock-label">Example response</p>
   ```json
   {
      "acknowledged" : true,
      "shards_acknowledged" : true,
      "index" : "ecommerce"
   }
   ```
1. Use the [Bulk]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/) API to add data to the new ecommerce index from `ecommerce.json`:
   ```bash
   curl -H "Content-Type: application/x-ndjson" \
      -X PUT "https://localhost:9201/ecommerce/_bulk?pretty" \
      --data-binary "@ecommerce.json" \
      -ku admin:admin
   ```
   {% include copy.html %}
   <p class="codeblock-label">Example response (truncated)</p>
   ```json
   {
      "took" : 3323,
      "errors" : false,
      "items" : [
   ...
         "index" : {
            "_index" : "ecommerce",
            "_type" : "_doc",
            "_id" : "4674",
            "_version" : 1,
            "result" : "created",
            "_shards" : {
               "total" : 2,
               "successful" : 2,
               "failed" : 0
            },
            "_seq_no" : 4674,
            "_primary_term" : 1,
            "status" : 201
         }
      ]
   }
   ```
1. <p id="validation">A search query can also confirm that the data was indexed successfully. The following query returns the number of documents in which keyword `customer_first_name` equals `Sonya`:</p>
   ```bash
   curl -H 'Content-Type: application/json' \
      -X GET "https://localhost:9201/ecommerce/_search?pretty=true&filter_path=hits.total" \
      -d'{"query":{"match":{"customer_first_name":"Sonya"}}}' \
      -ku admin:admin
   ```
   {% include copy.html %}
   <p class="codeblock-label" id="query-validation">Example response</p>
   ```json
   {
      "hits" : {
         "total" : {
            "value" : 106,
            "relation" : "eq"
         }
      }
   }
   ```

### Adding data using OpenSearch Dashboards

1. Open a web browser and navigate to port `5601` on your Docker host (for example, <code>https://<var>HOST_ADDRESS</var>:5601</code>). If OpenSearch Dashboards is running and you have network access to the host from your browser client, then you will be redirected to a login page.
    1. If the web browser throws an error because the TLS certificates are self-signed, then you might need to bypass certificate checks in your browser. Refer to the browser's documentation for information about bypassing certificate checks. The common name (CN) for each certificate is generated according to the container and node names for intracluster communication, so connecting to the host from a browser will still result in an "invalid CN" warning.
1. Enter the default username (`admin`) and password (`admin`).
1. On the OpenSearch Dashboards **Home** page, select **Add sample data**.
1. Under **Sample web logs**, select **Add data**.
   1. **Optional**: Select **View data** to review the **[Logs] Web Traffic** dashboard.
1. Select the **Menu button** to open the **Navigation pane**, then go to **Security > Internal users**.
1. Select **Create internal user**.
1. Provide a **Username** and **Password**.
1. In the **Backend role** field, enter `admin`.
1. Select **Create**.

## Backing up important files

Always create backups before making changes to your cluster, especially if the cluster is running in a production environment.

In this section you will be:
- [Registering a snapshot repository](#registering-a-snapshot-repository).
- [Creating a snapshot](#creating-a-snapshot).
- [Backing up security settings](#backing-up-security-settings).

### Registering a snapshot repository

1. Register a repository using the volume that was mapped by `upgrade-demo-cluster.sh`:
   ```bash
   curl -H 'Content-Type: application/json' \
      -X PUT "https://localhost:9201/_snapshot/snapshot-repo?pretty" \
      -d '{"type":"fs","settings":{"location":"/usr/share/opensearch/snapshots"}}' \
      -ku admin:admin
   ```
   {% include copy.html %}
   <p class="codeblock-label">Example response</p>
   ```json
   {
      "acknowledged" : true
   }
   ```
1. **Optional**: Perform an additional check to verify that the repository was created successfully:
   ```bash
   curl -H 'Content-Type: application/json' \
      -X POST "https://localhost:9201/_snapshot/snapshot-repo/_verify?timeout=0s&master_timeout=50s&pretty" \
      -ku admin:admin
   ```
   {% include copy.html %}
   <p class="codeblock-label">Example response</p>
   ```json
   {
      "nodes" : {
         "UODBXfAlRnueJ67grDxqgw" : {
            "name" : "os-node-03"
         },
         "14I_OyBQQXio8nmk0xsVcQ" : {
            "name" : "os-node-04"
         },
         "tQp3knPRRUqHvFNKpuD2vQ" : {
            "name" : "os-node-02"
         },
         "rPe8D6ssRgO5twIP00wbCQ" : {
            "name" : "os-node-01"
         }
      }
   }
   ```

### Creating a snapshot

Snapshots are backups of a cluster’s indexes and state. See [Snapshots]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/index/) to learn more.

1. Create a snapshot that includes all indexes and the cluster state:
   ```bash
   curl -H 'Content-Type: application/json' \
      -X PUT "https://localhost:9201/_snapshot/snapshot-repo/cluster-snapshot-v137?wait_for_completion=true&pretty" \
      -ku admin:admin
   ```
   {% include copy.html %}
   <p class="codeblock-label">Example response</p>
   ```json
   {
      "snapshot" : {
         "snapshot" : "cluster-snapshot-v137",
         "uuid" : "-IYB8QNPShGOTnTtMjBjNg",
         "version_id" : 135248527,
         "version" : "1.3.7",
         "indices" : [
            "opensearch_dashboards_sample_data_logs",
            ".opendistro_security",
            "security-auditlog-2023.02.27",
            ".kibana_1",
            ".kibana_92668751_admin_1",
            "ecommerce",
            "security-auditlog-2023.03.06",
            "security-auditlog-2023.02.28",
            "security-auditlog-2023.03.07"
         ],
         "data_streams" : [ ],
         "include_global_state" : true,
         "state" : "SUCCESS",
         "start_time" : "2023-03-07T18:33:00.656Z",
         "start_time_in_millis" : 1678213980656,
         "end_time" : "2023-03-07T18:33:01.471Z",
         "end_time_in_millis" : 1678213981471,
         "duration_in_millis" : 815,
         "failures" : [ ],
         "shards" : {
            "total" : 9,
            "failed" : 0,
            "successful" : 9
         }
      }
   }
   ```

### Backing up security settings

Cluster administrators can modify OpenSearch Security settings by using any of the following methods:

- Modifying YAML files and running `securityadmin.sh`
- Making REST API requests using the admin certificate
- Making changes with OpenSearch Dashboards

Regardless of the method you choose, OpenSearch Security writes your configuration to a special system index called `.opendistro_security`. This system index is preserved through the upgrade process, and it is also saved in the snapshot you created. However, restoring system indexes requires elevated access granted by the `admin` certificate. To learn more, see [System indexes]({{site.url}}{{site.baseurl}}/security/configuration/system-indices/) and [Configuring TLS certificates]({{site.url}}{{site.baseurl}}/security/configuration/tls/).

You can also export your OpenSearch Security settings as YAML files by running `securityadmin.sh` with the `-backup` option on any of your OpenSearch nodes. These YAML files can be used to reinitialize the `.opendistro_security` index with your existing configuration. The following steps will guide you through generating these backup files and copying them to your host for storage:

1. Open an interactive pseudo-TTY session with `os-node-01`:
   ```bash
   docker exec -it os-node-01 bash
   ```
   {% include copy.html %}
1. Create a directory called `backups` and navigate to it:
   ```bash
   mkdir /usr/share/opensearch/backups && cd /usr/share/opensearch/backups
   ```
   {% include copy.html %}
1. Use `securityadmin.sh` to create backups of your OpenSearch Security settings in `/usr/share/opensearch/backups/`:
   ```bash
   /usr/share/opensearch/plugins/opensearch-security/tools/securityadmin.sh \
      -backup /usr/share/opensearch/backups \
      -icl \
      -nhnv \
      -cacert /usr/share/opensearch/config/root-ca.pem \
      -cert /usr/share/opensearch/config/admin.pem \
      -key /usr/share/opensearch/config/admin-key.pem
   ```
   {% include copy.html %}
   <p class="codeblock-label">Example response</p>
   ```bash
   Security Admin v7
   Will connect to localhost:9300 ... done
   Connected as CN=A,OU=DOCS,O=OPENSEARCH,L=PORTLAND,ST=OREGON,C=US
   OpenSearch Version: 1.3.7
   OpenSearch Security Version: 1.3.7.0
   Contacting opensearch cluster 'opensearch' and wait for YELLOW clusterstate ...
   Clustername: opensearch-dev-cluster
   Clusterstate: GREEN
   Number of nodes: 4
   Number of data nodes: 4
   .opendistro_security index already exists, so we do not need to create one.
   Will retrieve '/config' into /usr/share/opensearch/backups/config.yml 
      SUCC: Configuration for 'config' stored in /usr/share/opensearch/backups/config.yml
   Will retrieve '/roles' into /usr/share/opensearch/backups/roles.yml 
      SUCC: Configuration for 'roles' stored in /usr/share/opensearch/backups/roles.yml
   Will retrieve '/rolesmapping' into /usr/share/opensearch/backups/roles_mapping.yml 
      SUCC: Configuration for 'rolesmapping' stored in /usr/share/opensearch/backups/roles_mapping.yml
   Will retrieve '/internalusers' into /usr/share/opensearch/backups/internal_users.yml 
      SUCC: Configuration for 'internalusers' stored in /usr/share/opensearch/backups/internal_users.yml
   Will retrieve '/actiongroups' into /usr/share/opensearch/backups/action_groups.yml 
      SUCC: Configuration for 'actiongroups' stored in /usr/share/opensearch/backups/action_groups.yml
   Will retrieve '/tenants' into /usr/share/opensearch/backups/tenants.yml 
      SUCC: Configuration for 'tenants' stored in /usr/share/opensearch/backups/tenants.yml
   Will retrieve '/nodesdn' into /usr/share/opensearch/backups/nodes_dn.yml 
      SUCC: Configuration for 'nodesdn' stored in /usr/share/opensearch/backups/nodes_dn.yml
   Will retrieve '/whitelist' into /usr/share/opensearch/backups/whitelist.yml 
      SUCC: Configuration for 'whitelist' stored in /usr/share/opensearch/backups/whitelist.yml
   Will retrieve '/audit' into /usr/share/opensearch/backups/audit.yml 
      SUCC: Configuration for 'audit' stored in /usr/share/opensearch/backups/audit.yml
   ```
1. **Optional**: Create a backup directory for TLS certificates and store copies of the certificates. Repeat this for each node if you use unique TLS certificates:
   ```bash
   mkdir /usr/share/opensearch/backups/certs && cp /usr/share/opensearch/config/*pem /usr/share/opensearch/backups/certs/
   ```
   {% include copy.html %}
1. Terminate the pseudo-TTY session:
   ```bash
   exit
   ```
   {% include copy.html %}
1. Copy the files to your host:
   ```bash
   docker cp os-node-01:/usr/share/opensearch/backups ~/deploy/
   ```
   {% include copy.html %}

## Performing the upgrade

Now that the cluster is configured and you have made backups of important files and settings, it's time to begin the version upgrade.

Some steps included in this section, like disabling shard replication and flushing the transaction log, will not impact the performance of your cluster. These steps are included as best practices and can significantly improve cluster performance in situations where clients continue interacting with the OpenSearch cluster throughout the upgrade, such as by querying existing data or indexing documents. 
{: .note}

1. Disable shard replication to stop the movement of Lucene index segments within your cluster:
   ```bash
   curl -H 'Content-type: application/json' \
      -X PUT "https://localhost:9201/_cluster/settings?pretty" \
      -d'{"persistent":{"cluster.routing.allocation.enable":"primaries"}}' \
      -ku admin:admin
   ```
   {% include copy.html %}
   <p class="codeblock-label">Example response</p>
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
   ```bash
   curl -X POST "https://localhost:9201/_flush?pretty" -ku admin:admin
   ```
   {% include copy.html %}
   <p class="codeblock-label">Example response</p>
   ```json
   {
      "_shards" : {
         "total" : 20,
         "successful" : 20,
         "failed" : 0
      }
   }
   ```
1. Select a node to upgrade. You can upgrade nodes in any order because all of the nodes in this demo cluster are eligible cluster managers. The following command will stop and remove container `os-node-01` without removing the mounted data volume:
   ```bash
   docker stop os-node-01 && docker container rm os-node-01
   ```
   {% include copy.html %}
1. Start a new container named `os-node-01` with the `opensearchproject/opensearch:2.5.0` image and using the same mapped volumes as the original container:
   ```bash
   docker run -d \
      -p 9201:9200 -p 9601:9600 \
      -e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
      --ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
      -v data-01:/usr/share/opensearch/data \
      -v repo-01:/usr/share/opensearch/snapshots \
      -v ~/deploy/opensearch-01.yml:/usr/share/opensearch/config/opensearch.yml \
      -v ~/deploy/root-ca.pem:/usr/share/opensearch/config/root-ca.pem \
      -v ~/deploy/admin.pem:/usr/share/opensearch/config/admin.pem \
      -v ~/deploy/admin-key.pem:/usr/share/opensearch/config/admin-key.pem \
      -v ~/deploy/os-node-01.pem:/usr/share/opensearch/config/os-node-01.pem \
      -v ~/deploy/os-node-01-key.pem:/usr/share/opensearch/config/os-node-01-key.pem \
      --network opensearch-dev-net \
      --ip 172.20.0.11 \
      --name os-node-01 \
      opensearchproject/opensearch:2.5.0
   ```
   {% include copy.html %}
   <p class="codeblock-label">Example response</p>
   ```bash
   d26d0cb2e1e93e9c01bb00f19307525ef89c3c3e306d75913860e6542f729ea4
   ```
1. **Optional**: Query the cluster to determine which node is acting as the cluster manager. You can run this command at any time during the process to see when a new cluster manager is elected:
   ```bash
   curl -s "https://localhost:9201/_cat/nodes?v&h=name,version,node.role,master" \
      -ku admin:admin | column -t
   ```
   {% include copy.html %}
   <p class="codeblock-label">Example response</p>
   ```bash
   name        version  node.role  master
   os-node-01  2.5.0    dimr       -
   os-node-04  1.3.7    dimr       *
   os-node-02  1.3.7    dimr       -
   os-node-03  1.3.7    dimr       -
   ```
1. **Optional**: Query the cluster to see how shard allocation changes as nodes are removed and replaced. You can run this command at any time during the process to see how shard statuses change:
   ```bash
   curl -s "https://localhost:9201/_cat/shards" \
      -ku admin:admin
   ```
   {% include copy.html %}
   <p class="codeblock-label">Example response</p>
   ```bash
   security-auditlog-2023.03.06           0 p STARTED       53 214.5kb 172.20.0.13 os-node-03
   security-auditlog-2023.03.06           0 r UNASSIGNED                           
   .kibana_1                              0 p STARTED        3  14.5kb 172.20.0.12 os-node-02
   .kibana_1                              0 r STARTED        3  14.5kb 172.20.0.13 os-node-03
   ecommerce                              0 p STARTED     4675   3.9mb 172.20.0.12 os-node-02
   ecommerce                              0 r STARTED     4675   3.9mb 172.20.0.14 os-node-04
   security-auditlog-2023.03.07           0 p STARTED       37 175.7kb 172.20.0.14 os-node-04
   security-auditlog-2023.03.07           0 r UNASSIGNED                           
   .opendistro_security                   0 p STARTED       10  67.9kb 172.20.0.12 os-node-02
   .opendistro_security                   0 r STARTED       10  67.9kb 172.20.0.13 os-node-03
   .opendistro_security                   0 r STARTED       10  64.5kb 172.20.0.14 os-node-04
   .opendistro_security                   0 r UNASSIGNED                           
   security-auditlog-2023.02.27           0 p STARTED        4  80.5kb 172.20.0.12 os-node-02
   security-auditlog-2023.02.27           0 r UNASSIGNED                           
   security-auditlog-2023.02.28           0 p STARTED        6 104.1kb 172.20.0.14 os-node-04
   security-auditlog-2023.02.28           0 r UNASSIGNED                           
   opensearch_dashboards_sample_data_logs 0 p STARTED    14074   9.1mb 172.20.0.12 os-node-02
   opensearch_dashboards_sample_data_logs 0 r STARTED    14074   8.9mb 172.20.0.13 os-node-03
   .kibana_92668751_admin_1               0 r STARTED       33  37.3kb 172.20.0.13 os-node-03
   .kibana_92668751_admin_1               0 p STARTED       33  37.3kb 172.20.0.14 os-node-04
   ```
1. Stop `os-node-02`:
   ```bash
   docker stop os-node-02 && docker container rm os-node-02
   ```
   {% include copy.html %}
1. Start a new container named `os-node-02` with the `opensearchproject/opensearch:2.5.0` image and using the same mapped volumes as the original container:
   ```bash
   docker run -d \
      -p 9202:9200 -p 9602:9600 \
      -e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
      --ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
      -v data-02:/usr/share/opensearch/data \
      -v repo-01:/usr/share/opensearch/snapshots \
      -v ~/deploy/opensearch-02.yml:/usr/share/opensearch/config/opensearch.yml \
      -v ~/deploy/root-ca.pem:/usr/share/opensearch/config/root-ca.pem \
      -v ~/deploy/admin.pem:/usr/share/opensearch/config/admin.pem \
      -v ~/deploy/admin-key.pem:/usr/share/opensearch/config/admin-key.pem \
      -v ~/deploy/os-node-02.pem:/usr/share/opensearch/config/os-node-02.pem \
      -v ~/deploy/os-node-02-key.pem:/usr/share/opensearch/config/os-node-02-key.pem \
      --network opensearch-dev-net \
      --ip 172.20.0.12 \
      --name os-node-02 \
      opensearchproject/opensearch:2.5.0
   ```
   {% include copy.html %}
   <p class="codeblock-label">Example response</p>
   ```bash
   7b802865bd6eb420a106406a54fc388ed8e5e04f6cbd908c2a214ea5ce72ac00
   ```
1. Stop `os-node-03`:
   ```bash
   docker stop os-node-03 && docker container rm os-node-03
   ```
   {% include copy.html %}
1. Start a new container named `os-node-03` with the `opensearchproject/opensearch:2.5.0` image and using the same mapped volumes as the original container:
   ```bash
   docker run -d \
      -p 9203:9200 -p 9603:9600 \
      -e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
      --ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
      -v data-03:/usr/share/opensearch/data \
      -v repo-01:/usr/share/opensearch/snapshots \
      -v ~/deploy/opensearch-03.yml:/usr/share/opensearch/config/opensearch.yml \
      -v ~/deploy/root-ca.pem:/usr/share/opensearch/config/root-ca.pem \
      -v ~/deploy/admin.pem:/usr/share/opensearch/config/admin.pem \
      -v ~/deploy/admin-key.pem:/usr/share/opensearch/config/admin-key.pem \
      -v ~/deploy/os-node-03.pem:/usr/share/opensearch/config/os-node-03.pem \
      -v ~/deploy/os-node-03-key.pem:/usr/share/opensearch/config/os-node-03-key.pem \
      --network opensearch-dev-net \
      --ip 172.20.0.13 \
      --name os-node-03 \
      opensearchproject/opensearch:2.5.0
   ```
   {% include copy.html %}
   <p class="codeblock-label">Example response</p>
   ```bash
   d7f11726841a89eb88ff57a8cbecab392399f661a5205f0c81b60a995fc6c99d
   ```
1. Stop `os-node-04`:
   ```bash
   docker stop os-node-04 && docker container rm os-node-04
   ```
   {% include copy.html %}
1. Start a new container named `os-node-04` with the `opensearchproject/opensearch:2.5.0` image and using the same mapped volumes as the original container:
   ```bash
   docker run -d \
      -p 9204:9200 -p 9604:9600 \
      -e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
      --ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
      -v data-04:/usr/share/opensearch/data \
      -v repo-01:/usr/share/opensearch/snapshots \
      -v ~/deploy/opensearch-04.yml:/usr/share/opensearch/config/opensearch.yml \
      -v ~/deploy/root-ca.pem:/usr/share/opensearch/config/root-ca.pem \
      -v ~/deploy/admin.pem:/usr/share/opensearch/config/admin.pem \
      -v ~/deploy/admin-key.pem:/usr/share/opensearch/config/admin-key.pem \
      -v ~/deploy/os-node-04.pem:/usr/share/opensearch/config/os-node-04.pem \
      -v ~/deploy/os-node-04-key.pem:/usr/share/opensearch/config/os-node-04-key.pem \
      --network opensearch-dev-net \
      --ip 172.20.0.14 \
      --name os-node-04 \
      opensearchproject/opensearch:2.5.0
   ```
   {% include copy.html %}
   <p class="codeblock-label">Example response</p>
   ```bash
   26f8286ab11e6f8dcdf6a83c95f265172f9557578a1b292af84c6f5ef8738e1d
   ```
1. Confirm that your cluster is running the new version:
   ```bash
   curl -s "https://localhost:9201/_cat/nodes?v&h=name,version,node.role,master" \
      -ku admin:admin | column -t
   ```
   {% include copy.html %}
   <p class="codeblock-label">Example response</p>
   ```bash
   name        version  node.role  master
   os-node-01  2.5.0    dimr       *
   os-node-02  2.5.0    dimr       -
   os-node-04  2.5.0    dimr       -
   os-node-03  2.5.0    dimr       -
   ```
1. The last component you should upgrade is the OpenSearch Dashboards node. First, stop and remove the old container:
   ```bash
   docker stop os-dashboards-01 && docker rm os-dashboards-01
   ```
   {% include copy.html %}
1. Create a new container running the target version of OpenSearch Dashboards:
   ```bash
   docker run -d \
      -p 5601:5601 --expose 5601 \
      -v ~/deploy/opensearch_dashboards.yml:/usr/share/opensearch-dashboards/config/opensearch_dashboards.yml \
      -v ~/deploy/root-ca.pem:/usr/share/opensearch-dashboards/config/root-ca.pem \
      -v ~/deploy/os-dashboards-01.pem:/usr/share/opensearch-dashboards/config/os-dashboards-01.pem \
      -v ~/deploy/os-dashboards-01-key.pem:/usr/share/opensearch-dashboards/config/os-dashboards-01-key.pem \
      --network opensearch-dev-net \
      --ip 172.20.0.10 \
      --name os-dashboards-01 \
      opensearchproject/opensearch-dashboards:2.5.0
   ```
   {% include copy.html %}
   <p class="codeblock-label">Example response</p>
   ```bash
   310de7a24cf599ca0b39b241db07fa8865592ebe15b6f5fda26ad19d8e1c1e09
   ```
1. Make sure the OpenSearch Dashboards container started properly. A command like the following can be used to confirm that requests to <code>https://<var>HOST_ADDRESS</var>:5601</code> are redirected (HTTP status code 302) to `/app/login?`:
   ```bash
   curl https://localhost:5601 -kI
   ```
   {% include copy.html %}
   <p class="codeblock-label">Example response</p>
   ```bash
   HTTP/1.1 302 Found
   location: /app/login?
   osd-name: opensearch-dashboards-dev
   cache-control: private, no-cache, no-store, must-revalidate
   set-cookie: security_authentication=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; HttpOnly; Path=/
   content-length: 0
   Date: Wed, 08 Mar 2023 15:36:53 GMT
   Connection: keep-alive
   Keep-Alive: timeout=120
   ```
1. Re-enable allocation of replica shards:
   ```bash
   curl -H 'Content-type: application/json' \
      -X PUT "https://localhost:9201/_cluster/settings?pretty" \
      -d'{"persistent":{"cluster.routing.allocation.enable":"all"}}' \
      -ku admin:admin
   ```
   {% include copy.html %}
   <p class="codeblock-label">Example response</p>
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

## Validating the upgrade

You successfully deployed a secure OpenSearch cluster, indexed data, created a dashboard populated with sample data, created a new internal user, backed up your important files, and upgraded the cluster from version 1.3.7 to 2.5.0. Before you continue exploring and experimenting with OpenSearch and OpenSearch Dashboards, you should validate the outcome of the upgrade.

For this cluster, post-upgrade validation steps can include verifying the following:

- [Running version](#verifying-the-new-running-version)
- [Health and shard allocation](#verifying-cluster-health-and-shard-allocation)
- [Data consistency](#verifying-data-consistency)

### Verifying the new running version

1. Verify the current running version of your OpenSearch nodes:
   ```bash
   curl -s "https://localhost:9201/_cat/nodes?v&h=name,version,node.role,master" \
      -ku admin:admin | column -t
   ```
   {% include copy.html %}
   <p class="codeblock-label">Example response</p>
   ```bash
   name        version  node.role  master
   os-node-01  2.5.0    dimr       *
   os-node-02  2.5.0    dimr       -
   os-node-04  2.5.0    dimr       -
   os-node-03  2.5.0    dimr       -
   ```
1. Verify the current running version of OpenSearch Dashboards:
   1. **Option 1**: Verify the OpenSearch Dashboards version from the web interface.
      1. Open a web browser and navigate to port `5601` on your Docker host (for example, <code>https://<var>HOST_ADDRESS</var>:5601</code>).
      1. Log in with the default username (`admin`) and default password (`admin`).
      1. Select the **Help button** in the upper-right corner. The version is displayed in a pop-up window.
      1. Select the **Help button** again to close the pop-up window.
   1. **Option 2**: Verify the OpenSearch Dashboards version by inspecting `manifest.yml`.
      1. From the command line, open an interactive pseudo-TTY session with the OpenSearch Dashboards container:
         ```bash
         docker exec -it os-dashboards-01 bash
         ```
         {% include copy.html %}
      1. Check `manifest.yml` for the version:
         ```bash
         head -n 5 manifest.yml 
         ```
         {% include copy.html %}
         <p class="codeblock-label">Example response</p>
         ```bash
         ---
         schema-version: '1.1'
         build:
            name: OpenSearch Dashboards
            version: 2.5.0
         ```
      1. Terminate the pseudo-TTY session:
         ```bash
         exit
         ```
         {% include copy.html %}

### Verifying cluster health and shard allocation

1. Query the [Cluster health]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-health/) API endpoint to see information about the health of your cluster. You should see a status of `green`, which indicates that all primary and replica shards are allocated:
   ```bash
   curl -s "https://localhost:9201/_cluster/health?pretty" -ku admin:admin
   ```
   {% include copy.html %}
   <p class="codeblock-label">Example response</p>
   ```json
   {
      "cluster_name" : "opensearch-dev-cluster",
      "status" : "green",
      "timed_out" : false,
      "number_of_nodes" : 4,
      "number_of_data_nodes" : 4,
      "discovered_master" : true,
      "discovered_cluster_manager" : true,
      "active_primary_shards" : 16,
      "active_shards" : 36,
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
1. Query the [CAT shards]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-shards/) API endpoint to see how shards are allocated after the cluster is upgrade:
   ```bash
   curl -s "https://localhost:9201/_cat/shards" -ku admin:admin
   ```
   {% include copy.html %}
   <p class="codeblock-label">Example response</p>
   ```bash
   security-auditlog-2023.02.27           0 r STARTED     4  80.5kb 172.20.0.13 os-node-03
   security-auditlog-2023.02.27           0 p STARTED     4  80.5kb 172.20.0.11 os-node-01
   security-auditlog-2023.03.08           0 p STARTED    30  95.2kb 172.20.0.13 os-node-03
   security-auditlog-2023.03.08           0 r STARTED    30 123.8kb 172.20.0.11 os-node-01
   ecommerce                              0 p STARTED  4675   3.9mb 172.20.0.12 os-node-02
   ecommerce                              0 r STARTED  4675   3.9mb 172.20.0.13 os-node-03
   .kibana_1                              0 p STARTED     3   5.9kb 172.20.0.12 os-node-02
   .kibana_1                              0 r STARTED     3   5.9kb 172.20.0.11 os-node-01
   .kibana_92668751_admin_1               0 p STARTED    33  37.3kb 172.20.0.13 os-node-03
   .kibana_92668751_admin_1               0 r STARTED    33  37.3kb 172.20.0.11 os-node-01
   opensearch_dashboards_sample_data_logs 0 p STARTED 14074   9.1mb 172.20.0.12 os-node-02
   opensearch_dashboards_sample_data_logs 0 r STARTED 14074   9.1mb 172.20.0.14 os-node-04
   security-auditlog-2023.02.28           0 p STARTED     6  26.2kb 172.20.0.11 os-node-01
   security-auditlog-2023.02.28           0 r STARTED     6  26.2kb 172.20.0.14 os-node-04
   .opendistro-reports-definitions        0 p STARTED     0    208b 172.20.0.12 os-node-02
   .opendistro-reports-definitions        0 r STARTED     0    208b 172.20.0.13 os-node-03
   .opendistro-reports-definitions        0 r STARTED     0    208b 172.20.0.14 os-node-04
   security-auditlog-2023.03.06           0 r STARTED    53 174.6kb 172.20.0.12 os-node-02
   security-auditlog-2023.03.06           0 p STARTED    53 174.6kb 172.20.0.14 os-node-04
   .kibana_101107607_newuser_1            0 r STARTED     1   5.1kb 172.20.0.13 os-node-03
   .kibana_101107607_newuser_1            0 p STARTED     1   5.1kb 172.20.0.11 os-node-01
   .opendistro_security                   0 r STARTED    10  64.5kb 172.20.0.12 os-node-02
   .opendistro_security                   0 r STARTED    10  64.5kb 172.20.0.13 os-node-03
   .opendistro_security                   0 r STARTED    10  64.5kb 172.20.0.11 os-node-01
   .opendistro_security                   0 p STARTED    10  64.5kb 172.20.0.14 os-node-04
   .kibana_-152937574_admintenant_1       0 r STARTED     1   5.1kb 172.20.0.12 os-node-02
   .kibana_-152937574_admintenant_1       0 p STARTED     1   5.1kb 172.20.0.14 os-node-04
   security-auditlog-2023.03.07           0 r STARTED    37 175.7kb 172.20.0.12 os-node-02
   security-auditlog-2023.03.07           0 p STARTED    37 175.7kb 172.20.0.14 os-node-04
   .kibana_92668751_admin_2               0 p STARTED    34  38.6kb 172.20.0.13 os-node-03
   .kibana_92668751_admin_2               0 r STARTED    34  38.6kb 172.20.0.11 os-node-01
   .kibana_2                              0 p STARTED     3     6kb 172.20.0.13 os-node-03
   .kibana_2                              0 r STARTED     3     6kb 172.20.0.14 os-node-04
   .opendistro-reports-instances          0 r STARTED     0    208b 172.20.0.12 os-node-02
   .opendistro-reports-instances          0 r STARTED     0    208b 172.20.0.11 os-node-01
   .opendistro-reports-instances          0 p STARTED     0    208b 172.20.0.14 os-node-04
   ```

### Verifying data consistency

You need to query the ecommerce index again in order to confirm that the sample data is still present:

1. Compare the response to this query with the response you received in the [last step](#validation) of [Indexing data with the REST API](#indexing-data-with-the-rest-api):
   ```bash
   curl -H 'Content-Type: application/json' \
      -X GET "https://localhost:9201/ecommerce/_search?pretty=true&filter_path=hits.total" \
      -d'{"query":{"match":{"customer_first_name":"Sonya"}}}' \
      -ku admin:admin
   ```
   {% include copy.html %}
   <p class="codeblock-label">Example response</p>
   ```json
   {
      "hits" : {
         "total" : {
            "value" : 106,
            "relation" : "eq"
         }
      }
   }
   ```
1. Open a web browser and navigate to port `5601` on your Docker host (for example, <code>https://<var>HOST_ADDRESS</var>:5601</code>).
1. Enter the default username (`admin`) and password (`admin`).
1. On the OpenSearch Dashboards **Home** page, select the **Menu button** in the upper-left corner of the web interface to open the **Navigation pane**.
1. Select **Dashboard**.
1. Choose **[Logs] Web Traffic** to open the dashboard that was created when you added sample data earlier in the process.
1. When you are done reviewing the dashboard, select the **Profile** button. Choose **Log out** so you can log in as a different user.
1. Enter the username and password you created before upgrading, then select **Log in**.

## Next steps

Review the following resoures to learn more about how OpenSearch works:

- [REST API reference]({{site.url}}{{site.baseurl}}/api-reference/index/)
- [Quickstart guide for OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/quickstart-dashboards/)
- [About Security in OpenSearch]({{site.url}}{{site.baseurl}}/security/index/)

