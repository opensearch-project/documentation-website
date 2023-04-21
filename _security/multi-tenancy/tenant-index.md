---
layout: default
title: OpenSearch Dashboards multi-tenancy
nav_order: 140
has_children: true
has_toc: false
redirect_from:
  - /security/multi-tenancy/
---

# OpenSearch Dashboards multi-tenancy

*Tenants* in OpenSearch Dashboards are spaces for saving index patterns, visualizations, dashboards, and other OpenSearch Dashboards objects. OpenSearch allows users to create multiple tenants for multiple uses. Tenants are useful for safely sharing your work with other OpenSearch Dashboards users. You can control which roles have access to a tenant and whether those roles have read or write access. By default, all OpenSearch Dashboards users have access to two independent tenants: the global tenant and a private tenant. Multi-tenancy also provides the option to create custom tenants.

- **Global** -- This tenant is shared between every OpenSearch Dashboards user. It does allow for sharing objects among users who have access to it.
- **Private** -- This tenant is exclusive to each user and can't be shared. It does not allow you to access routes or index patterns created by the user's global tenant.
- **Custom** -- Administrators can create custom tenants and assign them to specific roles. Once created, these tenants can then provide spaces for specific groups of users.

The global tenant is not a *primary* tenant in the sense that it replicates its content in a private tenant. To the contrary, if you make a change to your global tenant, you won't see that change reflected in your private tenant. Some example changes include the following:

- Change advanced settings
- Create visualizations
- Create index patterns

To provide a practical example, you might use the private tenant for exploratory work, create detailed visualizations with your team in an `analysts` tenant, and maintain a summary dashboard for corporate leadership in an `executive` tenant.

If you share a visualization or dashboard with someone, you can see that the URL includes the tenant:

```
http://<opensearch_dashboards_host>:5601/app/opensearch-dashboards?security_tenant=analysts#/visualize/edit/c501fa50-7e52-11e9-ae4e-b5d69947d32e?_g=()
```

## Next steps

To get started with tenants, see [Multi-tenancy configuration]({{site.url}}{{site.baseurl}}/security/multi-tenancy/multi-tenancy-config/) for information about enabling multi-tenancy, adding tenants, and assigning roles to tenants.

For information about making dynamic changes to the multi-tenancy configuration, see [Dynamic configuration in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/security/multi-tenancy/dynamic-config/).

