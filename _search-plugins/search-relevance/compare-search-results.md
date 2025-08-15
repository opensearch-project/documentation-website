---
layout: default
title: Comparing single queries
nav_order: 10
parent: Search Relevance Workbench
grand_parent: Search relevance
has_children: false
---

# Comparing single queries

With Compare Search Results in OpenSearch Dashboards, you can compare results from two queries side by side to determine whether one query produces better results than the other. Using this tool, you can evaluate search quality by experimenting with queries.

For example, you can see how results change when you apply one of the following query changes:

- Weighting fields differently
- Different stemming or lemmatization strategies
- Shingling

## Prerequisites

Before you get started, you must index data in OpenSearch. To learn how to create a new index, see [Index data]({{site.url}}{{site.baseurl}}/opensearch/index-data/).

Alternatively, you can add sample data in OpenSearch Dashboards using the following steps:

1. On the top menu bar, go to **OpenSearch Dashboards > Overview**.
1. Select **View app directory**.
1. Select **Add sample data**.
1. Choose one of the built-in datasets and select **Add data**.

## Using Compare Search Results in OpenSearch Dashboards

To compare search results in OpenSearch Dashboards, perform the following steps.

**Step 1:** On the top menu bar, go to **OpenSearch Plugins > Search Relevance**.

**Step 2:** Enter the search text in the search bar.

**Step 3:** Select an index for **Query 1** and enter a query (request body only) in [OpenSearch Query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/). The `GET` HTTP method and the `_search` endpoint are implicit. Use the `%SearchText%` variable to refer to the text in the search bar.

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

The following example query boosts the `title` field in the search results:

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

**Step 5:** Select **Search** and compare **Result 1** and **Result 2**.

The following example screen shows a search for the word "cup" in the `description` and `item_name` fields with and without boosting the `item_name`.

<img src="{{site.url}}{{site.baseurl}}/images/search_relevance.png" alt="Compare search results"/>{: .img-fluid }

If a result in Result 1 appears in Result 2, the `Up` and `Down` indicators below the result number signify how many positions the result moved up or down compared to the same result in Result 2. In this example, the document with the ID 2 is `Up 1` position in Result 2 compared to Result 1 and `Down 1` position in Result 1 compared to Result 2.

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

## Comparing OpenSearch search results using Search Relevance Workbench

[Search Relevance Workbench]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/using-search-relevance-workbench/) provides richer visualization options for examining the difference between two queries.

To use Search Relevance Workbench, follow steps 1--4. The displayed results and the options for viewing the differences are shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/search-relevance-workbench/comparing_search_results.png" alt="Compare search results"/>{: .img-fluid }

The top section provides a summary of the results: how many of the retrieved results are unique to the query on the left, how many are unique to the query on the right, and how many are part of both queries?

What follows is a visual representation of the retrieved results. By default the unique identifier field (`_id`) is shown. You can change this by selecting a different field in the **Display Field** dropdown list.
In the side-by-side view, you can see the positional changes for all common documents among the two result lists.
Selecting one item shows all stored fields in the index to facilitate easier document identification.

Lastly, Search Relevance Workbench allows you to choose among different visualization styles from a dropdown list:

* **Default style**: Different colors are used for the two result list documents (unique results are on the left in yellow and on the right in purple, and common results are displayed in green).
* **Ranking change color coding**: All unique documents are purple, and common results are green to focus on ranking changes.
* **Ranking change color coding 2**: All unique documents are gray, and common results are green to focus on ranking changes.
* **Venn diagram color coding**: All unique documents are purple, and common results are blue as in the Venn diagram at the top of the two result lists.

## Comparing OpenSearch search results with reranked results

One use case for Compare Search Results is the comparison of raw OpenSearch results with the same results processed by a reranking application. OpenSearch currently integrates with the following two rerankers:

- [Amazon Kendra Intelligent Ranking for OpenSearch](#reranking-results-with-amazon-kendra-intelligent-ranking-for-opensearch)
- [Amazon Personalize Search Ranking](#personalizing-search-results-with-amazon-personalize-search-ranking)

### Reranking results with Amazon Kendra Intelligent Ranking for OpenSearch

An example of a reranker is **Amazon Kendra Intelligent Ranking for OpenSearch**, contributed by the Amazon Kendra team. This plugin takes search results from OpenSearch and applies Amazon Kendra’s semantic relevance rankings calculated using vector embeddings and other semantic search techniques. For many applications, this provides better result rankings.

To try Amazon Kendra Intelligent Ranking, you must first set up the Amazon Kendra service. To get started, see [Amazon Kendra](https://aws.amazon.com/kendra/). For detailed information, including plugin setup instructions, see [Amazon Kendra Intelligent Ranking for self-managed OpenSearch](https://docs.aws.amazon.com/kendra/latest/dg/opensearch-rerank.html).

### Comparing search results with reranked results in OpenSearch Dashboards

To compare search results with reranked results in OpenSearch Dashboards, enter a query in **Query 1** and enter the same query using a reranker in **Query 2**. Then compare the OpenSearch results with the reranked results.

The following example demonstrates searching for the text "snacking nuts" in the `abo` index. The documents in the index contain snack descriptions in the `bullet_point` array.

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
1. Enter the same query with a reranker in **Query 2**. This example uses Amazon Kendra Intelligent Ranking:

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

    In the preceding query, `body_field` refers to the body field of the documents in the index, which Amazon Kendra Intelligent Ranking uses to rank the results. The `body_field` is required, while the `title_field` is optional.
1. Select **Search** and compare the results in **Result 1** and **Result 2**.

### Personalizing search results with Amazon Personalize Search Ranking

Another example of a reranker is **Amazon Personalize Search Ranking**, contributed by the Amazon Personalize team. Amazon Personalize uses machine learning (ML) techniques to generate custom recommendations for your users. The plugin takes OpenSearch search results and applies a [search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/) to rerank them according to their Amazon Personalize ranking. The Amazon Personalize rankings are based on the user's past behavior and metadata about the search items and the user. This workflow improves the search experience for your users by personalizing their search results.

To try Amazon Personalize Search Ranking, you must first set up Amazon Personalize. To get started, see [Amazon Personalize](https://docs.aws.amazon.com/personalize/latest/dg/setup.html). For detailed information, including plugin setup instructions, see [Personalizing search results from OpenSearch](https://docs.aws.amazon.com/personalize/latest/dg/personalize-opensearch.html).
