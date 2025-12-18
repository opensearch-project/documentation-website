---
layout: default
title: Querqy
parent: Query rewriting
grand_parent: Search relevance
has_children: false
redirect_from:
  - /search-plugins/querqy/
nav_order: 210
canonical_url: https://docs.opensearch.org/latest/search-plugins/querqy/index/
---

# Querqy

Querqy for OpenSearch is a community plugin for query rewriting that improves search relevance. It makes OpenSearch more precise in matching and scoring by applying rules for boosting, burying, filtering, and redirecting search results, among other capabilities.

Querqy currently supports OpenSearch versions up to 2.19.2.
{: .warning }

For more information, see the [Querqy documentation](https://docs.querqy.org/querqy/index.html).


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
