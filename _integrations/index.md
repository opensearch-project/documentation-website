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

OpenSearch Integrations is a straightforward starting point for OpenSearch and OpenSearch Dashboards users to visualize and understand data using pre-canned dashboards and assets. 

The OpenSearch Project seeks your feedback on this feature. Let us know in the [OpenSearch forum](https://forum.opensearch.org/) how OpenSearch Integrations works for you or how it can be improved. 
{: .label-yellow}

## Setting up OpenSearch Integrations

For the latest developer information, including sample code, articles, tutorials, and API reference, see the following resources:

- [Integrations repository](https://github.com/opensearch-project/observability/tree/e18cf354fd7720a6d5df6a6de5d53e51a9d43127/integrations) on GitHub
- [Integration Creation Guide](https://github.com/opensearch-project/dashboards-observability/wiki/Integration-Creation-Guide)
- [Integration Creation Reference](https://github.com/opensearch-project/dashboards-observability/wiki/Integration-Creation-Reference)

## Integrations schema

The OpenSearch Integrations schema outlines how to capture, analyze, and visualize data. It includes the selection and configuration of monitoring tools, data collection methods, data storage and retention strategies, and visualization and alerting mechanisms. It follows the [OpenTelemetry Protocol convention](https://github.com/open-telemetry), with OpenSearch [Simple Schema for Observability](https://opensearch.org/docs/latest/observing-your-data/ssfo/) handling the translation from the OTEL schema to the physical index mapping templates. 

Find detailed information, including schema examples, about the schema in the [OpenSearch Observability READ.me file](https://github.com/opensearch-project/opensearch-catalog/blob/main/docs/schema/observability/README.md) and on the [OpenSearch Observability wiki](https://github.com/opensearch-project/dashboards-observability/wiki/OpenSearch-Observability--Home#observability-schema).

## Get started

Using the OpenSearch Dashboards interface, you can connect your data, applications, and processes so that you can centrally manage the services you use. All integrations are available in a single view, and OpenSearch Dashboards guides you there from the home page and main menu. 

Learn how to do the following using the OpenSearch Dashboards interface:

- Access integrations
- View integrations
- Add integrations 

![Integrations interface in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/images/integrations-interface.png)

### Access integrations

To access integrations, open OpenSearch Dashboards and select **Integrations** from the **Management** menu. The interface displays installed and available integrations.

## View integrations

To view an integration, select the desired integration listed under the **Installed** window. View the integration details, including assets, such as index patterns, searches, visualizations, and dashboards, and fields, such as severity, number, and text. 

## Add integrations

If you have not installed any integrations, you'll be prompted to install them from the Integrations interface. Supported integrations are listed under the **Available** window. 

To add an integration, select the desired pre-packaged assets. Currently, OpenSearch Integrations has two flows: Add or Try it. The following example uses the Try it flow.

1. From the **Integrations** page, select **NginX Dashboard**.
2. Select the **Try it** button. _The Try it flow automatically creates a sample index template and add sample data into the template, and then creates the integration based on that data._
3. View the asset list, and select a dashboard asset.
4. Preview the data visualizations and explore the sample data details.   






 
