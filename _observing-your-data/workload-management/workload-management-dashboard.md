---
title: Workload Management dashboards
layout: default
parent: Workload Management
nav_order: 60
---

# Workload Management dashboards

Use the **Workload Management (WLM)** dashboard in OpenSearch Dashboards to monitor and control resource usage across your cluster. With WLM, you can:

- View real-time CPU and memory usage by workload group.
- Identify groups exceeding resource thresholds.
- Configure workload groups and auto-tagging rules.
- Set rejection thresholds for resource-based query control.

## Navigation

To open the dashboard, go to **OpenSearch Plugins** > **Workload management** in OpenSearch Dashboards.

The dashboard includes the following pages:

- **Overview**: Monitor overall resource usage.
- **Workload group details**: View stats and settings for individual workload groups.
- **Create workload group**: Define a new workload group and its rules.

---

## Monitor workload usage

Use the **Overview** page to monitor workload resource usage across the cluster.

You can:

- Identify how many workload groups are defined and how many are exceeding thresholds.
- Filter the table by workload group name.
- View real-time CPU and memory usage for each group using box plots.
- Navigate to workload group details or top queries in **Query Insights**.
  - > **Note:** The link is currently unavailable and will be supported starting in OpenSearch Dashboards version 3.3.

### Interpreting the table

Each row in the table shows key metrics for a workload group:

| Column                   | Description                                                                                                                                                            |
|--------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Workload group name**  | Clickable link to view group details.                                                                                                                                  |
| **CPU usage / Memory usage** | Box plot showing usage distribution across nodes. Threshold shown in red.                                                                                              |
| **Total completions**    | Total number of completed tasks associated with the workload group. A single query may result in multiple task completions, such as coordinator and shard-level tasks. |
| **Total rejections**     | Tasks rejected due to resource limits.                                                                                                                                 |
| **Total cancellations**  | Tasks canceled before completion.                                                                                                                                      |
| **Top N Queries**        | Link to view most resource-intensive queries in **Query Insights**. *(Coming in version 3.3)*                                                                          |

> **Tip:** Hover over the CPU or memory box plots to view min, Q1, median, Q3, and max values.

![Box Plot Tooltip]({{site.url}}{{site.baseurl}}/images/Workload-Management/BoxplotTooltip.png)

---

## View workload group details

To view statistics and settings for a specific workload group:

1. From the **Overview** table, select the group name.

You’ll be taken to the **Workload group details** page, which has two tabs:

### 1. **Resources** tab

View real-time usage and query stats for the group, broken down by node:

| Column           | Description                                                                                                                                                                               |
|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Node ID**      | Unique ID of the node.                                                                                                                                                                    |
| **CPU Usage**    | Current CPU usage for this group on that node.                                                                                                                                            |
| **Memory Usage** | Memory usage for this group on that node.                                                                                                                                                 |
| **Completions**  | Total number of completed tasks associated with the workload group for the given node. A single query may result in multiple task completions, such as coordinator and shard-level tasks. |
| **Rejections**   | Tasks rejected due to resource limits.                                                                                                                                                    |
| **Cancellations**| Tasks that were canceled before completing.                                                                                                                                               |

### 2. **Settings** tab

Review or modify the workload group’s configuration:

- **Description**: Optional text to describe the group.
- **Resiliency mode**:
  - **Soft**: Queries can exceed thresholds if resources are available.
  - **Enforced**: Queries are rejected once thresholds are exceeded.
- **Rules**: Index pattern-based rules for auto-tagging queries. Any query that targets an index whose name starts with one of these patterns will be automatically assigned to this group.
- **Resource thresholds**:
  - **Reject queries when CPU usage exceeds**: Set a CPU usage limit (%).
  - **Reject queries when memory usage exceeds**: Set a memory usage limit (%).

> **Notes:**
> - At least one threshold (CPU or memory) must be set.
> - Thresholds cannot be cleared once set. 
> - If you initially set a CPU threshold but later want to rely only on a memory limit (or vice versa), you can achieve this by switching the group to **soft** resiliency mode. In soft mode, even if a limit is defined, the system will allow queries to proceed as long as node resources are available.
> - The total across all workload groups must not exceed **100%** for CPU or memory.

Changes take effect after clicking **Apply Changes**.

### Special case: `DEFAULT_WORKLOAD_GROUP`

This group cannot be edited. Its CPU and memory limits are always fixed at 100%. The **Settings** tab will be disabled for this group.

---

## Create a workload group

To define a new workload group:

1. From the **Workload Management** page, click **Create workload group**.

2. In the **Overview** section, enter:
  - **Name**: A unique and descriptive name.
  - **Description (Optional)**: Briefly describe the group’s purpose.
    > **Note:** The description will only be saved if a rule is defined.
  - **Resiliency mode**:
    - **Soft**: Queries may exceed limits if resources are available.
    - **Enforced**: Queries are rejected when usage exceeds the limit.

3. In the **Rules** section:
  - Add one or more **Index wildcard** patterns to define which queries are auto-tagged to this group.
  - Any query that targets an index whose name starts with one of these patterns will be automatically assigned to this group.
  - Separate multiple patterns with commas (e.g., `logs-,metrics-`).
  - Click **+ Add another rule** to define multiple rules.
  - Use the trash icon to delete a rule.

4. In the **Resource thresholds** section:
  - **Reject queries when CPU usage exceeds**: Set a CPU usage limit (%).
  - **Reject queries when memory usage exceeds**: Set a memory usage limit (%).

   > **Note:**
   > - You must configure **at least one** of the two thresholds.
   > - The **total limits** across all workload groups must not exceed **100%** per resource type.

5. At the bottom of the page:
  - Click **Create workload group** to save.
  - Click **Cancel** to return to the previous page without saving.

![Create Workload Group UI]({{site.url}}{{site.baseurl}}/images/Workload-Management/Create1.png)
![Create Workload Group UI]({{site.url}}{{site.baseurl}}/images/Workload-Management/Create2.png)
