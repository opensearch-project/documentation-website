---
layout: default
title: Remote Store Stats API 
nav_order: 20
parent: Remote-backed storage
grand_parent: Availability and recovery
---

# Remote Store Stats API
Introduced 2.8
{: .label .label-purple }

Use the Remote Store Stats API to monitor shard-level remote store performance. Metrics are only relevant if the index is remote store backed.

For an aggregated output on an index, node or cluster level, use the Index Stats, Nodes Stats or Cluster Stats API respectively.

## Path and HTTP methods

```json
GET _remotestore/stats/<index_name>
GET _remotestore/stats/<index_name>/<shard_id>
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
`index_name` | String | The index name or index pattern.
`shard_id` | String | The shard ID.

## Remote store stats for an index

Use the following API to get remote store statistics for all shards of an index.

#### Example request

```json
GET _remotestore/stats/<index_name>
```
{% include copy-curl.html %}

#### Example response

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta }

```json
{
    "_shards": {
        "total": 4,
        "successful": 4,
        "failed": 0
    },
    "indices": {
        "remote-index": {
            "shards": {
                "0": [{
                        "routing": {
                            "state": "STARTED",
                            "primary": true,
                            "node": "q1VxWZnCTICrfRc2bRW3nw"
                        },
                        "segment": {
                            "download": {},
                            "upload": {
                                "local_refresh_timestamp_in_millis": 1694171634102,
                                "remote_refresh_timestamp_in_millis": 1694171634102,
                                "refresh_time_lag_in_millis": 0,
                                "refresh_lag": 0,
                                "bytes_lag": 0,
                                "backpressure_rejection_count": 0,
                                "consecutive_failure_count": 0,
                                "total_uploads": {
                                    "started": 5,
                                    "succeeded": 5,
                                    "failed": 0
                                },
                                "total_upload_size": {
                                    "started_bytes": 15342,
                                    "succeeded_bytes": 15342,
                                    "failed_bytes": 0
                                },
                                "remote_refresh_size_in_bytes": {
                                    "last_successful": 0,
                                    "moving_avg": 3068.4
                                },
                                "upload_speed_in_bytes_per_sec": {
                                    "moving_avg": 99988.2
                                },
                                "remote_refresh_latency_in_millis": {
                                    "moving_avg": 44.0
                                }
                            }
                        },
                        "translog": {
                            "upload": {
                                "last_successful_upload_timestamp": 1694171633644,
                                "total_uploads": {
                                    "started": 6,
                                    "failed": 0,
                                    "succeeded": 6
                                },
                                "total_upload_size": {
                                    "started_bytes": 1932,
                                    "failed_bytes": 0,
                                    "succeeded_bytes": 1932
                                },
                                "total_upload_time_in_millis": 21478,
                                "upload_size_in_bytes": {
                                    "moving_avg": 322.0
                                },
                                "upload_speed_in_bytes_per_sec": {
                                    "moving_avg": 2073.8333333333335
                                },
                                "upload_time_in_millis": {
                                    "moving_avg": 3579.6666666666665
                                }
                            },
                            "download": {}
                        }
                    },
                    {
                        "routing": {
                            "state": "STARTED",
                            "primary": false,
                            "node": "EZuen5Y5Sv-eDCLwh9gv-Q"
                        },
                        "segment": {
                            "download": {
                                "last_sync_timestamp": 1694171634148,
                                "total_download_size": {
                                    "started_bytes": 15112,
                                    "succeeded_bytes": 15112,
                                    "failed_bytes": 0
                                },
                                "download_size_in_bytes": {
                                    "last_successful": 2910,
                                    "moving_avg": 1259.3333333333333
                                },
                                "download_speed_in_bytes_per_sec": {
                                    "moving_avg": 382387.3333333333
                                }
                            },
                            "upload": {}
                        },
                        "translog": {
                            "upload": {},
                            "download": {}
                        }
                    }
                ],
                "1": [{
                        "routing": {
                            "state": "STARTED",
                            "primary": false,
                            "node": "q1VxWZnCTICrfRc2bRW3nw"
                        },
                        "segment": {
                            "download": {
                                "last_sync_timestamp": 1694171633181,
                                "total_download_size": {
                                    "started_bytes": 18978,
                                    "succeeded_bytes": 18978,
                                    "failed_bytes": 0
                                },
                                "download_size_in_bytes": {
                                    "last_successful": 325,
                                    "moving_avg": 1265.2
                                },
                                "download_speed_in_bytes_per_sec": {
                                    "moving_avg": 456047.6666666667
                                }
                            },
                            "upload": {}
                        },
                        "translog": {
                            "upload": {},
                            "download": {}
                        }
                    },
                    {
                        "routing": {
                            "state": "STARTED",
                            "primary": true,
                            "node": "EZuen5Y5Sv-eDCLwh9gv-Q"
                        },
                        "segment": {
                            "download": {},
                            "upload": {
                                "local_refresh_timestamp_in_millis": 1694171633122,
                                "remote_refresh_timestamp_in_millis": 1694171633122,
                                "refresh_time_lag_in_millis": 0,
                                "refresh_lag": 0,
                                "bytes_lag": 0,
                                "backpressure_rejection_count": 0,
                                "consecutive_failure_count": 0,
                                "total_uploads": {
                                    "started": 6,
                                    "succeeded": 6,
                                    "failed": 0
                                },
                                "total_upload_size": {
                                    "started_bytes": 19208,
                                    "succeeded_bytes": 19208,
                                    "failed_bytes": 0
                                },
                                "remote_refresh_size_in_bytes": {
                                    "last_successful": 0,
                                    "moving_avg": 3201.3333333333335
                                },
                                "upload_speed_in_bytes_per_sec": {
                                    "moving_avg": 109612.0
                                },
                                "remote_refresh_latency_in_millis": {
                                    "moving_avg": 25.333333333333332
                                }
                            }
                        },
                        "translog": {
                            "upload": {
                                "last_successful_upload_timestamp": 1694171633106,
                                "total_uploads": {
                                    "started": 7,
                                    "failed": 0,
                                    "succeeded": 7
                                },
                                "total_upload_size": {
                                    "started_bytes": 2405,
                                    "failed_bytes": 0,
                                    "succeeded_bytes": 2405
                                },
                                "total_upload_time_in_millis": 27748,
                                "upload_size_in_bytes": {
                                    "moving_avg": 343.57142857142856
                                },
                                "upload_speed_in_bytes_per_sec": {
                                    "moving_avg": 1445.857142857143
                                },
                                "upload_time_in_millis": {
                                    "moving_avg": 3964.0
                                }
                            },
                            "download": {}
                        }
                    }
                ]
            }
        }
    }
}
```
</details>

### Response fields

The response is categorized into 3 parts:

* `routing` : Contains information related to the shard’s routing
* `segment` : Contains stats related to segment transfers to and from the remote store
* `translog` : Contains stats related to translog transfers to and from the remote store

The `routing` object contains the following fields:

|Field	|Description	|
|:---	|:---	|
|primary    |Denotes if the shard copy is primary or not    |
|node   |Node name to which the shard is assigned to    |

The `segment.upload` object contains the following fields:

|Field	|Description	|
|:---	|:---	|
|local_refresh_timestamp_in_millis  |Last successful local refresh timestamp (in milliseconds)  |
|remote_refresh_timestamp_in_millis |Last successful remote refresh timestamp (in milliseconds) |
|refresh_time_lag_in_millis |The time (in milliseconds) the remote refresh is behind the local refresh. |
|refresh_lag    |The number of refreshes by which the remote store is lagging behind the local store.   |
|bytes_lag  |The bytes lag between the remote and local store.  |
|backpressure_rejection_count   |The total number of write rejections made because of remote store backpressure.    |
|consecutive_failure_count  |The number of consecutive remote refresh failures since the last success.  |
|total_remote_refresh   |The total number of remote refreshes.  |
|total_uploads_in_bytes |The total number of bytes in all uploads to the remote store.  |
|remote_refresh_size_in_bytes.last_successful   |The size of data uploaded in the last successful refresh.  |
|remote_refresh_size_in_bytes.moving_avg    |The average size of data (in bytes) uploaded in the last *N* refreshes. *N* is defined in remote_store.moving_average_window_size. For details, see [Remote segment backpressure](https://opensearch.org/docs/latest/tuning-your-cluster/availability-and-recovery/remote-store/remote-segment-backpressure/).    |
|upload_latency_in_bytes_per_sec.moving_avg |The average speed of remote store segment uploads (in bytes per second) for the last *N* uploads. *N* is defined in remote_store.moving_average_window_size. For details, see [Remote segment backpressure](https://opensearch.org/docs/latest/tuning-your-cluster/availability-and-recovery/remote-store/remote-segment-backpressure/).    |
|remote_refresh_latency_in_millis.moving_avg    |The average time taken by a single remote refresh during the last *N* remote refreshes. *N* is defined in remote_store.moving_average_window_size. For details, see [Remote segment backpressure](https://opensearch.org/docs/latest/tuning-your-cluster/availability-and-recovery/remote-store/remote-segment-backpressure/).    |

The `segment.download` object contains the following fields:

|Field	|Description	|
|:---	|:---	|
|last_sync_timestamp    |Timestamp in epoch millis for the last successful segement file download from the remote store |
|total_download_size.started_bytes  |Total bytes of segment files attempted to be downloaded from the remote store  |
|total_download_size.succeeded_bytes    |Total bytes of segment files successfully downloaded from the remote store |
|total_download_size.failed_bytes   |Total bytes of segment files failed to be downloaded from the remote store |
|download_size_in_bytes.last_successful |Size of the last successful segment file downloaded from the remote store  |
|download_size_in_bytes.moving_avg  |The average size of segement data (in bytes) downloaded in the last 20 downloads.  |
|download_speed_in_bytes_per_sec.moving_avg |The average download speed (in bytes/sec) for the last 20 downloads.   |

The `translog.upload` object contains the following fields:

|Field	|Description	|
|:---	|:---	|
|last_successful_upload_timestamp   |Timestamp in epoch millis for the last successful translog file upload to the remote store |
|total_uploads.started  |Total number of attempted translog upload syncs to the remote store    |
|total_uploads.failed   |Total number of failed translog upload syncs to the remote store   |
|total_uploads.succeeded    |Total number of succeeded translog upload syncs to the remote store    |
|total_upload_size.started_bytes    |Total bytes of translog files attempted to be uploaded to the remote store |
|total_upload_size.succeeded_bytes  |Total bytes of translog files successfully uploaded to the remote store    |
|total_upload_size.failed_bytes |Total bytes of translog files failed to be uploaded to the remote store    |
|total_upload_time_in_millis    |Total time spent in translog uploads to the remote store   |
|upload_size_in_bytes.moving_avg    |The average size of translog data (in bytes) uploaded in the last *N* downloads. *N* is defined in remote_store.moving_average_window_size.    |
|upload_speed_in_bytes_per_sec.moving_avg   |The average speed of remote store translog uploads (in bytes per second) for the last *N* uploads. *N* is defined in remote_store.moving_average_window_size.    |
|upload_time_in_millis.moving_avg   |The average time taken by a single translog upload (in milliseconds) for the last *N* uploads. *N* is defined in remote_store.moving_average_window_size.    |

The `translog.download` object contains the following fields:

|Field	|Description	|
|:---	|:---	|
|last_successful_download_timestamp |Timestamp in epoch millis for the last successful translog file download from the remote store |
|total_downloads.succeeded  |Total number of successful translog download syncs from the remote store   |
|total_download_size.succeeded_bytes    |Total bytes of translog files successfully download from the remote store  |
|total_download_time_in_millis  |Total time spent in translog downloads from the remote store   |
|download_size_in_bytes.moving_avg  |The average size of translog data (in bytes) downloaded in the last *N* downloads. *N* is defined in remote_store.moving_average_window_size.    |
|download_speed_in_bytes_per_sec.moving_avg |The average speed of remote store translog downloads (in bytes per second) for the last *N* downloads. *N* is defined in remote_store.moving_average_window_size.    |
|download_time_in_millis.moving_avg |The average time taken by a single translog download (in milliseconds) for the last *N* downloads. *N* is defined in remote_store.moving_average_window_size.    |

## Remote store stats for a single shard

Use the following API to get remote store statistics for a single shard.

#### Example request

```json
GET _remotestore/stats/<index_name>/<shard_id>
```
{% include copy-curl.html %}

#### Example response

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta }

```json
{
    "_shards": {
        "total": 2,
        "successful": 2,
        "failed": 0
    },
    "indices": {
        "remote-index": {
            "shards": {
                "0": [
                    {
                        "routing": {
                            "state": "STARTED",
                            "primary": true,
                            "node": "q1VxWZnCTICrfRc2bRW3nw"
                        },
                        "segment": {
                            "download": {},
                            "upload": {
                                "local_refresh_timestamp_in_millis": 1694171634102,
                                "remote_refresh_timestamp_in_millis": 1694171634102,
                                "refresh_time_lag_in_millis": 0,
                                "refresh_lag": 0,
                                "bytes_lag": 0,
                                "backpressure_rejection_count": 0,
                                "consecutive_failure_count": 0,
                                "total_uploads": {
                                    "started": 5,
                                    "succeeded": 5,
                                    "failed": 0
                                },
                                "total_upload_size": {
                                    "started_bytes": 15342,
                                    "succeeded_bytes": 15342,
                                    "failed_bytes": 0
                                },
                                "remote_refresh_size_in_bytes": {
                                    "last_successful": 0,
                                    "moving_avg": 3068.4
                                },
                                "upload_speed_in_bytes_per_sec": {
                                    "moving_avg": 99988.2
                                },
                                "remote_refresh_latency_in_millis": {
                                    "moving_avg": 44.0
                                }
                            }
                        },
                        "translog": {
                            "upload": {
                                "last_successful_upload_timestamp": 1694171633644,
                                "total_uploads": {
                                    "started": 6,
                                    "failed": 0,
                                    "succeeded": 6
                                },
                                "total_upload_size": {
                                    "started_bytes": 1932,
                                    "failed_bytes": 0,
                                    "succeeded_bytes": 1932
                                },
                                "total_upload_time_in_millis": 21478,
                                "upload_size_in_bytes": {
                                    "moving_avg": 322.0
                                },
                                "upload_speed_in_bytes_per_sec": {
                                    "moving_avg": 2073.8333333333335
                                },
                                "upload_time_in_millis": {
                                    "moving_avg": 3579.6666666666665
                                }
                            },
                            "download": {}
                        }
                    },
                    {
                        "routing": {
                            "state": "STARTED",
                            "primary": false,
                            "node": "EZuen5Y5Sv-eDCLwh9gv-Q"
                        },
                        "segment": {
                            "download": {
                                "last_sync_timestamp": 1694171634148,
                                "total_download_size": {
                                    "started_bytes": 15112,
                                    "succeeded_bytes": 15112,
                                    "failed_bytes": 0
                                },
                                "download_size_in_bytes": {
                                    "last_successful": 2910,
                                    "moving_avg": 1259.3333333333333
                                },
                                "download_speed_in_bytes_per_sec": {
                                    "moving_avg": 382387.3333333333
                                }
                            },
                            "upload": {}
                        },
                        "translog": {
                            "upload": {},
                            "download": {}
                        }
                    }
                ]
            }
        }
    }
}
```
</details>

### Remote store stats for a local shard

Provide the `local` query parameter set to `true` to only fetch the shards present on the node that is serving the request:

```json
GET _remotestore/stats/<index_name>?local=true
```
{% include copy-curl.html %}
