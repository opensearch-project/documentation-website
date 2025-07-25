---
layout: default
title: Derived
nav_order: 62
has_children: false
parent: Supported field types
canonical_url: https://docs.opensearch.org/latest/field-types/supported-field-types/derived/
---

# Derived field type
**Introduced 2.15**
{: .label .label-purple }

Derived fields allow you to create new fields dynamically by executing scripts on existing fields. The existing fields can be either retrieved from the `_source` field, which contains the original document, or from a field's doc values. Once you define a derived field either in an index mapping or within a search request, you can use the field in a query in the same way you would use a regular field.

## When to use derived fields

Derived fields offer flexibility in field manipulation and prioritize storage efficiency. However,
because they are computed at query time, they can reduce query performance. Derived fields are particularly useful in scenarios requiring real-time data transformation, such as:

- **Log analysis**: Extracting timestamps and log levels from log messages.
- **Performance metrics**: Calculating response times from start and end timestamps.
- **Security analytics**: Real-time IP geolocation and user-agent parsing for threat detection.
- **Experimental use cases**: Testing new data transformations, creating temporary fields for A/B testing, or generating one-time reports without altering mappings or reindexing data.

Despite the potential performance impact of query-time computations, the flexibility and storage efficiency of derived fields make them a valuable tool for these applications.

## Current limitations

Currently, derived fields have the following limitations:

- **Aggregation, scoring, and sorting**: Not yet supported.
- **Dashboard support**: These fields are not displayed in the list of available fields in OpenSearch Dashboards. However, you can still use them for filtering if you know the derived field name.
- **Chained derived fields**: One derived field cannot be used to define another derived field.
- **Join field type**: Derived fields are not supported for the [join field type]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/join/).
- **Concurrent segment search**: Derived fields are not supported for [concurrent segment search]({{site.url}}{{site.baseurl}}/search-plugins/concurrent-segment-search/).

We are planning to address these limitations in future versions.

## Prerequisites

Before using a derived field, be sure to satisfy the following prerequisites:

