---
layout: default
title: Workspace
nav_order: 110
has_children: true
---

# Workspace for OpenSearch Dashboards
**Introduced 2.17**
{: .label .label-purple }

The workspace feature allows users to customize their OpenSearch-Dashboards experience with curated use cases, for example, user can create a workspace particularly for observability use case so that they can concentrate on observability related functionaties. Also, workspace helps users organize visual assets, such as dashboards and visualizations, such assets are isolated by workspace. This makes it a valuable tool for OpenSearch-Dashboards users who want a more precise and flexible workflow.

## Enabling Workspace

To enable *Workspace* in OpenSearch Dashboards, locate your copy of the `opensearch_dashboards.yml` file and set the following option:

```yaml
workspace.enabled: true
uiSettings:
  overrides:
    "home:useNewHomePage": true
```
{% include copy-curl.html %}

If you have security plugin installed in your cluster, please set the tenant as disabled.