---
layout: default
title: Configuration and system settings
parent: Configuring OpenSearch
nav_order: 10
---

# Configuration and system settings

For an overview of creating an OpenSearch cluster and examples of configuration settings, see [Creating a cluster]({{site.url}}{{site.baseurl}}/tuning-your-cluster/index/). To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

## Cluster and node identity settings

These are the fundamental settings required to identify your cluster and nodes:

- `cluster.name` (Static, string): The cluster name. Default is `opensearch`.

- `node.name` (Static, string): A descriptive name for the node. Required.

- `node.roles` (Static, list): Defines one or more roles for an OpenSearch node. Valid values are `cluster_manager`, `data`, `ingest`, `search`, `ml`, `remote_cluster_client`, and `coordinating_only`. Default is `cluster_manager,data,ingest,remote_cluster_client`.

- `node.id.seed` (Static, long): Provides a seed value for determining the persisted unique UUID of a node. When a node starts for the first time, this seed helps generate a unique node identifier. If the node already has a persisted UUID on disk from a previous startup, this seed is ignored and the existing UUID is reused. This setting is useful for ensuring consistent node identification in automated deployments. Default is `0`. Accepts any long value including negative numbers.

## Path settings

Path settings define directory locations for OpenSearch installation and data storage:

- `path.home` (Static, string): Specifies the home directory path for the OpenSearch installation. This is the root directory where OpenSearch is installed and contains the bin, config, lib, and other installation directories. This setting is typically set automatically during installation but can be explicitly configured if needed. No default value - must be specified during startup.

- `path.data` (Static, string): A path to the directory where your data is stored. Separate multiple locations with commas. Default is `$OPENSEARCH_HOME/data`.

- `path.logs` (Static, string): A path to log files. Default is `$OPENSEARCH_HOME/logs`.

- `path.shared_data` (Static, string): Specifies the path to a shared data directory that can be accessed by multiple nodes. This setting is useful in multi-node deployments where certain data needs to be shared across nodes in the cluster. The specified directory must be accessible by all nodes that need to share data. No default value - only set when shared data functionality is required.

## Memory and storage settings

Settings that control how OpenSearch uses system memory and storage:

- `bootstrap.memory_lock` (Static, Boolean): Locks the memory at startup. We recommend setting the heap size to about half the memory available on the system and that the owner of the process be allowed to use this limit. OpenSearch doesn't perform well when the system is swapping the memory. Default is `false`.

- `node.store.allow_mmap` (Static, Boolean): Controls whether memory-mapped file access is allowed for index storage operations. When enabled, OpenSearch can use memory mapping (`mmapfs` and `hybridfs` store types) to improve I/O performance by mapping files directly into virtual memory. Disabling this setting forces the use of alternative storage implementations that don't require memory mapping, which may be necessary in environments with memory mapping restrictions or limited virtual address space. Default is `true`.

- `node.local_storage` (Static, Boolean): Controls whether the node can store data locally on its file system. When enabled, the node can write index data, cluster state, and other persistent information to local disk. When disabled, the node operates as a stateless node that does not persist any data locally. This setting is useful for creating dedicated coordination-only nodes that don't store shard data. Default is `true`.

## Bootstrap and system security settings

Settings that control system-level security and bootstrap behavior:

- `bootstrap.system_call_filter` (Static, Boolean): Controls whether OpenSearch enables system call filters (seccomp) for enhanced security. When enabled, the system call filter prevents certain potentially dangerous system calls from being executed, providing an additional layer of security. If system call filters cannot be installed due to system configuration issues, this setting can be set to `false` to disable them, but this reduces security. Default is `true`.

- `bootstrap.ctrlhandler` (Static, Boolean): Controls whether OpenSearch enables a control handler for graceful shutdown on Windows systems. When enabled, allows OpenSearch to respond to system shutdown signals and perform cleanup operations. This setting is primarily relevant for Windows deployments and helps ensure proper shutdown behavior. Default is `true`.

## Process management settings

Settings for external monitoring and process management tools:

- `node.portsfile` (Static, Boolean): Controls whether OpenSearch writes the node's port information to a file on disk. When enabled, the node creates a file containing the ports it's listening on, which can be useful for external monitoring and automation tools. This file is typically written to the node's data directory and is removed when the node shuts down cleanly. Default is `false`.

- `node.pidfile` (Static, string): Specifies the path where OpenSearch should write its process ID (PID) file. The PID file contains the process ID of the running OpenSearch node and is commonly used by system administrators and process management tools to track and manage the OpenSearch process. The file is created when the node starts and removed when it shuts down cleanly. The specified path should be writable by the OpenSearch process. No default value - PID file is not created unless this setting is specified.
