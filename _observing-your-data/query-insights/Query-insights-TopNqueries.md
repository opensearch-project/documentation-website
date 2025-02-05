# Query Insights - Top N Queries

The **Top N Queries** page provides a detailed overview of the queries that have the highest impact on system resources or performance. It allows users to analyze query execution metrics such as latency, CPU time, memory usage, and more. This page is essential for identifying and addressing performance bottlenecks in your OpenSearch cluster.

## Getting Familiar with the UI

Before getting started, let’s get familiar with the Dashboard UI. The UI comprises the following main components:

![Top N Queries Interface](../../images/Query-Insights/QueryInsights.png)

### A. Navigation Tabs
- **Top N Queries**: Displays the query metrics and details for the top queries.
- **Configuration**: Allows users to customize the monitoring and data retention settings (covered in the [Configuration](#) section).

### B. Search Queries Bar
A search input bar to filter queries based on specific attributes such as query type, indices, or other criteria.

### C. Filters
Provides dropdown filters for narrowing down the query data:

| Filter                  | Description                                                         | Example                 |
|--------------------------|---------------------------------------------------------------------|-------------------------|
| **Type**               | Filter by query type                                               | `query`, `aggregation` |
| **Indices**            | Filter queries based on specific OpenSearch indices                | `index1`, `index2`     |
| **Search Type**        | Filter by search execution method                                  | `query then fetch`     |
| **Coordinator Node ID** | Focus on queries executed by a specific coordinator node           | `node-1`, `node-2`     |
| **Time Range**          | Adjust the time range for the queries displayed                    | `last 1 day`           |

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

### Pagination and Rows Per Page
- Allows users to navigate through multiple pages of query data.
- Adjust the number of rows displayed per page (e.g., 10, 25, 50).

