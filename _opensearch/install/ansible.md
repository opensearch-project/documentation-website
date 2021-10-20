---
layout: default
title: Ansible playbook
parent: Install OpenSearch
nav_order: 60
---

# Ansible playbook

You can use an Ansible playbook to install and configure a production-ready OpenSearch cluster along with OpenSearch Dashboards.

The Ansible playbook only supports deployment of OpenSearch / OpenSearch Dashboards to CentOS7 hosts.
{: .note }

## Prerequisites

Make sure you have [Ansible](https://www.ansible.com/) and [Java 8](https://www.java.com/en/download/manual.jsp) installed.

## Run OpenSearch and OpenSearch Dashboards using Ansible playbook

1. Clone the OpenSearch [ansible-playbook](https://github.com/opensearch-project/ansible-playbook) repository:

   ```bash
   git clone https://github.com/opensearch-project/ansible-playbook
   ```

1. Run the Ansible playbook with root privileges:

   ```bash
   ansible-playbook -i inventories/opensearch/hosts opensearch.yml --extra-vars "admin_password=Test@123 opensearch-dashboards-server_password=Test@6789"
   ```

   You can set the passwords for the reserved users (`admin` and `opensearch-dashboards-server`) using the `admin_password` and `opensearch-dashboards-server_password` variables.

1. After the deployment process is complete, you can access OpenSearch / OpenSearch Dashboards with username `admin` and the password that you set for the `admin_password` variable.

   ```bash
   curl -XGET https://localhost:9200 -u 'admin:Test@123' --insecure
   ```

## Configuration

You can modify the default configuration values in the `inventories/opensearch/group_vars/all/all.yml` file.
For example, you can increase the Java memory heap size:

```bash
xms_value: 8
xmx_value: 8
```

You can configure node properties in the `inventories/opensearch/hosts` file. Specify the IP addresses of the nodes that you want the Ansible playbook to connect to with the `ansible_host` property:

```bash
ansible_host=<Public IP address> ansible_user=root ip=<Private IP address / 0.0.0.0>
```
