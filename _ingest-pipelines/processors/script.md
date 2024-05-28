---
layout: default
title: script
parent: Ingest processors
nav_order: 230
---

# `script` processor

The `script` processor executes inline and stored scripts that can modify or transform data in an OpenSearch document during the ingestion process. The processor uses script caching for improved performance, as scripts may be recompiled per document. Refer to [Script APIs](https://opensearch.org/docs/latest/api-reference/script-apis/index/) for information about working with scripts in OpenSearch. 

The following is the syntax for the `script` processor:

```json
{
  "description": "...",
  "processors": [
    {
      "script": {
        "source": "ctx._source.new_field = ctx._source.old_field * 2;"
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `script` processor.

| Parameter  | Required/Optional  | Description  |
|---|---|---|
`source`  | Required  | The Painless script that is executed.
`lang`  | Optional  | The script's programming language. Default is `painless`.
`id`  | Optional  | The stored script ID to refer to.
`params` | Optional | A map of parameters that can be accessed within the script.
`description`  | Optional  | A brief description of the processor.
`if` | Optional | A condition for running the processor.
`ignore_failure` | Optional | Specifies whether the processor continues execution even if it encounters an error. If set to `true`, failures are ignored. Default is `false`.
`on_failure` | Optional | A list of processors to run if the processor fails.
`tag` | Optional | An identifier tag for the processor. Useful for debugging in order to distinguish between processors of the same type.

## Using the processor

Follow these steps to use the processor in a pipeline.

### Step 1: Create a pipeline

The following query creates a pipeline named <pipeline name> that uses the script processor to <do what?>: 

```json

```
{% include copy-curl.html %}

### Step 2 (Optional): Test the pipeline

It is recommended that you test your pipeline before you ingest documents.
{: .tip}

To test the pipeline, run the following query:

```json

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
