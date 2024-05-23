---
layout: default
title: Join
parent: Ingest processors
nav_order: 160
---

# Join processor

The `join` processor combines fields from different data sources into a single document before indexing. Raises an error if the field is not an array. For example, you could combine the log message, severity level, and timestamp into a single field for better readability and easier querying. Or, you could join data from different sources, such as application logs and system logs, based on a common field like a session ID or user ID to provide a more comprehensive view of related events and help in troubleshooting and root cause analysis. 

The following is the syntax for the `join` processor:

```json
{
  "join": {
    "field": "field_name",
    "separator": "separator_string"
  }
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `join` processor.

Parameter | Required/Optional | Description |
|-----------|-----------|-----------|
`field` | Required | The field name where the join operator is applied. 
`separator` | Optional | A string separator to use when joining field values. If not specified, the values are concatenated without a separator.
`target_field` | Optional | The field to assign the cleaned value to. If not specified, field is updated in-place.
`description` | Optional | Description of the processor's purpose or configuration.
`if` | Optional | Conditionally execute the processor.
`ignore_failure` | Optional | Ignore failures for the processor. See [Handling pipeline failures]({{site.url}}{{site.baseurl}}/ingest-pipelines/pipeline-failures/).
`on_failure` | Optional | Handle failures for the processor. See [Handling pipeline failures]({{site.url}}{{site.baseurl}}/ingest-pipelines/pipeline-failures/).
`tag` | Optional | Identifier for the processor. Useful for debugging and metrics.

## Using the processor

Follow these steps to use the processor in a pipeline.

### Step 1: Create a pipeline

The following query creates a pipeline, named <name>, that uses the `join` processor to <do what?>: 

```json
PUT _ingest/pipeline/example-join-pipeline
{
  "description": "Example pipeline using the join processor",
  "processors": [
    {
      "join": {
        "field": "message",
        "separator": " - ",
        "target_field": "combined_message"
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Step 2 (Optional): Test the pipeline

It is recommended that you test your pipeline before you ingest documents.
{: .tip}

To test the pipeline, run the following query:

```json
POST _ingest/pipeline/example-join-pipeline/_simulate
{
  "docs": [
    {
      "_source": {
        "message": "Server started",
        "severity": "INFO",
        "timestamp": "2023-04-20T12:00:00Z"
      }
    }
  ]
}
```
{% include copy-curl.html %}

#### Response

The following example response confirms that the pipeline is working as expected:

```json

```

### Step 3: Ingest a document 

The following query ingests a document into an index named `testindex1`:

```json
<insert code example>
```
{% include copy-curl.html %}

#### Response

The request indexes the document into the index <index name> and will index all documents with <what does this response tell the user?>.

```json
<insert code example>
```

### Step 4 (Optional): Retrieve the document

To retrieve the document, run the following query:

```json
<insert code example>
```
{% include copy-curl.html %}

<Provide any other information and code examples relevant to the user or use cases.>