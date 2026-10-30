---
layout: default
title: Paginate results
parent: Customizing search results
nav_order: 10
redirect_from:
  - /opensearch/search/paginate/
---

# Paginate results

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

If you don't specify `size`, a search returns 10 hits. If you only specify the `size` parameter, the `from` parameter defaults to 0.

Querying for pages deep in your results is expensive. To return results starting at `from`, each shard must find and sort its top `from` + `size` results, and the coordinating node must then merge and sort the results from all shards. Memory use and latency therefore grow with the value of `from`. To protect the cluster, OpenSearch rejects requests in which `from` + `size` exceeds the `index.max_result_window` index setting. Default is `10000`. To page through more results, use [`search_after`](#the-search_after-parameter) or a [scroll](#scroll-search).

If several documents have the same sort values, for example, the same relevance score, their order can differ between requests. This happens because requests can be served by different shard copies, which store documents in a different internal order. A document can then appear on two pages or on none. To keep the order stable, add a field with a unique value per document as the last sort field, or send all requests from a user to the same shard copies using the [`preference`]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search/#the-preference-query-parameter) parameter with a value such as the user's session ID.

The `from` and `size` parameters are stateless, so the results are based on the latest available data.
This can cause inconsistent pagination.
For example, assume a user stays on the first page of the results and then navigates to the second page. During that time, a new document relevant to the user's search is indexed and shows up on the first page. In this scenario, the last result on the first page is pushed to the second page, and the user sees duplicate results (that is, the first and second pages both display that last result).

Use the `scroll` operation for consistent pagination. The `scroll` operation keeps a search context open for a certain period of time. Any data changes do not affect the results during that time.


## Scroll search

The `from` and `size` parameters cannot return results past the `index.max_result_window` limit (by default, 10,000). To retrieve a larger result set, for example, to export all documents that match a query or to process them in a batch job, use the `scroll` operation. The `scroll` operation can return any number of results.

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

Pass this scroll ID to the `scroll` operation to obtain the next batch of results. Do not include an index name in the path: the scroll ID already identifies the indexes of the initial search, and OpenSearch rejects a request to `<index>/_search/scroll`:

```json
GET _search/scroll
{
  "scroll": "10m",
  "scroll_id": "DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAAAUWdmpUZDhnRFBUcWFtV21nMmFwUGJEQQ=="
}
```

Using this scroll ID, you get results in batches of 10,000 as long as the search context is still open. Typically, the scroll ID does not change between requests, but it *can* change, so make sure to always use the latest scroll ID. If you don't send the next scroll request within the set search context, the `scroll` operation does not return any results.

Continue sending scroll requests until a response contains an empty `hits.hits` array, which means that all results were returned. If the initial search request contains aggregations, they are returned only in the first response.

Each scroll request resets the expiration time of the search context to the `scroll` value specified in that request, so the value must cover only the time needed to process one batch. If a scroll request does not contain a `scroll` value, OpenSearch returns the batch and then closes the search context. The `scroll` value cannot exceed the `search.max_keep_alive` cluster setting. Default is `24h`.

If you need all matching documents and their order does not matter, sort by `_doc`. This is the most efficient sort order for scrolling:

```json
GET shakespeare/_search?scroll=10m
{
  "size": 10000,
  "sort": ["_doc"]
}
```
{% include copy-curl.html %}

To retrieve a large result set faster, use a sliced scroll. Slicing splits one scroll into several independent scrolls, called _slices_, that you can process in parallel. In each request, set `slice.max` to the total number of slices and `slice.id` to the slice that the request retrieves, from `0` to `max` minus 1. The following request retrieves the first of two slices:

```json
GET shakespeare/_search?scroll=10m
{
  "slice": {
    "id": 0,
    "max": 2
  },
  "query": {
    "match_all": {}
  }
}
```
{% include copy-curl.html %}

To retrieve the second slice, send the same request with `id` set to `1`:

```json
GET shakespeare/_search?scroll=10m
{
  "slice": {
    "id": 1,
    "max": 2
  },
  "query": {
    "match_all": {}
  }
}
```
{% include copy-curl.html %}

Each request returns its own scroll ID, which you use to page through that slice. Together, the slices contain the same documents as an unsliced scroll, and each document belongs to exactly one slice. In the `shakespeare` index, the two slices contain 55,635 and 55,761 of the 111,396 documents.

By default, OpenSearch assigns documents to slices first by shard and then by a hash of the document `_id` within each shard. If you request more slices than there are shards, the first requests for each slice are slow and use memory proportional to the number of documents in the shard, until OpenSearch caches the slice filter. Limit the number of slices that you query in parallel.

To avoid this cost, you can assign documents to slices based on the doc values of another field by specifying the field in `slice.field`. The field must meet the following requirements:

- The field must be a numeric field with [doc values]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/doc-values/) enabled. OpenSearch rejects requests that slice on `keyword`, `text`, or other non-numeric fields or on fields with doc values disabled.
- Each document must contain exactly one value. A document whose field contains several values can be returned in more than one slice.
- The value must not change after the document is indexed, so that each document stays in the same slice for the duration of the scroll.
- The field should have many distinct values so that documents are distributed evenly across slices. For example, a timestamp in an index to which you only add documents is a good choice.

