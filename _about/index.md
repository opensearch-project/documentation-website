---
layout: default
title: Getting started
nav_order: 1
has_children: false
has_toc: false
nav_exclude: true
permalink: /about/
redirect_from:
  - /docs/opensearch/
  - /opensearch/
  - /opensearch/index/
canonical_url: https://docs.opensearch.org/latest/about/
---

{%- comment -%}The `/docs/opensearch/` redirect is specifically to support the UI links in OpenSearch Dashboards 1.0.0.{%- endcomment -%}

# OpenSearch and OpenSearch Dashboards
**Version {{site.opensearch_major_minor_version}}**
{: .label .label-blue }

This section contains documentation for OpenSearch and OpenSearch Dashboards.

## Getting started

To get started, explore the following documentation:

- [Getting started guide]({{site.url}}{{site.baseurl}}/getting-started/): 
  - [Intro to OpenSearch]({{site.url}}{{site.baseurl}}/getting-started/intro/)
  - [Installation quickstart]({{site.url}}{{site.baseurl}}/getting-started/quickstart/)
  - [Communicate with OpenSearch]({{site.url}}{{site.baseurl}}/getting-started/communicate/)
  - [Ingest data]({{site.url}}{{site.baseurl}}/getting-started/ingest-data/)
  - [Search data]({{site.url}}{{site.baseurl}}/getting-started/search-data/)
  - [Getting started with OpenSearch security]({{site.url}}{{site.baseurl}}/getting-started/security/)
- [Install OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/)
- [Install OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/)
- [FAQ](https://opensearch.org/faq)

## Why use OpenSearch?

<table style="table-layout: auto ; width: 100%;">
<tbody>
<tr style="text-align: center; vertical-align:center;">
<td><img src="{{site.url}}{{site.baseurl}}/images/1_search.png" class="no-border" alt="Fast, scalable full-text search" height="100"/></td>
<td><img src="{{site.url}}{{site.baseurl}}/images/2_monitoring.png" class="no-border" alt="Application and infrastructure monitoring" height="100"/></td>
<td><img src="{{site.url}}{{site.baseurl}}/images/3_security.png" class="no-border" alt="Security and event information management" height="100"/></td>
<td><img src="{{site.url}}{{site.baseurl}}/images/4_tracking.png" class="no-border" alt="Operational health tracking" height="100"/></td>
</tr>
<tr style="text-align: left; vertical-align:top; font-weight: bold; color: rgb(0,59,92)">
<td>Fast, scalable full-text search</td>
<td>Application and infrastructure monitoring</td>
<td>Security and event information management</td>
<td>Operational health tracking</td>
</tr>
<tr style="text-align: left; vertical-align:top;">
<td>Help users find the right information within your application, website, or data lake catalog. </td>
<td>Easily store and analyze log data, and set automated alerts for performance issues.</td>
<td>Centralize logs to enable real-time security monitoring and forensic analysis.</td>
<td>Use observability logs, metrics, and traces to monitor your applications in real time.</td>
</tr>
</tbody>
</table>

## Key features

OpenSearch provides several features to help index, secure, monitor, and analyze your data:

- [Anomaly detection]({{site.url}}{{site.baseurl}}/monitoring-plugins/ad/) -- Identify atypical data and receive automatic notifications.
- [SQL]({{site.url}}{{site.baseurl}}/search-plugins/sql/index/) -- Use SQL or a Piped Processing Language (PPL) to query your data.
- [Index State Management]({{site.url}}{{site.baseurl}}/im-plugin/) -- Automate index operations.
- [Search methods]({{site.url}}{{site.baseurl}}/search-plugins/knn/) -- From traditional lexical search to advanced vector and hybrid search, discover the optimal search method for your use case.
- [Machine learning]({{site.url}}{{site.baseurl}}/ml-commons-plugin/index/) -- Integrate machine learning models into your workloads.
- [Workflow automation]({{site.url}}{{site.baseurl}}/automating-configurations/index/) -- Automate complex OpenSearch setup and preprocessing tasks.
- [Performance evaluation]({{site.url}}{{site.baseurl}}/monitoring-plugins/pa/) -- Monitor and optimize your cluster.
- [Asynchronous search]({{site.url}}{{site.baseurl}}/search-plugins/async/) -- Run search requests in the background.
- [Cross-cluster replication]({{site.url}}{{site.baseurl}}/replication-plugin/index/) -- Replicate your data across multiple OpenSearch clusters.


## The secure path forward

OpenSearch includes a demo configuration so that you can get up and running quickly, but before using OpenSearch in a production environment, you must [configure the Security plugin manually]({{site.url}}{{site.baseurl}}/security/configuration/index/) with your own certificates, authentication method, users, and passwords. To get started, see [Getting started with OpenSearch security]({{site.url}}{{site.baseurl}}/getting-started/security/).

## Looking for the Javadoc?

See [opensearch.org/javadocs/](https://opensearch.org/javadocs/).

## Get involved

[OpenSearch](https://opensearch.org) is supported by Amazon Web Services. All components are available under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0.html) on [GitHub](https://github.com/opensearch-project/).
The project welcomes GitHub issues, bug fixes, features, plugins, documentation---anything at all. To get involved, see [Contributing](https://opensearch.org/source.html) on the OpenSearch website.

---

<small>OpenSearch includes certain Apache-licensed Elasticsearch code from Elasticsearch B.V. and other source code. Elasticsearch B.V. is not the source of that other source code. ELASTICSEARCH is a registered trademark of Elasticsearch B.V.</small>