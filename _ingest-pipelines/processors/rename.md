---
layout: default
title: Rename
parent: Ingest processors
nav_order: 200
---

# Rename processor

The `rename` processor renames a field in the input document. This can be useful when you need to standardize field names or align them with your application's data model.

The following is the syntax for the `rename` processor:

```json
{
  "rename": {
    "field": "source_field_name",
    "target_field": "target_field_name"
  }
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `rename` processor.

Parameter | Required/Optional | Description |
|-----------|-----------|-----------|
`field` | Required | The name of the field to be renamed.
`target_field` | Required | The new name for the field.
`description` | Optional | Description of the processor's purpose or configuration.
`if` | Optional | Conditionally execute the processor.
`ignore_failure` | Optional | Ignore failures for the processor. See Handling pipeline failures.
`on_failure` | Optional | Handle failures for the processor. See Handling pipeline failures.
`tag` | Optional | Identifier for the processor. Useful for debugging and metrics.

## Using the processor

Follow these steps to use the processor in a pipeline.

### Step 1: Create a pipeline

The following query creates a pipeline, named <name>, that uses the `rename` processor to <do what?>: 

```json
<insert pipeline code example>
```
{% include copy-curl.html %}

### Step 2 (Optional): Test the pipeline

It is recommended that you test your pipeline before you ingest documents.
{: .tip}

To test the pipeline, run the following query:

```json
<insert code example>
```
{% include copy-curl.html %}

#### Response

The following example response confirms that the pipeline is working as expected:

```json
<insert response example>
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