---
layout: default
title: OpenSearch Integrations
nav_order: 35
has_children: false
---

# OpenSearch Integrations
Introduced 2.9
{: .label .label-purple }

OpenSearch Integrations connects your data, applications, and processes so that you can centrally manage the services you use.

Let us know how OpenSearch Integrations works for you or how it can be improved. For developer guides, go to the [Integrations repository](https://github.com/opensearch-project/observability/tree/e18cf354fd7720a6d5df6a6de5d53e51a9d43127/integrations). The OpenSearch Project team wants your feedback on this feature. Leave feedback at <insert-link>. We look forward to hearing from you.
{: .note} 

## Get started



## Key terms

The following table defines key terms used with OpenSearch Integrations.

| Term | Definition |
|------|------------|
| integration | Type of bundle that defines data streams for ingestion. |
| bundle |  Collection of assets consisting of data ingest, storage, and transformation rules, dashboards and visualizations, configuration options, and documentation. |  
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

#### Example: Integrations configuration 

```json
resource-name
- config.json
- display
  - assets.ndjson
- static
  - Screenshots/logos
- schemas
  - component.mapping.json
- data
  - sample_data.json
```
