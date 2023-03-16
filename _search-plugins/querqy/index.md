---
layout: default
title: Querqy
has_children: false
redirect_from:
  - /search-plugins/querqy/
nav_order: 210
---

# Querqy

Querqy is a community plugin for query rewriting that helps to solve relevance issues, making search engines more precise regarding matching and scoring.

Querqy is currently only supported in OpenSearch 2.3.
{: .warning }

## Querqy plugin installation

The Querqy plugin is now available for OpenSearch 2.3.0. Run the following command to install the Querqy plugin.

````bash
./bin/opensearch-plugin install \
   "https://repo1.maven.org/maven2/org/querqy/opensearch-querqy/1.0.os2.3.0/opensearch-querqy-1.0.os2.3.0.zip"
````

Answer `yes` to the security prompts during the installation as Querqy requires additional permissions to load query rewriters.

After installing the Querqy plugin you can find comprehensive documentation on the Querqy.org site: [Querqy](https://docs.querqy.org/querqy/index.html)

## Path and HTTP methods

```
POST /myindex/_search
```

## Example query

````json
{
   "query": {
       "querqy": {
           "matching_query": {
               "query": "books"
           },
           "query_fields": [ "title^3.0", "words^2.1", "shortSummary"]
       }
   }
}
````