---
layout: default
title: Linux
parent: Supported log types
nav_order: 50 
canonical_url: https://docs.opensearch.org/latest/security-analytics/log-types-reference/linux/
---

# Linux

The `linux` log type records Linux syslog events.

The following code snippet contains all the `raw_field` and `ecs` mappings for this log type:

```json
  "mappings": [
    {
      "raw_field":"name",
      "ecs":"user.filesystem.name"
    },
    {
      "raw_field":"a0",
      "ecs":"auditd.log.a0"
    },
    {
      "raw_field":"comm",
      "ecs":"auditd.log.comm"
    },
    {
      "raw_field":"exe",
      "ecs":"auditd.log.exe"
    },
    {
      "raw_field":"uid",
      "ecs":"auditd.log.uid"
    },
    {
      "raw_field":"USER",
      "ecs":"system.auth.user"
    },
    {
      "raw_field":"User",
      "ecs":"system.auth.user"
    },
    {
      "raw_field":"Image",
      "ecs":"process.exe"
    },
    {
      "raw_field":"DestinationHostname",
      "ecs":"rsa.web.remote_domain"
    },
    {
      "raw_field":"CommandLine",
      "ecs":"process.command_line"
    },
    {
      "raw_field":"ParentImage",
      "ecs":"process.parent.executable"
    },
    {
      "raw_field":"CurrentDirectory",
      "ecs":"process.working_directory"
    },
    {
      "raw_field":"LogonId",
      "ecs":"process.real_user.id"
    },
    {
      "raw_field":"creationTime",
      "ecs":"timestamp"
    }
  ]
```