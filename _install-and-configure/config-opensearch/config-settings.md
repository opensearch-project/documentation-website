---
layout: default
title: Settings for opensearch.yml
parent: Configuring OpenSearch
nav_order: 5
---

# Settings for opensearch.yml

Configuration file settings customize your distribution. They are contained in a number of different YAML files. Files and their associated settings are listed and described in the following tables.

## opensearch.yml settings

You can use the settings in the following tables to configure your `opensearch.yml` file for core OpenSearch and whichever plugins you run.

### OpenSearch core settings

The settings in the following table apply specifically to OpenSearch core.

| Setting | Description |
| :--- | :--- |
| `network.host` | The IP address used for binding to the port. |
| `http.port` | Used for setting the custom port for HTTP. |
| `discovery.seed_hosts` | The list of hosts that perform discovery when a node is started. The default list of hosts is `["127.0.0.1", "[::1]"]`.
| `cluster.initial_cluster_manager_nodes` | A list of cluster-manager-eligible nodes used to bootstrap the cluster. |
| `discovery.zen.minimum_master_nodes` | The minimum number of master nodes. Set to 1 to allow single node clusters. |
| `gateway.recover_after_nodes` | After a full cluster restart, the number of nodes that must start before recovery can begin.
| `discovery.type` | na |
| `cluster.name` | Enter a name for the cluster |
| `node.name` | a descriptive name for the node |
| `node.attr.rack` | Custom attributes for the node |
| `path.data` | A path to the directory where your data is stored. Separate multiple locations with commas. |
| `path.logs` | A path to log files |
| `bootstrap.memory_lock` | Locks the memory at startup. We recommend setting the heap size to about half the memory available on the system and that the owner of the process is allowed to use this limit. OpenSearch doesn't perform well when the system is swapping the memory. |
| `action.destructive_requires_name` | Determines whether explicit names are required to delete indexes. Default is `true`. |
| `cluster.remote_store.enabled` | Determines whether the cluster forces index creation when remote store is enabled. Default is `true`. |
| `cluster.remote_store.repository` | The repository used for segment upload when enforcing remote store for an index. |
| `cluster.remote_store.translog.enabled` | Determines whether the cluster forces index creation when translog remote store is enabled. Default is `true`. |
| `cluster.remote_store.translog.repository` | The repository used for translog upload when enforcing remote store for an index. |



### Security plugin settings

The settings in the following table apply specifically to the Security plugin.

| Setting | Description |
| :--- | :--- |
| `plugins.security.ssl.transport.pemcert_filepath` | na|
| `plugins.security.ssl.transport.pemkey_filepath` | na |
| `plugins.security.ssl.transport.pemtrustedcas_filepath` | na |
| `plugins.security.ssl.transport.enforce_hostname_verification` | na |
| `plugins.security.ssl.http.enabled` | na |
| `plugins.security.ssl.http.pemcert_filepath` | na |
| `plugins.security.ssl.http.pemkey_filepath` | na |
| `plugins.security.ssl.http.pemtrustedcas_filepath` | na |
| `plugins.security.allow_default_init_securityindex` | na |
| `plugins.security.authcz.admin_dn` | na |
| `plugins.security.nodes_dn` | na |
| `plugins.security.audit.type` | na |
| `plugins.security.enable_snapshot_restore_privilege` | na |
| `plugins.security.check_snapshot_restore_write_privileges` | na |
| `plugins.security.restapi.roles_enabled` | na |
| `cluster.routing.allocation.disk.threshold_enabled` | na |
| `opendistro_security.audit.config.disabled_rest_categories` | na |
| `opendistro_security.audit.config.disabled_transport_categories` | na |
| `plugins.security.restapi.password_validation_regex` | na |
| `plugins.security.restapi.password_validation_error_message` | na |
| `plugins.security.allow_default_init_securityindex` | na |
| `plugins.security.cache.ttl_minutes` | na |
| `plugins.` | na |


### Currently experimental feature settings

