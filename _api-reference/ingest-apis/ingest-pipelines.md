---
layout: default
title: Ingest pipelines
parent: Ingest APIs
has_children: true
nav_order: 5
---

# Ingest pipelines

An _ingest pipeline_ is a sequence of steps that are applied to data as it is being ingested into a system. Each step in the pipeline performs a specific task, such as filtering, transforming, or enriching data. Ingest pipelines are a valuable tool to help you tailor data to your needs.  

Ingest pipelines consist of _processors_. Processors are customizable tasks that run in a sequential order as they appear in the request body. This order is important, as each processor depends on the output of the previous processor. OpenSearch [ingest processors]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/ingest-processors/) perform common transformations to your data, and the modified data appears in your index after each processor completes.

Ingest pipelines in OpenSearch can only be managed using [ingest API operations]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/).
{: .note}

## Prerequisites 

The following are prerequisites for using OpenSearch ingest pipelines:

- When using ingest in production environments, your cluster should contain at least one node with the node roles permission set to `ingest`. For information about setting up node roles within a cluster, see [Cluster Formation]({{site.url}}{{site.baseurl}}/opensearch/cluster/).
- If the OpenSearch security features are enabled, you must have the `cluster_manage_pipelines` permission to manage ingest pipelines.

## Define a pipeline

A _pipeline definition_ describes the steps involved in an ingest pipeline and can be written in JSON format. An ingest pipeline consists of the following:

```json
{
    "description" : "..."
    "processors" : [...]
}
```

### Request body fields

Field | Required | Type | Description
:--- | :--- | :--- | :---
`processors` | Required | Array of processor objects | A component that performs a specific task to process data as it's being ingested into OpenSearch.
`description` | Optional | String | Description of the ingest pipeline. 

## Next steps

Learn more about how to:

- [Create a pipeline]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/create-update-ingest/)
- [Retrieve information about a pipeline]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/get-ingest/)
- [Test a pipeline]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/simulate-ingest/)
- [Delete a pipeline]({{site.url}}{{site.baseurl}}/ingest-apis/delete-ingest/) in their respective documentation.
