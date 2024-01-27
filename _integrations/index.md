---
layout: default
title: OpenSearch Integrations
nav_order: 1
has_children: false
nav_exclude: true
permalink: /integrations/
redirect_from:
  - /integrations/index/
---

# OpenSearch Integrations
Introduced 2.9
{: .label .label-purple }

OpenSearch Integrations gives you an out-of-the-box solution to set up your favorite dashboards. An _integration_ contains a bundle of metadata, data mappings, and visualizations that simplify monitoring your data. With the **Integrations** tool, you have the flexibility to connect and collect data from a variety of sources through the OpenSearch Dashboards user interface (UI). Through the UI, you can connect your data sources with a few clicks and then explore your data using search and analytics tools such as Discover and Dashboards.  

OpenSearch Integrations is an ongoing work in progress. New capabilities are added with each release to improve the functionality and user experience. We appreciate your [feedback and suggestions](https://forum.opensearch.org/) for improvement. 
{: .note}

## Integrations resources for developers

For the latest developer information, including the sample code, articles, tutorials, and an API reference, see the following resources:

- [Integrations repository](https://github.com/opensearch-project/observability/tree/e18cf354fd7720a6d5df6a6de5d53e51a9d43127/integrations) on GitHub
- [Integration Documentation Reference](https://github.com/opensearch-project/dashboards-observability/wiki/Integration-Documentation-Reference) on GitHub
- [Integration Creation Guide](https://github.com/opensearch-project/dashboards-observability/wiki/Integration-Creation-Guide)
- [Integrations Catalog](https://github.com/opensearch-project/opensearch-catalog/blob/main/docs/integrations/integration-catalog.md)
- [OpenSearch Observability Integrations Catalog](https://htmlpreview.github.io/?https://github.com/opensearch-project/opensearch-catalog/blob/main/integrations/observability/catalog.html)
- [Observability plugin for OpenSearch Dashboards](https://github.com/opensearch-project/dashboards-observability/wiki)
 
## Schema

The Integrations schema outlines how to capture, analyze, and visualize data. It includes the selection and configuration of monitoring tools, data collection methods, data storage and retention strategies, and visualization and alerting mechanisms. It follows the [OpenTelemetry Protocol convention](https://github.com/open-telemetry), with OpenSearch [Simple Schema for Observability](https://opensearch.org/docs/latest/observing-your-data/ssfo/) handling the translation from the OpenTelemetry (OTel) schema to the physical index mapping templates. 

Find detailed information about the schema, including schema examples, go to the following resources:

- [OpenSearch Observability READ.me file](https://github.com/opensearch-project/opensearch-catalog/blob/main/docs/schema/observability/README.md)
- [OpenSearch Observability wiki](https://github.com/opensearch-project/dashboards-observability/wiki/OpenSearch-Observability--Home#observability-schema).

## Get started

Using the UI, you can connect your data, applications, and processes so that you can centrally manage the services you use. All integrations are available in a single view from either the OpenSearch Dashboards homepage or menu. 

In the following sections, you'll learn how to use the UI to:

- Access integrations
- View integrations
- Add integrations 

The following demo gives you a snapshot of using OpenSearch Integrations: 

![Get started with Integrations demo]({{site.url}}{{site.baseurl}}/images/integrations/nginx-integration.gif)

### Access integrations

To access integrations, open OpenSearch Dashboards and select **Management** > **Integrations** from the main menu. The UI, shown in the following image, displays installed and available integrations.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/integrations-page.png" alt="Available Integrations homepage" width="700"/>

## View integrations

To view an integration dashboard, select the dashboard associated with the integration. If an integration doesn't have an associated dashboard, you can select the desired integration listed under the **Installed** tab and then view the details and a screenshot of its visualizations. The following image shows a details page for a sample integration.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/integration-details.png" alt="Sample integration details page" width="700"/>

## Add integrations

If you have not installed any integrations, you'll be prompted to install them from the Integrations UI. Supported integrations are listed under the **Available** tab. 

To add an integration, select the desired prepackaged assets. Currently, OpenSearch Integrations has two flows: **Add** or **Try it**. The following tutorial uses the **Try it** flow:

1. On the **Integrations** page, select one of the available integrations. For this tutorial, use **Apache Dashboard**.
2. Select the **Try it** button. _The Try it flow automatically creates a sample index template, adds sample data to the template and then creates the integration based on that data._
3. View the asset list and select a dashboard asset.
4. Preview the data visualizations and sample data details.  

The following image shows the view you see after following the preceding steps.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/integrations-apache.png" alt="Try it integration dashboard view" width="700"/>
