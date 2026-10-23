---
layout: default
title: Ansible playbook
parent: Installing OpenSearch
nav_order: 35
redirect_from:
  - /opensearch/install/ansible/
---

{% assign os_major = site.opensearch_major_minor_version | split: "." | first %}
{% assign os_previous_major = os_major | minus: 1 %}

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

   The `main` branch installs the latest OpenSearch {{os_major}}.x version. To install OpenSearch {{os_previous_major}}.x, check out the `{{os_previous_major}}.x` branch.

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

## Rerunning the playbook

The playbook restarts OpenSearch on all target hosts at the same time every time it runs, so the cluster is unavailable while the nodes restart. Plan reruns, for example, to apply configuration changes, for a maintenance window.

By default, the playbook generates the TLS certificates on the control node in the `/tmp/opensearch-nodecerts` directory. When you rerun the playbook, it reuses the certificates and does not copy the security configuration to the target hosts again if this directory exists. If the directory doesn't exist, for example, because the control node was restarted and `/tmp` was cleared, the playbook generates a new root certificate authority (CA) and new node and admin certificates and copies them to all target hosts. Clients that verify the cluster's certificates then need the new `root-ca.pem` file.

To manage an existing cluster using repeated playbook runs, set `iac_enable` to `true` in the `inventories/opensearch/group_vars/all/all.yml` file. In this mode, the playbook updates the configuration files on every run but copies new certificates only if at least one certificate is missing on at least one host, for example, when you add a host to the cluster. In that case, it replaces the certificates on all hosts.

### Rotating certificates

The generated certificates are valid for the number of days set in the `cert_valid_days` variable (default `730`). To replace them with new certificates, delete the `/tmp/opensearch-nodecerts` directory on the control node, make sure that `iac_enable` is `false`, and rerun the playbook. All nodes restart using the new certificates at the same time.

## Upgrading a cluster installed using the playbook

The playbook installs OpenSearch but doesn't upgrade it. Changing `os_version` and rerunning the playbook isn't a supported upgrade method for the following reasons:

- The playbook downloads the OpenSearch archive to `/tmp/opensearch.tar.gz` on each target host and skips the download if that file exists. Unless `iac_enable` is `true`, the new version is not installed on hosts that still have the archive from the previous run.
- When the new version is installed, the playbook extracts it over the existing installation in `/usr/share/opensearch`, so files from the previous version that are not part of the new version remain in the installation directory.
- The playbook restarts all nodes at the same time instead of one node at a time.

To upgrade a cluster installed using the playbook, upgrade the nodes one at a time by following the [rolling upgrade]({{site.url}}{{site.baseurl}}/migrate-or-upgrade/rolling-upgrade/) procedure. The playbook installs OpenSearch in `/usr/share/opensearch` and stores the configuration, certificates, and Security plugin configuration in `/usr/share/opensearch/config`. Preserve these files when you install the new version on each node. After you upgrade all nodes, update `os_version` and `os_dashboards_version` in `inventories/opensearch/group_vars/all/all.yml` to match the installed version.

## Related documentation

- [Preparing a cluster for production]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/#preparing-a-cluster-for-production)
- [Preparing OpenSearch Dashboards for production]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/#preparing-opensearch-dashboards-for-production)
