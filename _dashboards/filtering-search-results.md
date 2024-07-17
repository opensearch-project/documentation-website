---
layout: default
title: Filter results
parent: Searching data
nav_order: 139
---
# Filtering search results in OpenSearch Dashboards

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
- Click on the time frame to update the time selection.
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

OpenSearch Query DSL (Domain Specific Language) allows for more complex and powerful queries. You can combine multiple conditions and use advanced logic to filter data. The DSL queries can be run in the Dev Tools, see the [Running queries in the Dev Tools console](https://opensearch.org/docs/latest/dashboards/dev-tools/run-queries/), in the documentation for more information. Alternatively, DSL queries can also be run in the DSL query bar too. 


### Example of Query DSL filtering

DQL is a filtering language for OpenSearch Dashboards. There are 3 main ways to filter in OSD.

1. DQL or Lucene in the query bar
2. The Filter button which provides both a form to create a new filter and an advanced view to enter Query DSL directly
3. The time range picker

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

