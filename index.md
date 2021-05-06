---
layout: default
title: Get started
nav_order: 1
redirect_from: /404.html
permalink: /
---

# OpenSearch documentation
Some Label
{: .label .label-yellow }

This site contains the technical documentation for [OpenSearch](https://opensearch.org/), the search, analytics, and visualization suite with advanced security, alerting, SQL support, automated index management, deep performance analysis, and more.

## Header 2
Stuff about Docker
{: .label .label-green }

This site contains the technical documentation for [OpenSearch](https://opensearch.org/), the search, analytics, and visualization suite with advanced security, alerting, SQL support, automated index management, deep performance analysis, and more.

[Get started](#docker-quickstart){: .btn .btn-blue }

[Get started](#docker-quickstart){: .btn .btn-purple }

Older versions of OpenSearch used arbitrary document *types*, but indices created in current versions of OpenSearch should use a single type named `_doc`. Store different document types in different indices.
{: .note }

Older versions of OpenSearch used arbitrary document *types*, but indices created in current versions of OpenSearch should use a single type named `_doc`.
{: .tip }


---

## Why use OpenSearch?
Some Label
{: .label .label-yellow }

OpenSearch is well-suited to the following use cases:

* Log analytics
* Real-time application monitoring
* Clickstream analytics
* Search backend

Component | Purpose
:--- | :---
[OpenSearch](docs/opensearch/) | Data store and search engine
[OpenSearch Dashboards](docs/opensearch-dashboards/) | Search frontend and visualizations
[Security](docs/security/) | Authentication and access control for your cluster
[Alerting](docs/alerting/) | Receive notifications when your data meets certain conditions
[SQL](docs/sql/) | Use SQL or a piped processing language to query your data
[Index State Management](docs/ism/) | Automate index operations
[KNN](docs/knn/) | Find “nearest neighbors” in your vector data
[Performance Analyzer](docs/pa/) | Monitor and optimize your cluster
[Anomaly Detection](docs/ad/) | Identify atypical data and receive automatic notifications
[Asynchronous Search](docs/async/) | Run search requests in the background

You can install OpenSearch plugins [individually](docs/install/plugins/) on existing clusters or use the [all-in-one packages](docs/install/) for new clusters. Most of these OpenSearch plugins have corresponding OpenSearch Dashboards plugins that provide a convenient, unified user interface.


---

## Docker quickstart
Docker
{: .label .label-green }

1. Install and start [Docker Desktop](https://www.docker.com/products/docker-desktop).
1. Run the following commands:

   ```bash
   docker pull amazon/opensearch:{{site.opensearch_version}}
   docker run -p 9200:9200 -p 9600:9600 -e "discovery.type=single-node" amazon/opensearch:{{site.opensearch_version}}
   ```

1. In a new terminal session, run:

   ```bash
   curl -XGET --insecure https://localhost:9200 -u admin:admin
   ```

To learn more, see [Install](docs/install/).

### Lots of deeper headers

[OpenSearch](https://opensearch.org) is supported by Amazon Web Services. All components are available under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0.html) on [GitHub](https://github.com/opensearch-project/).

The project welcomes GitHub issues, bug fixes, features, plugins, documentation---anything at all. To get involved, see [Contribute](https://opensearch.org/contribute.html) on the OpenSearch website.

#### Some file

```
[Contribute](https://opensearch.org/contribute.html) on the OpenSearch website.
```

##### An h5 for some odd reason

The project welcomes GitHub issues, bug fixes, features, plugins, documentation---anything at all. To get involved, see [Contribute](https://opensearch.org/contribute.html) on the OpenSearch website.

###### Hm this seems excessive

The project welcomes GitHub issues, bug fixes, features, plugins, documentation---anything at all. To get involved, see [Contribute](https://opensearch.org/contribute.html) on the OpenSearch website.


---

## Get involved

[OpenSearch](https://opensearch.org) is supported by Amazon Web Services. All components are available under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0.html) on [GitHub](https://github.com/opensearch-project/).

The project welcomes GitHub issues, bug fixes, features, plugins, documentation---anything at all. To get involved, see [Contribute](https://opensearch.org/contribute.html) on the OpenSearch website.
