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

# Getting started with OpenSearch Dashboards

OpenSearch Dashboards is the preferred visualization platform for analyzing data in OpenSearch. It serves as the user interface for many openSearch features, including security, alerting, index state management, SQL, and more.

Out-of-the-box OpenSearch Dashboards includes several tools for discovering and visualizing data, and OpenSearch provides a full suite of plugins that you can use to monitor events, identify trends, and automate recurring activities.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards-example.png" alt="Screenshot of Dashboards interface" />

# OpenSearch Dashboards for your use case

OpenSearch Dashboards makes it easy to visualize data for a number of use cases such as log analytics, application search, enterprise search, and more. Here are a few examples.  

<table>
<tbody>
<tr>
<td style="text-align: center; vertical-align: top;">Visualize log and trace data with interactive log analytics<img src="{{site.url}}{{site.baseurl}}/images/trace_log_correlation-web.jpg" alt="Log analytics"/></td>
<td style="text-align: center; vertical-align: top;">Detect and mitigate issues faster with anomaly detection<img src="{{site.url}}{{site.baseurl}}/images/anomaly-detection.png" alt="Anomaly detection"/></td>
</tr>
<tr>
<td style="text-align: center; vertical-align: top;">Use observability to monitor and issue alerts<img src="{{site.url}}{{site.baseurl}}/images/observability.png" alt="Data overview" /></td>
<td style="text-align: center; vertical-align: top;">Unlock real-time search, monitoring, and analysis of business and operational data<img src="{{site.url}}{{site.baseurl}}/images/real-time-insights.png" alt="Real-time search, monitoring, and analysis" /></td>
</tr>
</tbody>
</table>

# Install and try OpenSearch Dashboards

After installing OpenSearch, you can install OpenSearch Dashboards, with different installation methods to choose. For more information, see [OpenSearch Installation Instructions](https://opensearch.org/docs/latest/opensearch/install/index/).

You can try OpenSearch Dashboards' features in the [OpenSearch Dashboards Playground](https://playground.opensearch.org/app/home). Choose **OpenSearch Dashboards > Dashboards > Create dashboard** and explore the sample Global Flight, Web Traffic, and Revenue dashboards. You can follow these steps to create a dashboard using sample data. 

1. After installing OpenSearch Dashboards, open it at [http://localhost:5601](http://localhost:5601/app/home#/).
2. Select **Add sample data**, and select **Add data** for the sample  flight data dataset. 
3. From the top menu, choose **Discover** and search for a few flights.
4. Choose **Dashboard**, **[Flights]** Global Flight Dashboard.

Here's an example of the dashboard you created.

<img src="{{site.url}}{{site.baseurl}}/images/flight-dashboards.png" alt="Dashboard example based on the steps" />

# Related links

- [Upgrade from Kibana OSS to OpenSearch Dashboards](https://opensearch.org/docs/latest/upgrade-to/dashboards-upgrade-to/)
- [OpenSearch Frequently Asked Questions](https://opensearch.org/faq/)
- [OpenSearch Plugin Installation](https://opensearch.org/docs/latest/opensearch/install/plugins/)
- [OpenSearch Dashboards stand-alone plugins](https://opensearch.org/docs/latest/dashboards/install/plugins/)