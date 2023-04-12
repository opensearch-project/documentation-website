---
layout: default
title: Search relevance Stats API
nav_order: 65
parent: Search relevance
has_children: false
---

# Search Relevance Stats API
Introduced 2.7
{: .label .label-purple }

The Search Relevance Stats API provides information about the current status of the Search Relevance plugin. 

## Path and HTTP methods
<!-- GetIndexes = '/api/relevancy/search/indexes',
  GetSearchResults = '/api/relevancy/search',
  GetStats = '/api/relevancy/stats',-->
The following endpoint provides information about Search Relevance statistics:

```json
GET /<index>/api/relevancy/stats
```
The following endpoint provides information about Search Relevance search results:

```json
GET /<index>/api/relevancy/search
```

The following endpoint provides information about Search Relevance indexes:

```json
GET /<index>/api/relevancy/search/indexes
```

<!-- what's the difference in the above endpoints? -->

#### Example request

The following example request retrieves statistics for the index named `test-index`:

```json
GET /test-index/relevancy/stats
```
{% include copy-curl.html %}

#### Example response

The following is the response for the preceding request:

```json
{
  "data": {
    "relevant_search": {  <!-- what else can be here in place of relevant search? Or is relevant search the only option? -->
      "fetch_index": {
        "200": {
          "sum": 12.02572301030159,
          "count": 1
        }
      },
      "single_search": {
        "200": {
          "sum": 4.898337006568909,
          "count": 1
        }
      }
    }
  },
  "overall": {
    "response_time_avg": 8.46203000843525,
    "requests_per_second": 0.03333333333333333
  },
  "component_counts": {
    "relevant_search": 2
  },
  "status_code_counts": {
    "200": 2
  }
}
```

## Response fields

The following table lists all response fields.
<!-- search_relevance or relevant_search? -->
| Field | Data type | Description |
| :--- | :--- | :--- | 
| [`data.search_relevance`](#the-datasearch_relevance-object) | Object | Statistics related to the search comparison operation. |
| `overall` | Object | The average values for all operations. |
| `overall.response_time_avg` | Double | The average response time for all operations, in milliseconds. |
| `overall.requests_per_second` | Double | The average number of requests per second for all operations. |
| `component_counts.relevant_search` | Object | The total number of operations. |
| `status_code_counts` | Object | Contains a list of all response codes with their counts. |

### The `data.search_relevance` object

The `data.search_relevance` object contains the fields described in the following table.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `compare_search` | Object | Statistics related to the search comparison operation. |
| `single_search` | Object | Statistics related to each individual search. |
| `fetch_index` | Object | Statistics related to the operation of fetching the index. |

Each of the `compare_search`, `single_search`, and `fetch_index` objects contains a list of HTTP response codes. Each response code contains the fields described in the following table.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `sum` | Double | The sum of the response times for the responses with this HTTP code, in <!-- milliseconds?--> |
| `count` | Integer | The total number of responses with this HTTP code.  |

## Required permissions

If you use the security plugin, make sure you have the appropriate permissions: <INSERT PERMISSIONS HERE>.
