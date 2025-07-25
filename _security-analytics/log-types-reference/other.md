---
layout: default
title: Other log type mappings
parent: Supported log types
nav_order: 110
canonical_url: https://docs.opensearch.org/latest/security-analytics/log-types-reference/other/
---

# Other log type mappings

Security Analytics supports field mappings that are not specific to a single service or system. These mapping types are separated into the following categories: 

- Application: Records application logs.
- Advanced Persistent Threat (APT): Records logs commonly associated with APT attacks.
- Compliance: Records logs related to compliance.
- macOS: Records event logs when using a Mac device to access a network.
- Proxy: Records logs related to proxy events.
- Web: Records logs related to network access from the web.

Each log type contains the same field mappings, as shown in the following code snippet:

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