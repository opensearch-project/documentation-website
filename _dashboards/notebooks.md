---
layout: default
title: Notebooks (experimental)
nav_order: 50
redirect_from: /docs/notebooks/
has_children: false
---

# OpenSearch Dashboards notebooks (experimental)

Notebooks have a known issue with [tenants]({{site.url}}{{site.baseurl}}/security-plugin/access-control/multi-tenancy/). If you open a notebook and can't see its visualizations, you might be under the wrong tenant, or you might not have access to the tenant at all.
{: .warning }

An OpenSearch Dashboards notebook is an interface that lets you easily combine live visualizations and narrative text in a single notebook interface.

Notebooks let you interactively explore data by running different visualizations that you can share with team members to collaborate on a project.

A notebook is a document composed of two elements: OpenSearch Dashboards visualizations and paragraphs (Markdown). Choose multiple timelines to compare and contrast visualizations.

Common use cases include creating postmortem reports, designing runbooks, building live infrastructure reports, and writing documentation.


## Get Started with notebooks

To get started, choose **OpenSearch Dashboards Notebooks** within OpenSearch Dashboards.


### Step 1: Create a notebook

A notebook is an interface for creating reports.

1. Choose **Create notebook** and enter a descriptive name.
1. Choose **Create**.

Choose **Notebook actions** to rename, duplicate, or delete a notebook.


### Step 2: Add a paragraph

Paragraphs combine text and visualizations for describing data.


#### Add a markdown paragraph

1. To add text, choose **Add markdown paragraph**.
1. Add rich text with markdown syntax.

![Markdown paragraph]({{site.url}}{{site.baseurl}}/images/markdown-notebook.png)


#### Add a visualization paragraph

1. To add a visualization, choose **Add OpenSearch Dashboards visualization paragraph**.
1. In **Title**, select your visualization and choose a date range. You can choose multiple timelines to compare and contrast visualizations.
1. To run and save a paragraph, choose **Run**.

You can perform the following actions on paragraphs:

- Add a new paragraph to the top of a report.
- Add a new paragraph to the bottom of a report.
- Run all the paragraphs at the same time.
- Clear the outputs of all paragraphs.
- Delete all the paragraphs.
- Move paragraphs up and down.
