---
layout: default
title: Paginate results
parent: Searching data
nav_order: 21
redirect_from:
  - /opensearch/search/paginate/
---

## Paginate results

You can use the following methods to paginate search results in OpenSearch: 

1. The [`from` and `size` parameters](#the-from-and-size-parameters)
1. The [scroll search](#scroll-search) operation
1. The [`search_after` parameter](#the-search_after-parameter)
1. [Point in Time with `search_after`](#point-in-time-with-search_after)

## The `from` and `size` parameters

The `from` and `size` parameters return results one page at a time.

The `from` parameter is the document number from which you want to start showing the results. The `size` parameter is the number of results that you want to show. Together, they let you return a subset of the search results.

For example, if the value of `size` is 10 and the value of `from` is 0, you see the first 10 results. If you change the value of `from` to 10, you see the next 10 results (because the results are zero-indexed). So if you want to see results starting from result 11, `from` must be 10.

```json
GET shakespeare/_search
{
  "from": 0,
  "size": 10,
  "query": {
    "match": {
      "play_name": "Hamlet"
    }
  }
}
```

Use the following formula to calculate the `from` parameter relative to the page number:

```json
from = size * (page_number - 1)
```

Each time the user chooses the next page of the results, your application needs to run the same search query with an incremented `from` value.

You can also specify the `from` and `size` parameters in the search URI:

```json
GET shakespeare/_search?from=0&size=10
```

If you only specify the `size` parameter, the `from` parameter defaults to 0.

Querying for pages deep in your results can have a significant performance impact, so OpenSearch limits this approach to 10,000 results.

The `from` and `size` parameters are stateless, so the results are based on the latest available data.
This can cause inconsistent pagination.
For example, assume a user stays on the first page of the results and then navigates to the second page. During that time, a new document relevant to the user's search is indexed and shows up on the first page. In this scenario, the last result on the first page is pushed to the second page, and the user sees duplicate results (that is, the first and second pages both display that last result).

Use the `scroll` operation for consistent pagination. The `scroll` operation keeps a search context open for a certain period of time. Any data changes do not affect the results during that time.


## Scroll search

The `from` and `size` parameters allow you to paginate your search results but with a limit of 10,000 results at a time.

If you need to request volumes of data larger than 1 PB from, for example, a machine learning job, use the `scroll` operation instead. The `scroll` operation allows you to request an unlimited number of results.

To use the scroll operation, add a `scroll` parameter to the request header with a search context telling OpenSearch for how long you need to keep scrolling. This search context needs to be long enough to process a single batch of results.

To set the number of results that you want returned for each batch, use the `size` parameter:

```json
GET shakespeare/_search?scroll=10m
{
  "size": 10000
}
```

OpenSearch caches the results and returns a scroll ID that you can use to access them in batches:

```json
"_scroll_id" : "DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAAAUWdmpUZDhnRFBUcWFtV21nMmFwUGJEQQ=="
```

Pass this scroll ID to the `scroll` operation to obtain the next batch of results:

```json
GET _search/scroll
{
  "scroll": "10m",
  "scroll_id": "DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAAAUWdmpUZDhnRFBUcWFtV21nMmFwUGJEQQ=="
}
```

Using this scroll ID, you get results in batches of 10,000 as long as the search context is still open. Typically, the scroll ID does not change between requests, but it *can* change, so make sure to always use the latest scroll ID. If you don't send the next scroll request within the set search context, the `scroll` operation does not return any results.

If you expect billions of results, use a sliced scroll. Slicing allows you to perform multiple scroll operations for the same request but in parallel.
Set the ID and the maximum number of slices for the scroll:

```json
GET shakespeare/_search?scroll=10m
{
  "slice": {
    "id": 0,
    "max": 10
  },
  "query": {
    "match_all": {}
  }
}
```

With a single scroll ID, you receive 10 results.
You can have up to 10 IDs.
Perform the same command with the ID equal to 1:

```json
GET shakespeare/_search?scroll=10m
{
  "slice": {
    "id": 1,
    "max": 10
  },
  "query": {
    "match_all": {}
  }
}
```

Close the search context when you’re done scrolling, because it continues to consume computing resources until the timeout:

```json
DELETE _search/scroll/DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAAAcWdmpUZDhnRFBUcWFtV21nMmFwUGJEQQ==
```

#### Sample Response

```json
{
  "succeeded": true,
  "num_freed": 1
}
```

Use the following request to close all open scroll contexts:

```json
DELETE _search/scroll/_all
```

The `scroll` operation corresponds to a specific timestamp. It doesn't consider documents added after that timestamp as potential results.

Because open search contexts consume a lot of memory, we suggest you don't use the `scroll` operation for frequent user queries that don't need the search context to be open. Instead, use the `sort` parameter with the `search_after` parameter to scroll responses for user queries.

## The `search_after` parameter

The `search_after` parameter provides a live cursor that uses the previous page's results to obtain the next page's results. It is similar to the `scroll` operation in that it is meant to scroll many queries in parallel. 

For example, the following query sorts all lines from the play "Hamlet" by the speech number and then the ID and retrieves the first three results:

```json
GET shakespeare/_search
{
  "size": 3,
  "query": {
    "match": {
      "play_name": "Hamlet"
    }
  },
  "sort": [
    { "speech_number": "asc" },
    { "_id": "asc" } 
  ]
}
```

The response contains the `sort` array of values for each document:

```json
{
  "took" : 7,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 4244,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [
      {
        "_index" : "shakespeare",
        "_id" : "32435",
        "_score" : null,
        "_source" : {
          "type" : "line",
          "line_id" : 32436,
          "play_name" : "Hamlet",
          "speech_number" : 1,
          "line_number" : "1.1.1",
          "speaker" : "BERNARDO",
          "text_entry" : "Whos there?"
        },
        "sort" : [
          1,
          "32435"
        ]
      },
      {
        "_index" : "shakespeare",
        "_id" : "32634",
        "_score" : null,
        "_source" : {
          "type" : "line",
          "line_id" : 32635,
          "play_name" : "Hamlet",
          "speech_number" : 1,
          "line_number" : "1.2.1",
          "speaker" : "KING CLAUDIUS",
          "text_entry" : "Though yet of Hamlet our dear brothers death"
        },
        "sort" : [
          1,
          "32634"
        ]
      },
      {
        "_index" : "shakespeare",
        "_id" : "32635",
        "_score" : null,
        "_source" : {
          "type" : "line",
          "line_id" : 32636,
          "play_name" : "Hamlet",
          "speech_number" : 1,
          "line_number" : "1.2.2",
          "speaker" : "KING CLAUDIUS",
          "text_entry" : "The memory be green, and that it us befitted"
        },
        "sort" : [
          1,
          "32635"
        ]
      }
    ]
  }
}
```

You can use the last result's `sort` values to retrieve the next result by using the `search_after` parameter:

```json
GET shakespeare/_search
{
  "size": 10,
  "query": {
    "match": {
      "play_name": "Hamlet"
    }
  },
  "search_after": [ 1, "32635"],
  "sort": [
    { "speech_number": "asc" },
    { "_id": "asc" } 
  ]
}
```

Unlike the `scroll` operation, the `search_after` parameter is stateless, so the document order may change because of documents being indexed or deleted.

## Point in Time with `search_after`

Point in Time (PIT) with `search_after` is the preferred pagination method in OpenSearch, especially for deep pagination. It bypasses the limitations of all other methods because it operates on a dataset that is frozen in time, it is not bound to a query, and it supports consistent pagination going forward and backward. To learn more, see [Point in Time]({{site.url}}{{site.baseurl}}/opensearch/point-in-time).