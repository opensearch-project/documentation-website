---
title: Query Insights - Configuration
layout: default
parent: Observing Your Data
---

# Query Insights - Configuration

The **Configuration** page is designed to give users control over how Query Insights collects, monitors, groups, and retains data. Each section of this page is outlined in detail below.

![Configuration](../../images/Query-Insights/Configuration.png)
---

## 1. Top N Queries Monitoring Configuration Settings
This section configures the monitoring of the top N queries based on specific metrics (e.g., Latency, CPU Usage, Memory).

### Fields
1. **Metric Type**:
    - Allows users to select the performance metric to monitor.
    - Options include:
        - **Latency**: Monitor the time taken by queries to execute.
        - **CPU Usage**: Monitor the CPU resources consumed by queries.
        - **Memory**: Monitor memory utilization for queries.

2. **Enabled**:
    - A toggle to enable or disable monitoring for the selected metric.
    - When **enabled**, the system will track and record the top N queries for the specified metric.

3. **Value of N (count)**:
    - Defines the number of top queries to monitor during each time window.
    - Example:
        - If set to `10`, the system will collect metrics for the top 10 queries.
    - **Limits**:
        - Minimum: 1
        - Maximum: 100

4. **Window Size**:
    - Specifies the duration during which Top N queries are collected.
    - Example:
        - If set to `5 minutes`, the plugin will calculate the top N queries every 5 minutes.
    - **Limits**:
        - Minimum: 1 minute
        - Maximum: 24 hours

---

## 2. Top N Queries Grouping Configuration Settings
This section enables grouping of the monitored queries by specific attributes, allowing users to analyze query performance patterns.

### Fields
1. **Group By**:
    - Defines the criteria for grouping queries.
    - Example grouping options (based on configuration):
        - **None**: No grouping is applied.
        - **Similarity**: Group queries based on types like search, index, or delete.
    - **Disabled State**:
        - If "Group By" is not configured, it will remain disabled.

---

## 3. Query Insights Export and Data Retention Settings
This section configures how query data is exported and how long it is retained in the system.

### Fields
1. **Exporter**:
    - Specifies the destination (sink) for exporting query insights data.
    - Options include:
        - **Local Index**: Stores data locally within OpenSearch.
        - Other sinks (e.g., Amazon S3) may be supported depending on your configuration.

2. **Delete After (days)**:
    - Determines how long the query insights data is retained before deletion.
    - Example:
        - If set to `7 days`, data older than 7 days will be purged automatically.

### Use Case
These settings are crucial for managing storage and ensuring compliance with data retention policies:
- For short-term analysis, a retention period of 7 days may suffice.
- For longer-term auditing or compliance purposes, a retention period of 30+ days might be necessary.

---

## 4. Status Panels
These panels provide a real-time overview of the current configuration status for different components.

### Panels
1. **Statuses for Configuration Metrics**:
    - Shows the status of each metric being monitored (e.g., Latency, CPU Usage, Memory).
    - Example:
        - **Enabled**: Indicates the metric is actively monitored.
        - **Disabled**: Indicates the metric is not monitored.

2. **Statuses for Group By**:
    - Displays the status of the "Group By" configuration:
        - **Enabled**: Grouping is active.
        - **Disabled**: Grouping is not applied.

3. **Statuses for Data Retention**:
    - Indicates the status of data export and retention:
        - **Enabled**: Exporting and retention policies are active.
        - **Disabled**: Exporting is not configured.

---


## Best Practices
1. **Start Small**:
    - Begin with a smaller value for **N (count)** and adjust based on your system's load and query volume.
2. **Set Appropriate Retention Periods**:
    - Shorter retention periods help save storage but may limit long-term insights.
3. **Enable Metrics Based on Need**:
    - Focus on one or two critical metrics (e.g., Latency or CPU Usage) to avoid overwhelming the system.

---
