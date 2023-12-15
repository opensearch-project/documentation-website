---
layout: default
title: user_agent
parent: Processors
grand_parent: Pipelines
nav_order: 130
---

# user_agent

The `user_agent` processor parses any user agent (UA) string in an event and then adds the parsing results to the event's write data.

## Usage

In this example, the `user_agent` processor calls the source that contains the UA string, the `ua` field, and indicates the key to which the parsed string will write, `user_agent`, as shown in the following example:

```yaml
  processor:
    - user_agent:
        source: "ua"
        target: "user_agent"
```

The following example event contains the `ua` field with a string that provides information about a user: 

```json
{
  "ua":  "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1"
}
```

The `user_agent` processor parses the string into a format compatible with Elastic Common Schema (ECS) and then adds the result to the specified target, as shown in the following example:

```json
{
  "user_agent": {
    "original": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1",
    "os": {
        "version": "13.5.1",
        "full": "iOS 13.5.1",
        "name": "iOS"
    },
    "name": "Mobile Safari",
    "version": "13.1.1",
    "device": {
        "name": "iPhone"
    }
  },
  "ua":  "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1"
}
```

## Configuration options

You can use the following configuration options with the `user_agent` processor.

| Option | Required | Description |
| :--- | :--- | :--- |
| `source` | Yes | The field in the event that will be parsed. 
| `target` | No | The field to which the parsed event will write. Default is `user_agent`. 
| `exclude_original` | No | Determines whether to exclude the original UA string from the parsing result. Defaults to `false`. 
| `cache_size` | No | The cache size of the parser in megabytes. Defaults to `1000`. |
| `tags_on_parse_failure` | No | The tag to add to an event if the `user_agent` processor fails to parse the UA string. |
