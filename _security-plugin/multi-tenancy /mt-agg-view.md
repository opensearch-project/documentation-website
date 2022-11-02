---
layout: default
title: Aggregate view for saved objects by tenant
parent: OpenSearch Dashboards multi-tenancy
nav_order: 10
---

# Dashboards aggregate view for saved objects by tenant

Aggregate view for saved objects is an experimental feature for OpenSearch 2.4. Therefore, we do not recommend enabling the feature for a production environment at this time. For updates on the progress of aggregate view for saved objects, or if you'd like to leave feedback that could help improve the feature, see the [Dashboards object sharing](https://github.com/opensearch-project/OpenSearch-Dashboards/issues/2249) GitHub issue. For a more comprehensive view of the proposed development of multi-tenancy, see the [Dashboards object sharing](https://github.com/opensearch-project/security/issues/1869) issue. 
{: .warning}

Aggregate view for saved objects allows a user who has access to multiple tenants to see all saved objects across the tenants—either created or shared by the user—in a single view without having to switch between tenants to do so. Aggregate view includes a Tenants column in the Saved Objects table that gives the user the option to select which tenants are visible and show the associated objects for each.

Once a user identifies the saved object of interest, the user can then switch to that tenant to access the object.

<img src="{{site.url}}{{site.baseurl}}/images/Security/Aggregate_view_saved_objects.png" alt="Dashboards Saved Objects view with tenant object aggregation" width="350">

As an experimental feature, Aggregate view of saved objects is kept behind a feature flag and must be enabled in the opensearch_dashboards.yml before the feature is made available.
{: .note }

### Potential use cases

- Users who have high write loads but do not have high search requirements and are comfortable with longer refresh times.
- Users with very high loads who want to add new nodes, as you do not need to index all nodes when adding a new node to the cluster.

This is the first step in a series of features designed to decouple reads and writes in order to lower compute costs.


