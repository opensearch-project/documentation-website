---
layout: default
title: Create or update pipeline
nav_order: 10
redirect_from:
  - /opensearch/rest-api/ingest-apis/create-update-ingest/
  - /api-reference/ingest-apis/create-ingest/
  - /api-reference/ingest-apis/create-update-ingest/
---

# Create or Update Pipeline API
**Introduced 1.0**
{: .label .label-purple }

The Create or Update Pipeline API creates an ingest pipeline or replaces the definition of an existing pipeline. The request body must contain the `processors` field. When you update an existing pipeline, the new definition replaces the old one and applies to indexing requests immediately.

## Endpoints

```json
PUT /_ingest/pipeline/{pipeline-id}
```

## Path parameters

The following table lists the available path parameters.

Parameter | Required | Data type | Description
:--- | :--- | :--- | :---
`pipeline-id` | Required | String | The ID of the pipeline to create or update. Can be at most 512 bytes long when UTF-8 encoded.

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
`cluster_manager_timeout` | Time | The amount of time to wait for a connection to the cluster manager node. Default is `30s`.
`timeout` | Time | The amount of time to wait for a response. Default is `30s`.

## Request body fields

The following table lists the available request body fields.

Field | Data type | Description
:--- | :--- | :---
`processors` | Array of objects | The processors that transform documents, in the order in which they run. For a list of processors, see [Ingest processors]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/index-processors/). Required.
`description` | String | A description of the pipeline. Optional.
`on_failure` | Array of objects | Processors to run if a processor in the pipeline fails. For more information, see [Handling failures at the pipeline level]({{site.url}}{{site.baseurl}}/ingest-pipelines/pipeline-failures/#handling-failures-at-the-pipeline-level). Optional.
`version` | Integer | A version number for the pipeline. OpenSearch doesn't use the version. External systems can use it to manage pipelines. For more information, see [Pipeline versioning](#pipeline-versioning). Optional.

## Example request

The following request creates a pipeline with two `set` processors and an `uppercase` processor. The first `set` processor sets `grad_year` to `2023`, the second `set` processor sets `graduated` to `true`, and the `uppercase` processor converts the `name` field to uppercase:

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

## Example response

```json
{
  "acknowledged": true
}
```

## Using the pipeline

To index a document through the pipeline, specify the pipeline name in the `pipeline` query parameter:

```json
POST students/_doc/1?pipeline=my-pipeline
{
  "name": "john doe"
}
```
{% include copy-curl.html %}

To verify the pipeline processed the document, retrieve it:

```json
GET students/_doc/1
```
{% include copy-curl.html %}

The response shows that the pipeline set `grad_year` and `graduated` and converted `name` to uppercase:

```json
{
  "_index": "students",
  "_id": "1",
  "_version": 1,
  "_seq_no": 0,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "graduated": true,
    "name": "JOHN DOE",
    "grad_year": 2023
  }
}
```

For more information about handling processor errors, see [Handling pipeline failures]({{site.url}}{{site.baseurl}}/ingest-pipelines/pipeline-failures/).

## Pipeline versioning

If you manage pipelines using deployment scripts or configuration management tools, you can record which revision of a pipeline is installed on a cluster. For example, a deployment tool can compare the installed version with the version in source control and update the pipeline only if they differ. To record the revision, specify an integer in the `version` field when you create or update the pipeline:

```json
PUT _ingest/pipeline/students-pipeline
{
  "description": "Processes student data",
  "version": 2,
  "processors": [
    {
      "uppercase": {
        "field": "name"
      }
    }
  ]
}
```
{% include copy-curl.html %}

To check the current version of the pipeline, filter the [Get Pipeline API]({{site.url}}{{site.baseurl}}/ingest-pipelines/get-ingest/) response by the `version` field:

```json
GET _ingest/pipeline/students-pipeline?filter_path=*.version
```
{% include copy-curl.html %}

The response contains the pipeline version:

```json
{
  "students-pipeline": {
    "version": 2
  }
}
```

Updating a pipeline replaces its entire definition. To remove the version number, update the pipeline without specifying the `version` field.

## Template snippets

Some processor parameters support [Mustache](https://mustache.github.io/) template snippets. To get the value of a field, surround the field name in three curly braces, for example, `{% raw %}{{{field-name}}}{% endraw %}`.

#### Example: `set` ingest processor using Mustache template snippet

Building on the student data pipeline shown in the [example request](#example-request), the following example uses Mustache template snippets to dynamically set field names and values. Instead of hardcoding the field name and value, the processor reads them from the document itself. In this example, the field name is taken from the document's `{% raw %}{{{department}}}{% endraw %}` field and the value is taken from the `{% raw %}{{{advisor}}}{% endraw %}` field:

```json
PUT _ingest/pipeline/my-pipeline
{
  "processors": [
    {
      "set": {
        "field": "{% raw %}{{{department}}}{% endraw %}",
        "value": "{% raw %}{{{advisor}}}{% endraw %}"
      }
    }
  ]
}
```
{% include copy-curl.html %}

To test this pipeline, index a document that contains the `department` and `advisor` fields:

```json
POST students/_doc/2?pipeline=my-pipeline
{
  "name": "Jane Smith",
  "department": "computer_science",
  "advisor": "Dr. Smith"
}
```
{% include copy-curl.html %}

Retrieve the document to verify the result:

```json
GET students/_doc/2
```
{% include copy-curl.html %}

The response shows that the pipeline dynamically created a `computer_science` field with the value `Dr. Smith`:

```json
{
  "_index": "students",
  "_id": "2",
  "_version": 1,
  "_seq_no": 1,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "advisor": "Dr. Smith",
    "computer_science": "Dr. Smith",
    "name": "Jane Smith",
    "department": "computer_science"
  }
}
```

## Using processor tags for monitoring and debugging

When monitoring ingest pipeline performance using the `GET /_nodes/stats/ingest` API, processors without tags appear with generic names in the statistics output. This makes it difficult to identify which specific processor stage might be causing performance bottlenecks in complex pipelines. All ingest processors support an optional `tag` parameter that assigns a meaningful identifier to each processor. This parameter is useful for monitoring pipeline performance and debugging issues in production environments.

The following examples demonstrate the difference between using processors with and without tags when monitoring pipeline performance.

Create a pipeline without processor tags:

```json
PUT _ingest/pipeline/log-processing-without-tags
{
  "description": "Process web server logs without processor tags",
  "processors": [
    {
      "grok": {
        "field": "message",
        "patterns": ["%{COMMONAPACHELOG}"]
      }
    },
    {
      "date": {
        "field": "timestamp",
        "formats": ["dd/MMM/yyyy:HH:mm:ss Z"]
      }
    },
    {
      "convert": {
        "field": "response",
        "type": "integer"
      }
    }
  ]
}
```
{% include copy-curl.html %}

Create a pipeline with processor tags:

```json
PUT _ingest/pipeline/log-processing-with-tags
{
  "description": "Process web server logs with processor tags for monitoring",
  "processors": [
    {
      "grok": {
        "field": "message",
        "patterns": ["%{COMMONAPACHELOG}"],
        "tag": "parse-apache-log"
      }
    },
    {
      "date": {
        "field": "timestamp",
        "formats": ["dd/MMM/yyyy:HH:mm:ss Z"],
        "tag": "parse-timestamp"
      }
    },
    {
      "convert": {
        "field": "response",
        "type": "integer",
        "tag": "convert-response-code"
      }
    }
  ]
}
```
{% include copy-curl.html %}

Test both pipelines with sample log data:

```json
POST logs-without-tags/_doc?pipeline=log-processing-without-tags
{
  "message": "192.168.1.100 - - [30/Oct/2023:14:23:45 +0000] \"POST /api/users HTTP/1.1\" 201 512"
}
```
{% include copy-curl.html %}

```json
POST logs-with-tags/_doc?pipeline=log-processing-with-tags
{
  "message": "192.168.1.100 - - [30/Oct/2023:14:23:45 +0000] \"POST /api/users HTTP/1.1\" 201 512"
}
```
{% include copy-curl.html %}

Check the ingest statistics to see the difference in processor identification:

```json
GET _nodes/stats/ingest
```
{% include copy-curl.html %}

The pipeline without tags contains generic processor names:

```json
"log-processing-without-tags": {
  "count": 1,
  "time_in_millis": 1,
  "current": 0,
  "failed": 0,
  "processors": [
    {
      "grok": {
        "type": "grok",
        "stats": {
          "count": 1,
          "time_in_millis": 0,
          "current": 0,
          "failed": 0
        }
      }
    },
    {
      "date": {
        "type": "date",
        "stats": {
          "count": 1,
          "time_in_millis": 1,
          "current": 0,
          "failed": 0
        }
      }
    },
    {
      "convert": {
        "type": "convert",
        "stats": {
          "count": 1,
          "time_in_millis": 0,
          "current": 0,
          "failed": 0
        }
      }
    }
  ]
}
```

The pipeline with tags contains descriptive processor names:

```json
"log-processing-with-tags": {
  "count": 1,
  "time_in_millis": 0,
  "current": 0,
  "failed": 0,
  "processors": [
    {
      "grok:parse-apache-log": {
        "type": "grok",
        "stats": {
          "count": 1,
          "time_in_millis": 0,
          "current": 0,
          "failed": 0
        }
      }
    },
    {
      "date:parse-timestamp": {
        "type": "date",
        "stats": {
          "count": 1,
          "time_in_millis": 0,
          "current": 0,
          "failed": 0
        }
      }
    },
    {
      "convert:convert-response-code": {
        "type": "convert",
        "stats": {
          "count": 1,
          "time_in_millis": 0,
          "current": 0,
          "failed": 0
        }
      }
    }
  ]
}
```

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:admin/ingest/pipeline/put`.
