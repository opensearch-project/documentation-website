---
layout: default
title: write_json
parent: Processors
grand_parent: Pipelines
nav_order: 56
---

# write_json


You can use the `write_json` processor to write an object in the event as JSON string. You can customize the `write_json` processor to pick the source and target field names

| Option | Description | Example |
| :--- | :--- | :--- |
| source | The message field to be parsed. Mandatory field name to identify the source object in the event. | If `source` is `"message"`, `{"message": {"key1":"value1", "key2":{"key3":"value3"}}`, write_json processor, generates `{"message": "{\"key1\":\"value`\", \"key2\":"{\"key3\":\"value3\"}"}"`
| target | target field name under which the JSON string is stored. This is Optional field. If not specified, `source` is used as the target.

