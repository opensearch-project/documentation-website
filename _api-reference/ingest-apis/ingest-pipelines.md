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

A _pipeline definition_ describes the steps involved in an ingest pipeline and can be written in JSON format. An ingest pipeline consists of the following:

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

Here is a simple example in JSON format. This creates an ingest pipeline with one processor, a `set` processor, that sets the value of the `name` field to the value of the `user_id` field.

```json
{
  "description": "This is a simple ingest pipeline.",
  "processors": [
    {
      "set": {
        "field": "name",
        "value": "{{user_id}}"
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Template snippets

Use template snippets to create an ingest pipeline that loads data from a file, indexes it into OpenSearch, performs some processing on the data, and outputs the data to a file. You can use template snippets as a starting point for sections of your custom templates or [Mustache](https://mustache.github.io/) template snippets to create dynamic content. Mustache templates use a simple syntax (double curly brackets `{{` and `}}`) to replace placeholders in a template with values from a data source.

The following template snippet sets the value of a field to a specific value. The value can be a string, a number, or a Boolean.

#### Example: `set` ingest processor Mustache template snippet

```json
{
    "set" : {
        "field": "{{field_name}}",
        "value": "{{value}}"
    }
}
```
{% include copy-curl.html %}

The `field_name` and `value` variables are Mustache templates. You can use them to specify the field name and value that you want. For example, the following `set` ingest processor sets the `name` field to the value of the `user_id` field:

```json
{
    "set": {
        "field": "name",
        "value": "{{user_id}}
    }
}
```
{% include copy-curl.html %}

## Next steps

Learn more about creating, getting, deleting, and testing ingest pipelines in the documentation linked under the section titled Related articles.
