---
layout: default
title: Rolling upgrade lab
parent: Rolling upgrade
nav_order: 10
redirect_from:
  - /upgrade-opensearch/appendix/rolling-upgrade-lab/
  - /install-and-configure/upgrade-opensearch/appendix/index/
  - /install-and-configure/upgrade-opensearch/appendix/
  - /install-and-configure/upgrade-opensearch/appendix/rolling-upgrade-lab/
  - /migrate-or-upgrade/rolling-upgrade/appendix/
  - /migrate-or-upgrade/rolling-upgrade/appendix/rolling-upgrade-lab/
---

# Rolling upgrade lab

You can follow these steps on your own compatible host to recreate the same cluster state that the OpenSearch Project used for testing [rolling upgrades]({{site.url}}{{site.baseurl}}/migrate-or-upgrade/rolling-upgrade/). This exercise is useful if you want to test the upgrade process in a development environment.

In this lab, you deploy a four-node OpenSearch 2.19.6 cluster and one OpenSearch Dashboards 2.19.6 node in Docker, add data and security settings, back up the cluster, and then upgrade each node to OpenSearch 3.9.0 and OpenSearch Dashboards 3.9.0. The commands and example responses in this lab are specific to these versions.

The steps used in this lab were validated on an [Amazon Elastic Compute Cloud (Amazon EC2)](https://aws.amazon.com/ec2/) `m6i.xlarge` instance (4 vCPUs and 16 GiB of memory) using [Amazon Linux 2023](https://aws.amazon.com/linux/amazon-linux-2023/) kernel version `6.18.54-121.166.amzn2023.x86_64` and [Docker](https://www.docker.com/) version `25.0.16`. The instance was provisioned with an attached 50 GiB gp3 [Amazon EBS](https://aws.amazon.com/ebs/) root volume. These specifications are included for informational purposes and do not represent hardware requirements for OpenSearch or OpenSearch Dashboards.

The lab accounts for the following requirements for upgrading to OpenSearch 3.x:

- The cluster must run OpenSearch 2.19.0 or later before you upgrade it to 3.x. OpenSearch 3.x can't read indexes created in OpenSearch 1.x, so the lab starts with a cluster that runs 2.19.6. For more information, see [Breaking changes]({{site.url}}{{site.baseurl}}/breaking-changes/#300).
- Starting with OpenSearch 2.12, the `admin` user requires a custom password. The lab's deployment script reads the password from the `OPENSEARCH_INITIAL_ADMIN_PASSWORD` environment variable.
- OpenSearch 3.x doesn't provide the Performance Analyzer API on port 9600, so the lab doesn't publish port 9600.

References in this procedure to the `$HOME` path on the host machine in this procedure are represented by the tilde character ("~") to make the instructions more portable. If you would prefer to specify an absolute path, modify the volume paths defined in `upgrade-demo-cluster-2.19-to-3.sh` and used throughout relevant commands in this document to reflect your environment.

## Setting up the environment

As you follow the steps in this document, you will define several Docker resources, including containers, volumes, and a dedicated Docker network, using a script we provide. You can clean up your environment with the following command if you want to restart the process:

```bash
docker container stop $(docker container ls -aqf name=os-); \
	docker container rm $(docker container ls -aqf name=os-); \
	docker volume rm -f $(docker volume ls -q | grep -E 'data-0|repo-0'); \
	docker network rm opensearch-dev-net; \
	rm -rf ~/deploy
```
{% include copy.html %}

The command removes container names matching the regular expression `os-*`, data volumes matching `data-0*` and `repo-0*`, the Docker network named `opensearch-dev-net`, and the `~/deploy` directory, which contains the TLS certificates, configuration files, and backups that you create in this lab. If you have other Docker resources running on your host, then you should review and modify the command to avoid removing other resources unintentionally. This command does not revert host configuration changes, like memory swapping behavior.
{: .warning}

After selecting a host, you can begin the lab:

1. Install the appropriate version of [Docker Engine](https://docs.docker.com/engine/install/) for your Linux distribution and system architecture. For example, on Amazon Linux 2023, install Docker from the distribution repository, start the Docker service, and add your user to the `docker` group:
   ```bash
   sudo dnf install -y docker && \
      sudo systemctl enable --now docker && \
      sudo usermod -aG docker $USER
   ```
   {% include copy.html %}

   Log out and log back in so that the group membership takes effect.
1. Configure [important system settings]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/#important-settings) on your host:
   1. Disable memory paging and swapping on the host to improve performance:
      ```bash
      sudo swapoff -a
      ```
      {% include copy.html %}
   1. Increase the number of memory maps available to OpenSearch by adding the `vm.max_map_count` setting to the `sysctl` configuration file:
      ```bash
      echo 'vm.max_map_count=262144' | sudo tee -a /etc/sysctl.conf
      ```
      {% include copy.html %}
   1. Apply the configuration change:
      ```bash
      sudo sysctl -p
      ```
      {% include copy.html %}

      The response should appear similar to the following:

      ```bash
      vm.max_map_count = 262144
      ```
1. Create a new directory called `deploy` in your home directory, then navigate to it. You will use `~/deploy` for paths in the deployment script, configuration files, and TLS certificates:
   ```bash
   mkdir ~/deploy && cd ~/deploy
   ```
   {% include copy.html %}
1. Download `upgrade-demo-cluster-2.19-to-3.sh` from the OpenSearch Project [`documentation-website`](https://github.com/opensearch-project/documentation-website) repository:
   ```bash
   wget https://raw.githubusercontent.com/opensearch-project/documentation-website/main/assets/examples/upgrade-demo-cluster-2.19-to-3.sh
   ```
   {% include copy.html %}
1. Set the password for the `admin` user. Replace `<custom-admin-password>` with a strong password of your choice. The single quotation marks prevent the shell from interpreting special characters in the password:
   ```bash
   export OPENSEARCH_INITIAL_ADMIN_PASSWORD='<custom-admin-password>'
   ```
   {% include copy.html %}

   You use this password, together with the username `admin`, in the commands throughout this lab.
1. Run the script without any modifications in order to deploy four containers running OpenSearch 2.19.6 and one container running OpenSearch Dashboards 2.19.6, with custom, self-signed TLS certificates and internal users `admin` and `kibanaserver`:
   ```bash
   bash upgrade-demo-cluster-2.19-to-3.sh
   ```
   {% include copy.html %}

   The script writes the bcrypt hash of your `admin` password to `~/deploy/internal_users.yml`, which initializes the Security plugin when the cluster starts for the first time. The script also generates a random password for the `kibanaserver` user, which OpenSearch Dashboards uses to connect to OpenSearch, and writes it to `~/deploy/opensearch_dashboards.yml`. Because the containers run as UID 1000, the script makes the files that it mounts into the containers readable by all users and restricts access to the `~/deploy` directory to your user. The script publishes container ports only on the host's loopback interface (`127.0.0.1`), so the cluster can't be reached from other machines.
1. Confirm that the containers were launched successfully:
   ```bash
   docker container ls
   ```
   {% include copy.html %}

   The response should appear similar to the following:

   ```bash
   CONTAINER ID   IMAGE                                            COMMAND                  CREATED              STATUS              PORTS                                                    NAMES
   2812c2945d33   opensearchproject/opensearch-dashboards:2.19.6   "./opensearch-dashbo…"   12 seconds ago       Up 5 seconds        127.0.0.1:5601->5601/tcp                                 os-dashboards-01
   928957045cc4   opensearchproject/opensearch:2.19.6              "./opensearch-docker…"   About a minute ago   Up About a minute   9300/tcp, 9600/tcp, 9650/tcp, 127.0.0.1:9204->9200/tcp   os-node-04
   16a84b2a314b   opensearchproject/opensearch:2.19.6              "./opensearch-docker…"   About a minute ago   Up About a minute   9300/tcp, 9600/tcp, 9650/tcp, 127.0.0.1:9203->9200/tcp   os-node-03
   aa539a9a4b1b   opensearchproject/opensearch:2.19.6              "./opensearch-docker…"   About a minute ago   Up About a minute   9300/tcp, 9600/tcp, 9650/tcp, 127.0.0.1:9202->9200/tcp   os-node-02
   25a56091a268   opensearchproject/opensearch:2.19.6              "./opensearch-docker…"   About a minute ago   Up About a minute   9300/tcp, 9600/tcp, 9650/tcp, 127.0.0.1:9201->9200/tcp   os-node-01
   ```
1. The amount of time OpenSearch needs to initialize the cluster varies depending on the performance capabilities of the underlying host. You can follow container logs to see what OpenSearch is doing during the bootstrap process:
   1. Enter the following command to display logs for container `os-node-01` in the terminal window:
      ```bash
      docker logs -f os-node-01
      ```
      {% include copy.html %}
   1. You will see a log entry resembling the following example when the node is ready:

      ```bash
      [INFO ][o.o.s.c.ConfigurationRepository] [os-node-01] Node 'os-node-01' initialized
      ```
   1. Press `Ctrl+C` to stop following container logs and return to the command prompt.
1. Use cURL to query the OpenSearch REST API. In the following command, `os-node-01` is queried by sending the request to host port `9201`, which is mapped to port `9200` on the container:
   ```bash
   curl -s "https://localhost:9201" -ku 'admin:<custom-admin-password>'
   ```
   {% include copy.html %}

   The response should appear similar to the following:

   ```json
   {
     "name" : "os-node-01",
     "cluster_name" : "opensearch-dev-cluster",
     "cluster_uuid" : "pJ2t0RKrTw2Xeva40ZAF1Q",
     "version" : {
       "distribution" : "opensearch",
       "number" : "2.19.6",
       "build_type" : "tar",
       "build_hash" : "97d3c13bf22a4a72ac11dc503fe44c97662b9161",
       "build_date" : "2026-07-01T04:27:16.038403104Z",
       "build_snapshot" : false,
       "lucene_version" : "9.12.3",
       "minimum_wire_compatibility_version" : "7.10.0",
       "minimum_index_compatibility_version" : "7.0.0"
     },
     "tagline" : "The OpenSearch Project: https://opensearch.org/"
   }
   ```

   The `-s` option hides the cURL progress meter and error messages. The `-k` option skips verification of the self-signed TLS certificates.
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
   wget https://raw.githubusercontent.com/opensearch-project/documentation-website/main/assets/examples/ecommerce.ndjson
   ```
   {% include copy.html %}
1. Use the [Create index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/create-index/) API to create an index using the mappings defined in `ecommerce-field_mappings.json`:
   ```bash
   curl -s -H "Content-Type: application/json" \
      -X PUT "https://localhost:9201/ecommerce?pretty" \
      --data-binary "@ecommerce-field_mappings.json" \
      -ku 'admin:<custom-admin-password>'
   ```
   {% include copy.html %}

   The response should appear similar to the following:

   ```json
   {
     "acknowledged" : true,
     "shards_acknowledged" : true,
     "index" : "ecommerce"
   }
   ```
1. Use the [Bulk]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/) API to add data to the new ecommerce index from `ecommerce.ndjson`:
   ```bash
   curl -s -H "Content-Type: application/x-ndjson" \
      -X PUT "https://localhost:9201/ecommerce/_bulk?pretty" \
      --data-binary "@ecommerce.ndjson" \
      -ku 'admin:<custom-admin-password>'
   ```
   {% include copy.html %}

   The response should appear similar to the following (truncated):

   ```json
   {
     "took" : 3448,
     "errors" : false,
     "items" : [
       ...
       {
         "index" : {
           "_index" : "ecommerce",
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
       }
     ]
   }
   ```
1. <p id="validation">A search query can also confirm that the data was indexed successfully. The following query returns the number of documents in which keyword `customer_first_name` equals `Sonya`:</p>
   ```bash
   curl -s -H 'Content-Type: application/json' \
      -X GET "https://localhost:9201/ecommerce/_search?pretty=true&filter_path=hits.total" \
      -d'{"query":{"match":{"customer_first_name":"Sonya"}}}' \
      -ku 'admin:<custom-admin-password>'
   ```
   {% include copy.html %}

   The response should appear similar to the following:

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

1. Open a web browser and navigate to `https://localhost:5601` on your Docker host. If OpenSearch Dashboards is running, then you will be redirected to a login page.
   1. Port `5601` is published only on the loopback interface of the Docker host. If your Docker host is a remote machine, forward the port to your local machine and then navigate to `https://localhost:5601` in a browser on your local machine. For example, to forward the port using SSH, run the following command on your local machine:
      ```bash
      ssh -L 5601:localhost:5601 <user>@<host-address>
      ```
      {% include copy.html %}

      If your Docker host is an Amazon EC2 instance, you can use AWS Systems Manager Session Manager port forwarding instead, which doesn't require an open SSH port. Replace `<instance-id>` with the ID of your instance, and run the following command on your local machine:
      ```bash
      aws ssm start-session --target <instance-id> \
         --document-name AWS-StartPortForwardingSession \
         --parameters '{"portNumber":["5601"],"localPortNumber":["5601"]}'
      ```
      {% include copy.html %}

      For more information, see [Starting a session (port forwarding)](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-sessions-start.html#sessions-start-port-forwarding) in the AWS Systems Manager User Guide. If port `5601` is already in use on your local machine, forward the port to an unused local port instead, and navigate to that port in your browser.
   1. If the web browser throws an error because the TLS certificates are self-signed, then you might need to bypass certificate checks in your browser. Refer to the browser's documentation for information about bypassing certificate checks.
1. Enter the username `admin` and the password that you set in `OPENSEARCH_INITIAL_ADMIN_PASSWORD`, then select **Log in**.
1. On the **Welcome to OpenSearch Dashboards** page, select **Add data**.
1. If you're prompted to select a tenant, keep the **Private** tenant selected, and then select **Confirm**. OpenSearch Dashboards reloads the **Welcome to OpenSearch Dashboards** page. Select **Add data** again.
1. On the **Add sample data** page, in the **Sample web logs** card, select **Add data**.
   1. **Optional**: Select **View data** to review the **[Logs] Web Traffic** dashboard.
1. On the top menu, go to **Management** > **Security** and then select **Internal users**.
1. Select **Create internal user**.
1. Enter a **Username** (for example, `testuser`), a **Password**, and the same password in **Re-enter password**. The password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one digit, and one special character.
1. In the **Backend role** field, enter `admin`.
1. Select **Create**.

## Backing up important files

Always create backups before making changes to your cluster, especially if the cluster is running in a production environment.

In this section you will be:
- [Registering a snapshot repository](#registering-a-snapshot-repository).
- [Creating a snapshot](#creating-a-snapshot).
- [Backing up security settings](#backing-up-security-settings).

### Registering a snapshot repository

1. Register a repository using the volume that was mapped by `upgrade-demo-cluster-2.19-to-3.sh`:
   ```bash
   curl -s -H 'Content-Type: application/json' \
      -X PUT "https://localhost:9201/_snapshot/snapshot-repo?pretty" \
      -d '{"type":"fs","settings":{"location":"/usr/share/opensearch/snapshots"}}' \
      -ku 'admin:<custom-admin-password>'
   ```
   {% include copy.html %}

   The response should appear similar to the following:

   ```json
   {
     "acknowledged" : true
   }
   ```
1. **Optional**: Perform an additional check to verify that the repository was created successfully:
   ```bash
   curl -s -X POST "https://localhost:9201/_snapshot/snapshot-repo/_verify?timeout=0s&cluster_manager_timeout=50s&pretty" \
      -ku 'admin:<custom-admin-password>'
   ```
   {% include copy.html %}

   The response should appear similar to the following:

   ```json
   {
     "nodes" : {
       "wTUZqPxRQWuE0HuuumEXVw" : {
         "name" : "os-node-04"
       },
       "acexFqflTHaDN96Gv5qqaw" : {
         "name" : "os-node-03"
       },
       "q_NbbV4jTUyr0XbkzzZRUg" : {
         "name" : "os-node-02"
       },
       "5XXNm56wQYa0ybVNNrodtA" : {
         "name" : "os-node-01"
       }
     }
   }
   ```

### Creating a snapshot

Snapshots are backups of a cluster's indexes and state. See [Snapshots]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/index/) to learn more.

1. Create a snapshot that includes all indexes and the cluster state:
   ```bash
   curl -s -X PUT "https://localhost:9201/_snapshot/snapshot-repo/cluster-snapshot-v2196?wait_for_completion=true&pretty" \
      -ku 'admin:<custom-admin-password>'
   ```
   {% include copy.html %}

   The response should appear similar to the following:

   ```json
   {
     "snapshot" : {
       "snapshot" : "cluster-snapshot-v2196",
       "uuid" : "nNiqZRLkQ0uers3gjyrGBg",
       "version_id" : 136408427,
       "version" : "2.19.6",
       "remote_store_index_shallow_copy" : false,
       "indices" : [
         "top_queries-2026.10.16-59496",
         ".opensearch-sap-log-types-config",
         "opensearch_dashboards_sample_data_logs",
         ".opensearch-observability",
         ".opendistro_security",
         ".ql-datasources",
         ".kibana_92668751_admin_1",
         "ecommerce",
         ".plugins-ml-config",
         "security-auditlog-2026.10.16",
         ".kibana_1"
       ],
       "data_streams" : [ ],
       "include_global_state" : true,
       "state" : "SUCCESS",
       "start_time" : "2026-10-16T15:59:27.839Z",
       "start_time_in_millis" : 1792166367839,
       "end_time" : "2026-10-16T15:59:28.239Z",
       "end_time_in_millis" : 1792166368239,
       "duration_in_millis" : 400,
       "failures" : [ ],
       "shards" : {
         "total" : 11,
         "failed" : 0,
         "successful" : 11
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

1. Create a directory called `backups` in the `os-node-01` container:
   ```bash
   docker exec os-node-01 mkdir /usr/share/opensearch/backups
   ```
   {% include copy.html %}
1. Use `securityadmin.sh` to create backups of your OpenSearch Security settings in `/usr/share/opensearch/backups/`:
   ```bash
   docker exec os-node-01 /usr/share/opensearch/plugins/opensearch-security/tools/securityadmin.sh \
      -backup /usr/share/opensearch/backups \
      -icl \
      -nhnv \
      -cacert /usr/share/opensearch/config/root-ca.pem \
      -cert /usr/share/opensearch/config/admin.pem \
      -key /usr/share/opensearch/config/admin-key.pem
   ```
   {% include copy.html %}

   The response should appear similar to the following:

   ```bash
   Security Admin v7
   Will connect to localhost:9200 ... done
   Connected as "CN=A,OU=DOCS,O=OPENSEARCH,L=PORTLAND,ST=OREGON,C=US"
   OpenSearch Version: 2.19.6
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
   ...
   Will retrieve '/audit' into /usr/share/opensearch/backups/audit.yml 
      SUCC: Configuration for 'audit' stored in /usr/share/opensearch/backups/audit.yml
   ```
1. **Optional**: Create a backup directory for TLS certificates and store copies of the certificates. Repeat this for each node if you use unique TLS certificates:
   ```bash
   docker exec os-node-01 bash -c 'mkdir /usr/share/opensearch/backups/certs && cp /usr/share/opensearch/config/*pem /usr/share/opensearch/backups/certs/'
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
   curl -s -H 'Content-type: application/json' \
      -X PUT "https://localhost:9201/_cluster/settings?pretty" \
      -d'{"persistent":{"cluster.routing.allocation.enable":"primaries"}}' \
      -ku 'admin:<custom-admin-password>'
   ```
   {% include copy.html %}

   The response should appear similar to the following:

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
   curl -s -X POST "https://localhost:9201/_flush?pretty" -ku 'admin:<custom-admin-password>'
   ```
   {% include copy.html %}

   The response should appear similar to the following:

   ```json
   {
     "_shards" : {
       "total" : 27,
       "successful" : 27,
       "failed" : 0
     }
   }
   ```
1. Select a node to upgrade. You can upgrade nodes in any order because all of the nodes in this demo cluster are eligible cluster managers. The following command will stop and remove container `os-node-01` without removing the mounted data volume:
   ```bash
   docker stop os-node-01 && docker container rm os-node-01
   ```
   {% include copy.html %}
1. Start a new container named `os-node-01` with the `opensearchproject/opensearch:3.9.0` image and using the same mapped volumes as the original container:
   ```bash
   docker run -d \
      -p 127.0.0.1:9201:9200 \
      -e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
      -e "DISABLE_INSTALL_DEMO_CONFIG=true" \
      --ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
      -v data-01:/usr/share/opensearch/data \
      -v repo-01:/usr/share/opensearch/snapshots \
      -v ~/deploy/opensearch-01.yml:/usr/share/opensearch/config/opensearch.yml \
      -v ~/deploy/internal_users.yml:/usr/share/opensearch/config/opensearch-security/internal_users.yml \
      -v ~/deploy/root-ca.pem:/usr/share/opensearch/config/root-ca.pem \
      -v ~/deploy/admin.pem:/usr/share/opensearch/config/admin.pem \
      -v ~/deploy/admin-key.pem:/usr/share/opensearch/config/admin-key.pem \
      -v ~/deploy/os-node-01.pem:/usr/share/opensearch/config/os-node-01.pem \
      -v ~/deploy/os-node-01-key.pem:/usr/share/opensearch/config/os-node-01-key.pem \
      --network opensearch-dev-net \
      --ip 172.20.0.11 \
      --name os-node-01 \
      opensearchproject/opensearch:3.9.0
   ```
   {% include copy.html %}

   The response should appear similar to the following:

   ```bash
   a9f69e3540d0632eb457f834270a280d41038bc3ce36f4bb1bbb2f112702c88c
   ```
1. Confirm that `os-node-01` rejoined the cluster and runs version 3.9.0. The response also shows which node is acting as the cluster manager, so you can run this command at any time during the process to see when a new cluster manager is elected. Run this command after you upgrade each node, and don't stop the next node until the upgraded node appears in the response:
   ```bash
   curl -s "https://localhost:9201/_cat/nodes?v&h=name,version,node.role,cluster_manager" \
      -ku 'admin:<custom-admin-password>' | column -t
   ```
   {% include copy.html %}

   The response should appear similar to the following:

   ```bash
   name        version  node.role  cluster_manager
   os-node-04  2.19.6   dimr       -
   os-node-03  2.19.6   dimr       -
   os-node-02  2.19.6   dimr       *
   os-node-01  3.9.0    dimr       -
   ```
1. **Optional**: Query the cluster to see how shard allocation changes as nodes are removed and replaced. You can run this command at any time during the process to see how shard statuses change:
   ```bash
   curl -s "https://localhost:9201/_cat/shards" \
      -ku 'admin:<custom-admin-password>'
   ```
   {% include copy.html %}

   The response should appear similar to the following (truncated):

   ```bash
   opensearch_dashboards_sample_data_logs 0 p STARTED    14074   9.2mb 172.20.0.13 os-node-03
   opensearch_dashboards_sample_data_logs 0 r STARTED    14074   9.2mb 172.20.0.12 os-node-02
   .kibana_92668751_admin_1               0 p STARTED      146    81kb 172.20.0.14 os-node-04
   .kibana_92668751_admin_1               0 r STARTED      146  81.1kb 172.20.0.13 os-node-03
   ecommerce                              0 p STARTED     4675   3.9mb 172.20.0.13 os-node-03
   ecommerce                              0 r UNASSIGNED                           
   security-auditlog-2026.10.16           0 p STARTED      141 511.9kb 172.20.0.14 os-node-04
   security-auditlog-2026.10.16           0 r STARTED      141 334.7kb 172.20.0.12 os-node-02
   .opendistro_security                   0 r STARTED       10  81.1kb 172.20.0.14 os-node-04
   .opendistro_security                   0 p STARTED       10  81.1kb 172.20.0.13 os-node-03
   .opendistro_security                   0 r STARTED       10  81.1kb 172.20.0.12 os-node-02
   .opendistro_security                   0 r UNASSIGNED                           
   .kibana_1                              0 r STARTED        1   4.3kb 172.20.0.14 os-node-04
   .kibana_1                              0 p STARTED        1   4.3kb 172.20.0.12 os-node-02
   ```

   Replica shards remain unassigned while shard replication is disabled. OpenSearch doesn't allocate a replica to a node that runs an earlier version than the node that contains the primary shard, so some replicas remain unassigned until all nodes are upgraded.
1. Stop `os-node-02`:
   ```bash
   docker stop os-node-02 && docker container rm os-node-02
   ```
   {% include copy.html %}
1. Start a new container named `os-node-02` with the `opensearchproject/opensearch:3.9.0` image and using the same mapped volumes as the original container:
   ```bash
   docker run -d \
      -p 127.0.0.1:9202:9200 \
      -e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
      -e "DISABLE_INSTALL_DEMO_CONFIG=true" \
      --ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
      -v data-02:/usr/share/opensearch/data \
      -v repo-01:/usr/share/opensearch/snapshots \
      -v ~/deploy/opensearch-02.yml:/usr/share/opensearch/config/opensearch.yml \
      -v ~/deploy/internal_users.yml:/usr/share/opensearch/config/opensearch-security/internal_users.yml \
      -v ~/deploy/root-ca.pem:/usr/share/opensearch/config/root-ca.pem \
      -v ~/deploy/admin.pem:/usr/share/opensearch/config/admin.pem \
      -v ~/deploy/admin-key.pem:/usr/share/opensearch/config/admin-key.pem \
      -v ~/deploy/os-node-02.pem:/usr/share/opensearch/config/os-node-02.pem \
      -v ~/deploy/os-node-02-key.pem:/usr/share/opensearch/config/os-node-02-key.pem \
      --network opensearch-dev-net \
      --ip 172.20.0.12 \
      --name os-node-02 \
      opensearchproject/opensearch:3.9.0
   ```
   {% include copy.html %}

   The response should appear similar to the following:

   ```bash
   6fd3fa8e6ba69afb85d582047d2be9b12bea12cb0809aa3a3b7d3252924d3685
   ```
1. Stop `os-node-03`:
   ```bash
   docker stop os-node-03 && docker container rm os-node-03
   ```
   {% include copy.html %}
1. Start a new container named `os-node-03` with the `opensearchproject/opensearch:3.9.0` image and using the same mapped volumes as the original container:
   ```bash
   docker run -d \
      -p 127.0.0.1:9203:9200 \
      -e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
      -e "DISABLE_INSTALL_DEMO_CONFIG=true" \
      --ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
      -v data-03:/usr/share/opensearch/data \
      -v repo-01:/usr/share/opensearch/snapshots \
      -v ~/deploy/opensearch-03.yml:/usr/share/opensearch/config/opensearch.yml \
      -v ~/deploy/internal_users.yml:/usr/share/opensearch/config/opensearch-security/internal_users.yml \
      -v ~/deploy/root-ca.pem:/usr/share/opensearch/config/root-ca.pem \
      -v ~/deploy/admin.pem:/usr/share/opensearch/config/admin.pem \
      -v ~/deploy/admin-key.pem:/usr/share/opensearch/config/admin-key.pem \
      -v ~/deploy/os-node-03.pem:/usr/share/opensearch/config/os-node-03.pem \
      -v ~/deploy/os-node-03-key.pem:/usr/share/opensearch/config/os-node-03-key.pem \
      --network opensearch-dev-net \
      --ip 172.20.0.13 \
      --name os-node-03 \
      opensearchproject/opensearch:3.9.0
   ```
   {% include copy.html %}

   The response should appear similar to the following:

   ```bash
   023d7510b4509140507e9b808e3504676a0a946ac7d1f49f0987d7c1a4c78f2b
   ```
1. Stop `os-node-04`:
   ```bash
   docker stop os-node-04 && docker container rm os-node-04
   ```
   {% include copy.html %}
1. Start a new container named `os-node-04` with the `opensearchproject/opensearch:3.9.0` image and using the same mapped volumes as the original container:
   ```bash
   docker run -d \
      -p 127.0.0.1:9204:9200 \
      -e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
      -e "DISABLE_INSTALL_DEMO_CONFIG=true" \
      --ulimit nofile=65536:65536 --ulimit memlock=-1:-1 \
      -v data-04:/usr/share/opensearch/data \
      -v repo-01:/usr/share/opensearch/snapshots \
      -v ~/deploy/opensearch-04.yml:/usr/share/opensearch/config/opensearch.yml \
      -v ~/deploy/internal_users.yml:/usr/share/opensearch/config/opensearch-security/internal_users.yml \
      -v ~/deploy/root-ca.pem:/usr/share/opensearch/config/root-ca.pem \
      -v ~/deploy/admin.pem:/usr/share/opensearch/config/admin.pem \
      -v ~/deploy/admin-key.pem:/usr/share/opensearch/config/admin-key.pem \
      -v ~/deploy/os-node-04.pem:/usr/share/opensearch/config/os-node-04.pem \
      -v ~/deploy/os-node-04-key.pem:/usr/share/opensearch/config/os-node-04-key.pem \
      --network opensearch-dev-net \
      --ip 172.20.0.14 \
      --name os-node-04 \
      opensearchproject/opensearch:3.9.0
   ```
   {% include copy.html %}

   The response should appear similar to the following:

   ```bash
   6848100ed927663de46489e54facfe781fe3508a857da081ebd6f299dfbf3887
   ```
1. Confirm that your cluster is running the new version:
   ```bash
   curl -s "https://localhost:9201/_cat/nodes?v&h=name,version,node.role,cluster_manager" \
      -ku 'admin:<custom-admin-password>' | column -t
   ```
   {% include copy.html %}

   The response should appear similar to the following:

   ```bash
   name        version  node.role  cluster_manager
   os-node-04  3.9.0    dimr       -
   os-node-03  3.9.0    dimr       -
   os-node-02  3.9.0    dimr       *
   os-node-01  3.9.0    dimr       -
   ```
1. The last component you should upgrade is the OpenSearch Dashboards node. First, stop and remove the old container:
   ```bash
   docker stop os-dashboards-01 && docker rm os-dashboards-01
   ```
   {% include copy.html %}
1. Create a new container running the target version of OpenSearch Dashboards:
   ```bash
   docker run -d \
      -p 127.0.0.1:5601:5601 \
      -v ~/deploy/opensearch_dashboards.yml:/usr/share/opensearch-dashboards/config/opensearch_dashboards.yml \
      -v ~/deploy/root-ca.pem:/usr/share/opensearch-dashboards/config/root-ca.pem \
      -v ~/deploy/os-dashboards-01.pem:/usr/share/opensearch-dashboards/config/os-dashboards-01.pem \
      -v ~/deploy/os-dashboards-01-key.pem:/usr/share/opensearch-dashboards/config/os-dashboards-01-key.pem \
      --network opensearch-dev-net \
      --ip 172.20.0.10 \
      --name os-dashboards-01 \
      opensearchproject/opensearch-dashboards:3.9.0
   ```
   {% include copy.html %}

   The response should appear similar to the following:

   ```bash
   0cea291d8bbcf540187ffe4f0ce55c73a76807c0ba3b26c044da26e83c543e85
   ```
1. Make sure the OpenSearch Dashboards container started properly. OpenSearch Dashboards can take a minute to start. A command like the following can be used to confirm that requests to `https://localhost:5601` are redirected (HTTP status code 302) to `/app/login`:
   ```bash
   curl -s https://localhost:5601 -kI
   ```
   {% include copy.html %}

   The response should appear similar to the following:

   ```bash
   HTTP/1.1 302 Found
   location: /app/login
   osd-name: opensearch-dashboards-dev
   cache-control: private, no-cache, no-store, must-revalidate
   set-cookie: security_authentication=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; HttpOnly; Path=/
   content-length: 0
   Date: Fri, 16 Oct 2026 16:20:51 GMT
   Connection: keep-alive
   Keep-Alive: timeout=120
   ```
1. Reenable allocation of replica shards:
   ```bash
   curl -s -H 'Content-type: application/json' \
      -X PUT "https://localhost:9201/_cluster/settings?pretty" \
      -d'{"persistent":{"cluster.routing.allocation.enable":"all"}}' \
      -ku 'admin:<custom-admin-password>'
   ```
   {% include copy.html %}

   The response should appear similar to the following:

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

You successfully deployed a secure OpenSearch cluster, indexed data, created a dashboard populated with sample data, created a new internal user, backed up your important files, and upgraded the cluster from version 2.19.6 to 3.9.0. Before you continue exploring and experimenting with OpenSearch and OpenSearch Dashboards, you should validate the outcome of the upgrade.

For this cluster, post-upgrade validation steps can include verifying the following:

- [Running version](#verifying-the-new-running-version)
- [Health and shard allocation](#verifying-cluster-health-and-shard-allocation)
- [Data consistency](#verifying-data-consistency)

### Verifying the new running version

1. Verify the current running version of your OpenSearch nodes:
   ```bash
   curl -s "https://localhost:9201/_cat/nodes?v&h=name,version,node.role,cluster_manager" \
      -ku 'admin:<custom-admin-password>' | column -t
   ```
   {% include copy.html %}

   The response should appear similar to the following:

   ```bash
   name        version  node.role  cluster_manager
   os-node-04  3.9.0    dimr       -
   os-node-03  3.9.0    dimr       -
   os-node-02  3.9.0    dimr       *
   os-node-01  3.9.0    dimr       -
   ```
1. Verify the current running version of OpenSearch Dashboards:
   1. **Option 1**: Verify the OpenSearch Dashboards version from the web interface.
      1. Open a web browser and navigate to `https://localhost:5601`.
      1. Log in with the username `admin` and the password that you set in `OPENSEARCH_INITIAL_ADMIN_PASSWORD`.
      1. If the **New! Enhanced Discover experience available** dialog appears, select **Dismiss**.
      1. Select the **Help menu** button in the upper-right corner. The version is displayed in a pop-up window.
      1. Select the **Help menu** button again to close the pop-up window.
   1. **Option 2**: Verify the OpenSearch Dashboards version by inspecting `manifest.yml`:
      ```bash
      docker exec os-dashboards-01 head -n 5 manifest.yml
      ```
      {% include copy.html %}

      The response should appear similar to the following:

      ```yaml
      ---
      schema-version: '1.1'
      build:
        name: OpenSearch Dashboards
        version: 3.9.0
      ```

### Verifying cluster health and shard allocation

1. Query the [Cluster health]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-health/) API endpoint to see information about the health of your cluster. You should see a status of `green`, which indicates that all primary and replica shards are allocated. If the status is `yellow`, wait for OpenSearch to finish allocating replica shards, and then run the command again:
   ```bash
   curl -s "https://localhost:9201/_cluster/health?pretty" -ku 'admin:<custom-admin-password>'
   ```
   {% include copy.html %}

   The response should appear similar to the following:

   ```json
   {
     "cluster_name" : "opensearch-dev-cluster",
     "status" : "green",
     "timed_out" : false,
     "number_of_nodes" : 4,
     "number_of_data_nodes" : 4,
     "discovered_master" : true,
     "discovered_cluster_manager" : true,
     "active_primary_shards" : 13,
     "active_shards" : 35,
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
1. Query the [CAT shards]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-shards/) API endpoint to see how shards are allocated after the cluster is upgraded:
   ```bash
   curl -s "https://localhost:9201/_cat/shards" -ku 'admin:<custom-admin-password>'
   ```
   {% include copy.html %}

   The response should appear similar to the following:

   ```bash
   .ql-datasources                        0 r STARTED     0    208b 172.20.0.14 os-node-04
   .ql-datasources                        0 p STARTED     0    208b 172.20.0.12 os-node-02
   .ql-datasources                        0 r STARTED     0    208b 172.20.0.11 os-node-01
   .kibana_92668751_admin_1               0 r STARTED   146  74.4kb 172.20.0.14 os-node-04
   .kibana_92668751_admin_1               0 p STARTED   146  74.4kb 172.20.0.13 os-node-03
   .kibana_92668751_admin_2               0 p STARTED   146  70.9kb 172.20.0.14 os-node-04
   .kibana_92668751_admin_2               0 r STARTED   146    208b 172.20.0.13 os-node-03
   .kibana_2                              0 p STARTED     1   4.8kb 172.20.0.13 os-node-03
   .kibana_2                              0 r STARTED     1      0b 172.20.0.11 os-node-01
   .opendistro_security                   0 p STARTED    10  81.1kb 172.20.0.14 os-node-04
   .opendistro_security                   0 r STARTED    10  81.1kb 172.20.0.13 os-node-03
   .opendistro_security                   0 r STARTED    10  81.1kb 172.20.0.12 os-node-02
   .opendistro_security                   0 r STARTED    10  81.1kb 172.20.0.11 os-node-01
   .kibana_1                              0 r STARTED     1   4.3kb 172.20.0.14 os-node-04
   .kibana_1                              0 p STARTED     1   4.3kb 172.20.0.12 os-node-02
   .opensearch-observability              0 r STARTED     0    208b 172.20.0.13 os-node-03
   .opensearch-observability              0 r STARTED     0    208b 172.20.0.12 os-node-02
   .opensearch-observability              0 p STARTED     0    208b 172.20.0.11 os-node-01
   .plugins-ml-config                     0 r STARTED     1     4kb 172.20.0.14 os-node-04
   .plugins-ml-config                     0 r STARTED     1     4kb 172.20.0.13 os-node-03
   .plugins-ml-config                     0 p STARTED     1     4kb 172.20.0.12 os-node-02
   .plugins-ml-config                     0 r STARTED     1     4kb 172.20.0.11 os-node-01
   top_queries-2026.10.16-59496           0 r STARTED    43   523kb 172.20.0.14 os-node-04
   top_queries-2026.10.16-59496           0 p STARTED    43 184.4kb 172.20.0.12 os-node-02
   top_queries-2026.10.16-59496           0 r STARTED    43   523kb 172.20.0.11 os-node-01
   opensearch_dashboards_sample_data_logs 0 r STARTED 14074   9.2mb 172.20.0.13 os-node-03
   opensearch_dashboards_sample_data_logs 0 p STARTED 14074   9.2mb 172.20.0.12 os-node-02
   .opensearch-sap-log-types-config       0 p STARTED               172.20.0.14 os-node-04
   .opensearch-sap-log-types-config       0 r STARTED               172.20.0.13 os-node-03
   .opensearch-sap-log-types-config       0 r STARTED               172.20.0.12 os-node-02
   .opensearch-sap-log-types-config       0 r STARTED               172.20.0.11 os-node-01
   ecommerce                              0 r STARTED  4675   3.9mb 172.20.0.13 os-node-03
   ecommerce                              0 p STARTED  4675     4mb 172.20.0.11 os-node-01
   security-auditlog-2026.10.16           0 r STARTED   143 315.1kb 172.20.0.14 os-node-04
   security-auditlog-2026.10.16           0 p STARTED   143 548.6kb 172.20.0.12 os-node-02
   ```

### Verifying data consistency

You need to query the e-commerce index again in order to confirm that the sample data is still present:

1. Compare the response to this query with the response you received in the [last step](#validation) of [Indexing data with the REST API](#indexing-data-with-the-rest-api):
   ```bash
   curl -s -H 'Content-Type: application/json' \
      -X GET "https://localhost:9201/ecommerce/_search?pretty=true&filter_path=hits.total" \
      -d'{"query":{"match":{"customer_first_name":"Sonya"}}}' \
      -ku 'admin:<custom-admin-password>'
   ```
   {% include copy.html %}

   The response should appear similar to the following:

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
1. Open a web browser and navigate to `https://localhost:5601`.
1. If you're prompted to log in, enter the username `admin` and the password that you set in `OPENSEARCH_INITIAL_ADMIN_PASSWORD`. If the **New! Enhanced Discover experience available** dialog appears, select **Dismiss**.
1. Select the **Menu** button in the upper-left corner of the web interface to open the navigation pane.
1. Go to **OpenSearch Dashboards** > **Dashboards**.
1. Choose **[Logs] Web Traffic** to open the dashboard that was created when you added sample data earlier in the process. If you viewed this dashboard before the upgrade, OpenSearch Dashboards might open it directly.
1. When you are done reviewing the dashboard, select the user profile button in the upper-right corner. Choose **Log out** so you can log in as a different user.
1. Enter the username and password you created before upgrading, then select **Log in**.
1. To confirm that you're logged in as the user you created, select the user profile button next to the **Help menu** button. The button shows the first letter of the username, for example, `t` for `testuser`. If you can log in as this user, the internal user that you created before the upgrade was preserved.

## Next steps

Review the following resources to learn more about how OpenSearch works:

- [REST API reference]({{site.url}}{{site.baseurl}}/api-reference/index/)
- [Getting started with OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/getting-started/)
- [About Security in OpenSearch]({{site.url}}{{site.baseurl}}/security/index/)
