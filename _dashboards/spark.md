---
layout: default
title: Apache Spark integration
nav_order: 120
has_children: false
---

# Apache Spark integration

The first step in integrating [Apache Spark](https://spark.apache.org/) and OpenSearch is to install OpenSearch and OpenSearch Dashboards on your system. You can follow the installation instructions in the [OpenSearch documentation]({{site.url}}{{site.baseurl}}/install-and-configure/index/) to install these tools.

Once you have installed OpenSearch and OpenSearch Dashboards, you can use Dashboards to integrate Apache Spark into OpenSearch. Then, you can use Dashboards to analyze data stored in OpenSearch and visualize the results using OpenSearch Dashboards. This integration is achieved by using OpenSearch for Apache Hadoop, which provides native integration between Dashboards and Apache Spark in the form of a resilient distributed dataset (RDD) that can be read data from OpenSearch. 

Configuration of the YAML files and installation of certain [OpenSearch plugins]({{site.url}}{{site.baseurl}}/opensearch-sql/) is necessary. The following plugins are required for using the Apache Spark integration feature: `opensearch-sql`, `opensearch-security`, and `opensearch-observability`. 

<SME provide information: what configuration is necessary? what settings need to be configured? provide examples of the configuration.>

