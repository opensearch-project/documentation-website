---
layout: default
title: Okta
parent: Supported log types
nav_order: 80
---

# Okta

The `okta` log types records Okta events from a range of actions, such as downloading an export file, requesting application access, or revoking privileges.

The following code snippet contains all the `raw_field`
and `ecs` mappings for this log type:

```json
  "mappings": [
    {
      "raw_field":"eventtype",
      "ecs":"okta.event_type"
    },
    {
      "raw_field":"displaymessage",
      "ecs":"okta.display_message"
    }
  ]
```