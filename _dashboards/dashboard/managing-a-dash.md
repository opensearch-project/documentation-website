---
layout: default
title: Managing dashboards
parent: Creating dashboards
nav_order: 40
has_children: false
---

# Managing dashboards

Manage dashboards in OpenSearch Dashboards from the **Dashboards** application main page, shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/dash-landing-page.png" alt="Dashboards landing page"  width="100%">

You can do the following:

- [Save a dashboard](#saving-a-dashboard).
- Create and edit a dashboard. See [Opening a dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/opening-a-dashboard/).
- [Export a dashboard to a file](#exporting-a-dashboard).
- [Delete dashboards](#deleting-dashboards).

## Saving a dashboard

You can save a newly created dashboard or save changes to an existing dashboard.

### Saving a new dashboard

To save a new dashboard, follow these steps:

1. In the application menu, select **Save**.

   The application displays the **Save dashboard** dialog.

1. Enter a title for the dashboard in the **Title** box.

1. (Optional) Enter a **Description**.

1. (Optional) To save the current time filter so it's applied when you reopen the dashboard, select **Store time with dashboard**.

1. Select **Save**.

### Saving an existing dashboard

You can save a dashboard at any time.

To save an existing dashboard:

1. Select **Save** in the upper right of the **Create** panel.

   The application displays the **Save dashboard** dialog. If you have previously saved the dashboard, the **Title** box contains the dashboard title.

1. (Optional) To change the dashboard name, enter a new title for the dashboard in the **Title** box.

   Saving an existing dashboard without selecting **Save as new dashboard** overwrites the previous state of the dashboard, even if you've renamed the dashboard.
   {: .warning}

1. (Optional) Update the **Description**.

1. (Optional) To leave the saved dashboard in its current state and save the changes as a new dashboard, select **Save as new dashboard**.

1. (Optional) To save the current time filter so it's applied when you reopen the dashboard, select **Store time with dashboard**.

1. Select the **Save** button.


## Exporting a dashboard

You can export a dashboard to a PDF file or PNG image file.

Exporting a dashboard is a Reporting feature. You must have the Reporting plugin active to export a file.
{: .note}

This feature requires the Reporting plugin. See [Reporting using OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/reporting/report-dashboard-index/) for more information about reporting.

1. Select **Reporting** from the application menu.

1. From the drop-down menu, select **Download PDF** or **Download PNG**.

   The application displays the **Generating report** dialog. The report can take several seconds to generate.

1. The report opens in your browser or downloads, depending on your browser preference.


## Deleting dashboards

To delete one or more dashboards, follow these steps:

1. In the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/navigating-ui/#navigating-opensearch-dashboards), select **OpenSearch Dashboards** > **Dashboards**.

1. From the list in the **Dashboards** table, select the checkbox next to all the dashboards you want to delete.

1. Choose the **Delete N Dashboards** button (where **N** is the number of checked boxes) to the left of the **Search** box in the **Dashboards** panel.

1. In the confirmation dialog, choose **Delete**.
