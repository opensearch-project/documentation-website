---
title: Query insights dashboards
layout: default
parent: Query insights
nav_order: 60
canonical_url: https://docs.opensearch.org/latest/observing-your-data/query-insights/query-insights-dashboard/
---

# Query insights dashboards

You can interact with the query insights feature in OpenSearch Dashboards. This gives you real-time and historical insights into query performance, providing analytics and monitoring to improve how queries are run in your cluster.

## Navigation

After logging in to OpenSearch Dashboards, you can find the **Query insights** page by navigating to **OpenSearch Plugins** > **Query insights**.

If you have [multiple data sources]({{site.url}}{{site.baseurl}}/dashboards/management/multi-data-sources/) enabled, the **Query insights** page can be found by navigating to **Data administration** > **Performance** > **Query insights**.
{: .note}

The **Query insights** dashboard contains the following pages:

- [Top N queries](#top-n-queries): Displays the query metrics and details for the top queries.
- [Query details](#query-details): Displays details for individual queries and query groups.
- [Configuration](#configuration): Customizes all monitoring and data retention settings for the query insights feature.


## Top N queries

The **Top N queries** page provides a detailed overview of the queries that have the highest impact on system resources or performance. There, you can analyze query metrics such as **latency**, **CPU time**, and **memory usage**.

The following image of the **Top N queries** page contains letter labels for each component.

![Top N Queries Interface]({{site.url}}{{site.baseurl}}/images/Query-Insights/QueryInsights.png)

Each label corresponds to the following components:

- [A. Navigation tabs](#a-navigation-tabs)
- [B. Search queries bar](#b-search-queries-bar)
- [C. Filters](#c-filters)
- [D. Date range selector](#d-date-range-selector)
- [E. Refresh button](#e-refresh-button)
- [F. Metrics table](#f-metrics-table)

### A. Navigation tabs

The navigation tabs allow you to switch between the **Configuration** and **Top N queries** pages.

### B. Search queries bar

The search queries bar filters queries based on specific attributes such as **query type** or **indexes**. You can use additional filters as shown in the [Filters](#c-filters) section.

### C. Filters

The filters dropdown menus allow you to select the following query filters.

| Filter                  | Description                                                         | Example            |
|-------------------------|---------------------------------------------------------------------|--------------------|
| **Type**                | Filter by query type.                                               | `query`, `group`   |
| **Indexes**             | Filter queries based on specific OpenSearch indexes.                | `index1`, `index2` |
| **Search Type**         | Filter by search execution method.                                  | `query then fetch` |
| **Coordinator Node ID** | Focus on queries executed by a specific coordinator node.           | `node-1`, `node-2` |
| **Time Range**          | Adjust the time range for the queries displayed.                    | `last 1 day`       |

### D. Date range selector

The **data range selector** analyzes queries sent during a set time frame. You can also select **Show dates** to provide detailed time stamps for each query.

### E. Refresh button

The **Refresh** button reloads the query data based on the selected filters and time range.

### F. Metrics table

The metrics table dynamically adapts based on your **Type** filter selection (**Query**, **Group**, or both). Dynamic columns improve clarity by showing only the relevant data for each query type.

When you select **queries only**, the table displays individual metrics, including **Latency**, **CPU Time**, and **Memory Usage**. The **Query Count** column isn't displayed because each row represents a single query, as shown in the following image.

![Column Display for Query Selected]({{site.url}}{{site.baseurl}}/images/Query-Insights/OnlyQueryColDisplay.png)

When you select **groups only**, the table displays aggregated metrics, including **Average Latency**, **Average CPU Time**, and **Average Memory Usage**. The **Query Count** column shows how many queries are in each group, as shown in the following image.

![Column Display for Group Selected]({{site.url}}{{site.baseurl}}/images/Query-Insights/OnlyGroupColDisplay.png)

When you select both **groups** and **queries**, the table displays combined metrics, including both averaged and raw values, as shown in the following image.

![Column Display for Both Selected]({{site.url}}{{site.baseurl}}/images/Query-Insights/BothColDisplay.png)

The following table provides descriptions for each metric and the metric's related query and group when selected.

| Column name | Description  | Query selected | Group selected | Query + group selected |
| :--- | :--- | :--- | :--- | :--- |
| **ID**                  | The unique identifier for the query or group. | `ID`   | `ID`   | `ID`  |
| **Type**                | Indicates whether the entry is a query or a group. | `Type`  | `Type` | `Type`  |
| **Query Count**         | The number of queries aggregated in the group.  | Not shown  | `Query Count`        | `Query Count`   |
| **Timestamp**           | The time at which the query or group was recorded (may be empty for groups). | `Timestamp`     | Not shown            | `Timestamp`    |
| **Latency**             | The amount of time taken for individual queries to execute.  | `Latency`          | `Average Latency`    | `Avg Latency/Latency`          |
| **CPU Time**            | The number of CPU resources consumed. | `CPU Time`         | `Average CPU Time`   | `Avg CPU Time/CPU Time`        |
| **Memory Usage**        | The amount of memory used during execution.  | `Memory Usage`     | `Average Memory Usage` | `Avg Memory Usage/Memory Usage` |
| **Indexes**             | A list of indexes involved in the query or group. | `Indexes`  | Not shown            | `Indexes`    |
| **Search Type**         | The search execution method used (such as `query` or `fetch`).  | `Search Type`      | Not shown            | `Search Type`  |
| **Coordinator Node ID** | The node that coordinated the query.  | `Coordinator Node ID` | Not shown         | `Coordinator Node ID` |
| **Total Shards**        | The number of shards involved in query processing.   | `Total Shards`     | Not shown            | `Total Shards`  |

When you select **Query + Group**:

- If all displayed rows are queries, then the table follows the **Query Selected** behavior.
- If all displayed rows are groups, then the table follows the **Group Selected** behavior.

## Query details

The **Query details** page provides insights into query behavior, performance, and structure. You can access the query details page by selecting the query ID, as shown in the following image:

![Query Insights List]({{site.url}}{{site.baseurl}}/images/Query-Insights/Querieslist.png)

### Viewing individual query details

You can access detailed information about a single query by selecting the query ID, such as `51c68a1a-7507-4b3e-aea1-32ddd74dbac4`. The query details page will appear, as shown in the following image.

![Individual Query Details]({{site.url}}{{site.baseurl}}/images/Query-Insights/IndividualQueryDetails.png)

In the query details view, you can view information such as **Timestamp**, **CPU Time**, **Memory Usage**, **Indexes**, **Search Type**, **Coordinator Node ID**, and **Total Shards**.

### Viewing query group details

The query group details view provides insights into aggregated metrics for a group of similar queries.

To view query group details, select a query ID marked as a "group" in the **Top N queries** list. The query group details view provides the following information:

![Query Group Details]({{site.url}}{{site.baseurl}}/images/Query-Insights/GroupQueryDetails.png)

- The **Aggregate summary for queries** section provides a view of key query metrics for the entire group, including **Average latency**, **Average CPU time**, **Average memory usage**, and **Group by** criteria.
- The **Sample query details** section provides information about a single representative query, including its **Timestamp**, **Indexes**, **Search Type**, **Coordinator Node ID**, and **Total Shards**.
- The **Query** section displays the JSON structure of the query.
- The **Latency** section presents a graphical representation of the run phases for the query.

## Configuration

The **Query insights - Configuration** page is designed to gives you control over how the query insights feature collects, monitors, groups, and retains data. The following image shows the configuration page.

![Configuration]({{site.url}}{{site.baseurl}}/images/Query-Insights/Configuration.png)

On the configuration page, you can configure the settings described in the following sections.

### Top N queries monitoring

The **Top n queries monitoring configuration settings** allow you to track query performance metrics, such as **Latency**, **CPU Usage**, and **Memory**, to analyze and optimize query performance. The configuration interface provides a structured, menu-driven setup through which you can define specific metrics to be monitored, set thresholds for analysis, and customize monitoring durations.

Perform the following to configure the top N queries settings:

1. From the **Query insights** page, navigate to the **Configuration** tab.
2. Select the metric type: **Latency**, **CPU Usage**, or **Memory**.
3. Toggle the **Enabled** setting to turn the top N queries feature on or off for the selected metric.
4. Specify the monitoring **Window size**, which determines the duration of the time queries collected for analysis.
5. Enter the value of **N**, which defines the number of top queries to track in each window.
6. Select **Save**.
7. Check the **Statuses for configuration metrics** panel to see the enabled metrics.

### Top N queries grouping

The **Top n queries group configuration settings** set the grouping settings for queries.

Use the following steps to set specific grouping attributes:

1. Select a grouping option under **Group By**, such as **Similarity**.
2. Select **Save**.
3. Check the **Statuses for group by** panel to verify whether the **Group by** criteria is enabled.

### Data export and retention

To configuring data export and retention, use the **Query insights export and data retention settings** panel. There, you can set the following settings:

1. Under **Exporter**, choose a destination for the data, such as **Local index**.
2. Set the **Delete After (days)** field with a data retention period.
3. Select **Save**.
4. In the **Statuses for data retention** panel, make sure that the **Exporter** setting is enabled.

### Configuration best practices

When configuring the query insights feature, remember the following best practices:

- Begin with a smaller value for N (count) and increase it based on your system's load.
- Choose your **Window size** carefully. A longer window size can save compute resources because the insights found are less granular. Inversely, a shorter window size can output more comprehensive query insights but uses more resources.
- When setting data retention periods, consider shorter retention periods that save storage but reduce the number of long-term insights.
- Enable metrics based on your monitoring needs. Monitoring fewer metrics prevents system overload.





