---
layout: default
title: Point in Time
parent: Search options
nav_order: 20
redirect_from:
  - /opensearch/point-in-time/
  - /search-plugins/point-in-time/
---

# Point in Time

Point in Time (PIT) lets you run different queries against a dataset that is fixed in time. 

Normally, if you run a query on an index multiple times, the same query may return different results because documents are continually indexed, updated, and deleted. If you need to run a query against the same data, you can preserve that data's state by creating a PIT. The main use of the PIT feature is to couple it with the `search_after` functionality for deep pagination of search results.

## Paginating search results

Besides the PIT functionality, there are three ways to [paginate search results]({{site.url}}{{site.baseurl}}/opensearch/search/paginate/) in OpenSearch: using the Scroll API, specifying `from` and `size` parameters for your search, and using the `search_after` functionality. However, all three have limitations:

- The Scroll API's search results are frozen at the moment of the request, but they are bound to a particular query. Additionally, scroll can only move forward in the search, so if a request for a page fails, the subsequent request skips that page and returns the following one.
- If you specify the `from` and `size` parameters for your search, the search results are not frozen in time, so they may be inconsistent because of documents being indexed or deleted. The `from` and `size` feature is not recommended for deep pagination because every page request requires processing of all results and filtering them for the requested page.
- The `search_after` search results are not frozen in time, so they may be inconsistent because of concurrent document indexing or deletion.

The PIT functionality does not have the limitations of other pagination methods, because PIT search is not bound to a query, and it supports consistent pagination going forward and backward. If you have looked at page one of your results and are now on page two, you will see the same page one if you go back.

## PIT search

PIT search has the same capabilities as regular search, except PIT search acts on an older dataset, while a regular search acts on a live dataset. PIT search is not bound to a query, so you can run different queries on the same dataset, which is frozen in time. 

