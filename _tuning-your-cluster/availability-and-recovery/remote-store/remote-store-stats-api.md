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

Use the Remote Store Stats API to monitor shard-level remote-backed storage performance. 

Metrics returned from this API only relate to indexes stored on remote-backed nodes. For an aggregated output on an index at the node or cluster level, use the [Index Stats]({{site.url}}{{site.baseurl}}/api-reference/index-apis/stats/), [Nodes Stats]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/), or [Cluster Stats]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/cluster-stats/) API.

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

Use the following API to get remote store statistics for all index shards.

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

The response body of the Remote Store Stats API is split into three categories:

* `routing` : Contains information related to the shard’s routing
* `segment` : Contains statistics related to segment transfers from remote-backed storage
* `translog` : Contains statistics related to translog transfers from remote-backed storage

#### routing

The `routing` object contains the following fields.

|Field	|Description	|
|:---	|:---	|
| `primary` | Denotes whether the shard copy is a primary shard. |
| `node` | The name of the node to which the shard is assigned. |

#### segment

The `segment.upload` object contains the following fields.

|Field	|Description	|
|:---	|:---	|
| `local_refresh_timestamp_in_millis` | The last successful local refresh timestamp, in milliseconds.  |
| `remote_refresh_timestamp_in_millis` | The last successful remote refresh timestamp, in milliseconds. |
| `refresh_time_lag_in_millis` | The amount of time, in milliseconds, that the remote refresh is behind the local refresh. |
| `refresh_lag` | The number of refreshes by which the remote store is lagging behind the local store.   |
| `bytes_lag` | The lag, in bytes, between the remote and local stores.  |
| `backpressure_rejection_count` | The total number of write rejections issued due to backpressure in the remote store.    |
| `consecutive_failure_count` | The number of consecutive remote refresh failures since the last successful refresh.  |
| `total_remote_refresh` | The total number of remote refreshes.  |
| `total_uploads_in_bytes` | The total number of bytes in all uploads to the remote store.  |
| `remote_refresh_size_in_bytes.last_successful` | The size of the data uploaded during the last successful refresh.  |
| `remote_refresh_size_in_bytes.moving_avg` | The average size of the data, in bytes, uploaded in the last *N* refreshes. *N* is defined in the `remote_store.moving_average_window_size` setting. For more information, see [Remote segment backpressure](https://opensearch.org/docs/latest/tuning-your-cluster/availability-and-recovery/remote-store/remote-segment-backpressure/). |
| `upload_latency_in_bytes_per_sec.moving_avg` | The average speed of remote segment uploads, in bytes per second, for the last *N* uploads. *N* is defined in the `remote_store.moving_average_window_size` setting. For more information, see [Remote segment backpressure](https://opensearch.org/docs/latest/tuning-your-cluster/availability-and-recovery/remote-store/remote-segment-backpressure/).    |
| `remote_refresh_latency_in_millis.moving_avg` | The average amount of time, in milliseconds, taken by a single remote refresh during the last *N* remote refreshes. *N* is defined in the `remote_store.moving_average_window_size` setting. For more information, see [Remote segment backpressure](https://opensearch.org/docs/latest/tuning-your-cluster/availability-and-recovery/remote-store/remote-segment-backpressure/).    |

The `segment.download` object contains the following fields.

|Field	|Description	|
|:---	|:---	|
| `last_sync_timestamp`| The timestamp, in milliseconds, since the last successful segment file download from remote-backed storage. |
| `total_download_size.started_bytes` | The total number of bytes of segment files actively being downloaded from remote-backed storage.   |
| `total_download_size.succeeded_bytes` | The total number of bytes of segment files successfully downloaded from remote-backed storage. |
| `total_download_size.failed_bytes` | The total number of bytes of segment files that failed to download from remote-back storage. |
| `download_size_in_bytes.last_successful` | The size, in bytes, of the last segment file successfully downloaded from remote-backed storage. |
| `download_size_in_bytes.moving_avg`  | The average size of segment data, in bytes, downloaded in the last 20 downloads. |
| `download_speed_in_bytes_per_sec.moving_avg` | The average download speed, in bytes per second, of the last 20 downloads. |

#### translog

The `translog.upload` object contains the following fields.

|Field	|Description	|
|:---	|:---	|
| `last_successful_upload_timestamp`| The timestamp, in milliseconds, since the last translog file successfully uploaded to remote-backed storage. |
| `total_uploads.started` | The total number of attempted translog upload syncs to remote-backed storage. |
| `total_uploads.failed` | The total number of failed translog upload syncs to remote-backed storage.   |
| `total_uploads.succeeded` | The total number of successful translog upload syncs to remote-backed storage.  |
| `total_upload_size.started_bytes` | The total number of bytes of translog files actively being downloaded from remote-backed storage. |
| `total_upload_size.succeeded_bytes` | The total number of bytes of translog files successfully uploaded to remote-backed storage. |
|`total_upload_size.failed_bytes` | The total number of bytes of translog files that failed to upload to remote-backed storage. |
| `total_upload_time_in_millis` | The total amount of time spent, in milliseconds, uploading translog files to remote-backed storage. |
| `upload_size_in_bytes.moving_avg` | The average size of translog data, in bytes, uploaded in the last *N* downloads. *N* is defined in the `remote_store.moving_average_window_size` setting. |
| `upload_speed_in_bytes_per_sec.moving_avg` | The average speed of translog uploads, in bytes per second, for the last *N* uploads. *N* is defined in the `remote_store.moving_average_window_size` setting.    |
| `upload_time_in_millis.moving_avg` | The average amount of time taken by a single translog upload, in milliseconds, since the last *N* uploads. *N* is defined in the `remote_store.moving_average_window_size` setting.    |

The `translog.download` object contains the following fields.

|Field	|Description	|
|:---	|:---	|
| `last_successful_download_timestamp` | The timestamp, in milliseconds, since the last translog file successfully uploaded to remote-backed storage. |
| `total_downloads.succeeded` | The total number of successful translog download syncs from remote-backed storage. |
| `total_download_size.succeeded_bytes` | The total number of bytes of translog files successfully uploaded from remote-backed storage.  |
| `total_download_time_in_millis` | The total amount of time spent, in milliseconds, downloading translog files from remote-backed storage.  |
| `download_size_in_bytes.moving_avg`  | The average size of translog data, in bytes, downloaded in the last *N* downloads. *N* is defined in the `remote_store.moving_average_window_size` setting.    |
| `download_speed_in_bytes_per_sec.moving_avg` | The average speed of translog downloads, in bytes per second, for the last *N* uploads. *N* is defined in the `remote_store.moving_average_window_size` setting.   |
| `download_time_in_millis.moving_avg` |  The average amount of time taken by a single translog download, in milliseconds, since the last *N* uploads. *N* is defined in the `remote_store.moving_average_window_size` setting.  |

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

If you want to fetch only shards present on the node serving a Remote Store Stats API request, set the `local` query parameter to `true`, as shown in the following example request:


```json
GET _remotestore/stats/<index_name>?local=true
```
{% include copy-curl.html %}
