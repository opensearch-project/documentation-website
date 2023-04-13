---
layout: default
title: Dynamic configuration in OpenSearch Dashboards
parent: OpenSearch Dashboards multi-tenancy
nav_order: 147
---


# Dynamic configuration in OpenSearch Dashboards

Dynamic configuration of multi-tenancy in OpenSearch Dashboards provides options to make common settings for tenancy without having to make changes to the configuration YAML files on each node and then restart the cluster. You can take advantage of this functionality by using the Dashboards interface or the REST API. The following list includes description of the options currently covered by dynamic configuration:

- **Disable or enable multi-tenancy** - Administrators can disable and enable multi-tenancy dynamically. Disabling multi-tenancy does not pose a risk for loss of data. If and when an administrator chooses to re-enable tenancy, all previously saved objects are preserved and made available.  The default is `true`.
  
  This setting does not have an impact on the global tenant, which always remains enabled.
  {: .note }

- **Disable or enable private tenant** - This option allows administrators to disable and enable private tenants. As with the enable multi-tenancy setting, when private tenants are re-enabled all previously saved objects are preserved and made available.
- **Default tenant** - This option allows an administrator to choose either a global, private, or custom tenant as the default when users sign on. In the case where a user doesn't have access to the default tenant (for example, if a custom tenant was specified as the default), the default transitions to the next preferred tenant for that user, or ultimately to the global tenant.

Once you make changes to multi-tenancy with dynamic configuration and save, users are logged out of their sessions and must log back in.
{: .note }

## Configuring multi-tenancy in OpenSearch Dashboards

To make settings for multi-tenancy in Dashboards, Begin by selecting **Security** in the Dashboards home page menu. Then select **Tenancy** from the Security menu on the left side of the screen. The **Multi-tenancy** page is displayed. 

By default, the **Manage** tab is displayed. Select the **Configure** tab to display the dynamic settings for multi-tenancy.

* In the **Multi-tenancy** field, select the **Enable tenancy** check box to enable multi-tenancy. Clear the check box to disable the feature. The default is `true`.
* In the **Tenants** field, you can enable or disable private tenants for users. By default the check box is selected and the feature is enabled.
* In the **Default tenant** field, use the dropdown menu to select a default tenant. The menu includes Global, Private, and any other custom tenants that are available to users.

After making selections, select **Save** in the lower right corner of the window. The changes are implemented dynamically.

## Configuring multi-tenancy with the REST API

In addition to the Dashboards interface, dynamic configurations can be made using the REST API. 

```json
GET /_plugins/_security/authinfo
```

```json
PUT /_plugins/_security/authinfo
{
    "mulitenancy_enabled": true,
    "private_tenant_enabled": true,
    "default_tenant": "global tenant"
}
```

```json
PATCH /_plugins/_security/authinfo
{
    "private_tenant_enabled": false
}
```

GET /_plugins/_security/api/tenancy/config

PUT /_plugins/_security/api/tenancy/config
{
  "multitenancy_enabled": true,
  "private_tenant_enabled": true,
  "default_tenant": "global tenant"
}

PATCH /_plugins/_security/api/tenancy/config
{
   "private_tenant_enabled": false,
}


GET /_plugins/_security/authinfo

PUT /_plugins/_security/authinfo
{
    "mulitenancy_enabled": true,
    "private_tenant_enabled": true,
    "default_tenant": "global tenant"
}

PATCH /_plugins/_security/authinfo
{
    "private_tenant_enabled": false
}



