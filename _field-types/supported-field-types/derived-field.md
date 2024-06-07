# Full Markdown content for the Derived field type documentation without the migration section and migration reference

markdown_content = """
---
layout: default
title: Derived
nav_order: 62
has_children: false
parent: Advanced field types
grand_parent: Supported field types
redirect_from:
- /opensearch/supported-field-types/derived/
- /field-types/derived/
---

# Derived field type

Derived fields enable users to create new fields dynamically by executing scripts on existing fields retrieved from the `_source` field, which contains the original document, or from a field's doc values for faster retrieval. Once defined, either in the index mapping or within a search request, these fields can be utilized like regular fields in query definitions.

## When to Use Derived Fields
Derived fields prioritize storage efficiency and offer flexibility in field manipulations, albeit at the cost of query performance since they are computed at query time. They are particularly useful in scenarios requiring real-time data transformation, such as:

- **Log Analysis**: Extracting timestamps and log levels from log messages.
- **Performance Metrics**: Calculating response times from start and end timestamps.
- **Security Analytics**: Real-time IP geolocation and user-agent parsing for threat detection.
- **Experimental Use Cases**: Testing new data transformations, creating temporary fields for A/B testing, or generating ad-hoc reports without altering mappings or reindexing.

Despite the potential performance impact of query-time computations, the flexibility and storage efficiency of derived fields make them a valuable tool for these applications.

## Current Limitations
Currently, derived fields have the following limitations:

- **Aggregation, Scoring, and Sorting**: Not supported yet.
- **Dashboard Support**: These fields are not displayed in the list of available fields on dashboards. However, they can still be used in regular queries like standard fields.
- **Chained Derived Fields**: One derived field cannot be used to define another derived field.

These limitations are recognized, and there are plans to address them in future releases.

# Getting Started

## Prerequisites
- **Enable `_source` or Doc Values**: Ensure that either the `_source` field or doc values are enabled for the fields used in your script.
- **Feature Control**: The derived fields feature is enabled by default. You can control it using the following settings:
    - **Index Level**: Use the `index.query.derived_field.enabled` setting.
    - **Cluster Level**: Use the `search.derived_field.enabled` setting.
      Both settings are dynamic, meaning they can be changed without requiring reindexing or node restarts.
- **Performance Considerations**: Evaluate the performance implications to ensure this feature meets your scale requirements before using it.[siteurl]


## Definition
Derived fields can be defined in index mappings or directly within the search request. We will use the following documents for all examples:

```json
PUT logs
{
  "mappings": {
    "properties": {
      "request": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "client_ip": {
        "type": "keyword"
      }
    }
  }
}
```
{% include copy-curl.html %}

```json
PUT logs
{
  "mappings": {
    "properties": {
      "request": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "client_ip": {
        "type": "keyword"
      }
    }
  }
}
```
{% include copy-curl.html %}

```json
POST _bulk
{ "index" : { "_index" : "logs", "_id" : "1" } }
{ "request": "894030400 GET /english/images/france98_venues.gif HTTP/1.0 200 778", "clientip": "61.177.2.0" }
{ "index" : { "_index" : "logs", "_id" : "2" } }
{ "request": "894140400 GET /french/playing/mascot/mascot.html HTTP/1.1 200 5474", "clientip": "185.92.2.0" }
{ "index" : { "_index" : "logs", "_id" : "3" } }
{ "request": "894250400 POST /english/venues/images/venue_header.gif HTTP/1.0 200 711", "clientip": "61.177.2.0" }
{ "index" : { "_index" : "logs", "_id" : "4" } }
{ "request": "894360400 POST /images/home_fr_button.gif HTTP/1.1 200 2140", "clientip": "129.178.2.0" }
{ "index" : { "_index" : "logs", "_id" : "5" } }
{ "request": "894470400 DELETE /images/102384s.gif HTTP/1.0 200 785", "clientip": "227.177.2.0" }
```
{% include copy-curl.html %}

## Deriving Fields with Index Mapping Approach

To derive fields `timestamp`, `method`, `url`, `status`, and `size` from the indexed field `request` in the `logs` index, update the mappings as follows:

```json
PUT /logs/_mapping
{
  "derived": {
    "timestamp": {
      "type": "date",
      "script": {
        "source": """
        emit(Long.parseLong(doc["request.keyword"].value.splitOnToken(" ")[0]))
        """
      }
    },
    "method": {
      "type": "keyword",
      "script": {
        "source": """
        emit(doc["request.keyword"].value.splitOnToken(" ")[1])
        """
      }
    },
    "url": {
      "type": "text",
      "script": {
        "source": """
        emit(doc["request.keyword"].value.splitOnToken(" ")[2])
        """
      }
    },
    "status": {
      "type": "keyword",
      "script": {
        "source": """
        emit(doc["request.keyword"].value.splitOnToken(" ")[4])
        """
      }
    },
    "size": {
      "type": "long",
      "script": {
        "source": """
        emit(Long.parseLong(doc["request.keyword"].value.splitOnToken(" ")[5]))
        """
      }
    }
  }
}
```
{% include copy-curl.html %}

### Supported Parameters

| Parameter          | Description                                                                                                                                                                                                                                                                                                                                                                                          |
|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `type`            | Type of the derived field. Supported types include `boolean`, `date`, `geo_point`, `ip`, `keyword`, `text`, `long`, `double`, `float`, and `object`.                                                                                                                                                                                                                                             |
| `script`          | The script associated with derived fields. Any value emitted from the script needs to be emitted using `emit()`. The type of the emitted value must match the `type` of the derived field. Scripts have access to both `doc_values` and `_source` document if enabled. The doc value of a field can be accessed using `doc['field_name'].value`, and the source can be accessed using `params._source["field_name"]`. |
| `format`          | The format for parsing dates. Only applicable when the type is `date`. The default format is `strict_date_time_no_millis`, `strict_date_optional_time`, or `epoch_millis`.                                                                                                                                                               |
| `ignore_malformed`| A Boolean value that specifies whether to ignore malformed values and not throw an exception during query execution on derived fields.                                                                                                                                                                                                 |
| `prefilter_field` | An indexed text field provided to boost the performance of derived fields. It adds the same query as a filter on this indexed field first and uses only matching documents on derived fields.                                                                                                                                              |

All parameters are dynamic and can be modified without the need to reindex.

#### Emitting Values in Script

The `emit()` function is available only within the derived field script context. It is used to emit one or more values (for a multi-valued field) from the script for a given document on which the script runs.

Here is the emit format and support for multi-valued fields for different types:

| Type      | Emit Format                     | Multi-valued |
|-----------|--------------------------------|--------------|
| `date`    | `emit(long timeInMilis)`       | Yes          |
| `geo_point`| `emit(double, double)`         | Yes          |
| `ip`      | `emit(String)`                  | Yes          |
| `keyword` | `emit(String)`                  | Yes          |
| `text`    | `emit(String)`                  | Yes          |
| `long`    | `emit(long)`                    | Yes          |
| `double`  | `emit(double)`                  | Yes          |
| `float`   | `emit(float)`                   | Yes          |
| `boolean` | `emit(boolean)`                 | No           |
| `object`  | `emit(String)` (valid JSON)     | Yes          |

In case of a mismatch between the `type` of the derived field and its emitted value, it will result in an `IllegalArgumentException`, and the search request will fail. However, if `ignore_malformed` is set, the document for which the failure occurred will be skipped, and the search request will not fail.

**Note:** There is a hard limit of `1 MB` on the size of emitted values per document.

## Search on Derived Fields

Searching on derived fields follows the same syntax as for regular fields. The following examples illustrate the use of derived fields defined in search requests:

```json
POST /logs/_search
{
  "query": {
    "range": {
      "timestamp": {
        "gte": "1970-01-11T08:20:30.400Z",   
        "lte": "1970-01-11T08:26:00.400Z"
      }
    }
  },
  "fields": ["timestamp"]
}
```
{% include copy-curl.html %}

Since the `timestamp` field is defined as a `date` type in the derived field definition, you can also specify the desired date format in the search request using `format` parameter.

```json
POST /logs/_search
{
  "query": {
    "range": {
      "timestamp": {
        "gte": "1970-01-11T08:20:30.400Z",   
        "lte": "1970-01-11T08:26:00.400Z"
      }
    }
  },
  "fields": ["timestamp"]
}
```
{% include copy-curl.html %}

### Defining Mappings in Search request
You can also define derived fields directly in a search request and query on them in conjunction with regular indexed fields. Here's an example:

```json
POST /logs/_search
{
  "derived": {
    "url": {
      "type": "text",
      "script": {
        "source": """
        emit(doc["request"].value.splitOnToken(" ")[2])
        """
      }
    },
    "status": {
      "type": "keyword",
      "script": {
        "source": """
        emit(doc["request"].value.splitOnToken(" ")[4])
        """
      }
    }
  },
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "clientip": "61.177.2.0"
          }
        },
        {
          "match": {
            "url": "images"
          }
        },
        {
          "term": {
            "status": "200"
          }
        }
      ]
    }
  },
  "fields": ["request", "clientip", "url", "status"]
}
```
{% include copy-curl.html %}

**Note:** Derived fields use the default analyzer set in the index analysis settings during searches. You can override the default analyzer or specify a search analyzer in the search request, similar to how it's done for regular fields as described here: [siteurl]
**Note:** TWhen both index mapping and search definition are present for a field, the search definition takes precedence.

**Retrieving Fields**
Fields can be retrieved using the `fields` parameter in the search request, similar to regular fields as shown in the examples above. Wildcards can also be used to retrieve all derived fields that match a given pattern.


### Highlight
For derived fields of type `text` where highlighting makes sense, the currently supported highlighter is the Unified Highlighter. (https://opensearch.org/docs/latest/search-plugins/searching-data/highlight/#the-unified-highlighter) [siteurl]

```json
POST /logs/_search
{
  "derived": {
    "url": {
      "type": "text",
      "script": {
        "source": """
        emit(doc["request"].value.splitOnToken(" " )[2])
        """
      }
    }
  },
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "clientip": "61.177.2.0"
          }
        },
        {
          "match": {
            "url": "images"
          }
        }
      ]
    }
  },
  "fields": ["request", "clientip", "url"],
  "highlight": {
    "fields": {
      "url": {}
    }
  }
}
```
{% include copy-curl.html %}

## Performance
Derived fields are not indexed and are computed on-the-fly by retrieving values from _source field or doc values. Consequently, they can be slow to execute. To improve performance:

- Prune the search space by adding query filters on indexed fields in conjunction with derived fields.
- Use doc values in the script wherever available for faster access compared to `_source`.
- Consider using `prefilter_field` to automatically prune the search space without explicit filters in the search request.

### `prefilter_field`
This technique helps prune the search space automatically without adding explicit filters in the search request. It implicitly adds a filter on the specified indexed field (`prefilter_field`) when constructing the query. `prefilter_field ` must be of text family types (`text`, `match_only_text`).

For example, lets update the mapping for derived field `method` with `"prefilter_field": "request"`: 

```json
PUT /logs/_mapping
{
  "derived": {
    "method": {
      "type": "keyword",
      "script": {
        "source": """
        emit(doc["request.keyword"].value.splitOnToken(" ")[1])
        """
      },
      "prefilter_field": "request"
    }
  }
}
```
{% include copy-curl.html %}

Now, a search with a query on the `method` derived field will implicitly add a filter on the `request` field:

```json
POST /logs/_search
{
  "profile": true,
  "query": {
    "term": {
      "method": {
        "value": "GET"
      }
    }
  },
  "fields": ["method"]
}
```
{% include copy-curl.html %}

The resulting query includes the filter on prefiltered field:
```json
"#request:GET #DerivedFieldQuery (Query: [ method:GET])"
```

**Note:** `profile` option can be used to analyze the performance of derived fields as well. 

## Object type
