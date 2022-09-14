---
layout: default
title: Drag and drop wizard
nav_order: 8
---

The drag and drop visualization wizard an experimental feature with OpenSearch 2.3. Therefore, we do not recommend the use of drag and drop wizard in a production environment. For updates on the progress of drag and drop or if you want leave feedback that could help improve the feature, see the [Drag and drop git issue](https://github.com/opensearch-project/OpenSearch-Dashboards/issues/1157). 
{: .warning}

# Drag and drop wizard

You can use the drag and drop visualization wizard in OpenSearch Dashboards to create your data visualizations easily with just a few clicks or a single mouse gesture. 

The drag and drop visualization wizard:

* Gives you an immediate view of your data without the need to preselect the visualization output 
* Gives you the flexibility to change visualization types and index patterns on the fly
* Gives you the ability to easily navigate between multiple screens 

<img src="{{site.url}}{{site.baseurl}}/images/drag-drop-ui.png" alt="Drag and drop user interface">


## Enable the wizard

To experiment with the drag and drop wizard, you first need to enable experimental visualizations in your OpenSearch playground:

1. Open [OpenSearch Dashboards playground](https://playground.opensearch.org/app/home#/).
2. Go to **Management** **>** **Stack Management** **>** **Advanced Settings**.
<img src="{{site.url}}{{site.baseurl}}/images/stack-managment-settings.png" alt="Stack management screenshot">
1. Go to **Visualization** and turn on **Enable experimental visualizations**.
<img src="{{site.url}}{{site.baseurl}}/images/enable-experimental-viz.png" alt="Enable experimental visualizations screenshot">

## Create new visualization in OpenSearch Dashboards playground

You can explore the drag and drop wizard directly from the [OpenSearch Dashboards playground](https://playground.opensearch.org/app/wizard), or you can create a new visualization and select wizard. 

The following steps walk you through creating a new visualization using the wizard:

1. Open [OpenSearch Dashboards playground](https://playground.opensearch.org/app/home#/).

2. Under the menu icon, select **Visualize** **>** **Create visualization** **>** **Wizard**.

   <img src="{{site.url}}{{site.baseurl}}//images/drag-and-drop-viz-select.png" alt="Select Wizard visualization">  

3. Use sample data to add fields and generate a visualization.

Here’s an example visualization. Your visualization will look different depending on the sample data you select.

<img src="{{site.url}}{{site.baseurl}}/images/drag-drop-generated-viz.png" alt="Visualization generated using sample data in the Wizard">

## Related topics

* [OpenSearch News, September 14, 2022](https://opensearch.org/)
* [Drag and drop visualizations demo at OpenSearch Community Meeting, August 16, 2022](https://forum.opensearch.org/t/opensearch-community-meeting-2022-0816/10323)
* [OpenSearch News, March 17, 2022](https://opensearch.org/blog/releases/2022/03/launch-announcement-1-3-0/)