---
layout: default
title: OpenSearch documentation
nav_order: 1
has_children: true
permalink: /
---

{% include banner.html %}

# Getting started

- [About OpenSearch]({{site.url}}{{site.baseurl}}/opensearch/)
- [Quickstart]({{site.url}}{{site.baseurl}}/quickstart/)
- [Install OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/)
- [Install OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/)
- [See the FAQ](https://opensearch.org/faq)

## Why use OpenSearch?

With OpenSearch, you can perform the following use cases:

<table style="table-layout: auto ; width: 100%;">
<tbody>
<tr style="text-align: center; vertical-align:center;">
<td><img src="{{site.url}}{{site.baseurl}}/images/1_search.png" class="no-border" alt="Fast, scalable full-text search" height="100"/></td>
<td><img src="{{site.url}}{{site.baseurl}}/images/2_monitoring.png" class="no-border" alt="Application and infrastructure monitoring" height="100"/></td>
<td><img src="{{site.url}}{{site.baseurl}}/images/3_security.png" class="no-border" alt="Security and event information management" height="100"/></td>
<td><img src="{{site.url}}{{site.baseurl}}/images/4_tracking.png" class="no-border" alt="Operational health tracking" height="100"/></td>
</tr>
<tr style="text-align: left; vertical-align:top; font-weight: bold; color: rgb(0,59,92)">
<td>Fast, Scalable Full-text Search</td>
<td>Application and Infrastructure Monitoring</td>
<td>Security and Event Information Management</td>
<td>Operational Health Tracking</td>
</tr>
<tr style="text-align: left; vertical-align:top;">
<td>Help users find the right information within your application, website, or data lake catalog. </td>
<td>Easily store and analyze log data, and set automated alerts for underperformance.</td>
<td>Centralize logs to enable real-time security monitoring and forensic analysis.</td>
<td>Use observability logs, metrics, and traces to monitor your applications and business in real time.</td>
</tr>
</tbody>
</table>

**Additional features and plugins:**

OpenSearch has several features and plugins to help index, secure, monitor, and analyze your data. Most OpenSearch plugins have corresponding OpenSearch Dashboards plugins that provide a convenient, unified user interface.
- [Anomaly detection]({{site.url}}{{site.baseurl}}/monitoring-plugins/ad/) - Identify atypical data and receive automatic notifications
- [KNN]({{site.url}}{{site.baseurl}}/search-plugins/knn/) - Find “nearest neighbors” in your vector data
- [Performance Analyzer]({{site.url}}{{site.baseurl}}/monitoring-plugins/pa/) - Monitor and optimize your cluster
- [SQL]({{site.url}}{{site.baseurl}}/search-plugins/sql/index/) - Use SQL or a piped processing language to query your data
- [Index State Management]({{site.url}}{{site.baseurl}}/im-plugin/) - Automate index operations
- [ML Commons plugin]({{site.url}}{{site.baseurl}}/ml-commons-plugin/index/) - Train and execute machine-learning models
- [Asynchronous search]({{site.url}}{{site.baseurl}}/search-plugins/async/) - Run search requests in the background
- [Cross-cluster replication]({{site.url}}{{site.baseurl}}/replication-plugin/index/) - Replicate your data across multiple OpenSearch clusters


## The secure path forward
OpenSearch includes a demo configuration so that you can get up and running quickly, but before using OpenSearch in a production environment, you must [configure the Security plugin manually]({{site.url}}{{site.baseurl}}/security/configuration/index/) with your own certificates, authentication method, users, and passwords.

## Looking for the Javadoc?

See [opensearch.org/javadocs/](https://opensearch.org/javadocs/).

## Get involved

[OpenSearch](https://opensearch.org) is supported by Amazon Web Services. All components are available under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0.html) on [GitHub](https://github.com/opensearch-project/).
The project welcomes GitHub issues, bug fixes, features, plugins, documentation---anything at all. To get involved, see [Contributing](https://opensearch.org/source.html) on the OpenSearch website.

---

<small>OpenSearch includes certain Apache-licensed Elasticsearch code from Elasticsearch B.V. and other source code. Elasticsearch B.V. is not the source of that other source code. ELASTICSEARCH is a registered trademark of Elasticsearch B.V.</small>