---
layout: default
title: Dynamic configuration in OpenSearch Dashboards
parent: OpenSearch Dashboards multi-tenancy
nav_order: 147
---


# Dynamic configuration in OpenSearch Dashboards

Multi-tenancy is enabled by default, but you can disable it or change its settings using `config/opensearch-security/config.yml`:

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