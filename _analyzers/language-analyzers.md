---
layout: default
title: Language analyzers
nav_order: 10
redirect_from:
  - /query-dsl/analyzers/language-analyzers/
---

# Language analyzer

OpenSearch supports the following language values with the `analyzer` option:
`arabic`, `armenian`, `basque`, `bengali`, `brazilian`, `bulgarian`, `catalan`, `czech`, `danish`, `dutch`, `english`, `estonian`, `finnish`, `french`, `galician`, `german`, `greek`, `hindi`, `hungarian`, `indonesian`, `irish`, `italian`, `latvian`, `lithuanian`, `norwegian`, `persian`, `portuguese`, `romanian`, `russian`, `sorani`, `spanish`, `swedish`, `turkish`, and `thai`.

To use the analyzer when you map an index, specify the value within your query. For example, to map your index with the French language analyzer, specify the `french` value for the analyzer field:

```json
 "analyzer": "french"
```

#### Example request

The following query specifies the `french` language analyzer for the index `my-index`:

```json
PUT my-index
{
  "mappings": {
    "properties": {
      "text": { 
        "type": "text",
        "fields": {
          "french": { 
            "type": "text",
            "analyzer": "french"
          }
        }
      }
    }
  }
}
```

<!-- TO do: each of the options needs its own section with an example. Convert table to individual sections, and then give a streamlined list with valid values. -->