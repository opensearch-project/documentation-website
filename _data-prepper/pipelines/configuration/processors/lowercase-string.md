---
layout: default
title: Lowercase string
parent: Processors
grand_parent: Pipelines
nav_order: 190
---

# Lowercase string processor

The `lowercase string` processor converts a string to lowercase.

### Configuration

You can configure the `lowercase string` processor with the following options.

Option | Required | Description
:--- | :--- | :---
 `with_keys` | Yes | A list of keys to convert to lowercase. |

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
    - lowercase_string:
        with_keys:
          - "lowercaseField"
  sink:
    - stdout:
```
{% include copy.html %}

Next, create a log file named `logs_json.log`. After that, replace the `path` in the file source of your `pipeline.yaml` file with the correct file path. For more detailed information, see [Configuring OpenSearch Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/#2-configuring-data-prepper). 

Before you run Data Prepper, the source appears in the following format:

```json
{"lowercaseField": "TESTmeSSage"}
```

After you run Data Prepper, the source is converted to the following format:

```json
{"lowercaseField": "testmessage"}
```
