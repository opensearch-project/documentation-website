---
layout: default
title: WAF
parent: Supported log types
nav_order: 95
canonical_url: https://docs.opensearch.org/docs/latest/security-analytics/log-types-reference/waf/
---

The `waf` log type monitors web application firewall (WAF) logs. The role of a WAF is to monitor and filter HTTP traffic flowing between a web application and the internet. A WAF prevents common security attacks, such as cross-site scripting (XSS) and SQL injection (SQLi).

The following code snippet contains all the `raw_field` and `ecs` mappings for this log type:

```json
  "mappings": [
    {
      "raw_field":"cs-method",
      "ecs":"waf.request.method"
    },
    {
      "raw_field":"httpRequest.httpMethod",
      "ecs":"waf.request.method"
    },
    {
      "raw_field":"cs-uri-query",
      "ecs":"waf.request.uri_query"
    },
    {
      "raw_field":"httpRequest.uri",
      "ecs":"waf.request.uri_query"
    },
    {
      "raw_field":"httpRequest.args",
      "ecs":"waf.request.uri_query"
    },
    {
      "raw_field":"cs-user-agent",
      "ecs":"waf.request.headers.user_agent"
    },
    {
      "raw_field":"httpRequest.headers",
      "ecs":"waf.request.headers"
    },
    {
      "raw_field":"sc-status",
      "ecs":"waf.response.code"
    },
    {
      "raw_field":"responseCodeSent",
      "ecs":"waf.response.code"
    },
    {
      "raw_field":"timestamp",
      "ecs":"timestamp"
    },
    {
      "raw_field":"httpRequest.headers.value",
      "ecs":"waf.request.headers.value"
    },
    {
      "raw_field":"httpRequest.headers.name",
      "ecs":"waf.request.headers.name"
    }
  ]
```