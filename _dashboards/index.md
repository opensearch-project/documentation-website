---
layout: default
title: Getting Started with OpenSearch Dashboards
nav_order: 1
has_children: false
has_toc: false
redirect_from:
  - /docs/opensearch-dashboards/
  - /dashboards/
---

{%- comment -%}The `/docs/opensearch-dashboards/` redirect is specifically to support the UI links in OpenSearch Dashboards 1.0.0.{%- endcomment -%}

# What is OpenSearch Dashboards?

OpenSearch Dashboards is the preferred visualization platform for analyzing data in OpenSearch. It serves as the user interface for many openSearch features, including security, alerting, index state management, SQL, and more.

Out-of-the-box OpenSearch Dashboards includes several tools for discovering and visualizing data, and OpenSearch provides a full suite of plugins that you can use to monitor events, identify trends, and automate recurring activities.

![Sample dashboards]({site.url}}{{site.baseurl}}/images/dashboards-example.png)

# Try OpenSearch Dashboards
You can try OpenSearch Dashboards' features in the [OpenSearch Dashboards Playground](https://playground.opensearch.org/app/home).

Choose **OpenSearch Dashboards > Dashboards > Create dashboard** and explore the sample Global Flight, Web Traffic, and Revenue dashboards.

![Dashboards playground screenshot]({site.url}}{{site.baseurl}}/images/dashboards-playground.png)

# OpenSearch Dashboards for your use case

OpenSearch Dashboards gives users the ability to organize their logs, traces, and visualizations in an application-centric view.  

![Use case examples]({site.url}}{{site.baseurl}}/images/use-cases-get-started.jpg)

# Install OpenSearch Dashboards

After installing OpenSearch, you can install OpenSearch Dashboards, with different installation methods to choose from. For more information, see [OpenSearch Installation Instructions](https://opensearch.org/docs/latest/opensearch/install/index/).

# Create a dashboard using sample data

Use the following steps to create a dashboard using sample data. 

1. After installing OpenSearch Dashboards, open it at [http://localhost:5601](http://localhost:5601/app/home#/).
2. Select **Add sample data**, and select **Add data** for the sample  flight data dataset. 
3. From the top menu, choose **Discover** and search for a few flights.
4. Choose **Dashboard**, **[Flights]** Global Flight Dashboard.

You have now created a dashboard, which may look different than the example below.

![Sample dashboard using flight sample data]({site.url}}{{site.baseurl}}/images/flight-dashboards.png)

# Compatibility with Elasticsearch
You can use OpenSearch Dashboards with an Elasticsearch backend 7.10 or lower. Elastic users may benefit from Dashboards' additional functionality provided by a growing ecosystem of OpenSearch plugins. For more information, see the [feature comparison of Opensearch Dashboards and Kibana](_{{site.url}}{{site.baseurl}}_). See [Upgrade from Kibana OSS to OpenSearch Dashboards](https://opensearch.org/docs/latest/upgrade-to/dashboards-upgrade-to/) for instructions to switch to OpenSearch Dashboards.