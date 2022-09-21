---
layout: default
title: Install OpenSearch Dashboards
nav_order: 2
has_children: true
redirect_from:
  - /dashboards/install/
---

# Install and configure OpenSearch Dashboards

OpenSearch Dashboards has three installation options at this time: Docker images, tarballs, and Helm charts.
## Using sample data

To get a first look at how OpenSearch Dashboards works, you can explore using the following sample data:

* Global flight data
* Revenue data
* Web traffic data

In this tutorial you will create a simple dashboard using the sample flight data.

1. Start OpenSearch Dashboards. You can access it at port 5601. For example, http://localhost:5601.
1. Log in with the default username `admin` and password `admin`.
1. Choose **Try our sample data** and add the sample flight data.
1. Choose **Discover** and search for a few flights.
1. Choose **Dashboard**, **[Flights] Global Flight Dashboard**. You have created a dashboard.

![Dashboard using flight sample data and showing all visualization types](../images/sample-flight-dashboard.png)