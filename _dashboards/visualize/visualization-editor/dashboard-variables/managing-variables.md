---
layout: default
title: Managing dashboard variables
parent: Dashboard variables
grand_parent: Creating visualizations using queries
nav_order: 10
---

# Managing dashboard variables

You can create, edit, delete, organize, and view dashboard variables from within a dashboard.

## Prerequisites

Before you start, ensure that you have met the following prerequisites:

- Dashboard variables are [enabled]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/dashboard-variables/#enabling-dashboard-variables) in your `opensearch_dashboards.yml` file.
- You have an [Observability workspace]({{site.url}}{{site.baseurl}}/dashboards/workspace/create-workspace/) set up.

For the complete setup, see [Creating and using dashboard variables]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/dashboard-variables/#creating-and-using-dashboard-variables).

## Creating a variable

To create a new variable, follow these steps:

1. In your Observability workspace, select **Dashboards** in the left navigation.
1. Open an existing dashboard or select **Create** > **Dashboard** to create a new dashboard. If creating a new dashboard, save it first by entering a title and selecting **Save**.
1. At the top of the dashboard, select **Add variable**.
1. Configure the variable settings. The Add variable panel contains the following sections:

   - **General configuration**:
     - **Name** (required): The identifier used to reference the variable in queries using `$variableName` or `${variableName}` syntax.
     - **Label** (optional): A display name shown at the top of the dashboard.
     - **Description** (optional): Additional context about the variable's purpose.
     - **Type** (required): Select **Query** or **Custom**. For more information about variable types, see [Variable types]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/dashboard-variables/#variable-types).
   - **Query type configuration** (for query type variables):
     - **Options Query**: Define a query to fetch variable options dynamically.
       - If needed, update the default language (PPL) to PromQL using the language toggle.
       - In the **Select dataset** dropdown list, select a dataset. For PPL, select an index pattern. For PromQL, select a Prometheus data source.
       - Write a query that returns a single column of values.
       - Select **Preview** to validate the query and view the first 100 results.
     - **Regex** (optional): Filter query results using a regular expression. Only values matching the pattern are displayed.
     - **Refresh**: Choose when to update variable options:
       - **On dashboard load**: Options are fetched once when the dashboard loads.
       - **On time range change**: Options refresh automatically when the dashboard time range changes.
   - **Custom type configuration** (for custom type variables):
     - **Custom options**: Enter custom values for the variable. Type a value and press Enter to add it. The maximum of 100 options can be displayed in the dropdown list.
   - **Selection configuration** (available for both query and custom types):
     - **Sort**: Choose how options are sorted in the dropdown list (**Disabled**, **Alphabetical** (ascending or descending), or **Numerical** (ascending or descending)).
     - **Allow multiple selections**: Enables you to select multiple values from the dropdown.
     - **Include All option** (only available when multiple selections are enabled): Adds an **All** option to the dropdown that selects all available values.

1. Select **Add variable** to save.

The variable appears at the top of the dashboard.

## Managing existing variables

The **Manage variables** panel lists all existing variables, including their type, name, and configuration options. To access this panel, follow these steps:

1. Navigate to your workspace.
1. From **Dashboards**, select the dashboard to update. 
1. On the top, toggle the **Edit** selector to enter edit mode.
1. In the upper-left corner, select the **Manage variables** icon, as shown in the following image.

![Manage variables panel displaying variable names, types, and action icons]({{site.url}}{{site.baseurl}}/images/dashboard-variables/manage_panel.png)

The **Manage variables** icon only appears when variables have been created in the dashboard. If no variables exist, create one first before accessing the management interface.
{: .note}

## Editing a variable

To edit an existing variable, follow these steps:

1. Open the **Manage variables** panel.
1. Select the **Edit** icon for the variable you want to modify.
1. Make your changes.
1. Select **Update variable** to save.

Changing the variable name causes any queries that reference the old name to fail.
{: .note}

## Deleting a variable

To delete a variable, follow these steps:

1. Open the **Manage variables** panel.
1. Select the **Delete** icon for the variable you want to remove.
1. Confirm the deletion in the dialog.

Variables that are referenced by other variables or visualization editors display an indicator in the management panel. Deleting a referenced variable causes any queries that use it to fail.
{: .note}

## Organizing variables

Variables are displayed at the top of the dashboard in the order they appear in the management panel.

To reorder variables, follow these steps:

1. Open the **Manage variables** panel.
1. Drag the reorder handle on the left side of a variable.
1. Drop it in the desired position.
1. Save the dashboard to apply the new order.

## Hiding variables

You can hide variables from the top of the dashboard while keeping them available for use in queries.

To hide or show a variable, follow these steps:

1. Open the **Manage variables** panel.
1. Select the **Hide/Show** icon for the variable.
1. Save the dashboard to apply the change.

Hidden variables are marked with a **Hidden** badge in the management panel and do not appear in the dashboard.
{: .note}

## Variable status indicators

Each variable displays a status indicator at the top of the dashboard:

- **Loading**: A spinner appears while the system fetches options.
- **Error**: An error icon appears with a tooltip showing the error message. The dropdown is disabled.
- **No options**: If a variable query returns no results, "No options" is displayed in the dropdown.

## URL synchronization

Variable values are automatically synchronized to the dashboard URL using the `variableValues` query parameter:

```js
?variableValues=(service:(api),region:(us-east,us-west))
```

URL synchronization enables the following functionality:

- Send a link to a dashboard with specific variable values preselected.
- Save a dashboard view with your preferred variable settings.
- Preserve variable selections across page refreshes.

## Variable dependencies

Query type variables can reference other variables in their queries. The following example shows a query variable that references another variable:

```sql
source=logs | where region=$region | dedup service | fields service
```
{% include copy.html %}

In this example, the `service` variable depends on the `region` variable. When the `region` variable changes, the `service` variable automatically refreshes its options.

Keep the following considerations in mind:

- Avoid circular dependencies where Variable A references Variable B, and Variable B references Variable A.
- Variables are evaluated in the order they appear in the management panel. Place dependent variables after the variables they reference.

## Next steps

- [Using dashboard variables]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/dashboard-variables/using-variables/)
