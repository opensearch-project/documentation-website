---
layout: default
title: Managing dashboard variables
parent: Dashboard variables
nav_order: 10
---

# Managing dashboard variables

This page covers creating, editing, deleting, organizing and viewing variables.

## Adding a variable

To add a new variable:

<img src="{{site.url}}{{site.baseurl}}/images/dashboard-variables/add_variable_button.png" alt="add variable button">

1. Create a new dashboard in your Observability workspace 
2. In the variables bar, click **Add variable**.
3. Configure the variable settings:

   **General configuration**

   - **Name** (required): The identifier used to reference the variable in queries. Must start with a letter or underscore and contain only letters, numbers, and underscores. Maximum 30 characters.
     - Reference in queries using `$variableName` or `${variableName}` syntax.
   - **Label** (optional): A display name shown in the variables bar. Maximum 40 characters.
   - **Description** (optional): Additional context about the variable's purpose. Maximum 100 characters.
   - **Type** (required): Select **Query** or **Custom**.
     - **Query**: Options are dynamically fetched from a data source using a query (PPL or PromQL).
     - **Custom**: Options are manually defined as a static list of values.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboard-variables/general_settings.png" alt="general settings" width="400">

   **Query type configuration**

   For Query type variables:

   - **Options Query**: Define a query to fetch variable options dynamically.
     - Select a language (PPL or PromQL) using the language toggle.
     - Select a dataset from the dropdown. The available dataset types depend on the selected language:
       - PPL: Index patterns
       - PromQL: Prometheus data sources
     - Write a query that returns a single column of values.
     - Select **Preview** to validate the query and view the first 100 results.
   - **Regex** (optional): Filter query results using a regular expression. Only values matching the pattern are displayed.
   - **Refresh**: Choose when to update variable options:
     - **On dashboard load**: Options are fetched once when the dashboard loads.
     - **On time range change**: Options refresh automatically when the dashboard time range changes.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboard-variables/query_config.png" alt="query config" width="400">

   
   **Custom type configuration**

   For Custom type variables:

   - **Custom options**: Manually enter values for the variable.
     - Type a value and press Enter to add it.
     - Maximum 100 options can be displayed.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboard-variables/custom_config.png" alt="custom config" width="400">

   
   **Selection configuration**

   Available for both Query and Custom types:

   - **Sort**: Choose how options are sorted in the dropdown:
     - Disabled
     - Alphabetical (ascending)
     - Alphabetical (descending)
     - Numerical (ascending)
     - Numerical (descending)
   - **Allow multiple selections**: Enable users to select multiple values from the dropdown.
   - **Include All option**: (Only available when multiple selections are enabled) Add an "All" option that selects all available values.

   <img src="{{site.url}}{{site.baseurl}}/images/dashboard-variables/selection_config.png" alt="add variable button" width="400">

3. Click **Add variable** to save.

The variable appears in the variables bar at the top of the dashboard.

---

## Accessing variable management

The **Manage variables** panel displays all existing variables with their type, name, and configuration options, to manage variables in a dashboard:

1. Open the dashboard in edit mode.
2. In the variables bar at the top of the dashboard, click the **Manage variables** icon.

<img src="{{site.url}}{{site.baseurl}}/images/dashboard-variables/manage_panel.png" alt="variables panel">

The Manage variables icon only appears when variables have been created in the dashboard. If no variables exist, you'll need to create one first before accessing the management interface.
{: .note}

---

## Editing a variable

To edit an existing variable:

1. Open the **Manage variables** panel.
2. Click the **Edit** icon for the variable you want to modify.
3. Make your changes.
4. Click **Update variable** to save.

Changing the variable name will break any queries that reference it.
{: .note}

---

## Deleting a variable

To delete a variable:

1. Open the **Manage variables** panel.
2. Select the **Delete** icon for the variable you want to remove.
3. Confirm the deletion in the dialog.

Variables that are referenced by other variables or visualization editors display an indicator in the management panel. Deleting these variables will cause any queries that reference them to fail.
{: .note}

---

## Organizing variables

Variables are displayed in the variables bar in the order they appear in the management panel.

To reorder variables:

1. Open the **Manage variables** panel.
2. Drag the grab icon handle on the left side of a variable.
3. Drop it in the desired position.
4. Save the dashboard to persist your config.

---

## Hiding variables

You can hide variables from the variables bar while keeping them available for use in queries.

To hide or show a variable:

1. Open the **Manage variables** panel.
2. Select the **Hide/Show** icon for the variable.
3. Save the dashboard to persist your config.

Hidden variables are marked with a **Hidden** badge in the management panel and do not appear in the variables bar.
{: .note}

---

## Variables bar in dashboards

The variables bar appears at the top of the dashboard and displays all visible variables. For each variable, you can:

- View the current value
- Change the value by selecting the dropdown
- See the number of selected values for multi-select variables

---

## Variable loading states

The variables bar indicates the status of each variable:

- **Loading**: A spinner appears in the variable dropdown while options are being fetched.
- **Error**: If a variable query fails, an error icon appears with a tooltip showing the error message. The dropdown is disabled.
- **No options**: If a variable query returns no results, "No options" is displayed in the dropdown.

---

## URL synchronization

Variable values are automatically synchronized to the dashboard URL using the `variableValues` query parameter:

```
?variableValues=(service:(api),region:(us-east,us-west))
```

This enables:

- **Shareable URLs**: Send a link to a dashboard with specific variable values pre-selected.
- **Bookmarks**: Save a dashboard view with your preferred variable settings.
- **Persistence**: Variable selections are preserved across page refreshes.

---

## Variable dependencies

Query type variables can reference other variables in their queries. For example:

```
source=logs | where region=$region | dedup service | fields service
```

In this example, the `service` variable depends on the `region` variable. When the `region` variable changes, the `service` variable automatically refreshes its options.

**Important considerations**:

- Avoid circular dependencies where Variable A references Variable B, and Variable B references Variable A.
- Variables are evaluated in the order they appear in the management panel. Place dependent variables after the variables they reference.

---

## Configuration reference

The following table provides a quick reference for all variable configuration options:

| Setting | Type | Description | Available for |
|---------|------|-------------|---------------|
| Name | Text (required) | Variable identifier used in queries. Must start with letter or underscore, alphanumeric only. Max 30 characters. | All types |
| Label | Text | Display name in variables bar. Max 40 characters. | All types |
| Description | Text | Tooltip text explaining the variable's purpose. Max 100 characters. | All types |
| Type | Query or Custom | Determines how options are populated. | All types |
| Query | PPL or PromQL | Query that returns a single column of values. | Query type only |
| Language | PPL or PromQL | Query language for fetching options. | Query type only |
| Dataset | Index pattern or Prometheus | Data source to query. | Query type only |
| Regex | Regular expression | Filter to apply to query results. | Query type only |
| Refresh | On dashboard load or On time range change | When to update options. | Query type only |
| Custom options | List of strings | Manually entered values. Max 100 displayed. | Custom type only |
| Sort | Disabled, Alphabetical, Numerical | How to order options in dropdown. | All types |
| Allow multiple selections | Boolean | Enable multi-value selection. | All types |
| Include All option | Boolean | Add "All" option that selects all values. | Multi-select only |
| Hide | Boolean | Hide from variables bar but keep usable in queries. | All types |

---

## Next steps

- [Using dashboard variables in the dashboard]({{site.url}}{{site.baseurl}}/dashboards/dashboard-variables/using-variables/) - Learn how to use dashboard variables in the dashboard
