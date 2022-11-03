---
layout: default
title: Multi-tenancy aggregate view for saved objects
parent: OpenSearch Dashboards multi-tenancy
nav_order: 10
---

# Dashboards multi-tenancy aggregate view for saved objects

Aggregate view for saved objects is an experimental feature for OpenSearch 2.4. Therefore, we do not recommend enabling the feature for a production environment at this time. For updates on the progress of aggregate view for saved objects, or if you'd like to leave feedback that could help improve the feature, see the [Dashboards object sharing](https://github.com/opensearch-project/OpenSearch-Dashboards/issues/2249) GitHub issue. For a more comprehensive view of the proposed future development of multi-tenancy, see the [Dashboards object sharing](https://github.com/opensearch-project/security/issues/1869) issue. 
{: .warning}

Aggregate view for saved objects allows a user who has access to multiple tenants to see all saved objects associated with those tenants in a single view without having to switch between tenants to do so. This includes both tenants created by the user and tenancts shared with the user. Aggregate view introduces a Tenants column in the Saved Objects table that gives the user the option to filter by tenants and make visible their associated saved objects.

Once a user identifies a saved object of interest, the user can then switch to that tenant to access the object.

To access saved objects, expand the top menu and select **Management > Stack Management > Saved Objects**. The Saved Objects window opens.

<img src="{{site.url}}{{site.baseurl}}/images/Security/Aggregate_view_saved_objects.png" alt="Dashboards Saved Objects view with tenant object aggregation" width="350">

As an experimental feature, Aggregate view of saved objects is kept behind a feature flag and must be enabled in the opensearch_dashboards.yml before the feature is made available. See Enabling aggregate view below for more on this.
{: .note }

## Feature benefits

- Implementing an aggregate view of all saved objects on one screen allows a user to quickly locate an object of interest and determine which tenant is associated with it. Once the user locates an object, the user can select the appropriate tenant and work with the object.
- This feature also adds a Tenants column to the Saved Objects table, which allows users to filter the view by tenants and their associated saved objects.

## Plans for future development

In subsequent releases, we plan to expand on the functionality of this feature to include performing actions directly from aggregate view and sharing items without having to first select a specific tenant. In the longer term, OpenSearch plans to evolve multi-tenancy so that it becomes a much more flexible tool for sharing objects among users and easier to do so by a more sophisticated way of assigning the roles and permissions that faciliate sharing. To learn more about the features being proposed for future releases, see the GitHub issue [Dashboards object sharing](https://github.com/opensearch-project/security/issues/1869).


## Enabling aggregate view for saved objects

By default, the aggregate view in the Saved Objects table is disabled. To enable the feature, add the `opensearch_security.multitenancy.enable_aggregation_view` flag to the `opensearch_dashboards.yml` and set it to `true`.

`opensearch_security.multitenancy.enable_aggregation_view: true`

## Working in aggregate view

Select the drop-down arrow on the Tenants column to display the list of tenants available to the user. You can select one or more tenants to filter which saved objects are displayed, according to tenant/object associations.

<img src="{{site.url}}{{site.baseurl}}/images/Security/Tenant_column.png" alt="Dashboards Saved Objects view with emphasis on Tenants column" width="350">

