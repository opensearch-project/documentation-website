---
layout: default
title: translate
parent: Processors
grand_parent: Pipelines
nav_order: 117
---

# translate

The `translate` processor modifies values in events to pre-configured values.

## Basic usage

For an example using the translate processor, create the following `pipeline.yaml`.

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

When you run Data Prepper with the previous `pipeline.yaml`, you should see the following output:
```json
{
  "status": "404",
  "translated_result": "Not Found"
}
```

## More options

The following example shows a more involved mapping with additional configurations for `translate` processor.

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

On the top level, specify `mappings` for inline mapping configuration or `file` for a file that contains mapping configuration. Both `mappings` and `file` options can be specified together, and the processor considers the mappings from both sources for translations. In instances where the pipeline configuration and file mappings share duplicate `source` and `target` pair, the mappings specified within the pipeline configuration take precedence.


## Configuration

You can use the following options to configure the `translate` processor.

| Parameter | Required | Type | Description |
| :--- | :---  | :--- | :--- |
| mappings | No | List | Define inline mappings. See [mappings](#mappings) for details |
| file | No | Map | Define the file that contains mapping configurations. See [file](#file) for details |

### mappings

Each item in `mappings` has the following options:

| Parameter | Required | Type | Description |
| :--- | :--- | :--- | :--- |
| source | Yes | String or List | The source field to translate. Can be a string or a list of strings. |
| targets | Yes | List | The target fields configurations, include target field key, translation maps, etc. |

Each item in `targets` list has the following options:

| Parameter | Required | Type | Description |
| :--- | :---  | :--- | :--- |
| target | Yes | String | The key to specify the field in the output where the translated value should be placed |
| map | No | Map | The map consists of key-value pairs that define the translations. Each key represents a possible value in the source field, and the corresponding value represents what it should be translated to. See [map option](#map-option) for examples. At least one of `map` and `regex` should be configured. |
| regex | No | Map | Use regex patterns as keys to define the translation map. See [regex option](#regex-option) for more details. At least one of `map` and `regex` should be configured. |
| default | No | String | Use this default value when no match is found during translation |
| type | No | String | Specify the type of the data for the target value |
| translate_when | No | String | Use a [Data Prepper expression]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/expression-syntax/) to specify a condition for performing the translation. If specified, translate only when the expression evaluates to true. |

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

| Parameter | Required | Type | Description |
| :--- | :---  | :--- | :--- |
| patterns | Yes | Map | Key-value pairs defining the regex patterns of keys and the value to translate to for each pattern |
| exact | No | Boolean | Whether to use full string match or partial string match on the regex patterns. If true, it is considered a match only when the entire key matches the pattern. Otherwise, it is considered a match as long as a substring of the key matches the pattern. |

### file

The `file` option in the Translate processor takes a local YAML file or an S3 object containing translation mappings. The file contents should be in the following format:
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

| Parameter | Required | Type | Description |
| :--- | :---  | :--- | :--- |
| name | Yes | String | Full path to a local file or key name for an S3 object |
| aws | No | Map | The AWS configuration if the file is an S3 object. See the following table for more information. |

`aws` configuration has these options:

| Parameter | Required | Type | Description |
| :--- | :---  | :--- | :--- |
| `bucket` | Yes | String | S3 bucket name |
| `region` | Yes | String | The AWS Region to use for credentials. |
| `sts_role_arn` | Yes | String | The AWS Security Token Service (AWS STS) role to assume for requests to Amazon S3. |