| Setting | Description |
| :--- | :--- |
| `opensearch.experimental.feature.replication_type.enabled` | Enables the index setting that allows for changing the replication type. |
| `opensearch.experimental.feature.remote_store.enabled` | Enables the index setting that allows for persisting data to remote store in addition to the local disk. |
| `opensearch.experimental.feature.searchable_snapshot.enabled` | Enables a new parameter for the snapshot restore API that allows for creation of a new index type, which searches a snapshot directly in a remote repository without restoring all index data to disk ahead of time. |
| `opensearch.experimental.feature.extensions.enabled` | Enables extensions to work with OpenSearch and extend application features of OpenSearch outside of the core. |
| `opensearch.experimental.feature.search_pipeline.enabled: false` | Enables configurable processors for search requests and search responses, similar to ingest pipelines. |


## opensearch.yml examples

The following YAML file provides the same settings as those in the previous section along with example values.

### OpenSearch settings examples

```yml
network.host: 192.168.0.1
http.port: 9200
discovery.seed_hosts: ["host1", "host2"]
cluster.initial_cluster_manager_nodes: ["node-1", "node-2"]
discovery.zen.minimum_master_nodes: 1
gateway.recover_after_nodes: 3
discovery.type: single-node
cluster.name: my-application
node.name: node-1
node.attr.rack: r1
path.data: path/to/data/datafile/
path.logs: path/to/logs/logfile/
bootstrap.memory_lock: true
action.destructive_requires_name: true
cluster.remote_store.enabled: true
cluster.remote_store.repository: my-repo-1
cluster.remote_store.translog.enabled: true
cluster.remote_store.translog.repository: my-repo-1
```

### Security plugin settings examples

```yml
plugins.security.ssl.transport.pemcert_filepath: esnode.pem
plugins.security.ssl.transport.pemkey_filepath: esnode-key.pem
plugins.security.ssl.transport.pemtrustedcas_filepath: root-ca.pem
plugins.security.ssl.transport.enforce_hostname_verification: false
plugins.security.ssl.http.enabled: true
plugins.security.ssl.http.pemcert_filepath: esnode.pem
plugins.security.ssl.http.pemkey_filepath: esnode-key.pem
plugins.security.ssl.http.pemtrustedcas_filepath: root-ca.pem
plugins.security.allow_unsafe_democertificates: true
plugins.security.allow_default_init_securityindex: true
plugins.security.authcz.admin_dn:
  - CN=kirk,OU=client,O=client,L=test, C=de

plugins.security.audit.type: internal_opensearch
plugins.security.enable_snapshot_restore_privilege: true
plugins.security.check_snapshot_restore_write_privileges: true
plugins.security.cache.ttl_minutes: 60
plugins.security.restapi.roles_enabled: ["all_access", "security_rest_api_access"]
plugins.security.system_indices.enabled: true
plugins.security.system_indices.indices: [".opendistro-alerting-config", ".opendistro-alerting-alert*", ".opendistro-anomaly-results*", ".opendistro-anomaly-detector*", ".opendistro-anomaly-checkpoints", ".opendistro-anomaly-detection-state", ".opendistro-reports-*", ".opendistro-notifications-*", ".opendistro-notebooks", ".opendistro-asynchronous-search-response*"]
node.max_local_storage_nodes: 3
plugins.security.restapi.password_validation_regex: '(?=.*[A-Z])(?=.*[^a-zA-Z\d])(?=.*[0-9])(?=.*[a-z]).{8,}'
plugins.security.restapi.password_validation_error_message: "Password must be minimum 8 characters long and must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
plugins.security.allow_default_init_securityindex: true
plugins.security.cache.ttl_minutes: 60

```

### Example settings for currently experimental features

```yml
opensearch.experimental.feature.replication_type.enabled: false
opensearch.experimental.feature.remote_store.enabled: false
opensearch.experimental.feature.searchable_snapshot.enabled: false
opensearch.experimental.feature.extensions.enabled: false
opensearch.experimental.feature.search_pipeline.enabled: false
```

