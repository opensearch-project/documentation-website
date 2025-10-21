---
layout: default
title: Querqy
parent: Query rewriting
grand_parent: Search relevance
has_children: false
redirect_from:
  - /search-plugins/querqy/
nav_order: 210
---

# Querqy

Querqy for OpenSearch is a community plugin for query rewriting that helps to solve relevance issues, making OpenSearch more precise regarding matching and scoring by supporting rules for burying, boosting, filtering, and redirecting search results, among many other capabilities.

Querqy currently supports up to OpenSearch 2.19.2.
{: .warning }

Find out more about Querqy by visiting the comprehensive documentation on the Querqy.org site: [Querqy Docs](https://docs.querqy.org/querqy/index.html)


## Querqy plugin installation

The Querqy plugin is now available for OpenSearch 2.19.2. Run the following command to install the Querqy plugin:

````bash
./bin/opensearch-plugin install \
   "https://repo1.maven.org/maven2/org/querqy/opensearch-querqy/1.1.os2.19.2/opensearch-querqy-1.1.os2.19.2.zip"
````

Answer `yes` to the security prompts during the installation as Querqy requires additional permissions to load query rewriters.


## Endpoints

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
