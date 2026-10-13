---
layout: default
title: OpenSearch Dashboards
nav_order: 1
has_children: false
nav_exclude: true
permalink: /dashboards/
redirect_from:
  - /dashboards/index/
start_cards:
  - heading: "Install OpenSearch Dashboards"
    description: "Install OpenSearch Dashboards using Docker, Helm, a package manager, a tarball, or on Windows"
    link: "/install-and-configure/install-dashboards/index/"
  - heading: "Try it in the Playground"
    description: "Explore OpenSearch Dashboards in your browser without installing anything"
    link: "https://playground.opensearch.org/app/home#/"
getting_started_cards:
  - heading: "Getting started"
    description: "Learn the main applications step by step using sample data"
    link: "/dashboards/getting-started/"
  - heading: "Navigating OpenSearch Dashboards"
    description: "Learn the layout of the home page and the left navigation panel"
    link: "/dashboards/navigating-ui/"
---

# OpenSearch Dashboards

OpenSearch Dashboards is the web UI for OpenSearch. Use it to search and explore your data, build visualizations and dashboards, and manage your cluster without writing API requests.

{% include cards.html cards=page.start_cards %}

## Getting started

{% include cards.html cards=page.getting_started_cards %}

## Adding data

To work with data in OpenSearch Dashboards, either add it to OpenSearch or connect to where it's stored:

- [Ingest data]({{site.url}}{{site.baseurl}}/getting-started/ingest-data/) into OpenSearch indexes.
- [Connect data sources]({{site.url}}{{site.baseurl}}/dashboards/management/data-sources/), such as other OpenSearch clusters, Amazon S3, or Prometheus, to query data without ingesting it.

## Exploring and visualizing data

Use the following applications to search your data and present it visually. The table lists the query language that you use in each application.

| Application | Use it to | Query language |
| :--- | :--- | :--- |
| [Discover]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/) | Search, filter, and examine your data. | [DQL]({{site.url}}{{site.baseurl}}/dashboards/dql/) or [query string (Lucene)]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/) |
| [Visualize]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/) | Create charts, maps, tables, and other visualizations using a point-and-click interface. | [DQL]({{site.url}}{{site.baseurl}}/dashboards/dql/) or [query string (Lucene)]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/) |
| [Dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/) | Combine multiple visualizations into a single page and filter all of them at once. | [DQL]({{site.url}}{{site.baseurl}}/dashboards/dql/) or [query string (Lucene)]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/) |
| [Query Workbench]({{site.url}}{{site.baseurl}}/dashboards/query-workbench/) | Run on-demand SQL and PPL queries. | [SQL]({{site.url}}{{site.baseurl}}/sql-and-ppl/sql/) or [PPL]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/) |
| [Dev Tools]({{site.url}}{{site.baseurl}}/dashboards/dev-tools/index/) | Send OpenSearch API requests from the browser. | [Query DSL]({{site.url}}{{site.baseurl}}/query-dsl/) |

If [workspaces]({{site.url}}{{site.baseurl}}/dashboards/workspace/) are enabled, you can also create visualizations by writing PPL or PromQL queries. For more information, see [Creating visualizations using queries]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualization-editor/).

## Managing indexes and snapshots

Use the following applications to manage indexes and snapshots.

| Application | Use it to |
| :--- | :--- |
| [Index Management]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/) | Manage indexes, data streams, aliases, templates, and Index State Management policies. |
| [Snapshot Management]({{site.url}}{{site.baseurl}}/dashboards/sm-dashboards/) | Back up and restore your cluster's indexes and state. |

## Observability

To monitor logs, traces, and metrics in OpenSearch Dashboards, see [Observability]({{site.url}}{{site.baseurl}}/observing-your-data/index/). To set up prebuilt dashboards and visualizations for common data sources, such as NGINX logs, see [Integrations]({{site.url}}{{site.baseurl}}/dashboards/integrations/index/).

## Using AI assistance

The [OpenSearch Assistant]({{site.url}}{{site.baseurl}}/dashboards/dashboards-assistant/index/) adds AI-powered assistance to OpenSearch Dashboards.

## Configuring and administering OpenSearch Dashboards

You can configure OpenSearch Dashboards in two places, depending on your role.

| Where | Who uses it | What you can configure |
| :--- | :--- | :--- |
| [Dashboards Management]({{site.url}}{{site.baseurl}}/dashboards/management/management-index/), an application in the UI | Users who have the required permissions | [Index patterns]({{site.url}}{{site.baseurl}}/dashboards/management/index-patterns/), [data sources]({{site.url}}{{site.baseurl}}/dashboards/management/data-sources/), [saved objects]({{site.url}}{{site.baseurl}}/dashboards/management/saved-objects/), and [advanced settings]({{site.url}}{{site.baseurl}}/dashboards/management/advanced-settings/) |
| The `opensearch_dashboards.yml` configuration file | Administrators who deploy OpenSearch Dashboards and have access to the host | Deployment-level settings, such as [custom branding]({{site.url}}{{site.baseurl}}/dashboards/branding/), [network compression]({{site.url}}{{site.baseurl}}/dashboards/compression/), and [workspaces]({{site.url}}{{site.baseurl}}/dashboards/workspace/). For more information, see [Settings and administration]({{site.url}}{{site.baseurl}}/dashboards/settings-and-administration/) and [Configuring OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-dashboards/). |
