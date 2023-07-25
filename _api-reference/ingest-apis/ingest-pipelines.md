---
layout: default
title: Ingest pipelines
parent: Ingest APIs
has_children: true
nav_order: 5
---

# Ingest pipelines

An _ingest pipeline_ is a sequence of steps that are applied to data as it is being ingested into a system. Each step in the pipeline performs a specific task, such as filtering, transforming, or enriching the data. The order in which the steps are applied are important, as each step depends on the output of the previous step. 

Ingest pipelines consist of _processors_. Processors are customizable tasks that run in a sequential order as they appear in the request body. This order is important, as each processor depends on the output of the previous processor. The transformed data appears in your index after each of the processor completes.

Ingest pipelines in OpenSearch can only be managed using [ingest API operations]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/). When using ingest in production environments, your cluster should contain at least one node with the node roles permission set to `ingest`. For information about setting up node roles within a cluster, see [Cluster Formation]({{site.url}}{{site.baseurl}}/opensearch/cluster/).
{: .note}

## Define a pipeline

A pipeline definition describes the steps involved in an ingest pipeline and can be written in JSON format. An ingest pipeline consists of the following:

```json
{
    "description" : "..."
    "processors" : [...]
}
```

## Request body fields

Field | Required | Type | Description
:--- | :--- | :--- | :---
`description` | Optional | String | Description of the ingest pipeline. 
`processors` | Required | Array of processor objects | A component that performs a specific task to process data as it's being ingested into OpenSearch. 

