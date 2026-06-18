---
layout: default
title: Controls
parent: Creating visualizations in the Visualize application
grand_parent: Building data visualizations
nav_order: 50
redirect_from:
  - /dashboards/visualize/controls/
---

# Controls
**Experimental**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

A controls visualization adds interactive filter panels to a dashboard. Controls let you filter data without modifying the dashboard itself.

Controls do not require a data source. You configure the data source within each individual control.

## When to use controls

Use controls to filter data within a dashboard. Many visualizations have data selection filtering built in. Use controls with visualizations that don't already offer data selection or to enhance the data selection capability of an existing visualization.

## Control types

Two types of controls are available:

- **Range slider**: Defines minimum and maximum values for a numeric field.
- **Options list**: Provides a dropdown to select values from a field.

## Creating a controls visualization

To create a controls visualization, follow these steps:

1. In the **New Visualization** dialog, select **Controls**.
2. Select the **Controls** tab.
3. From the **Type** dropdown, select **Range slider** or **Options list**.
4. Select **Add**.

The following image shows a controls visualization with two Options list controls (Origin City and Destination City) and one Range slider control (Average Ticket Price).

![Controls visualization with dropdown and range slider]({{site.url}}{{site.baseurl}}/images/dashboards/controls-example.png)

### Configuring a range slider

1. In **Control Label**, enter the label that appears on the control.
2. From **Index Pattern**, select the data source.
3. From **Field**, select a numeric field.
4. (Optional) Set a **Step Size** (minimum increment) and **Decimal Places**.
5. Select **Update**.

### Configuring an options list

1. In **Control Label**, enter the label that appears on the control.
2. From **Index Pattern**, select the data source.
3. From **Field**, select the field to filter by.
4. (Optional) Enable **Multi-select** to allow selecting multiple values.
5. (Optional) Enable **Dynamic Options** to automatically scale the dropdown items (text fields only).
6. If **Dynamic Options** is disabled, set the **Size** (number of items shown).

   The control displays only the top **Size** values, as determined by the data field's sorting method.
   {: .note}

7. Select **Update**.

You can add multiple controls to a single visualization by repeating the steps.

## Next steps

- To choose a different visualization type, see [Choosing a visualization type]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/viz-types/).
- To add this visualization to a dashboard, see [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
