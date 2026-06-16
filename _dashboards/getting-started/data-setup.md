---
layout: default
title: Prepare your data
parent: Getting started
nav_order: 20
---

# Prepare your data

Before you can explore, visualize, or dashboard your data in OpenSearch Dashboards, you need data in OpenSearch and an index pattern that points to it.

## Step 1: Add data to OpenSearch

Choose one of the following options to add data to OpenSearch. We recommend getting started by adding sample data.

### Add sample data

Sample datasets come with prebuilt index patterns, visualizations, and dashboards. The [**Sample flight data**](https://playground.opensearch.org/app/home#/tutorial_directory) dataset is already installed in [OpenSearch Playground](https://playground.opensearch.org/app/home#/).

If you've installed a local OpenSearch Dashboards instance, add one or more sample datasets by following these steps:

**Classic navigation:**

1. On the OpenSearch Dashboards home page, select **Add sample data**.
1. On the **Add sample data** page, select the **Add data** button in the **Sample flight data** tile and any others that you want to add.

**Workspaces navigation:**

1. In the left navigation panel, expand **Manage workspace** and select **Sample data**.
1. Select the **Add data** button in the **Sample flight data** tile and any others that you want to add.

The following image shows the available sample datasets.

![Adding sample data window]({{site.url}}{{site.baseurl}}/images/dashboards/add-sample.png)

If you installed sample data, the index patterns are created automatically and you're ready to [explore the Discover application]({{site.url}}{{site.baseurl}}/dashboards/getting-started/explore-discover/).
{: .note}

### Ingest your own data

Load your data into OpenSearch using the Bulk API, Data Prepper, or other ingestion tools. See [Ingesting data]({{site.url}}{{site.baseurl}}/getting-started/ingest-data/).

## Step 2: Create an index pattern

An index pattern tells OpenSearch Dashboards which indexes to query. You need at least one index pattern before you can use Discover, Visualize, or Dashboards with your own data.

To create an index pattern, follow these steps:

1. In the left navigation menu, go to **Management** > **Index patterns**.
2. Select **Create index pattern**.
3. Enter an index name or pattern (for example, `my-index-*` to match multiple indexes).
4. Select **Next step**.
5. If your index contains a timestamp field, select it from the **Time field** dropdown. For the examples in this section, select `timestamp`. This enables time-based filtering in Discover and visualizations.
6. Select **Create index pattern**.

For more information, see [Index patterns]({{site.url}}{{site.baseurl}}/dashboards/management/index-patterns/).

## Next steps

- Learn about each application in [Learn about main applications and query languages]({{site.url}}{{site.baseurl}}/dashboards/getting-started/learn-dashboards/).