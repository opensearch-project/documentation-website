---
layout: default
title: Trim string
parent: Processors
grand_parent: Pipelines
nav_order: 400
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/trim-string/
---

# Trim string processor

The `trim_string` processor removes white space from the beginning and end of a key.

### Configuration

You can configure the `trim_string` processor with the following options.

Option | Required | Description
:--- | :--- | :---
 `with_keys` | Yes | A list of keys from which to trim the white space. |

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
    - trim_string:
        with_keys:
          - "trimField"
  sink:
    - stdout:
```
{% include copy.html %}

Next, create a log file named `logs_json.log`. After that, replace the `path` in the file source of your `pipeline.yaml` file with the correct file path. For more detailed information, see [Configuring OpenSearch Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/#2-configuring-data-prepper). 

Before you run Data Prepper, the source appears in the following format:

```json
{"trimField": " Space Ship "}
```

After you run Data Prepper, the source is converted to the following format:

```json
{"trimField": "Space Ship"}
```
