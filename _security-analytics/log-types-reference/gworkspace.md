---
layout: default
title: Google Workspace
parent: Supported log types
nav_order: 45
---

# Google Workspace

The `gworkspace` log types monitors Google Workspace log entries such as:

- Admin actions
- Group and group membership actions
- Any event related to log ins.

The following code snippet contains all the `raw_field`
and `ecs` mappings for this log type:

```json
  "mappings": [
    {
      "raw_field":"eventSource",
      "ecs":"google_workspace.admin.service.name"
    },
    {
      "raw_field":"eventName",
      "ecs":"google_workspace.event.name"
    },
    {
      "raw_field":"new_value",
      "ecs":"google_workspace.admin.new_value"
    }
  ]
```