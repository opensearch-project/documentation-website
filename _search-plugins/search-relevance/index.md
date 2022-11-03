---
layout: default
title: Search relevance
nav_order: 55
has_children: false
has_toc: false
redirect_from:
  - /search-plugins/search-relevance/
---

# Search relevance

Search relevance is an experimental feature. Therefore, we do not recommend the use of search relevance in a production environment. For updates on the progress of search relevance, or if you want to leave feedback that could help improve the feature, join the [discussion on the OpenSearch forum]((https://forum.opensearch.org/t/feedback-experimental-feature-compare-search-results/11331).    
{: .warning}

Search relevance lets you compare search results to determine if one search configuration produces better results than the other. Using search relevance, you can evaluate search quality through experimenting with queries. 

For example, you can evaluate the effect of the following search configuration changes:

- Weighting different fields differently.
- Different stemming or lemmatization strategies.
- Shingling.

## Prerequisites

Before you get started, you must index data in OpenSearch. To learn how to create a new index, see [Index data]({{site.url}}{{site.baseurl}}/opensearch/index-data). 

Alternatively, you can add sample data in OpenSearch Dashboards using the following steps:

1. On the top menu bar, go to **OpenSearch Dashboards > Overview**.
1. Select **View app directory**.
1. Select **Add sample data**.  
1. Choose one of the built-in datasets and select **Add data**.


## Using search relevance in OpenSearch Dashboards

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
      "fields": [ "title", "text" ]
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
      "fields": [ "title^3", "text" ]
    }
  }
}
```
**Step 5:** Select **Search** and compare the results in **Result 1** and **Result 2**.

The following example screen shows a search for the word "container" in the `title` and `text` fields with and without boosting the `title`:

<img src="{{site.url}}{{site.baseurl}}/images/search_relevance.png" alt="Compare search results"/>{: .img-fluid }

If a result in Result 1 appears in Result 2, the `Up` and `Down` indicators below the result number signify how many places the result moved up or down compared to the same result in Results 2. In the example above, the document with the ID 10 is `Up 1` place in Result 2 compared to Result 1, and `Down 1` place in Result 1 compared to Result 2. 

## Changing the number of results

By default, OpenSearch returns the top 10 results. To change the number of returned results to a different value, specify the `size` parameter in the query as follows:

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

Setting `size` to a high value (for example, larger than 250) may degrade performance.
{: .note}