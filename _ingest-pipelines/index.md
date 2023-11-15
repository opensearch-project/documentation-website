---
layout: default
title: Ingest pipelines
nav_order: 5
nav_exclude: true
redirect_from:
   - /api-reference/ingest-apis/ingest-pipelines/
---

# Ingest pipelines
**Introduced 1.0**
{: .label .label-purple }

An _ingest pipeline_ is a sequence of _processors_ that are applied to documents as they are ingested into an index. Each [processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/index-processors/) in a pipeline performs a specific task, such as filtering, transforming, or enriching data. 

Processors are customizable tasks that run in a sequential order as they appear in the request body. This order is important, as each processor depends on the output of the previous processor. The modified documents appear in your index after the processors are applied.

Ingest pipelines can only be managed using [ingest API operations]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/).
{: .note}

## Prerequisites 

The following are prerequisites for using OpenSearch ingest pipelines:

- When using ingestion in a production environment, your cluster should contain at least one node with the node roles permission set to `ingest`. For information about setting up node roles within a cluster, see [Cluster Formation]({{site.url}}{{site.baseurl}}/opensearch/cluster/).
- If the OpenSearch Security plugin is enabled, you must have the `cluster_manage_pipelines` permission to manage ingest pipelines.

## Define a pipeline

A _pipeline definition_ describes the sequence of an ingest pipeline and can be written in JSON format. An ingest pipeline consists of the following:

```json
{
    "description" : "..."
    "processors" : [...]
}
```

#### Request body fields

Field | Required | Type | Description
:--- | :--- | :--- | :---
`processors` | Required | Array of processor objects | A component that performs a specific data processing task as the data is being ingested into OpenSearch.
`description` | Optional | String | A description of the ingest pipeline. 

## Next steps

Learn how to:

- [Create a pipeline]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/).
- [Test a pipeline]({{site.url}}{{site.baseurl}}/ingest-pipelines/simulate-ingest/).
- [Retrieve information about a pipeline]({{site.url}}{{site.baseurl}}/ingest-pipelines/get-ingest/).
- [Delete a pipeline]({{site.url}}{{site.baseurl}}/ingest-pipelines/delete-ingest/). 
