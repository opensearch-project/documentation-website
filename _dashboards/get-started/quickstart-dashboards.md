---
layout: default
title: Quickstart for OpenSearch Dashboards
nav_order: 20
has_children: false
---

# Quickstart for OpenSearch Dashboards

This quickstart covers the core concepts for you to get started with OpenSearch Dashboards. You'll learn how to:

- Add the sample data
- Explore and inspect data with Discover
- Visualize data with Dashboard

Before you get started, make sure you've installed OpenSearch and OpenSearch Dashboards. For information on installation and configuration, see [Install and configure OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/index/) and [Install and configure OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/).
{: .note}

# Add sample data

Sample data sets come with visualizations, dashboards, and more to help you explore OpenSearch Dashboards before you add your own data. To add sample data, perform the following steps:

1. Verify access to OpenSearch Dashboards by connecting to [http://localhost:5601](http://localhost:5601) from a browser. The default username and password are `admin`.
1. On the OpenSearch Dashboards **Home** page, select **Add sample data**.
1. Select **Add data** to add the data sets.

![Sample data sets]({{site.url}}{{site.baseurl}}/images/add-sample-data.png)

# Explore and inspect data

In **Discover**, you can: 

- Select data to explore, set a time range for that data, search it using [Dashboards Query Language (DQL)]({{site.url}}{{site.baseurl}}/dashboards/dql/), and filter the results.
- Explore the data's details, view individual documents, and create tables summarizing the data's contents.
- Visualize your findings.

Get familiar with **Discover** in the following steps:

1. On the OpenSearch Dashboards **Home** page, select **Discover.**
1. Change the time filter to **Last 7 days**.
    