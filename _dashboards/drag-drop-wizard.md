---
layout: default
title: Using the drag-and-drop wizard
parent: Building data visualizations
nav_order: 100
canonical_url: https://docs.opensearch.org/latest/dashboards/visualize/visbuilder/
---

The drag-and-drop visualization wizard is an experimental feature in OpenSearch 2.3. Therefore, we do not recommend the use of the drag-and-drop wizard in a production environment. For updates on the progress of drag and drop, or if you want to leave feedback that could help improve the feature, see the [Drag and drop git issue](https://github.com/opensearch-project/OpenSearch-Dashboards/issues/2280). 
{: .warning}

# Using the drag-and-drop wizard

You can use the drag-and-drop visualization wizard in OpenSearch Dashboards to create your data visualizations easily with just a few clicks or a single mouse gesture. 

The drag-and-drop visualization wizard:

* Gives you an immediate view of your data without the need to preselect the visualization output. 
* Gives you the flexibility to change visualization types and index patterns quickly.
* Gives you the ability to easily navigate between multiple screens. 

<img src="{{site.url}}{{site.baseurl}}/images/drag-drop-ui.png" alt="Drag and drop user interface">

## Try out the wizard

You can try out the wizard locally or in the [OpenSearch playground](https://playground.opensearch.org/app/home#/).

### Try the wizard in OpenSearch playground

If you'd like to try out the wizard without installing OpenSearch locally, you can do so in the [OpenSearch Dashboards playground](https://playground.opensearch.org/app/wizard). The feature is enabled in the playground by default. 

### Try the wizard locally

To enable the drag-and-drop wizard in your local installation, add the following flag to the `opensearch_dashboards.yml` file:

```yml
wizard.enabled: true
```

Then confirm that the feature is enabled in OpenSearch Dashboards:

1. To open OpenSearch Dashboards:
    - If you're not running the security plugin, go to http://localhost:5601. 
    - If you're running the security plugin, go to https://localhost:5601 and log in with your username and password (default is admin/admin).

2. From the top menu, select **Management** **>** **Stack Management** **>** **Advanced Settings**.
   <img src="{{site.url}}{{site.baseurl}}/images/stack-management-settings.png" alt="Stack management menu" width="200">

3. Select **Visualization**. The **Enable experimental visualizations** option should be turned on.

<img src="{{site.url}}{{site.baseurl}}/images/enable-experimental-viz.png" alt="Enable experimental visualizations" width="550">

To get started, follow the steps below to create a new visualization using the wizard:

1. From the top menu, select **Visualize** **>** **Create visualization** **>** **Wizard**.

   <img src="{{site.url}}{{site.baseurl}}/images/drag-and-drop-viz-select.png" alt="Select Wizard visualization" width="350">  

1. Drag and drop field names from the left column into the Configuration panel to generate a visualization.

Here’s an example visualization. Your visualization will look different depending on your data and the fields you select.

<img src="{{site.url}}{{site.baseurl}}/images/drag-drop-generated-viz.png" alt="Visualization generated using sample data in the Wizard">

## Related topics

* [OpenSearch News, September 14, 2022](https://opensearch.org/)
* [Drag-and-drop visualizations demo at OpenSearch Community Meeting, August 16, 2022](https://forum.opensearch.org/t/opensearch-community-meeting-2022-0816/10323)
* [OpenSearch News, March 17, 2022](https://opensearch.org/blog/releases/2022/03/launch-announcement-1-3-0/)
