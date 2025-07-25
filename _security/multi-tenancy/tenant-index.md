---
layout: default
title: OpenSearch Dashboards multi-tenancy
nav_order: 140
has_children: true
has_toc: false
redirect_from:
  - /security/multi-tenancy/
canonical_url: https://docs.opensearch.org/latest/security/multi-tenancy/tenant-index/
---

# OpenSearch Dashboards multi-tenancy

*Tenants* in OpenSearch Dashboards are spaces for saving index patterns, visualizations, dashboards, and other OpenSearch Dashboards objects. Tenants are useful for safely sharing your work with other OpenSearch Dashboards users. You can control which roles have access to a tenant and whether those roles have read or write access. By default, all OpenSearch Dashboards users have access to two independent tenants:

- **Private** - This tenant is exclusive to each user and can't be shared. You can't use it to access routes or index patterns made by the user's global tenant.
- **Global** - This tenant is shared between every OpenSearch Dashboards user. 

The global tenant is not a *primary* tenant such that any action done within the global tenant is not replicated to a user's private tenant. If you make a change to your global tenant, you won't see that change reflected in your private tenant. Some example changes include, but are not limited to:

- Change advanced settings
- Create visualizations
- Create index patterns

You might use the private tenant for exploratory work, create detailed visualizations with your team in an `analysts` tenant, and maintain a summary dashboard for corporate leadership in an `executive` tenant.

If you share a visualization or dashboard with someone, you can see that the URL includes the tenant:

```
http://<opensearch_dashboards_host>:5601/app/opensearch-dashboards?security_tenant=analysts#/visualize/edit/c501fa50-7e52-11e9-ae4e-b5d69947d32e?_g=()
```

## Next steps

To get started with tenants, see [Multi-tenancy configuration]({{site.url}}{{site.baseurl}}/security/multi-tenancy/multi-tenancy-config/) for information on enabling multi-tenancy, adding tenants, and assigning roles to tenants.   

