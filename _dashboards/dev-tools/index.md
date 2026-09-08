---
layout: default
title: Using Dev Tools
parent: Exploring data
nav_order: 20
has_children: true
has_toc: false
redirect_from:
  - /dashboards/run-queries/
  - /dashboards/dev-tools/run-queries/
  - /dashboards/dev-tools/index-dev/
  - /dashboards/visualize/run-queries/
  - /dashboards/discover/run-queries/
  - /dashboards/dev-tools/
---

# Using Dev Tools

The **Dev Tools** application in OpenSearch Dashboards provides tools for querying your cluster and testing queries and ingest patterns. 

## Navigating to Dev Tools

To open Dev Tools, select **Dev Tools** on the main OpenSearch Dashboards page, as shown in the following image.

![Dev Tools console from main page]({{site.url}}{{site.baseurl}}/images/dev-tools/dev-tools-main.png)

You can open Dev Tools from any other page by navigating to the main menu and selecting **Management** > **Dev Tools**, as shown in the following image.

![Dev Tools console from all pages]({{site.url}}{{site.baseurl}}/images/dev-tools/dev-tools-left.png){: width="200" }

In installations with workspaces enabled, select the code icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/code-icon.png" class="inline-icon" alt="code icon"/>{:/}) in the lower-left corner of the navigation panel.

## Using Dev Tools

The **Dev Tools** application is shown in the following image. 

![Dev Tools Console application]({{site.url}}{{site.baseurl}}/images/dev-tools/dev-tools-console.png)

Dev Tools contains the following applications:

- [**Console**]({{site.url}}{{site.baseurl}}/dashboards/dev-tools/console/) sends [Query DSL]({{site.url}}{{site.baseurl}}/query-dsl/) queries and other REST API requests to OpenSearch and displays the responses.
- [**Grok Debugger**]({{site.url}}{{site.baseurl}}/dashboards/dev-tools/grok-debugger/) builds and tests [Grok patterns]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/grok/) against sample log data before you use them in ingest pipelines.
- [**Query Profiler**]({{site.url}}{{site.baseurl}}/dashboards/dev-tools/query-profiler/) measures how long each part of a search query takes to run so that you can identify slow components.
