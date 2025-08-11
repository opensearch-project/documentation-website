---
layout: default
title: Exploring search evaluation results
nav_order: 65
parent: Search Relevance Workbench
grand_parent: Search relevance
has_children: false
---

# Exploring search evaluation results
Introduced 3.2
{: .label .label-purple }

In addition to retrieving the experiment results using the API, users can explore the results visually. The Search Relevance Workbench comes with dashboards that users can install to review search evaluation and hybrid search optimization experiment results.

## Installing the dashboards

Users have two ways to install the dashboards:

* Select a visualization icon in the experiment overview in the "Actions" column.

* Select the Install Dashboards button in the upper right corner of the experiment overview.

<img src="{{site.url}}{{site.baseurl}}/images/search-relevance-workbench/experiment_overview_dashboard_installation_options.png" alt="Experiment overview of the Search Relevance Workbench including dashboard installation options"/>{: .img-fluid }

A modal offers the user to install the dashboards.

<img src="{{site.url}}{{site.baseurl}}/images/search-relevance-workbench/install_dashboards_modal.png" alt="Modal to install dashboards"/>{: .img-fluid }

## Using the dashboards

Once installed, selecting the visualization icon in the experiment overview in the "Actions" column takes users to a dashboard view of the experiment results. The view presented depends on the type of experiment the user chose:

* The search evaluation dashboard focuses on the individual query level to give the users insights about well-performing queries and queries with open relevance potential.

* The hybrid search dashboard provides the user with an overview how the different hybrid search parameter configurations performed and guide users to identify good candidates for further exploration and experimentation.

### Search evaluation dashboard

The search evaluation dashboard aggregates performance metrics across all queries in your selected experiment. Use this to get a high-level view of overall experiment performance and identify which queries need attention.

<img src="{{site.url}}{{site.baseurl}}/images/search-relevance-workbench/search_evaulation_dashboard.png" alt="Modal to install dashboards"/>{: .img-fluid }

The **Deep Dive Summary** shows the aggregate metrics for NDCG, MAP, Precision and Coverage (see [Evaluating search quality]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/search-configurations/)).

The **Deep Dive Query Scores** pane shows individual query performance ranked by NDCG score (highest to lowest). Use this to identify your best and worst performing queries.

The **Deep Dive Score Densities** pane shows how metric values are distributed across your query set. Use this to understand whether poor performance is widespread or concentrated in specific queries. The x-axis shows metric values, while the y-axis shows how frequently those values occur.

The **Deep Dive Score Scatter Plot** pane shows an interactive view of the preceding distribution data, with each query shown as a separate point. Use this to investigate specific queries at performance extremes. Points are scattered vertically to prevent overlap while maintaining the same x-axis metric values as the preceding distribution view.

### Hybrid search evaluation dashboard

Use this dashboard to compare experiment variants and identify the optimal parameter configurations for your hybrid experiment.

The **Variant Performance Chart** shows your experiment variants arranged visually from best to worst performing (left to right, decreasing NDCG). Use this to quickly spot your top performers and see performance patterns across different parameter combinations at a glance.

**Variant Performance** shows the same variant data in a sortable table format with all metrics visible. Use this to compare specific metric values across variants and customize your analysis by sorting on different performance measures (click any column header to reorder).

<img src="{{site.url}}{{site.baseurl}}/images/search-relevance-workbench/hybrid_search_optimizer_dashboard.png" alt="Modal to install dashboards"/>{: .img-fluid }

### Updating Default Dashboards

To update the default dashboards that ship with the Search Relevance Workbench UI, you need to export the raw dashboard JSON and update the file `./public/components/common_utils/dashboards_data.ts` that holds the data.

TIP: To escape the export JSON data for embedding in the TypeScript you can escape the quotes using: `sed 's/\\/\\\\/g' input.txt > output.txt`.
