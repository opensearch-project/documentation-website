---
layout: default
title: API
parent: Access control
nav_order: 120
---

# API

The security plugin REST API lets you programmatically create and manage users, roles, role mappings, action groups, and tenants.

---

#### Table of contents
1. TOC
{:toc}


---

## Access control for the API

Just like OpenSearch permissions, you control access to the security plugin REST API using roles. Specify roles in `opensearch.yml`:

```yml
plugins.security.restapi.roles_enabled: ["<role>", ...]
```

These roles can now access all APIs. To prevent access to certain APIs:

```yml
plugins.security.restapi.endpoints_disabled.<role>.<endpoint>: ["<method>", ...]
```

Possible values for `endpoint` are:

- ACTIONGROUPS
- ROLES
- ROLESMAPPING
- INTERNALUSERS
- CONFIG
- CACHE
- LICENSE
- SYSTEMINFO

Possible values for `method` are:

- GET
- PUT
- POST
- DELETE
- PATCH

For example, the following configuration grants three roles access to the REST API, but then prevents `test-role` from making PUT, POST, DELETE, or PATCH requests to `_plugins/_security/api/roles` or `_plugins/_security/api/internalusers`:

```yml
plugins.security.restapi.roles_enabled: ["all_access", "security_rest_api_access", "test-role"]
plugins.security.restapi.endpoints_disabled.test-role.ROLES: ["PUT", "POST", "DELETE", "PATCH"]
plugins.security.restapi.endpoints_disabled.test-role.INTERNALUSERS: ["PUT", "POST", "DELETE", "PATCH"]
```

