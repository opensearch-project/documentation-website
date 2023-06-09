---
layout: default
title: Settings for opensearch.yml
parent: Configuring OpenSearch
nav_order: 5
---

# Settings for opensearch.yml

Configuration file settings customize your distribution. You can use the settings in the following tables to configure your `opensearch.yml` file for core OpenSearch and whichever plugins you run. This section categorizes the settings and provides description for each. Examples for settings in the groupings follow each table. 


## OpenSearch core settings

The settings in the following table apply specifically to OpenSearch core.

| Setting | Description |
| :--- | :--- |
| `network.host` | Bind OpenSearch to the correct network interface. Use 0.0.0.0 to include all available interfaces, or specify an IP address assigned to a specific interface. |
| `http.port` | Used for setting the custom port for HTTP. |
| `discovery.seed_hosts` | The list of hosts that perform discovery when a node is started. The default list of hosts is `["127.0.0.1", "[::1]"]`.
| `cluster.initial_cluster_manager_nodes` | A list of cluster-manager-eligible nodes used to bootstrap the cluster. |
| `discovery.zen.minimum_master_nodes` | The minimum number of master nodes. Set to 1 to allow single node clusters. |
| `gateway.recover_after_nodes` | After a full cluster restart, the number of nodes that must start before recovery can begin.
| `discovery.type` | Before configuring a cluster, set discovery.type to single-node to prevent the bootstrap checks from failing when you start the service. |
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


## Security plugin settings

The settings in the following table apply specifically to the Security plugin.

