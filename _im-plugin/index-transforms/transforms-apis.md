---
layout: default
title: Transforms APIs
nav_order: 10
parent: Index transforms
has_toc: true
---

# Transforms APIs

Aside from using OpenSearch Dashboards, you can also use the REST API to create, start, stop, and complete other operations relative to transform jobs.

The examples on this page use the OpenSearch Dashboards sample e-commerce data. To add it, go to the OpenSearch Dashboards home page, select **Try our sample data**, and then select **Add data** in **Sample eCommerce orders**.

#### Table of contents
- TOC
{:toc}

## Create a transform job
**Introduced 1.0**
{: .label .label-purple }

Creates a transform job. 

### Endpoints

```json
PUT _plugins/_transform/{transform_id}
```

### Path parameters

Parameter | Data type | Description
:--- | :--- | :---
`transform_id` | String | Transform ID |

### Request body fields

You can specify the following options in the HTTP request body:

Option | Data type | Description | Required
:--- | :--- | :--- | :---
`enabled` | Boolean | Whether the transform job is enabled at creation. Default is `true`. | No
`continuous` | Boolean | Specifies whether the transform job should be continuous. Continuous jobs execute every time they are scheduled according to the `schedule` field and run based off of newly transformed buckets as well as any new data added to source indexes. Non-continuous jobs execute only once. Default is `false`. | No
`schedule` | Object | The schedule for the transform job. Contains an `interval` object with the fields `period`, `unit`, and `start_time`. | Yes
`description` | String | Describes the transform job. | Yes
`source_index` | String | The source index containing the data to be transformed. | Yes
`target_index` | String | The target index the newly transformed data is added to. You can create a new index or update an existing one. | Yes
`data_selection_query` | Object | The query DSL to use to filter a subset of the source index for the transform job. If you omit this field, the job transforms every document in the source index. For more information, see [Query DSL]({{site.url}}{{site.baseurl}}/query-dsl/). | No
`page_size` | Integer | The number of buckets IM processes and indexes concurrently. A higher number results in better performance, but it requires more memory. If your machine runs out of memory, Index Management (IM) automatically adjusts this field and retries until the operation succeeds. | Yes
`groups` | Array | Specifies the grouping(s) to use in the transform job. Each entry names a `source_field` in the source index and the `target_field` to write it to. Supported groups are `terms`, `histogram`, and `date_histogram`. A job must define at least one group. For more information, see [Bucket aggregations]({{site.url}}{{site.baseurl}}/aggregations/bucket/index/). | Yes
`aggregations` | Object | The aggregations to use in the transform job. Supported aggregations are `sum`, `max`, `min`, `value_count`, `avg`, `scripted_metric`, and `percentiles`. For more information, see [Metric aggregations]({{site.url}}{{site.baseurl}}/aggregations/metric/index/). | No

#### Example request

The following request creates a transform job with the id `sample`:

```json
PUT _plugins/_transform/sample
{
  "transform": {
    "enabled": true,
    "continuous": true,
    "schedule": {
      "interval": {
        "period": 1,
        "unit": "Minutes",
        "start_time": 1602100553
      }
    },
    "description": "Sample transform job",
    "source_index": "opensearch_dashboards_sample_data_ecommerce",
    "target_index": "ecommerce_transform",
    "data_selection_query": {
      "match_all": {}
    },
    "page_size": 1,
    "groups": [
      {
        "terms": {
          "source_field": "customer_gender",
          "target_field": "gender"
        }
      },
      {
        "terms": {
          "source_field": "day_of_week",
          "target_field": "day"
        }
      }
    ],
    "aggregations": {
      "quantity": {
        "sum": {
          "field": "total_quantity"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "_id": "sample",
  "_version": 1,
  "_seq_no": 13,
  "_primary_term": 1,
  "transform": {
    "transform_id": "sample",
    "schema_version": 30,
    "schedule": {
      "interval": {
        "start_time": 1602100553,
        "period": 1,
        "unit": "Minutes"
      }
    },
    "metadata_id": null,
    "updated_at": 1621467964243,
    "enabled": true,
    "enabled_at": 1621467964243,
    "description": "Sample transform job",
    "source_index": "opensearch_dashboards_sample_data_ecommerce",
    "data_selection_query": {
      "match_all": {
        "boost": 1.0
      }
    },
    "target_index": "ecommerce_transform",
    "page_size": 1,
    "groups": [
      {
        "terms": {
          "source_field": "customer_gender",
          "target_field": "gender"
        }
      },
      {
        "terms": {
          "source_field": "day_of_week",
          "target_field": "day"
        }
      }
    ],
    "aggregations": {
      "quantity": {
        "sum": {
          "field": "total_quantity"
        }
      }
    },
    "continuous": true
  }
}
```

