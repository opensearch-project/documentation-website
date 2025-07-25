---
layout: default
title: Get started
nav_order: 1
redirect_from: /404.html
permalink: /
canonical_url: https://docs.opensearch.org/latest/about/
---

# OpenSearch documentation

This site contains the technical documentation for [OpenSearch](https://opensearch.org/), the Apache 2.0-licensed search, analytics, and visualization suite with advanced security, alerting, SQL support, automated index management, deep performance analysis, and more.

[Get started](#docker-quickstart){: .btn .btn-blue }


---

## Why use OpenSearch?

OpenSearch is well-suited to the following use cases:

* Log analytics
* Real-time application monitoring
* Clickstream analytics
* Search backend

Component | Purpose
:--- | :---
[OpenSearch]({{site.url}}{{site.baseurl}}/opensearch/) | Data store and search engine
[OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/) | Search frontend and visualizations
[Security]({{site.url}}{{site.baseurl}}/security-plugin/) | Authentication and access control for your cluster
[Alerting]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/) | Receive notifications when your data meets certain conditions
[SQL]({{site.url}}{{site.baseurl}}/search-plugins/sql/) | Use SQL or a piped processing language to query your data
[Index State Management]({{site.url}}{{site.baseurl}}/im-plugin/) | Automate index operations
[KNN]({{site.url}}{{site.baseurl}}/search-plugins/knn/) | Find “nearest neighbors” in your vector data
[Performance Analyzer]({{site.url}}{{site.baseurl}}/monitoring-plugins/pa/) | Monitor and optimize your cluster
[Anomaly detection]({{site.url}}{{site.baseurl}}/monitoring-plugins/ad/) | Identify atypical data and receive automatic notifications
[Asynchronous search]({{site.url}}{{site.baseurl}}/search-plugins/async/) | Run search requests in the background
[Cross-cluster replication]({{site.url}}{{site.baseurl}}/replication-plugin/index/) | Replicate your data across multiple OpenSearch clusters

Most OpenSearch plugins have corresponding OpenSearch Dashboards plugins that provide a convenient, unified user interface.

For specifics around the project, see the [FAQ](https://opensearch.org/faq/).


---

## Docker quickstart
Docker
{: .label .label-green }

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


---

## Installation

For more comprehensive installation instructions for other download types, such as tarballs, see these pages:

- [Install and configure OpenSearch]({{site.url}}{{site.baseurl}}/opensearch/install/)
- [Install and configure OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/install/)


## The secure path forward

OpenSearch includes a demo configuration so that you can get up and running quickly, but before using OpenSearch in a production environment, you must [configure the security plugin manually]({{site.url}}{{site.baseurl}}/security-plugin/configuration/index/): your own certificates, your own authentication method, your own users, and your own passwords.


## Looking for the Javadoc?

See [opensearch.org/javadocs/](https://opensearch.org/javadocs/).


## Get involved

[OpenSearch](https://opensearch.org) is supported by Amazon Web Services. All components are available under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0.html) on [GitHub](https://github.com/opensearch-project/).

The project welcomes GitHub issues, bug fixes, features, plugins, documentation---anything at all. To get involved, see [Contributing](https://opensearch.org/source.html) on the OpenSearch website.
