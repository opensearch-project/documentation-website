---
layout: default
title: Managing dashboard variables
parent: Dashboard variables
grand_parent: Creating visualizations using queries
great_grand_parent: Building data visualizations
nav_order: 10
canonical_url: https://docs.opensearch.org/latest/dashboards/visualize/visualization-editor/dashboard-variables/managing-variables/
---

# Managing dashboard variables

You can create, edit, delete, organize, and view dashboard variables from within a dashboard.

## Prerequisites

Before you start, ensure that you have met the following prerequisites:

- Dashboard variables are [enabled]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/dashboard-variables/#enabling-dashboard-variables) in your `opensearch_dashboards.yml` file.
- You have an [Observability workspace]({{site.url}}{{site.baseurl}}/dashboards/workspace/create-workspace/) set up.

For the complete setup, see [Creating and using dashboard variables]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/dashboard-variables/#creating-and-using-dashboard-variables).

## Creating a query variable

Use a query variable when the list of available values is retrieved from a data source. For example, you can create an `extension` variable from the sample web logs data and use it to filter multiple visualizations by file extension.

The following example uses the OpenSearch Dashboards sample web logs data. If you use a different dataset, select the dataset and fields that match your data.
{: .note}

To create a query variable, follow these steps:

1. In your Observability workspace, select **Dashboards** in the left navigation.
1. Open an existing dashboard or select **Create** > **Dashboard** to create a new dashboard. If you create a new dashboard, save it first by entering a title and selecting **Save**.
1. At the top of the dashboard, select **Add variable**.
1. Configure the following general settings:
   - **Name**: Enter `extension`. This is the identifier used to reference the variable in queries, for example, `$extension` or `${extension}`.
   - **Label**: Enter `Extension`. This is the display name shown at the top of the dashboard.
   - **Description**: Optionally, enter a description, such as `Filters visualizations by file extension`.
   - **Type**: Select **Query**.
1. In **Options Query**, keep the language set to **PPL**.
1. In the dataset selector, select `opensearch_dashboards_sample_data_logs`.
1. Enter the following query:

   ```sql
   source = opensearch_dashboards_sample_data_logs | stats count() by extension | fields extension
   ```
   {% include copy.html %}

1. Select **Preview**. The preview runs the query, loads the fields returned by the query, and displays the first 100 variable options. You must successfully preview a query variable before you can save it.
1. In **Value field**, select `extension`. The value field provides the value inserted into queries when you use `$extension` or `${extension}`.
1. In **Label field**, keep **None**. Select a label field only when the query returns a separate field to display in the dropdown list in place of the stored value.
1. Optional: In **Regex**, enter a regular expression to filter the available options by value. For example, `^(css|gz|zip)$` displays only the `css`, `gz`, and `zip` options.
1. In **Refresh**, choose when OpenSearch Dashboards updates the variable options:
   - **On dashboard load**: Refreshes options when the dashboard loads.
   - **On time range change**: Refreshes options when the dashboard time range changes. Use this option when the available values depend on the selected time range.
1. Configure the shared option settings. For more information, see [Configuring variable option settings](#configuring-variable-option-settings).
1. Select **Add variable**.

The variable appears at the top of the dashboard. The following image shows an `extension` query variable configured using the sample web logs data.

![Variable editor panel configured for an extension query variable using sample web logs data]({{site.url}}{{site.baseurl}}/images/dashboard-variables/query-variable-config.png){: width="500" }

### Mapping query result fields

A query variable can use one field as the stored value and another field as the display label:

- **Value field**: The field used as the variable value. OpenSearch Dashboards inserts this value into queries when you reference the variable.
- **Label field**: An optional field used as the display label in the variable dropdown list. The label does not change the value inserted into queries.

For example, if your query returns `service_id` and `service_name`, set **Value field** to `service_id` and **Label field** to `service_name`. The dropdown list displays the service name, and queries receive the service ID.

If you do not select a value field, OpenSearch Dashboards uses the first field returned by the query. To avoid unexpected values, preview the query and explicitly select the field to use as the variable value.
{: .tip}

## Creating a custom variable

Use a custom variable when the list of available values is fixed and does not need to be fetched from a data source. For example, you can create an `environment` variable containing the `dev`, `staging`, and `prod` options.

To create a custom variable, follow these steps:

1. In your Observability workspace, select **Dashboards** in the left navigation.
1. Open an existing dashboard or select **Create** > **Dashboard** to create a new dashboard. If you create a new dashboard, save it first by entering a title and selecting **Save**.
1. At the top of the dashboard, select **Add variable**.
1. Configure the following general settings:
   - **Name**: Enter `environment`. This is the identifier used to reference the variable in queries, for example, `$environment` or `${environment}`.
   - **Label**: Enter `Environment`.
   - **Description**: Optionally, enter a description, such as `Filters visualizations by deployment environment`.
   - **Type**: Select **Custom**.
1. In **Custom options**, select **Add option**.
1. In the first option row, enter `dev` in **Value** and `Development` in **Label**. OpenSearch Dashboards inserts the value into queries when you reference the variable and uses the optional label as the display text in the dropdown list.
1. Select **Add option** again and enter `staging` in **Value** and `Staging` in **Label**.
1. Select **Add option** again and enter `prod` in **Value** and `Production` in **Label**.
1. Configure the shared option settings. For more information, see [Configuring variable option settings](#configuring-variable-option-settings).
1. Select **Add variable**.

Custom option values must be unique and cannot be empty. OpenSearch Dashboards displays a maximum of 100 options in the dropdown list.
{: .note}

The following image shows an `environment` custom variable configured with value and label pairs.

![Variable editor panel configured for an environment custom variable with value and label option rows]({{site.url}}{{site.baseurl}}/images/dashboard-variables/custom-variable-config.png){: width="500" }

## Configuring variable option settings

Query variables and custom variables share the following option settings:

- **Sort**: Controls how options are sorted in the dropdown list. Select **Disabled**, **Alphabetical** ascending or descending, or **Numerical** ascending or descending.
- **Allow multiple selections**: Allows you to select more than one value from the variable dropdown list.
- **Include All option**: Adds an **All** option to the dropdown list. This setting is available only when **Allow multiple selections** is turned on.

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
