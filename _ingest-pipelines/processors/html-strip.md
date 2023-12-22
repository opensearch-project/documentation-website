---
layout: default
title: HTML strip
parent: Ingest processors
nav_order: 140
---

# JSON processor

The `html_strip` processor is used to <explain what is used to do>.

The following is the syntax for the `html_strip` processor:

```json
<insert syntax example>
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `html_strip` processor.

Parameter | Required/Optional | Description |
|-----------|-----------|-----------|
<insert the parameters>

## Using the processor

Follow these steps to use the processor in a pipeline.

### Step 1: Create a pipeline

The following query creates a pipeline, named <name>, that uses the `html_strip` processor to <do what?>: 

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