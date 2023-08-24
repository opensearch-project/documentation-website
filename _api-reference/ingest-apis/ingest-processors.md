---
layout: default
title: Ingest processors
parent: Ingest APIs
nav_order: 50
has_children: true
---

# Ingest processors

Ingest processors are a core component of data processing [pipelines]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/pipelines/), as they preprocess and shape documents before indexing. For example, you can remove fields, extract values from text, convert data format, or enrich additional information.

OpenSearch provides a standard set of ingest processors within your OpenSearch installation. For a list of processors available in OpenSearch, use the [nodes info]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-info/) API:

```json
GET /_nodes/ingest?filter_path=nodes.*.ingest.processors
```
{% include copy-curl.html %}

To set up and deploy ingest processors, make sure you have the necessary permissions and access rights. You can learn more about the processor types within their respective documentation.
{: .note}

See the [Processors Reference](<insert link>) section for more information about each ingest processor.
