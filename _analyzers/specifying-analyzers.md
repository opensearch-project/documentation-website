---
layout: default
title: Specifying an analyzer
nav_order: 20
---


# Specifying an analyzer

Specify the name of the analyzer you want to use at query time in the `analyzer` field:

```json
GET shakespeare/_search
{
  "query": {
    "match": {
      "text_entry": {
        "query": "breathing men",
        "analyzer": "standard"
      }
    }
  }
}
```
{% include copy-curl.html %}

Valid values for built-in analyzers are `standard`, `simple`, `whitespace`, `stop`, `keyword`, `pattern`, `language`, `fingerprint`.