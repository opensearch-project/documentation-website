---
layout: default
title: Security settings
parent: Configuring OpenSearch
nav_order: 40
---

# Security settings

The Security plugin provides a number of YAML configuration files that are used to store the necessary settings that define the way the Security plugin manages users, roles, and activity within the cluster. For a full list of the Security plugin configuration files, see [Modifying the YAML files]({{site.url}}{{site.baseurl}}/security/configuration/yaml/).

The following sections describe security-related settings in `opensearch.yml`. To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

## Common settings

The Security plugin supports the following common settings:

-  `plugins.security.nodes_dn` (Static): Specifies a list of distinguished names (DNs) that denote the other nodes in the cluster. This setting supports wildcards and regular expressions. The list of DNs are also read from the security index **in addition** to the YAML configuration when `plugins.security.nodes_dn_dynamic_config_enabled` is `true`.

- `plugins.security.nodes_dn_dynamic_config_enabled` (Static): Relevant for `cross_cluster` use cases where there is a need to manage the  allow listed `nodes_dn` without having to restart the nodes every time a new `cross_cluster` remote is configured.
  Setting `nodes_dn_dynamic_config_enabled` to `true` enables **super-admin callable** Distinguished Names APIs, which provide means to update or retrieve `nodes_dn` dynamically. This setting only has effect if `plugins.security.cert.intercluster_request_evaluator_class` is not set. Default is `false`.

- `plugins.security.authcz.admin_dn` (Static): Defines the DNs of certificates to which admin privileges should be assigned. Required.

- `plugins.security.roles_mapping_resolution` (Static): Defines how backend roles are mapped to Security roles.
        
    Valid values are:
    - `MAPPING_ONLY`(Default): Mappings must be configured explicitly in `roles_mapping.yml`.
    - `BACKENDROLES_ONLY`: Backend roles are mapped to security roles directly. Settings in `roles_mapping.yml` have no effect.
    - `BOTH`: Backend roles are mapped to security roles both directly and through `roles_mapping.yml`.

