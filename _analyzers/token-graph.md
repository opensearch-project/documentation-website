---
layout: default
title: Token Graph
nav_order: 150
---

# Token graphs

Token graphs represent how tokens relate to each other during text analysis, especially when dealing with multi-word synonyms or compound words. They are important for accurate query matching and phrase expansion.

Each token is assigned the following:

- `position` – location where the token appears in the text

- `positionLength` – how many positions the token spans (used in multi-word expressions)

Token graphs use this information to build a graph structure of token relationships, which is later used during query parsing. Graph-aware token filters such [`synonym_graph`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/synonym-graph/) and [`word_delimiter_graph`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/word-delimiter-graph/) enable you to match phrases more accurately.

Following diagram demonstrates the relationship between `position` and `positionLength` when using [`synonym_graph`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/synonym-graph/). "NYC" token is assigned `position` of `0` and `positionLength` of `3`.

<img src="{{site.url}}{{site.baseurl}}/images/nyc-token-graph.png" alt="token graph" width="700">

## Token graphs during indexing and querying

At index time, `positionLength` is ignored and token graphs are not used.

At query time, token graphs are used by queries such as:

- [match]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match/)
- [match_phrase]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match-phrase/)

## Example: Synonym vs synonym_graph

To better understand the difference between graph-aware token filters and standard token filters, you can use the following steps to compare [`synonym`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/synonym/) token filter with [`synonym_graph`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/synonym-graph/) token filter:

1. Create index with [`synonym`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/synonym/) token filter (not graph-aware)

    ```json
    PUT /synonym_index
    {
      "settings": {
        "analysis": {
          "filter": {
            "my_synonyms": {
              "type": "synonym",
              "synonyms": ["ssd => solid state drive"]
            }
          },
          "analyzer": {
            "my_analyzer": {
              "tokenizer": "standard",
              "filter": ["lowercase", "my_synonyms"]
            }
          }
        }
      },
      "mappings": {
        "properties": {
          "content": {
            "type": "text",
            "analyzer": "my_analyzer"
          }
        }
      }
    }
    ```
    {% include copy-curl.html %}

2. Create index with [`synonym_graph`]({{site.url}}{{site.baseurl}}/analyzers/token-filters/synonym-graph/) token filter (graph-aware)

    ```json
    curl -X PUT "https://localhost:9200/synonym_graph_index" -u admin:admin -k -H 'Content-Type: application/json' -d'
    {
      "settings": {
        "analysis": {
          "filter": {
            "my_synonyms": {
              "type": "synonym_graph",
              "synonyms": ["ssd => solid state drive"]
            }
          },
          "analyzer": {
            "my_analyzer": {
              "tokenizer": "standard",
              "filter": ["lowercase", "my_synonyms"]
            }
          }
        }
      },
      "mappings": {
        "properties": {
          "content": {
            "type": "text",
            "analyzer": "my_analyzer"
          }
        }
      }
    }
    '
    ```
    {% include copy-curl.html %}

3. Create the same document in each index

    ```json
    curl -X POST "https://localhost:9200/synonym_index/_doc/1" -u admin:admin -k -H 'Content-Type: application/json' -d '
    { "content": "ssd is critical" }'
    ```
    {% include copy-curl.html %}
    
    ```json
    curl -X POST "https://localhost:9200/synonym_graph_index/_doc/1" -u admin:admin -k -H 'Content-Type: application/json' -d '
    { "content": "ssd is critical" }'
    ```
    {% include copy-curl.html %}

4. Search the non graph-aware index

    ```json
    curl -X POST "https://localhost:9200/synonym_index/_search" -u admin:admin -k -H 'Content-Type: application/json' -d '
    {
      "query": {
        "match_phrase": {
          "content": "domain name system is critical"
        }
      }
    }'
    ```
    {% include copy-curl.html %}
  
    Expected result (no hits):
    
    ```json
    {
      "took": 13,
      "timed_out": false,
      "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
      },
      "hits": {
        "total": {
          "value": 0,
          "relation": "eq"
        },
        "max_score": null,
        "hits": []
      }
    }
    ```

5. Search the graph-aware index

    ```json
    POST /synonym_graph_index/_search
    {
      "query": {
        "match_phrase": {
          "content": "solid state drive is critical"
        }
      }
    }
    ```
    {% include copy-curl.html %}
    
    Expected result (1 hit): 
    
    ```json
    {
      "took": 9,
      "timed_out": false,
      "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
      },
      "hits": {
        "total": {
          "value": 1,
          "relation": "eq"
        },
        "max_score": 1.4384103,
        "hits": [
          {
            "_index": "synonym_graph_index",
            "_id": "1",
            "_score": 1.4384103,
            "_source": {
              "content": "ssd is critical"
            }
          }
        ]
      }
    }
    ```

The reason there is a hit using graph-aware token filter is because during the [`match_phrase`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match-phrase/) query additional subquery is generated using the token graph. Following diagram is demonstrating the token graph created using the graph-aware token filter:

<img src="{{site.url}}{{site.baseurl}}/images/ssd-token-graph.png" alt="token graph" width="700">