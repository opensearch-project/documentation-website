---
layout: default
title: obfuscate
parent: Processors
grand_parent: Pipelines
nav_order: 71
---

# obfuscate

The `obfuscate` process enables obfuscation of fields inside your documents in order to protect sensitive data. 

## Usage

In this example, a document contains a `log` field and a `phone` field, as shown in the following object:

```json
{
  "id": 1,
  "phone": "(555) 555 5555",
  "log": "My name is Bob and my email address is abc@example.com"
}
```


To obfuscate the `log` and `phone` fields, add the `obfuscate` processor and call each field in the `source` option. To account for both the `log` and `phone` fields, the following example uses multiple `obfuscate` processors because each processor can only obfuscate one source.

In the first `obfuscate` processor in the pipeline, the source `log` uses several configuration options to mask the data in the log field, as shown in the following example. For more details on these options, see [configuration](#configuration).

```yaml
pipeline:
  source:
    http:
  processor:
    - obfuscate:
        source: "log"
        target: "new_log"
        patterns:
          - "[A-Za-z0-9+_.-]+@([\\w-]+\\.)+[\\w-]{2,4}"
        action:
          mask:
            mask_character: "#"
            mask_character_length: 6
    - obfuscate:
        source: "phone"
  sink:
    - stdout:
```

When run, the `obfuscate` processor parses the fields into the following output:

```json
{
  "id": 1,
  "phone": "***",
  "log": "My name is Bob and my email address is abc@example.com",
  "newLog": "My name is Bob and my email address is ######"
}
```

## Configuration

Use the following configuration options with the `obfuscate` processor.

| Parameter | Required | Description |
| :--- | :---  | :---  |
| `source` | Yes | The source field to obfuscate. |
| `target` | No | The new field in which to store the obfuscated value. This leaves the original source field unchanged. When no `target` is provided, the source field updates with the obfuscated value. |
| `patterns` | No | A list of regex patterns that allow you to obfuscate specific parts of a field. Only parts that match the regex pattern will obfuscate. When not provided, the processor obfuscates the whole field. |
| `action` | No | The obfuscation action. As of Data Prepper 2.3, only the `mask` action is supported. |

You can customize the `mask` action with the following optional configuration options.

| Parameter | Default | Description |
| :--- | :---  | :---  |
`mask_character` | `*` | The character to use when masking. Valid characters are !, #, $, %, &, *, and @. |
`mask_character_length` | `3` | The number of characters to mask in the field. The value must be between 1 and 10. |


## Predefined patterns

When using the `patterns` configuration option, you can use a set of predefined obfuscation patterns for common fields. The `obfuscate` processor supports the following predefined patterns.

You cannot use multiple patterns for one obfuscate processor. Use one pattern for each obfuscate processor.
{: .note}


| Pattern name          | Examples                                                                                                                                                                      |
|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| %{EMAIL_ADDRESS}      | abc@test.com<br/> 123@test.com<br/>abc123@test.com<br/>abc_123@test.com<br/>a-b@test.com<br/>a.b@test.com<br/>abc@test-test.com<br/>abc@test.com.cn<br/>abc@test.mail.com.org |
| %{IP_ADDRESS_V4}      | 1.1.1.1<br/>192.168.1.1<br/>255.255.255.0                                                                                                                                     |
| %{BASE_NUMBER}        | 1.1<br/>.1<br/>2000                                                                                                                                                           |
| %{CREDIT_CARD_NUMBER} | 5555555555554444<br/>4111111111111111<br/>1234567890123456<br/>1234 5678 9012 3456<br/> 1234-5678-9012-3456                                                                   |
| %{US_PHONE_NUMBER}    | 1555 555 5555<br/>5555555555<br/>1-555-555-5555<br/>1-(555)-555-5555<br/>1(555) 555 5555<br/>(555) 555 5555<br/>+1-555-555-5555<br/>                                          |
| %{US_SSN_NUMBER}      | 123-11-1234     
