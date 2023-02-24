---
layout: default
title: Appendix
parent: Upgrading OpenSearch
nav_order: 99
---

# Appendix

You can refer to this appendix for additional supporting documentation, such as example API requests and configuration files that were used for testing and validation of the upgrade process. If you would like to request specific topics to include in this appendix, please comment on the [upgrade and migration documentation meta issue](https://github.com/opensearch-project/documentation-website/issues/2830) in the [OpenSearch Project](https://github.com/opensearch-project) on GitHub.

Specific commands are included in this appendix to serve as examples of interacting with the OpenSearch API, and the underlying host, in order to demonstrate the steps described in the related upgrade process documents. The intention is not to be overly prescriptive, but instead to add context for users who are new to OpenSearch and want to see practical examples.
{:.note}

## Upgrading OpenSearch

This section of the appendix includes materials relating to version upgrades of OpenSearch and OpenSearch Dashboards.

### Rolling upgrade

The rolling upgrade procedure was tested and validated on a Linux host running [Amazon Linux 2](https://aws.amazon.com/amazon-linux-2/) with [Docker](https://www.docker.com/). You can follow these steps to recreate the same cluster state used for generating the procedure if you want to try the upgrade process in a test environment.

#### Environment details

Testing was performed using [Amazon Elastic Compute Cloud (Amazon EC2)](https://aws.amazon.com/ec2/) with a `t2.large` instance type. The instance was provisioned with 2 vCPUs, 8 GiB memory, and an attached 20 GiB gp2 [Amazon Elastic Block Store (EBS)](https://aws.amazon.com/ebs/) root volume. Kernel version `Linux 5.10.162-141.675.amzn2.x86_64` was used for testing.

References to the `$HOME` path on the host machine in this procedure are represented by `~` to make the instructions more portable. If you would prefer to specify an absolute path, modify the volume paths define in `upgrade-demo-cluster.sh` to reflect your environment.
{: .note}

If you want to clean up resources created during this rolling upgrade demonstration, run the following command. If any unrelated Docker resources are running on your host, then you should modify this command to avoid deleting any of those resources unintentionally.
```bash
docker container stop $(docker container ls -aqf name=os-); \
	docker container rm $(docker container ls -aqf name=os-); \
	docker volume rm -f $(docker volume ls -q | egrep 'data-0|repo-0'); \
	docker network rm opensearch-dev-net
```
{% include copy.html %}

#### Upgrade steps

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
	1. Confirm that the change was applied with the following command which will print the value:
	   ```bash
	   cat /proc/sys/vm/max_map_count
	   ```
	   {% include copy.html %}
1. Navigate to your home directory and create a new directory called `deploy`. You will use `~/deploy` for the deployment script, configuration files and TLS certificates.
   ```bash
   mkdir ~/deploy && cd ~/deploy
   ```
   {% include copy.html %}
1. Download `upgrade-demo-cluster.sh` from the OpenSearch [documentation-website](https://github.com/opensearch-project/documentation-website) repository.
   ```
   cd ~ && wget https://raw.githubusercontent.com/opensearch-project/documentation-website/main/assets/examples/upgrade-demo-cluster.sh
   ```
   {% include copy.html %}