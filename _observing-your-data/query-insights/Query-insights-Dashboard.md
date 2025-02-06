---
title: Query Insights dashboards and visualizations
layout: default
parent: Observing Your Data
---

# Query Insights dashboards and visualizations

The Query Insights Dashboards Plugin for OpenSearch provides users with real-time insights into query performance, offering tools to analyze and monitor query execution effectively.

---

## Getting Started

Before you begin, ensure you have:

- Installed OpenSearch and OpenSearch Dashboards version 2.19 or later. See [Installing OpenSearch](#).
- Installed the Query Insights Dashboards plugin. See [Managing OpenSearch Dashboards Plugins](#).


## Top N Queries Overview

The **Top N Queries** page provides a detailed overview of the queries that have the highest impact on system resources or performance. It allows users to analyze query execution metrics such as latency, CPU time, memory usage, and more. 


Before getting started, let’s get familiar with the Dashboard UI. The UI comprises the following main components:

![Top N Queries Interface](../../images/Query-Insights/QueryInsights.png)

### A. Navigation Tabs
- **Top N Queries**: Displays the query metrics and details for the top queries.
- **Configuration**: Allows users to customize the monitoring and data retention settings (covered in the [Configuration](#) section).

### B. Search Queries Bar
A search input bar to filter queries based on specific attributes such as query type, indices, or other criteria.

### C. Filters
Provides dropdown filters for narrowing down the query data:

| Filter                  | Description                                                         | Example            |
|--------------------------|---------------------------------------------------------------------|--------------------|
| **Type**               | Filter by query type                                               | `query`, `group`   |
| **Indices**            | Filter queries based on specific OpenSearch indices                | `index1`, `index2` |
| **Search Type**        | Filter by search execution method                                  | `query then fetch` |
| **Coordinator Node ID** | Focus on queries executed by a specific coordinator node           | `node-1`, `node-2` |
| **Time Range**          | Adjust the time range for the queries displayed                    | `last 1 day`       |

### D. Date Range Selector
- **Show Dates**: Provides detailed timestamps for the queries.
- Use the date range selector to analyze queries within a specific time frame (e.g., last 1 day).

### E. Refresh Button
- **Refresh**: Reloads the query data based on the selected filters and time range.

### F. Metrics Table
The table displays the following metrics for each query:

| Metric               | Description                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| **ID**               | Unique identifier for the query                                            |
| **Type**             | The type of query (e.g., `query`, `group`)                                 |
| **Query Count**      | The number of times the query has been executed                            |
| **Timestamp**        | When the query was executed                                                |
| **Latency**          | The time taken for the query to execute                                    |
| **CPU Time**         | The CPU resources consumed by the query                                    |
| **Memory Usage**     | The memory usage of the query                                              |
| **Indices**          | The index or indices on which the query was executed                      |
| **Search Type**      | The type of search execution (e.g., `query then fetch`)                   |
| **Coordinator Node ID** | The node that coordinated the query execution                              |
| **Total Shards**     | The total number of shards involved in executing the query                 |


## Query Details

The **Query Details** page in OpenSearch Dashboards provides insights into query behavior, performance, and structure. This page can have two variations based on the context:

![Query Insights List](../../images/Query-Insights/Querieslist.png)

### Viewing Query Individual Details

This view focuses on a single query and provides detailed execution metrics and insights. 

![Individual Query Details](../../images/Query-Insights/IndividualQueryDetails.png)

Steps to View the Individual Query Details Page
1. Navigate to Query Insights.
2. Select Query ID marked as "query" in the list, such as 51c68a1a-7507-4b3e-aea1-32ddd74dbac4.
3. View the Summary Section, which includes Timestamp, Latency, CPU Time, Memory Usage, Indices, Search Type, Coordinator Node ID, and Total Shards.
4. Explore the Query Section and Latency Breakdown, which are consistent with the Query Group Details section.
---

### Viewing Query Group Details

![Query Group Details](../../images/Query-Insights/GroupQueryDetails.png)

This view provides insights into aggregated metrics for a group of similar queries.

To view Query Group Details, follow these steps:

1. Navigate to the Query Insights section.
2. Click on a Query ID marked as a "group" in the list, such as 4751b8b6-99eb-4f38-8a5a-aa6698a451a7.
3. View key metrics in the Aggregate Summary for Queries section, including average latency, average CPU time, and average memory usage.
4. Check the criterion used to group the queries in the Group By section.
5. Review information about a single representative query within the Sample Query Details section, including its timestamp, targeted indices, search execution type, coordinator node ID, and total shards involved.
6. Explore the Query Section displaying the JSON structure of the query and the Latency Breakdown section presenting a graphical representation of execution phases for the query.


## Query Insights - Configuration

The **Configuration** page is designed to give users control over how Query Insights collects, monitors, groups, and retains data. Each section of this page is outlined in detail below.

![Configuration](../../images/Query-Insights/Configuration.png)
---

### Configuring Top N Queries Monitoring Settings

The **Top N Queries Monitoring** workflow allows you to track query performance metrics such as **Latency, CPU Usage, and Memory** to analyze and optimize query performance. The configuration interface provides a structured, menu-driven setup where you can define the specific metrics to monitor, set thresholds for analysis, and customize monitoring durations.

To configuring Top N Queries Monitoring Settings:

1. Navigate to the **Configuration** tab from the **Query Insights Dashboards Overview**.
2. In the **Dashboards** window, select **Create**, then choose **Dashboard**.
3. Select the metric type from **Latency, CPU Usage, or Memory**.
4. Toggle the **Enabled** setting to turn monitoring on or off for the selected metric.
5. Enter the value of **N**, which defines the number of top queries to track.
6. Specify the **monitoring window size**, determining the time duration for analysis.
7. Click **Save Monitoring Settings** to apply the changes.
8. After enabling the selected metric, check the **Status Panel** to confirm whether the metric is enabled or disabled.

---

### Configuring Top N Queries Grouping Configuration Settings

The **Top N Queries Grouping** feature allows users to group monitored queries based on specific attributes. 

Continuing with the grouping of the monitored queries by specific attributes by following these steps:

1. Navigate to the **Query Grouping Settings** panel.
2. Select a grouping option under **Group By** (e.g., **Similarity**).
3. Check the **Status Panel** to confirm that the grouping is enabled.
4. Once enabled, queries will be grouped based on the selected attribute.

---

### Configuring Data Export and Retention

To configuring Data Export and Retention Settings:

1. Navigate  to the **Query Insights Export and retention Grouping Settings** panel.
2. Select an Exporter and choose a destination (local index). Click Save.
3. Set the Delete After (days) field with a retention period and click Save.
4. Verify that Data Retention and Export Status is set to Enabled.
---

Best Practices
1. Begin with a smaller value for N (count) and increase it based on system load.
2. while setting Appropriate Retention Periods consider Shorter retention that saves storage but reduces long-term insights.
3. Enable Metrics Based on Need Tracking fewer metrics prevents system overload.

---


