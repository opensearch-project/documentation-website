---
layout: default
title: translate
parent: Processors
grand_parent: Pipelines
nav_order: 117
---

# translate

The `translate` processor transforms values in events into preconfigured values.

## Basic usage

To use the `translate` processor, create the following `pipeline.yaml` file:

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

Then create the following file named `logs_json.log` and replace the `path` in the file source of your `pipeline.yaml` file with the path of a file containing the following JSON data:

```json
{ "status": "404" }
```

The `translate` processor configuration in `pipeline.yaml` retrieves the `source` value from the event data and compares it against the keys specified under the `targets`. 
When a match is found, the processor places the corresponding mapped value into the `target` key provided in the configuration.

When you run Data Prepper with the previous `pipeline.yaml` file, you should receive the following output:

```json
{
  "status": "404",
  "translated_result": "Not Found"
}
```

## Advanced options

The following example shows a more involved mapping with additional configurations for the `translate` processor:

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
                  "5[0-9]{2}": "Error"    # Matches ranges form 500-599
      file: 
        name: "path/to/file.yaml"
        aws:
          bucket: my_bucket
          region: us-east-1
          sts_role_arn: arn:aws:iam::123456789012:role/MyS3Role
```

On the top level, specify `mappings` for inline mapping configurations, or `file` pull mapping configurations from a file. Both `mappings` and `file` options can be specified together, and the processor considers the mappings from both sources for translations. In instances where the pipeline configuration and file mappings share duplicate `source` and `target` pairs, the mappings specified within the pipeline configuration take precedence.


## Configuration

You can use the following options to configure the `translate` processor.

| Parameter | Required | Type | Description |
| :--- | :---  | :--- | :--- |
| mappings | No | List | Defines inline mappings. For more information, see [mappings](#mappings). |
| file | No | Map | Points to the file that contains mapping configurations. For more information, see [file](#file). |

### mappings

Each item in the `mappings` configuration contains the following options.

| Parameter | Required | Type | Description |
| :--- | :--- | :--- | :--- |
| source | Yes | String or list | The source field to translate. Can be a string or a list of strings. |
| targets | Yes | List |  A list of target field configurations, such as the target field key or translation maps. |

Each item in the `targets` configuration contains the following options.

| Parameter | Required | Type | Description |
| :--- | :---  | :--- | :--- |
| target | Yes | String | The key that specifies the field in the output in which the translated value will be placed. |
| map | No | Map | A list of key-value pairs that define the translations. Each key represents a possible value in the source field, and the corresponding value represents what it should be translated to. For examples, see [map option](#map-option). At least one of `map` and `regex` should be configured. |
| regex | No | Map | A map of keys that defines the translation map. For more options, see [regex option](#regex-option). At least one of `map` and `regex` should be configured. |
| default | No | String | The default value to use when no match is found during translation. |
| type | No | String | Specifies the data type for the target value. |
| translate_when | No | String | Uses a [Data Prepper expression]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/expression-syntax/) to specify a condition for performing the translation. When specified, the expression will only translate when the condition is met. |

#### map option

You can use the following key types when using the map option:

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

When configuring the keys inside the `map` option, do not use any overlapping number ranges or duplicate keys.

#### regex option

You can use the following options with the `regex` option. 

| Parameter | Required | Type | Description |
| :--- | :---  | :--- | :--- |
| patterns | Yes | Map | A map of key-value pairs defining the regex patterns of keys and the value to translate to for each pattern. |
| exact | No | Boolean | Whether to use full string match or partial string match on the regex pattern. If `true`, the pattern is considered a match only when the entire key matches the pattern. Otherwise, the pattern is considered a match when a sub-string of the key matches the pattern. |

### file

The `file` option in the `translate` processor takes a local YAML file or an Amazon Simple Storage Service (Amazon S3) object containing translation mappings. The file's contents should be in the following format:
```yaml
mappings:
  - source: "status"
    targets:
      - target: "result"
        map:
          "foo": "bar"
        # Other configurations
```

You can use the following options in the `file` configuration.

| Parameter | Required | Type | Description |
| :--- | :---  | :--- | :--- |
| name | Yes | String | The full path to a local file or key name for an S3 object. |
| aws | No | Map | The AWS configuration when the file is an S3 object. See the following table for more information. |

You can use the following options with the `aws` configuration.

| Parameter | Required | Type | Description |
| :--- | :---  | :--- | :--- |
| `bucket` | Yes | String | The Amazon S3 bucket name. |
| `region` | Yes | String | The AWS Region to use for credentials. |
| `sts_role_arn` | Yes | String | The AWS Security Token Service (AWS STS) role to assume for requests to Amazon S3. |
