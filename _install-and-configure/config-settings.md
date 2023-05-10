---
layout: default
title: Configuration file settings
parent: Configuring OpenSearch
nav_order: 10
---

# Configuration file settings

Configuration file settings customize your distribution. They are contained in a number of different YAML files. Files and their associated settings are listed and described in the following tables.

## opensearch.yml

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


## opensearch_dashboards.yml

| Setting | Description |
| :--- | :--- |
| `server.port` | OpenSearch Dashboards is served by a back end server. This setting specifies the port to use. |
| `server.host` | Specifies the address to which the OpenSearch Dashboards server will bind. IP addresses and host names are both valid values. The default is `localhost`, which usually means remote machines will not be able to connect. To allow connections from remote users, set this parameter to a non-loopback address.|
| `s` | na|
| `s` | na|

