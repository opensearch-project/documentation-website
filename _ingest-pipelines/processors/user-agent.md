---
layout: default
title: User agent
parent: Ingest processors
nav_order: 330
---

# User agent processor

The `user_agent` processor is used to extract information from the user agent string, such as the browser, device, and operating system used by the client.

The following is the syntax for the `user_agent` processor:

```json
{
  "processor": {
    "user_agent": {
      "field": "user_agent",
      "target_field": "user_agent_info"
    }
  }
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `user_agent` processor.

Parameter | Required/Optional | Description |
|-----------|-----------|-----------|
`field` | Required | The field containing the user agent string.
`target_field` | Optional | The field to store the extracted user agent information. If not specified, the information is stored in the `user_agent` field.


## Using the processor

Follow these steps to use the processor in a pipeline.

### Step 1: Create a pipeline

The following query creates a pipeline, named <name>, that uses the `user_agent` processor to <do what?>: 

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