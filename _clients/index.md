---
layout: default
title: Language clients
nav_order: 1
has_children: false
nav_exclude: true
permalink: /clients/
redirect_from:
  - /clients/index/
---

# ![Clients icon]({{site.url}}{{site.baseurl}}/images/icons/OpenSearch-Clients-Icon.avif){: .heading-icon} OpenSearch language clients

OpenSearch clients let you work with OpenSearch from your application code. A client connects to your cluster, sends requests, and returns the responses as objects in your programming language, so you can create indexes, add documents, and search without building HTTP requests and parsing JSON yourself.

## OpenSearch clients

OpenSearch provides clients for the following programming languages and platforms: 

* **Python**
  * [OpenSearch Python client]({{site.url}}{{site.baseurl}}/clients/python-low-level/)
  * [OpenSearch Python ML client]({{site.url}}{{site.baseurl}}/clients/opensearch-py-ml/): Analyze data in OpenSearch indexes using DataFrames and upload machine learning (ML) models to OpenSearch.
* **Java**
  * [OpenSearch Java client]({{site.url}}{{site.baseurl}}/clients/java/)
* **JavaScript**
  * [OpenSearch JavaScript (Node.js) client]({{site.url}}{{site.baseurl}}/clients/javascript/index/)
* **Go**
  * [OpenSearch Go client]({{site.url}}{{site.baseurl}}/clients/go/)
* **Ruby**
  * [OpenSearch Ruby client]({{site.url}}{{site.baseurl}}/clients/ruby/)
* **PHP**
  * [OpenSearch PHP client]({{site.url}}{{site.baseurl}}/clients/php/)
* **.NET**
  * [OpenSearch .NET clients]({{site.url}}{{site.baseurl}}/clients/dot-net/)
* **Rust**
  * [OpenSearch Rust client]({{site.url}}{{site.baseurl}}/clients/rust/)
* **Hadoop**
  * [Hadoop connector (Apache Spark, Apache Hive, and Hadoop MapReduce)]({{site.url}}{{site.baseurl}}/clients/hadoop/)

## Deprecated clients

The following clients have been deprecated:

* [OpenSearch high-level Python client]({{site.url}}{{site.baseurl}}/clients/python-high-level/): Use the [OpenSearch Python client]({{site.url}}{{site.baseurl}}/clients/python-low-level/) instead.
* [OpenSearch Java high-level REST client]({{site.url}}{{site.baseurl}}/clients/java-rest-high-level/): Use the [OpenSearch Java client]({{site.url}}{{site.baseurl}}/clients/java/) instead.


## Legacy clients

Clients that work with Elasticsearch OSS 7.10.2 should work with OpenSearch 1.x. The latest versions of those clients, however, might include license or version checks that artificially break compatibility. The following table provides recommendations for which client versions to use for best compatibility with OpenSearch 1.x. For OpenSearch 2.0 and later, no Elasticsearch clients are fully compatible with OpenSearch.

While OpenSearch and Elasticsearch share several core features, mixing and matching the client and server has a high risk of errors and unexpected results. As OpenSearch and Elasticsearch continue to diverge, such risks may increase. Although your Elasticsearch client may continue working with your OpenSearch cluster, using OpenSearch clients for OpenSearch clusters is recommended.
{: .warning}

To view the compatibility matrix for a specific client, see the `COMPATIBILITY.md` file in the client's repository.

Client | Recommended version
:--- | :---
[Elasticsearch Java low-level REST client](https://central.sonatype.com/artifact/org.elasticsearch.client/elasticsearch-rest-client/7.13.4) | 7.13.4
[Elasticsearch Java high-level REST client](https://central.sonatype.com/artifact/org.elasticsearch.client/elasticsearch-rest-high-level-client/7.13.4) | 7.13.4
[Elasticsearch Python client](https://pypi.org/project/elasticsearch/7.13.4/) | 7.13.4
[Elasticsearch Node.js client](https://www.npmjs.com/package/@elastic/elasticsearch/v/7.13.0) | 7.13.0
[Elasticsearch Ruby client](https://rubygems.org/gems/elasticsearch/versions/7.13.0) | 7.13.0

If you test a legacy client and verify that it works, [submit a PR](https://github.com/opensearch-project/documentation-website/pulls) and add it to this table.
