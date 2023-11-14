---
layout: default
title: Modifying the YAML files
parent: Configuration
nav_order: 10
redirect_from: 
  - /security-plugin/configuration/yaml/
---

# Modifying the YAML files

The Security installation provides a number of YAML configuration files that are used to store the necessary settings that define the way the Security plugin manages users, roles, and activity within the cluster. These settings range from configurations for authentication backends to lists of allowed endpoints and HTTP requests. 

Before running [`securityadmin.sh`]({{site.url}}{{site.baseurl}}/security/configuration/security-admin/) to load the settings into the `.opendistro_security` index, perform an initial configuration of the YAML files. The files can be found in the `config/opensearch-security` directory. It's also good practice to back up these files so that you can reuse them for other clusters.

The approach we recommend for using the YAML files is to first configure [reserved and hidden resources]({{site.url}}{{site.baseurl}}/security/access-control/api#reserved-and-hidden-resources), such as the `admin` and `kibanaserver` users. Thereafter you can create other users, roles, mappings, action groups, and tenants using OpenSearch Dashboards or the REST API.


## internal_users.yml

This file contains any initial users that you want to add to the Security plugin's internal user database.

The file format requires a hashed password. To generate one, run `plugins/opensearch-security/tools/hash.sh -p <new-password>`. If you decide to keep any of the demo users, *change their passwords* and re-run [securityadmin.sh]({{site.url}}{{site.baseurl}}/security/configuration/security-admin/) to apply the new passwords.

```yml
---
# This is the internal user database
# The hash value is a bcrypt hash and can be generated with plugin/tools/hash.sh

_meta:
  type: "internalusers"
  config_version: 2

# Define your internal users here
new-user:
  hash: "$2y$12$88IFVl6IfIwCFh5aQYfOmuXVL9j2hz/GusQb35o.4sdTDAEMTOD.K"
  reserved: false
  hidden: false
  opendistro_security_roles:
  - "specify-some-security-role-here"
  backend_roles:
  - "specify-some-backend-role-here"
  attributes:
    attribute1: "value1"
  static: false

## Demo users

admin:
  hash: "$2a$12$VcCDgh2NDk07JGN0rjGbM.Ad41qVR/YFJcgHp0UGns5JDymv..TOG"
  reserved: true
  backend_roles:
  - "admin"
  description: "Demo admin user"

kibanaserver:
  hash: "$2a$12$4AcgAt3xwOWadA5s5blL6ev39OXDNhmOesEoo33eZtrq2N0YrU3H."
  reserved: true
  description: "Demo user for the OpenSearch Dashboards server"

kibanaro:
  hash: "$2a$12$JJSXNfTowz7Uu5ttXfeYpeYE0arACvcwlPBStB1F.MI7f0U9Z4DGC"
  reserved: false
  backend_roles:
  - "kibanauser"
  - "readall"
  attributes:
    attribute1: "value1"
    attribute2: "value2"
    attribute3: "value3"
  description: "Demo read-only user for OpenSearch dashboards"

logstash:
  hash: "$2a$12$u1ShR4l4uBS3Uv59Pa2y5.1uQuZBrZtmNfqB3iM/.jL0XoV9sghS2"
  reserved: false
  backend_roles:
  - "logstash"
  description: "Demo logstash user"

readall:
  hash: "$2a$12$ae4ycwzwvLtZxwZ82RmiEunBbIPiAmGZduBAjKN0TXdwQFtCwARz2"
  reserved: false
  backend_roles:
  - "readall"
  description: "Demo readall user"

snapshotrestore:
  hash: "$2y$12$DpwmetHKwgYnorbgdvORCenv4NAK8cPUg8AI6pxLCuWf/ALc0.v7W"
  reserved: false
  backend_roles:
  - "snapshotrestore"
  description: "Demo snapshotrestore user"
```

## opensearch.yml

In addition to many OpenSearch settings, this file contains paths to TLS certificates and their attributes, such as distinguished names and trusted certificate authorities.

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
```

For a full list of `opensearch.yml` Security plugin settings, see [Security settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/).
{: .note}

### Refining your configuration

The `plugins.security.allow_default_init_securityindex` setting, when set to `true`, sets the Security plugin to its default security settings if an attempt to create the security index fails when OpenSearch launches. Default security settings are stored in YAML files contained in the `opensearch-project/security/config` directory. By default, this setting is `false`.

```yml
plugins.security.allow_default_init_securityindex: true
```

An authentication cache for the Security plugin exists to help speed up authentication by temporarily storing user objects returned from the backend so that the Security plugin is not required to make repeated requests for them. To determine how long it takes for caching to time out, you can use the `plugins.security.cache.ttl_minutes` property to set a value in minutes. The default is `60`. You can disable caching by setting the value to `0`.

```yml
plugins.security.cache.ttl_minutes: 60
```

### Enabling user access to system indexes

Mapping a system index permission to a user allows that user to modify the system index specified in the permission's name (the one exception is the Security plugin's [system index]({{site.url}}{{site.baseurl}}/security/configuration/system-indices/)). The `plugins.security.system_indices.permissions.enabled` setting provides a way for administrators to make this permission available for or hidden from role mapping.

When set to `true`, the feature is enabled and users with permission to modify roles can create roles that include permissions that grant access to system indexes:

```yml
plugins.security.system_indices.permissions.enabled: true
```

When set to `false`, the permission is disabled and only admins with an admin certificate can make changes to system indexes. By default, the permission is set to `false` in a new cluster.

To learn more about system index permissions, see [System index permissions]({{site.url}}{{site.baseurl}}/security/access-control/permissions/#system-index-permissions).


### Password settings

If you want to run your users' passwords against some validation, specify a regular expression (regex) in this file. You can also include an error message that loads when passwords don't pass validation. The following example demonstrates how to include a regex so OpenSearch requires new passwords to be a minimum of eight characters with at least one uppercase, one lowercase, one digit, and one special character.

Note that OpenSearch validates only users and passwords created through OpenSearch Dashboards or the REST API.

```yml
plugins.security.restapi.password_validation_regex: '(?=.*[A-Z])(?=.*[^a-zA-Z\d])(?=.*[0-9])(?=.*[a-z]).{8,}'
plugins.security.restapi.password_validation_error_message: "Password must be minimum 8 characters long and must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
```

In addition, a score-based password strength estimator allows you to set a threshold for password strength when creating a new internal user or updating a user's password. This feature makes use of the [zxcvbn library](https://github.com/dropbox/zxcvbn) to apply a policy that emphasizes a password's complexity rather than its capacity to meet traditional criteria such as uppercase keys, numerals, and special characters.

For information about creating users, see [Create users]({{site.url}}{{site.baseurl}}/security/access-control/users-roles/#create-users).

This feature is not compatible with users specified as reserved. For information about reserved resources, see [Reserved and hidden resources]({{site.url}}{{site.baseurl}}/security/access-control/api#reserved-and-hidden-resources).
{: .important }

Score-based password strength requires two settings to configure the feature. The following table describes the two settings.

| Setting | Description |
| :--- | :--- |
| `plugins.security.restapi.password_min_length` | Sets the minimum number of characters for the password length. The default is `8`. This is also the minimum. |
| `plugins.security.restapi.password_score_based_validation_strength` | Sets a threshold to determine whether the password is strong or weak. There are four values that represent a threshold's increasing complexity.<br>`fair`--A very "guessable" password: provides protection from throttled online attacks.<br>`good`--A somewhat guessable password: provides protection from unthrottled online attacks.<br>`strong`--A safely "unguessable" password: provides moderate protection from an offline, slow-hash scenario.<br>`very_strong`--A very unguessable password: provides strong protection from an offline, slow-hash scenario. |

The following example shows the settings configured for the `opensearch.yml` file and enabling a password with a minimum of 10 characters and a threshold requiring the highest strength:

```yml
plugins.security.restapi.password_min_length: 10
plugins.security.restapi.password_score_based_validation_strength: very_strong
```

When you try to create a user with a password that doesn't reach the specified threshold, the system generates a "weak password" warning, indicating that the password needs to be modified before you can save the user. 

The following example shows the response from the [Create user]({{site.url}}{{site.baseurl}}/security/access-control/api/#create-user) API when the password is weak:

```json
{
  "status": "error",
  "reason": "Weak password"
}
```

## allowlist.yml

You can use `allowlist.yml` to add any endpoints and HTTP requests to a list of allowed endpoints and requests. If enabled, all users except the super admin are allowed access to only the specified endpoints and HTTP requests, and all other HTTP requests associated with the endpoint are denied. For example, if GET `_cluster/settings` is added to the allow list, users cannot submit PUT requests to `_cluster/settings` to update cluster settings.

Note that while you can configure access to endpoints this way, for most cases, it is still best to configure permissions using the Security plugin's users and roles, which have more granular settings.

```yml
---
_meta:
  type: "allowlist"
  config_version: 2

# Description:
# enabled - feature flag.
# if enabled is false, all endpoints are accessible.
# if enabled is true, all users except the SuperAdmin can only submit the allowed requests to the specified endpoints.
# SuperAdmin can access all APIs.
# SuperAdmin is defined by the SuperAdmin certificate, which is configured with the opensearch.yml setting plugins.security.authcz.admin_dn:
# Refer to the example setting in opensearch.yml to learn more about configuring SuperAdmin.
#
# requests - map of allow listed endpoints and HTTP requests

#this name must be config
config:
  enabled: true
  requests:
    /_cluster/settings:
      - GET
    /_cat/nodes:
      - GET
```

To enable PUT requests to cluster settings, add PUT to the list of allowed operations under `/_cluster/settings`.

```yml
requests:
  /_cluster/settings:
    - GET
    - PUT
```

You can also add custom indexes to the allow list. `allowlist.yml` doesn't support wildcards, so you must manually specify all of the indexes you want to add.

```yml
requests: # Only allow GET requests to /sample-index1/_doc/1 and /sample-index2/_doc/1
  /sample-index1/_doc/1:
    - GET
  /sample-index2/_doc/1:
    - GET
```


## roles.yml

This file contains any initial roles that you want to add to the Security plugin. Aside from some metadata, the default file is empty, because the Security plugin has a number of static roles that it adds automatically.

```yml
---
complex-role:
  reserved: false
  hidden: false
  cluster_permissions:
  - "read"
  - "cluster:monitor/nodes/stats"
  - "cluster:monitor/task/get"
  index_permissions:
  - index_patterns:
    - "opensearch_dashboards_sample_data_*"
    dls: "{\"match\": {\"FlightDelay\": true}}"
    fls:
    - "~FlightNum"
    masked_fields:
    - "Carrier"
    allowed_actions:
    - "read"
  tenant_permissions:
  - tenant_patterns:
    - "analyst_*"
    allowed_actions:
    - "kibana_all_write"
  static: false
_meta:
  type: "roles"
  config_version: 2
```


## roles_mapping.yml

```yml
---
manage_snapshots:
  reserved: true
  hidden: false
  backend_roles:
  - "snapshotrestore"
  hosts: []
  users: []
  and_backend_roles: []
logstash:
  reserved: false
  hidden: false
  backend_roles:
  - "logstash"
  hosts: []
  users: []
  and_backend_roles: []
own_index:
  reserved: false
  hidden: false
  backend_roles: []
  hosts: []
  users:
  - "*"
  and_backend_roles: []
  description: "Allow full access to an index named like the username"
kibana_user:
  reserved: false
  hidden: false
  backend_roles:
  - "kibanauser"
  hosts: []
  users: []
  and_backend_roles: []
  description: "Maps kibanauser to kibana_user"
complex-role:
  reserved: false
  hidden: false
  backend_roles:
  - "ldap-analyst"
  hosts: []
  users:
  - "new-user"
  and_backend_roles: []
_meta:
  type: "rolesmapping"
  config_version: 2
all_access:
  reserved: true
  hidden: false
  backend_roles:
  - "admin"
  hosts: []
  users: []
  and_backend_roles: []
  description: "Maps admin to all_access"
readall:
  reserved: true
  hidden: false
  backend_roles:
  - "readall"
  hosts: []
  users: []
  and_backend_roles: []
kibana_server:
  reserved: true
  hidden: false
  backend_roles: []
  hosts: []
  users:
  - "kibanaserver"
  and_backend_roles: []
```


## action_groups.yml

This file contains any initial action groups that you want to add to the Security plugin.

Aside from some metadata, the default file is empty, because the Security plugin has a number of static action groups that it adds automatically. These static action groups cover a wide variety of use cases and are a great way to get started with the plugin.

```yml
---
my-action-group:
  reserved: false
  hidden: false
  allowed_actions:
  - "indices:data/write/index*"
  - "indices:data/write/update*"
  - "indices:admin/mapping/put"
  - "indices:data/write/bulk*"
  - "read"
  - "write"
  static: false
_meta:
  type: "actiongroups"
  config_version: 2
```

## tenants.yml

You can use this file to specify and add any number of OpenSearch Dashboards tenants to your OpenSearch cluster. For more information about tenants, see [OpenSearch Dashboards multi-tenancy]({{site.url}}{{site.baseurl}}/security/multi-tenancy/tenant-index).

Like all of the other YAML files, we recommend you use `tenants.yml` to add any tenants you must have in your cluster, and then use OpenSearch Dashboards or the [REST API]({{site.url}}{{site.baseurl}}/security/access-control/api/#tenants) if you need to further configure or create any other tenants.

```yml
---
_meta:
  type: "tenants"
  config_version: 2
admin_tenant:
  reserved: false
  description: "Demo tenant for admin user"
```

## nodes_dn.yml

`nodes_dn.yml` lets you add certificates' [distinguished names (DNs)]({{site.url}}{{site.baseurl}}/security/configuration/generate-certificates/#add-distinguished-names-to-opensearchyml) an allow list to enable communication between any number of nodes and/or clusters. For example, a node that has the DN `CN=node1.example.com` in its allow list accepts communication from any other node or certificate that uses that DN.

The DNs get indexed into a [system index]({{site.url}}{{site.baseurl}}/security/configuration/system-indices) that only a super admin or an admin with a Transport Layer Security (TLS) certificate can access. If you want to programmatically add DNs to your allow lists, use the [REST API]({{site.url}}{{site.baseurl}}/security/access-control/api/#distinguished-names).

```yml
---
_meta:
  type: "nodesdn"
  config_version: 2

# Define nodesdn mapping name and corresponding values
# cluster1:
#   nodes_dn:
#       - CN=*.example.com
```
