---
layout: default
title: User agent
parent: Ingest processors
nav_order: 330
canonical_url: https://docs.opensearch.org/docs/latest/ingest-pipelines/processors/user-agent/
---

# User agent processor

The `user_agent` processor is used to extract information from the user agent string, such as the browser, device, and operating system used by the client. The `user_agent` processor is particularly useful for analyzing user behavior and identifying trends based on user devices, operating systems, and browsers. It can also be helpful for troubleshooting issues specific to certain user agent configurations.

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
{% include copy.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `user_agent` processor.

Parameter | Required/Optional | Description |
|-----------|-----------|-----------|
`field` | Required | The field containing the user agent string.
`target_field` | Optional | The field in which to store the extracted user agent information. If not specified, then the information is stored in the `user_agent` field.
`ignore_missing`  | Optional  | Specifies whether the processor should ignore documents that do not contain the specified `field`. If set to `true`, the processor does not modify the document if the `field` does not exist. Default is `false`. |
`regex_file` | Optional | A file containing regular expression patterns used to parse the user agent string. This file should be located in the `config/ingest-user-agent` directory within the OpenSearch package. If not specified, then the default file `regexes.yaml` is used.
`properties` | Optional | A list of properties to be extracted from the user agent string and added to the `target_field`. If not specified, then the default properties are `name`, `major`, `minor`, `patch`, `build`, `os`, `os_name`, `os_major`, `os_minor`, and `device`.
`description`  | Optional  | A brief description of the processor.  |
`if` | Optional | A condition for running the processor. |
`ignore_failure` | Optional | Specifies whether the processor continues to run even if it encounters an error. If set to `true`, then failures are ignored. Default is `false`. |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`tag` | Optional | An identifier tag for the processor. Useful for debugging in order to distinguish between processors of the same type. |

## Using the processor

Follow these steps to use the processor in a pipeline.

### Step 1: Create a pipeline

The following query creates a pipeline named `user_agent_pipeline` that uses the `user_agent` processor to extract user agent information: 

```json
PUT _ingest/pipeline/user_agent_pipeline
{
  "description": "User agent pipeline",
  "processors": [
    {
      "user_agent": {
        "field": "user_agent",
        "target_field": "user_agent_info"
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
POST _ingest/pipeline/user_agent_pipeline/_simulate
{
  "pipeline": "user_agent_pipeline",
  "docs": [
    {
      "_source": {
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
      }
    }
  ]
}
```
{% include copy-curl.html %}

#### Response

The following example response confirms that the pipeline is working as expected:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
          "user_agent_info": {
            "name": "Chrome",
            "original": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
            "os": {
              "name": "Windows",
              "version": "10",
              "full": "Windows 10"
            },
            "device": {
              "name": "Other"
            },
            "version": "58.0.3029.110"
          }
        },
        "_ingest": {
          "timestamp": "2024-04-25T21:41:28.744407425Z"
        }
      }
    }
  ]
}
```

### Step 3: Ingest a document 

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=user_agent_pipeline
{
  "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36"
}
```
{% include copy-curl.html %}

#### Response

The preceding request parses the `user_agent` string into its components and indexes the document, along with all documents containing those components, into the `testindex1` index, as shown in the following response:

```json
{
  "_index": "testindex1",
  "_id": "1",
  "_version": 66,
  "result": "updated",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 65,
  "_primary_term": 47
}
```

### Step 4 (Optional): Retrieve the document

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}

#### Response

The response includes the original `user_agent` field and the parsed `user_agent_info` field containing the device, operating system, and browser information: 

```json
{
  "_index": "testindex1",
  "_id": "1",
  "_version": 66,
  "_seq_no": 65,
  "_primary_term": 47,
  "found": true,
  "_source": {
    "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
    "user_agent_info": {
      "original": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
      "os": {
        "name": "Mac OS X",
        "version": "10.15.7",
        "full": "Mac OS X 10.15.7"
      },
      "name": "Chrome",
      "device": {
        "name": "Mac"
      },
      "version": "90.0.4430.212"
    }
  }
}
```
