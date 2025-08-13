---
layout: default
title: Configuration and system settings
parent: Configuring OpenSearch
nav_order: 10
---

# Configuration and system settings

For an overview of creating an OpenSearch cluster and examples of configuration settings, see [Creating a cluster]({{site.url}}{{site.baseurl}}/tuning-your-cluster/index/). To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

OpenSearch supports the following system settings:

- `cluster.name` (Static, string): The cluster name. Default is `opensearch`.

- `node.name` (Static, string): A descriptive name for the node. Required.

- `node.roles` (Static, list): Defines one or more roles for an OpenSearch node. Valid values are `cluster_manager`, `data`, `ingest`, `search`, `ml`, `remote_cluster_client`, and `coordinating_only`. Default is `cluster_manager,data,ingest,remote_cluster_client`.

- `path.data` (Static, string): A path to the directory where your data is stored. Separate multiple locations with commas. The default depends on the deployment method, see following examples of default `path.data` per deployment method:
     - RPM/DEB: `/var/lib/opensearch`
     - Docker: `/usr/share/opensearch/data`
     - Tarball: `$OPENSEARCH_HOME/data`

- `path.logs` (Static, string): A path to log files. The default depends on the deployment method, see following examples of default `path.logs` per deployment method:
     - RPM/DEB: `/var/log/opensearch`
     - Docker: `/usr/share/opensearch/logs`
     - Tarball: `$OPENSEARCH_HOME/logs`

- `bootstrap.memory_lock` (Static, Boolean): Locks the memory at startup. We recommend setting the heap size to about half the memory available on the system and that the owner of the process is allowed to use this limit. OpenSearch doesn't perform well when the system is swapping the memory. Default is `false`.
