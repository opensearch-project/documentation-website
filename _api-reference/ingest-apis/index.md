---
layout: default
title: Ingest APIs
has_children: true
nav_order: 40
redirect_from:
  - /opensearch/rest-api/ingest-apis/index/
---

# Ingest APIs

Ingest pipelines in OpenSearch can only be managed using ingest API operations. When using ingest in production environments, your cluster should contain at least one node with the node roles permission set to `ingest`. For more information about setting up node roles within a cluster, see [Cluster formation]({{site.url}}{{site.baseurl}}/opensearch/cluster/).
{: .note}

The OpenSearch ingest APIs simplify the data ingestion process with a standard and structured way to process input data. The ingest pipelines pre-process and transform data before it's indexed in OpenSearch. A pipeline consists of processors, customizable tasks that run in the order they are defined in the pipeline. The transformed data is ingested in your index after each processor completes.

The key fields typically used in a pipeline are `description` and `processors`. The `description` is an optional field that provides a description of the pipeline's purpose or functionality. The `processors` field is an array that defines the sequence of processing stages within the pipeline. The output of one processor becomes the input for the next.

```json
{
  "description" : "...",
  "processors" : [ ... ]
}
```

## Next steps

- Start first with [creating a pipeline]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/create-update-ingest/).
- Learn more about OpenSearch [ingest processors]({{site.url}}{{site.baseurl}}/<index-page-in-progess>).
