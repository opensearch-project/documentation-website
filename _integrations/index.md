---
layout: default
title: OpenSearch Integrations
nav_order: 35
has_children: false
---

# OpenSearch Integrations
Introduced 2.9
{: .label .label-purple }

OpenSearch Integrations connects your data sources, giving you an out-of-the-box data ingestion solution that unifies data across your system. Integrations gives you real-time visibility through OpenSearch Dashboards to see what's happening across your system and make decisions about those happenings.

Let us know how Integrations works for you or how it can be improved. Leave feedback in the [Integrations repository](https://github.com/opensearch-project/observability/tree/e18cf354fd7720a6d5df6a6de5d53e51a9d43127/integrations). We look forward to hearing from you.
{: .note} 

## Understanding OpenSearch Integrations

An _integration_ is a type of bundle that defines data streams for ingestion. A _bundle_ consists of the following information: 

- Version
- Metadata configuration file
- Dashboards and visualizations, along with Notebooks
- Data stream index templates for the signal ingestion
- Documentation

OpenSearch Integrations bundles the following components:

- Dashboards
- Visualizations
- Configurations 

These bundle assets provide for the monitoring of logs, metrics, and traces for a resource (for example, device, network element, or service) or group of related resources (for example, Nginx or system). 

#### Example: Structure of an observability integration

The following shows the structure of a typical observability integration. 

**Metadata**

- Observability data producer resource
- Supplement indexes (mapping and naming)
- Collection agent version
- Transformation schema 
- Optional test harnesses repository
- Verified version and documentation 
- Category and classification (logs, traces, alerts,metrics)

**Display components**

- Dashboards 
- Maps
- Applications
- Notebooks
- Operations panels
- Saved queries (PPL, SQL, DQL)
- Alerts

Since the structured data contributes significantly to the understanding of the system's behavior, each resource defines a well-structured mapping to conform with it. Once input content has form and shape, it is used to calculate and correlate different pieces of data.

#### Integrations terminology

The following table defines key terms used with OpenSearch Integrations.

| Term | Definition|
|------| ----------|
| `config.json` | Defines the general configuration for the entire integration component. |
| `display` | The folder storing the visualization components. |
| `queries` | The folder storing the PPL queries. |
| `schemas` | The folder storing the schemas, for example, schemas for mapping translations or index mapping. |
| `samples` | The folder containing sample logs and translated logs. | 
| `metadata` | The folder containing additional metadata definitions, such as security and policies. |
| `info` | The folder containing documentation, licences, and external references. |
| `config.json` | File containing the [Integrations configuration](https://github.com/opensearch-project/observability/tree/e18cf354fd7720a6d5df6a6de5d53e51a9d43127/integrations/nginx). |
| `display` | Visualization containing the relevant visual components associated with the integration. |
| `queries` | Contains specific PPL queries that demonstrate common use cases. 

## Creating an integration

<insert para about creating integrations; what do we want the user to do with this example?>

#### Example: Integrations configuration 

```json
resource-name
    config.json
    display`
        Application.json
        Maps.json
        Dashboard.json
    queries
      Query.json
    schemas
      transformation.json
    samples
      resource.access logs
      resource.error logs
      resource.stats metrics
      expected_results
    info  
      documentation
```
