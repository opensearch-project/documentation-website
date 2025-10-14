---
layout: default
title: Configuration and system settings
parent: Configuring OpenSearch
nav_order: 10
canonical_url: https://docs.opensearch.org/latest/install-and-configure/configuring-opensearch/configuration-system/
---

# Configuration and system settings

For an overview of creating an OpenSearch cluster and examples of configuration settings, see [Creating a cluster]({{site.url}}{{site.baseurl}}/tuning-your-cluster/index/). To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

OpenSearch supports the following system settings:

- `cluster.name` (Static, string): The cluster name. Default is `opensearch`.

- `node.name` (Static, string): A descriptive name for the node. Required.

- `node.roles` (Static, list): Defines one or more roles for an OpenSearch node. Valid values are `cluster_manager`, `data`, `ingest`, `search`, `ml`, `remote_cluster_client`, and `coordinating_only`. Default is `cluster_manager,data,ingest,remote_cluster_client`.

- `path.data` (Static, string): A path to the directory where your data is stored. Separate multiple locations with commas. Default is `$OPENSEARCH_HOME/data`.

- `path.logs` (Static, string): A path to log files. Default is `$OPENSEARCH_HOME/logs`.

- `bootstrap.memory_lock` (Static, Boolean): Locks the memory at startup. We recommend setting the heap size to about half the memory available on the system and that the owner of the process be allowed to use this limit. OpenSearch doesn't perform well when the system is swapping the memory. Default is `false`.

- `bootstrap.system_call_filter` (Static, Boolean): Controls whether OpenSearch enables system call filters (seccomp) for enhanced security. When enabled, the system call filter prevents certain potentially dangerous system calls from being executed, providing an additional layer of security. If system call filters cannot be installed due to system configuration issues, this setting can be set to `false` to disable them, but this reduces security. Default is `true`.

- `node.store.allow_mmap` (Static, Boolean): Controls whether memory-mapped file access is allowed for index storage operations. When enabled, OpenSearch can use memory mapping (`mmapfs` and `hybridfs` store types) to improve I/O performance by mapping files directly into virtual memory. Disabling this setting forces the use of alternative storage implementations that don't require memory mapping, which may be necessary in environments with memory mapping restrictions or limited virtual address space. Default is `true`.


