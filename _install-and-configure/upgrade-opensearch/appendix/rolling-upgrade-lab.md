---
layout: default
title: Lab - Rolling Upgrade
parent: Upgrades Appendix
grand_parent: Upgrading OpenSearch
nav_order: 50
redirect_from:
  - /upgrade-opensearch/appendix/lab-rolling-upgrade/
---

# Lab - Rolling Upgrade

The rolling upgrade procedure was tested and validated on a Linux host running [Amazon Linux 2](https://aws.amazon.com/amazon-linux-2/) with [Docker](https://www.docker.com/). You can follow these steps to recreate the same cluster state used for generating the procedure if you want to try the upgrade process in a test environment.

## Environment details

Testing was performed using [Amazon Elastic Compute Cloud (Amazon EC2)](https://aws.amazon.com/ec2/) with a `t2.large` instance type. The instance was provisioned with 2 vCPUs, 8 GiB memory, and an attached 20 GiB gp2 [Amazon Elastic Block Store (EBS)](https://aws.amazon.com/ebs/) root volume. Kernel version `Linux 5.10.162-141.675.amzn2.x86_64` was used for testing.

References to the `$HOME` path on the host machine in this procedure are represented by the tilde character ("~") to make the instructions more portable. If you would prefer to specify an absolute path, modify the volume paths define in `upgrade-demo-cluster.sh` to reflect your environment.
{: .note}

If you want to clean up resources created during this rolling upgrade procedure, run the following command. If any unrelated Docker resources are running on your host, then you should modify this command as needed to avoid deleting any other resources.
```bash
docker container stop $(docker container ls -aqf name=os-); \
	docker container rm $(docker container ls -aqf name=os-); \
	docker volume rm -f $(docker volume ls -q | egrep 'data-0|repo-0'); \
	docker network rm opensearch-dev-net
```
{% include copy.html %}

## Upgrade steps

### Set up the environment

1. Install the appropriate version of [Docker Engine](https://docs.docker.com/engine/install/) for your Linux distribution and architecture. 
1. Configure [important system settings]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/#important-settings) on your host.
    1. Disable memory paging and swapping performance on the host to improve performance:
	   ```bash
	   sudo swapoff -a
	   ```
	   {% include copy.html %}
	1. Increase the number of memory maps available to OpenSearch. First, open the `sysctl` configuration file for editing. This example command uses the [vim](https://www.vim.org/), but you should use whichever available text editor you prefer:
	   ```bash
	   sudo vim /etc/sysctl.conf
	   ```
	   {% include copy.html %}
	1. Add the following line to the file:
	   ```bash
	   vm.max_map_count=262144
	   ```
	   {% include copy.html %}
	1. Save and quit.
	1. Apply the configuration change:
	   ```bash
	   sudo sysctl -p
	   ```
	   {% include copy.html %}
1. Navigate to your home directory and create a directory named `deploy`. You will use the path `~/deploy` for the deployment script, configuration files and TLS certificates.
   ```bash
   mkdir ~/deploy && cd ~/deploy
   ```
   {% include copy.html %}
1. Download `upgrade-demo-cluster.sh` from the OpenSearch [documentation-website](https://github.com/opensearch-project/documentation-website) repository:
   ```bash
   wget https://raw.githubusercontent.com/opensearch-project/documentation-website/main/assets/examples/upgrade-demo-cluster.sh
   ```
   {% include copy.html %}
1. Run the script without any changes to deploy four containers running OpenSearch and one container running OpenSearch Dashboards, with custom self-signed TLS certificates and a pre-defined set of internal users:
   ```bash
   sh upgrade-demo-cluster.sh
   ```
   {% include copy.html %}
1. Confirm that the containers were launched successfully with the following command:
   ```bash
   docker container ls
   ```
   {% include copy.html %}
   You should see a response that looks like the following example, but with different container IDs:
   ```bash
   CONTAINER ID   IMAGE                                           COMMAND                  CREATED          STATUS          PORTS                                                                                                      NAMES
   6e5218c8397d   opensearchproject/opensearch-dashboards:1.3.7   "./opensearch-dashbo…"   24 seconds ago   Up 22 seconds   0.0.0.0:5601->5601/tcp, :::5601->5601/tcp                                                                  os-dashboards-01
   cb5188308b21   opensearchproject/opensearch:1.3.7              "./opensearch-docker…"   25 seconds ago   Up 24 seconds   9300/tcp, 9650/tcp, 0.0.0.0:9204->9200/tcp, :::9204->9200/tcp, 0.0.0.0:9604->9600/tcp, :::9604->9600/tcp   os-node-04
   71b682aa6671   opensearchproject/opensearch:1.3.7              "./opensearch-docker…"   26 seconds ago   Up 25 seconds   9300/tcp, 9650/tcp, 0.0.0.0:9203->9200/tcp, :::9203->9200/tcp, 0.0.0.0:9603->9600/tcp, :::9603->9600/tcp   os-node-03
   f894054a9378   opensearchproject/opensearch:1.3.7              "./opensearch-docker…"   27 seconds ago   Up 26 seconds   9300/tcp, 9650/tcp, 0.0.0.0:9202->9200/tcp, :::9202->9200/tcp, 0.0.0.0:9602->9600/tcp, :::9602->9600/tcp   os-node-02
   2e9c91c959cd   opensearchproject/opensearch:1.3.7              "./opensearch-docker…"   28 seconds ago   Up 27 seconds   9300/tcp, 9650/tcp, 0.0.0.0:9201->9200/tcp, :::9201->9200/tcp, 0.0.0.0:9601->9600/tcp, :::9601->9600/tcp   os-node-01
   ```
1. While you wait for the containers to start, download the sample data provided by the OpenSearch Project.
   1. Download the field mappings file:
      ```bash
      wget https://raw.githubusercontent.com/opensearch-project/documentation-website/main/assets/examples/ecommerce-field_mappings.json
      ```
      {% include copy.html %}
   1. Download the bulk document:
      ```bash
      wget https://raw.githubusercontent.com/opensearch-project/documentation-website/main/assets/examples/ecommerce.json
      ```
      {% include copy.html %}
1. The amount of time it takes to initialize and bootstrap the cluster will vary depending on the performance capabilities of the underlying host. You can watch the container logs to see what OpenSearch is doing during cluster formation.
   1. Enter the following command to display logs for container `os-node-01` in the terminal window:
      ```bash
      docker logs -f os-node-01
      ```
   1. You will see a log entry like the following example when the node is ready:
      ```
      [INFO ][o.o.s.c.ConfigurationRepository] [os-node-01] Node 'os-node-01' initialized
      ```
   1. Press `Ctrl+C` to stop following container logs and return to the command prompt.
1. Use `cURL` to query the API. In the following command, `os-node-01` is queried by sending the request to host port `9201`, which is mapped to port `9200` on the container:
   ```bash
   curl -s "https://localhost:9201" -ku admin:admin
   ```
   You should see a response that looks like the following example:
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