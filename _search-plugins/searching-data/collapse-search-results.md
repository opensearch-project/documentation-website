---
layout: default
title: Collapse results
parent: Searching data
nav_order: 23
redirect_from:
  - /opensearch/search/collapse/
---
# Collapsing search results in OpenSearch

Collapsing search results in OpenSearch allows you to group and return the top documents per group based on a specified field. This is useful for scenarios where you want to avoid returning duplicate documents or need to display only one document per group based on certain criteria. 

Collapsing the results can also be helpful when dealing with large datasets where multiple documents share common field values and you want to avoid redundancy in the search results.


Collapsing the search results returned allows you to:
- Reduce redundancy by preventing duplicate or similar documents from cluttering the search results.
- Improve performance by enhancing query performance by reducing the number of documents returned.
- Allows for better insights by focusing the returned results on unique groups of documents.

## Examples of collapsing search results in OpenSearch Dashboards

To begin collapsing the results in OpenSearch Dashboards, follow these steps:

1. Navigate to the OpenSearch Dashboards UI.
2. In the in the sidebar, see the `Managment` section and click on `Dev Tools`. We will be exploring the `opensearch_dashboards_sample_data_flights` index.
3. Write your DSL query in the dev tools left window (example DSL queries provided in subsequent sections).
4. Highlight the query and click the play button to run the query.
5. The answer is outputted in the right half of the dev tools window.

### Example: collapsing search results by carrier

To collapse search results by the `Carrier` field, ensuring that only the top document for each carrier is returned, you can use the following DSL query:

```json
GET opensearch_dashboards_sample_data_flights/_search
{
  "query": {
    "match_all": {}
  },
  "collapse": {
    "field": "Carrier"
  }
}
```

### Example: collapsing with inner hits

To collapse search results by the `Carrier` field and also include the top 5 documents for each carrier, you can use the following DSL query:

```json
GET opensearch_dashboards_sample_data_flights/_search
{
  "query": {
    "match_all": {}
  },
  "collapse": {
    "field": "Carrier",
    "inner_hits": {
      "name": "top_hits",
      "size": 5
    }
  }
}
```

### Example: collapsing and sorting

To collapse search results by the `Carrier` field, ensuring that only the top document for each carrier is returned based on the highest `AvgTicketPrice`, you can use the following DSL query:

```json
GET opensearch_dashboards_sample_data_flights/_search
{
  "query": {
    "match_all": {}
  },
  "collapse": {
    "field": "Carrier"
  },
  "sort": [
    {
      "AvgTicketPrice": "desc"
    }
  ]
}
```

### Example: collapsing and filtering

To collapse search results by the `Carrier` field, filter flights with an `AvgTicketPrice` between `100` and `500`, and include the top 3 documents for each carrier, you can use the following DSL query:

```json
GET opensearch_dashboards_sample_data_flights/_search
{
  "query": {
    "range": {
      "AvgTicketPrice": {
        "gte": 100,
        "lte": 500
      }
    }
  },
  "collapse": {
    "field": "Carrier",
    "inner_hits": {
      "name": "top_hits",
      "size": 3
    }
  }
}
```

### Example: collapsing and aggregating

To collapse search results by the `Carrier` field and aggregate the average ticket price for each carrier, you can use the following DSL query:

```json
GET opensearch_dashboards_sample_data_flights/_search
{
  "size": 0,
  "query": {
    "match_all": {}
  },
  "collapse": {
    "field": "Carrier"
  },
  "aggs": {
    "avg_price_per_carrier": {
      "terms": {
        "field": "Carrier"
      },
      "aggs": {
        "avg_price": {
          "avg": {
            "field": "AvgTicketPrice"
          }
        }
      }
    }
  }
}

```

Collapsing search results in OpenSearch is a powerful feature for managing large datasets by grouping documents based on specific fields. This helps in reducing redundancy, improving performance, and gaining better insights from your search results. 

By utilizing the collapsing feature effectively, you can streamline your search results and focus on the most relevant information.
