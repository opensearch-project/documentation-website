---
layout: default
title: Filter results
parent: Searching data
nav_order: 21
redirect_from:
  - /opensearch/search/filter/
---
# Filtering search results in OpenSearch

Filtering the search results in OpenSearch allows you to refine the results returned. Specifying criteria to filter the indexes/documents by, allows you to refine the returned results. You can filter the results based on ranges, conditions or specific terms to refine the returned results. This is helpful when you have large datasets and allows you to interpret and understand larger datasets more easily.

Filtering allows you to:
- Improve search accuracy by reducing unneeded information on a case by case basis to allow accurate interpretation of results. 
- Enhance performance by reducing the amount of data necessary to process and return when querying. Improving query performance. 
- Categorised search by allowing data to be returned in categories which allows you to explore the data in a structured manner.

## Filtering with OpenSearch Dashboards

To begin filtering in OpenSearch Dashboards, follow these steps:

1. Navigate to the OpenSearch Dashboards UI.
2. Click on `Discover` in the sidebar.
3. Choose `opensearch_dashboards_sample_data_flights` from the index pattern selector.

### Example: Filter by destination airport

To filter flights arriving at "Zurich Airport":

**Add a filter:**
- Click on the `Add filter` button.
- In the filter field, select `Dest`.
- In the operator field, select `is`.
- In the value field, type `Zurich Airport`.
- Click `Save`.

This will display only the flights arriving at Zurich Airport.

### Example: Filter by flight delay

To filter flights that have been cancelled in the last 100 days:
- Click on the timeframe to update the time selection.
- Under the 'Relative' time tab.
- Change the unit to '1'.
- From the dropdown select 'Days ago'.
- The data shown is now from the Last 100 days.

**Add a filter:**
- Click on the `Add filter` button.
- In the filter field, select `Cancelled`.
- In the operator field, select `is`.
- In the value field, type `true`.
- Click `Save`.

This will display only the flights that have been cancelled with a destination of Zurich Airport in the last 100 days.

## Using Query DSL for advanced filtering

OpenSearch Query DSL (Domain Specific Language) allows for more complex and powerful queries. You can combine multiple conditions and use advanced logic to filter data.

### Example of Query DSL filtering

To use Query DSL, you need to define your queries in JSON format.

To begin filtering via DSL in OpenSearch Dashboards, follow these steps:

1. Navigate to the OpenSearch Dashboards UI.
2. Click on `Dev Tools` in the sidebar.
3. Write your DSL query in the dev tools left window.
4. Highlight the query and click the play button to run the query.
5. The answer is outputted in the right half of the dev tools window.

### Example: Filter flights with delay greater than 60 minutes

```json
GET opensearch_dashboards_sample_data_flights/_search
{
  "query": {
    "range": {
      "FlightDelayMin": {
        "gt": 60
      }
    }
  }
}
```

This DSL query will retreive the instances where the flight delay is greater than 60 minutes.

### Example: Combined filter with Query DSL

To filter flights operated by "Logstash Airways", with an average ticket price (AvgTicketPrice) between 0 and 1000, and destination country (DestCountry) as Italy, you can use the following DSL query:

```json
GET opensearch_dashboards_sample_data_flights/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "Carrier": "Logstash Airways"
          }
        },
        {
          "range": {
            "AvgTicketPrice": {
              "gte": 0,
              "lte": 1000
            }
          }
        },
        {
          "term": {
            "DestCountry": "IT"
          }
        }
      ]
    }
  }
}
```

This query uses a boolean must clause to combine three conditions:

1. The carrier is Logstash Airways.
2. The average price ticket is between 0 and 1000 dollars.
3. The destination country is Italy.

By following these steps, you can filter and examine large data sets with ease, based off the relevant queries and criteria for your investigations. 