- **Enable `_source` or `doc_values`**: Ensure that either the `_source` field or doc values is enabled for the fields used in your script.
- **Enable expensive queries**: Ensure that [`search.allow_expensive_queries`]({{site.url}}{{site.baseurl}}/query-dsl/index/#expensive-queries) is set to `true`.
- **Feature control**: Derived fields are enabled by default. You can enable or disable derived fields by using the following settings:
    - **Index level**: Update the `index.query.derived_field.enabled` setting.
    - **Cluster level**: Update the `search.derived_field.enabled` setting.
    Both settings are dynamic, so they can be changed without reindexing or node restarts.
- **Performance considerations**: Before using derived fields, evaluate the [performance implications](#performance) to ensure that derived fields meet your scale requirements.

## Defining derived fields

You can define derived fields [in index mappings](#defining-derived-fields-in-index-mappings) or [directly within a search request](#defining-and-searching-derived-fields-in-a-search-request). 

## Example setup

To try the examples on this page, first create the following `logs` index:

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
      "clientip": {
        "type": "keyword"
      }
    }
  }
}
```
{% include copy-curl.html %}

Add sample documents to the index:

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

## Defining derived fields in index mappings

To derive the `timestamp`, `method`, and `size` fields from the `request` field indexed in the `logs` index, configure the following mappings:

```json
PUT /logs/_mapping
{
  "derived": {
    "timestamp": {
      "type": "date",
      "format": "MM/dd/yyyy",
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

Note that the `timestamp` field has an additional `format` parameter that specifies the format in which to display `date` fields. If you don't include a `format` parameter, then the format defaults to `strict_date_time_no_millis`. For more information about supported date formats, see [Parameters](#parameters).

## Parameters

The following table lists the parameters accepted by `derived` field types. All parameters are dynamic and can be modified without reindexing documents.

| Parameter | Required/Optional | Description | 
| :--- | :--- | :--- |
| `type` | Required | The type of the derived field. Supported types are `boolean`, `date`, `geo_point`, `ip`, `keyword`, `text`, `long`, `double`, `float`, and `object`. |
| `script` | Required | The script associated with the derived field. Any value emitted from the script must be emitted using `emit()`. The type of the emitted value must match the `type` of the derived field. Scripts have access to both the `doc_values` and `_source` fields if those are enabled. The doc value of a field can be accessed using `doc['field_name'].value`, and the source can be accessed using `params._source["field_name"]`. |
| `format` | Optional | The format used for parsing dates. Only applicable to `date` fields. Valid values are `strict_date_time_no_millis`, `strict_date_optional_time`, and `epoch_millis`. For more information, see [Formats]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/date/#formats).|
| `ignore_malformed`| Optional | A Boolean value that specifies whether to ignore malformed values when running a query on a derived field. Default value is `false` (throw an exception when encountering malformed values). |
| `prefilter_field` | Optional | An indexed text field provided to boost the performance of derived fields. Specifies an existing indexed field on which to filter prior to filtering on the derived field. For more information, see [Prefilter field](#prefilter-field). |

## Emitting values in scripts

The `emit()` function is available only within the derived field script context. It is used to emit one or multiple (for a multi-valued field) script values for a document on which the script runs.

The following table lists the `emit()` function formats for the supported field types.

| Type      | Emit format                      | Multi-valued fields supported|
|-----------|----------------------------------|--------------|
| `boolean` | `emit(boolean)`                  | No           |
| `double`  | `emit(double)`                   | Yes          |
| `date`    | `emit(long timeInMilis)`         | Yes          |
| `float`   | `emit(float)`                    | Yes          |
| `geo_point`| `emit(double lat, double lon)`   | Yes          |
| `ip`      | `emit(String ip)`                | Yes          |
| `keyword` | `emit(String)`                   | Yes          |
| `long`    | `emit(long)`                     | Yes          |
| `object`  | `emit(String json)` (valid JSON) | Yes          |
| `text`    | `emit(String)`                   | Yes          |

By default, a type mismatch between a derived field and its emitted value will result in the search request failing with an error. If `ignore_malformed` is set to `true`, then the failing document is skipped and the search request succeeds.
{: .note}

The size limit of the emitted values is 1 MB per document.
{: .important}

## Searching derived fields defined in index mappings

To search derived fields, use the same syntax as when searching regular fields. For example, the following request searches for documents with derived `timestamp` field in the specified range:

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

The response contains the matching documents:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 315,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "logs",
        "_id": "1",
        "_score": 1,
        "_source": {
          "request": "894030400 GET /english/images/france98_venues.gif HTTP/1.0 200 778",
          "clientip": "61.177.2.0"
        },
        "fields": {
          "timestamp": [
            "1970-01-11T08:20:30.400Z"
          ]
        }
      },
      {
        "_index": "logs",
        "_id": "2",
        "_score": 1,
        "_source": {
          "request": "894140400 GET /french/playing/mascot/mascot.html HTTP/1.1 200 5474",
          "clientip": "185.92.2.0"
        },
        "fields": {
          "timestamp": [
            "1970-01-11T08:22:20.400Z"
          ]
        }
      },
      {
        "_index": "logs",
        "_id": "3",
        "_score": 1,
        "_source": {
          "request": "894250400 POST /english/venues/images/venue_header.gif HTTP/1.0 200 711",
          "clientip": "61.177.2.0"
        },
        "fields": {
          "timestamp": [
            "1970-01-11T08:24:10.400Z"
          ]
        }
      },
      {
        "_index": "logs",
        "_id": "4",
        "_score": 1,
        "_source": {
          "request": "894360400 POST /images/home_fr_button.gif HTTP/1.1 200 2140",
          "clientip": "129.178.2.0"
        },
        "fields": {
          "timestamp": [
            "1970-01-11T08:26:00.400Z"
          ]
        }
      }
    ]
  }
}
```
</details>

## Defining and searching derived fields in a search request

You can also define derived fields directly in a search request and query them along with regular indexed fields. For example, the following request creates the `url` and `status` derived fields and searches those fields along with the regular `request` and `clientip` fields:

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

The response contains the matching documents:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 6,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 2.8754687,
    "hits": [
      {
        "_index": "logs",
        "_id": "1",
        "_score": 2.8754687,
        "_source": {
          "request": "894030400 GET /english/images/france98_venues.gif HTTP/1.0 200 778",
          "clientip": "61.177.2.0"
        },
        "fields": {
          "request": [
            "894030400 GET /english/images/france98_venues.gif HTTP/1.0 200 778"
          ],
          "clientip": [
            "61.177.2.0"
          ],
          "url": [
            "/english/images/france98_venues.gif"
          ],
          "status": [
            "200"
          ]
        }
      },
      {
        "_index": "logs",
        "_id": "3",
        "_score": 2.8754687,
        "_source": {
          "request": "894250400 POST /english/venues/images/venue_header.gif HTTP/1.0 200 711",
          "clientip": "61.177.2.0"
        },
        "fields": {
          "request": [
            "894250400 POST /english/venues/images/venue_header.gif HTTP/1.0 200 711"
          ],
          "clientip": [
            "61.177.2.0"
          ],
          "url": [
            "/english/venues/images/venue_header.gif"
          ],
          "status": [
            "200"
          ]
        }
      }
    ]
  }
}
```
</details>