- `plugins.security.dls.mode` (Static): Sets the document-level security (DLS) evaluation mode. Default is `adaptive`. See [How to set the DLS evaluation mode]({{site.url}}{{site.baseurl}}/security/access-control/document-level-security/#how-to-set-the-dls-evaluation-mode-in-opensearchyml).

- `plugins.security.compliance.salt` (Static): The salt to use when generating the hash value for field masking. Must be at least 32 characters. Only ASCII characters are allowed. Optional.

- `config.dynamic.http.anonymous_auth_enabled` (Static): Enables anonymous authentication. This will cause all HTTP authenticators to not challenge. Default is `false`.

## REST management API settings

The Security plugin supports the following REST management API settings:

- `plugins.security.restapi.roles_enabled` (Static): Enables role-based access to the REST management API for listed roles. Roles are separated by a comma. Default is an empty list (no role is allowed to access the REST management API). See [Access control for the API]({{site.url}}{{site.baseurl}}/security/access-control/api/#access-control-for-the-api).

- `plugins.security.restapi.endpoints_disabled.<role>.<endpoint>` (Static): Disables specific endpoints and their HTTP methods for roles. Values for this setting compose an array of HTTP methods. For example: `plugins.security.restapi.endpoints_disabled.all_access.ACTIONGROUPS: ["PUT","POST","DELETE"]`. By default, all endpoints and methods are allowed. Existing endpoints include `ACTIONGROUPS`, `CACHE`, `CONFIG`, `ROLES`, `ROLESMAPPING`, `INTERNALUSERS`, `SYSTEMINFO`, `PERMISSIONSINFO`, and `LICENSE`. See [Access control for the API]({{site.url}}{{site.baseurl}}/security/access-control/api/#access-control-for-the-api).

- `plugins.security.restapi.password_validation_regex` (Static): Specifies a regular expression to set the criteria for the login password. For more information, see [Password settings]({{site.url}}{{site.baseurl}}/security/configuration/yaml/#password-settings).

- `plugins.security.restapi.password_validation_error_message` (Static): Specifies an error message that loads when a password doesn’t pass validation. This setting is used in conjunction with `plugins.security.restapi.password_validation_regex`.

- `plugins.security.restapi.password_min_length` (Static): Sets the minimum number of characters for the password length when using the score-based password strength estimator. The default is 8. This is also the minimum. For more information, see [Password settings]({{site.url}}{{site.baseurl}}/security/configuration/yaml/#password-settings).

- `plugins.security.restapi.password_score_based_validation_strength` (Static): Sets a threshold to determine whether the password is strong or weak. Valid values are `fair`, `good`, `strong`, and `very_strong`. This setting is used in conjunction with `plugins.security.restapi.password_min_length`.

- `plugins.security.unsupported.restapi.allow_securityconfig_modification` (Static): Enables the use of the PUT and PATCH methods for the configuration APIs.

## Advanced settings

The Security plugin supports the following advanced settings:

- `plugins.security.authcz.impersonation_dn` (Static): Enables transport layer impersonation. This allows DNs to impersonate as other users. See [User impersonation]({{site.url}}{{site.baseurl}}/security/access-control/impersonation/).

- `plugins.security.authcz.rest_impersonation_user` (Static): Enables REST layer impersonation. This allows users to impersonate as other users. See [User impersonation]({{site.url}}{{site.baseurl}}/security/access-control/impersonation/).

- `plugins.security.allow_default_init_securityindex` (Static): When set to `true`, OpenSearch Security will automatically initialize the configuration index with the files in the `/config` directory if the index does not exist.

  This will use well-known default passwords. Use only in a private network/environment.
  {: .warning}

- `plugins.security.allow_unsafe_democertificates` (Static): When set to `true`, OpenSearch starts up with demo certificates. These certificates are issued only for demo purposes.

  These certificates are well known and therefore unsafe for production. Use only in a private network/environment.
  {: .warning}

- `plugins.security.system_indices.permission.enabled` (Static): Enables the system index permissions feature. When set to `true`, the feature is enabled and users with permission to modify roles can create roles that include permissions that grant access to system indexes. When set to `false`, the permission is disabled and only admins with an admin certificate can make changes to system indexes. By default, the permission is set to `false` in a new cluster.

## Expert-level settings

An expert-level setting should only be configured and deployed by an admin who understands the feature completely. Misunderstandings of a feature can lead to security risks, cause the Security plugin to not operate properly, or cause data loss.
{: .warning}

The Security plugin supports the following expert-level settings:

- `plugins.security.config_index_name` (Static): The name of the index where `.opendistro_security` stores its configuration.

- `plugins.security.cert.oid` (Static): Defines the Object Identifier (OID) of server node certificates.

- `plugins.security.cert.intercluster_request_evaluator_class` (Static): Specifies the implementation of `org.opensearch.security.transport.InterClusterRequestEvaluator` that is used to evaluate intercluster requests. Instances of `org.opensearch.security.transport.InterClusterRequestEvaluator` must implement a single-argument constructor that takes an `org.opensearch.common.settings.Settings` object.

- `plugins.security.enable_snapshot_restore_privilege` (Static): When set to `false`, this setting disables snapshot restore for regular users. In this case, only snapshot restore requests signed by an admin TLS certificate are accepted. When set to `true` (default), regular users can restore snapshots if they have the `cluster:admin/snapshot/restore`, `indices:admin/create`, and `indices:data/write/index` privileges.

  A snapshot can only be restored when it does not contain global state and does not restore the `.opendistro_security` index.
  {: .note}

- `plugins.security.check_snapshot_restore_write_privileges` (Static): When set to `false`, additional index checks are omitted. When set to the default of `true`, attempts to restore snapshots are evaluated for `indices:admin/create` and `"indices:data/write/index`.

- `plugins.security.cache.ttl_minutes` (Static): Determines how long it takes for authentication caching to time out. The authentication cache helps speed up authentication by temporarily storing user objects returned from the backend so that the Security plugin is not required to make repeated requests for them. Set the value in minutes. The default is `60`. Disable caching by setting the value to `0`.

- `plugins.security.disabled` (Static): Disables OpenSearch Security.

  Disabling this plugin can expose your configuration (including passwords) to the public.
  {:warning}

- `plugins.security.protected_indices.enabled` (Static): If set to `true`, enables protected indexes. Protected indexes are even more secure than regular indexes. These indexes require a role to access like any other traditional index and require an additional role to be visible. This setting is used in conjunction with the `plugins.security.protected_indices.roles` and `plugins.security.protected_indices.indices` settings.

- `plugins.security.protected_indices.roles` (Static): Specifies a list of roles to which a user must be mapped to access protected indexes.

- `plugins.security.protected_indices.indices` (Static): Specifies a list of indexes to mark as protected. These indexes will only be visible to users mapped to the roles specified in `plugins.security.protected_indices.roles`. After this requirement is fulfilled, a user will still need to be mapped to the traditional role used to grant access permission to the index.

- `plugins.security.system_indices.enabled` (Static): If set to `true`, enables system indexes. System indexes are similar to the security index, except that the contents are not encrypted. Indexes configured as system indexes can be accessed by either a super-admin or a user with a role that includes the [system index permission]({{site.url}}{{site.baseurl}}/security/access-control/permissions/#system-index-permissions). For more information about system indexes, see [System indexes]({{site.url}}{{site.baseurl}}/security/configuration/system-indices/).

- `plugins.security.system_indices.indices` (Static): A list of indexes to be used as system indexes. This setting is controlled by the `plugins.security.system_indices.enabled` setting.

- `plugins.security.allow_default_init_securityindex` (Static): When set to `true`, sets the Security plugin to its default security settings if an attempt to create the security index fails when OpenSearch launches. Default security settings are stored in YAML files contained in the `opensearch-project/security/config` directory. Default is `false`.

- `plugins.security.cert.intercluster_request_evaluator_class` (Static): A class to be used for evaluating intercluster communication.

- `plugins.security.enable_snapshot_restore_privilege` (Static): Enables granting the snapshot restore privilege. Optional. Default is `true`.

- `plugins.security.check_snapshot_restore_write_privileges` (Static): Enforces write privilege evaluation when creating snapshots. Default is `true`.

## Audit log settings

The Security plugin supports the following audit log settings:

- `plugins.security.audit.enable_rest` (Dynamic): Enables or disables REST request logging. Default is `true` (enable).

- `plugins.security.audit.enable_transport` (Dynamic): Enables or disables transport-level request logging. Default is `false` (disable).

- `plugins.security.audit.resolve_bulk_requests` (Dynamic): Enable or disable bulk request logging. When enabled, all subrequests in bulk requests are also logged. Default is `false` (disabled).

- `plugins.security.audit.config.disabled_categories` (Dynamic): Disables the specified event categories.

- `plugins.security.audit.ignore_requests` (Dynamic): Excludes the specified requests from being logged. Allows wildcards and regular expressions containing actions or REST request paths.

- `plugins.security.audit.threadpool.size` (Static): Determines the number of threads in the thread pool used to log events. Default is `10`. Setting this value to `0` disables the thread pool, which means the plugin logs events synchronously.

- `plugins.security.audit.threadpool.max_queue_len` (Static): Sets the maximum queue length per thread. Default is `100000`.

- `plugins.security.audit.ignore_users` (Dynamic): An array of users. Audit requests from the users in the list will not be logged.

- `plugins.security.audit.type` (Static): The destination of audit log events. Valid values are `internal_opensearch`, `external_opensearch`, `debug`, and `webhook`.

- `plugins.security.audit.config.http_endpoints` (Static): A list of endpoints for `localhost`.

- `plugins.security.audit.config.index` (Static): The audit log index. The default is `auditlog6`. The index can be static or an index that includes a date so that it rotates on a daily basis, for example, `"'auditlog6-'YYYY.MM.dd"`. In either case, make sure to secure the index properly.

- `plugins.security.audit.config.type` (Static): Specify the audit log type as `auditlog`.

- `plugins.security.audit.config.username` (Static): Username for the audit log configuration.

- `plugins.security.audit.config.password` (Static): Password for the audit log configuration.

- `plugins.security.audit.config.enable_ssl` (Static): Enables or disables SSL for audit logging.

- `plugins.security.audit.config.verify_hostnames` (Static): Enables or disables verification of the hostname for SSL/TLS certificates. Default is `true` (enabled).

- `plugins.security.audit.config.enable_ssl_client_auth` (Static): Enables or disables SSL/TLS client authentication. Default is `false` (disabled).

- `plugins.security.audit.config.cert_alias` (Static): An alias to the certificate used for audit log access.

- `plugins.security.audit.config.pemkey_filepath` (Static): The `/config` relative file path to the Privacy Enhanced Mail (PEM) key used for audit logging.

- `plugins.security.audit.config.pemkey_content` (Static): The base64-encoded content of the PEM key used for audit logging. This is an alternative to `...config.pemkey_filepath`.

- `plugins.security.audit.config.pemkey_password` (Static): Password for the PEM-formatted private key used by the client.

- `plugins.security.audit.config.pemcert_filepath` (Static): The `/config` relative file path to the PEM certificate used for audit logging.

- `plugins.security.audit.config.pemcert_content` (Static): The base64-encoded content of the PEM certificate used for audit logging. This is an alternative to specifying the file path with `...config.pemcert_filepath`.

- `plugins.security.audit.config.pemtrustedcas_filepath` (Static): The `/config` relative filepath to trusted root certificate authority.

- `plugins.security.audit.config.pemtrustedcas_content` (Static): The base64-encoded content of the root certificate authority. This is an alternative to `...config.pemtrustedcas_filepath`.

- `plugins.security.audit.config.webhook.url` (Static): The webhook URL.

- `plugins.security.audit.config.webhook.format` (Static): The format used for the webhook. Valid values are `URL_PARAMETER_GET`, `URL_PARAMETER_POST`, `TEXT`, `JSON`, and `SLACK`.

- `plugins.security.audit.config.webhook.ssl.verify` (Static): Enables or disables verification of any SSL/TLS certificates sent with any webhook request. Default is `true` (enabled).

- `plugins.security.audit.config.webhook.ssl.pemtrustedcas_filepath` (Static): The `/config` relative file path to trusted certificate authority against which webhook requests are verified.

- `plugins.security.audit.config.webhook.ssl.pemtrustedcas_content` (Static): The base64-encoded content of the certificate authority used to verify webhook requests. This is an alternative to `...config.pemtrustedcas_filepath`.

- `plugins.security.audit.config.log4j.logger_name` (Static): A custom name for the Log4j logger.

- `plugins.security.audit.config.log4j.level` (Static): Provides a default log level for the Log4j logger. Valid values are `OFF`, `FATAL`, `ERROR`, `WARN`, `INFO`, `DEBUG`, `TRACE`, and `ALL`. Default is `INFO`. 

- `opendistro_security.audit.config.disabled_rest_categories` (Dynamic): A list of REST categories to be ignored by the logger. Valid values are `AUTHENTICATED` and `GRANTED_PRIVILEGES`.

- `opendistro_security.audit.config.disabled_transport_categories` (Dynamic): A list of transport layer categories to be ignored by the logger. Valid values are `AUTHENTICATED` and `GRANTED_PRIVILEGES`.

## Hostname verification and DNS lookup settings

The Security plugin supports the following hostname verification and DNS lookup settings:

- `plugins.security.ssl.transport.enforce_hostname_verification` (Static): Whether to verify hostnames on the transport layer. Optional. Default is `true`.

- `plugins.security.ssl.transport.resolve_hostname` (Static): Whether to resolve hostnames against DNS on the transport layer. Optional. Default is `true`. Only works if hostname verification is enabled.

For more information, see [Hostname verification and DNS lookup]({{site.url}}{{site.baseurl}}/security/configuration/tls/#advanced-hostname-verification-and-dns-lookup).

## Client authentication settings

The Security plugin supports the following client authentication setting:

- `plugins.security.ssl.http.clientauth_mode` (Static): The TLS client authentication mode to use. Valid values are `OPTIONAL` (default), `REQUIRE`, and `NONE`. Optional.

For more information, see [Client authentication]({{site.url}}{{site.baseurl}}/security/configuration/tls/#advanced-client-authentication).

## Enabled cipher and protocol settings

The Security plugin supports the following enabled cipher and protocol settings. Each setting must be expressed in an array:

- `plugins.security.ssl.http.enabled_ciphers` (Static): Enabled TLS cipher suites for the REST layer. Only Java format is supported.

- `plugins.security.ssl.http.enabled_protocols` (Static): Enabled TLS protocols for the REST layer. Only Java format is supported.

- `plugins.security.ssl.transport.enabled_ciphers` (Static): Enabled TLS cipher suites for the transport layer. Only Java format is supported.

- `plugins.security.ssl.transport.enabled_protocols` (Static): Enabled TLS protocols for the transport layer. Only Java format is supported.

For more information, see [Enabled ciphers and protocols]({{site.url}}{{site.baseurl}}/security/configuration/tls/#advanced-enabled-ciphers-and-protocols).

## Key store and trust store files---transport layer TLS settings

The Security plugin supports the following transport layer TLS key store and trust store settings:

- `plugins.security.ssl.transport.keystore_type` (Static): The type of the key store file. Optional. Valid values are `JKS` or `PKCS12/PFX`. Default is `JKS`.

- `plugins.security.ssl.transport.keystore_filepath` (Static): The path to the key store file, which must be under the `config` directory, specified using a relative path. Required.

- `plugins.security.ssl.transport.keystore_alias` (Static): The key store alias name. Optional. Default is the first alias.

- `plugins.security.ssl.transport.keystore_password` (Static): The key store password. Default is `changeit`.

- `plugins.security.ssl.transport.truststore_type` (Static): The type of the trust store file. Optional. Valid values are `JKS` or `PKCS12/PFX`. Default is `JKS`.

- `plugins.security.ssl.transport.truststore_filepath` (Static): The path to the trust store file, which must be under the `config` directory, specified using a relative path. Required.

- `plugins.security.ssl.transport.truststore_alias` (Static): The trust store alias name. Optional. Default is all certificates.

- `plugins.security.ssl.transport.truststore_password` (Static): The trust store password. Default is `changeit`.

For more information about key store and trust store files, see [Transport layer TLS]({{site.url}}{{site.baseurl}}/security/configuration/tls/#transport-layer-tls-1).

## Key store and trust store files---REST layer TLS settings

The Security plugin supports the following REST layer TLS key store and trust store settings:

- `plugins.security.ssl.http.enabled` (Static): Whether to enable TLS on the REST layer. If enabled, only HTTPS is allowed. Optional. Default is `false`.

- `plugins.security.ssl.http.keystore_type` (Static): The type of the key store file. Optional. Valid values are `JKS` or `PKCS12/PFX`. Default is `JKS`.

- `plugins.security.ssl.http.keystore_filepath` (Static): The path to the key store file, which must be under the `config` directory, specified using a relative path. Required.

- `plugins.security.ssl.http.keystore_alias` (Static):  The key store alias name. Optional. Default is the first alias.

- `plugins.security.ssl.http.keystore_password`: The key store password. Default is `changeit`.

- `plugins.security.ssl.http.truststore_type`: The type of the trust store file. Optional. Valid values are `JKS` or `PKCS12/PFX`. Default is `JKS`.

- `plugins.security.ssl.http.truststore_filepath`: The path to the trust store file, which must be under the `config` directory, specified using a relative path. Required.

- `plugins.security.ssl.http.truststore_alias` (Static): The trust store alias name. Optional. Default is all certificates.

- `plugins.security.ssl.http.truststore_password` (Static): The trust store password. Default is `changeit`.

For more information, see [REST layer TLS]({{site.url}}{{site.baseurl}}/security/configuration/tls/#rest-layer-tls-1).

## OpenSSL settings

The Security plugin supports the following OpenSSL settings:

- `plugins.security.ssl.transport.enable_openssl_if_available` (Static): Enables OpenSSL on the transport layer if available. Optional. Default is `true`.

- `plugins.security.ssl.http.enable_openssl_if_available` (Static): Enables OpenSSL on the REST layer if available. Optional. Default is `true`.

For more information, see [OpenSSL]({{site.url}}{{site.baseurl}}/security/configuration/tls/#advanced-openssl).

## X.509 PEM certificates and PKCS #8 keys---transport layer TLS settings

The Security plugin supports the following transport layer TLS settings related to X.509 PEM certificates and PKCS #8 keys:

- `plugins.security.ssl.transport.pemkey_filepath` (Static): The path to the certificate's key file (PKCS #8), which must be under the `config` directory, specified using a relative path. Required.

- `plugins.security.ssl.transport.pemkey_password` (Static): The key password. Omit this setting if the key has no password. Optional.

- `plugins.security.ssl.transport.pemcert_filepath` (Static): The path to the X.509 node certificate chain (PEM format), which must be under the `config` directory, specified using a relative path. Required.

- `plugins.security.ssl.transport.pemtrustedcas_filepath` (Static): The path to the root certificate authorities (PEM format), which must be under the `config` directory, specified using a relative path. Required.

For more information, see [REST layer TLS]({{site.url}}{{site.baseurl}}/security/configuration/tls/#transport-layer-tls).

## X.509 PEM certificates and PKCS #8 keys---REST layer TLS settings

The Security plugin supports the following REST layer TLS settings related to X.509 PEM certificates and PKCS #8 keys:

- `plugins.security.ssl.http.enabled` (Static): Whether to enable TLS on the REST layer. If enabled, only HTTPS is allowed. Optional. Default is `false`.

- `plugins.security.ssl.http.pemkey_filepath` (Static): The path to the certificate’s key file (PKCS #8), which must be under the `config` directory, specified using a relative path. Required.

- `plugins.security.ssl.http.pemkey_password` (Static): The key password. Omit this setting if the key has no password. Optional.

- `plugins.security.ssl.http.pemcert_filepath` (Static): The path to the X.509 node certificate chain (PEM format), which must be under the `config` directory, specified using a relative path. Required.

-  `plugins.security.ssl.http.pemtrustedcas_filepath`: The path to the root certificate authorities (PEM format), which must be under the config directory, specified using a relative path. Required.

For more information, see [REST layer TLS]({{site.url}}{{site.baseurl}}/security/configuration/tls/#rest-layer-tls).

## Transport layer security settings

The Security plugin supports the following transport layer security settings:

- `plugins.security.ssl.transport.enabled` (Static): Whether to enable TLS on the REST layer.

- `plugins.security.ssl.transport.client.pemkey_password` (Static): The password for the PEM-formatted private key used by the transport client.

- `plugins.security.ssl.transport.keystore_keypassword` (Static): The password for the key inside the key store.

- `plugins.security.ssl.transport.server.keystore_keypassword` (Static): The password for the key inside the server key store.

- `plugins.sercurity.ssl.transport.server.keystore_alias` (Static): The alias name for the key store of the server.

- `plugins.sercurity.ssl.transport.client.keystore_alias` (Static): The alias name for the key store of the client.

- `plugins.sercurity.ssl.transport.server.truststore_alias` (Static): The alias name for the trust store of the server.

- `plugins.sercurity.ssl.transport.client.truststore_alias` (Static): The alias name for the trust store of the client.

- `plugins.security.ssl.client.external_context_id` (Static): Provides the transport client an ID to use for an external SSL context.

- `plugins.secuirty.ssl.transport.principal_extractor_class` (Static): Specifies a class implementing an extractor so a custom part of the certificate is used as the principal.

- `plugins.security.ssl.http.crl.file_path` (Static): A file path to a certificate revocation list file.

- `plugins.security.ssl.http.crl.validate` (Static): Enables certificate revocation list (CRL) validation. Default is `false` (disabled).

- `plugins.security.ssl.http.crl.prefer_crlfile_over_ocsp` (Static): Whether to prefer the CRL certificate entry over the Online Certificate Status Protocol (OCSP) entry if the certificate contains both. Optional. Default is `false`.

- `plugins.security.ssl.http.crl.check_only_end_entitites` (Static): When `true`, only leaf certificates are validated. Default is `true`.

- `plugins.security.ssl.http.crl.disable_ocsp` (Static): Disables OCSP. Default is `false` (OCSP is enabled).  

- `plugins.security.ssl.http.crl.disable_crldp` (Static): Disables CRL endpoints in certificates. Default is `false` (CRL endpoints are enabled).

- `plugins.security.ssl.allow_client_initiated_renegotiation` (Static): Enables or disables client renegotiation. Default is `false` (client initiated renegotiation is not allowed). 

## Security plugin settings examples

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
# Advanced SSL settings - use only if you understand SSL ins and outs
plugins.security.ssl.transport.client.pemkey_password: superSecurePassword1
plugins.security.ssl.transport.keystore_keypassword: superSecurePassword2
plugins.security.ssl.transport.server.keystore_keypassword: superSecurePassword3
plugins.security.ssl.http.keystore_keypassword: superSecurePassword4
plugins.security.ssl.http.clientauth_mode: REQUIRE
plugins.security.ssl.transport.enabled: true
plugins.security.ssl.transport.server.keystore_alias: my_alias
plugins.security.ssl.transport.client.keystore_alias: my_other_alias
plugins.security.ssl.transport.server.truststore_alias: trustore_alias_1
plugins.security.ssl.transport.client.truststore_alias: trustore_alias_2
plugins.security.ssl.client.external_context_id: my_context_id
plugins.security.ssl.transport.principal_extractor_class: org.opensearch.security.ssl.ExampleExtractor
plugins.security.ssl.http.crl.file_path: ssl/crl/revoked.crl
plugins.security.ssl.http.crl.validate: true
plugins.security.ssl.http.crl.prefer_crlfile_over_ocsp: true
plugins.security.ssl.http.crl.check_only_end_entitites: false
plugins.security.ssl.http.crl.disable_ocsp: true
plugins.security.ssl.http.crl.disable_crldp: true
plugins.security.ssl.allow_client_initiated_renegotiation: true
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
```
{% include copy.html %}
