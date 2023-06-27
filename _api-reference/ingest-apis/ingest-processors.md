---
layout: default
title: Ingest processors
parent: Ingest APIs
nav_order: 50
has_children: true
---

# Ingest processors

Ingest processors have a crucial role in preparing and enriching data before it is stored and analyzed and improving data quality and usability. They are a set of functionalities or operations applied to incoming data during the ingestion process and allow for real-time data transformation, manipulation, and enrichment. 

Ingest processors are a core component of data processing [pipelines]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/pipelines/). They preprocess and shape data as it enters a system, making it more suitable for downstream operations such as indexing, analysis, or storage. They have a range of capabilities--data extraction, validation, filtering, enrichment, and normalization--that can be performed on different aspects of the data, such as extracting specific fields, converting data types, removing or modifying unwanted data, or enriching data with additional information. 

OpenSearch provides a standard set of ingest processors within your OpenSearch installation. For a list of processors available in OpenSearch, use the [nodes info]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-info/) API:

```json
GET /_nodes/ingest?filter_path=nodes.*.ingest.processors
```
{% include copy-curl.html %}

To set up and deploy ingest processors, make sure you have the necessary permissions and access rights. You can learn more about the processor types within their respective documentation.
{: .note}

See the [Processors Reference](<insert link>) section for more information about each ingest processor.
