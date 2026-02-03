---
layout: default
title: Create or update pipeline
nav_order: 10
redirect_from:
  - /opensearch/rest-api/ingest-apis/create-update-ingest/
  - /api-reference/ingest-apis/create-ingest/
  - /api-reference/ingest-apis/create-update-ingest/
---

# Create or update pipeline
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

## Processor tags for monitoring and debugging

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
