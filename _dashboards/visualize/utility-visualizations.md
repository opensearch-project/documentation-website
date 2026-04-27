---
layout: default
title: Building utility visualizations
parent: Building data visualizations
nav_order: 60
has_children: false
has_toc: false
---

# Building utility visualizations

Utility visualizations don't display data, but support other data visualizations in the context of a [dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard/). Utility visualizations include the following visualizations:

**Markdown** | **Control**
[<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-markdown-icon.png" width="90" height="90" alt=" icon">](#building-a-markdown-visualization) | [<img src="{{site.url}}{{site.baseurl}}/images/icons/vis-controls-icon.png" width="90" height="90" alt=" icon">](#building-a-control-visualization)
Display static text. | One of:<br/>- **Range slider**: Define minimum and maximum values.<br/>**Options list**: Choose distinct values.

Instructions for each follow.


## Building a Markdown visualization

You can create a visualization containing static, formatted text using Markdown.

The Markdown visualization displays no data. Use it to present titles, labels, and explanatory text in dashboards.

To create a Markdown visualization:

1. Open a new visualization of type Markdown. See [Creating a new visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/new-viz/).

1. Select the **Data** tab.

1. In the **Markdown** box in the **Data** tab, enter the Markdown text you want the visualization to display.

1. (Optional) Change the display options.

   1. Select the **Options** tab.

   1. Use the slider or the combo box to change the base font size.

   1. Select **Open links in new tab** to toggle the windowing behavior of links in the Markdown text.

1. Select **Update** in the lower right of the visualization tool to view the rendered Markdown in the display panel.

1. When you are satisfied with the appearance of the visualization, save it. See [Saving a visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/saving-a-viz/).

## Building a control visualization

A control visualization contains one or more of the following:

- **Range slider**: A slider with text boxes at either end to enter minimum and maximum values. Commonly used in shopping apps to define a price range, for example.
- **Options list**: A drop-down from which you can select values of a field. Commonly used to select categories from a text field, but can be used for any type of data including numerical.

Use a control visualization to enable users to filter data within a dashboard.

Many visualizations have data selection filtering built in. Use controls with visualizations that don't already offer data selection or to enhance the data selection capability of an existing visualization.
{: .note}

To build a control visualization:

1. Open a new visualization of type Control. See [Creating a new visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/new-viz/).

1. Select the **Controls** tab.

1. From the type drop-down, select **Range slider** or **Options list**.

1. Select **Add**.

1. Set up the control.

   For a range slider:

   1. In the **Control Label** box, enter a label that will appear on the control.

   1. From the **Index Pattern** drop-down, select the data source for which you're creating the control.

   1. (Optional) In the **Step Size** box, change the minimum incremental change to the data value.

   1. (Optional) In the **Decimal Places** box, change the number of decimal places represented in the control display.

   For an options list:

   1. In the **Control Label** box, enter a label that will appear on the control.

   1. From the **Index Pattern** drop-down, select the data source for which you're creating the control.

   1. From the **Field** drop-down, select the data field from which to select the data range.
   
   1. (Optional) To enable selection of more than one value at a time, select **Multiselect**.

   1. (Optional) To automatically scale the number of items in the drop-down, select Dynamic Options. You can only do this if the data field type is text data.

   1. If **Dynamic Options** is deselected, choose the number of items that will appear in the control drop-down in the **Size** drop-down.

      The control will display only the top **Size** values in the control, as determined by the data field's sorting method.
      {: .note}

1. Select **Update** in the lower right of the visualization tool to view the rendered control in the display panel.

1. You can add more than one control to a control visualization. To add another control:

   1. From the type drop-down, select **Range slider** or **Options list**.

   1. Select **Add**.

   1. Finish defining the control as described previously.

1. When you are satisfied with the appearance of the visualization, save it. See [Saving a visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/saving-a-viz/).


## Next steps

Add the saved visualization to a dashboard. See [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).