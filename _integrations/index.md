---
layout: default
title: OpenSearch Integrations
nav_order: 1
has_children: false
nav_exclude: true
---

# OpenSearch Integrations
Introduced 2.9
{: .label .label-purple }

An _integration_ in OpenSearch contains a bundle of metadata, data mappings, and visualizations that simplify monitoring your data. The **Integrations** tool gives you the flexibility to connect and collect data from a variety of sources through the OpenSearch Dashboards user interface (UI). Through the interface, you can connect your data sources with a few clicks and then explore your data using search and analytics tools such as Discover. 

The OpenSearch Project continues to work on this feature and seeks your feedback. Let us know on the [OpenSearch forum](https://forum.opensearch.org/) how it works for you or how it can be improved. 
{: .note}

## Integrations resources for developers

For the latest developer information, including the sample code, articles, tutorials, and an API reference, see the following resources:

- [Integrations repository](https://github.com/opensearch-project/observability/tree/e18cf354fd7720a6d5df6a6de5d53e51a9d43127/integrations) on GitHub
- [Integration Documentation Reference](https://github.com/opensearch-project/dashboards-observability/wiki/Integration-Documentation-Reference) on GitHub
- [Integration Creation Guide](https://github.com/opensearch-project/dashboards-observability/wiki/Integration-Creation-Guide)
- [Integrations Catalog](https://github.com/opensearch-project/opensearch-catalog/blob/main/docs/integrations/integration-catalog.md)
- [OpenSearch Observability Integrations Catalog](https://htmlpreview.github.io/?https://github.com/opensearch-project/opensearch-catalog/blob/main/integrations/observability/catalog.html)
- [Observability plugin for OpenSearch Dashboards](https://github.com/opensearch-project/dashboards-observability/wiki)
 
## The Integrations schema

The Integrations schema outlines how to capture, analyze, and visualize data. It includes the selection and configuration of monitoring tools, data collection methods, data storage and retention strategies, and visualization and alerting mechanisms. It follows the [OpenTelemetry Protocol convention](https://github.com/open-telemetry), with OpenSearch [Simple Schema for Observability](https://opensearch.org/docs/latest/observing-your-data/ssfo/) handling the translation from the OpenTelemetry (OTel) schema to the physical index mapping templates. 

Find detailed information about the schema, including schema examples, in the [OpenSearch Observability READ.me file](https://github.com/opensearch-project/opensearch-catalog/blob/main/docs/schema/observability/README.md) and on the [OpenSearch Observability wiki](https://github.com/opensearch-project/dashboards-observability/wiki/OpenSearch-Observability--Home#observability-schema).

## Get started

Using the OpenSearch Dashboards interface, you can connect your data, applications, and processes so that you can centrally manage the services you use. All integrations are available in a single view from the either the OpenSearch Dashboards home page or menu. 

Learn how to use the OpenSearch Dashboards interface to:

- Access integrations
- View integrations
- Add integrations 

The following image gives you a snapshot of the Integrations interface: 

![Get started with Integrations demo]({{site.url}}{{site.baseurl}}/images/integrations/nginx-integration.gif)

### Access integrations

To access integrations, open OpenSearch Dashboards and select **Integrations** from the **Management** menu. The interface displays installed and available integrations.

## View integrations

To view an integration, view the dashboard associated with the integration. If the integration doesn't have an associated dashboard, select the desired integration listed under the **Installed** window. View the integration details, such as assets and fields. 

## Add integrations

If you have not installed any integrations, you'll be prompted to install them from the Integrations interface. Supported integrations are listed in the **Available** window. 

To add an integration, select the desired prepackaged assets. Currently, OpenSearch Integrations has two flows: Add or Try it. The following example uses the Try it flow:

1. On the **Integrations** page, select **NginX Dashboard**.
2. Select the **Try it** button. _The Try it flow automatically creates a sample index template, adds sample data to the template, and then creates the integration based on that data._
3. View the asset list and select a dashboard asset.
4. Preview the data visualizations and sample data details.  

