---
layout: default
title: Drag and drop wizard (experimental feature)
nav_order: 15
---

# Build visualizations by  dragging and dropping fields

You can use the drag and drop visualization Wizard in OpenSearch Dashboards to create your data visualizations easily with just a few clicks or a single mouse gesture. 

The drag and drop visualization Wizard:

* Gives you immediate an view of your data without the need to preselect the visualization output 
* Gives you the flexibility to change visualization types and index patterns on the fly
* Gives you the ability to easily navigate between multiple screens 

Beginning with OpenSearch release 1.3, the drag and drop wizard is available as an experimental feature. We invite you to try the wizard and let us know how you feel about it.

<img src="{{site.url}}{{site.baseurl}}/images/drag-drop-ui.png" alt="Drag and drop user interface">

Experimental features may change, break, or disappear at any time and shouldn’t be enabled in production environments. {: .note }

# Enable the experimental features

To experiment with the drag and drop wizard, you first need to enable experimental visualizations in your OpenSearch playground:

1. Open [OpenSearch Dashboards playground](https://playground.opensearch.org/app/home#/).
2. Go to **Management** **>** **Stack Management** **>** **Advanced Settings**.
<img src="{{site.url}}{{site.baseurl}}/images/stack-managment-settings.png" alt="Stack management screenshot">
1. Go to **Visualization** and turn on **Enable experimental visualizations**.
<img src="{{site.url}}{{site.baseurl}}/images/enable-experimental-viz.png" alt="Enable experimental visualizations screenshot">

# Try out the drag and drop wizard or create a new visualization using Wizard

You can explore the drag and drop wizard using the [OpenSearch Wizard playground](https://playground.opensearch.org/app/wizard), or create a new visualization using the Wizard panel. 

The following steps walk you through creating a new visualization using Wizard:

1. Open [OpenSearch Dashboards playground](https://playground.opensearch.org/app/home#/).
2. Under the menu icon, select **Visualize** **>** **Create visualization** **>** **Wizard**.
<img src="{{site.url}}{{site.baseurl}}//images/drag-and-drop-viz-select.png" alt="Select Wizard visualization">   
3. Use sample data to add fields and generate a visualization.

Here’s an example visualization. Your visualization will look different depending on the sample data you select.

<img src="{{site.url}}{{site.baseurl}}/images/drag-drop-generated-viz.png" alt="Visualization generated using sample data in the Wizard">

# Related topics

* OpenSearch News, September 14, 2022
* [Drag and drop visualizations demo at OpenSearch Community Meeting, August 16, 2022](https://forum.opensearch.org/t/opensearch-community-meeting-2022-0816/10323)
* [OpenSearch News, March 17, 2022](https://opensearch.org/blog/releases/2022/03/launch-announcement-1-3-0/)