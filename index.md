---
layout: default
title: Getting Started with OpenSearch
nav_order: 1
redirect_from: /404.html
permalink: /
---

# OpenSearch documentation

Welcome to the OpenSearch documentation! With this documentation, you’ll learn how to use OpenSearch &mdash;  the only 100% open-source search, analytics, and visualization suite.
We have a dedicated and growing number of technical writers who are building our documentation library. We also welcome and encourage community input. To contribute, see the [Contributing](https://opensearch.org/source.html) file. A good place to start is by browsing  issues labeled “_good first issue_.”


## Getting started

- [About OpenSearch]({{site.url}}{{site.baseurl}}/opensearch/)
- [Install OpenSearch]({{site.url}}{{site.baseurl}}/opensearch/install/)
- [Install OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/install/)
- [See the FAQ](https://opensearch.org/faq)

## Why use OpenSearch?

With OpenSearch, you can perform the following use cases:

<table style="table-layout: fixed ; width: 100%;">
<tbody>
<tr style="text-align: center; vertical-align:center;">
<td><img src="{{site.url}}{{site.baseurl}}/images/1_search.png" alt="Fast, scalable full-text search" height="100"/></td>
<td><img src="{{site.url}}{{site.baseurl}}/images/2_monitoring.png" alt="Application and infrastructure monitoring" height="100"/></td>
<td><img src="{{site.url}}{{site.baseurl}}/images/3_security.png" alt="Security and event information management" height="100"/></td>
<td><img src="{{site.url}}{{site.baseurl}}/images/4_tracking.png" alt="Operational health tracking" height="100"/></td>
</tr>
<tr style="text-align: center; vertical-align:top; font-weight: bold; color: rgb(0,59,92)">
<td>Fast, Scalable Full-text Search</td>
<td>Application and Infrastructure Monitoring</td>
<td>Security and Event Information Management</td>
<td>Operational Health Tracking</td>
</tr>
<tr style="text-align: center; vertical-align:top;">
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
- [SQL]({{site.url}}{{site.baseurl}}/search-plugins/sql/) - Use SQL or a piped processing language to query your data
- [Index State Management]({{site.url}}{{site.baseurl}}/im-plugin/) - Automate index operations
- [ML Commons plugin]({{site.url}}{{site.baseurl}}/ml-commons-plugin/index/) - Train and execute machine-learning models
- [Asynchronous search]({{site.url}}{{site.baseurl}}/search-plugins/async/) - Run search requests in the background
- [Cross-cluster replication]({{site.url}}{{site.baseurl}}/replication-plugin/index/) - Replicate your data across multiple OpenSearch clusters

## Docker quickstart

Docker
{: .label .label-green }

The best way to try out OpenSearch is to use Docker Compose. Setting up OpenSearch with Docker Compose sets up a two-node cluster of OpenSearch plus OpenSearch Dashboards.
1. Install and start [Docker Desktop](https://www.docker.com/products/docker-desktop).
1. Run the following commands:
   ```bash
   docker pull opensearchproject/opensearch:{{site.opensearch_version}}
   docker run -p 9200:9200 -p 9600:9600 -e "discovery.type=single-node" opensearchproject/opensearch:{{site.opensearch_version}}
   ```
1. In a new terminal session, run:
   ```bash
   curl -XGET --insecure -u 'admin:admin' 'https://localhost:9200'
   ```
1. [Create]({{site.url}}{{site.baseurl}}/opensearch/rest-api/index-apis/create-index/) your first index.

   ```bash
   curl -XPUT --insecure -u 'admin:admin' 'https://localhost:9200/my-first-index'
   ```

1. [Add some data]({{site.url}}{{site.baseurl}}/opensearch/index-data/) to your newly created index.

   ```bash
   curl -XPUT --insecure -u 'admin:admin' 'https://localhost:9200/my-first-index/_doc/1' -H 'Content-Type: application/json' -d '{"Description": "To be or not to be, that is the question."}'
   ```

1. [Retrieve the data]({{site.url}}{{site.baseurl}}/opensearch/index-data/#read-data) to see that it was added properly.

   ```bash
   curl -XGET --insecure -u 'admin:admin' 'https://localhost:9200/my-first-index/_doc/1'
   ```

1. After verifying that the data is correct, [delete the document]({{site.url}}{{site.baseurl}}/opensearch/index-data/#delete-data).

   ```bash
   curl -XDELETE --insecure -u 'admin:admin' 'https://localhost:9200/my-first-index/_doc/1'
   ```

1. Finally, [delete the index]({{site.url}}{{site.baseurl}}/opensearch/rest-api/index-apis/delete-index).

   ```bash
   curl -XDELETE --insecure -u 'admin:admin' 'https://localhost:9200/my-first-index/'
   ```

To learn more, see [Docker image]({{site.url}}{{site.baseurl}}/opensearch/install/docker/) and [Docker security configuration]({{site.url}}{{site.baseurl}}/opensearch/install/docker-security/).


## The secure path forward
OpenSearch includes a demo configuration so that you can get up and running quickly, but before using OpenSearch in a production environment, you must [configure the security plugin manually]({{site.url}}{{site.baseurl}}/security-plugin/configuration/index/) with your own certificates, authentication method, users, and passwords.

## Looking for the Javadoc?

See [opensearch.org/javadocs/](https://opensearch.org/javadocs/).

## Get involved

[OpenSearch](https://opensearch.org) is supported by Amazon Web Services. All components are available under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0.html) on [GitHub](https://github.com/opensearch-project/).
The project welcomes GitHub issues, bug fixes, features, plugins, documentation---anything at all. To get involved, see [Contributing](https://opensearch.org/source.html) on the OpenSearch website.

---

<small>OpenSearch includes certain Apache-licensed Elasticsearch code from Elasticsearch B.V. and other source code. Elasticsearch B.V. is not the source of that other source code. ELASTICSEARCH is a registered trademark of Elasticsearch B.V.</small>