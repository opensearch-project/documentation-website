---
layout: default
title: Ingest processors
parent: Ingest APIs
nav_order: 10
has_children: true
canonical_url: https://docs.opensearch.org/latest/ingest-pipelines/processors/index-processors/
---

# Ingest processors

Ingest processors are a core component of [ingest pipelines]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/ingest-pipelines/) because they preprocess documents before indexing. For example, you can remove fields, extract values from text, convert data formats, or append additional information.

OpenSearch provides a standard set of ingest processors within your OpenSearch installation. For a list of processors available in OpenSearch, use the [Nodes Info]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-info/) API operation:

```json
GET /_nodes/ingest?filter_path=nodes.*.ingest.processors
```
{% include copy-curl.html %}

To set up and deploy ingest processors, make sure you have the necessary permissions and access rights. See [Security plugin REST API]({{site.url}}{{site.baseurl}}/security/access-control/api/) to learn more.
{:.note}

Processor types and their required or optional parameters vary depending on your specific use case. See the [Ingest processors]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/ingest-processors/) section to learn more about the processor types and defining and configuring them within a pipeline.