The following request splits the results into two slices based on the `line_id` field:

```json
GET shakespeare/_search?scroll=10m
{
  "slice": {
    "field": "line_id",
    "id": 0,
    "max": 2
  },
  "query": {
    "match_all": {}
  }
}
```
{% include copy-curl.html %}

You can also slice a [Point in Time]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/point-in-time/) (PIT) search using the same `slice` object. OpenSearch rejects a `slice` in a search that uses neither a scroll nor a PIT.

The maximum number of slices is controlled by the `index.max_slices_per_scroll` index setting for scrolls and by the `index.max_slices_per_pit` index setting for PIT searches. Default is `1024` for both settings. OpenSearch rejects a request whose `slice.max` value exceeds the limit. For more information, see [Index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/).

Close the search context when you’re done scrolling, because it continues to consume computing resources until the timeout:

```json
DELETE _search/scroll/DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAAAcWdmpUZDhnRFBUcWFtV21nMmFwUGJEQQ==
```

#### Example response

```json
{
  "succeeded": true,
  "num_freed": 1
}
```

To close several scroll contexts at once, specify their IDs in the request body as an array:

```json
DELETE _search/scroll
{
  "scroll_id": [
    "<scroll_id_1>",
    "<scroll_id_2>"
  ]
}
```

You can also specify a single ID in the `scroll_id` field or provide a comma-separated list of IDs in the request path, for example, `DELETE _search/scroll/<scroll_id_1>,<scroll_id_2>`.

Use the following request to close all open scroll contexts:

```json
DELETE _search/scroll/_all
```

The `scroll` operation corresponds to a specific timestamp. It doesn't consider documents added after that timestamp as potential results.

An open search context consumes resources until it is closed or expires. While a scroll is open, OpenSearch cannot delete the old segments that were merged into new segments, because the scroll still reads them. This uses more disk space and file handles. On indexes that receive ongoing updates or deletes, an open scroll also uses more heap memory. Each node allows at most `search.max_open_scroll_context` open scroll contexts. Default is `500`. To check the number of open scroll contexts, use the Nodes Stats API and look at the `scroll_current` value:

```json
GET _nodes/stats/indices/search
```
{% include copy-curl.html %}

Because of this cost, don't use the `scroll` operation for frequent user queries. For user-facing pagination, use the `sort` parameter with the `search_after` parameter. If users must see consistent results across pages, combine `search_after` with a [Point in Time](#point-in-time-with-search_after) (PIT). A PIT also keeps a search context open, so set its `keep_alive` to the shortest period that your application needs and delete the PIT when you no longer need it.

## The `search_after` parameter

The `search_after` parameter provides a live cursor that uses the previous page's results to obtain the next page's results. It is similar to the `scroll` operation in that it is meant to scroll many queries in parallel. You can use `search_after` only when sorting is applied.

For example, the following query sorts all lines from the play "Hamlet" by the speech number and then the line ID and retrieves the first three results:

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
    { "line_id": "asc" }
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
          32436
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
          32635
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
          32636
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
  "search_after": [ 1, 32636],
  "sort": [
    { "speech_number": "asc" },
    { "line_id": "asc" }
  ]
}
```

Unlike the `scroll` operation, the `search_after` parameter is stateless, so the document order may change because of documents being indexed or deleted. Because each request depends on the `sort` values of the previous page, `search_after` can only move forward one page at a time. You cannot use it to jump to an arbitrary page.

When you use `search_after`, the `from` parameter must be `0` or omitted. OpenSearch rejects requests that specify any other value.

Include a field that has a unique value for each document as the last field in the `sort` array. This field acts as a _tiebreaker_: without it, documents that have the same values for all other sort fields have no defined order, and pages can skip or repeat them. In the preceding example, `line_id` is unique for each line, so it acts as the tiebreaker for documents that have the same `speech_number`.

Avoid using the `_id` field as the tiebreaker. The `_id` field has no doc values, so sorting on it loads all document IDs into memory. It is also unique only within an index, so it cannot break ties for documents from different indexes. Instead, copy the document ID into a `keyword` field when you index the document, either in your application or using a [`set` ingest processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/set/), and sort on that field.

## Point in Time with `search_after`

Point in Time (PIT) with `search_after` is the preferred pagination method in OpenSearch, especially for deep pagination. It bypasses the limitations of all other methods because it operates on a dataset that is frozen in time, it is not bound to a query, and it supports consistent pagination going forward and backward. To learn more, see [Point in Time]({{site.url}}{{site.baseurl}}/opensearch/point-in-time/).