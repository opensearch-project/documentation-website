---
layout: default
title: Apache Spark integration
nav_order: 120
has_children: false
---

# Apache Spark integration

The first step in integrating [Apache Spark](https://spark.apache.org/) and OpenSearch is to install OpenSearch and OpenSearch Dashboards on your system. You can follow the installation instructions in the [OpenSearch documentation]({{site.url}}{{site.baseurl}}/install-and-configure/index/) to install these tools.

Once you have installed OpenSearch and OpenSearch Dashboards, you can use Dashboards to connect Apache Spark and OpenSearch. Then, you can use Dashboards to analyze data stored in OpenSearch and visualize the results using Dashboards. <This integration is achieved by using OpenSearch for Apache Hadoop, which provides native integration between Dashboards and Apache Spark in the form of a resilient distributed dataset (RDD) that can be read data from OpenSearch.> 

Configuration of the YAML files and installation of certain [OpenSearch plugins]({{site.url}}{{site.baseurl}}/opensearch-sql/) is necessary. The following plugins are required for using the Apache Spark integration feature: `opensearch-sql`, `opensearch-security`, and `opensearch-observability`. 

<SME provide information: What are prerequisites? Do you need to have OpenSearch Service to use this feature? What YAML configuration is necessary? What settings need to be configured? Do users need to enable `data_sources` in the YAML file? Provide configuration examples.>

The following tutorial guides you through using OpenSearch Dashboards to connect Apache Spark and OpenSearch. 

**Step 1: Select data source connection**

- Manage data source connections
- Create new data source connections

**Step 2: Configure data source connection**

- Configuration
- Connecting wait

**Step 3: Query data**

- Direct querying
    - Select Apache Spark table
    - Query data
    - Contextual acceleration
- Accelerated query
    - Metadata-based acceleration
    - Metadata-based acceleration to ingestion
    - Ingestion-based acceleration

**Step 4: Accelerate data**

- Skipping index/metadata indexing
- Covered index/ingestion
- Successful indexing
