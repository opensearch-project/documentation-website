---
layout: default
title: Transforms APIs
nav_order: 45
parent: Index transforms
has_toc: true
canonical_url: https://docs.opensearch.org/latest/im-plugin/index-transforms/transforms-apis/
---

# Transforms APIs

Aside from using OpenSearch Dashboards, you can also use the REST API to create, start, stop, and complete other operations relative to transform jobs.

#### Table of contents
- TOC
{:toc}

## Create a transform job
Introduced 1.0
{: .label .label-purple }

Creates a transform job.

**Sample Request**

```json
PUT _plugins/_transform/<transform_id>

{
  "transform": {
  "enabled": true,
  "schedule": {
    "interval": {
    "period": 1,
    "unit": "Minutes",
    "start_time": 1602100553
    }
  },
  "description": "Sample transform job",
  "source_index": "sample_index",
  "target_index": "sample_target",
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

**Sample Response**

```json
{
  "_id": "sample",
  "_version": 7,
  "_seq_no": 13,
  "_primary_term": 1,
  "transform": {
    "transform_id": "sample",
    "schema_version": 7,
    "schedule": {
      "interval": {
        "start_time": 1621467964243,
        "period": 1,
        "unit": "Minutes"
      }
    },
    "metadata_id": null,
    "updated_at": 1621467964243,
    "enabled": true,
    "enabled_at": 1621467964243,
    "description": "Sample transform job",
    "source_index": "sample_index",
    "data_selection_query": {
      "match_all": {
        "boost": 1.0
      }
    },
    "target_index": "sample_target",
    "roles": [],
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
You can specify the following options in the HTTP request body:

Option | Data Type | Description | Required
:--- | :--- | :--- | :---
enabled | Boolean | If true, the transform job is enabled at creation. | No
schedule | Object | The schedule the transform job runs on. | Yes
start_time | Integer | The Unix epoch time of the transform job's start time. | Yes
description | String | Describes the transform job. | No
metadata_id | String | Any metadata to be associated with the transform job. | No
source_index | String | The source index whose data to transform. | Yes
target_index | String | The target index the newly transformed data is added into. You can create a new index or update an existing one. | Yes
data_selection_query | Object | The query DSL to use to filter a subset of the source index for the transform job. See [query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl) for more information. | Yes
page_size | Integer | The number of buckets IM processes and indexes concurrently. Higher number means better performance but requires more memory. If your machine runs out of memory, IM automatically adjusts this field and retries until the operation succeeds. | Yes
groups | Array | Specifies the grouping(s) to use in the transform job. Supported groups are `terms`, `histogram`, and `date_histogram`. For more information, see [Bucket Aggregations]({{site.url}}{{site.baseurl}}/opensearch/bucket-agg). | Yes if not using aggregations
source_field | String | The field(s) to transform | Yes
aggregations | Object | The aggregations to use in the transform job. Supported aggregations are: `sum`, `max`, `min`, `value_count`, `avg`, `scripted_metric`, and `percentiles`. For more information, see [Metric Aggregations]({{site.url}}{{site.baseurl}}/opensearch/metric-agg). | Yes if not using groups

## Update a transform job
Introduced 1.0
{: .label .label-purple }

Updates a transform job if `transform_id` already exists.

**Sample Request**

```json
PUT _plugins/_transform/<transform_id>

{
  "transform": {
  "enabled": true,
  "schedule": {
    "interval": {
    "period": 1,
    "unit": "Minutes",
    "start_time": 1602100553
    }
  },
  "description": "Sample transform job",
  "source_index": "sample_index",
  "target_index": "sample_target",
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

**Sample Response**

```json
{
  "_id": "sample",
  "_version": 2,
  "_seq_no": 14,
  "_primary_term": 1,
  "transform": {
    "transform_id": "sample",
    "schema_version": 7,
    "schedule": {
      "interval": {
        "start_time": 1602100553,
        "period": 1,
        "unit": "Minutes"
      }
    },
    "metadata_id": null,
    "updated_at": 1621889843874,
    "enabled": true,
    "enabled_at": 1621889843874,
    "description": "Sample transform job",
    "source_index": "sample_index",
    "data_selection_query": {
      "match_all": {
        "boost": 1.0
      }
    },
    "target_index": "sample_target",
    "roles": [],
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

The Update operation supports the following URL parameters:

Parameter | Description | Required
:---| :--- | :---
`if_seq_no` | Only perform the transform operation if the last operation that changed the transform job has the specified sequence number. | Yes
`if_primary_term` | Only perform the transform operation if the last operation that changed the transform job has the specified sequence term. | Yes

You can update the following fields:

Option | Data Type | Description
:--- | :--- | :---
schedule | Object | The schedule the transform job runs on. Contains the fields `interval.start_time`, `interval.period`, and `interval.unit`.
start_time | Integer | The Unix epoch start time of the transform job.
period | Integer | How often to execute the transform job.
unit | String | The unit of time associated with the execution period. Available options are `Minutes`, `Hours`, and `Days`.
description | Integer | Describes the transform job.
page_size | Integer | The number of buckets IM processes and indexes concurrently. Higher number means better performance but requires more memory. If your machine runs out of memory, IM automatically adjusts this field and retries until the operation succeeds.

## Get a transform job's details
Introduced 1.0
{: .label .label-purple }

Returns a transform job's details.

**Sample Request**

```json
GET _plugins/_transform/<transform_id>
```

**Sample Response**

```json
{
  "_id": "sample",
  "_version": 7,
  "_seq_no": 13,
  "_primary_term": 1,
  "transform": {
    "transform_id": "sample",
    "schema_version": 7,
    "schedule": {
      "interval": {
        "start_time": 1621467964243,
        "period": 1,
        "unit": "Minutes"
      }
    },
    "metadata_id": null,
    "updated_at": 1621467964243,
    "enabled": true,
    "enabled_at": 1621467964243,
    "description": "Sample transform job",
    "source_index": "sample_index",
    "data_selection_query": {
      "match_all": {
        "boost": 1.0
      }
    },
    "target_index": "sample_target",
    "roles": [],
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

You can also get details of all transform jobs by omitting `transform_id`.

**Sample Request**

```json
GET _plugins/_transform/
```

**Sample Response**

```json
{
  "total_transforms": 1,
  "transforms": [
    {
      "_id": "sample",
      "_seq_no": 13,
      "_primary_term": 1,
      "transform": {
        "transform_id": "sample",
        "schema_version": 7,
        "schedule": {
          "interval": {
            "start_time": 1621467964243,
            "period": 1,
            "unit": "Minutes"
          }
        },
        "metadata_id": null,
        "updated_at": 1621467964243,
        "enabled": true,
        "enabled_at": 1621467964243,
        "description": "Sample transform job",
        "source_index": "sample_index",
        "data_selection_query": {
          "match_all": {
            "boost": 1.0
          }
        },
        "target_index": "sample_target",
        "roles": [],
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
  ]
}
```

You can specify these options as the `GET` API operation’s URL parameters to filter results:

Parameter | Description | Required
:--- | :--- | :---
from | The starting index to search from. Default is 0. | No
size | Specifies the amount of results to return. Default is 10. | No
search |The search term to use to filter results. | No
sortField | The field to sort results with. | No
sortDirection | Specifies the direction to sort results in. Can be `ASC` or `DESC`. Default is ASC. | No

For example, this request returns two results starting from the eighth index.

**Sample Request**

```json
GET _plugins/_transform?size=2&from=8
```

**Sample Response**

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
        "schema_version": 7,
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
        "source_index": "sample_index3",
        "data_selection_query": {
          "match_all": {
            "boost": 1.0
          }
        },
        "target_index": "sample_target3",
        "roles": [],
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
    },
    {
      "_id": "sample9",
      "_seq_no": 98,
      "_primary_term": 1,
      "transform": {
        "transform_id": "sample9",
        "schema_version": 7,
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
        "source_index": "sample_index4",
        "data_selection_query": {
          "match_all": {
            "boost": 1.0
          }
        },
        "target_index": "sample_target4",
        "roles": [],
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
  ]
}
```

## Start a transform job
Introduced 1.0
{: .label .label-purple }

Transform jobs created using the API are automatically enabled, but if you ever need to enable a job, you can use the `start` API operation.

**Sample Request**

```json
POST _plugins/_transform/<transform_id>/_start
```

**Sample Response**

```json
{
  "acknowledged": true
}
```

## Stop a transform job
Introduced 1.0
{: .label .label-purple }

Stops/disables a transform job.

**Sample Request**

```json
POST _plugins/_transform/<transform_id>/_stop
```

**Sample Response**

```json
{
  "acknowledged": true
}
```

## Get the status of a transform job
Introduced 1.0
{: .label .label-purple }

Returns the status and metadata of a transform job.

**Sample Request**

```json
GET _plugins/_transform/<transform_id>/_explain
```

**Sample Response**

```json
{
  "sample": {
    "metadata_id": "PzmjweME5xbgkenl9UpsYw",
    "transform_metadata": {
      "transform_id": "sample",
      "last_updated_at": 1621883525873,
      "status": "finished",
      "failure_reason": "null",
      "stats": {
        "pages_processed": 0,
        "documents_processed": 0,
        "documents_indexed": 0,
        "index_time_in_millis": 0,
        "search_time_in_millis": 0
      }
    }
  }
}
```

## Preview a transform job's results
Introduced 1.0
{: .label .label-purple }

Returns a preview of what a transformed index would look like.

**Sample Request**

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
  "source_index": "sample_index",
  "target_index": "sample_target",
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

**Sample Response**

```json
{
  "documents" : [
  {
    "quantity" : 862.0,
    "gender" : "FEMALE",
    "day" : "Friday"
  },
  {
    "quantity" : 682.0,
    "gender" : "FEMALE",
    "day" : "Monday"
  },
  {
    "quantity" : 772.0,
    "gender" : "FEMALE",
    "day" : "Saturday"
  },
  {
    "quantity" : 669.0,
    "gender" : "FEMALE",
    "day" : "Sunday"
  },
  {
    "quantity" : 887.0,
    "gender" : "FEMALE",
    "day" : "Thursday"
  }
  ]
}
```

## Delete a transform job
Introduced 1.0
{: .label .label-purple }

Deletes a transform job. This operation does not delete the source or target indices.

**Sample Request**

```json
DELETE _plugins/_transform/<transform_id>
```

**Sample Response**

```json
{
  "took": 205,
  "errors": false,
  "items": [
    {
      "delete": {
        "_index": ".opensearch-ism-config",
        "_type": "_doc",
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
