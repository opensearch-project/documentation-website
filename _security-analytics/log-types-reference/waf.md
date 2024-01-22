---
layout: default
title: WAF
parent: Supported log types
nav_order: 95
---

The `waf` log type monitors for Web Application Firewall (WAF) logs. The role of a WAF is to montior and filter HTTP traffic between a web application and the internet. WAF prevents common security attacks, such as cross-site scripting (XSS) and SQL Injection (SQi).

The following code snippet contains all the `raw_field`
and `ecs` mappings for this log type:

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