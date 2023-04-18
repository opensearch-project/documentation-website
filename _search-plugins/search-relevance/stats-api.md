---
layout: default
title: Search Relevance Stats API
nav_order: 65
parent: Search relevance
has_children: false
---

# Search Relevance Stats API
Introduced 2.7
{: .label .label-purple }

The Search Relevance Stats API provides information about [Search Relevance plugin](https://github.com/opensearch-project/dashboards-search-relevance) operations. The Search Relevance plugin processes operations sent by the [Compare Search Results]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance) Dashboards tool.

The Search Relevance Stats API captures statistics for a one-minute interval during which it receives a request. For example, if a request is received at 23:59:59.004, statistics are collected for the 23:58:00.000--23:58:59.999 time interval.

To change the default time interval for which statistics are collected, update the `searchRelevanceDashboards.metrics.metricInterval` setting in the `opensearch_dashboards.yml` file with the new time interval in milliseconds. The `opensearch_dashboards.yml` file is located in the `config` folder of your OpenSearch Dashboards installation. For example, the following sets the interval to one second:

```yml
searchRelevanceDashboards.metrics.metricInterval: 1000 
```

#### Example request

You can access the Search Relevance Stats API by providing its URL address in the following format:

```
<opensearch-dashboards-endpoint-address>/api/relevancy/stats
```

The OpenSearch Dashboards endpoint address may contain a port number if it is specified in the OpenSearch configuration file. The specific URL format depends on the type of OpenSearch deployment and the network environment in which it is hosted.
{: .note}

You can query the endpoint in two ways:
  
  - By accessing the endpoint address (for example, `http://localhost:5601/api/relevancy/stats`) in a browser

  - By using the `curl` command in the terminal:
    ```bash
    curl -X GET http://localhost:5601/api/relevancy/stats
    ```
    {% include copy.html %}

#### Example response

The following is the response for the preceding request:

```json
{
  "data": {
    "search_relevance": {
      "fetch_index": {
        "200": {
          "response_time_total": 28.79286289215088,
          "count": 1
        }
      },
      "single_search": {
        "200": {
          "response_time_total": 29.817723274230957,
          "count": 1
        }
      },
      "comparison_search": {
        "200": {
          "response_time_total": 13.265346050262451,
          "count": 2
        }
      }
    }
  },
  "overall": {
    "response_time_avg": 17.968983054161072,
    "requests_per_second": 0.06666666666666667
  },
  "counts_by_component": {
    "search_relevance": 4
  },
  "counts_by_status_code": {
    "200": 4
  }
}
```

## Response fields

The following table lists all response fields.

| Field | Data type | Description |
| :--- | :--- | :--- | 
| [`data.search_relevance`](#the-datasearch_relevance-object) | Object | Statistics related to Search Relevance operations. |
| `overall` | Object | The average statistics for all operations. |
| `overall.response_time_avg` | Double | The average response time for all operations, in milliseconds. |
| `overall.requests_per_second` | Double | The average number of requests per second for all operations. |
| `counts_by_component` | Object | The sum of all `count` values for all child objects of the `data` object. |
| `counts_by_component.search_relevance` | The total number of responses for all operations in the `search_relevance` object. |
| `counts_by_status_code` | Object | Contains a list of all response codes and their counts for all Search Relevance operations. |

### The `data.search_relevance` object

The `data.search_relevance` object contains the fields described in the following table.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `comparison_search` | Object | Statistics related to the comparison search operation. A comparison search operation is a request that compares two queries when both Query 1 and Query 2 are entered in the Compare Search Results tool. |
| `single_search` | Object | Statistics related to a single search operation. A single search operation is a request to run a single query when only Query 1 or Query 2, not both, is entered in the Compare Search Results tool. |
| `fetch_index` | Object | Statistics related to the operation of fetching the index or indexes for a comparison search or single search. |

Each of the `comparison_search`, `single_search`, and `fetch_index` objects contains a list of HTTP response codes. The following table lists the fields for each response code.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `response_time_total` | Double | The sum of the response times for the responses with this HTTP code, in milliseconds. |
| `count` | Integer | The total number of responses with this HTTP code.  |
