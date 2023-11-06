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

## Path parameters

Path parameters are optional. 

| Parameter | Data type | Description | 
:--- | :--- | :---
| repository | String | Repository containing the snapshot. |
| snapshot | String | Snapshot to return. |

Three request variants provide flexibility:

* `GET _snapshot/_status` returns the status of all currently running snapshots in all repositories.

* `GET _snapshot/<repository>/_status` returns the status of only currently running snapshots in the specified repository. This is the preferred variant.

* `GET _snapshot/<repository>/<snapshot>/_status` returns the status of all snapshots in the specified repository whether they are running or not.

Using the API to return state for other than currently running snapshots can be very costly for (1) machine machine resources and (2) processing time if running in the cloud. For each snapshot, each request causes file reads from all a snapshot's shards. 
{: .warning}

## Request fields

| Field | Data type | Description | 
:--- | :--- | :---
| ignore_unavailable | Boolean | How to handles requests for unavailable snapshots. If `false`, the request returns an error for unavailable snapshots. If `true`, the request ignores unavailable snapshots, such as those that are corrupted or temporarily cannot be returned. Defaults to `false`.|

#### Example request

The following request returns the status of `my-first-snapshot` in the `my-opensearch-repo` repository. Unavailable snapshots are ignored.

````json
GET _snapshot/my-opensearch-repo/my-first-snapshot/_status
{
   "ignore_unavailable": true 
}
````
{% include copy-curl.html %}

#### Example response

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

## Response fields

| Field | Data type | Description | 
:--- | :--- | :---
| repository | String | Name of repository that contains the snapshot. |
| snapshot | String | Snapshot name. |
| uuid | String | Snapshot Universally unique identifier (UUID). |
| state | String | Snapshot's current status. See [Snapshot states](#snapshot-states).  |
| include_global_state | Boolean | Whether the current cluster state is included in the snapshot. |
| shards_stats | Object | Snapshot's shard counts. See [Shard stats](#shard-stats). |
| stats | Object | Details of files included in the snapshot. `file_count`: number of files. `size_in_bytes`: total of all fie sizes. See [Snapshot file stats](#snapshot-file-stats). |
| index | list of Objects | List of objects that contain information about the indices in the snapshot. See [Index objects](#index-objects).|

##### Snapshot states

| State | Description | 
:--- | :--- |
| FAILED | The snapshot terminated in an error and no  data was stored. |
| IN_PROGRESS | The snapshot is currently running. |
| PARTIAL | The global cluster state was stored, but data from at least one shard was not stored. The `failures` property of the [Create snapshot]({{site.url}}{{site.baseurl}}/api-reference/snapshots/create-snapshot) response contains additional details. |
| SUCCESS | The snapshot finished and all shards were stored successfully. |

##### Shard stats

All property values are Integers.

| Property | Description | 
:--- | :--- |
| initializing | Number of shards that are still initializing. |
| started | Number of shards that have started but not are not finalized. |
| finalizing | Number of shards that are finalizing but are not done. |
| done | Number of shards that initialized, started, and finalized successfully. |
| failed | Number of shards that failed to be included in the snapshot. |
| total | Total number of shards included in the snapshot. |

##### Snapshot file stats

| Property | Type | Description | 
:--- | :--- | :--- |
| incremental | Object | Number and size of files that still need to be copied during snapshot creation. For completed snapshots, `incremental` provides the number and size of files that were not already in the repository and were copied as part of the incremental snapshot. |
| processed | Object | Number and size of files already uploaded to the snapshot. The processed `file_count` and `size_in_bytes` are incremented in stats after a file is uploaded. |
| total | Object | Total number and size of files that are referenced by the snapshot. | 
| start_time_in_millis | Long | Time (in milliseconds) when snapshot creation began. |
| time_in_millis | Long | Total time (in milliseconds) that the snapshot took to complete. |

##### Index objects

| Property | Type | Description | 
:--- | :--- | :--- |
| shards_stats | Object | See [Shard stats](#shard-stats). |
| stats | Object | See [Snapshot file stats](#snapshot-file-stats). |
| shards | list of Objects | List of objects containing information about the shards that include the snapshot. Properies of the shards are listed below in bold text. <br /><br /> **stage**: Current state of shards in the snapshot. Shard states are: <br /><br /> * DONE: Number of shards in the snapshot that were successfully stored in the repository. <br /><br /> * FAILURE: Number of shards in the snapshot that were not successfully stored in the repository. <br /><br /> * FINALIZE: Number of shards in the snapshot that are in the finalizing stage of being stored in the repository. <br /><br />* INIT: Number of shards in the snapshot that are in the initializing stage of being stored in the repository.<br /><br />* STARTED:  Number of shards in the snapshot that are in the started stage of being stored in the repository.<br /><br /> **stats**: See [Snapshot file stats](#snapshot-file-stats). <br /><br /> **total**: Total number and size of files referenced by the snapshot. <br /><br /> **start_time_in_millis**: Time (in milliseconds) when snapshot creation began. <br /><br /> **time_in_millis**: Total time (in milliseconds) that the snapshot took to complete.  |