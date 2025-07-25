---
layout: default
title: OpenSearch Dashboards multi-tenancy
parent: Access control
nav_order: 30
canonical_url: https://docs.opensearch.org/latest/security/multi-tenancy/tenant-index/
---

# OpenSearch Dashboards multi-tenancy

*Tenants* in OpenSearch Dashboards are spaces for saving index patterns, visualizations, dashboards, and other OpenSearch Dashboards objects. By default, all OpenSearch Dashboards users have access to two tenants: **Private** and **Global**. The global tenant is shared between every OpenSearch Dashboards user. The private tenant is exclusive to each user and can't be shared.

Tenants are useful for safely sharing your work with other OpenSearch Dashboards users. You can control which roles have access to a tenant and whether those roles have read or write access.

You might use the private tenant for exploratory work, create detailed visualizations with your team in an `analysts` tenant, and maintain a summary dashboard for corporate leadership in an `executive` tenant.

If you share a visualization or dashboard with someone, you can see that the URL includes the tenant:

```
http://<opensearch_dashboards_host>:5601/app/opensearch-dashboards?security_tenant=analysts#/visualize/edit/c501fa50-7e52-11e9-ae4e-b5d69947d32e?_g=()
```


## Configuration

Multi-tenancy is enabled by default, but you can disable it or change its settings using `plugins/opensearch-security/securityconfig/config.yml`:

```yml
config:
  dynamic:
    opensearch-dashboards:
      multitenancy_enabled: true
      server_username: kibanaserver
      index: '.opensearch-dashboards'
    do_not_fail_on_forbidden: false
```

Setting | Description
:--- | :---
`multitenancy_enabled` | Enable or disable multi-tenancy. Default is true.
`server_username` | Must match the name of the OpenSearch Dashboards server user from `opensearch_dashboards.yml`. Default is `kibanaserver`.
`index` | Must match the name of the OpenSearch Dashboards index from `opensearch_dashboards.yml`. Default is `.opensearch-dashboards`.
`do_not_fail_on_forbidden` | If true, the security plugin removes any content that a user is not allowed to see from search results. If false, the plugin returns a security exception. Default is false.

`opensearch_dashboards.yml` has some additional settings:

```yml
opensearch.username: kibanaserver
opensearch.password: kibanaserver
opensearch.requestHeadersWhitelist: ["securitytenant","Authorization"]
opensearch_security.multitenancy.enabled: true
opensearch_security.multitenancy.tenants.enable_global: true
opensearch_security.multitenancy.tenants.enable_private: true
opensearch_security.multitenancy.tenants.preferred: ["Private", "Global"]
opensearch_security.multitenancy.enable_filter: false
```

Setting | Description
:--- | :---
`opensearch.requestHeadersWhitelist` | OpenSearch Dashboards requires that you whitelist all HTTP headers that it passes to OpenSearch. Multi-tenancy uses a specific header, `securitytenant`, that must be present with the standard `Authorization` header. If the `securitytenant` header is not whitelisted, OpenSearch Dashboards starts with a red status.
`opensearch_security.multitenancy.enabled` | Enables or disables multi-tenancy in OpenSearch Dashboards. Default is true.
`opensearch_security.multitenancy.tenants.enable_global` | Enables or disables the global tenant. Default is true.
`opensearch_security.multitenancy.tenants.enable_private` | Enables or disables the private tenant. Default is true.
`opensearch_security.multitenancy.tenants.preferred` | Lets you change ordering in the **Tenants** tab of OpenSearch Dashboards. By default, the list starts with global and private (if enabled) and then proceeds alphabetically. You can add tenants here to move them to the top of the list.
`opensearch_security.multitenancy.enable_filter` | If you have many tenants, you can add a search bar to the top of the list. Default is false.


## Add tenants

To create tenants, use OpenSearch Dashboards, the REST API, or `tenants.yml`.


#### OpenSearch Dashboards

1. Open OpenSearch Dashboards.
1. Choose **Security**, **Tenants**, and **Create tenant**.
1. Give the tenant a name and description.
1. Choose **Create**.


#### REST API

See [Create tenant]({{site.url}}{{site.baseurl}}/security-plugin/access-control/api#create-tenant).


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

See [Create role]({{site.url}}{{site.baseurl}}/security-plugin/access-control/api#create-role).


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


## Manage OpenSearch Dashboards indices

The open source version of OpenSearch Dashboards saves all objects to a single index: `.opensearch-dashboards`. The security plugin uses this index for the global tenant, but separate indices for every other tenant. Each user also has a private tenant, so you might see a large number of indices that follow two patterns:

```
.kibana_<hash>_<tenant_name>
.kibana_<hash>_<username>
```

The security plugin scrubs these index names of special characters, so they might not be a perfect match of tenant names and usernames.
{: .tip }

To back up your OpenSearch Dashboards data, [take a snapshot]({{site.url}}{{site.baseurl}}/opensearch/snapshot-restore/) of all tenant indices using an index pattern such as `.opensearch-dashboards*`.
