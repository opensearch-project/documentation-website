---
layout: default
title: write_json
parent: Processors
grand_parent: Pipelines
nav_order: 56
---

# write_json


The `write_json` processor converts an object in the event into a JSON string. You can customize the processor to choose the source and target field names.

| Option | Description | Example |
| :--- | :--- | :--- |
| source | Mandatory field that specifies the name of the field in the event containing the message or object to be parsed. | If `source` is `"message"`, `{"message": {"key1":"value1", "key2":{"key3":"value3"}}`, the `write_json` processor, generates `{"message": "{\"key1\":\"value`\", \"key2\":"{\"key3\":\"value3\"}"}"`
| target | target field name under which the JSON string is stored. This is Optional field. If not specified, `source` is used as the target.

