---
layout: default
title: Dashboard variables
has_children: true
has_toc: false
nav_order: 75
redirect_from:
  - /dashboards/dashboard-variables/
---

# Dashboard variables
**Introduced 3.7.0**
{: .label .label-purple }

Dashboard variables enable you to create interactive, dynamic dashboards by defining reusable values that can be referenced in visualization queries. Variables can be used for filters, metrics, dimensions, intervals, fields, aggregations, and any other query parameter, eliminating the need to manually edit queries.

With dashboard variables, you can:

- Allow dashboard viewers to change query parameters without editing visualizations
- Define values once and reference them across multiple visualizations
- Automatically update visualizations when variable values change
- Create cascading filters with dependent variables
- Dynamically control grouping, aggregation, and time intervals

---

## Key concepts

### Variable types

OpenSearch Dashboards supports two types of variables:

**Query variables**: Options are dynamically fetched from a data source using a PPL or PromQL query. Use Query variables when values change over time or depend on underlying data, such as service names from logs or available regions from metrics.

**Custom variables**: Options are manually defined as a static list. Use Custom variables for predefined categories like environment types (dev, staging, prod) or fixed status codes.

### Variable syntax

Variables are referenced in queries using `$variableName` or `${variableName}` syntax:

```sql
source=logs | where service='${service}' | stats count() by region
```

When you change a variable's value in the dashboard, all visualizations referencing that variable automatically refresh with the new value.

---

## Variable storage

Variables are stored as part of the dashboard saved object in OpenSearch. Each dashboard maintains its own set of variables independently.

The `variablesJSON` attribute in the dashboard saved object contains the variable configurations:

```typescript
{
  type: "dashboard",
  id: "dashboard-id",
  attributes: {
    title: "My Dashboard",
    variablesJSON: "{\"variables\":[...]}"
  }
}
```
{% include copy.html %}

Variable configurations include:

- **Metadata**: Name, label, description, type
- **Options**: Query definition (for Query type) or custom values (for Custom type)
- **Settings**: Multi-select, "All" option, sort order, visibility
- **Current values**: Selected values for each variable

Current variable values are also synchronized to the dashboard URL, allowing users to:

- Share dashboards with specific filter values pre-selected
- Bookmark dashboards with desired variable states
- Persist variable selections across page refreshes

---

## Enabling the Dashboard variables feature

In your `opensearch_dashboards.yml` file, set the following option:

```yaml
explore.enabled: true
workspace.enabled: true
uiSettings:
  overrides:
    "home:useNewHomePage": true
```
{% include copy.html %}

Dashboard variables is limited to **Observability** and **Analytics** workspaces. To use dashboard variables, ensure you're working within one of these supported workspace types.

---

## Quick start

Follow these steps to add your first variable to a dashboard:

1. Create an **Observability** or **Analytics** workspace.
2. Open a dashboard in edit mode (the dashboard must be saved first).
3. In the variables bar at the top, click **Add variable**.
4. Configure the variable:
   - Enter a **Name** (used to reference it in queries, such as `$service` or `${service}`)
   - Choose a **Type**: Query or Custom
   - For Query type: Write a query that returns options (for example, `source=logs | dedup service | fields service`)
   - For Custom type: Enter values manually
5. Select **Add variable** to save.
6. Reference the variable in your visualization editor query by using `$variableName` syntax and save the visualization.
7. Test the variable by changing its value in the variables bar.

For detailed instructions, see [Managing dashboard variables]({{site.url}}{{site.baseurl}}/dashboards/dashboard-variables/variable-management/).

---

## Next steps

- [Managing dashboard variables]({{site.url}}{{site.baseurl}}/dashboards/dashboard-variables/variable-management/) - Learn how to create, edit, and organize variables
- [Using variables in queries and visualization editors]({{site.url}}{{site.baseurl}}/dashboards/dashboard-variables/using-variables/) - Learn how to reference variables in different contexts