To use the PUT and PATCH methods for the [configuration APIs](#configuration), add the following line to `opensearch.yml`:

```yml
plugins.security.unsupported.restapi.allow_securityconfig_modification: true
```


## Reserved and hidden resources

You can mark users, role, role mappings, and action groups as reserved. Resources that have this flag set to true can't be changed using the REST API or OpenSearch Dashboards.

To mark a resource as reserved, add the following flag:

```yml
kibana_user:
  reserved: true
```

Likewise, you can mark users, role, role mappings, and action groups as hidden. Resources that have this flag set to true are not returned by the REST API and not visible in OpenSearch Dashboards:

```yml
kibana_user:
  hidden: true
```

Hidden resources are automatically reserved.

To add or remove these flags, modify `config/opensearch-security/internal_users.yml` and run `plugins/opensearch-security/tools/securityadmin.sh`.


---

## Account

### Get account details
Introduced 1.0
{: .label .label-purple }

Returns account details for the current user. For example, if you sign the request as the `admin` user, the response includes details for that user.


#### Request

```
GET _plugins/_security/api/account
```

#### Example response

```json
{
  "user_name": "admin",
  "is_reserved": true,
  "is_hidden": false,
  "is_internal_user": true,
  "user_requested_tenant": null,
  "backend_roles": [
    "admin"
  ],
  "custom_attribute_names": [],
  "tenants": {
    "global_tenant": true,
    "admin_tenant": true,
    "admin": true
  },
  "roles": [
    "all_access",
    "own_index"
  ]
}
```


### Change password
Introduced 1.0
{: .label .label-purple }

Changes the password for the current user.


#### Request

```json
PUT _plugins/_security/api/account
{
    "current_password" : "old-password",
    "password" : "new-password"
}
```


#### Example response

```json
{
  "status": "OK",
  "message": "'test-user' updated."
}
```


---

## Action groups

### Get action group
Introduced 1.0
{: .label .label-purple }

Retrieves one action group.


#### Request

```
GET _plugins/_security/api/actiongroups/<action-group>
```

#### Example response

```json
{
  "custom_action_group": {
    "reserved": false,
    "hidden": false,
    "allowed_actions": [
      "kibana_all_read",
      "indices:admin/aliases/get",
      "indices:admin/aliases/exists"
    ],
    "description": "My custom action group",
    "static": false
  }
}
```


### Get action groups
Introduced 1.0
{: .label .label-purple }

Retrieves all action groups.


#### Request

```
GET _plugins/_security/api/actiongroups/
```


#### Example response

```json
{
  "read": {
    "reserved": true,
    "hidden": false,
    "allowed_actions": [
      "indices:data/read*",
      "indices:admin/mappings/fields/get*"
    ],
    "type": "index",
    "description": "Allow all read operations",
    "static": true
  },
  ...
}
```


### Delete action group
Introduced 1.0
{: .label .label-purple }

#### Request

```
DELETE _plugins/_security/api/actiongroups/<action-group>
```

#### Example response

```json
{
  "status":"OK",
  "message":"actiongroup SEARCH deleted."
}
```


### Create action group
Introduced 1.0
{: .label .label-purple }

Creates or replaces the specified action group.

#### Request

```json
PUT _plugins/_security/api/actiongroups/<action-group>
{
  "allowed_actions": [
    "indices:data/write/index*",
    "indices:data/write/update*",
    "indices:admin/mapping/put",
    "indices:data/write/bulk*",
    "read",
    "write"
  ]
}
```

#### Example response

```json
{
  "status": "CREATED",
  "message": "'my-action-group' created."
}
```


### Patch action group
Introduced 1.0
{: .label .label-purple }

Updates individual attributes of an action group.

#### Request

```json
PATCH _plugins/_security/api/actiongroups/<action-group>
[
  {
    "op": "replace", "path": "/allowed_actions", "value": ["indices:admin/create", "indices:admin/mapping/put"]
  }
]
```

#### Example response

```json
{
  "status":"OK",
  "message":"actiongroup SEARCH deleted."
}
```


### Patch action groups
Introduced 1.0
{: .label .label-purple }

Creates, updates, or deletes multiple action groups in a single call.

#### Request

```json
PATCH _plugins/_security/api/actiongroups
[
  {
    "op": "add", "path": "/CREATE_INDEX", "value": { "allowed_actions": ["indices:admin/create", "indices:admin/mapping/put"] }
  },
  {
    "op": "remove", "path": "/CRUD"
  }
]
```

#### Example response

```json
{
  "status":"OK",
  "message":"actiongroup SEARCH deleted."
}
```


---

## Users

These calls let you create, update, and delete internal users. If you use an external authentication backend, you probably don't need to worry about internal users.


### Get user
Introduced 1.0
{: .label .label-purple }

#### Request

```
GET _plugins/_security/api/internalusers/<username>
```


#### Example response

```json
{
  "kirk": {
    "hash": "",
    "roles": [ "captains", "starfleet" ],
    "attributes": {
       "attribute1": "value1",
       "attribute2": "value2",
    }
  }
}
```


### Get users
Introduced 1.0
{: .label .label-purple }

#### Request

```
GET _plugins/_security/api/internalusers/
```

#### Example response

```json
{
  "kirk": {
    "hash": "",
    "roles": [ "captains", "starfleet" ],
    "attributes": {
       "attribute1": "value1",
       "attribute2": "value2",
    }
  }
}
```


### Delete user
Introduced 1.0
{: .label .label-purple }

#### Request

```
DELETE _plugins/_security/api/internalusers/<username>
```

#### Example response

```json
{
  "status":"OK",
  "message":"user kirk deleted."
}
```


### Create user
Introduced 1.0
{: .label .label-purple }

Creates or replaces the specified user. You must specify either `password` (plain text) or `hash` (the hashed user password). If you specify `password`, the security plugin automatically hashes the password before storing it.

Note that any role you supply in the `opendistro_security_roles` array must already exist for the security plugin to map the user to that role. To see predefined roles, refer to [the list of predefined roles]({{site.url}}{{site.baseurl}}/security/access-control/users-roles#predefined-roles). For instructions on how to create a role, refer to [creating a role](#create-role).

#### Request

```json
PUT _plugins/_security/api/internalusers/<username>
{
  "password": "kirkpass",
  "opendistro_security_roles": ["maintenance_staff", "weapons"],
  "backend_roles": ["role 1", "role 2"],
  "attributes": {
    "attribute1": "value1",
    "attribute2": "value2"
  }
}
```

#### Example response

```json
{
  "status":"CREATED",
  "message":"User kirk created"
}
```


### Patch user
Introduced 1.0
{: .label .label-purple }

Updates individual attributes of an internal user.

#### Request

```json
PATCH _plugins/_security/api/internalusers/<username>
[
  {
    "op": "replace", "path": "/backend_roles", "value": ["klingons"]
  },
  {
    "op": "replace", "path": "/opendistro_security_roles", "value": ["ship_manager"]
  },
  {
    "op": "replace", "path": "/attributes", "value": { "newattribute": "newvalue" }
  }
]
```

#### Example response

```json
{
  "status": "OK",
  "message": "'kirk' updated."
}
```

### Patch users
Introduced 1.0
{: .label .label-purple }

Creates, updates, or deletes multiple internal users in a single call.

#### Request

```json
PATCH _plugins/_security/api/internalusers
[
  {
    "op": "add", "path": "/spock", "value": { "password": "testpassword1", "backend_roles": ["testrole1"] }
  },
  {
    "op": "add", "path": "/worf", "value": { "password": "testpassword2", "backend_roles": ["testrole2"] }
  },
  {
    "op": "remove", "path": "/riker"
  }
]
```

#### Example response

```json
{
  "status": "OK",
  "message": "Resource updated."
}
```


---

## Roles


### Get role
Introduced 1.0
{: .label .label-purple }

Retrieves one role.

#### Request

```
GET _plugins/_security/api/roles/<role>
```

#### Example response

```json
{
  "test-role": {
    "reserved": false,
    "hidden": false,
    "cluster_permissions": [
      "cluster_composite_ops",
      "indices_monitor"
    ],
    "index_permissions": [{
      "index_patterns": [
        "movies*"
      ],
      "dls": "",
      "fls": [],
      "masked_fields": [],
      "allowed_actions": [
        "read"
      ]
    }],
    "tenant_permissions": [{
      "tenant_patterns": [
        "human_resources"
      ],
      "allowed_actions": [
        "kibana_all_read"
      ]
    }],
    "static": false
  }
}
```


### Get roles
Introduced 1.0
{: .label .label-purple }

Retrieves all roles.

#### Request

```
GET _plugins/_security/api/roles/
```

#### Example response

```json
{
  "manage_snapshots": {
    "reserved": true,
    "hidden": false,
    "description": "Provide the minimum permissions for managing snapshots",
    "cluster_permissions": [
      "manage_snapshots"
    ],
    "index_permissions": [{
      "index_patterns": [
        "*"
      ],
      "fls": [],
      "masked_fields": [],
      "allowed_actions": [
        "indices:data/write/index",
        "indices:admin/create"
      ]
    }],
    "tenant_permissions": [],
    "static": true
  },
  ...
}
```


### Delete role
Introduced 1.0
{: .label .label-purple }

#### Request

```
DELETE _plugins/_security/api/roles/<role>
```

#### Example response

```json
{
  "status":"OK",
  "message":"role test-role deleted."
}
```


### Create role
Introduced 1.0
{: .label .label-purple }

Creates or replaces the specified role.

#### Request

```json
PUT _plugins/_security/api/roles/<role>
{
  "cluster_permissions": [
    "cluster_composite_ops",
    "indices_monitor"
  ],
  "index_permissions": [{
    "index_patterns": [
      "movies*"
    ],
    "dls": "",
    "fls": [],
    "masked_fields": [],
    "allowed_actions": [
      "read"
    ]
  }],
  "tenant_permissions": [{
    "tenant_patterns": [
      "human_resources"
    ],
    "allowed_actions": [
      "kibana_all_read"
    ]
  }]
}
```

#### Example response

```json
{
  "status": "OK",
  "message": "'test-role' updated."
}
```

>Due to word boundaries associated with Unicode special characters, the Unicode standard analyzer cannot index a [text field type]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/text/) value as a whole value when it includes one of these special characters. As a result, a text field value that includes a special character is parsed by the standard analyzer as multiple values separated by the special character, effectively tokenizing the different elements on either side of it.
>
>For example, since the values in the fields ```"user.id": "User-1"``` and ```"user.id": "User-2"``` contain the hyphen/minus sign, this special character will prevent the analyzer from distinguishing between the two different users for `user.id` and interpret them as one and the same. This can lead to unintentional filtering of documents and potentially compromise control over their access.
>
>To avoid this circumstance, you can use a custom analyzer or map the field as `keyword`, which performs an exact-match search. See [Keyword field type]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/keyword/) for the latter option.
>
>For a list of characters that should be avoided when field type is `text`, see [Word Boundaries](https://unicode.org/reports/tr29/#Word_Boundaries).
{: .warning}


### Patch role
Introduced 1.0
{: .label .label-purple }

Updates individual attributes of a role.

#### Request

```json
PATCH _plugins/_security/api/roles/<role>
[
  {
    "op": "replace", "path": "/index_permissions/0/fls", "value": ["myfield1", "myfield2"]
  },
  {
    "op": "remove", "path": "/index_permissions/0/dls"
  }
]
```

#### Example response

```json
{
  "status": "OK",
  "message": "'<role>' updated."
}
```


### Patch roles
Introduced 1.0
{: .label .label-purple }

Creates, updates, or deletes multiple roles in a single call.

#### Request

```json
PATCH _plugins/_security/api/roles
[
  {
    "op": "replace", "path": "/role1/index_permissions/0/fls", "value": ["test1", "test2"]
  },
  {
    "op": "remove", "path": "/role1/index_permissions/0/dls"
  },
  {
    "op": "add", "path": "/role2/cluster_permissions", "value": ["manage_snapshots"]
  }
]
```

#### Example response

```json
{
  "status": "OK",
  "message": "Resource updated."
}
```


---

## Role mappings

### Get role mapping
Introduced 1.0
{: .label .label-purple }

Retrieves one role mapping.

#### Request

```
GET _plugins/_security/api/rolesmapping/<role>
```

#### Example response

```json
{
  "role_starfleet" : {
    "backend_roles" : [ "starfleet", "captains", "defectors", "cn=ldaprole,ou=groups,dc=example,dc=com" ],
    "hosts" : [ "*.starfleetintranet.com" ],
    "users" : [ "worf" ]
  }
}
```


### Get role mappings
Introduced 1.0
{: .label .label-purple }

Retrieves all role mappings.

#### Request

```
GET _plugins/_security/api/rolesmapping
```

#### Example response

```json
{
  "role_starfleet" : {
    "backend_roles" : [ "starfleet", "captains", "defectors", "cn=ldaprole,ou=groups,dc=example,dc=com" ],
    "hosts" : [ "*.starfleetintranet.com" ],
    "users" : [ "worf" ]
  }
}
```


### Delete role mapping
Introduced 1.0
{: .label .label-purple }

Deletes the specified role mapping.

#### Request

```
DELETE _plugins/_security/api/rolesmapping/<role>
```

#### Example response

```json
{
  "status": "OK",
  "message": "'my-role' deleted."
}
```


### Create role mapping
Introduced 1.0
{: .label .label-purple }

Creates or replaces the specified role mapping.

#### Request

```json
PUT _plugins/_security/api/rolesmapping/<role>
{
  "backend_roles" : [ "starfleet", "captains", "defectors", "cn=ldaprole,ou=groups,dc=example,dc=com" ],
  "hosts" : [ "*.starfleetintranet.com" ],
  "users" : [ "worf" ]
}
```

#### Example response

```json
{
  "status": "CREATED",
  "message": "'my-role' created."
}
```


### Patch role mapping
Introduced 1.0
{: .label .label-purple }

Updates individual attributes of a role mapping.

#### Request

```json
PATCH _plugins/_security/api/rolesmapping/<role>
[
  {
    "op": "replace", "path": "/users", "value": ["myuser"]
  },
  {
    "op": "replace", "path": "/backend_roles", "value": ["mybackendrole"]
  }
]
```

#### Example response

```json
{
  "status": "OK",
  "message": "'my-role' updated."
}
```


### Patch role mappings
Introduced 1.0
{: .label .label-purple }

Creates or updates multiple role mappings in a single call.

#### Request

```json
PATCH _plugins/_security/api/rolesmapping
[
  {
    "op": "add", "path": "/human_resources", "value": { "users": ["user1"], "backend_roles": ["backendrole2"] }
  },
  {
    "op": "add", "path": "/finance", "value": { "users": ["user2"], "backend_roles": ["backendrole2"] }
  }
]
```

#### Example response

```json
{
  "status": "OK",
  "message": "Resource updated."
}
```


---

## Tenants

### Get tenant
Introduced 1.0
{: .label .label-purple }

Retrieves one tenant.

#### Request

```
GET _plugins/_security/api/tenants/<tenant>
```

#### Example response

```json
{
  "human_resources": {
    "reserved": false,
    "hidden": false,
    "description": "A tenant for the human resources team.",
    "static": false
  }
}
```


### Get tenants
Introduced 1.0
{: .label .label-purple }

Retrieves all tenants.

#### Request

```
GET _plugins/_security/api/tenants/
```

#### Example response

```json
{
  "global_tenant": {
    "reserved": true,
    "hidden": false,
    "description": "Global tenant",
    "static": true
  },
  "human_resources": {
    "reserved": false,
    "hidden": false,
    "description": "A tenant for the human resources team.",
    "static": false
  }
}
```


### Delete tenant
Introduced 1.0
{: .label .label-purple }

Deletes the specified tenant.

#### Request

```
DELETE _plugins/_security/api/tenants/<tenant>
```

#### Example response

```json
{
  "status":"OK",
  "message":"tenant human_resources deleted."
}
```


### Create tenant
Introduced 1.0
{: .label .label-purple }

Creates or replaces the specified tenant.

#### Request

```json
PUT _plugins/_security/api/tenants/<tenant>
{
  "description": "A tenant for the human resources team."
}
```

#### Example response

```json
{
  "status":"CREATED",
  "message":"tenant human_resources created"
}
```


### Patch tenant
Introduced 1.0
{: .label .label-purple }

Add, delete, or modify a single tenant.

#### Request

```json
PATCH _plugins/_security/api/tenants/<tenant>
[
  {
    "op": "replace", "path": "/description", "value": "An updated description"
  }
]
```

#### Example response

```json
{
  "status": "OK",
  "message": "Resource updated."
}
```


### Patch tenants
Introduced 1.0
{: .label .label-purple }

Add, delete, or modify multiple tenants in a single call.

#### Request

```json
PATCH _plugins/_security/api/tenants/
[
  {
    "op": "replace",
    "path": "/human_resources/description",
    "value": "An updated description"
  },
  {
    "op": "add",
    "path": "/another_tenant",
    "value": {
      "description": "Another description."
    }
  }
]
```

#### Example response

```json
{
  "status": "OK",
  "message": "Resource updated."
}
```

---

## Configuration

### Get configuration
Introduced 1.0
{: .label .label-purple }

Retrieves the current security plugin configuration in JSON format.

#### Request

```
GET _plugins/_security/api/securityconfig
```


### Update configuration
Introduced 1.0
{: .label .label-purple }

Creates or updates the existing configuration using the REST API. This operation can easily break your existing configuration, so we recommend using `securityadmin.sh` instead, which is far safer. See [Access control for the API](#access-control-for-the-api) for how to enable this operation.

#### Request

```json
PUT _plugins/_security/api/securityconfig/config
{
  "dynamic": {
    "filtered_alias_mode": "warn",
    "disable_rest_auth": false,
    "disable_intertransport_auth": false,
    "respect_request_indices_options": false,
    "opensearch-dashboards": {
      "multitenancy_enabled": true,
      "server_username": "kibanaserver",
      "index": ".opensearch-dashboards"
    },
    "http": {
      "anonymous_auth_enabled": false
    },
    "authc": {
      "basic_internal_auth_domain": {
        "http_enabled": true,
        "transport_enabled": true,
        "order": 0,
        "http_authenticator": {
          "challenge": true,
          "type": "basic",
          "config": {}
        },
        "authentication_backend": {
          "type": "intern",
          "config": {}
        },
        "description": "Authenticate via HTTP Basic against internal users database"
      }
    },
    "auth_failure_listeners": {},
    "do_not_fail_on_forbidden": false,
    "multi_rolespan_enabled": true,
    "hosts_resolver_mode": "ip-only",
    "do_not_fail_on_forbidden_empty": false
  }
}
```

#### Example response

```json
{
  "status": "OK",
  "message": "'config' updated."
}
```


### Patch configuration
Introduced 1.0
{: .label .label-purple }

Updates the existing configuration using the REST API. This operation can easily break your existing configuration, so we recommend using `securityadmin.sh` instead, which is far safer. See [Access control for the API](#access-control-for-the-api) for how to enable this operation.

Before you can execute the operation, you must first add the following line to `opensearch.yml`:

```yml
plugins.security.unsupported.restapi.allow_securityconfig_modification: true
```

#### Request

```json
PATCH _plugins/_security/api/securityconfig
[
  {
    "op": "replace", "path": "/config/dynamic/authc/basic_internal_auth_domain/transport_enabled", "value": "true"
  }
]
```

#### Example response

```json
{
  "status": "OK",
  "message": "Resource updated."
}
```

---

## Distinguished names

These REST APIs let a super admin add, retrieve, update, or delete any distinguished names from an allow list to enable communication between clusters and/or nodes.

Before you can use the REST API to configure the allow list, you must first add the following line to `opensearch.yml`:

```yml
plugins.security.nodes_dn_dynamic_config_enabled: true
```


### Get distinguished names

Retrieves all distinguished names in the allow list.

#### Request

```
GET _plugins/_security/api/nodesdn
```

#### Example response

```json
{
  "cluster1": {
    "nodes_dn": [
      "CN=cluster1.example.com"
    ]
  }
}
```

To get the distinguished names from a specific cluster's or node's allow list, include the cluster's name in the request path.

#### Request

```
GET _plugins/_security/api/nodesdn/<cluster-name>
```

#### Example response

```json
{
  "cluster3": {
    "nodes_dn": [
      "CN=cluster3.example.com"
    ]
  }
}
```


### Update distinguished names

Adds or updates the specified distinguished names in the cluster's or node's allow list.

#### Request

```json
PUT _plugins/_security/api/nodesdn/<cluster-name>
{
  "nodes_dn": [
    "CN=cluster3.example.com"
  ]
}
```

#### Example response

```json
{
  "status": "CREATED",
  "message": "'cluster3' created."
}
```


### Delete distinguished names

Deletes all distinguished names in the specified cluster's or node's allow list.

#### Request

```
DELETE _plugins/_security/api/nodesdn/<cluster-name>
```

#### Example response

```json
{
  "status": "OK",
  "message": "'cluster3' deleted."
}
```


---

## Certificates

### Get certificates
Introduced 1.0
{: .label .label-purple }

Retrieves the cluster's security certificates.

#### Request

```
GET _plugins/_security/api/ssl/certs
```

#### Example response

```json
{
  "http_certificates_list": [
    {
      "issuer_dn": "CN=Example Com Inc. Root CA,OU=Example Com Inc. Root CA,O=Example Com Inc.,DC=example,DC=com",
      "subject_dn": "CN=node-0.example.com,OU=node,O=node,L=test,DC=de",
      "san": "[[8, 1.2.3.4.5.5], [2, node-0.example.com]",
      "not_before": "2018-04-22T03:43:47Z",
      "not_after": "2028-04-19T03:43:47Z"
    }
  ],
  "transport_certificates_list": [
    {
      "issuer_dn": "CN=Example Com Inc. Root CA,OU=Example Com Inc. Root CA,O=Example Com Inc.,DC=example,DC=com",
      "subject_dn": "CN=node-0.example.com,OU=node,O=node,L=test,DC=de",
      "san": "[[8, 1.2.3.4.5.5], [2, node-0.example.com]",
      "not_before": "2018-04-22T03:43:47Z",
      "not_after": "2028-04-19T03:43:47Z"
    }
  ]
}
```
### Reload certificates
Introduced 1.0
{: .label .label-purple }

Reloads SSL certificates that are about to expire without restarting the OpenSearch node. 

This call assumes that new certificates are in the same location specified by the security configurations in opensearch.yml. To keep sensitive certificate reloads secure, this call only allows hot reload with certificates issued by the same issuer and subject DN and SAN with expiry dates after the current certificate.

#### Request

```
PUT _opendistro/_security/api/ssl/transport/reloadcerts
PUT _opendistro/_security/api/ssl/http/reloadcerts
```

#### Example response

```json
{ 
  "message": "updated http certs" 
}
```
---

## Cache

### Flush cache
Introduced 1.0
{: .label .label-purple }

Flushes the security plugin user, authentication, and authorization cache.


#### Request

```
DELETE _plugins/_security/api/cache
```


#### Example response

```json
{
  "status": "OK",
  "message": "Cache flushed successfully."
}
```


---

## Health

### Health check
Introduced 1.0
{: .label .label-purple }

Checks to see if the security plugin is up and running. If you operate your cluster behind a load balancer, this operation is useful for determining node health and doesn't require a signed request.


#### Request

```
GET _plugins/_security/health
```


#### Example response

```json
{
  "message": null,
  "mode": "strict",
  "status": "UP"
}
```


---

## Audit logs

The following API is available for audit logging in the security plugin.

### Enable Audit Logs

This API allows you to enable or disable audit logging, define the configuration for audit logging and compliance, and make updates to settings.

For details on using audit logging to track access to OpenSearch clusters, as well as information on further configurations, see [Audit logs]({{site.url}}{{site.baseurl}}/security/audit-logs/index/).

You can do an initial configuration of audit logging in the `audit.yml` file, found in the `opensearch-project/security/config` directory. Thereafter, you can use the REST API or Dashboards for further changes to the configuration.
{: note.}

#### Request fields

Field | Data Type | Description
:--- | :--- | :---
`enabled` | Boolean | Enables or disables audit logging. Default is `true`.
`audit` | Object | Contains fields for audit logging configuration.
`audit`<br>&nbsp;&nbsp;&nbsp;&nbsp;`ignore_users` | Array | Users to be excluded from auditing. Wildcard patterns are supported<br>Example: `ignore_users: ["test-user", employee-*"]`
`audit`<br>&nbsp;&nbsp;&nbsp;&nbsp;`ignore_requests` | Array | Requests to be excluded from auditing. Wildcard patterns are supported.<br>Example: `ignore_requests: ["indices:data/read/*", "SearchRequest"]`
`audit`<br>&nbsp;&nbsp;&nbsp;&nbsp;`disabled_rest_categories` | Array | Categories to exclude from REST API auditing. Default categories are `AUTHENTICATED`, `GRANTED_PRIVILEGES`.
`audit`<br>&nbsp;&nbsp;&nbsp;&nbsp;`disabled_transport_categories` | Array | Categories to exclude from Transport API auditing. Default categories are `AUTHENTICATED`, `GRANTED_PRIVILEGES`.
`audit`<br>&nbsp;&nbsp;&nbsp;&nbsp;`log_request_body` | Boolean | Includes the body of the request (if available) for both REST and the transport layer. Default is  `true`.
`audit`<br>&nbsp;&nbsp;&nbsp;&nbsp;`resolve_indices` | Boolean | Logs all indexes affected by a request. Resolves aliases and wildcards/date patterns. Default is `true`.
`audit`<br>&nbsp;&nbsp;&nbsp;&nbsp;`resolve_bulk_requests` | Boolean | Logs individual operations in a bulk request. Default is `false`.
`audit`<br>&nbsp;&nbsp;&nbsp;&nbsp;`exclude_sensitive_headers` | Boolean | Excludes sensitive headers from being included in the logs. Default is `true`.
`audit`<br>&nbsp;&nbsp;&nbsp;&nbsp;`enable_transport` | Boolean | Enables/disables Transport API auditing. Default is `true`.
`audit`<br>&nbsp;&nbsp;&nbsp;&nbsp;`enable_rest` | Boolean | Enables/disables REST API auditing. Default is `true`.
`compliance` | Object | Contains fields for compliance configuration. 
`compliance`<br>&nbsp;&nbsp;&nbsp;&nbsp;`enabled` | Boolean | Enables or disables compliance. Default is `true`.
`compliance`<br>&nbsp;&nbsp;&nbsp;&nbsp;`write_log_diffs` | Boolean | Logs only diffs for document updates. Default is `false`.
`compliance`<br>&nbsp;&nbsp;&nbsp;&nbsp;`read_watched_fields` | Object | Map of indexes and fields to monitor for read events. Wildcard patterns are supported for both index names and fields.
`compliance`<br>&nbsp;&nbsp;&nbsp;&nbsp;`read_ignore_users` | Array | List of users to ignore for read events. Wildcard patterns are supported.<br>Example: `read_ignore_users: ["test-user", "employee-*"]`
`compliance`<br>&nbsp;&nbsp;&nbsp;&nbsp;`write_watched_indices` | Array | List of indexes to watch for write events. Wildcard patterns are supported.<br>Example: `write_watched_indices: ["twitter", "logs-*"]`
`compliance`<br>&nbsp;&nbsp;&nbsp;&nbsp;`write_ignore_users` | Array | List of users to ignore for write events. Wildcard patterns are supported.<br>Example: `write_ignore_users: ["test-user", "employee-*"]`
`compliance`<br>&nbsp;&nbsp;&nbsp;&nbsp;`read_metadata_only` | Boolean | Logs only metadata of the document for read events. Default is `true`.
`compliance`<br>&nbsp;&nbsp;&nbsp;&nbsp;`write_metadata_only` | Boolean | Log only metadata of the document for write events. Default is `true`.
`compliance`<br>&nbsp;&nbsp;&nbsp;&nbsp;`external_config` | Boolean | Logs external configuration files for the node. Default is `false`.
`compliance`<br>&nbsp;&nbsp;&nbsp;&nbsp;`internal_config` | Boolean | Logs updates to internal security changes. Default is `true`.

Changes to the `_readonly` property result in a 409 error, as indicated in the response below.
{: .note}

```json
{
  "status" : "error",
  "reason" : "Invalid configuration",
  "invalid_keys" : {
    "keys" : "_readonly,config"
  }
}
```

#### Example request

**GET**

A GET call retrieves the audit configuration.

```
GET /_opendistro/_security/api/audit
```

**PUT**

A PUT call updates the audit configuration.

```json
PUT /_opendistro/_security/api/audit/config
{
  "enabled": true,
  "audit": {
    "ignore_users": [],
    "ignore_requests": [],
    "disabled_rest_categories": [
      "AUTHENTICATED",
      "GRANTED_PRIVILEGES"
    ],
    "disabled_transport_categories": [
      "AUTHENTICATED",
      "GRANTED_PRIVILEGES"
    ],
    "log_request_body": false,
    "resolve_indices": false,
    "resolve_bulk_requests": false,
    "exclude_sensitive_headers": true,
    "enable_transport": false,
    "enable_rest": true
  },
  "compliance": {
    "enabled": true,
    "write_log_diffs": false,
    "read_watched_fields": {},
    "read_ignore_users": [],
    "write_watched_indices": [],
    "write_ignore_users": [],
    "read_metadata_only": true,
    "write_metadata_only": true,
    "external_config": false,
    "internal_config": true
  }
}
```

**PATCH**

A PATCH call is used to update specified fields in the audit configuration. The PATCH method requires an operation, a path, and a value to complete a valid request. For details on using the PATCH method, see the following [Patching resources](https://en.wikipedia.org/wiki/PATCH_%28HTTP%29#Patching_resources) description at Wikipedia.

Using the PATCH method also requires a user to have a security configuration that includes admin certificates for encryption. To find out more about these certificates, see [Configure admin certificates]({{site.url}}{{site.baseurl}}/security/configuration/tls/#configuring-admin-certificates).

```bash
curl -X PATCH -k -i --cert <admin_cert file name> --key <admin_cert_key file name> <domain>/_opendistro/_security/api/audit -H 'Content-Type: application/json' -d'[{"op":"add","path":"/config/enabled","value":"true"}]'
```

The OpenSearch Dashboards dev tool does not currently support the PATCH method. You can use [curl](https://curl.se/), [Postman](https://www.postman.com/), or another alternative process to update the configuration using this method. To follow the GitHub issue for support of the PATCH method in Dashboards, see [issue #2343](https://github.com/opensearch-project/OpenSearch-Dashboards/issues/2343).
{: .note}

#### Example response

The GET call produces a response that appears similar to the following:

```json
{
  "_readonly" : [
    "/audit/exclude_sensitive_headers",
    "/compliance/internal_config",
    "/compliance/external_config"
  ],
  "config" : {
    "compliance" : {
      "enabled" : true,
      "write_log_diffs" : false,
      "read_watched_fields" : { },
      "read_ignore_users" : [ ],
      "write_watched_indices" : [ ],
      "write_ignore_users" : [ ],
      "read_metadata_only" : true,
      "write_metadata_only" : true,
      "external_config" : false,
      "internal_config" : true
    },
    "enabled" : true,
    "audit" : {
      "ignore_users" : [ ],
      "ignore_requests" : [ ],
      "disabled_rest_categories" : [
        "AUTHENTICATED",
        "GRANTED_PRIVILEGES"
      ],
      "disabled_transport_categories" : [
        "AUTHENTICATED",
        "GRANTED_PRIVILEGES"
      ],
      "log_request_body" : true,
      "resolve_indices" : true,
      "resolve_bulk_requests" : true,
      "exclude_sensitive_headers" : true,
      "enable_transport" : true,
      "enable_rest" : true
    }
  }
}
```
The PUT request produces a response that appears similar to the following:

```json
{
  "status" : "OK",
  "message" : "'config' updated."
}
```

The PATCH request produces a response similar to the following:

```bash
HTTP/1.1 200 OK
content-type: application/json; charset=UTF-8
content-length: 45
```
