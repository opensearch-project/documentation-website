---
layout: default
title: Exploring query enhancements
parent: Analyzing data
nav_order: 20
---

# Exploring query enhancements
Introduced 2.18
{: .label .label-purple }

Starting with OpenSearch 2.17, query enhancements have been made. These enhancements are experimental and may be subject to change or instability. Enhancements include the following: 

- Query languages PPL and SQL, with **Query Assist** for PPL
- Multiline query editor for PPL and SQL and autocomplete for PPL and DQL
- Query editor expand/collapse for multiline/single-line mode
- **Data Explorer** feature that supports diverse data sources, such as index patterns, indexes, and Amazon S3 connections, with built-in support for selecting the appropriate query language for your chosen data type
- OpenSearch Dashboards allows for exploring your data within your indexes without using index patterns
- Link sharing through URLs without needing write permission to create an index pattern

OpenSearch 2.18 builds upon existing features with new query enhancements designed to improve data exploration. However, these enhancements, including PPL and SQL functionality, are not available in minimal distributions and require the separate installation of the [OpenSearch SQL plugin]({{site.url}}{{site.baseurl}}/search-plugins/sql/settings/).

While query enhancements work with a standard OpenSearch installation, enabling SQL, PPL, and external data source queries requires additional plugins, particularly the SQL plugin. For optimal use of these query enhancement features, make sure to install the [required plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/) across all relevant data sources. 

You can leave your feedback at [https://forum.opensearch.org/)](https://forum.opensearch.org/) to help the OpenSearch open source project improve this feature.
{: .note}

## Enabling query enhancements

To enable the query enhancements through OpenSearch Dashboards, follow these steps: 

1. Go to **Dashboards Management** > **Advanced settings** > **Search** and toggle on **Enable query enhancements**. Tip: You can select the **Search** pane from the **Category** dropdown menu in the upper-right search bar.
2. Select the **Save** button to save your changes. 
3. Reload the page as prompted in the pop-up message.

Alternatively, you can override the setting on startup by running the following command:

```
./bin/opensearch-dashboards --uiSettings.overrides['query:enhancements:enabled']=true
```
{% include copy-curl.html %}

## Using the experimental features

The following tutorials guide you through some of the experimental features and capabilities.

### Query language enhancements

You can now use PPL in **Discover**. Follow these steps to try out the feature:

1. Go to **Discover** and select **PPL** from the query language dropdown menu in the upper-right search bar. You should see a dashboard containing the query editor, histogram, and data table panes.
2. Select a sample dataset. For this example, select `opensearch_dashboards_sample_data_ecommerce` from the data source dropdown menu above the query editor and adjust the time filter to **Last 1 year**.
3. Enter the following example PPL query:

```json
source = opensearch_dashboards_sample_data_logs
| where tags = "success" 
| where geo.dest = "US"
```
{% include copy-curl.html %}

4. View the resulting output that shows the number of successful log entries originating from the United States. You should see an updated histogram and data table following the query editor. 
5. Select the **Recent queries** option within the query editor toolbar to display your recent queries.

PPL and DQL provide an autocomplete option that suggests field names, functions, and syntax. 


## Selecting data sources and data types through the UI

You can now select your data sources and types from within the **Discover** dashboard. Follow these steps to try out the feature.

1. From the **Discover** page, select a data source from the dropdown menu in the upper toolbar. 
2. Select the **View all available data** button to display a list of your available data sources. You may need to refresh your page to display any newly added data sources.
3. Select the desired data source and follow steps displayed in the data sources window to manage your data source.

You can now use **Query Assist** with PPL queries. With **Query Assist**, you can ask questions like _Are there any errors in my logs?_. The assistant includes predefined prompts. Follow these steps to try out the feature:

1. Select **PPL** from the dropdown menu in the query toolbar.
2. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/dashboards/query-assist.png" class="inline-icon" alt="query assist icon"/>{:/} icon and choose a predefined question. The resulting output is displaying in the query editor pane.
