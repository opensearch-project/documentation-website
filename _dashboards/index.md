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

# Overview of OpenSearch Dashboards

OpenSearch Dashboards is an open-source, integrated visualization tool that makes it easy for users to explore their data in OpenSearch. From real-time application monitoring, threat detection, and incident management to personalized search, OpenSearch Dashboards gives you the data visualizations needed to graphically represent trends, outliers, and patterns in your data.

##### Example: Data visualizations in OpenSearch Dashboards  

<img src="{{site.url}}{{site.baseurl}}/images/dashboard-flight.png" alt="User interface showing several data visualizations">

# Requirements

To use OpenSearch Dashboards, you must have installed OpenSearch. To learn more about installing and configuring OpenSearch, see [Getting Started with OpenSearch]({{site.url}}{{site.baseurl}}).

# Example use cases for OpenSearch Dashboards 

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

You can interact with the demonstration datasets in the OpenSearch Dashboards playground by following the steps below:

1. Go to the [OpenSearch Dashboards playground](https://playground.opensearch.org/app/home).
2. Choose **OpenSearch Dashboards > Dashboard**. 
3. Explore the available datasets and select one: **[Flights] Global Flight Dashboard**, **[Logs] Web Traffic**, or **[eCommerce] Revenue Dashboard**.
4. Interact with the data on a dashboard. Choose **Add filter**. 
5. Specify the data you'd like to see. Select one of the options from the **Field** menu, and specify an **Operator** to filter the results.  

##### Example: [Logs] Web Traffic dashboard with filters applied

<img src="{{site.url}}{{site.baseurl}}/images/log-dashboard-filter.png" alt="Logs web traffic dashboard with filters applied">

# Next steps 

You can run OpenSearch Dashboards on a local host after installing OpenSearch. See [Install and configure OpenSearch]({{site.url}}{{site.baseurl}}/opensearch/install/index/) and [Install and configure OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/install/index/) for installation instructions.  

# Related links
- [Install and configure OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/install/index/)
- [Launch Highlight: OpenSearch Playground](https://www.opensearch.org/blog/community/2022/10/opensearch-playground/)
- [Upgrade from Kibana OSS to OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/upgrade-to/dashboards-upgrade-to/)
- [OpenSearch Frequently Asked Questions]({{site.url}}{{site.baseurl}}/faq/)
- [OpenSearch Dashboards Developer Guide](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/DEVELOPER_GUIDE.md)