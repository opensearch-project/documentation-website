---
layout: default
title: Analyze your data
nav_order: 60
---

# Analyze your data

The `students` index that you built in the previous tutorials contains three documents, so you could inspect each result in the response. Real-world indexes can contain thousands of documents, making that approach impractical. In this tutorial, you'll explore, filter, and sort the **Sample flight data** dataset, which contains about 13,000 documents. You'll also use aggregations to summarize the data.

## Add the sample data

This tutorial uses a sample dataset provided in OpenSearch Dashboards, so it requires a running OpenSearch Dashboards instance. If you followed the [Installation quickstart]({{site.url}}{{site.baseurl}}/getting-started/quickstart/), OpenSearch Dashboards is already included in your installation.

To add the **Sample flight data** dataset, follow these steps:

1. In a web browser, open `http://localhost:5601`. This is the address of a cluster [set up without security]({{site.url}}{{site.baseurl}}/getting-started/quickstart/#set-up-a-cluster-without-security-for-local-development). If you [set up your cluster with security]({{site.url}}{{site.baseurl}}/getting-started/quickstart/#set-up-a-cluster-with-security-recommended-for-most-use-cases), open `https://localhost:5601` and sign in as `admin` using the password that you set.
1. On the OpenSearch Dashboards home page, select **Add sample data**.
1. In the **Sample flight data** panel, select **Add data**.

Adding the dataset creates an index named `opensearch_dashboards_sample_data_flights`. Each document represents one flight and records its carrier, origin and destination, ticket price, distance, and delay.

OpenSearch Dashboards generates the document IDs and the `timestamp` values when you add the dataset, so those values differ from the ones in this tutorial. All other field values come from a fixed dataset and match.

## Explore the data

Before you query an index, find out what it contains. To count the documents in the index, send the following request:

```json
GET /opensearch_dashboards_sample_data_flights/_count
```
{% include copy-curl.html %}

OpenSearch returns the document count:

```json
{
  "count": 13059,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  }
}
```

To view the field types, request the mappings:

```json
GET /opensearch_dashboards_sample_data_flights/_mapping
```
{% include copy-curl.html %}

The response lists 27 fields. The examples in this tutorial use the following ones.

| Field | Type | Description |
| :--- | :--- | :--- |
| `Carrier` | `keyword` | The airline operating the flight. |
| `OriginCityName` | `keyword` | The city the flight departs from. |
| `DestCityName` | `keyword` | The city the flight arrives in. |
| `DestCountry` | `keyword` | The two-letter country code of the destination. |
| `AvgTicketPrice` | `float` | The average ticket price, in dollars. |
| `FlightDelayMin` | `integer` | The departure delay, in minutes. |
| `Cancelled` | `boolean` | Whether the flight was canceled. |
| `timestamp` | `date` | The departure date and time. |

Every string field in this index is mapped to `keyword`, so all string searches are exact. For full-text search on analyzed `text` fields, see [Search your data]({{site.url}}{{site.baseurl}}/getting-started/search-data/).

To see what a document looks like, run a search that returns one result:

```json
GET /opensearch_dashboards_sample_data_flights/_search
{
  "size": 1
}
```
{% include copy-curl.html %}

The response contains one flight. This flight went from Frankfurt to Sydney and was not delayed, so `FlightDelayMin` is `0` and `FlightDelay` is `false`:

```json
"hits": [
  {
    "_index": "opensearch_dashboards_sample_data_flights",
    "_id": "3_6eY6ABLgrkzSeVlh5V",
    "_score": 1,
    "_source": {
      "FlightNum": "9HY9SWR",
      "DestCountry": "AU",
      "OriginWeather": "Sunny",
      "OriginCityName": "Frankfurt am Main",
      "AvgTicketPrice": 841.2656419677076,
      "DistanceMiles": 10247.856675613455,
      "FlightDelay": false,
      "DestWeather": "Rain",
      "Dest": "Sydney Kingsford Smith International Airport",
      "FlightDelayType": "No Delay",
      "OriginCountry": "DE",
      "dayOfWeek": 0,
      "DistanceKilometers": 16492.32665375846,
      "timestamp": "2026-08-24T00:00:00",
      "DestLocation": {
        "lat": "-33.94609833",
        "lon": "151.177002"
      },
      "DestAirportID": "SYD",
      "Carrier": "OpenSearch Dashboards Airlines",
      "Cancelled": false,
      "FlightTimeMin": 1030.7704158599038,
      "Origin": "Frankfurt am Main Airport",
      "OriginLocation": {
        "lat": "50.033333",
        "lon": "8.570556"
      },
      "DestRegion": "SE-BD",
      "OriginAirportID": "FRA",
      "OriginRegion": "DE-HE",
      "DestCityName": "Sydney",
      "FlightTimeHour": 17.179506930998397,
      "FlightDelayMin": 0
    }
  }
]
```

## Filter results

The following examples set `size` to `0`, which tells OpenSearch to return the number of matching documents without returning the documents themselves. Use this when you want to know how many documents match rather than which ones.

### Match an exact value

To count the flights operated by one carrier, use a `term` query:

```json
GET /opensearch_dashboards_sample_data_flights/_search
{
  "size": 0,
  "query": {
    "term": {
      "Carrier": "OpenSearch-Air"
    }
  }
}
```
{% include copy-curl.html %}

OpenSearch reports the number of matching flights in `hits.total.value`:

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
      "value": 3220,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  }
}
```

### Match a range of values

To count the flights delayed by an hour or more, use a `range` query on `FlightDelayMin`:

```json
GET /opensearch_dashboards_sample_data_flights/_search
{
  "size": 0,
  "query": {
    "range": {
      "FlightDelayMin": {
        "gte": 60
      }
    }
  }
}
```
{% include copy-curl.html %}

The response reports 2,867 matching flights:

```json
{
  "took": 7,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2867,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  }
}
```

### Combine conditions

Real questions combine conditions. To count the flights that one carrier delayed by an hour or more and did not cancel, use a `bool` query:

```json
GET /opensearch_dashboards_sample_data_flights/_search
{
  "size": 0,
  "query": {
    "bool": {
      "filter": [
        { "term": { "Carrier": "OpenSearch-Air" } },
        { "range": { "FlightDelayMin": { "gte": 60 } } }
      ],
      "must_not": [
        { "term": { "Cancelled": true } }
      ]
    }
  }
}
```
{% include copy-curl.html %}

The response reports 625 matching flights:

```json
{
  "took": 4,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 625,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  }
}
```

The `filter` clauses must all match, and the `must_not` clause excludes documents that match it. For more information, see [Boolean queries]({{site.url}}{{site.baseurl}}/query-dsl/compound/bool/).

## Sort results and select fields

By default, OpenSearch returns the 10 highest-scoring documents and the complete source of each one. Because the preceding queries used only filters, every document scored the same, so the order was arbitrary. To choose the order and reduce the response size, add `sort`, `size`, and `_source`.

The following request finds flights to Australia, returns the two most expensive, and includes only four fields from each document:

```json
GET /opensearch_dashboards_sample_data_flights/_search
{
  "size": 2,
  "_source": ["Carrier", "OriginCityName", "DestCityName", "AvgTicketPrice"],
  "query": {
    "term": {
      "DestCountry": "AU"
    }
  },
  "sort": [
    { "AvgTicketPrice": "desc" }
  ]
}
```
{% include copy-curl.html %}

OpenSearch returns the two flights with the highest ticket prices:

```json
{
  "took": 58,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 416,
      "relation": "eq"
    },
    "max_score": null,
    "hits": [
      {
        "_index": "opensearch_dashboards_sample_data_flights",
        "_id": "wf6eY6ABLgrkzSeVlyX-",
        "_score": null,
        "_source": {
          "OriginCityName": "Paris",
          "AvgTicketPrice": 1197.6326773063201,
          "Carrier": "OpenSearch-Air",
          "DestCityName": "Sydney"
        },
        "sort": [
          1197.6327
        ]
      },
      {
        "_index": "opensearch_dashboards_sample_data_flights",
        "_id": "A_6eY6ABLgrkzSeVolFS",
        "_score": null,
        "_source": {
          "OriginCityName": "Billings",
          "AvgTicketPrice": 1191.012703382442,
          "Carrier": "Logstash Airways",
          "DestCityName": "Brisbane"
        },
        "sort": [
          1191.0127
        ]
      }
    ]
  }
}
```

The `hits.total.value` field reports 416 matching flights, and `size` limits the response to 2 of them. Each hit contains a `sort` array with the value that OpenSearch sorted on, and `_score` is `null` because sorting by a field replaces relevance ranking.

## Summarize data using aggregations

The queries so far return documents or count them. An _aggregation_ summarizes many documents into a single result, which is how you answer questions that no individual document contains, such as which carrier is delayed most often.

### Count documents per group

A `terms` aggregation groups documents by the value of a field and counts each group. The following request counts the flights operated by each carrier. Setting `size` to `0` keeps the 13,059 matching documents out of the response, leaving only the summary:

```json
GET /opensearch_dashboards_sample_data_flights/_search
{
  "size": 0,
  "aggs": {
    "flights_per_carrier": {
      "terms": {
        "field": "Carrier"
      }
    }
  }
}
```
{% include copy-curl.html %}

OpenSearch returns one bucket per carrier, ordered by document count:

```json
{
  "took": 6,
  "timed_out": false,
  "terminated_early": true,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 10000,
      "relation": "gte"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "flights_per_carrier": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "Logstash Airways",
          "doc_count": 3331
        },
        {
          "key": "BeatsWest",
          "doc_count": 3274
        },
        {
          "key": "OpenSearch Dashboards Airlines",
          "doc_count": 3234
        },
        {
          "key": "OpenSearch-Air",
          "doc_count": 3220
        }
      ]
    }
  }
}
```

The `hits.total.value` field reports `10000` with a `relation` of `gte` because OpenSearch stops tracking the exact total once the number of matches reaches 10,000. Only the total hit count is approximate. The aggregation still includes every matching document, so the bucket counts add up to all 13,059 flights.

### Calculate a metric for each group

Nest an aggregation inside another one to calculate a metric for every bucket. The following request adds an `avg` aggregation that averages `FlightDelayMin` within each carrier:

```json
GET /opensearch_dashboards_sample_data_flights/_search
{
  "size": 0,
  "aggs": {
    "flights_per_carrier": {
      "terms": {
        "field": "Carrier"
      },
      "aggs": {
        "average_delay": {
          "avg": {
            "field": "FlightDelayMin"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Each bucket now contains the average delay for that carrier. Logstash Airways has the longest average delay, at about 50 minutes:

```json
{
  "took": 2,
  "timed_out": false,
  "terminated_early": true,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 10000,
      "relation": "gte"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "flights_per_carrier": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "Logstash Airways",
          "doc_count": 3331,
          "average_delay": {
            "value": 49.55268688081657
          }
        },
        {
          "key": "BeatsWest",
          "doc_count": 3274,
          "average_delay": {
            "value": 45.957544288332315
          }
        },
        {
          "key": "OpenSearch Dashboards Airlines",
          "doc_count": 3234,
          "average_delay": {
            "value": 46.368274582560296
          }
        },
        {
          "key": "OpenSearch-Air",
          "doc_count": 3220,
          "average_delay": {
            "value": 47.41304347826087
          }
        }
      ]
    }
  }
}
```

### Group documents by time

A `date_histogram` aggregation groups documents into time intervals, which is how you chart data over time. The following request counts flights per week:

```json
GET /opensearch_dashboards_sample_data_flights/_search
{
  "size": 0,
  "aggs": {
    "flights_over_time": {
      "date_histogram": {
        "field": "timestamp",
        "calendar_interval": "week"
      }
    }
  }
}
```
{% include copy-curl.html %}

OpenSearch returns one bucket per week, each with a `key_as_string` field containing the start of the interval. Because OpenSearch Dashboards generates the `timestamp` values when you add the sample data, your intervals begin on the date you added it:

```json
{
  "took": 17,
  "timed_out": false,
  "terminated_early": true,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 10000,
      "relation": "gte"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "flights_over_time": {
      "buckets": [
        {
          "key_as_string": "2026-08-24T00:00:00.000Z",
          "key": 1787529600000,
          "doc_count": 2202
        },
        {
          "key_as_string": "2026-08-31T00:00:00.000Z",
          "key": 1788134400000,
          "doc_count": 2177
        },
        {
          "key_as_string": "2026-09-07T00:00:00.000Z",
          "key": 1788739200000,
          "doc_count": 2142
        },
        {
          "key_as_string": "2026-09-14T00:00:00.000Z",
          "key": 1789344000000,
          "doc_count": 2187
        },
        {
          "key_as_string": "2026-09-21T00:00:00.000Z",
          "key": 1789948800000,
          "doc_count": 2188
        },
        {
          "key_as_string": "2026-09-28T00:00:00.000Z",
          "key": 1790553600000,
          "doc_count": 2163
        }
      ]
    }
  }
}
```

For more information about the available aggregations, see [Aggregations]({{site.url}}{{site.baseurl}}/aggregations/).

## Visualize the data

To explore the data visually in OpenSearch Dashboards, follow the OpenSearch Dashboards getting started documentation starting with [Create an index pattern]({{site.url}}{{site.baseurl}}/dashboards/getting-started/data-setup/#step-2-create-an-index-pattern). 

Each flight records the coordinates of its origin and destination airports in the `OriginLocation` and `DestLocation` fields, so you can plot the flights on a map. For more information, see [Maps application]({{site.url}}{{site.baseurl}}/dashboards/visualize/visualize-app/maps/).

## Next steps

- To learn more about summarizing data, see [Aggregations]({{site.url}}{{site.baseurl}}/aggregations/).
- To explore OpenSearch Dashboards applications, see [Getting started with OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/getting-started/).
- To shut down the cluster when you're finished, see [Stop the cluster]({{site.url}}{{site.baseurl}}/getting-started/quickstart/#stop-the-cluster).