Derived fields use the default analyzer specified in the index analysis settings during search. You can override the default analyzer or specify a search analyzer within a search request in the same way as with regular fields. For more information, see [Analyzers]({{site.url}}{{site.baseurl}}/analyzers/).
{: .note}

When both an index mapping and a search definition are present for a field, the search definition takes precedence.
{: .note}

### Retrieving fields

You can retrieve derived fields using the `fields` parameter in the search request in the same way as with regular fields, as shown in the preceding examples. You can also use wildcards to retrieve all derived fields that match a given pattern.

### Highlighting

Derived fields of type `text` support highlighting using the [unified highlighter]({{site.url}}{{site.baseurl}}/opensearch/search/highlight#the-unified-highlighter). For example, the following request specifies to highlight the derived `url` field:

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

The response specifies highlighting in the `url` field:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 45,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 1.8754687,
    "hits": [
      {
        "_index": "logs",
        "_id": "1",
        "_score": 1.8754687,
        "_source": {
          "request": "894030400 GET /english/images/france98_venues.gif HTTP/1.0 200 778",
          "clientip": "61.177.2.0"
        },
        "fields": {
          "request": [
            "894030400 GET /english/images/france98_venues.gif HTTP/1.0 200 778"
          ],
          "clientip": [
            "61.177.2.0"
          ],
          "url": [
            "/english/images/france98_venues.gif"
          ]
        },
        "highlight": {
          "url": [
            "/english/<em>images</em>/france98_venues.gif"
          ]
        }
      },
      {
        "_index": "logs",
        "_id": "3",
        "_score": 1.8754687,
        "_source": {
          "request": "894250400 POST /english/venues/images/venue_header.gif HTTP/1.0 200 711",
          "clientip": "61.177.2.0"
        },
        "fields": {
          "request": [
            "894250400 POST /english/venues/images/venue_header.gif HTTP/1.0 200 711"
          ],
          "clientip": [
            "61.177.2.0"
          ],
          "url": [
            "/english/venues/images/venue_header.gif"
          ]
        },
        "highlight": {
          "url": [
            "/english/venues/<em>images</em>/venue_header.gif"
          ]
        }
      }
    ]
  }
}
```
</details>

## Performance

Derived fields are not indexed but are computed dynamically by retrieving values from the `_source` field or doc values. Thus, they run more slowly. To improve performance, try the following:

- Prune the search space by adding query filters on indexed fields in conjunction with derived fields.
- Use doc values instead of `_source` in the script for faster access, whenever applicable.
- Consider using a [`prefilter_field`](#prefilter-field) to automatically prune the search space without explicit filters in the search request.

### Prefilter field

Specifying a prefilter field helps to prune the search space without adding explicit filters in the search request. The prefilter field specifies an existing indexed field (`prefilter_field`) on which to filter automatically when constructing the query. The `prefilter_field` must be a text field (either [`text`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/text/) or [`match_only_text`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/match-only-text/)).

For example, you can add a `prefilter_field` to the `method` derived field. Update the index mapping, specifying to prefilter on the `request` field: 

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

Now search using a query on the `method` derived field:

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

OpenSearch automatically adds a filter on the `request` field to your query:

```json
"#request:GET #DerivedFieldQuery (Query: [ method:GET])"
```

You can use the `profile` option to analyze derived field performance, as shown in the preceding example.
{: .tip} 

## Derived object fields

A script can emit a valid JSON object so that you can query subfields without indexing them, in the same way as with regular fields. This is useful for large JSON objects that require occasional searches on some subfields. In this case, indexing the subfields is expensive, while defining derived fields for each subfield also adds a lot of resource overhead. If you don't [explicitly provide the subfield type](#explicit-subfield-type), then the subfield type is [inferred](#inferred-subfield-type).

For example, the following request defines a `derived_request_object` derived field as an `object` type:

```json
PUT logs_object
{
  "mappings": {
    "properties": {
      "request_object": { "type": "text" }
    },
    "derived": {
      "derived_request_object": {
        "type": "object",
        "script": {
          "source": "emit(params._source[\"request_object\"])"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Consider the following documents, in which the `request_object` is a string representation of a JSON object:

```json
POST _bulk
{ "index" : { "_index" : "logs_object", "_id" : "1" } }
{ "request_object": "{\"@timestamp\": 894030400, \"clientip\":\"61.177.2.0\", \"request\": \"GET /english/venues/images/venue_header.gif HTTP/1.0\", \"status\": 200, \"size\": 711}" }
{ "index" : { "_index" : "logs_object", "_id" : "2" } }
{ "request_object": "{\"@timestamp\": 894140400, \"clientip\":\"129.178.2.0\", \"request\": \"GET /images/home_fr_button.gif HTTP/1.1\", \"status\": 200, \"size\": 2140}" }
{ "index" : { "_index" : "logs_object", "_id" : "3" } }
{ "request_object": "{\"@timestamp\": 894240400, \"clientip\":\"227.177.2.0\", \"request\": \"GET /images/102384s.gif HTTP/1.0\", \"status\": 400, \"size\": 785}" }
{ "index" : { "_index" : "logs_object", "_id" : "4" } }
{ "request_object": "{\"@timestamp\": 894340400, \"clientip\":\"61.177.2.0\", \"request\": \"GET /english/images/venue_bu_city_on.gif HTTP/1.0\", \"status\": 400, \"size\": 1397}\n" }
{ "index" : { "_index" : "logs_object", "_id" : "5" } }
{ "request_object": "{\"@timestamp\": 894440400, \"clientip\":\"132.176.2.0\", \"request\": \"GET /french/news/11354.htm HTTP/1.0\", \"status\": 200, \"size\": 3460, \"is_active\": true}" }
```
{% include copy-curl.html %}

The following query searches the `@timestamp` subfield of the `derived_request_object`:

```json
POST /logs_object/_search
{
  "query": {
    "range": {
      "derived_request_object.@timestamp": {
        "gte": "894030400",   
        "lte": "894140400"
      }
    }
  },
  "fields": ["derived_request_object.@timestamp"]
}
```
{% include copy-curl.html %}

The response contains the matching documents:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 26,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "logs_object",
        "_id": "1",
        "_score": 1,
        "_source": {
          "request_object": """{"@timestamp": 894030400, "clientip":"61.177.2.0", "request": "GET /english/venues/images/venue_header.gif HTTP/1.0", "status": 200, "size": 711}"""
        },
        "fields": {
          "derived_request_object.@timestamp": [
            894030400
          ]
        }
      },
      {
        "_index": "logs_object",
        "_id": "2",
        "_score": 1,
        "_source": {
          "request_object": """{"@timestamp": 894140400, "clientip":"129.178.2.0", "request": "GET /images/home_fr_button.gif HTTP/1.1", "status": 200, "size": 2140}"""
        },
        "fields": {
          "derived_request_object.@timestamp": [
            894140400
          ]
        }
      }
    ]
  }
}
```

</details>

You can also specify to highlight a derived object field:

```json
POST /logs_object/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "derived_request_object.clientip": "61.177.2.0"
          }
        },
        {
          "match": {
            "derived_request_object.request": "images"
          }
        }
      ]
    }
  },
  "fields": ["derived_request_object.*"],
  "highlight": {
    "fields": {
      "derived_request_object.request": {}
    }
  }
}
```
{% include copy-curl.html %}

The response adds highlighting to the `derived_request_object.request` field:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 5,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 2,
    "hits": [
      {
        "_index": "logs_object",
        "_id": "1",
        "_score": 2,
        "_source": {
          "request_object": """{"@timestamp": 894030400, "clientip":"61.177.2.0", "request": "GET /english/venues/images/venue_header.gif HTTP/1.0", "status": 200, "size": 711}"""
        },
        "fields": {
          "derived_request_object.request": [
            "GET /english/venues/images/venue_header.gif HTTP/1.0"
          ],
          "derived_request_object.clientip": [
            "61.177.2.0"
          ]
        },
        "highlight": {
          "derived_request_object.request": [
            "GET /english/venues/<em>images</em>/venue_header.gif HTTP/1.0"
          ]
        }
      },
      {
        "_index": "logs_object",
        "_id": "4",
        "_score": 2,
        "_source": {
          "request_object": """{"@timestamp": 894340400, "clientip":"61.177.2.0", "request": "GET /english/images/venue_bu_city_on.gif HTTP/1.0", "status": 400, "size": 1397}
"""
        },
        "fields": {
          "derived_request_object.request": [
            "GET /english/images/venue_bu_city_on.gif HTTP/1.0"
          ],
          "derived_request_object.clientip": [
            "61.177.2.0"
          ]
        },
        "highlight": {
          "derived_request_object.request": [
            "GET /english/<em>images</em>/venue_bu_city_on.gif HTTP/1.0"
          ]
        }
      }
    ]
  }
}
```

