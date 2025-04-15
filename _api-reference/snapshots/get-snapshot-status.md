---
layout: default
title: Get Snapshot Status
parent: Snapshot APIs
nav_order: 8
---

# Get snapshot status
**Introduced 1.0**
{: .label .label-purple }

Returns details about a snapshot’s state during and after snapshot creation.

To learn about snapshot creation, see [Create snapshot]({{site.url}}{{site.baseurl}}/api-reference/snapshots/create-snapshot).

If you use the Security plugin, you must have the `monitor_snapshot`, `create_snapshot`, or `manage cluster` privileges.
{: .note}

## Endpoints

```json
GET _snapshot/<repository>/<snapshot>/_status
```

<!-- spec_insert_start
api: snapshot.status
component: endpoints
-->
## Endpoints
```json
GET /_snapshot/_status
GET /_snapshot/{repository}/_status
GET /_snapshot/{repository}/{snapshot}/_status
```
<!-- spec_insert_end -->


<!-- spec_insert_start
api: snapshot.status
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `repository` | String | The name of the repository containing the snapshot. |
| `snapshot` | List or String | A comma-separated list of snapshot names. |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: snapshot.status
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `cluster_manager_timeout` | String | The amount of time to wait for a response from the cluster manager node. For more information about supported time units, see [Common parameters]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/#time-units). |
| `ignore_unavailable` | Boolean | Whether to ignore any unavailable snapshots, When `false`, a `SnapshotMissingException` is thrown. _(Default: `false`)_ |
| `master_timeout` <br> _DEPRECATED_ | String | _(Deprecated since 2.0: To promote inclusive language, use `cluster_manager_timeout` instead.)_ Explicit operation timeout for connection to cluster-manager node |

<!-- spec_insert_end -->

## Example request

The following request returns the status of `my-first-snapshot` in the `my-opensearch-repo` repository. Unavailable snapshots are ignored.

````json
GET _snapshot/my-opensearch-repo/my-first-snapshot/_status
{
   "ignore_unavailable": true 
}
````
{% include copy-curl.html %}

## Example response

