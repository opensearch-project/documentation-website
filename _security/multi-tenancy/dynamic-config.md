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
- **Default tenant** - This option allows an administrator to choose either a global, private, or custom tenant as the default when users sign on. In the case where a user doesn't have access to the default tenant (for example, if a custom tenant unavailable to the user was specified as the default), the default transitions to the preferred tenant, which is specified by the `opensearch_security.multitenancy.tenants.preferred` setting in the `opensearch-dashboards.yml` file. See [Multi-tenancy configuration]({{site.url}}{{site.baseurl}}/security/multi-tenancy/multi-tenancy-config/) for details about this setting.

Depending on the specific changes made to multi-tenancy using dynamic configuration, some users may be logged out of their Dashboards session once the changes are saved. For example, if an admin user disables multi-tenancy, users with either a private or custom tenant as their selected tenant will be logged out and will need to log back in. Similarly, if an admin user disables private tenants, users with the private tenant selected will be logged out and will need to log back in. 

The global tenant, however, is a special case. Since this tenant is never disabled, users with global tenant selected as their active tenant will experience no interruption to their session. Furthermore, changing the default tenant has no impact on a user's session.


## Configuring multi-tenancy in OpenSearch Dashboards

To make settings for multi-tenancy in Dashboards, follow these steps. 

1. Begin by selecting **Security** in the Dashboards home page menu. Then select **Tenancy** from the Security menu on the left side of the screen. The **Multi-tenancy** page is displayed. 
1. By default, the **Manage** tab is displayed. Select the **Configure** tab to display the dynamic settings for multi-tenancy.
   * In the **Multi-tenancy** field, select the **Enable tenancy** check box to enable multi-tenancy. Clear the check box to disable the feature. The default is `true`.
   * In the **Tenants** field, you can enable or disable private tenants for users. By default the check box is selected and the feature is enabled.
   * In the **Default tenant** field, use the dropdown menu to select a default tenant. The menu includes Global, Private, and any other custom tenants that are available to users.
1. After making your preferred changes, select **Save changes** in the lower right corner of the window. A popup window appears listing the configuration items you've changed and asks you to review your changes.
1. Select the checkboxes beside the items you want to confirm and then select **Apply changes**. The changes are implemented dynamically.


## Configuring multi-tenancy with the REST API

In addition to the Dashboards interface, dynamic configurations can be made using the REST API. 

### Get tenancy configuration

Retrieves settings for the dynamic configuration.

```json
GET /_plugins/_security/api/tenancy/config
```
{% include copy-curl.html %}

#### Example response

```json
{
    "mulitenancy_enabled": true,
    "private_tenant_enabled": true,
    "default_tenant": "global tenant"
}
```

### Update tenant configuration

Updates settings for dynamic configuration.

```json
PUT /_plugins/_security/api/tenancy/config
{
    "default_tenant": "custom tenant 1",
    "private_tenant_enabled": false,
    "mulitenancy_enabled": true
}
```
{% include copy-curl.html %}

### Example response

```json
{
    "mulitenancy_enabled": true,
    "private_tenant_enabled": false,
    "default_tenant": "custom tenant 1"
}
```

### Dashboardsinfo API

You can also use the Dashboardsinfo API to retrieve the status of multi-tenancy settings for the user logged in to Dashboards.

```json
GET /_plugins/_security/dashboardsinfo
```
{% include copy-curl.html %}

### Example response

```json
{
  "user_name" : "admin",
  "not_fail_on_forbidden_enabled" : false,
  "opensearch_dashboards_mt_enabled" : true,
  "opensearch_dashboards_index" : ".kibana",
  "opensearch_dashboards_server_user" : "kibanaserver",
  "multitenancy_enabled" : true,
  "private_tenant_enabled" : true,
  "default_tenant" : "Private"
}
```

