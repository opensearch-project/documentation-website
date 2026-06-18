---
layout: default
title: Markdown visualizations
parent: Creating visualizations in the Visualize application
grand_parent: Building data visualizations
nav_order: 110
redirect_from:
  - /dashboards/visualize/markdown/
---

# Markdown visualizations

A Markdown visualization renders formatted text within a dashboard panel. Use Markdown to provide titles, instructions, metric definitions, and explanatory context alongside data visualizations. Markdown supports headings, lists, bold and italic text, links, blockquotes, and code blocks (GitHub-flavored Markdown).

Markdown visualizations do not require a data source.

## When to use Markdown visualizations

Use Markdown visualizations to add context that helps you interpret the data on a dashboard. Common use cases include:

- Dashboard titles and section headers
- Instructions for interacting with filters and controls
- Definitions of key metrics shown in other panels
- Links to related dashboards or external documentation
- Status notes such as data refresh intervals or maintenance schedules

## Creating a Markdown visualization

1. In the **New Visualization** dialog, select **Markdown**.
2. In the **Markdown** text box on the **Data** tab, enter your Markdown content.
3. Select **Update** to preview the rendered output, as shown in the following image.

![Markdown visualization showing a dashboard guide]({{site.url}}{{site.baseurl}}/images/dashboards/markdown-example.png)

4. (Optional) Select the **Options** tab to adjust the base font size or enable **Open links in new tab**.

## Configuring a Markdown visualization

The following settings are available on the **Options** tab.

### Options tab

| Setting | Description |
| :--- | :--- |
| **Font size** | Controls the base font size of the rendered text. |
| **Open links in new tab** | When enabled, links in the Markdown open in a new browser tab. |

## Next steps

- To choose a different visualization type, see [Choosing a visualization type]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/viz-types/).
- To add this visualization to a dashboard, see [Creating dashboards]({{site.url}}{{site.baseurl}}/dashboards/dashboard/).
