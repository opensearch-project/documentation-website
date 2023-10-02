---
layout: default
title: translate
parent: Processors
grand_parent: Pipelines
nav_order: 117
---

# translate

The `translate` processor translates fields in the events with the configured mappings.

## Basic Usage

To get started with the translate processor, create the following `pipeline.yaml`.

```yaml
translate-pipeline:
  source:
    file:
      path: "/full/path/to/logs_json.log"
      record_type: "event"
      format: "json"
  processor:
    - translate:
        mappings:
          - source: "status"
            targets:
              - target: "translated_result"
                map:
                  404: "Not Found"
  sink:
    - stdout:
```

Then create the following file named `logs_json.log` and replace the `path` in the file source of your `pipeline.yaml` with the path of a file containing this json data:
```json
{ "status": "404" }
```

The `translate` processor configuration in `pipeline.yaml` retrieves the `source` value from the event data and compares it against the keys specified under the `targets`. 
When a match is found, the processor places the corresponding mapped value into the `target` key provided in the configuration.

When you run Data Prepper with the above `pipeline.yaml`, you should see the following output:
```json
{
  "status": "404",
  "translated_result": "Not Found"
}
```

## More Options

The following examples show all options available for `translate` processor.

```yaml
processor:
  - translate:
      mappings:
        - source: "status"
          targets:
            - target: "translated_result"
              map:
                404: "Not Found"
              default: "default"
              type: "string"
              translate_when: "/response != null"
            - target: "another_translated_result"
              regex:
                exact: false
                patterns:
                  "2[0-9]{2}" : "Success" # Matches ranges from 200-299
                  "4[0-9]{2}": "Error"    # Matches ranges form 400-499
      file: 
        name: "path/to/file.yaml"
        aws:
          bucket: my_bucket
          region: us-east-1
          sts_role_arn: arn:aws:iam::123456789012:role/MyS3Role
```

On the top level, specify `mappings` for inline mapping configuration or `file` for a file that contains mapping configuration. Both `mappings` and `file` options can be specified together, and the processor considers the mappings from both sources for translations. In instances where the pipeline configuration and file mappings share duplicate `source` and `target` pair, the mappings specified within the pipeline configuration take precedence.


## Configuration

### mappings

Each item in `mappings` has the following options:

| Parameter | Required | Description |
| :--- | :---  | :---  |
| source | Yes | The source field to translate. Can be a string or a list of strings. |
| targets | Yes | The target fields configurations, include target field key, translation maps, etc. |

Each item in `targets` list has the following options:

| Parameter | Required | Description |
| :--- | :---  | :---  |
| target | Yes | The key to specify the field in the output where the translated value should be placed |
| map | No | The map consists of key-value pairs that define the translations. Each key represents a possible value in the source field, and the corresponding value represents what it should be translated to. See [map option](#map-option) for examples. At least one of `map` and `regex` should be configured. |
| regex | No | Use regex patterns as keys to define the translation map. See [regex option](#regex-option) for more details. At least one of `map` and `regex` should be configured. |
| default | No | Use this default value when no match is found during translation |
| type | No | Specify the type of the data for the target value |
| translate_when | No | Use a [Data Prepper expression]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/expression-syntax/) to specify a condition for performing the translation. If specified, translate only when the expression evaluates to true. |

#### map option
The keys provided in the map option can be of the following types:
* Individual keys
  ```yaml
    map:
      ok : "Success"
      120: "Found"
  ```
* Number ranges
  ```yaml
    map:
      "100-200": "Success"
      "400-499": "Error"
  ```
* Comma-delimited keys
  ```yaml
    map:
      "key1,key2,key3": "value1"
      "100-200,key4": "value2"
  ```

  While configuring the keys in map, there cannot be any overlapping number ranges or duplicate keys.

#### regex option
`regex` can be specified with the following options.

| Parameter | Required | Description |
| :--- | :---  | :---  |
| patterns | Yes | Key-value pairs defining the regex patterns of keys and the value to translate to for each pattern |
| exact | No | Whether to use full string match or partial string match on the regex patterns. If true, it is considered a match only when the entire key matches the pattern. Otherwise, it is considered a match as long as a substring of the key matches the pattern. |

### file

The `file` option in the Translate processor takes a local YAML file path or an S3 object containing translation mappings. The file contents should be in the following format:
```yaml
mappings:
  - source: "status"
    targets:
      - target: "result"
        map:
          "foo": "bar"
        # Other configurations
```

`file` has the following options:

| Parameter | Required | Description |
| :--- | :---  | :---  |
| name | Yes | Full path to a local file or key name for an S3 object |
| aws | No | The AWS configuration if the file is an S3 object. See below for more information. |

`aws` configuration has these options:

| Parameter | Required | Description |
| :--- | :---  | :---  |
| `bucket` | Yes | S3 bucket name |
| `region` | Yes | The AWS Region to use for credentials. |
| `sts_role_arn` | Yes | The AWS Security Token Service (AWS STS) role to assume for requests to Amazon S3. |
