---
layout: default
title: Multi-tenancy configuration
parent: OpenSearch Dashboards multi-tenancy
nav_order: 145
---


# Multi-tenancy configuration

Multi-tenancy is enabled by default, but you can disable it or change its settings using `config/opensearch-security/config.yml`:

```yml
config:
  dynamic:
    kibana:
      multitenancy_enabled: true
      private_tenant_enabled: true
      default_tenant: global tenant
      server_username: kibanaserver
      index: '.kibana'
    do_not_fail_on_forbidden: false
```

| Setting | Description |
| :--- | :--- |
| `multitenancy_enabled` | Enable or disable multi-tenancy. Default is `true`. |
| `private_tenant_enabled` | Enable or disable the private tenant. Default is `true`. |
| `default_tenant` | Use to set the tenant that is available when users log in. |
| `server_username` | Must match the name of the OpenSearch Dashboards server user from `opensearch_dashboards.yml`. Default is `kibanaserver`. |
| `index` | Must match the name of the OpenSearch Dashboards index from `opensearch_dashboards.yml`. Default is `.kibana`. |
| `do_not_fail_on_forbidden` | When `true`, the Security plugin removes any content that a user is not allowed to see from the search results. When `false`, the plugin returns a security exception. Default is `false`. |

The `opensearch_dashboards.yml` file includes additional settings:

```yml
opensearch.username: kibanaserver
opensearch.password: kibanaserver
opensearch.requestHeadersAllowlist: ["securitytenant","Authorization"]
opensearch_security.multitenancy.enabled: true
opensearch_security.multitenancy.tenants.enable_global: true
opensearch_security.multitenancy.tenants.enable_private: true
opensearch_security.multitenancy.tenants.preferred: ["Private", "Global"]
opensearch_security.multitenancy.enable_filter: false
```

| Setting | Description |
| :--- | :--- |
| `opensearch.requestHeadersAllowlist` | OpenSearch Dashboards requires that you add all HTTP headers to the allow list so that the headers pass to OpenSearch. Multi-tenancy uses a specific header, `securitytenant`, that must be present with the standard `Authorization` header. If the `securitytenant` header is not on the allow list, OpenSearch Dashboards starts with a red status.
| `opensearch_security.multitenancy.enabled` | Enables or disables multi-tenancy in OpenSearch Dashboards. Default is `true`. |
| `opensearch_security.multitenancy.tenants.enable_global` | Enables or disables the global tenant. Default is `true`. |
| `opensearch_security.multitenancy.tenants.enable_private` | Enables or disables private tenants. Default is `true`. |
| `opensearch_security.multitenancy.tenants.preferred` | Lets you change ordering in the **Tenants** tab of OpenSearch Dashboards. By default, the list starts with Global and Private (if enabled) and then proceeds alphabetically. You can add tenants here to move them to the top of the list. |
| `opensearch_security.multitenancy.enable_filter` | If you have many tenants, you can add a search bar to the top of the list. Default is `false`. |


## Add tenants

To create tenants, use OpenSearch Dashboards, the REST API, or `tenants.yml`.


#### OpenSearch Dashboards

1. Open OpenSearch Dashboards.
1. Choose **Security**, **Tenants**, and **Create tenant**.
1. Give the tenant a name and description.
1. Choose **Create**.


#### REST API

See [Create tenant]({{site.url}}{{site.baseurl}}/security/access-control/api/#create-tenant).


#### tenants.yml

```yml
---
_meta:
  type: "tenants"
  config_version: 2

## Demo tenants
admin_tenant:
  reserved: false
  description: "Demo tenant for admin user"
```

## Give roles access to tenants

After creating a tenant, give a role access to it using OpenSearch Dashboards, the REST API, or `roles.yml`.

- Read-write (`kibana_all_write`) permissions let the role view and modify objects in the tenant.
- Read-only (`kibana_all_read`) permissions let the role view objects, but not modify them.


#### OpenSearch Dashboards

1. Open OpenSearch Dashboards.
1. Choose **Security**, **Roles**, and a role.
1. For **Tenant permissions**, add tenants, press Enter, and give the role read and/or write permissions to it.


#### REST API

See [Create role]({{site.url}}{{site.baseurl}}/security/access-control/api/#create-role).


#### roles.yml

```yml
---
test-role:
  reserved: false
  hidden: false
  cluster_permissions:
  - "cluster_composite_ops"
  - "indices_monitor"
  index_permissions:
  - index_patterns:
    - "movies*"
    dls: ""
    fls: []
    masked_fields: []
    allowed_actions:
    - "read"
  tenant_permissions:
  - tenant_patterns:
    - "human_resources"
    allowed_actions:
    - "kibana_all_read"
  static: false
_meta:
  type: "roles"
  config_version: 2
```


## Manage OpenSearch Dashboards indexes

The open source version of OpenSearch Dashboards saves all objects to a single index: `.kibana`. The Security plugin uses this index for the global tenant, but separate indexes for every other tenant. Each user also has a private tenant, so you might see a large number of indexes that follow two patterns:

```
.kibana_<hash>_<tenant_name>
.kibana_<hash>_<username>
```

The Security plugin scrubs these index names of special characters, so they might not be a perfect match of tenant names and usernames.
{: .tip }

To back up your OpenSearch Dashboards data, [take a snapshot]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore/) of all tenant indexes using an index pattern such as `.kibana*`.
