---
layout: default
title: Get Started with OpenSearch Dashboards
nav_order: 1
has_children: false
has_toc: false
redirect_from:
  - /docs/opensearch-dashboards/
  - /dashboards/
---

{%- comment -%}The `/docs/opensearch-dashboards/` redirect is specifically to support the UI links in OpenSearch Dashboards 1.0.0.{%- endcomment -%}

# Overview of OpenSearch Dashboards

OpenSearch Dashboards is an integrated visualization tool that makes it easy for users to explore their data in OpenSearch. From real-time application monitoring, threat detection, and incident management to personalized search, OpenSearch Dashboards gives you the data visualizations needed to graphically represent trends, outliers, and patterns in data. 

The OpenSearch suite provides [core plugins]({{site.url}}{{site.baseurl}}/opensearch/install/plugins/) to help index, secure, monitor, and analyze your data. Most OpenSearch plugins have corresponding [OpenSearch Dashboards plugins]({{site.url}}{{site.baseurl}}/dashboards/install/plugins/) to extend and customize dashboard features.

##### Example: Data visualizations in OpenSearch Dashboards  

<img src="{{site.url}}{{site.baseurl}}/images/dashboard-flight.png" alt="User interface showing several data visualizations">

# Use cases for real-time search and log analytics at scale 

 OpenSearch is powered by the Apache Lucene search library, and it supports a number of search and analytics capabilities, such as k-nearest neighbors (k-NN) search, SQL, anomaly detection, trace analytics, full-text search, and more.  

##### Example: Data visualization use cases   

<table style="table-layout: fixed; width: 100%;">
<tbody>
<tr>
<td style="text-align: center; vertical-align: top; font-weight: bold; width: 100%;">Visualize log and trace data with interactive log analytics.<img src="{{site.url}}{{site.baseurl}}/images/visualize-log-data.png" alt="Log analytics" /></td>
<td style="text-align: center; vertical-align: top; font-weight: bold; width: 100%;">Detect and mitigate issues faster with anomaly detection.<img src="{{site.url}}{{site.baseurl}}/images/anomaly-detection.png" alt="Anomaly detection" /></td>
</tr>
<tr>
<td style="text-align: center; vertical-align: top; font-weight: bold; width: 100%;">Diagnose performance issues and reduce application downtime using the observability interface and log monitoring features.<img src="{{site.url}}{{site.baseurl}}/images/observability.png" alt="Observability interface and log monitoring features" /></td>
<td style="text-align: center; vertical-align: top; font-weight: bold; width: 100%;">Unlock real-time search, monitoring, and analysis of business and operational data.<img src="{{site.url}}{{site.baseurl}}/images/analyzing-data-logs.png" alt="Real-time search, monitoring, and analysis" /></td>
</tr>
</tbody>
</table> 

# Explore the OpenSearch Dashboards playground

You can interact with the three demonstration datasets in the OpenSearch Dashboards playground by following the steps below:

1. Go to the [OpenSearch Dashboards playground](https://playground.opensearch.org/app/home).
2. Choose **OpenSearch Dashboards > Dashboard**. 
3. Explore the datasets **[Flights] Global Flight Dashboard**, **[Logs] Web Traffic**, and **[eCommerce] Revenue Dashboard**.
4. Interact with the data on a dashboard. Choose **Add filter** at top left, and then choose a field that you want to filter, along with an operator and a value.  

##### Example: [Logs] Web Traffic dashboard with filters applied

<img src="{{site.url}}{{site.baseurl}}/images/log-dashboard-filter.png" alt="Logs web traffic dashboard with filters applied">

# Next steps 

You can run OpenSearch Dashboards on a local host after installing OpenSearch. See [Install and configure OpenSearch]({{site.url}}{{site.baseurl}}/opensearch/install/index/) and [Install and configure OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/install/index/) for installation instructions.  

# Related links
- [OpenSearch Frequently Asked Questions]({{site.url}}{{site.baseurl}}/faq/)
- [Install and configure OpenSearch]({{site.url}}{{site.baseurl}}/opensearch/install/index/)
- [Upgrade from Kibana OSS to OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/upgrade-to/dashboards-upgrade-to/)
- [OpenSearch Dashboards Developer Guide](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/DEVELOPER_GUIDE.md)