---
layout: default
title: Ansible playbook
parent: Installing OpenSearch
nav_order: 35
redirect_from:
  - /opensearch/install/ansible/
---

# Installing OpenSearch and OpenSearch Dashboards using Ansible

You can use an Ansible playbook to install and configure a production-ready OpenSearch cluster along with OpenSearch Dashboards.

The Ansible playbook deploys OpenSearch and OpenSearch Dashboards to Linux hosts that use `systemd`. For the operating systems that OpenSearch is tested on, see [Compatible operating systems]({{site.url}}{{site.baseurl}}/install-and-configure/os-comp/).
{: .note }

## Prerequisites

The machine on which you run the playbook (the control node) must have the following installed:

- [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/index.html) 2.9 or later. If you install only `ansible-core` instead of the full `ansible` package, also install the collections that the playbook uses:

  ```bash
  ansible-galaxy collection install ansible.posix community.general
  ```
  {% include copy.html %}

- Java 8 or later. The playbook uses Java on the control node to generate the TLS certificates for the cluster. If Java is not installed, the playbook fails with a `java: command not found` error.

The control node must have direct SSH access to the `root` user on each target host.

## Configuration

1. Clone the OpenSearch [`ansible-playbook`](https://github.com/opensearch-project/ansible-playbook) repository and navigate to the repository directory:

   ```bash
   git clone https://github.com/opensearch-project/ansible-playbook
   cd ansible-playbook
   ```
   {% include copy.html %}

   The `main` branch installs the latest OpenSearch 3.x version. To install OpenSearch 2.x, check out the `2.x` branch.

1. Configure the target hosts in the `inventories/opensearch/hosts` file. The default file defines a cluster of five OpenSearch nodes and one OpenSearch Dashboards node. Each line specifies a host name and the following variables:

   - `ansible_host`: The IP address that Ansible uses to connect to the target host.
   - `ansible_user`: The user that Ansible uses to connect to the target host.
   - `ip`: The IP address that OpenSearch and OpenSearch Dashboards bind to. Specify the private IP address of the target host or `0.0.0.0`.
   - `roles`: The [node roles]({{site.url}}{{site.baseurl}}/tuning-your-cluster/) of the OpenSearch node.

   Each host must also be listed in the groups at the end of the file: `os-cluster` for OpenSearch nodes, `master` for cluster manager-eligible nodes, and `dashboards` for the OpenSearch Dashboards node. Hosts that are not listed in a group are not installed. Replace the IP addresses in the default file with the addresses of your hosts.

   To install OpenSearch and OpenSearch Dashboards on a single host, replace the contents of the file with the following, specifying the IP addresses of your host:

   ```ini
   os1 ansible_host=<public-ip-address> ansible_user=root ip=<private-ip-address> roles=data,master

   [os-cluster]
   os1

   [master]
   os1

   [dashboards]
   os1
   ```
   {% include copy.html %}

   For a single host, also set `cluster_type` to `single-node` in the `inventories/opensearch/group_vars/all/all.yml` file:

   ```yaml
   cluster_type: single-node
   ```
   {% include copy.html %}

1. You can modify the default configuration values in the `inventories/opensearch/group_vars/all/all.yml` file. For example, you can increase the Java memory heap size:

   ```yaml
   xms_value: 8
   xmx_value: 8
   ```
   {% include copy.html %}

## Install OpenSearch and OpenSearch Dashboards using the Ansible playbook

1. From the `ansible-playbook` directory, run the Ansible playbook:

   ```bash
   ansible-playbook -i inventories/opensearch/hosts opensearch.yml --extra-vars "admin_password=Test@123 kibanaserver_password=Test@6789 logstash_password=Test@456"
   ```
   {% include copy.html %}

   You can set the passwords for reserved users (`admin`, `kibanaserver`, and `logstash`) using the `admin_password`, `kibanaserver_password`, and `logstash_password` variables.

1. After the deployment process is complete, you can access OpenSearch and OpenSearch Dashboards with the username `admin` and the password that you set for the `admin_password` variable.

   To verify that OpenSearch is running, send a request to the IP address that you specified in the `ip` variable. If you specified a private IP address, send the request from a machine in the same network:

   ```bash
   curl https://<private-ip-address>:9200 -u 'admin:Test@123' --insecure
   ```
   {% include copy.html %}

   If you specified `0.0.0.0`, you can send the request to `localhost` from the target host or to any IP address of the target host.

1. To access OpenSearch Dashboards, go to `http://<ip-address>:5601` in your browser. OpenSearch Dashboards can take about 1 minute to start after the playbook finishes.

## Related documentation

- [Preparing a cluster for production]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/#preparing-a-cluster-for-production)
- [Preparing OpenSearch Dashboards for production]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/#preparing-opensearch-dashboards-for-production)
