---
layout: default
title: Multi-tenancy aggregate view for saved objects
parent: OpenSearch Dashboards multi-tenancy
nav_order: 60
---

# Dashboards multi-tenancy aggregate view for saved objects

Aggregate view for saved objects is an experimental feature for OpenSearch 2.4. Therefore, we do not recommend enabling the feature for a production environment at this time. For updates on the progress of aggregate view for saved objects, or if you'd like to leave feedback that could help improve the feature, see the [Dashboards object sharing](https://github.com/opensearch-project/OpenSearch-Dashboards/issues/2249) GitHub issue. For a more comprehensive view of the proposed future development of multi-tenancy, see the [Dashboards object sharing](https://github.com/opensearch-project/security/issues/1869) issue.
{: .warning}

Aggregate view for saved objects allows a user who has access to multiple tenants to see all saved objects associated with those tenants in a single view without having to switch between tenants to do so. This includes both tenants created by the user and tenants shared with the user. Aggregate view introduces a Tenants column in the Saved Objects table that gives the user the option to filter by tenants and make visible their associated saved objects.

Once a user identifies a saved object of interest, the user can then switch to that tenant to work with the object.

To access saved objects, expand the top menu and select **Management > Stack Management > Saved Objects**. The Saved Objects window opens. By default, all tenants the user has permissions to are dispalayed along with all saved objects associated with the tenants.

<img src="{{site.url}}{{site.baseurl}}/images/Security/agg-view-saved-objects.png" alt="Dashboards Saved Objects view with tenant object aggregation" width="700">

As an experimental feature, Aggregate view of saved objects is kept behind a feature flag and must be enabled in the opensearch_dashboards.yml before the feature is made available. See Enabling aggregate view below for more on this.
{: .note }

### Feature benefits

- Implementing an aggregate view of all saved objects on one screen allows a user to quickly locate an object of interest and determine which tenant is associated with it. Once the user locates an object, the user can select the appropriate tenant and work with the object.
- This feature also adds a Tenants column to the Saved Objects table, which allows users to filter the view by tenants and their associated saved objects.

### Plans for future development

In subsequent releases, we plan to expand on the functionality of this feature to include the ability to perform actions directly from aggregate view and share items without having to first select a specific tenant. In the longer term, OpenSearch plans to evolve multi-tenancy so that it becomes a much more flexible tool for sharing objects among users and easier to do so by a more sophisticated way of assigning the roles and permissions that faciliate sharing. To learn more about the features being proposed for future releases, see the GitHub issue [Dashboards object sharing](https://github.com/opensearch-project/security/issues/1869).

### Known limitations

In this first experimental phase of development, there are some limitations that should be observed before enabling the feature and using it in a test environment.

* The feature can only be used in a new cluster. At this time, the feature is not suported by clusters already in use.
* Also, the feature should be used only in a test environment, not in production. 
* Finally, once the feature has been enabled and used in a test cluster, the feature cannot be disabled for the cluster. Disabling the feature once it has been used to work with tenants and saved objects can result in the loss of saved objects and have an impact on tenant-to-tenant functionality. 

These limitations will be addressed in upcoming releases.

## Enabling aggregate view for saved objects

By default, the aggregate view in the Saved Objects table is disabled. To enable the feature, add the `opensearch_security.multitenancy.enable_aggregation_view` flag to the `opensearch_dashboards.yml` and set it to `true`.

`opensearch_security.multitenancy.enable_aggregation_view: true`

After enabling the feature you can start the new cluster and then launch Dashboards. 

## Working in aggregate view

Select the drop-down arrow on the Tenants column to display the list of tenants available to the user. You can select multiple tenants while the menu is open.

<img src="{{site.url}}{{site.baseurl}}/images/Security/tenant_column.png" alt="Dashboards Saved Objects view with emphasis on Tenants column" width="500">

Select anywhere outside the menu to collapse it. The Title column displays the saved objects corresponding to the selected tenants. The Tenants column displays the tenants associated with the saved objects. Also, the number of tenants selected for filtering is expressed in a red box on the drop-down.

<img src="{{site.url}}{{site.baseurl}}/images/Security/ten-filter-results.png" alt="Dashboards Saved Objects tenant filtering" width="700">

Use the Type column to filter saved objects by type. The behavior for the drop-down is the same for the Tenants column drop-down.

### Selecting and working with a saved object

1. After identifying a saved object that you would like to work with, note the tenant associated with the object in the Tenants column. 
1. In the top right corner of the window, open the user menu and select **Switch tenants**.
<img src="{{site.url}}{{site.baseurl}}/images/Security/switch_tenant.png" alt="Switching tenants in the user menu" width="700">
1. In the **Select your tenant** window, choose from either the Global, Private, or custom tenant options to specify the correct tenant. Select the **Confirm** button. The tenant becomes active and is displayed in the user menu.
1. After the tenant is active, you can use the controls in the Actions column to work with saved objects associated with the tenant.

When a tenant is not active, you cannot use the Actions column controls to work with its associated objects. To work with those objects, follow the steps above to make the tenant active.
{: .note }