You can use the [Create PIT API]({{site.url}}{{site.baseurl}}/opensearch/point-in-time-api#create-a-pit) to create a PIT. When you create a PIT for a set of indexes, OpenSearch locks a set of segments for those indexes, freezing them in time. On a lower level, none of the resources required for this PIT are modified or deleted. If the segments that are part of a PIT are merged, OpenSearch retains a copy of those segments for the period of time specified at PIT creation by the `keep_alive` parameter. 

The create PIT operation returns a PIT ID, which you can use to run multiple queries on the frozen dataset. Even though the indexes continue to ingest data and modify or delete documents, the PIT references the data that has not changed since the PIT creation. When your query contains a PIT ID, you don't need to pass the indexes to the search because it will use that PIT. A search with a PIT ID will produce exactly the same result when you run it multiple times.

In case of a cluster or node failure, all PIT data is lost.
{: .note}

### PIT in SQL

The [SQL plugin]({{site.url}}{{site.baseurl}}/search-plugins/sql/index/) also supports pagination using PIT. When the `plugin.sql.pagination.api` setting is enabled (the default), SQL search queries in OpenSearch automatically use PIT internally. For more information, see [Pagination in SQL]({{site.url}}{{site.baseurl}}/search-plugins/sql/sql-ppl-api/#paginating-results).

## Pagination with PIT and search_after

When you run a query with a PIT ID, you can use the `search_after` parameter to retrieve the next page of results. This gives you control over the order of documents in the pages of results.

Run a search query with a PIT ID:

```json
GET /_search
{
  "size": 10000,
  "query": {
    "match" : {
      "user.id" : "elkbee"
    }
  },
  "pit": {
    "id":  "46ToAwMDaWR5BXV1aWQyKwZub2RlXzMAAAAAAAAAACoBYwADaWR4BXV1aWQxAgZub2RlXzEAAAAAAAAAAAEBYQADaWR5BXV1aWQyKgZub2RlXzIAAAAAAAAAAAwBYgACBXV1aWQyAAAFdXVpZDEAAQltYXRjaF9hbGw_gAAAAA==", 
    "keep_alive": "100m"
  },
  "sort": [ 
    {"@timestamp": {"order": "asc"}}
  ]
}
```

The response contains the first 10,000 documents that match the query. To get the next set of documents, run the same query with the last document's sort values as the `search_after` parameter, keeping the same `sort` and `pit.id`. You can use the optional `keep_alive` parameter to extend the PIT time:

```json
GET /_search
{
  "size": 10000,
  "query": {
    "match" : {
      "user.id" : "elkbee"
    }
  },
  "pit": {
    "id":  "46ToAwMDaWR5BXV1aWQyKwZub2RlXzMAAAAAAAAAACoBYwADaWR4BXV1aWQxAgZub2RlXzEAAAAAAAAAAAEBYQADaWR5BXV1aWQyKgZub2RlXzIAAAAAAAAAAAwBYgACBXV1aWQyAAAFdXVpZDEAAQltYXRjaF9hbGw_gAAAAA==", 
    "keep_alive": "100m"
  },
  "sort": [ 
    {"@timestamp": {"order": "asc"}}
  ],
  "search_after": [  
    "2021-05-20T05:30:04.832Z"
  ]
}
```

## Search slicing

Using `search_after` with PIT for pagination gives you control over ordering of the results. If you don't need results in any specific order, or if you want the ability to jump from a page to a non-consecutive page, you can use search slicing. Search slicing splits a PIT search into multiple slices that can be consumed independently by a client application.

For example, if you have a PIT search query that has 1,000,000 results and you want to return 50,000 results at a time, your client application has to make 20 consecutive calls to receive each batch of results. If you use search slicing, you can parallelize these 20 calls. In your multithreaded client application you can use five slices for each PIT. As a result, you will have 5 10,000-hit slices that can be consumed by five different threads in your client, instead of having a single thread consume 50,000 results. 

To use search slicing, you have to specify two parameters:
- `slice.id` is the slice ID you are requesting. 
- `slice.max` is the number of slices to break the search response into. 

The following PIT search query illustrates search slicing:

```json

GET /_search
{
  "slice": {
    "id": 0,  // id is the slice (page) number being requested. In every request we can only query for one slice                    
    "max": 2  // max is the total number of slices (pages) the search response will be broken down into                  
  },
  "query": {
    "match": {
      "message": "foo"
    }
  },
  "pit": {
    "id": "46ToAwMDaWR5BXV1aWQyKwZub2RlXzMAAAAAAAAAACoBYwADaWR4BXV1aWQxAgZub2RlXzEAAAAAAAAAAAEBYQADaWR5BXV1aWQyKgZub2RlXzIAAAAAAAAAAAwBYgACBXV1aWQyAAAFdXVpZDEAAQltYXRjaF9hbGw_gAAAAA=="
  }
}
```

In every request you can only query for one slice, so the next query will be the same as the previous one, except the `slice.id` will be `1`.


## API

The following table lists all [Point in Time API]({{site.url}}{{site.baseurl}}/api-reference/search-apis/point-int-time-api/) functions.

Function | API | Description
:--- | :--- | :---
[Create PIT]({{site.url}}{{site.baseurl}}/api-reference/search-apis/point-int-time-api/#create-a-pit) | `POST /<target_indexes>/_search/point_in_time?keep_alive=1h` | Creates a PIT.
[List PIT]({{site.url}}{{site.baseurl}}/api-reference/search-apis/point-int-time-api/#list-all-pits) | `GET /_search/point_in_time/_all` | Lists all PITs.
[Delete PIT]({{site.url}}{{site.baseurl}}/api-reference/search-apis/point-int-time-api/#delete-pits) | `DELETE /_search/point_in_time`<br> `DELETE /_search/point_in_time/_all` | Deletes a PIT or all PITs.
[PIT segments]({{site.url}}{{site.baseurl}}/api-reference/search-apis/point-int-time-api/#pit-segments) | `GET /_cat/pit_segments/_all` | Provides information about the disk utilization of a PIT by describing its Lucene segments.

For required permissions, see [Security model]({{site.url}}{{site.baseurl}}/api-reference/search-apis/point-int-time-api#security-model).

## PIT settings

You can specify the following settings for a PIT.

Setting | Description | Default 
:--- | :--- | :---
`point_in_time.max_keep_alive` | A cluster-level setting that specifies the maximum value for the `keep_alive` parameter. | 24h
`search.max_open_pit_context` | A node-level setting that specifies the maximum number of open PIT contexts for the node. | 300
