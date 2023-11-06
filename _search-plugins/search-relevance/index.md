---
layout: default
title: Search relevance
nav_order: 55
has_children: true
has_toc: false
redirect_from:
  - /search-plugins/search-relevance/
---

# Search relevance

Search relevance evaluates the accuracy of the search results returned by a query. The higher the relevance, the better the search engine. Compare Search Results is the first search relevance feature in OpenSearch. 

## Compare Search Results

Compare Search Results in OpenSearch Dashboards lets you compare results from two queries side by side to determine whether one query produces better results than the other. Using this tool, you can evaluate search quality by experimenting with queries. 

For example, you can see how results change when you apply one of the following query changes:

- Weighting different fields differently
- Different stemming or lemmatization strategies
- Shingling

## Prerequisites

Before you get started, you must index data in OpenSearch. To learn how to create a new index, see [Index data]({{site.url}}{{site.baseurl}}/opensearch/index-data). 

Alternatively, you can add sample data in OpenSearch Dashboards using the following steps:

1. On the top menu bar, go to **OpenSearch Dashboards > Overview**.
1. Select **View app directory**.
1. Select **Add sample data**.  
1. Choose one of the built-in datasets and select **Add data**.

## Using Compare Search Results in OpenSearch Dashboards

To compare search results in OpenSearch Dashboards, perform the following steps.

**Step 1:** On the top menu bar, go to **OpenSearch Plugins > Search Relevance**.  

**Step 2:** Enter the search text in the search bar.

**Step 3:** Select an index for **Query 1** and enter a query (request body only) in [OpenSearch Query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl). The `GET` HTTP method and the `_search` endpoint are implicit. Use the `%SearchText%` variable to refer to the text in the search bar.

The following is an example query:

```json
{
  "query": {
    "multi_match": {
      "query": "%SearchText%",
      "fields": [ "description", "item_name" ]
    }
  }
}
```

**Step 4:** Select an index for **Query 2** and enter a query (request body only).

The following example query boosts the `title` field in search results:

```json
{
  "query": {
    "multi_match": {
      "query": "%SearchText%",
      "fields": [ "description", "item_name^3" ]
    }
  }
}
```

**Step 5:** Select **Search** and compare the results in **Result 1** and **Result 2**.

The following example screen shows a search for the word "cup" in the `description` and `item_name` fields with and without boosting the `item_name`:

<img src="{{site.url}}{{site.baseurl}}/images/search_relevance.png" alt="Compare search results"/>{: .img-fluid }

If a result in Result 1 appears in Result 2, the `Up` and `Down` indicators below the result number signify how many places the result moved up or down compared to the same result in Result 2. In this example, the document with the ID 2 is `Up 1` place in Result 2 compared to Result 1 and `Down 1` place in Result 1 compared to Result 2. 

## Changing the number of results

By default, OpenSearch returns the top 10 results. To change the number of returned results to a different value, specify the `size` parameter in the query:

```json
{
  "size": 15,
  "query": {
    "multi_match": {
      "query": "%SearchText%",
      "fields": [ "title^3", "text" ]
    }
  }
}
```

Setting `size` to a high value (for example, larger than 250 documents) may degrade performance.
{: .note}

You cannot save a given comparison for future use, so Compare Search Results is not suitable for systematic testing.
{: .note}

## Comparing OpenSearch search results with reranked results

One use case for Compare Search Results is the comparison of raw OpenSearch results with the same results processed by a reranking application. OpenSearch currently integrates with the following two rerankers:

- [Kendra Intelligent Ranking for OpenSearch](#reranking-results-with-kendra-intelligent-ranking-for-opensearch)
- [Amazon Personalize Search Ranking](#personalizing-search-results-with-amazon-personalize-search-ranking)

### Reranking results with Kendra Intelligent Ranking for OpenSearch

An example of a reranker is **Kendra Intelligent Ranking for OpenSearch**, contributed by the Amazon Kendra team. This plugin takes search results from OpenSearch and applies Amazon Kendra’s semantic relevance rankings calculated using vector embeddings and other semantic search techniques. For many applications, this provides better result rankings.

To try Kendra Intelligent Ranking, you must first set up the Amazon Kendra service. To get started, see [Amazon Kendra](https://aws.amazon.com/kendra/). For detailed information, including plugin setup instructions, see [Intelligently ranking OpenSearch (self managed) results using Amazon Kendra](https://docs.aws.amazon.com/kendra/latest/dg/opensearch-rerank.html).

### Comparing search results with reranked results in OpenSearch Dashboards

To compare search results with reranked results in OpenSearch Dashboards, enter a query in **Query 1** and enter the same query using a reranker in **Query 2**. Then compare the search results from OpenSearch with reranked results.

The following example searches for the text "snacking nuts" in the `abo` index. The documents in the index contain snack descriptions in the `bullet_point` array. 

<img src="{{site.url}}{{site.baseurl}}/images/kendra_query.png" alt="OpenSearch Intelligent Ranking query"/>{: .img-fluid }

1. Enter `snacking nuts` in the search bar.
1. Enter the following query, which searches the `bullet_point` field for the search text "snacking nuts", in **Query 1**:

    ```json
    {
      "query": {
        "match": {
          "bullet_point": "%SearchText%"
        }
      },
      "size": 25
    }
    ```
1. Enter the same query with a reranker in **Query 2**. This example uses Kendra Intelligent Ranking:

    ```json
    {
      "query" : {
        "match" : {
          "bullet_point": "%SearchText%"
        }
      },
      "size": 25,
      "ext": {
        "search_configuration":{
          "result_transformer" : {
            "kendra_intelligent_ranking": {
              "order": 1,
              "properties": {
                "title_field": "item_name",
                "body_field": "bullet_point"
              }
            }
          }
        }
      }
    }
    ```

    In the preceding query, `body_field` refers to the body field of the documents in the index, which Kendra Intelligent Ranking uses to rank the results. The `body_field` is required, while the `title_field` is optional.
1. Select **Search** and compare the results in **Result 1** and **Result 2**.

### Personalizing search results with Amazon Personalize Search Ranking

Another example of a reranker is **Amazon Personalize Search Ranking**, contributed by the Amazon Personalize team. Amazon Personalize uses machine learning (ML) techniques to generate custom recommendations for your users. The plugin takes search results from OpenSearch and applies a [search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/) to rerank them according to their Amazon Personalize ranking. The Amazon Personalize rankings are based on the user's past behavior and metadata about the search items and the user. This workflow improves the search experience for your users by personalizing their search results.

To try Amazon Personalize Search Ranking, you must first set up Amazon Personalize. To get started, see [Amazon Personalize](https://docs.aws.amazon.com/personalize/latest/dg/setup.html). For detailed information, including plugin setup instructions, see [Personalizing search results from OpenSearch (self-managed)](https://docs.aws.amazon.com/personalize/latest/dg/personalize-opensearch.html).
