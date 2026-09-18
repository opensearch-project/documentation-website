---
layout: default
title: Tutorial
parent: Dashboard sections
grand_parent: Creating dashboards
nav_order: 10
---

# Tutorial: Organizing a dashboard with sections
**Introduced 3.9**
{: .label .label-purple }

This tutorial walks you through organizing an existing dashboard into sections using the sample e-commerce dataset. You will create sections, move panels between them, rename sections, and collapse a section to reduce clutter.

## Prerequisites

Before starting this tutorial, ensure the following:

- Dashboard sections are enabled. For more information, see [Enabling dashboard sections]({{site.url}}{{site.baseurl}}/dashboards/dashboard/dashboard-sections/#enabling-dashboard-sections).
- The sample e-commerce dataset is loaded. To load it, navigate to the OpenSearch Dashboards home page, select **Add sample data**, and then select **Add data** for the **Sample eCommerce orders** panel.

## Step 1: Open the sample dashboard

1. In the left navigation, select **Dashboards**.
1. Select **[eCommerce] Revenue Dashboard** to open it.
1. Select the **Edit** toggle in the toolbar to enter edit mode.

The following image shows the e-commerce dashboard with all panels in a flat layout.

![Step 1: Open the sample dashboard]({{site.url}}{{site.baseurl}}/images/dashboard-sections/tutorial-step1-open-dashboard.png)

## Step 2: Create the first section

1. In the toolbar, select **Add**.
1. Select **Section**.

All existing panels are automatically grouped into a new section named "Section 1". This preserves the current layout so that no panels are lost.

![Step 2: First section created]({{site.url}}{{site.baseurl}}/images/dashboard-sections/dashboard-with-sections.png)

## Step 3: Rename the section

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/kebab-icon.png" class="inline-icon" alt="kebab icon"/>{:/} (kebab) icon on the **Section 1** header.
1. Select **Rename**.
1. Enter `Revenue and trends` and confirm.

![Step 3: Rename section]({{site.url}}{{site.baseurl}}/images/dashboard-sections/tutorial-step3-rename.png)

## Step 4: Add a second section

1. In the toolbar, select **Add** > **Section**. A new empty section appears below the first section.

   Because the original "Section 1" was renamed to "Revenue and trends" in the previous step, the new section is also named "Section 1".

1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/kebab-icon.png" class="inline-icon" alt="kebab icon"/>{:/} (kebab) icon on the **Section 1** header.
1. Select **Rename**.
1. Enter `Customer breakdown` and confirm.

![Step 4: Two sections on the dashboard]({{site.url}}{{site.baseurl}}/images/dashboard-sections/tutorial-step4-second-section.png)

## Step 5: Move panels between sections

Move the customer-related panels to the "Customer breakdown" section:

1. On the **[eCommerce] Sales by Gender** panel, select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/gear-icon.png" class="inline-icon" alt="gear icon"/>{:/} (gear) icon in the upper-right corner.
1. Select **Move to section**.
1. In the dialog, select **Customer breakdown** and confirm.
1. Repeat for the following panels:
   - **[eCommerce] Sales Count Map**
   - **[eCommerce] Top Selling Products**

The following image shows the **Move to section** dialog.

![Step 5: Move panel to section]({{site.url}}{{site.baseurl}}/images/dashboard-sections/move-to-section-modal.png)

## Step 6: Collapse a section

1. Select the arrow to the left of the **Customer breakdown** section title.

The section collapses, hiding its panels. Only the section header remains visible. The collapsed panels do not fetch data, which reduces the number of search requests to the OpenSearch cluster.

![Step 6: Collapsed section]({{site.url}}{{site.baseurl}}/images/dashboard-sections/collapse-expand.png)

## Step 7: Save the dashboard

1. Select **Save** in the toolbar to persist the section layout.

![Step 7: Save the dashboard]({{site.url}}{{site.baseurl}}/images/dashboard-sections/tutorial-step7-save.png)

## Result

Your e-commerce dashboard is now organized into two collapsible sections. You can expand, collapse, and reorder sections independently. Panels within each section can still be resized and rearranged by dragging.

To add more sections or undo the section layout entirely, see [Managing dashboard sections]({{site.url}}{{site.baseurl}}/dashboards/dashboard/dashboard-sections/managing-sections/).
