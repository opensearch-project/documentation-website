---
layout: default
title: Ingest processors
nav_order: 30
has_children: true
redirect_from:
   - /api-reference/ingest-apis/ingest-processors/
---

# Ingest processors
**Introduced 1.0**
{: .label .label-purple }

Ingest processors are a core component of [ingest pipelines]({{site.url}}{{site.baseurl}}/ingest-pipelines/index/). They preprocess documents before indexing. For example, you can remove fields, extract values from text, convert data formats, or append additional information.

OpenSearch provides a standard set of ingest processors within your OpenSearch installation. For a list of processors available in OpenSearch, use the [Nodes Info]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-info/) API operation:

```json
GET /_nodes/ingest?filter_path=nodes.*.ingest.processors
```
{% include copy-curl.html %}

To set up and deploy ingest processors, make sure you have the necessary permissions and access rights. See [Security plugin REST API]({{site.url}}{{site.baseurl}}/security/access-control/api/) to learn more.
{:.note}

Processor types and their required or optional parameters vary depending on your specific use case. See the [Ingest processors]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/ingest-processors/) section to learn more about the processor types and defining and configuring them within a pipeline.
