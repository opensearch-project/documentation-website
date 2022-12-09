---
layout: default
title: Install and configure OpenSearch
nav_order: 1
---

# Install and configure OpenSearch

This section details how to install and configure OpenSearch and OpenSearch Dashboards.

## Install OpenSearch

OpenSearch has the following installation options:

- [Docker]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/docker/)
- [Tarball]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/tar/)
- [RPM]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/rpm/)
- [Ansible]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/ansible/)
- [Helm]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/helm/)
- [Windows]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/windows/)

OpenSearch does not support direct version downgrades. If your environment must be downgraded, we recommend using snapshots to create a restore point, then restoring the snapshot to a cluster built with the target version. To learn more about restore points, see [Restore snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore#restore-snapshots).
{: .note }

## Install Dashboards

OpenSearch Dashboards has the following installation options:

- [Docker]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/docker/)
- [Tarball]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/tar/)
- [RPM]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/rpm/)
- [Helm]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/helm/)
- [Windows]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/windows/)

## Configuration

For an overview of configuration options for OpenSearch, see [Configuration]({{site.url}}{{site.baseurl}}/install-and-configure/configuration/).