| Setting | Description |
| :--- | :--- |
| `plugins.security.ssl.transport.pemcert_filepath` | na |
| `plugins.security.ssl.transport.pemkey_filepath` | na |
| `plugins.security.ssl.transport.pemtrustedcas_filepath` | na |
| `plugins.security.ssl.transport.enforce_hostname_verification` | na |
| `plugins.security.ssl.http.enabled` | na |
| `plugins.security.ssl.http.pemcert_filepath` | na |
| `plugins.security.ssl.http.pemkey_filepath` | na |
| `plugins.security.ssl.http.pemtrustedcas_filepath` | na |
| `plugins.security.allow_default_init_securityindex` | na |
| `plugins.security.authcz.admin_dn` | Defines the DNs (distinguished names) of certificates to which admin privileges should be assigned. Required. |
| `plugins.security.nodes_dn` | Specifies a list of distinguished names (DNs) which denote the other nodes in the cluster. This settings support wildcards and regular expressions. The list of DNs are also read from the security index **in addition** to the .yml configuration when `plugins.security.nodes_dn_dynamic_config_enabled` is `true`. |
| `plugins.security.nodes_dn_dynamic_config_enabled` | Relevant for cross_cluster usecases where there is a need to manage the whitelisted nodes_dn without having to restart the nodes everytime a new cross_cluster remote is configured. Setting nodes_dn_dynamic_config_enabled to true enables **super-admin callable** /_opendistro/_security/api/nodesdn APIs which provide means to update/retrieve nodesdn dynamically. This setting only has effect if 'plugins.security.cert.intercluster_request_evaluator_class' is not set. Default is `false`. |
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
| `plugins.security.roles_mapping_resolution` | Defines how backend roles are mapped to Security roles.<br>MAPPING_ONLY - mappings must be configured explicitely in roles_mapping.yml (default)<br>BACKENDROLES_ONLY - backend roles are mapped to Security roles directly. Settings in roles_mapping.yml have no effect.<br>BOTH - backend roles are mapped to Security roles mapped directly and via roles_mapping.yml in addition.  |
| `plugins.security.restapi.roles_enabled` | Enables role based access to the REST management API for listed roles. Roles are separated by a comma. Default is that no role is allowed to access the REST management API (an empty list). |
| `plugins.security.restapi.endpoints_disabled.<role>.<endpoint>` | Disables specific endpoints and their HTTP methods for roles. Values for this setting compose an array of HTTP methods. For example: `plugins.security.restapi.endpoints_disabled.all_access.ACTIONGROUPS: ["PUT","POST","DELETE"]`. By default, all endpoints and methods are allowed. Existing endpoints include: ACTIONGROUPS, CACHE, CONFIG, ROLES, ROLESMAPPING, INTERNALUSERS, SYSTEMINFO, PERMISSIONSINFO, LICENSE. |
| `plugins.security.audit.enable_rest` | Enables or disables rest request logging. Default is `true`, enabled. |
| `plugins.security.audit.enable_transport` | Enables or disables transport request logging. Default is `false', disabled. |
| `plugins.security.audit.resolve_bulk_requests` | Enable or disable bulk request logging. When enabled, all subrequests in bulk requests are also logged. The default is false, disabled. |
| `plugins.security.audit.config.disabled_categories` | Disables the specified event categories. |
| `plugins.security.audit.ignore_requests` | Excludes the specified requests from being logged. Allows wildcards, regex of actions, and REST request paths. |
| `plugins.security.audit.threadpool.size` | Determines the number of threads in the thread pool used to log events. Default is `10`. Setting this value to `0` disables the thread pool, which means the plugin logs events synchronously. |
| `plugins.security.audit.threadpool.max_queue_len` | Sets the maximum queue length per thread. Default is `100000`. |
| `plugins.security.audit.ignore_users` | An array of users. Audit requests from the users in the list will not be logged. |
| `plugins.security.audit.type` | The destination of audit log events. Options are `internal_opensearch`, `external_opensearch`, `debug`, and `webhook`. |
| `plugins.security.audit.config.http_endpoints` | Endpoints for `localhost`. |
| `plugins.security.audit.config.index` | The audit log index. The default is `auditlog6`. The index can be static or an index that includes a date so that it rotates on a daily basis. For example: "'auditlog6-'YYYY.MM.dd". In both cases, make sure you secure the index properly. |
| `plugins.security.audit.config.type` | Specify the audit log type as `auditlog`. |
| `plugins.security.audit.config.username` | Username for the audit log configuration. [How does this differ from the admin's sign on?] |
| `plugins.security.audit.config.password` | Password for the audit log configuration. [How does this differ from the admin's sign on?] |
| `plugins.security.audit.config.enable_ssl` | Enables or disables SSL for audit logging. [More description needed] |
| `plugins.security.audit.config.verify_hostnames` | [More description needed] |
| `plugins.security.audit.config.enable_ssl_client_auth | [More description needed] |
| `plugins.security.audit.config.cert_alias` | [More description needed] |
| `plugins.security.audit.config.pemkey_filepath` | Filepath for the location where the pemkey is stored. |
| `plugins.security.audit.config.pemkey_content` | [More description needed] |
| `plugins.security.audit.config.pemkey_password` | [More description needed] |
| `plugins.security.audit.config.pemcert_filepath` | [More description needed] |
| `plugins.security.audit.config.pemcert_content` | [More description needed] |
| `plugins.security.audit.config.pemtrustedcas_filepath` | [More description needed] |
| `plugins.security.audit.config.pemtrustedcas_content` | [More description needed] |
| `plugins.security.audit.config.webhook.url` | The webhook URL. |
| `plugins.security.audit.config.webhook.format` | The format used for the webhook. The options are `URL_PARAMETER_GET`, `URL_PARAMETER_POST`, `TEXT`, `JSON`, `SLACK`. |
| `plugins.security.audit.config.webhook.ssl.verify` | [More description needed] |
| `plugins.security.audit.config.webhook.ssl.pemtrustedcas_filepath` | [More description needed] |
| `plugins.security.audit.config.webhook.ssl.pemtrustedcas_content` | [More description needed] |
| `plugins.security.audit.config.log4j.logger_name` | [More description needed] |
| `plugins.security.audit.config.log4j.level` | [More description needed] |
| `plugins.security.authcz.impersonation_dn` | Enables transport layer impersonation. This allows DNs (distinguished names) to impersonate as other users. |
| `plugins.security.authcz.rest_impersonation_user` | Enables REST layer impersonation. This allows users to impersonate as other users. |
| `plugins.` | na |
| `plugins.` | na |
| `plugins.` | na |
| `plugins.` | na |
| `plugins.` | na |
| `plugins.` | na |
| `plugins.` | na |
| `plugins.` | na |
| `plugins.` | na |
| `plugins.` | na |
| `plugins.` | na |
| `plugins.` | na |
| `plugins.` | na |
| `plugins.` | na |


### Security plugin settings examples

