---
layout: default
title: Install and configure OpenSearch
nav_order: 1
has_children: false
has_toc: false
nav_exclude: true
permalink: /install-and-configure/
redirect_from:
  - /install-and-configure/index/
---

# Install and configure OpenSearch

You can install OpenSearch and OpenSearch Dashboards in containers, on Kubernetes, on Linux hosts, or on Windows. After installation, configure the cluster for your deployment and install any additional plugins that you need.

## Trying OpenSearch

To try OpenSearch on your computer, see [Installation quickstart]({{site.url}}{{site.baseurl}}/getting-started/quickstart/). The quickstart starts OpenSearch and OpenSearch Dashboards using Docker Compose and is intended for testing, not for production.

## Before installation

Before you install OpenSearch, review the following information:

- The host requirements and important settings in [Installing OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/)
- The supported operating systems in [Compatible operating systems]({{site.url}}{{site.baseurl}}/install-and-configure/os-comp/)

## Choosing an installation method

The following table lists the installation methods and links to the installation guides for each product. The OpenSearch Kubernetes Operator and the Ansible playbook install OpenSearch and OpenSearch Dashboards together, so each has one guide.

| Method | Installation guides |
| :--- | :--- |
| Docker | [OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/docker/), [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/docker/) |
| OpenSearch Kubernetes Operator | [OpenSearch and OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/operator/) |
| Helm | [OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/helm/), [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/helm/) |
| Debian | [OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/debian/), [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/debian/) |
| RPM | [OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/rpm/), [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/rpm/) |
| Tarball | [OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/tar/), [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/tar/) |
| Ansible playbook | [OpenSearch and OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/ansible/) |
| Windows | [OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/windows/), [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/windows/) |

## After installation

After you install OpenSearch, use the following guides to set up your deployment:

- [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/)
- [Configuring OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-dashboards/)
- [Managing OpenSearch plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/)
- [Managing OpenSearch Dashboards plugins]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/plugins/)

## Related documentation

- To upgrade an existing cluster, see [Migrate or upgrade]({{site.url}}{{site.baseurl}}/migrate-or-upgrade/).
