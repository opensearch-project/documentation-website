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

OpenSearch Dashboards is the preferred visualization platform for analyzing data in OpenSearch. and is the user interface for many OpenSearch features. From real-time application monitoring, threat detection, and incident management to personalized search experience, OpenSearch Dashboards gives you data visualization tools to tell your data story.      

Out-of-the-box OpenSearch Dashboards includes several tools for discovering and visualizing data, and the OpenSearch suite provides [plugins](https://opensearch.org/docs/latest/dashboards/install/plugins/) to extend and customize dashboard features and functions. 

<img src="{{site.url}}{{site.baseurl}}/images/get-started-dashboards.png)" alt="OpenSearch Dashboards visualizations"/>

# OpenSearch Dashboards use cases

OpenSearch Dashboards makes it easy makes it easy for you to perform interactive log analytics, real-time application monitoring, website search, and more.  

<table>
<tbody>
<tr>
<td style="text-align: center; vertical-align: top;">Visualize log and trace data with interactive log analytics<img src="{{site.url}}{{site.baseurl}}/images/trace_log_correlation.gif)" alt="Log analytics"/></td>
<td style="text-align: center; vertical-align: top;">Detect and mitigate issues faster with anomaly detection<img src="{{site.url}}{{site.baseurl}}/images/anomaly-detection.png" alt="Anomaly detection"/></td>
</tr>
<tr>
<td style="text-align: center; vertical-align: top;">Use observability to monitor and issue alerts<img src="{{site.url}}{{site.baseurl}}/images/observability.png" alt="Data overview" /></td>
<td style="text-align: center; vertical-align: top;">Unlock real-time search, monitoring, and analysis of business and operational data<img src="{{site.url}}{{site.baseurl}}/images/real-time-insights.png" alt="Real-time search, monitoring, and analysis" /></td>
</tr>
</tbody>
</table> 

Follow the steps below to get started creating a dashboard and exploring its elements.

# Try out OpenSearch Dashboards on the playground

Follow these steps to learn the basics of OpenSearch Dashboards:

1.  Go to the [OpenSearch Dashboards Playground](https://playground.opensearch.org/app/home).
2.  Choose **OpenSearch Dashboards > Dashboards > Create dashboard**. 
3.  Explore the sample Global Flight, Web Traffic, and Revenue dashboards. 

# Install OpenSearch Dashboards

You can try out OpenSearch Dashboards locally after installing OpenSearch. For installation instructions, see [Install and configure OpenSearch](https://opensearch.org/docs/latest/opensearch/install/index/) and [Install and configure OpenSearch Dashboards](https://opensearch.org/docs/latest/dashboards/install/index/). 

# Try out OpenSearch Dashboards locally 

Follow these steps to create a dashboard on localhost using sample data: 

1. After installing OpenSearch Dashboards, access it on [localhost:5601](http://localhost:5601/app/home#/).
2. Select **Add sample data**, and select **Add data** for the sample  flight data dataset. 
3. From the top menu, choose **Discover** and search for a few flights.
4. Choose **Dashboard**, **[Flights]** Global Flight Dashboard.

# Related links
- [OpenSearch Frequently Asked Questions](https://opensearch.org/faq/)
- [Upgrade from Kibana OSS to OpenSearch Dashboards](https://opensearch.org/docs/latest/upgrade-to/dashboards-upgrade-to/)
- [OpenSearch Plugin Installation](https://opensearch.org/docs/latest/opensearch/install/plugins/)
- [Introduction to OpenSearch Dashboard Plugins](https://opensearch.org/blog/technical-post/2022/01/dashboards-plugins-intro/)
- [OpenSearch Dashboards Stand-Alone Plugins](https://opensearch.org/docs/latest/dashboards/install/plugins/)
