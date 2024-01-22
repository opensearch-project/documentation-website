---
layout: default
title: Other log type mappings
parent: Supported log types
nav_order: 110
---

# Other log type mappings

Security analytics supports additional field mappings which are not specific to a single service or system. These additional mapping types are seperated using the following categories: 

- Application: Records application logs.
- Advanced Persistent Threat (APT): Records logs commonly associated with APT attacks.
- Compliance: Records logs related to compliance.
- MacOS: Records event logs when using a Mac device to access a network.
- Proxy: Records logs related to proxy events.
- Web: Records logs related to network access from the web.


Each of these log types contain the same field mappings, as shown in the following code snippet:

```json
  "mappings": [
    {
      "raw_field":"record_type",
      "ecs":"dns.answers.type"
    },
    {
      "raw_field":"query",
      "ecs":"dns.question.name"
    },
    {
      "raw_field":"parent_domain",
      "ecs":"dns.question.registered_domain"
    },
    {
      "raw_field":"creationTime",
      "ecs":"timestamp"
    }
  ]
```