---
layout: default
title: Anatomy of a workload
nav_order: 15
grand_parent: User guide
parent: Understanding workloads
---

# Anatomy of a workload

All workloads contain the following files and directories:

- [workload.json](#workloadjson): Contains all of the workload settings.
- [index.json](#indexjson): Contains the document mappings and parameters, as well as index settings
- [files.txt](#filestxt): Contains the data corpora file names.
- [_test-procedures](#_operations-and-_test-procedures): Most workloads contain only one default test procedure, which is configured in `default.json`.
- [_operations](#_operations-and-_test-procedures): Contains all of the operations used in test procedures.
- workload.py Adds more dynamic functionality to the test.

## workload.json

The following example workload shows all of the essential elements needed to create a `workload.json` file. You can run this workload in your own benchmark configuration to understand how all of the elements work together:

```json
{
  "description": "Tutorial benchmark for OpenSearch Benchmark",
  "indices": [
    {
      "name": "movies",
      "body": "index.json"
    }
  ],
  "corpora": [
    {
      "name": "movies",
      "documents": [
        {
          "source-file": "movies-documents.json",
          "document-count": 11658903, # Fetch document count from command line
          "uncompressed-bytes": 1544799789 # Fetch uncompressed bytes from command line
        }
      ]
    }
  ],
  "schedule": [
    {
      "operation": {
        "operation-type": "create-index"
      }
    },
    {
      "operation": {
        "operation-type": "cluster-health",
        "request-params": {
          "wait_for_status": "green"
        },
        "retry-until-success": true
      }
    },
    {
      "operation": {
        "operation-type": "bulk",
        "bulk-size": 5000
      },
      "warmup-time-period": 120,
      "clients": 8
    },
    {
      "operation": {
        "name": "query-match-all",
        "operation-type": "search",
        "body": {
          "query": {
            "match_all": {}
          }
        }
      },
      "iterations": 1000,
      "target-throughput": 100
    }
  ]
}
```

A workload usually includes the following elements:

- [indices]({{site.url}}{{site.baseurl}}/benchmark/workloads/indices/): Defines the relevant indexes and index templates used for the workload.
- [corpora]({{site.url}}{{site.baseurl}}/benchmark/workloads/corpora/): Defines all document corpora used for the workload.
- `schedule`: Defines operations and the order in which the operations run inline. Alternatively, you can use `operations` to group operations and the `test_procedures` parameter to specify the order of operations.
- `operations`: **Optional**. Describes which operations are available for the workload and how they are parameterized.

### Indices

To create an index, specify its `name`. To add definitions to your index, use the `body` option and point it to the JSON file containing the index definitions. For more information, see [indices]({{site.url}}{{site.baseurl}}/benchmark/workloads/indices/).

### Corpora

The `corpora` element requires the name of the index containing the document corpus, for example, `movies`, and a list of parameters that define the document corpora. This list includes the following parameters:

-  `source-file`: The file name that contains the workload's corresponding documents. When using OpenSearch Benchmark locally, documents are contained in a JSON file. When providing a `base_url`, use a compressed file format: `.zip`, `.bz2`, `.zst`, `.gz`, `.tar`, `.tar.gz`, `.tgz`, or `.tar.bz2`. The compressed file must have one JSON file containing the name.
-  `document-count`: The number of documents in the `source-file`, which determines which client indexes correlate to which parts of the document corpus. Each N client is assigned an Nth of the document corpus to ingest into the test cluster. When using a source that contains a document with a parent-child relationship, specify the number of parent documents.
- `uncompressed-bytes`: The size, in bytes, of the source file after decompression, indicating how much disk space the decompressed source file needs.
- `compressed-bytes`: The size, in bytes, of the source file before decompression. This can help you assess the amount of time needed for the cluster to ingest documents.

### Operations

The `operations` element lists the OpenSearch API operations performed by the workload. For example, you can set an operation to `create-index`, an index in the test cluster to which OpenSearch Benchmark can write documents. Operations are usually listed inside of `schedule`.

### Schedule

The schedule element contains a list of operations that are run according to the order they appear in, as shown in the following example:

```json
  "schedule": [
    {
      "operation": {
        "operation-type": "create-index"
      }
    },
    {
      "operation": {
        "operation-type": "cluster-health",
        "request-params": {
          "wait_for_status": "green"
        },
        "retry-until-success": true
      }
    },
    {
      "operation": {
        "operation-type": "bulk",
        "bulk-size": 5000
      },
      "warmup-time-period": 120,
      "clients": 8
    },
    {
      "operation": {
        "name": "query-match-all",
        "operation-type": "search",
        "body": {
          "query": {
            "match_all": {}
          }
        }
      },
      "iterations": 1000,
      "target-throughput": 100
    }
  ]
}
```

According to this schedule, the actions will run in the following order:

1. The `create-index` operation creates an index. The index remains empty until the `bulk` operation adds documents with benchmarked data.
2. The `cluster-health` operation assesses the health of the cluster before running the workload. In this example, the workload waits until the status of the cluster's health is `green`.
   - The `bulk` operation runs the `bulk` API to index `5000` documents simultaneously.
   - Before benchmarking, the workload waits until the specified `warmup-time-period` passes. In this example, the warmup period is `120` seconds.
3. The `clients` field defines the number of clients that will run the bulk indexing operation concurrently.
5. The `search` runs a `match_all` query to match all documents after they have been indexed by the `bulk` API using the 8 clients specified.
   - The `iterations` field indicates the number of times each client runs the `search` operation. The report generated by the benchmark automatically adjusts the percentile numbers based on this number. To generate a precise percentile, the benchmark needs to run at least 1,000 iterations.
   - Lastly, the `target-throughput` field defines the number of requests per second each client performs, which, when set, can help reduce the latency of the benchmark. For example, a `target-throughput` of 100 requests divided by 8 clients means that each client will issue 12 requests per second. For more information about how target throughput is defined in OSB, see [Throughput and latency](https://opensearch.org/docs/latest/benchmark/user-guide/concepts/#throughput-and-latency).

## index.json

The index.json file contains all of the data mappings and parameters used to index any documents contained inside the workload, as well as the index settings needed when the `create-index` operations in run during the workload. 

When OSB creates an index for the workload, it uses the index settings and mappings template found in the `index.json` file. Mappings in `index.json` are based off of the mappings of a single document from the workload's corpus, which can be found in `files.txt`. For example, the following is the `index.json` for `nyc_taxis` workload. Users can customize fields such as `number_of_shards`, `number_of_replicas`, `query_cache_enabled`, and `requests_cache_enabled`. 

```json
{
  "settings": {
    "index.number_of_shards": {{number_of_shards | default(1)}},
    "index.number_of_replicas": {{number_of_replicas | default(0)}},
    "index.queries.cache.enabled": {{query_cache_enabled | default(false) | tojson}},
    "index.requests.cache.enable": {{requests_cache_enabled | default(false) | tojson}}
  },
  "mappings": {
    "_source": {
      "enabled": {{ source_enabled | default(true) | tojson }}
    },
    "properties": {
      "surcharge": {
        "scaling_factor": 100,
        "type": "scaled_float"
      },
      "dropoff_datetime": {
        "type": "date",
        "format": "yyyy-MM-dd HH:mm:ss"
      },
      "trip_type": {
        "type": "keyword"
      },
      "mta_tax": {
        "scaling_factor": 100,
        "type": "scaled_float"
      },
      "rate_code_id": {
        "type": "keyword"
      },
      "passenger_count": {
        "type": "integer"
      },
      "pickup_datetime": {
        "type": "date",
        "format": "yyyy-MM-dd HH:mm:ss"
      },
      "tolls_amount": {
        "scaling_factor": 100,
        "type": "scaled_float"
      },
      "tip_amount": {
        "type": "half_float"
      },
      "payment_type": {
        "type": "keyword"
      },
      "extra": {
        "scaling_factor": 100,
        "type": "scaled_float"
      },
      "vendor_id": {
        "type": "keyword"
      },
      "store_and_fwd_flag": {
        "type": "keyword"
      },
      "improvement_surcharge": {
        "scaling_factor": 100,
        "type": "scaled_float"
      },
      "fare_amount": {
        "scaling_factor": 100,
        "type": "scaled_float"
      },
      "ehail_fee": {
        "scaling_factor": 100,
        "type": "scaled_float"
      },
      "cab_color": {
        "type": "keyword"
      },
      "dropoff_location": {
        "type": "geo_point"
      },
      "vendor_name": {
        "type": "text"
      },
      "total_amount": {
        "scaling_factor": 100,
        "type": "scaled_float"
      },
      "trip_distance": {%- if trip_distance_mapping is defined %} {{ trip_distance_mapping | tojson }} {%- else %} {
        "scaling_factor": 100,
        "type": "scaled_float"
      }{%- endif %},
      "pickup_location": {
        "type": "geo_point"
      }
    },
    "dynamic": "strict"
  }
}
```

## files.txt

The `files.txt` contains a list of files where the data for the workload is stored, usually in a zipped `.json` file.

## _operations and _test-procedures

To make the workload more human-readable, operations and test procedures are separated into two different directories. 

The `operations` directory contains a `default.json` file that lists all of the supported operations the test procedure can use. Some workloads, such as `nyc_taxis`, contain an additional `.json` file which lists feature-specific operations, such as `snapshot` operations. The following example shows a list of operations from the `nyc_taxis` workload:

```json
    {
      "name": "index",
      "operation-type": "bulk",
      "bulk-size": {{bulk_size | default(10000)}},
      "ingest-percentage": {{ingest_percentage | default(100)}}
    },
    {
      "name": "update",
      "operation-type": "bulk",
      "bulk-size": {{bulk_size | default(10000)}},
      "ingest-percentage": {{ingest_percentage | default(100)}},
      "conflicts": "{{conflicts | default('random')}}",
      "on-conflict": "{{on_conflict | default('update')}}",
      "conflict-probability": {{conflict_probability | default(25)}},
      "recency": {{recency | default(0)}}
    },
    {
      "name": "wait-until-merges-finish",
      "operation-type": "index-stats",
      "index": "_all",
      "condition": {
        "path": "_all.total.merges.current",
        "expected-value": 0
      },
      "retry-until-success": true,
      "include-in-reporting": false
    },
    {
      "name": "default",
      "operation-type": "search",
      "body": {
        "query": {
          "match_all": {}
        }
      }
    },
    {
      "name": "range",
      "operation-type": "search",
      "body": {
        "query": {
          "range": {
            "total_amount": {
              "gte": 5,
              "lt": 15
            }
          }
        }
      }
    },
    {
      "name": "distance_amount_agg",
      "operation-type": "search",
      "body": {
        "size": 0,
        "query": {
          "bool": {
            "filter": {
              "range": {
                "trip_distance": {
                  "lt": 50,
                  "gte": 0
                }
              }
            }
          }
        },
        "aggs": {
          "distance_histo": {
            "histogram": {
              "field": "trip_distance",
              "interval": 1
            },
            "aggs": {
              "total_amount_stats": {
                "stats": {
                  "field": "total_amount"
                }
              }
            }
          }
        }
      }
    },
    {
      "name": "autohisto_agg",
      "operation-type": "search",
      "body": {
        "size": 0,
        "query": {
          "range": {
            "dropoff_datetime": {
              "gte": "01/01/2015",
              "lte": "21/01/2015",
              "format": "dd/MM/yyyy"
            }
          }
        },
        "aggs": {
          "dropoffs_over_time": {
            "auto_date_histogram": {
              "field": "dropoff_datetime",
              "buckets": 20
            }
          }
        }
      }
    },
    {
      "name": "date_histogram_agg",
      "operation-type": "search",
      "body": {
        "size": 0,
        "query": {
          "range": {
              "dropoff_datetime": {
              "gte": "01/01/2015",
              "lte": "21/01/2015",
              "format": "dd/MM/yyyy"
            }
          }
        },
        "aggs": {
          "dropoffs_over_time": {
            "date_histogram": {
              "field": "dropoff_datetime",
              "calendar_interval": "day"
            }
          }
        }
      }
    },
    {
      "name": "date_histogram_calendar_interval",
      "operation-type": "search",
      "body": {
        "size": 0,
        "query": {
          "range": {
            "dropoff_datetime": {
              "gte": "2015-01-01 00:00:00",
              "lt": "2016-01-01 00:00:00"
            }
          }
        },
        "aggs": {
          "dropoffs_over_time": {
            "date_histogram": {
              "field": "dropoff_datetime",
              "calendar_interval": "month"
            }
          }
        }
      }
    },
    {
      "name": "date_histogram_calendar_interval_with_tz",
      "operation-type": "search",
      "body": {
        "size": 0,
        "query": {
          "range": {
            "dropoff_datetime": {
              "gte": "2015-01-01 00:00:00",
              "lt": "2016-01-01 00:00:00"
            }
          }
        },
        "aggs": {
          "dropoffs_over_time": {
            "date_histogram": {
              "field": "dropoff_datetime",
              "calendar_interval": "month",
              "time_zone": "America/New_York"
            }
          }
        }
      }
    },
    {
      "name": "date_histogram_fixed_interval",
      "operation-type": "search",
      "body": {
        "size": 0,
        "query": {
          "range": {
            "dropoff_datetime": {
              "gte": "2015-01-01 00:00:00",
              "lt": "2016-01-01 00:00:00"
            }
          }
        },
        "aggs": {
          "dropoffs_over_time": {
            "date_histogram": {
              "field": "dropoff_datetime",
              "fixed_interval": "60d"
            }
          }
        }
      }
    },
    {
      "name": "date_histogram_fixed_interval_with_tz",
      "operation-type": "search",
      "body": {
        "size": 0,
        "query": {
          "range": {
            "dropoff_datetime": {
              "gte": "2015-01-01 00:00:00",
              "lt": "2016-01-01 00:00:00"
            }
          }
        },
        "aggs": {
          "dropoffs_over_time": {
            "date_histogram": {
              "field": "dropoff_datetime",
              "fixed_interval": "60d",
              "time_zone": "America/New_York"
            }
          }
        }
      }
    },
    {
      "name": "date_histogram_fixed_interval_with_metrics",
      "operation-type": "search",
      "body": {
        "size": 0,
        "query": {
          "range": {
            "dropoff_datetime": {
              "gte": "2015-01-01 00:00:00",
              "lt": "2016-01-01 00:00:00"
            }
          }
        },
        "aggs": {
          "dropoffs_over_time": {
            "date_histogram": {
              "field": "dropoff_datetime",
              "fixed_interval": "60d"
            },
            "aggs": {
              "total_amount": { "stats": { "field": "total_amount" } },
              "tip_amount": { "stats": { "field": "tip_amount" } },
              "trip_distance": { "stats": { "field": "trip_distance" } }
            }
          }
        }
      }
    },
    {
      "name": "auto_date_histogram",
      "operation-type": "search",
      "body": {
        "size": 0,
        "query": {
          "range": {
            "dropoff_datetime": {
              "gte": "2015-01-01 00:00:00",
              "lt": "2016-01-01 00:00:00"
            }
          }
        },
        "aggs": {
          "dropoffs_over_time": {
            "auto_date_histogram": {
              "field": "dropoff_datetime",
              "buckets": "12"
            }
          }
        }
      }
    },
    {
      "name": "auto_date_histogram_with_tz",
      "operation-type": "search",
      "body": {
        "size": 0,
        "query": {
          "range": {
            "dropoff_datetime": {
              "gte": "2015-01-01 00:00:00",
              "lt": "2016-01-01 00:00:00"
            }
          }
        },
        "aggs": {
          "dropoffs_over_time": {
            "auto_date_histogram": {
              "field": "dropoff_datetime",
              "buckets": "13",
              "time_zone": "America/New_York"
            }
          }
        }
      }
    },
    {
      "name": "auto_date_histogram_with_metrics",
      "operation-type": "search",
      "body": {
        "size": 0,
        "query": {
          "range": {
            "dropoff_datetime": {
              "gte": "2015-01-01 00:00:00",
              "lt": "2016-01-01 00:00:00"
            }
          }
        },
        "aggs": {
          "dropoffs_over_time": {
            "auto_date_histogram": {
              "field": "dropoff_datetime",
              "buckets": "12"
            },
            "aggs": {
              "total_amount": { "stats": { "field": "total_amount" } },
              "tip_amount": { "stats": { "field": "tip_amount" } },
              "trip_distance": { "stats": { "field": "trip_distance" } }
            }
          }
        }
      }
    },
    {
      "name": "desc_sort_tip_amount",
      "operation-type": "search",
      "index": "nyc_taxis",
      "body": {
        "query": {
          "match_all": {}
        },
        "sort" : [
          {"tip_amount" : "desc"}
        ]
      }
    },
    {
      "name": "asc_sort_tip_amount",
      "operation-type": "search",
      "index": "nyc_taxis",
      "body": {
        "query": {
          "match_all": {}
        },
        "sort" : [
          {"tip_amount" : "asc"}
        ]
      }
    }
```

The `_test-procedures` directory contains a `default.json` file which sets the order of operations performed by the workload. Similar to operations, the `_test-procedures` directory can also contain feature specific test procedures, such as `searchable_snapshots.json` for `nyc_taxis`. The following examples shows the searchable snapshots test procedures for `nyc_taxis`:

```json
    {
      "name": "searchable-snapshot",
      "description": "Measuring performance for Searchable Snapshot feature. Based on the default test procedure 'append-no-conflicts'.",
      "schedule": [
        {
          "operation": "delete-index"
        },
        {
          "operation": {
            "operation-type": "create-index",
            "settings": {%- if index_settings is defined %} {{ index_settings | tojson }} {%- else %} {
              "index.codec": "best_compression",
              "index.refresh_interval": "30s",
              "index.translog.flush_threshold_size": "4g"
            }{%- endif %}
          }
        },
        {
          "name": "check-cluster-health",
          "operation": {
            "operation-type": "cluster-health",
            "index": "nyc_taxis",
            "request-params": {
              "wait_for_status": "{{ cluster_health | default('green') }}",
              "wait_for_no_relocating_shards": "true"
            },
            "retry-until-success": true
          }
        },
        {
          "operation": "index",
          "warmup-time-period": 240,
          "clients": {{ bulk_indexing_clients | default(8) }},
          "ignore-response-error-level": "{{ error_level | default('non-fatal') }}"
        },
        {
          "name": "refresh-after-index",
          "operation": "refresh"
        },
        {
          "operation": {
            "operation-type": "force-merge",
            "request-timeout": 7200
            {%- if force_merge_max_num_segments is defined %},
            "max-num-segments": {{ force_merge_max_num_segments | tojson }}
            {%- endif %}
          }
        },
        {
          "name": "refresh-after-force-merge",
          "operation": "refresh"
        },
        {
          "operation": "wait-until-merges-finish"
        },
        {
          "operation": "create-snapshot-repository"
        },
        {
          "operation": "delete-snapshot"
        },
        {
          "operation": "create-snapshot"
        },
        {
          "operation": "wait-for-snapshot-creation"
        },
        {
          "operation": {
            "name": "delete-local-index",
            "operation-type": "delete-index"
          }
        },
        {
          "operation": "restore-snapshot"
        },
        {
          "operation": "default",
          "warmup-iterations": 50,
          "iterations": 100
          {%- if not target_throughput %}
          ,"target-throughput": 3
          {%- elif target_throughput is string and target_throughput.lower() == 'none' %}
          {%- else %}
          ,"target-throughput": {{ target_throughput | tojson }}
          {%- endif %}
          {%-if search_clients is defined and search_clients %}
          ,"clients": {{ search_clients | tojson}}
          {%- endif %}
        },
        {
          "operation": "range",
          "warmup-iterations": 50,
          "iterations": 100
          {%- if not target_throughput %}
          ,"target-throughput": 0.7
          {%- elif target_throughput is string and target_throughput.lower() == 'none' %}
          {%- else %}
          ,"target-throughput": {{ target_throughput | tojson }}
          {%- endif %}
          {%-if search_clients is defined and search_clients %}
          ,"clients": {{ search_clients | tojson}}
          {%- endif %}
        },
        {
          "operation": "distance_amount_agg",
          "warmup-iterations": 50,
          "iterations": 50
          {%- if not target_throughput %}
          ,"target-throughput": 2
          {%- elif target_throughput is string and target_throughput.lower() == 'none' %}
          {%- else %}
          ,"target-throughput": {{ target_throughput | tojson }}
          {%- endif %}
          {%-if search_clients is defined and search_clients %}
          ,"clients": {{ search_clients | tojson}}
          {%- endif %}
        },
        {
          "operation": "autohisto_agg",
          "warmup-iterations": 50,
          "iterations": 100
          {%- if not target_throughput %}
          ,"target-throughput": 1.5
          {%- elif target_throughput is string and target_throughput.lower() == 'none' %}
          {%- else %}
          ,"target-throughput": {{ target_throughput | tojson }}
          {%- endif %}
          {%-if search_clients is defined and search_clients %}
          ,"clients": {{ search_clients | tojson}}
          {%- endif %}
        },
        {
          "operation": "date_histogram_agg",
          "warmup-iterations": 50,
          "iterations": 100
          {%- if not target_throughput %}
          ,"target-throughput": 1.5
          {%- elif target_throughput is string and target_throughput.lower() == 'none' %}
          {%- else %}
          ,"target-throughput": {{ target_throughput | tojson }}
          {%- endif %}
          {%-if search_clients is defined and search_clients %}
          ,"clients": {{ search_clients | tojson}}
          {%- endif %}
        }
      ]
    }
```

## Next steps

Now that you have familiarized yourself with the anatomy of a workload, see the criteria for [Choosing a workload]({{site.url}}{{site.baseurl}}/benchmark/user-guide/understanding-workloads/choosing-a-workload/).