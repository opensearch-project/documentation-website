---
layout: default
title: Ingest APIs
has_children: false
nav_order: 70
redirect_from:
  - /opensearch/rest-api/ingest-apis/index/
  - /api-reference/ingest-apis/
---

# Ingest APIs
**Introduced 1.0**
{: .label .label-purple }

Use the ingest APIs to manage [ingest pipelines]({{site.url}}{{site.baseurl}}/ingest-pipelines/), which transform documents before OpenSearch indexes them. A pipeline consists of a sequence of [ingest processors]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/index-processors/), each of which performs one transformation, such as renaming a field, parsing a log line, or generating vector embeddings.

## Pipeline APIs

The following APIs create, retrieve, test, and delete ingest pipelines.

API | Endpoint | Description
:--- | :--- | :---
[Create or update pipeline]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/) | `PUT _ingest/pipeline/{pipeline-id}` | Creates a pipeline or replaces the definition of an existing pipeline.
[Get pipeline]({{site.url}}{{site.baseurl}}/ingest-pipelines/get-ingest/) | `GET _ingest/pipeline/{pipeline-id}` | Returns the definition of one or more pipelines. Omit the pipeline ID to return all pipelines.
[Simulate pipeline]({{site.url}}{{site.baseurl}}/ingest-pipelines/simulate-ingest/) | `POST _ingest/pipeline/{pipeline-id}/_simulate` | Runs a pipeline against sample documents without indexing them. You can simulate an existing pipeline or provide a pipeline definition in the request body.
[Delete pipeline]({{site.url}}{{site.baseurl}}/ingest-pipelines/delete-ingest/) | `DELETE _ingest/pipeline/{pipeline-id}` | Deletes one or more pipelines.

## Processor APIs

The following API returns information about a specific processor.

API | Endpoint | Description
:--- | :--- | :---
[Get grok patterns]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/grok/#retrieving-built-in-patterns) | `GET _ingest/processor/grok` | Returns the built-in patterns that you can reference in `grok` processor expressions.

## Related APIs

The following APIs aren't ingest APIs but return information about ingest processing:

- To list the processors installed on each node, use the [Nodes Info API]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-info/): `GET _nodes/ingest?filter_path=nodes.*.ingest.processors`.
- To view statistics for each pipeline and processor, such as the number of processed and failed documents, use the [Nodes Stats API]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/): `GET _nodes/stats/ingest`.

To apply a pipeline to documents, specify it in an indexing request or set it as an index's default pipeline. For more information, see [Applying a pipeline to documents]({{site.url}}{{site.baseurl}}/ingest-pipelines/#applying-a-pipeline-to-documents).

## Required permissions

If you use the Security plugin, you must have the following permissions to use the ingest APIs.

Permission | Required for
:--- | :---
`cluster:admin/ingest/pipeline/put` | Creating or updating pipelines
`cluster:admin/ingest/pipeline/get` | Retrieving pipelines
`cluster:admin/ingest/pipeline/simulate` | Simulating pipelines
`cluster:admin/ingest/pipeline/delete` | Deleting pipelines
`cluster:admin/ingest/processor/grok/get` | Retrieving grok patterns

The `cluster_manage_pipelines` action group grants all pipeline permissions (`cluster:admin/ingest/pipeline/*`) but not the grok patterns permission. For more information, see [Default action groups]({{site.url}}{{site.baseurl}}/security/access-control/default-action-groups/).
