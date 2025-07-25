---
layout: default
title: write_json
parent: Processors
grand_parent: Pipelines
nav_order: 56
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/write_json/
redirect_to: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/write_json/
---

# write_json


The `write_json` processor converts an object in an event into a JSON string. You can customize the processor to choose the source and target field names.

| Option | Description | Example |
| :--- | :--- | :--- |
| source | Mandatory field that specifies the name of the field in the event containing the message or object to be parsed. | If `source` is set to `"message"` and the input is `{"message": {"key1":"value1", "key2":{"key3":"value3"}}`, then the `write_json` processor generates `{"message": "{\"key1\":\"value`\", \"key2\":"{\"key3\":\"value3\"}"}"`.
| target | An optional field that specifies the name of the field in which the resulting JSON string should be stored. If `target` is not specified, then the `source` field is used.

