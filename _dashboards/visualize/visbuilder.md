---
layout: default
title: Using VisBuilder
parent: Building data visualizations
nav_order: 100
redirect_from:
  - /dashboards/drag-drop-wizard/
---

# Using VisBuilder

You can use the VisBuilder visualization type in OpenSearch Dashboards to create data visualizations by using a drag-and-drop gesture. With VisBuilder you have:

* An immediate view of your data without the need to preselect the visualization output.
* The flexibility to change visualization types and index patterns quickly.
* The ability to easily navigate between multiple screens.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/vis-builder-2.png" alt="VisBuilder new visualization start page">

## Try VisBuilder in the OpenSearch Dashboards playground

If you'd like to try out VisBuilder without installing OpenSearch locally, you can do so in the [Dashboards playground](https://playground.opensearch.org/app/vis-builder#/). 

## Try VisBuilder locally

Follow these steps to create a new visualization using VisBuilder in your environment:

1. Open Dashboards:
    - If you're not running the Security plugin, go to http://localhost:5601.
    - If you're running the Security plugin, go to https://localhost:5601 and log in with your username and password (default is admin/admin).

1. From the top menu, select **Visualize > Create visualization > VisBuilder**.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboards/vis-builder-1.png" alt="Select the VisBuilder visualization type" width="550">  

1. Drag and drop field names from the left column into the **Configuration** panel to generate a visualization.

Here’s an example visualization. Your visualization will look different depending on your data and the fields you select.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/drag-drop-generated-viz.png" alt="Visualization generated using sample data">