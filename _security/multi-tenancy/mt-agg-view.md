---
layout: default
title: Multi-tenancy aggregate view for saved objects
parent: OpenSearch Dashboards multi-tenancy
nav_order: 150
---

# OpenSearch Dashboards multi-tenancy aggregate view for saved objects

This is an experimental feature released in OpenSearch 2.4 and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the [Dashboards object sharing](https://github.com/opensearch-project/OpenSearch-Dashboards/issues/2249) GitHub issue. For a more comprehensive view of the proposed future development of multi-tenancy, see the [Dashboards object sharing](https://github.com/opensearch-project/security/issues/1869) issue.
{: .warning}

Aggregate view for saved objects allows a user who has access to multiple tenants to see all saved objects associated with those tenants in a single view without having to switch between tenants to do so. This includes both tenants created by the user and tenants shared with the user. Aggregate view introduces a Tenant dropdown menu and column in the Saved Objects table that gives the user the option to filter by tenants and make visible their associated saved objects.

Once you identify a saved object of interest, you can then switch to that tenant to work with the object.

To access saved objects, expand the top menu and select **Management > Dashboards Management > Saved Objects**. The Saved Objects window opens. By default, all tenants the user has permissions for are displayed along with all saved objects associated with the tenants.

As an experimental feature, aggregate view for saved objects is kept behind a feature flag and must be enabled in the `opensearch_dashboards.yml` file before the feature is made available. See [Enabling aggregate view](#enabling-aggregate-view-for-saved-objects) for more information.
{: .note }

### Feature benefits

- Implementing an aggregate view for all saved objects on one screen allows you to quickly locate an object of interest and determine which tenant is associated with it. Once you locate an object, you can select the appropriate tenant and work with the object.
- This feature also adds a Tenant dropdown menu to the Saved Objects table, which allows you to filter the view by tenants and their associated saved objects.

### Plans for future development

In subsequent releases, we plan to expand the functionality of this feature to include the ability to perform actions directly from aggregate view and share items without having to first select a specific tenant. In the longer term, OpenSearch plans to evolve multi-tenancy so that it becomes a much more flexible tool for sharing objects among users and employs a more sophisticated way of assigning the roles and permissions that facilitate sharing. To learn more about the features being proposed for future releases, see the GitHub issue [Dashboards object sharing](https://github.com/opensearch-project/security/issues/1869).

### Known limitations

In this first experimental phase of development, there are some limitations that should be observed before enabling the feature and using it in a test environment:

* The feature can only be used in a new cluster. At this time, the feature is not supported by clusters already in use.
* Also, the feature should be used only in a test environment, not in production. 
* Finally, once the feature has been enabled and used in a test cluster, the feature cannot be disabled for the cluster. Disabling the feature once it has been used to work with tenants and saved objects can result in the loss of saved objects and can have an impact on tenant-to-tenant functionality. This can occur when disabling the feature in any one of three ways: disabling the aggregate view feature with the [feature flag](#enabling-aggregate-view-for-saved-objects); disabling multi-tenancy with the traditional [multi-tenancy configuration]({{site.url}}{{site.baseurl}}/security/multi-tenancy/multi-tenancy-config/) setting; or disabling multi-tenancy with [dynamic configuration]({{site.url}}{{site.baseurl}}/security/multi-tenancy/dynamic-config/) settings.

These limitations will be addressed in upcoming releases.

## Enabling aggregate view for saved objects

By default, the aggregate view in the Saved Objects table is disabled. To enable the feature, add the `opensearch_security.multitenancy.enable_aggregation_view` flag to the `opensearch_dashboards.yml` file and set it to `true`:

`opensearch_security.multitenancy.enable_aggregation_view: true`

After enabling the feature you can start the new cluster and then launch Dashboards. 

## Working in aggregate view

Select the **Tenant** dropdown arrow to display the list of tenants available to the user. You can select multiple tenants while the menu is open. Each time you select a tenant in the menu, the list of saved objects is filtered by that tenant and any others with a check mark beside their name.

<img src="{{site.url}}{{site.baseurl}}/images/Security/Tenant_column.png" alt="Dashboards Saved Objects view with emphasis on Tenants column" width="500">
   
After you finish specifying tenants, select anywhere outside the menu to collapse it. 
* The Title column displays the names of the available saved objects. 
* The Tenant column displays the tenants associated with the saved objects. 
* Also, the number of tenants selected for filtering is shown in a red box beside the Tenant dropdown menu label.

<img src="{{site.url}}{{site.baseurl}}/images/Security/ten-filter-results.png" alt="Dashboards Saved Objects tenant filtering" width="700">

Use the **Type** dropdown menu to filter saved objects by type. The behavior of the **Type** dropdown menu is the same as the behavior of the **Tenant** dropdown menu.

### Selecting and working with a saved object

After identifying a saved object that you would like to work with, follow these steps to access the object:

1. Note the tenant associated with the object in the Tenant column.
1. In the upper-right corner of the window, open the user menu and select **Switch tenants**.
<br><img src="{{site.url}}{{site.baseurl}}/images/Security/switch_tenant.png" alt="Switching tenants in the user menu" width="425">
1. In the **Select your tenant** window, choose either the Global or Private option, or one of the custom tenant options, to specify the correct tenant. Select the **Confirm** button. The tenant becomes active and is displayed in the user menu.
1. After the tenant is active, you can use the controls in the Actions column to work with saved objects associated with the tenant.
<img src="{{site.url}}{{site.baseurl}}/images/Security/actions.png" alt="Actions column controls" width="700">

When a tenant is not active, you cannot use the Actions column controls to work with its associated objects. To work with those objects, follow the preceding steps to make the tenant active.
{: .note }

