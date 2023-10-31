---
layout: default
title: Security plugin settings
parent: Configuring OpenSearch
nav_order: 20
---

# Security plugin settings

The `opensearch.yml` settings in the following tables apply specifically to the Security plugin.


## Common configuration

| Setting | Description |
| :--- | :--- |
| `plugins.security.nodes_dn` | Specifies a list of DNs which denote the other nodes in the cluster. This settings support wildcards and regular expressions. The list of DNs are also read from the security index **in addition** to the YAML configuration when `plugins.security.nodes_dn_dynamic_config_enabled` is `true`. |
| `plugins.security.nodes_dn_dynamic_config_enabled` | Relevant for cross_cluster usecases where there is a need to manage the whitelisted nodes_dn without having to restart the nodes every time a new cross_cluster remote is configured. Setting nodes_dn_dynamic_config_enabled to `true` enables **super-admin callable** Distinguished names APIs, which provide means to update/retrieve nodesdn dynamically. This setting only has effect if `plugins.security.cert.intercluster_request_evaluator_class` is not set. Default is `false`. |
| `plugins.security.authcz.admin_dn` | Defines the distinguished names (DNs) of certificates to which admin privileges should be assigned. Required. |
| `plugins.security.roles_mapping_resolution` | Defines how backend roles are mapped to Security roles. <br> <br> MAPPING_ONLY - mappings must be configured explicitly in roles_mapping.yml (default) <br> <br> BACKENDROLES_ONLY - backend roles are mapped to Security roles directly. Settings in roles_mapping.yml have no effect. <br> <br> BOTH - backend roles are mapped to Security roles mapped directly and via roles_mapping.yml in addition.  |
| `node.max_local_storage_nodes` | [More description needed-this setting may fit better in another category, such as "Advanced configuration".] |
| `plugins.security.dls.mode` | Sets the document level security (DLS) evaluation mode. By default, the setting is `adaptive`. See [How to set the DLS evaluation mode]({{site.url}}{{site.baseurl}}/security/access-control/document-level-security/#how-to-set-the-dls-evaluation-mode-in-opensearchyml). |
| `plugins.security.compliance.salt` | The salt to use when generating the hash value for field masking. Must be at least 32 characters. Only ASCII characters are allowed. Optional. |


## REST management API configuration

| Setting | Description |
| :--- | :--- |
| `plugins.security.restapi.roles_enabled` | Enables role based access to the REST management API for listed roles. Roles are separated by a comma. Default is that no role is allowed to access the REST management API (an empty list). See [Access control for the API]({{site.url}}{{site.baseurl}}/security/access-control/api/#access-control-for-the-api). |
| `plugins.security.restapi.endpoints_disabled.<role>.<endpoint>` | Disables specific endpoints and their HTTP methods for roles. Values for this setting compose an array of HTTP methods. For example: plugins.security.restapi.endpoints_disabled.all_access.ACTIONGROUPS: ["PUT","POST","DELETE"]. By default, all endpoints and methods are allowed. Existing endpoints include: ACTIONGROUPS, CACHE, CONFIG, ROLES, ROLESMAPPING, INTERNALUSERS, SYSTEMINFO, PERMISSIONSINFO, LICENSE. See [Access control for the API]({{site.url}}{{site.baseurl}}/security/access-control/api/#access-control-for-the-api). |
| `plugins.security.restapi.password_validation_regex` | Specify a regular expression (regex) to set the criteria for the login password. For more information, see [Password settings]({{site.url}}{{site.baseurl}}/security/configuration/yaml/#password-settings). |
| `plugins.security.restapi.password_validation_error_message` | Enter an error message that loads when a password doesn’t pass validation. This setting is used in conjunction with `plugins.security.restapi.password_validation_regex`. |
| `plugins.security.restapi.password_min_length` | Sets the minimum number of characters for the password length when using the score-based password strength estimator. The default is 8. This is also the minimum. For more information, see [Password settings]({{site.url}}{{site.baseurl}}/security/configuration/yaml/#password-settings). |
| `plugins.security.restapi.password_score_based_validation_strength` | Sets a threshold to determine whether the password is strong or weak. The options are `fair`, `good`, `strong`, `very_strong`. This setting is used in conjunction with `plugins.security.restapi.password_min_length`. |
| `plugins.security.unsupported.restapi.allow_securityconfig_modification` | Enables the use of the PUT and PATCH methods for the configuration APIs. |
| `plugins.security.restapi.endpoints_disabled.test-role.ROLES` | [More description needed] See [Access control for the API]({{site.url}}{{site.baseurl}}/security/access-control/api/#access-control-for-the-api). |
| `plugins.security.restapi.endpoints_disabled.test-role.INTERNALUSERS` | [More description needed] See [Access control for the API]({{site.url}}{{site.baseurl}}/security/access-control/api/#access-control-for-the-api). |


## Advanced configuration

| Setting | Description |
| :--- | :--- |
| `plugins.security.authcz.impersonation_dn` | Enables transport layer impersonation. This allows DNs (distinguished names) to impersonate as other users. See [User impersonation]({{site.url}}{{site.baseurl}}/security/access-control/impersonation/). |
| `plugins.security.authcz.rest_impersonation_user` | Enables REST layer impersonation. This allows users to impersonate as other users. See [User impersonation]({{site.url}}{{site.baseurl}}/security/access-control/impersonation/). |
| `plugins.security.allow_default_init_securityindex` | When set to `true`, OpenSearch Security will automatically initialize the configuration index with the files in the /config directory if the index does not exist. _This will use well-known default passwords. Use only in a private network/environment._ |
| `plugins.security.allow_unsafe_democertificates` | When set to `true`, OpenSearch starts up with demo certificates. These certificates are issued only for demo purposes. _These certificates are well known and therefore unsafe for production. Use only in a private network/environment._ |
| `plugins.security.system_indices.permissions.enabled` | Enables the system index permissions feature. When set to `true`, the feature is enabled and users with permission to modify roles can create roles that include permissions that grant access to system indexes. When set to `false`, the permission is disabled and only admins with an admin certificate can make changes to system indexes. By default, the permission is set to `false` in a new cluster. |


## Expert configuration

An expert setting should only be configured and deployed by an admin who understands the feature completely. Misunderstandings of a feature can lead to security risks or cause the Security plugin to not operate properly.

| Setting | Description |
| :--- | :--- |
| `plugins.security.config_index_name` | The name of the index where .opendistro_security stores its configuration. |
| `plugins.security.cert.oid` | This defines the OID of server node certificates. |
| `plugins.security.cert.intercluster_request_evaluator_class` | Specifies the implementation of org.opensearch.security.transport.InterClusterRequestEvaluator that is used to determine inter-cluster request. Instances of org.opensearch.security.transport.InterClusterRequestEvaluator must implement a single argument constructor that takes an org.opensearch.common.settings.Settings. [Not sure what this means. More description needed.] |
| `plugins.security.enable_snapshot_restore_privilege` | When set to `false`, this disables snapshot restore for normal users. In this case, only snapshot restore requests signed by an admin TLS certificate are accepted. By default (`true`), normal users can restore snapshots if they have the privileges 'cluster:admin/snapshot/restore', 'indices:admin/create', and 'indices:data/write/index' [They must have all of these?]. NOTE: A snapshot can only be restored when it does not contain global state and does not restore the '.opendistro_security' index. |
| `plugins.security.check_snapshot_restore_write_privileges` | When set to `false`, additional index checks are omitted. [This needs further explanation] |
| `plugins.security.cache.ttl_minutes` | Determines how long it takes for authentication caching to time out. The authentication cache helps speed up authentication by temporarily storing user objects returned from the backend so that the Security plugin is not required to make repeated requests for them. Set the value in minutes. The default is `60`. Disable caching by setting the value to `0`. |
| `plugins.security.disabled` | Disables OpenSearch Security. WARNING: This can expose your configuration (including passwords) to the public. |
| `plugins.security.protected_indices.enabled` | Set to `true` to enable protected indexes. Protected indexes are even more secure than normal indexes. These indexes require a role to access like any other traditional index, but they also require an additional role to be visible. This setting is used in conjunction with the `plugins.security.protected_indices.roles` and `plugins.security.protected_indices.indices` settings. |
| `plugins.security.protected_indices.roles` | Specifies a list of roles to which a user must be mapped to access protected indexes. [a user must be mapped to all roles in the list, if there are multiple?] |
| `plugins.security.protected_indices.indices` | Specifies a list of indexes to mark as protected. These indexes will only be visible to users mapped to the roles specified in `plugins.security.protected_indices.roles`. After this requirement is fulfilled, a user will still need to be mapped to the traditional role used to grant access permission to the index. |
| `plugins.security.system_indices.enabled` | Set to `true` to enable system indexes. System indexes are similar to the security index, except that the contents are not encrypted. Indexes configured as system indexes can be accessed by either a super-admin or a user with a role that includes the [system index permission]({{site.url}}{{site.baseurl}}/security/access-control/permissions/#system-index-permissions). For more information about system indexes, see [System indexes]({{site.url}}{{site.baseurl}}/security/configuration/system-indices/). |
| `plugins.security.system_indices.indices` | Enter a list of indexes to be used as system indexes. This setting is controlled by the `plugins.security.system_indices.enabled` setting. |


## Audit log configuration

| Setting | Description |
| :--- | :--- |
| `plugins.security.audit.enable_rest` | Enables or disables rest request logging. Default is `true`, enabled. |
| `plugins.security.audit.enable_transport` | Enables or disables transport request logging. Default is `false`, disabled. |
| `plugins.security.audit.resolve_bulk_requests` | Enable or disable bulk request logging. When enabled, all subrequests in bulk requests are also logged. The default is `false`, disabled. |
| `plugins.security.audit.config.disabled_categories` | Disables the specified event categories. |
| `plugins.security.audit.ignore_requests` | Excludes the specified requests from being logged. Allows wildcards, regex of actions, and REST request paths. |
| `plugins.security.audit.threadpool.size` | Determines the number of threads in the thread pool used to log events. Default is `10`. Setting this value to `0` disables the thread pool, which means the plugin logs events synchronously. |
| `plugins.security.audit.threadpool.max_queue_len` | Sets the maximum queue length per thread. Default is `100000`. |
| `plugins.security.audit.ignore_users` | An array of users. Audit requests from the users in the list will not be logged. |
| `plugins.security.audit.type` | The destination of audit log events. Options are `internal_opensearch`, `external_opensearch`, `debug`, and `webhook`. |
| `plugins.security.audit.config.http_endpoints` | Endpoints for `localhost`. |
| `plugins.security.audit.config.index` | The audit log index. The default is `auditlog6`. The index can be static or an index that includes a date so that it rotates on a daily basis. For example: `"'auditlog6-'YYYY.MM.dd"`. In both cases, make sure you secure the index properly. |
| `plugins.security.audit.config.type` | Specify the audit log type as `auditlog`. |
| `plugins.security.audit.config.username` | Username for the audit log configuration. [How does this differ from the admin's sign on?] |
| `plugins.security.audit.config.password` | Password for the audit log configuration. [How does this differ from the admin's sign on?] |
| `plugins.security.audit.config.enable_ssl` | Enables or disables SSL for audit logging. [More description needed] |
| `plugins.security.audit.config.verify_hostnames` | [More description needed] |
| `plugins.security.audit.config.enable_ssl_client_auth` | [More description needed] |
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
| `opendistro_security.audit.config.disabled_rest_categories` | [More description needed] |
| `opendistro_security.audit.config.disabled_transport_categories` | [More description needed] |


## Hostname verification and DNS lookup

For more information, see [Hostname verification and DNS lookup]({{site.url}}{{site.baseurl}}/security/configuration/tls/#advanced-hostname-verification-and-dns-lookup).

| Setting | Description |
| :--- | :--- |
| `plugins.security.ssl.transport.enforce_hostname_verification` | Whether to verify hostnames on the transport layer. Optional. Default is true. |
| `plugins.security.ssl.transport.resolve_hostname` | Whether to resolve hostnames against DNS on the transport layer. Optional. Default is true. Only works if hostname verification is also enabled. |


## Client authentication

For more information, see [Client authentication]({{site.url}}{{site.baseurl}}/security/configuration/tls/#advanced-client-authentication).

| Setting | Description |
| :--- | :--- |
| `plugins.security.ssl.http.clientauth_mode` | The TLS client authentication mode to use. Can be one of `NONE`, `OPTIONAL` (default) or `REQUIRE`. Optional. |


## Enabled ciphers and protocols

Values for these settings are expressed in an array. See [Enabled ciphers and protocols]({{site.url}}{{site.baseurl}}/security/configuration/tls/#advanced-enabled-ciphers-and-protocols) for more information.

| Setting | Description |
| :--- | :--- |
| `plugins.security.ssl.http.enabled_ciphers` | Enabled TLS cipher suites for the REST layer. Only Java format is supported. |
| `plugins.security.ssl.http.enabled_protocols` | Enabled TLS protocols for the REST layer. Only Java format is supported. |
| `plugins.security.ssl.transport.enabled_ciphers` | Enabled TLS cipher suites for the transport layer. Only Java format is supported. |
| `plugins.security.ssl.transport.enabled_protocols` | Enabled TLS protocols for the transport layer. Only Java format is supported. |


## Key store and trust store files--Transport layer TLS

see [Transport layer TLS]({{site.url}}{{site.baseurl}}/security/configuration/tls/#transport-layer-tls-1) for key store and trust store files.

| Setting | Description |
| :--- | :--- |
| `plugins.security.ssl.transport.keystore_type` | The type of the key store file, JKS or PKCS12/PFX. Optional. Default is JKS. |
| `plugins.security.ssl.transport.keystore_filepath` | Path to the key store file, which must be under the `config` directory, specified using a relative path. Required. |
| `plugins.security.ssl.transport.keystore_alias` | Alias name. Optional. Default is the first alias. |
| `plugins.security.ssl.transport.keystore_password` | Key store password. Default is `changeit`. |
| `plugins.security.ssl.transport.truststore_type` | The type of the trust store file, JKS or PKCS12/PFX. Default is JKS. |
| `plugins.security.ssl.transport.truststore_filepath` | Path to the trust store file, which must be under the `config` directory, specified using a relative path. Required. |
| `plugins.security.ssl.transport.truststore_alias` | Alias name. Optional. Default is all certificates. |
| `plugins.security.ssl.transport.truststore_password` | Trust store password. Default is `changeit`. |


## Key store and trust store files--REST layer TLS

For more information, see [REST layer TLS]({{site.url}}{{site.baseurl}}/security/configuration/tls/#rest-layer-tls-1).

| Setting | Description |
| :--- | :--- |
| `plugins.security.ssl.http.enabled` | Whether to enable TLS on the REST layer. If enabled, only HTTPS is allowed. Optional. Default is `false`. |
| `plugins.security.ssl.http.keystore_type` | The type of the key store file: JKS or PKCS12/PFX. Optional. Default is `JKS`. |
| `plugins.security.ssl.http.keystore_filepath` | Path to the key store file, which must be under the `config` directory, specified using a relative path. Required. |
| `plugins.security.ssl.http.keystore_alias` | Alias name. Optional. Default is the first alias. |
| `plugins.security.ssl.http.keystore_password` | Key store password. Default is `changeit`. |
| `plugins.security.ssl.http.truststore_type` | The type of the trust store file: JKS or PKCS12/PFX. Default is `JKS`. |
| `plugins.security.ssl.http.truststore_filepath` | Path to the trust store file, which must be under the `config` directory, specified using a relative path. Required. |
| `plugins.security.ssl.http.truststore_alias` | Alias name. Optional. Default is all certificates. |
| `plugins.security.ssl.http.truststore_password` | Trust store password. Default is `changeit`. |


## OpenSSL

For more information, see [OpenSSL]({{site.url}}{{site.baseurl}}/security/configuration/tls/#advanced-openssl).

| Setting | Description |
| :--- | :--- |
| `plugins.security.ssl.transport.enable_openssl_if_available` | Enable OpenSSL on the transport layer if available. Optional. Default is `true`. |
| `plugins.security.ssl.http.enable_openssl_if_available` | Enable OpenSSL on the REST layer if available. Optional. Default is `true`. |


## X.509 PEM certificates and PKCS #8 keys--Transport layer TLS

For more information, see [REST layer TLS]({{site.url}}{{site.baseurl}}/security/configuration/tls/#transport-layer-tls).

| Setting | Description |
| :--- | :--- |
| `plugins.security.ssl.transport.pemkey_filepath` | Path to the certificate's key file (PKCS \#8), which must be under the `config` directory, specified using a relative path. Required. |
| `plugins.security.ssl.transport.pemkey_password` | Key password. Omit this setting if the key has no password. Optional. |
| `plugins.security.ssl.transport.pemcert_filepath` | Path to the X.509 node certificate chain (PEM format), which must be under the `config` directory, specified using a relative path. Required. |
| `plugins.security.ssl.transport.pemtrustedcas_filepath` | Path to the root CAs (PEM format), which must be under the `config` directory, specified using a relative path. Required. |


## X.509 PEM certificates and PKCS #8 keys--REST layer TLS

For more information, see [REST layer TLS]({{site.url}}{{site.baseurl}}/security/configuration/tls/#rest-layer-tls).

| Setting | Description |
| :--- | :--- |
| `plugins.security.ssl.http.enabled` | Whether to enable TLS on the REST layer. If enabled, only HTTPS is allowed. Optional. Default is `false`. |
| `plugins.security.ssl.http.pemkey_filepath` | Path to the certificate’s key file (PKCS #8), which must be under the `config` directory, specified using a relative path. Required. |
| `plugins.security.ssl.http.pemkey_password` | Key password. Omit this setting if the key has no password. Optional. |
| `plugins.security.ssl.http.pemcert_filepath` | Path to the X.509 node certificate chain (PEM format), which must be under the `config` directory, specified using a relative path. Required. |
| `plugins.security.ssl.http.pemtrustedcas_filepath` | Path to the root CAs (PEM format), which must be under the config directory, specified using a relative path. Required. |


## Transport Layer Security
<!--- Not sure whether this is the best way to describe a category for these settings, and not sure whether they fit into a cohesive group of related settings. Need to solicit info from Security team that clarifies how these fit or don't fit with other TLS settings (above). Many of these descriptions need clarification (they came across very rough). --->

| Setting | Description |
| :--- | :--- |
| `plugins.security.ssl.transport.enabled` | Enables or disables SSL on the transport layer. |
| `plugins.security.ssl.transport.client.pemkey_password` | Password for the PEM formatted private key used by client. ?? |
| `plugins.security.ssl.transport.keystore_keypassword` | Provides the password for the key inside the key store. ?? |
| `plugins.security.ssl.transport.server.keystore_keypassword` | Provides the password for the key inside the server key store. ?? |
| `plugins.sercurity.ssl.transport.server.keystore_alias` | The alias name for the key store of the server. |
| `plugins.sercurity.ssl.transport.client.keystore_alias` | The alias name for the key store of the client. |
| `plugins.sercurity.ssl.transport.server.truststore_alias` | The alias name for the trust store of the server. |
| `plugins.sercurity.ssl.transport.client.truststore_alias` | The alias name for the trust store of the client. |
| `plugins.security.ssl.client.external_context_id` | Provides the transport client an ID for an external SSL context it should use. |
| `plugins.secuirty.ssl.transport.principal_extractor_class` | Passes a class implementing an extractor so a custom part of the certificate is used as the principal. |
| `plugins.security.ssl.http.crl.file_path` | A file path to a certificate revocation list file. |
| `plugins.security.ssl.http.crl.validate` | Enables CRL validation. |
| `plugins.security.ssl.http.crl.prefer_crlfile_over_ocsp` | Default is `false`. CRL certificate entry is preferred over OCSP entry if the certificate contains both. |
| `plugins.security.ssl.http.crl.check_only_end_entitites` | Default is `true`. When `true`, only leaf certificates are validated. |
| `plugins.security.ssl.http.crl.disable_ocsp` | Disables OSCP. |
| `plugins.security.ssl.http.crl.disable_crldp` | Default is `false`. Disables CRL endpoints in certificates. |
| `plugins.security.ssl.allow_client_initiated_renegotiation` | Enables or disables client renegotiation. |


### Other configuration settings
<!--- It's possible that these can go in another category above, such as "Advanced configuration". Some input from the Security team would be helpful with this question. --->

| Setting | Description |
| :--- | :--- |
| `plugins.security.allow_default_init_securityindex` | When set to `true`, sets the Security plugin to its default security settings if an attempt to create the security index fails when OpenSearch launches. Default security settings are stored in YAML files contained in the opensearch-project/security/config directory. By default, this setting is `false`. |
| `plugins.security.cert.intercluster_request_evaluator_class` | [More description needed] |
| `plugins.security.enable_snapshot_restore_privilege` | [More description needed] |
| `plugins.security.check_snapshot_restore_write_privileges` | [More description needed] |
| `config.dynamic.http.anonymous_auth_enabled` | [More description needed] <!--- Search Guard has a similar "legacy configuration" setting: `dynamic.http.anonymous_auth_enabled`. Our current security documentation mentions an `anonymous_auth_enabled` setting in the HTTP section of the `config.yml file. See issue #627: https://github.com/opensearch-project/documentation-website/issues/627. --->
| `opendistro_security_anonymous_backendrole` | [More description needed] <!--- Like the `anonymous_auth_enabled` setting above, this may be configured elsewhere now. Need clarification from Security team. See issue #627: https://github.com/opensearch-project/documentation-website/issues/627. --->


## Security plugin settings examples
<!--- another option for these section would be to simply add the example value in the description above where these are defined. It's beginning to feel like a better idea. Although, then, you wouldn't be able to express them in YAML format, and you miss the visual cues that could help a user understand proper formatting. --->

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
plugins.security.cert.intercluster_request_evaluator_class: # need example value for this.
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
plugins.security.audit.config.index: "'auditlog6-'2023.06.15"
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
# Webhook settings
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
plugins.security.allow_default_init_securityindex: false
plugins.security.allow_unsafe_democertificates: false
plugins.security.cache.ttl_minutes: 60
plugins.security.restapi.password_validation_regex: '(?=.*[A-Z])(?=.*[^a-zA-Z\d])(?=.*[0-9])(?=.*[a-z]).{8,}'
plugins.security.restapi.password_validation_error_message: "A password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
plugins.security.restapi.password_min_length: 8
plugins.security.restapi.password_score_based_validation_strength: very_strong
#
# Expert settings - use only if you understand their use completely: accidental values can potentially cause security risks or failures to OpenSearch Security.
plugins.security.config_index_name: .opendistro_security
plugins.security.cert.oid: '1.2.3.4.5.5'
plugins.security.cert.intercluster_request_evaluator_class: org.opensearch.security.transport.DefaultInterClusterRequestEvaluator
plugins.security.enable_snapshot_restore_privilege: true
plugins.security.check_snapshot_restore_write_privileges: true
plugins.security.cache.ttl_minutes: 60
plugins.security.disabled: false
plugins.security.protected_indices.enabled: true
plugins.security.protected_indices.roles: ['all_access']
plugins.security.protected_indices.indices: []
plugins.security.system_indices.enabled: true
plugins.security.system_indices.indices: ['.opendistro-alerting-config', '.opendistro-ism-*', '.opendistro-reports-*', '.opensearch-notifications-*', '.opensearch-notebooks', '.opensearch-observability', '.opendistro-asynchronous-search-response*', '.replication-metadata-store']

# these need example values:
plugins.security.ssl.transport.client.pemkey_password:
plugins.security.ssl.transport.keystore_keypassword:
plugins.security.ssl.transport.server.keystore_keypassword:
plugins.security.ssl.http.keystore_keypassword:
plugins.security.ssl.http.clientauth_mode:
plugins.security.ssl.transport.enabled:
plugins.sercurity.ssl.transport.server.keystore_alias:
plugins.sercurity.ssl.transport.client.keystore_alias:
plugins.sercurity.ssl.transport.server.truststore_alias:
plugins.sercurity.ssl.transport.client.truststore_alias:
plugins.security.ssl.client.external_context_id:
plugins.secuirty.ssl.transport.principal_extractor_class:
plugins.security.ssl.http.crl.file_path:
plugins.security.ssl.http.crl.validate:
plugins.security.ssl.http.crl.prefer_crlfile_over_ocsp:
plugins.security.ssl.http.crl.check_only_end_entitites:
plugins.security.ssl.http.crl.disable_ocsp:
plugins.security.ssl.http.crl.disable_crldp:
plugins.security.ssl.allow_client_initiated_renegotiation:
plugins.security.system_indices.enabled:
plugins.security.system_indices.indices:


```
<!--- These need example values  --->