The `metadata_id` field is assigned by OpenSearch and is `null` until the job runs for the first time. Setting it in the request has no effect.
{: .note}

## Update a transform job
**Introduced 1.0**
{: .label .label-purple }

Updates the transform job if `transform_id` already exists. For this request you must specify the sequence number and primary term of the transform to be updated. To get these, use the [Get a transform job's details](#get-a-transform-jobs-details) API call. 

### Endpoints

```json
PUT _plugins/_transform/{transform_id}?if_seq_no={seq_no}&if_primary_term={primary_term}
```

### Query parameters

The update operation supports the following query parameters:

Parameter | Description | Required
:---| :--- | :---
`if_seq_no` | Only perform the transform operation if the last operation that changed the transform job has the specified sequence number. | Yes
`if_primary_term` | Only perform the transform operation if the last operation that changed the transform job has the specified sequence term. | Yes

### Request body fields

Send the whole transform object in the request body. You can change only the following fields.

Option | Data type | Description
:--- | :--- | :---
`enabled` | Boolean | Whether the transform job is enabled.
`schedule` | Object | The schedule for the transform job. Contains the fields `interval.start_time`, `interval.period`, and `interval.unit`.
`interval.start_time` | Integer | The Unix epoch start time of the transform job.
`interval.period` | Integer | How often to execute the transform job.
`interval.unit` | String | The unit of time associated with the execution period. Available options are `Minutes`, `Hours`, and `Days`.
`description` | String | Describes the transform job.
`page_size` | Integer | The number of buckets IM processes and indexes concurrently. A higher number results in better performance, but it requires more memory. If your machine runs out of memory, IM automatically adjusts this field and retries until the operation succeeds.

Repeat the remaining fields with the values that the job already has. Changing `continuous`, `source_index`, `target_index`, `data_selection_query`, `groups`, or `aggregations` is rejected with `400`, and omitting one of them counts as a change. For example, leaving `continuous` out of the body of a job that was created with `"continuous": true` fails.
{: .note}

#### Example request

The following request updates a transform job with the id `sample`, sequence number `13`, and primary term `1`:

```json
PUT _plugins/_transform/sample?if_seq_no=13&if_primary_term=1
{
  "transform": {
    "enabled": true,
    "continuous": true,
    "schedule": {
      "interval": {
        "period": 1,
        "unit": "Minutes",
        "start_time": 1602100553
      }
    },
    "description": "Updated sample transform job",
    "source_index": "opensearch_dashboards_sample_data_ecommerce",
    "target_index": "ecommerce_transform",
    "data_selection_query": {
      "match_all": {}
    },
    "page_size": 10,
    "groups": [
      {
        "terms": {
          "source_field": "customer_gender",
          "target_field": "gender"
        }
      },
      {
        "terms": {
          "source_field": "day_of_week",
          "target_field": "day"
        }
      }
    ],
    "aggregations": {
      "quantity": {
        "sum": {
          "field": "total_quantity"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "_id": "sample",
  "_version": 2,
  "_seq_no": 14,
  "_primary_term": 1,
  "transform": {
    "transform_id": "sample",
    "schema_version": 30,
    "schedule": {
      "interval": {
        "start_time": 1602100553,
        "period": 1,
        "unit": "Minutes"
      }
    },
    "metadata_id": null,
    "updated_at": 1621467999831,
    "enabled": true,
    "enabled_at": 1621467999830,
    "description": "Updated sample transform job",
    "source_index": "opensearch_dashboards_sample_data_ecommerce",
    "data_selection_query": {
      "match_all": {
        "boost": 1.0
      }
    },
    "target_index": "ecommerce_transform",
    "page_size": 10,
    "groups": [
      {
        "terms": {
          "source_field": "customer_gender",
          "target_field": "gender"
        }
      },
      {
        "terms": {
          "source_field": "day_of_week",
          "target_field": "day"
        }
      }
    ],
    "aggregations": {
      "quantity": {
        "sum": {
          "field": "total_quantity"
        }
      }
    },
    "continuous": true
  }
}
```

## Get a transform job's details
**Introduced 1.0**
{: .label .label-purple }

Returns a transform job's details. 

### Endpoints

```json
GET _plugins/_transform/{transform_id}
```

#### Example request

The following request returns the details of the transform job with the id `sample`:

```json
GET _plugins/_transform/sample
```
{% include copy-curl.html %}

#### Example response

```json
{
  "_id": "sample",
  "_version": 3,
  "_seq_no": 15,
  "_primary_term": 1,
  "transform": {
    "transform_id": "sample",
    "schema_version": 30,
    "schedule": {
      "interval": {
        "start_time": 1602100553,
        "period": 1,
        "unit": "Minutes"
      }
    },
    "metadata_id": "cAgQ_8RVFy4ZoSZb0g4XNw",
    "updated_at": 1621468022451,
    "enabled": true,
    "enabled_at": 1621467999830,
    "description": "Updated sample transform job",
    "source_index": "opensearch_dashboards_sample_data_ecommerce",
    "data_selection_query": {
      "match_all": {
        "boost": 1.0
      }
    },
    "target_index": "ecommerce_transform",
    "page_size": 10,
    "groups": [
      {
        "terms": {
          "source_field": "customer_gender",
          "target_field": "gender"
        }
      },
      {
        "terms": {
          "source_field": "day_of_week",
          "target_field": "day"
        }
      }
    ],
    "aggregations": {
      "quantity": {
        "sum": {
          "field": "total_quantity"
        }
      }
    },
    "continuous": true
  }
}
```

You can also get details of all transform jobs by omitting `transform_id`.

#### Example request

The following request returns the details of all transform jobs:

```json
GET _plugins/_transform/
```
{% include copy-curl.html %}

#### Example response

```json
{
  "total_transforms": 1,
  "transforms": [
    {
      "_id": "sample",
      "_seq_no": 15,
      "_primary_term": 1,
      "transform": {
        "transform_id": "sample",
        "schema_version": 30,
        "schedule": {
          "interval": {
            "start_time": 1602100553,
            "period": 1,
            "unit": "Minutes"
          }
        },
        "metadata_id": "cAgQ_8RVFy4ZoSZb0g4XNw",
        "updated_at": 1621468022451,
        "enabled": true,
        "enabled_at": 1621467999830,
        "description": "Updated sample transform job",
        "source_index": "opensearch_dashboards_sample_data_ecommerce",
        "data_selection_query": {
          "match_all": {
            "boost": 1.0
          }
        },
        "target_index": "ecommerce_transform",
        "page_size": 10,
        "groups": [
          {
            "terms": {
              "source_field": "customer_gender",
              "target_field": "gender"
            }
          },
          {
            "terms": {
              "source_field": "day_of_week",
              "target_field": "day"
            }
          }
        ],
        "aggregations": {
          "quantity": {
            "sum": {
              "field": "total_quantity"
            }
          }
        },
        "continuous": true
      }
    }
  ]
}
```

Each entry omits `_version`, which the response returns only when you request a single transform job.

### Query parameters

You can specify the following GET API operation's query parameters to filter the results.

Parameter | Description | Required
:--- | :--- | :---
`from` | The starting transform to return. Default is 0. | No
`size` | Specifies the number of transforms to return. Default is 10. | No
`search` |The search term to use to filter results. | No
`sortField` | The field by which to sort the results, given as a path into the stored transform document, such as `transform.transform_id.keyword` or `transform.updated_at`. An unmapped name such as `transform_id` is rejected with `500`. | No
`sortDirection` | Specifies the direction to sort results in. Can be `ASC` or `DESC`. Default is `ASC`. | No

#### Example request

The following request returns two results starting from transform `8`, sorted by transform ID:

```json
GET _plugins/_transform?size=2&from=8&sortField=transform.transform_id.keyword
```
{% include copy-curl.html %}

#### Example response

```json
{
  "total_transforms": 18,
  "transforms": [
    {
      "_id": "sample8",
      "_seq_no": 93,
      "_primary_term": 1,
      "transform": {
        "transform_id": "sample8",
        "schema_version": 30,
        "schedule": {
          "interval": {
            "start_time": 1622063596812,
            "period": 1,
            "unit": "Minutes"
          }
        },
        "metadata_id": "y4hFAB2ZURQ2dzY7BAMxWA",
        "updated_at": 1622063657233,
        "enabled": false,
        "enabled_at": null,
        "description": "Sample transform job",
        "source_index": "opensearch_dashboards_sample_data_ecommerce",
        "data_selection_query": {
          "match_all": {
            "boost": 1.0
          }
        },
        "target_index": "ecommerce_transform8",
        "page_size": 1,
        "groups": [
          {
            "terms": {
              "source_field": "customer_gender",
              "target_field": "gender"
            }
          },
          {
            "terms": {
              "source_field": "day_of_week",
              "target_field": "day"
            }
          }
        ],
        "aggregations": {
          "quantity": {
            "sum": {
              "field": "total_quantity"
            }
          }
        },
        "continuous": false
      }
    },
    {
      "_id": "sample9",
      "_seq_no": 98,
      "_primary_term": 1,
      "transform": {
        "transform_id": "sample9",
        "schema_version": 30,
        "schedule": {
          "interval": {
            "start_time": 1622063598065,
            "period": 1,
            "unit": "Minutes"
          }
        },
        "metadata_id": "x8tCIiYMTE3veSbIJkit5A",
        "updated_at": 1622063658388,
        "enabled": false,
        "enabled_at": null,
        "description": "Sample transform job",
        "source_index": "opensearch_dashboards_sample_data_ecommerce",
        "data_selection_query": {
          "match_all": {
            "boost": 1.0
          }
        },
        "target_index": "ecommerce_transform9",
        "page_size": 1,
        "groups": [
          {
            "terms": {
              "source_field": "customer_gender",
              "target_field": "gender"
            }
          },
          {
            "terms": {
              "source_field": "day_of_week",
              "target_field": "day"
            }
          }
        ],
        "aggregations": {
          "quantity": {
            "sum": {
              "field": "total_quantity"
            }
          }
        },
        "continuous": false
      }
    }
  ]
}
```

## Start a transform job
**Introduced 1.0**
{: .label .label-purple }

Transform jobs created using the API are automatically enabled, but if you ever need to enable a job, you can use the start API operation. 

### Endpoints

```json
POST _plugins/_transform/{transform_id}/_start
```

#### Example request

The following request starts the transform job with the ID `sample`:

```json
POST _plugins/_transform/sample/_start
```
{% include copy-curl.html %}

#### Example response

```json
{
  "acknowledged": true
}
```

## Stop a transform job
**Introduced 1.0**
{: .label .label-purple }

Stops a transform job. 

### Endpoints

```json
POST _plugins/_transform/{transform_id}/_stop
```

#### Example request

The following request stops the transform job with the ID `sample`:

```json
POST _plugins/_transform/sample/_stop
```
{% include copy-curl.html %}

#### Example response

```json
{
  "acknowledged": true
}
```

## Get the status of a transform job
**Introduced 1.0**
{: .label .label-purple }

Returns the status and metadata of a transform job. 

### Endpoints

```json
GET _plugins/_transform/{transform_id}/_explain
```

#### Example request

The following request returns the details of the transform job with the ID `sample`:

```json
GET _plugins/_transform/sample/_explain
```
{% include copy-curl.html %}

#### Example response

```json
{
  "sample": {
    "metadata_id": "cAgQ_8RVFy4ZoSZb0g4XNw",
    "transform_metadata": {
      "transform_id": "sample",
      "last_updated_at": 1621883525873,
      "status": "started",
      "failure_reason": null,
      "stats": {
        "pages_processed": 3,
        "documents_processed": 4675,
        "documents_indexed": 14,
        "index_time_in_millis": 22,
        "search_time_in_millis": 88
      },
      "continuous_stats": {
        "last_timestamp": 1621883525672,
        "documents_behind": {
          "opensearch_dashboards_sample_data_ecommerce": 0
        }
      }
    }
  }
}
```

The `status` field is `started` while the job is running, `finished` after a job that is not continuous completes, `stopped` after you stop it, and `failed` if it fails, in which case `failure_reason` holds the message, such as `Failed to index the documents`. The `continuous_stats` object is present only for a continuous job, where `documents_behind` counts the source documents that the job has not yet transformed.

Both `metadata_id` and `transform_metadata` are `null` until the job runs for the first time.
{: .note}

## Preview a transform job's results
**Introduced 1.0**
{: .label .label-purple }

Returns a preview of what a transformed index would look like. The preview does not create the job or write to the target index.

### Endpoints

```json
POST _plugins/_transform/_preview
```

#### Example request

```json
POST _plugins/_transform/_preview
{
  "transform": {
    "enabled": false,
    "schedule": {
      "interval": {
        "period": 1,
        "unit": "Minutes",
        "start_time": 1602100553
      }
    },
    "description": "test transform",
    "source_index": "opensearch_dashboards_sample_data_ecommerce",
    "target_index": "ecommerce_transform",
    "data_selection_query": {
      "match_all": {}
    },
    "page_size": 10,
    "groups": [
      {
        "terms": {
          "source_field": "customer_gender",
          "target_field": "gender"
        }
      },
      {
        "terms": {
          "source_field": "day_of_week",
          "target_field": "day"
        }
      }
    ],
    "aggregations": {
      "quantity": {
        "sum": {
          "field": "total_quantity"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

Each document holds the grouped fields, the aggregated values, and the number of source documents in the bucket, reported in both `_doc_count` and `transform._doc_count`:

```json
{
  "documents" : [
    {
      "_doc_count" : 399,
      "quantity" : 862.0,
      "gender" : "FEMALE",
      "transform._doc_count" : 399,
      "day" : "Friday"
    },
    {
      "_doc_count" : 320,
      "quantity" : 682.0,
      "gender" : "FEMALE",
      "transform._doc_count" : 320,
      "day" : "Monday"
    },
    {
      "_doc_count" : 365,
      "quantity" : 772.0,
      "gender" : "FEMALE",
      "transform._doc_count" : 365,
      "day" : "Saturday"
    },
    {
      "_doc_count" : 315,
      "quantity" : 669.0,
      "gender" : "FEMALE",
      "transform._doc_count" : 315,
      "day" : "Sunday"
    },
    {
      "_doc_count" : 417,
      "quantity" : 887.0,
      "gender" : "FEMALE",
      "transform._doc_count" : 417,
      "day" : "Thursday"
    },
    {
      "_doc_count" : 323,
      "quantity" : 690.0,
      "gender" : "FEMALE",
      "transform._doc_count" : 323,
      "day" : "Tuesday"
    },
    {
      "_doc_count" : 294,
      "quantity" : 612.0,
      "gender" : "FEMALE",
      "transform._doc_count" : 294,
      "day" : "Wednesday"
    },
    {
      "_doc_count" : 371,
      "quantity" : 821.0,
      "gender" : "MALE",
      "transform._doc_count" : 371,
      "day" : "Friday"
    },
    {
      "_doc_count" : 259,
      "quantity" : 586.0,
      "gender" : "MALE",
      "transform._doc_count" : 259,
      "day" : "Monday"
    },
    {
      "_doc_count" : 371,
      "quantity" : 798.0,
      "gender" : "MALE",
      "transform._doc_count" : 371,
      "day" : "Saturday"
    }
  ]
}
```

The preview returns at most `page_size` documents, so raise `page_size` to view the remaining buckets.
{: .note}

## Delete a transform job
**Introduced 1.0**
{: .label .label-purple }

Deletes a transform job. This operation does not delete the source or target indexes. 

An enabled job cannot be deleted. [Stop the job](#stop-a-transform-job) first, or set `force` to `true` to delete it while it is still enabled.

### Endpoints

```json
DELETE _plugins/_transform/{transform_id}
```

### Query parameters

Parameter | Description | Required
:--- | :--- | :---
`force` | Deletes the transform job even if it is enabled. Default is `false`. | No

#### Example request

The following request deletes the transform job with the ID `sample`:

```json
DELETE _plugins/_transform/sample
```
{% include copy-curl.html %}

#### Example response

```json
{
  "took": 205,
  "errors": false,
  "items": [
    {
      "delete": {
        "_index": ".opendistro-ism-config",
        "_id": "sample",
        "_version": 4,
        "result": "deleted",
        "forced_refresh": true,
        "_shards": {
          "total": 2,
          "successful": 1,
          "failed": 0
        },
        "_seq_no": 6,
        "_primary_term": 1,
        "status": 200
      }
    }
  ]
}
```

Deleting a job that is still enabled fails with `409`. Deleting a job that does not exist returns `200`, with `"result": "not_found"` and `"status": 404` in the item.
{: .note}
