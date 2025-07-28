---
title: Workload Management dashboards
layout: default
parent: Workload Management
nav_order: 60
---

# Workload Management dashboards

You can interact with the Workload Management (WLM) feature in OpenSearch Dashboards to monitor and control resource usage across your cluster. The WLM dashboard provides insights into how different workloads impact system performance, allowing you to configure workload groups, set rejection thresholds, and observe real-time statistics.

## Navigation

After logging in to OpenSearch Dashboards, you can find the **Workload Management** page by navigating to **OpenSearch Plugins** > **Workload management**.

The **Workload management dashboard** contains the following pages:

- [Overview](#overview): Displays real-time CPU and memory usage across nodes and workload groups.
- [Workload group details](#workload-group-details): Provides detailed configuration and statistics for individual workload groups.
- [Create workload group](#create-workload-group): Allows you to define new workload groups and assign auto-tagging rules.


## Overview

The **Overview** page provides a high-level summary of all workload groups in your cluster. It helps you monitor resource consumption and identify groups that may be exceeding defined thresholds.

This page includes the following sections:

- **Total workload groups**: Displays the total number of workload groups currently configured.
- **Total groups exceeding limits**: Shows the number of groups currently exceeding their defined CPU or memory thresholds.
- **Search bar**: Filter workload groups by name.
- **Create workload group**: Navigates to the page to define a new workload group.
- **Refresh button**: Updates statistics to reflect the most recent data.

### Workload group table

Below the summary cards, a table lists all workload groups with key metrics:

| Column                   | Description                                                               |
|--------------------------|---------------------------------------------------------------------------|
| **Workload group name**  | Clickable link to view details for each workload group.                   |
| **CPU usage**            | Current CPU usage percentage for the group, visualized with a box plot.   |
| **Memory usage**         | Current memory usage percentage, also shown with a box plot.              |
| **Total completions**    | The number of queries completed within the group.                         |
| **Total rejections**     | The number of queries rejected due to resource limits.                    |
| **Total cancellations**  | The number of queries canceled.                                           |
| **Top N Queries**        | A link to view the top queries for this workload group in Query Insights. |

The **CPU usage** and **Memory usage** columns display resource consumption using a box plot, which provides a visual summary of usage across nodes in the cluster. The plot includes:

- **Min**: Minimum usage across all nodes
- **Q1**: First quartile (25th percentile)
- **Median**: Middle value of usage
- **Q3**: Third quartile (75th percentile)
- **Max**: Maximum usage
- **Limit**: The rejection threshold for the group (drawn as a red line)

When you hover over the plot, a tooltip appears showing the detailed usage distribution.

You can sort the table by clicking column headers, and control pagination using the navigation arrows and **Rows per page** dropdown.


## Workload group details

The **Workload group details** page provides insights into a specific workload group, including real-time usage metrics and configuration settings. You can access this page by selecting the group name from the main **Overview** table.

The details view is divided into two tabs:

- **Resources**: Displays real-time CPU and memory usage across nodes, as well as workload group statistics.
- **Settings**: Shows the configuration for the group, including its auto-tagging rules and rejection thresholds.

### Summary section

At the top of the page, you’ll find a summary of the workload group:

| Field               | Description                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| **Workload group name** | The name of the group.                                                  |
| **Description**     | Optional explanation of the group’s purpose.                                |
| **Resiliency mode** | Indicates whether the group operates in `soft` or `enforced` mode.          |
| **CPU usage limit** | Threshold at which queries may be rejected based on CPU consumption.        |
| **Memory usage limit** | Threshold at which queries may be rejected based on memory usage.       |

---

### Resources tab

The **Resources** tab displays real-time usage data across nodes for this workload group. The following metrics are shown per node:

| Column        | Description                                                 |
|---------------|-------------------------------------------------------------|
| **Node ID**   | The unique identifier of the node.                          |
| **CPU Usage** | Current CPU consumption for this group on the node.         |
| **Memory Usage** | Current memory usage for this group on the node.        |
| **Completions** | Number of queries completed successfully.                |
| **Rejections**  | Number of queries rejected due to threshold violations.   |
| **Cancellations** | Number of queries that were cancelled.                 |

You can refresh this data using the **Refresh** button.

---

### Settings tab

The **Settings** tab allows you to review or update the configuration for the group:

- **Description**: Optional description field.
> **Note:** The description will only be saved if at least one rule is defined.
- **Resiliency mode**: Select between `Soft` and `Enforced`.
  - **Soft**: Queries may exceed thresholds if there are enough node resources.
  - **Enforced**: Queries are rejected immediately upon passing the defined threshold.
- **Rules**: Each rule includes an index pattern used for auto-tagging. You can edit the existing pattern or add more using **+ Add another rule**.
- **Resource thresholds**:
  - **Reject queries when CPU usage exceeds**: Set the maximum CPU percentage.
  - **Reject queries when memory usage exceeds**: Set the maximum memory percentage.
> **Notes:**
> - You must specify **at least one** of the two thresholds (CPU or memory).
> - Once a threshold is set, it **cannot be reset to null** (i.e., removed entirely).
> - If you initially set a CPU threshold but later want to rely only on a memory limit (or vice versa), you can achieve this by switching the group to **soft** resiliency mode. In soft mode, even if a limit is defined, the system will allow queries to proceed as long as node resources are available.
> - The **total resource limits across all workload groups** in the cluster must not exceed **100%** for each resource type.

Changes can be saved by clicking **Apply Changes**.

---

### Special case: DEFAULT_WORKLOAD_GROUP

For the `DEFAULT_WORKLOAD_GROUP`, settings cannot be modified. This group acts as a catch-all and always has the following fixed limits:

- **CPU usage limit**: `100%`
- **Memory usage limit**: `100%`

The **Settings** tab will be disabled, and rejection thresholds cannot be adjusted for this group.


## Create workload group

The **Create workload group** page allows you to define a new workload group to monitor and manage resource usage. You can also configure auto-tagging rules that dynamically assign queries to this group based on index patterns or other attributes. This page is accessible by clicking the **Create workload group** button on the Workload Management Overview page.

The interface is divided into the following sections:

### Overview

This section captures basic information about the new workload group:

- **Name**: Enter a unique, descriptive name that is easy to identify.
- **Description (Optional)**: Optionally describe the purpose or function of the workload group.
> **Note:** The description will only be saved if at least one rule is defined.
- **Resiliency mode**: Choose how the system should respond when resource limits are exceeded:
    - **Soft**: Queries are still allowed to run even if usage exceeds the group's thresholds, as long as there are sufficient node resources available.
    - **Enforced**: Actively rejects queries when thresholds are exceeded.

### Rules

This section allows you to define **auto-tagging rules**, which determine which queries are automatically associated with the workload group. Each rule supports the following:

- **Index wildcard**: Define the rule using index patterns (e.g., `logs-`, `metrics-`). These patterns determine which queries get auto-tagged into the group. Use commas to separate multiple patterns.

To add more rules, select **+ Add another rule**. You can also remove a rule using the trash icon next to the rule card.

### Resource thresholds

This section defines the rejection criteria for queries tagged to this group:

- **Reject queries when CPU usage exceeds**: Set the CPU usage percentage threshold beyond which queries will be rejected.
- **Reject queries when memory usage exceeds**: Set the memory usage percentage threshold for query rejection.

> **Note:**
> - You must configure **at least one** of the two thresholds (CPU or memory).
> - The **total resource limits across all workload groups** in the cluster must not exceed **100%** for each resource type (CPU or memory). For example, if one group uses a 60% CPU limit, only 40% is available for all other groups combined.

### Actions

At the bottom of the page, the following actions are available:

- **Cancel**: Discards the form and returns to the overview page.
- **Create workload group**: Submits the form and creates the workload group. This button becomes active once all required fields are completed.

![Create Workload Group UI]({{site.url}}{{site.baseurl}}/images/Workload-Management/Create1.png)


