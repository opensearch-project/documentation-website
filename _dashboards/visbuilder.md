---
layout: default
title: VisBuilder
nav_order: 8
---

# VisBuilder

VisBuilder is an experimental feature and shouldn't be used in a production environment. For updates on the feature's progress, or if you want to leave feedback that helps improve the feature, see the [git issue](https://github.com/opensearch-project/OpenSearch-Dashboards/issues/2280).
{: .warning}

You can use the VisBuilder visualization type in OpenSearch Dashboards to create data visualizations easily using a drag-and-drop gesture. With VisBuilder you have:

* an immediate view of your data without the need to preselect the visualization output
* the flexibility to change visualization types and index patterns quickly
* the ability to easily navigate between multiple screens

<img src="{{site.url}}{{site.baseurl}}/images/drag-drop-ui.png" alt="VisBuilder start screen">

## Try out VisBuilder

You can try out VisBuilder in your environment or in the [OpenSearch playground](https://playground.opensearch.org/app/home#/).

### Try VisBuilder in the playground

If you'd like to try out VisBuilder without installing OpenSearch locally, you can do so in the [Dashboards playground](https://playground.opensearch.org/app/wizard). The visualization type is enabled in the playground by default.

### Try VisBuilder locally

VisBuilder is enabled by default in the `opensearch_dashboards.yml` file:

```
# Set the value of this setting to false to disable VisBuilder
# functionality in Visualization.
vis_builder.enabled: true
```

Follow these steps to create a new visualization using VisBuilder in your environment:

1. Open Dashboards:
    - If you're not running the security plugin, go to http://localhost:5601.
    - If you're running the security plugin, go to https://localhost:5601 and log in with your username and password (default is admin/admin).

2. Confirm the **Enable experimental visualizations** option is turned on.
   - From the top menu, select **Management** **>** **Stack Management** **>** **Advanced Settings**.
   - Select **Visualization** and verify the option is turned on. 
   
   <img src="{{site.url}}{{site.baseurl}}/images/enable-experimental-viz.png" alt="Enable experimental visualizations" width="550">

3. From the top menu, select **Visualize** **>** **Create visualization** **>** **Wizard**.

   <img src="{{site.url}}{{site.baseurl}}/images/drag-and-drop-viz-select.png" alt="Select the Wizard visualization type" width="350">  

4. Drag and drop field names from the left column into the **Configuration** panel to generate a visualization.

Here’s an example visualization. Your visualization will look different depending on your data and the fields you select.

<img src="{{site.url}}{{site.baseurl}}/images/drag-drop-generated-viz.png" alt="Visualization generated using sample data">

## Related topics

* [OpenSearch News, September 14, 2022](https://opensearch.org/)