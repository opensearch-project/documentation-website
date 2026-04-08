---
layout: default
title: Uppercase string
parent: Processors
grand_parent: Pipelines
nav_order: 420
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/uppercase-string/
---

# Uppercase string processor

The `uppercase_string` processor converts the value (a string) of a key from its current case to uppercase. 

### Configuration

You can configure the `uppercase_string` processor with the following options.

Option | Required | Description
:--- | :--- | :---
 `with_keys` | Yes | A list of keys to convert to uppercase. |

### Usage

To get started, create the following `pipeline.yaml` file:

```yaml
pipeline:
  source:
    file:
      path: "/full/path/to/logs_json.log"
      record_type: "event"
      format: "json"
  processor:
    - uppercase_string:
        with_keys:
          - "uppercaseField"
  sink:
    - stdout:
```
{% include copy.html %}

Next, create a log file named `logs_json.log`. After that, replace the `path` in the file source of your `pipeline.yaml` file with the correct file path. For more detailed information, see [Configuring OpenSearch Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/#2-configuring-data-prepper). 

Before you run Data Prepper, the source appears in the following format:

```json
{"uppercaseField": "hello"}
```
After you run Data Prepper, the source is converted to the following format:

```json
{"uppercaseField": "HELLO"}
```