---
layout: default
title: Saved objects
parent: Dashboards management
has_children: true
nav_order: 12
---

# Saved objects

_Saved objects_ are the OpenSearch Dashboards resources that you create and reuse, including visualizations, dashboards, saved searches, index patterns, and maps. Export them to a file and import that file into another instance to copy a dashboard from a development cluster to a production one, to move objects between tenants or workspaces, or to keep a backup of your visualizations.

Objects depend on each other: a dashboard references its visualizations, and a visualization references its index pattern. Export an object together with the objects it references so that the export can be imported into an instance that does not already contain them.

To perform these tasks programmatically, for example as part of a CI/CD pipeline, see [Saved Objects APIs]({{site.url}}{{site.baseurl}}/dashboards/management/saved-objects-api/).

## Exporting saved objects

To export specific objects, such as one dashboard and everything it displays, follow these steps:

1. On the top menu, go to **Management** > **Dashboards Management** > **Saved objects**.
1. Select the checkbox for each object to export. To narrow the list, enter a title in the search box or filter by **Type**.
1. Select **Export**.
1. Keep **Include related objects** selected so that the export also contains the objects that the selected objects reference.
1. Select **Export** to download the file.

To export the full contents of an instance, select **Export all objects**, choose the types to include, and then select **Export**.

The downloaded file uses the NDJSON format, with one object per line and a summary on the final line. This is the same format that the [Export Saved Objects API]({{site.url}}{{site.baseurl}}/dashboards/management/saved-objects-api/#export-saved-objects) produces, so a file exported from OpenSearch Dashboards can be imported using the API and a file exported using the API can be imported from OpenSearch Dashboards.

To review what an object references before you export it, select the **Relationships** action for that object.

When multi-tenancy is enabled, each tenant has its own set of saved objects, and an export contains only the objects of the tenant that you are currently using. This applies to **Export all objects**, so to capture every object in an instance, switch to each tenant and export it separately. When the aggregate view is enabled, the list can show the objects of several tenants at once, but filtering the list by tenant does not change what an export contains. For more information, see [OpenSearch Dashboards multi-tenancy aggregate view for saved objects]({{site.url}}{{site.baseurl}}/security/multi-tenancy/mt-agg-view/).

When workspaces are enabled, an export that you start from within a workspace contains only the objects associated with that workspace. An export that you start from **Saved objects** outside any workspace covers every workspace: the list includes the objects of all workspaces that you can access, marks each one in the **Workspace** column, and **Export all objects** writes all of them to the file.

To copy objects to another workspace in the same instance rather than export them, select the objects, select **Copy to**, and choose the target workspace. To copy every object in the current workspace, select **Copy all objects to**. To perform the same task programmatically, see [Duplicate Saved Objects Workspaces API]({{site.url}}{{site.baseurl}}/dashboards/workspace/apis/#duplicate-saved-objects-workspaces-api).

## Importing saved objects

To import saved objects, follow these steps:

1. On the top menu, go to **Management** > **Dashboards Management** > **Saved objects**.
1. Select **Import**.
1. Select **Select file** and choose the NDJSON file to import.
1. In **Import options**, choose how to handle objects that already exist:
   - **Create new objects with unique IDs** imports the objects as copies and leaves the existing objects unchanged.
   - **Check for existing objects** compares the incoming objects with the objects already in the instance. Combine it with **Automatically overwrite conflicts** to replace existing objects, or with **Request action on conflict** to decide for each conflict.
1. Select **Import**, and then select **Done**.

If an object refers to an index pattern that the target instance does not have, OpenSearch Dashboards lists the affected objects and prompts you to select a different index pattern or create one.

When multi-tenancy is enabled, the objects are imported into the tenant that you are currently using, so switch to the target tenant before you import.

When workspaces are enabled, **Import** appears only within a workspace, and the imported objects are associated with that workspace. Open the target workspace before you import.

## Copying a dashboard to another instance

To move a dashboard between two instances that index the same data, follow these steps:

1. In the source instance, go to **Management** > **Dashboards Management** > **Saved objects** and select the checkbox for the dashboard.
1. Select **Export**, keep **Include related objects** selected, and then select **Export**. The file contains the dashboard, its visualizations and saved searches, and their index patterns.
1. In the target instance, go to **Management** > **Dashboards Management** > **Saved objects** and select **Import**.
1. Select the downloaded file, choose an import option, and then select **Import**.

Tenants and workspaces determine which objects each step covers. Select the source tenant or workspace before you export and the target tenant or workspace before you import. For more information, see [Exporting saved objects](#exporting-saved-objects) and [Importing saved objects](#importing-saved-objects).

## Limitations

An import from OpenSearch Dashboards accepts an `.ndjson` file, and it also accepts a legacy `.json` file exported by a version of OpenSearch Dashboards or Kibana that predates NDJSON. Support for `.json` files is deprecated, and the Saved Objects APIs accept only `.ndjson`. Re-export legacy files before you use them with the API.

A single export or import is limited to 10,000 objects and to a request size of 25 MB. For the settings that control these limits, and for other caveats that apply to both OpenSearch Dashboards and the API, see [Limitations]({{site.url}}{{site.baseurl}}/dashboards/management/saved-objects-api/#limitations).
