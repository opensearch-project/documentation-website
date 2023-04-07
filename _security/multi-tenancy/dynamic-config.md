---
layout: default
title: Dynamic configuration in OpenSearch Dashboards
parent: OpenSearch Dashboards multi-tenancy
nav_order: 147
---


# Dynamic configuration in OpenSearch Dashboards

Dynamic configuration of multi-tenancy in OpenSearch Dashboards provides options to make common settings for tenancy without having to make changes to the configuration YAML files on each node and then restart the cluster. You can take advantage of this functionality by using the Dashboards interface or the REST API. Dynamic settings include the ability to set the default tenant for all users, disable or enable private tenants, and disable or enable tenancy entirely for all users. The following table includes further description for the options covered by dynamic configuration:

| Option | Description |
| :--- | :--- |
| Disable or enable multi-tenancy | Administrators can dynamically disable or enable multi-tenancy for all users. Disabling multi-tenancy poses no risk for loss of data. If and when an administrator chooses to re-enable tenancy, all previously saved objects are preserved and made available. |
| Disable or enable private tenant  | This option allows administrators to disable private tenants. As with multi-tenancy as a whole, when private tenants are re-enabled all previously saved objects are preserved and made available. |
| Default tenant | This option allows an administrator to choose either a global, private, or custom tenant as the default when users sign on. In the case where a user doesn't have access to the default tenant (for example, if a custom tenant was specified as the default), the default transitions to the next preferred tenant or to the global tenant. |

## Configuring multi-tenancy in OpenSearch Dashboards





## Configuring multi-tenancy with the REST API



```yml
config:
  dynamic:
    kibana:
      multitenancy_enabled: true
      server_username: kibanaserver
      index: '.kibana'
    do_not_fail_on_forbidden: false
```

Setting | Description
:--- | :---
`multitenancy_enabled` | Enable or disable multi-tenancy. Default is true.
`server_username` | Must match the name of the OpenSearch Dashboards server user from `opensearch_dashboards.yml`. Default is `kibanaserver`.
`index` | Must match the name of the OpenSearch Dashboards index from `opensearch_dashboards.yml`. Default is `.kibana`.
`do_not_fail_on_forbidden` | If true, the security plugin removes any content that a user is not allowed to see from search results. If false, the plugin returns a security exception. Default is false.

`opensearch_dashboards.yml` has some additional settings:

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

Setting | Description
:--- | :---
`opensearch.requestHeadersAllowlist` | OpenSearch Dashboards requires that you add all HTTP headers to the allow list so that the headers pass to OpenSearch. Multi-tenancy uses a specific header, `securitytenant`, that must be present with the standard `Authorization` header. If the `securitytenant` header is not on the allow list, OpenSearch Dashboards starts with a red status.
`opensearch_security.multitenancy.enabled` | Enables or disables multi-tenancy in OpenSearch Dashboards. Default is true.
`opensearch_security.multitenancy.tenants.enable_global` | Enables or disables the global tenant. Default is true.
`opensearch_security.multitenancy.tenants.enable_private` | Enables or disables the private tenant. Default is true.
`opensearch_security.multitenancy.tenants.preferred` | Lets you change ordering in the **Tenants** tab of OpenSearch Dashboards. By default, the list starts with global and private (if enabled) and then proceeds alphabetically. You can add tenants here to move them to the top of the list.
`opensearch_security.multitenancy.enable_filter` | If you have many tenants, you can add a search bar to the top of the list. Default is false.


## Add tenants

To create tenants, use OpenSearch Dashboards, the REST API, or `tenants.yml`.