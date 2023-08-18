---
layout: default
title: OpenSearch documentation
nav_order: 1
has_children: true
redirect_from: /404.html
permalink: /
---

{% include banner.html %}

# Getting started

- [About OpenSearch]({{site.url}}{{site.baseurl}}/opensearch/)
- [Quickstart]({{site.url}}{{site.baseurl}}/quickstart/)
- [Install OpenSearch]({{site.url}}{{site.baseurl}}/opensearch/install/)
- [Install OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/install/)
- [See the FAQ](https://opensearch.org/faq)

## Why use OpenSearch?

OpenSearch is well-suited to the following use cases:

* Log analytics
* Real-time application monitoring
* Clickstream analytics
* Search backend

Component | Purpose
:--- | :---
[OpenSearch]({{site.url}}{{site.baseurl}}/opensearch/) | Data store and search engine
[OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/index/) | Search frontend and visualizations
[Security]({{site.url}}{{site.baseurl}}/security-plugin/) | Authentication and access control for your cluster
[Alerting]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/) | Receive notifications when your data meets certain conditions
[SQL]({{site.url}}{{site.baseurl}}/search-plugins/sql/) | Use SQL or a piped processing language to query your data
[Index State Management]({{site.url}}{{site.baseurl}}/im-plugin/) | Automate index operations
[KNN]({{site.url}}{{site.baseurl}}/search-plugins/knn/) | Find “nearest neighbors” in your vector data
[Performance Analyzer]({{site.url}}{{site.baseurl}}/monitoring-plugins/pa/) | Monitor and optimize your cluster
[Anomaly detection]({{site.url}}{{site.baseurl}}/monitoring-plugins/ad/) | Identify atypical data and receive automatic notifications
[ML Commons plugin]({{site.url}}{{site.baseurl}}/ml-commons-plugin/index/) | Train and execute machine-learning models
[Asynchronous search]({{site.url}}{{site.baseurl}}/search-plugins/async/) | Run search requests in the background
[Cross-cluster replication]({{site.url}}{{site.baseurl}}/replication-plugin/index/) | Replicate your data across multiple OpenSearch clusters


Most OpenSearch plugins have corresponding OpenSearch Dashboards plugins that provide a convenient, unified user interface.

For specifics around the project, see the [FAQ](https://opensearch.org/faq/).


---


## The secure path forward
OpenSearch includes a demo configuration so that you can get up and running quickly, but before using OpenSearch in a production environment, you must [configure the security plugin manually]({{site.url}}{{site.baseurl}}/security/configuration/index/) with your own certificates, authentication method, users, and passwords.

## Looking for the Javadoc?

See [opensearch.org/javadocs/](https://opensearch.org/javadocs/).


## Get involved

[OpenSearch](https://opensearch.org) is supported by Amazon Web Services. All components are available under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0.html) on [GitHub](https://github.com/opensearch-project/).

The project welcomes GitHub issues, bug fixes, features, plugins, documentation---anything at all. To get involved, see [Contributing](https://opensearch.org/source.html) on the OpenSearch website.


---

<small>OpenSearch includes certain Apache-licensed Elasticsearch code from Elasticsearch B.V. and other source code. Elasticsearch B.V. is not the source of that other source code. ELASTICSEARCH is a registered trademark of Elasticsearch B.V.</small>