</details>

### Inferred subfield type 

Type inference is based on the same logic as [Dynamic mapping]({{site.url}}{{site.baseurl}}/opensearch/mappings#dynamic-mapping). Instead of inferring the subfield type from the first document, a random sample of documents is used to infer the type. If the subfield isn't found in any documents from the random sample, type inference fails and logs a warning. For subfields that seldom occur in documents, consider defining the explicit field type. Using dynamic type inference for such subfields may result in a query returning no results, like for a missing field. 

### Explicit subfield type

To define the explicit subfield type, provide the `type` parameter in the `properties` object. In the following example, the `derived_logs_object.is_active` field is defined as `boolean`. Because this field is only present in one of the documents, its type inference might fail, so it's important to define the explicit type:

```json
POST /logs_object/_search
{
  "derived": {
    "derived_request_object": {
      "type": "object",
      "script": {
        "source": "emit(params._source[\"request_object\"])"
      },
      "properties": {
        "is_active": "boolean"
      }
    }
  },
  "query": {
    "term": {
      "derived_request_object.is_active": true
    }
  },
  "fields": ["derived_request_object.is_active"]
}
```
{% include copy-curl.html %}

The response contains the matching documents:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

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
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "logs_object",
        "_id": "5",
        "_score": 1,
        "_source": {
          "request_object": """{"@timestamp": 894440400, "clientip":"132.176.2.0", "request": "GET /french/news/11354.htm HTTP/1.0", "status": 200, "size": 3460, "is_active": true}"""
        },
        "fields": {
          "derived_request_object.is_active": [
            true
          ]
        }
      }
    ]
  }
}
```

</details>
