---
layout: default
title: Create pipeline
nav_order: 10
redirect_from:
  - /opensearch/rest-api/ingest-apis/create-update-ingest/
  - /api-reference/ingest-apis/create-ingest/
---

# Create pipeline
**Introduced 1.0**
{: .label .label-purple }

Use the create pipeline API operation to create or update pipelines in OpenSearch. Note that the pipeline requires you to define at least one processor that specifies how to change the documents. 

## Path and HTTP method

Replace `<pipeline-id>` with your pipeline ID:

```json
PUT _ingest/pipeline/<pipeline-id>
```
#### Example request

Here is an example in JSON format that creates an ingest pipeline with two `set` processors and an `uppercase` processor. The first `set` processor sets the `grad_year` to `2023`, and the second `set` processor sets `graduated` to `true`. The `uppercase` processor converts the `name` field to uppercase.

```json
PUT _ingest/pipeline/my-pipeline
{
  "description": "This pipeline processes student data",
  "processors": [
    {
      "set": {
        "description": "Sets the graduation year to 2023",
        "field": "grad_year",
        "value": 2023
      }
    },
    {
      "set": {
        "description": "Sets graduated to true",
        "field": "graduated",
        "value": true
      }
    },
    {
      "uppercase": {
        "field": "name"
      }
    }
  ]
}
```
{% include copy-curl.html %}

To learn more about error handling, see [Handling pipeline failures]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/pipeline-failures/).

## Request body fields

The following table lists the request body fields used to create or update a pipeline. 

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`processors` | Required | Array of processor objects | An array of processors, each of which transforms documents. Processors are run sequentially in the order specified.
`description` | Optional | String | A description of your ingest pipeline. 

## Path parameters

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`pipeline-id` | Required | String | The unique identifier, or pipeline ID, assigned to the ingest pipeline. 

## Query parameters

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`cluster_manager_timeout` | Optional | Time | Period to wait for a connection to the cluster manager node. Defaults to 30 seconds.
`timeout` | Optional | Time | Period to wait for a response. Defaults to 30 seconds. 

## Template snippets

Some processor parameters support [Mustache](https://mustache.github.io/) template snippets. To get the value of a field, surround the field name in three curly braces, for example, `{% raw %}{{{field-name}}}{% endraw %}`.

#### Example: `set` ingest processor using Mustache template snippet

The following example sets the field `{% raw %}{{{role}}}{% endraw %}` with a value `{% raw %}{{{tenure}}}{% endraw %}`:

```json
PUT _ingest/pipeline/my-pipeline
{
 "processors": [
    {
      "set": {
        "field": "{% raw %}{{{role}}}{% endraw %}",
        "value": "{% raw %}{{{tenure}}}{% endraw %}"
         }
    }
  ]
}
```
{% include copy-curl.html %}