```yml
# Common configuration settings
plugins.security.nodes_dn:
  - "CN=*.example.com, OU=SSL, O=Test, L=Test, C=DE"
  - "CN=node.other.com, OU=SSL, O=Test, L=Test, C=DE"
plugins.security.authcz.admin_dn:
  - CN=kirk,OU=client,O=client,L=test, C=de
plugins.security.roles_mapping_resolution: MAPPING_ONLY
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
plugins.security.nodes_dn_dynamic_config_enabled: false
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
#
# REST Management API configuration settings
plugins.security.restapi.roles_enabled: ["all_access","xyz_role"]
plugins.security.restapi.endpoints_disabled.all_access.ACTIONGROUPS: ["PUT","POST","DELETE"] # Alternative example: plugins.security.restapi.endpoints_disabled.xyz_role.LICENSE: ["DELETE"] #
# Audit log configuration settings
plugins.security.audit.enable_rest: true
plugins.security.audit.enable_transport: false
plugins.security.audit.resolve_bulk_requests: false
plugins.security.audit.config.disabled_categories: ["AUTHENTICATED","GRANTED_PRIVILEGES"]
plugins.security.audit.ignore_requests: ["indices:data/read/*","*_bulk"]
plugins.security.audit.threadpool.size: 10
plugins.security.audit.threadpool.max_queue_len: 100000
plugins.security.audit.ignore_users: ['kibanaserver','some*user','/also.*regex possible/']
plugins.security.audit.type: internal_opensearch
#
# external_opensearch settings
plugins.security.audit.config.http_endpoints: ['localhost:9200','localhost:9201','localhost:9202']
plugins.security.audit.config.index: auditlog6
plugins.security.audit.config.type: auditlog
plugins.security.audit.config.username: auditloguser
plugins.security.audit.config.password: auditlogpassword
plugins.security.audit.config.enable_ssl: false
plugins.security.audit.config.verify_hostnames: false
plugins.security.audit.config.enable_ssl_client_auth: false
plugins.security.audit.config.cert_alias: mycert
plugins.security.audit.config.pemkey_filepath: key.pem
plugins.security.audit.config.pemkey_content: <...pem base 64 content>
plugins.security.audit.config.pemkey_password: secret
plugins.security.audit.config.pemcert_filepath: cert.pem
plugins.security.audit.config.pemcert_content: <...pem base 64 content>
plugins.security.audit.config.pemtrustedcas_filepath: ca.pem
plugins.security.audit.config.pemtrustedcas_content: <...pem base 64 content>
#
# webhook settings
plugins.security.audit.config.webhook.url: "http://mywebhook/endpoint"
plugins.security.audit.config.webhook.format: JSON
plugins.security.audit.config.webhook.ssl.verify: false
plugins.security.audit.config.webhook.ssl.pemtrustedcas_filepath: ca.pem
plugins.security.audit.config.webhook.ssl.pemtrustedcas_content: <...pem base 64 content>
#
# log4j settings
plugins.security.audit.config.log4j.logger_name: auditlogger
plugins.security.audit.config.log4j.level: INFO
#
# Advanced configuration settings
plugins.security.authcz.impersonation_dn:
  "CN=spock,OU=client,O=client,L=Test,C=DE":
    - worf
  "cn=webuser,ou=IT,ou=IT,dc=company,dc=com":
    - user2
    - user1
plugins.security.authcz.rest_impersonation_user:
  "picard":
    - worf
  "john":
    - steve
    - martin

# If this is set to true OpenSearch Security will automatically initialize the configuration index
# with the files in the config directory if the index does not exist.
# WARNING: This will use well-known default passwords.
#          Use only in a private network/environment.
#plugins.security.allow_default_init_securityindex: false

# If this is set to true then allow to startup with demo certificates.
# These are certificates issued by floragunn GmbH for demo purposes.
# WARNING: This certificates are well known and therefore unsafe
#          Use only in a private network/environment.
#plugins.security.allow_unsafe_democertificates: false



# Password strength rules for password complexity. 
# If you want to set up password strength rules for internal users, you can use the below settings for it. 
# Password validation rules can be configured through regex. In the below regex example, a user must need 
# a password with minimum 8 characters length and must include minimum one uppercase, one lower case, one digit, and one special character. 
# And a custom error message can be configured, in case if a password is not created according to the password strength rule.   
# plugins.security.restapi.password_validation_regex: '(?=.*[A-Z])(?=.*[^a-zA-Z\d])(?=.*[0-9])(?=.*[a-z]).{8,}'
# plugins.security.restapi.password_validation_error_message: "A password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."


```




## Currently experimental feature settings

| Setting | Description |
| :--- | :--- |
| `opensearch.experimental.feature.replication_type.enabled` | Enables the index setting that allows for changing the replication type. |
| `opensearch.experimental.feature.remote_store.enabled` | Enables the index setting that allows for persisting data to remote store in addition to the local disk. |
| `opensearch.experimental.feature.searchable_snapshot.enabled` | Enables a new parameter for the snapshot restore API that allows for creation of a new index type, which searches a snapshot directly in a remote repository without restoring all index data to disk ahead of time. |
| `opensearch.experimental.feature.extensions.enabled` | Enables extensions to work with OpenSearch and extend application features of OpenSearch outside of the core. |
| `opensearch.experimental.feature.search_pipeline.enabled: false` | Enables configurable processors for search requests and search responses, similar to ingest pipelines. |


### Example settings for currently experimental features

```yml
opensearch.experimental.feature.replication_type.enabled: false
opensearch.experimental.feature.remote_store.enabled: false
opensearch.experimental.feature.searchable_snapshot.enabled: false
opensearch.experimental.feature.extensions.enabled: false
opensearch.experimental.feature.search_pipeline.enabled: false
```

