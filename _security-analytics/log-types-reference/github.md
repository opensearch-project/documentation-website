---
layout: default
title: GitHub
parent: Supported log types
nav_order: 40
canonical_url: https://opensearch.org/docs/latest/security-analytics/log-types-reference/github/
---

# GitHub

The `github` log type monitors workflows created by [GitHub Actions](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions).

The following code snippet contains all the `raw_field` and `ecs` mappings for this log type:

```json
  "mappings": [
    {
      "raw_field":"action",
      "ecs":"github.action"
    }
  ]
```