The example that follows corresponds to the request above in the [Example request](#example-request) section.

The `GET _snapshot/my-opensearch-repo/my-first-snapshot/_status` request returns the following fields:

````json
{
  "snapshots" : [
    {
      "snapshot" : "my-first-snapshot",
      "repository" : "my-opensearch-repo",
      "uuid" : "dCK4Qth-TymRQ7Tu7Iga0g",
      "state" : "SUCCESS",
      "include_global_state" : true,
      "shards_stats" : {
        "initializing" : 0,
        "started" : 0,
        "finalizing" : 0,
        "done" : 7,
        "failed" : 0,
        "total" : 7
      },
      "stats" : {
        "incremental" : {
          "file_count" : 31,
          "size_in_bytes" : 24488927
        },
        "total" : {
          "file_count" : 31,
          "size_in_bytes" : 24488927
        },
        "start_time_in_millis" : 1660666841667,
        "time_in_millis" : 14054
      },
      "indices" : {
        ".opensearch-observability" : {
          "shards_stats" : {
            "initializing" : 0,
            "started" : 0,
            "finalizing" : 0,
            "done" : 1,
            "failed" : 0,
            "total" : 1
          },
          "stats" : {
            "incremental" : {
              "file_count" : 1,
              "size_in_bytes" : 208
            },
            "total" : {
              "file_count" : 1,
              "size_in_bytes" : 208
            },
            "start_time_in_millis" : 1660666841868,
            "time_in_millis" : 201
          },
          "shards" : {
            "0" : {
              "stage" : "DONE",
              "stats" : {
                "incremental" : {
                  "file_count" : 1,
                  "size_in_bytes" : 208
                },
                "total" : {
                  "file_count" : 1,
                  "size_in_bytes" : 208
                },
                "start_time_in_millis" : 1660666841868,
                "time_in_millis" : 201
              }
            }
          }
        },
        "shakespeare" : {
          "shards_stats" : {
            "initializing" : 0,
            "started" : 0,
            "finalizing" : 0,
            "done" : 1,
            "failed" : 0,
            "total" : 1
          },
          "stats" : {
            "incremental" : {
              "file_count" : 4,
              "size_in_bytes" : 18310117
            },
            "total" : {
              "file_count" : 4,
              "size_in_bytes" : 18310117
            },
            "start_time_in_millis" : 1660666842470,
            "time_in_millis" : 13050
          },
          "shards" : {
            "0" : {
              "stage" : "DONE",
              "stats" : {
                "incremental" : {
                  "file_count" : 4,
                  "size_in_bytes" : 18310117
                },
                "total" : {
                  "file_count" : 4,
                  "size_in_bytes" : 18310117
                },
                "start_time_in_millis" : 1660666842470,
                "time_in_millis" : 13050
              }
            }
          }
        },
        "opensearch_dashboards_sample_data_flights" : {
          "shards_stats" : {
            "initializing" : 0,
            "started" : 0,
            "finalizing" : 0,
            "done" : 1,
            "failed" : 0,
            "total" : 1
          },
          "stats" : {
            "incremental" : {
              "file_count" : 10,
              "size_in_bytes" : 6132245
            },
            "total" : {
              "file_count" : 10,
              "size_in_bytes" : 6132245
            },
            "start_time_in_millis" : 1660666843476,
            "time_in_millis" : 6221
          },
          "shards" : {
            "0" : {
              "stage" : "DONE",
              "stats" : {
                "incremental" : {
                  "file_count" : 10,
                  "size_in_bytes" : 6132245
                },
                "total" : {
                  "file_count" : 10,
                  "size_in_bytes" : 6132245
                },
                "start_time_in_millis" : 1660666843476,
                "time_in_millis" : 6221
              }
            }
          }
        },
        ".opendistro-reports-definitions" : {
          "shards_stats" : {
            "initializing" : 0,
            "started" : 0,
            "finalizing" : 0,
            "done" : 1,
            "failed" : 0,
            "total" : 1
          },
          "stats" : {
            "incremental" : {
              "file_count" : 1,
              "size_in_bytes" : 208
            },
            "total" : {
              "file_count" : 1,
              "size_in_bytes" : 208
            },
            "start_time_in_millis" : 1660666843076,
            "time_in_millis" : 200
          },
          "shards" : {
            "0" : {
              "stage" : "DONE",
              "stats" : {
                "incremental" : {
                  "file_count" : 1,
                  "size_in_bytes" : 208
                },
                "total" : {
                  "file_count" : 1,
                  "size_in_bytes" : 208
                },
                "start_time_in_millis" : 1660666843076,
                "time_in_millis" : 200
              }
            }
          }
        },
        ".opendistro-reports-instances" : {
          "shards_stats" : {
            "initializing" : 0,
            "started" : 0,
            "finalizing" : 0,
            "done" : 1,
            "failed" : 0,
            "total" : 1
          },
          "stats" : {
            "incremental" : {
              "file_count" : 1,
              "size_in_bytes" : 208
            },
            "total" : {
              "file_count" : 1,
              "size_in_bytes" : 208
            },
            "start_time_in_millis" : 1660666841667,
            "time_in_millis" : 201
          },
          "shards" : {
            "0" : {
              "stage" : "DONE",
              "stats" : {
                "incremental" : {
                  "file_count" : 1,
                  "size_in_bytes" : 208
                },
                "total" : {
                  "file_count" : 1,
                  "size_in_bytes" : 208
                },
                "start_time_in_millis" : 1660666841667,
                "time_in_millis" : 201
              }
            }
          }
        },
        ".kibana_1" : {
          "shards_stats" : {
            "initializing" : 0,
            "started" : 0,
            "finalizing" : 0,
            "done" : 1,
            "failed" : 0,
            "total" : 1
          },
          "stats" : {
            "incremental" : {
              "file_count" : 13,
              "size_in_bytes" : 45733
            },
            "total" : {
              "file_count" : 13,
              "size_in_bytes" : 45733
            },
            "start_time_in_millis" : 1660666842673,
            "time_in_millis" : 2007
          },
          "shards" : {
            "0" : {
              "stage" : "DONE",
              "stats" : {
                "incremental" : {
                  "file_count" : 13,
                  "size_in_bytes" : 45733
                },
                "total" : {
                  "file_count" : 13,
                  "size_in_bytes" : 45733
                },
                "start_time_in_millis" : 1660666842673,
                "time_in_millis" : 2007
              }
            }
          }
        },
        ".opensearch-notifications-config" : {
          "shards_stats" : {
            "initializing" : 0,
            "started" : 0,
            "finalizing" : 0,
            "done" : 1,
            "failed" : 0,
            "total" : 1
          },
          "stats" : {
            "incremental" : {
              "file_count" : 1,
              "size_in_bytes" : 208
            },
            "total" : {
              "file_count" : 1,
              "size_in_bytes" : 208
            },
            "start_time_in_millis" : 1660666842270,
            "time_in_millis" : 200
          },
          "shards" : {
            "0" : {
              "stage" : "DONE",
              "stats" : {
                "incremental" : {
                  "file_count" : 1,
                  "size_in_bytes" : 208
                },
                "total" : {
                  "file_count" : 1,
                  "size_in_bytes" : 208
                },
                "start_time_in_millis" : 1660666842270,
                "time_in_millis" : 200
              }
            }
          }
        }
      }
    }
  ]
}
````

<!-- spec_insert_start
api: snapshot.status
component: response_body_parameters
-->
## Response body fields

The response body is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `snapshots` | **Required** | Array of Objects |  |

<details markdown="block" name="snapshot.status::response_body">
  <summary>
    Response body fields: <code>snapshots</code>
  </summary>
  {: .text-delta}

`snapshots` is an __array of JSON objects__ (NDJSON). Each object has the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `include_global_state` | Boolean | Whether the snapshot includes the cluster state. |
| `indices` | Object | The status of indexes in the snapshot. |
| `repository` | String | The name of the repository containing the snapshot. |
| `shards_stats` | Object | The statistics about snapshot shards. |
| `snapshot` | String | The name of the snapshot. |
| `state` | String | The current state of the snapshot. |
| `stats` | Object | The detailed statistics about the snapshot. |
| `uuid` | String | The universally unique identifier. |

</details>
<details markdown="block" name="snapshot.status::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>indices</code>
  </summary>
  {: .text-delta}

The status of indexes in the snapshot.

`indices` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `-- freeform field --` | Object |  |

</details>
<details markdown="block" name="snapshot.status::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>indices</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `shards` | Object | The status of individual shards in the snapshot. |
| `shards_stats` | Object | The statistics about snapshot shards. |
| `stats` | Object | The detailed statistics about the snapshot. |

</details>
<details markdown="block" name="snapshot.status::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>indices</code> > <code>-- freeform field --</code> > <code>shards</code>
  </summary>
  {: .text-delta}

The status of individual shards in the snapshot.

`shards` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `-- freeform field --` | Object |  |

</details>
<details markdown="block" name="snapshot.status::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>indices</code> > <code>-- freeform field --</code> > <code>shards</code> > <code>-- freeform field --</code>
  </summary>
  {: .text-delta}

`-- freeform field --` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `stage` | **Required** | String | The current stage of the shard snapshot. <br> Valid values are: <br> - `DONE`: The number of shards in the snapshot that were successfully stored in the repository. <br> - `FAILURE`: The number of shards in the snapshot that were not successfully stored in the repository. <br> - `FINALIZE`: The number of shards in the snapshot that are in the finalizing stage of being stored in the repository. <br> - `INIT`: The number of shards in the snapshot that are in the initializing stage of being stored in the repository. <br> - `STARTED`: The number of shards in the snapshot that are in the started stage of being stored in the repository. |
| `stats` | **Required** | Object | The statistical summary of the shard snapshot. |
| `node` | _Optional_ | String | The unique identifier of a node. |
| `reason` | _Optional_ | String | The reason for the current shard status. |

</details>
<details markdown="block" name="snapshot.status::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>indices</code> > <code>-- freeform field --</code> > <code>shards</code> > <code>-- freeform field --</code> > <code>stats</code>
  </summary>
  {: .text-delta}

The statistical summary of the shard snapshot.

`stats` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `incremental` | Object | The incremental statistics for the shard snapshot. |
| `processed` | Object | The processed statistics for the shard snapshot. |
| `start_time_in_millis` | Integer | The time unit for milliseconds. |
| `time` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `time_in_millis` | Integer | The time unit for milliseconds. |
| `total` | Object | The total statistics for the shard snapshot. |

</details>
<details markdown="block" name="snapshot.status::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>indices</code> > <code>-- freeform field --</code> > <code>shards</code> > <code>-- freeform field --</code> > <code>stats</code> > <code>incremental</code>
  </summary>
  {: .text-delta}

The incremental statistics for the shard snapshot.

`incremental` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `file_count` | Integer | The number of files in the shard snapshot. |
| `size_in_bytes` | Integer | The size in bytes. |

</details>
<details markdown="block" name="snapshot.status::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>indices</code> > <code>-- freeform field --</code> > <code>shards</code> > <code>-- freeform field --</code> > <code>stats</code> > <code>processed</code>
  </summary>
  {: .text-delta}

The processed statistics for the shard snapshot.

`processed` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `file_count` | Integer | The number of files in the shard snapshot. |
| `size_in_bytes` | Integer | The size in bytes. |

</details>
<details markdown="block" name="snapshot.status::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>indices</code> > <code>-- freeform field --</code> > <code>shards</code> > <code>-- freeform field --</code> > <code>stats</code> > <code>total</code>
  </summary>
  {: .text-delta}

The total statistics for the shard snapshot.

`total` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `file_count` | Integer | The number of files in the shard snapshot. |
| `size_in_bytes` | Integer | The size in bytes. |

</details>
<details markdown="block" name="snapshot.status::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>indices</code> > <code>-- freeform field --</code> > <code>shards_stats</code>
  </summary>
  {: .text-delta}

The statistics about snapshot shards.

`shards_stats` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `done` | Integer | The number of completed shard snapshots. |
| `failed` | Integer | The number of failed shard snapshots. |
| `finalizing` | Integer | The number of finalizing shard snapshots. |
| `initializing` | Integer | The number of initializing shard snapshots. |
| `started` | Integer | The number of started shard snapshots. |
| `total` | Integer | The total number of shard snapshots. |

</details>
<details markdown="block" name="snapshot.status::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>indices</code> > <code>-- freeform field --</code> > <code>stats</code>
  </summary>
  {: .text-delta}

The detailed statistics about the snapshot.

`stats` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `incremental` | Object | The incremental statistics for the snapshot. |
| `processed` | Object | The processed statistics for the snapshot. |
| `start_time_in_millis` | Integer | The time unit for milliseconds. |
| `time` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `time_in_millis` | Integer | The time unit for milliseconds. |
| `total` | Object | The total statistics for the snapshot. |

</details>
<details markdown="block" name="snapshot.status::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>indices</code> > <code>-- freeform field --</code> > <code>stats</code> > <code>incremental</code>
  </summary>
  {: .text-delta}

The incremental statistics for the snapshot.

`incremental` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `file_count` | Integer | The number of files in the snapshot. |
| `size_in_bytes` | Integer | The size in bytes. |

</details>
<details markdown="block" name="snapshot.status::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>indices</code> > <code>-- freeform field --</code> > <code>stats</code> > <code>processed</code>
  </summary>
  {: .text-delta}

The processed statistics for the snapshot.

`processed` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `file_count` | Integer | The number of files in the snapshot. |
| `size_in_bytes` | Integer | The size in bytes. |

</details>
<details markdown="block" name="snapshot.status::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>indices</code> > <code>-- freeform field --</code> > <code>stats</code> > <code>total</code>
  </summary>
  {: .text-delta}

The total statistics for the snapshot.

`total` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `file_count` | Integer | The number of files in the snapshot. |
| `size_in_bytes` | Integer | The size in bytes. |

</details>
<details markdown="block" name="snapshot.status::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>shards_stats</code>
  </summary>
  {: .text-delta}

The statistics about snapshot shards.

`shards_stats` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `done` | Integer | The number of completed shard snapshots. |
| `failed` | Integer | The number of failed shard snapshots. |
| `finalizing` | Integer | The number of finalizing shard snapshots. |
| `initializing` | Integer | The number of initializing shard snapshots. |
| `started` | Integer | The number of started shard snapshots. |
| `total` | Integer | The total number of shard snapshots. |

</details>
<details markdown="block" name="snapshot.status::response_body">
  <summary>
    Response body fields: <code>snapshots</code> > <code>stats</code>
  </summary>
  {: .text-delta}

The detailed statistics about the snapshot.

`stats` is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `incremental` | Object | The incremental statistics for the snapshot. |
| `processed` | Object | The processed statistics for the snapshot. |
| `start_time_in_millis` | Integer | The time unit for milliseconds. |
| `time` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. |
| `time_in_millis` | Integer | The time unit for milliseconds. |
| `total` | Object | The total statistics for the snapshot. |

</details>
<!-- spec_insert_end -->


