---
layout: default
title: Workspace
nav_order: 110
has_children: true
---

# Workspace for OpenSearch Dashboards
**Introduced 2.17**
{: .label .label-purple }

The workspace feature allows users to customize their OpenSearch Dashboards experience with curated use cases, for example, a user can create a workspace specifically for observability use cases so that they can concentrate on observability-related functionalities. Also, the workspace feature helps users organize visual assets, such as dashboards and visualizations, which are isolated by workspace. This makes it a valuable tool for OpenSearch Dashboards users who want a more precise and flexible workflow.

## Workspace data model
```typescript
interface Workspace {
  id: string;
  name: string;
  description?: string;
  features?: string[];
  color: string;
  uiSettings: Record<string, unknown>;
}
```
1. `id`: A unique identifier that distinguishes each workspace.
2. `name`: The name of the workspace.
3. `description`: A description providing context for the workspace.
4. `features`: An array of use case IDs associated with the workspace.

**Workspace object example**
```typescript
{
  id: "M5NqCu",
  name: "Analytics team",
  description: "Analytics team workspace",
  features: ["use-case-analytics"],
}
```

The above object defines a workspace named `Observability team` created with `observability` features by specifying the use case `use-case-observability`. A use case maps to multiple predefined OSD features, only the defined features will be available within the workspace. Use case strings are predefined, there are five types of use cases, except `use-case-all` which all features are available, the other four types of use cases have predefined curated features:
1. `use-case-observability`
2. `use-case-security-analytics`
3. `use-case-search`
4. `use-case-essentials`
5. `use-case-all`

## Associate saved objects with workspaces
Saved objects, such as dashboards, visualizations, and index patterns, form the backbone of data visualization and analysis in OpenSearch Dashboards.
However, as the volume of saved objects grows, keeping them organized becomes increasingly challenging. Grouping saved objects into distinct workspaces, each serving a specific purpose or team. This association simplifies finding and accessing relevant saved objects.

A new attribute, `workspaces`, is being added to saved objects which type is an array of string. A saved object can be associated with one or multiple workspaces. Saved objects (dashboards, visualizations, etc.) will only appear in their associated workspaces.

The following example shows the dashboard object is associated with workspace which id is `M5NqCu`
```typescript
{
  type: "dashboard",
  id: "da123f20-6680-11ee-93fa-df944ec23359",
  workspaces: ["M5NqCu"]
}
```

Saved object can also be associated with multiple workspaces, this is useful in scenarios where a saved object is relevant to multiple teams, projects, or use cases.

Consider the following example, where a data source is associated with multiple workspaces:
```typescript
{
  type: "data-source",
  id: "da123f20-6680-11ee-93fa-df944ec23359",
  workspaces: ["M5NqCu", "<TeamA-workspace-id>", "<Analytics-workspace-id>"]
}
```
By allowing saved objects to be linked with multiple workspaces, this enables users to share and collaborate on resources across various workspaces (teams).

## Non-workspace saved objects
While the introduction of workspaces in OSD provides a powerful framework for organizing and managing saved objects, it's important to note that not all saved objects are necessarily associated with workspaces. Some saved objects, by nature or purpose, may exist independently of workspaces.

For example, the global UI settings object. This object contains configurations and settings that apply globally across OSD, affecting the overall user interface and user experience. These settings are not tied to any specific workspace because they are intended to impact the entire OSD. such objects won’t include the `workspaces` attribute.

The coexistence of workspace-associated saved objects and those without workspace association ensures that OSD strikes a balance between context-specific customization and system-wide consistency.

## Enabling Workspace

To enable *Workspace* in OpenSearch Dashboards, locate your copy of the `opensearch_dashboards.yml` file and set the following option:

```yaml
workspace.enabled: true
uiSettings:
  overrides:
    "home:useNewHomePage": true
```
{% include copy-curl.html %}

If the security plugin is installed in your cluster, please set the multitenancy as disabled because workspaces serve a similar purpose but will conflict with it.

```yaml
opensearch_security.multitenancy.enabled: false
```
{% include copy-curl.html %}
