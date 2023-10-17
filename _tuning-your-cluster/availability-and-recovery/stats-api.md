---
layout: default
title: Stats API
parent: Shard indexing backpressure
nav_order: 2
grand_parent: Availability and recovery
has_children: false
redirect_from: 
  - /opensearch/stats-api/
---

# Stats API

Use the stats operation to monitor shard indexing backpressure.

## Stats
Introduced 1.2
{: .label .label-purple }

Returns node-level and shard-level stats for indexing request rejections.

#### Request

```json
GET _nodes/_local/stats/shard_indexing_pressure
```

If `enforced` is `true`:

#### Example response

```json
{
  "_nodes": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "cluster_name": "runTask",
  "nodes": {
    "q3e1dQjFSqyPSLAgpyQlfw": {
      "timestamp": 1613072111162,
      "name": "runTask-0",
      "transport_address": "127.0.0.1:9300",
      "host": "127.0.0.1",
      "ip": "127.0.0.1:9300",
      "roles": [
        "data",
        "ingest",
        "cluster_manager",
        "remote_cluster_client"
      ],
      "attributes": {
        "testattr": "test"
      },
      "shard_indexing_pressure": {
        "stats": {
          "[index_name][0]": {
            "memory": {
              "current": {
                "coordinating_in_bytes": 0,
                "primary_in_bytes": 0,
                "replica_in_bytes": 0
              },
              "total": {
                "coordinating_in_bytes": 299,
                "primary_in_bytes": 299,
                "replica_in_bytes": 0
              }
            },
            "rejection": {
              "coordinating": {
                "coordinating_rejections": 0,
                "breakup": {
                  "node_limits": 0,
                  "no_successful_request_limits": 0,
                  "throughput_degradation_limits": 0
                }
              },
              "primary": {
                "primary_rejections": 0,
                "breakup": {
                  "node_limits": 0,
                  "no_successful_request_limits": 0,
                  "throughput_degradation_limits": 0
                }
              },
              "replica": {
                "replica_rejections": 0,
                "breakup": {
                  "node_limits": 0,
                  "no_successful_request_limits": 0,
                  "throughput_degradation_limits": 0
                }
              }
            },
            "last_successful_timestamp": {
              "coordinating_last_successful_request_timestamp_in_millis": 1613072107990,
              "primary_last_successful_request_timestamp_in_millis": 0,
              "replica_last_successful_request_timestamp_in_millis": 0
            },
            "indexing": {
              "coordinating_time_in_millis": 96,
              "coordinating_count": 1,
              "primary_time_in_millis": 0,
              "primary_count": 0,
              "replica_time_in_millis": 0,
              "replica_count": 0
            },
            "memory_allocation": {
              "current": {
                "current_coordinating_and_primary_bytes": 0,
                "current_replica_bytes": 0
              },
              "limit": {
                "current_coordinating_and_primary_limits_in_bytes": 51897,
                "current_replica_limits_in_bytes": 77845
              }
            }
          }
        },
        "total_rejections_breakup": {
          "node_limits": 0,
          "no_successful_request_limits": 0,
          "throughput_degradation_limits": 0
        },
        "enabled": true,
        "enforced" : true
      }
    }
  }
}
```

If `enforced` is `false`:

#### Example response

```json
{
  "_nodes": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "cluster_name": "runTask",
  "nodes": {
    "q3e1dQjFSqyPSLAgpyQlfw": {
      "timestamp": 1613072111162,
      "name": "runTask-0",
      "transport_address": "127.0.0.1:9300",
      "host": "127.0.0.1",
      "ip": "127.0.0.1:9300",
      "roles": [
        "data",
        "ingest",
        "cluster_manager",
        "remote_cluster_client"
      ],
      "attributes": {
        "testattr": "test"
      },
      "shard_indexing_pressure": {
        "stats": {
          "[index_name][0]": {
            "memory": {
              "current": {
                "coordinating_in_bytes": 0,
                "primary_in_bytes": 0,
                "replica_in_bytes": 0
              },
              "total": {
                "coordinating_in_bytes": 299,
                "primary_in_bytes": 299,
                "replica_in_bytes": 0
              }
            },
            "rejection": {
              "coordinating": {
                "coordinating_rejections": 0,
                "breakup_shadow_mode": {
                  "node_limits": 0,
                  "no_successful_request_limits": 0,
                  "throughput_degradation_limits": 0
                }
              },
              "primary": {
                "primary_rejections": 0,
                "breakup_shadow_mode": {
                  "node_limits": 0,
                  "no_successful_request_limits": 0,
                  "throughput_degradation_limits": 0
                }
              },
              "replica": {
                "replica_rejections": 0,
                "breakup_shadow_mode": {
                  "node_limits": 0,
                  "no_successful_request_limits": 0,
                  "throughput_degradation_limits": 0
                }
              }
            },
            "last_successful_timestamp": {
              "coordinating_last_successful_request_timestamp_in_millis": 1613072107990,
              "primary_last_successful_request_timestamp_in_millis": 0,
              "replica_last_successful_request_timestamp_in_millis": 0
            },
            "indexing": {
              "coordinating_time_in_millis": 96,
              "coordinating_count": 1,
              "primary_time_in_millis": 0,
              "primary_count": 0,
              "replica_time_in_millis": 0,
              "replica_count": 0
            },
            "memory_allocation": {
              "current": {
                "current_coordinating_and_primary_bytes": 0,
                "current_replica_bytes": 0
              },
              "limit": {
                "current_coordinating_and_primary_limits_in_bytes": 51897,
                "current_replica_limits_in_bytes": 77845
              }
            }
          }
        },
        "total_rejections_breakup_shadow_mode": {
          "node_limits": 0,
          "no_successful_request_limits": 0,
          "throughput_degradation_limits": 0
        },
        "enabled": true,
        "enforced" : false
      }
    }
  }
}
```

To include all the shards with both active and previous write operations performed on them, specify the `include_all` parameter:

#### Request

```json
GET _nodes/_local/stats/shard_indexing_pressure?include_all
```

#### Example response

```json
{
  "_nodes": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "cluster_name": "runTask",
  "nodes": {
    "q3e1dQjFSqyPSLAgpyQlfw": {
      "timestamp": 1613072198171,
      "name": "runTask-0",
      "transport_address": "127.0.0.1:9300",
      "host": "127.0.0.1",
      "ip": "127.0.0.1:9300",
      "roles": [
        "data",
        "ingest",
        "cluster_manager",
        "remote_cluster_client"
      ],
      "attributes": {
        "testattr": "test"
      },
      "shard_indexing_pressure": {
        "stats": {
          "[index_name][0]": {
            "memory": {
              "current": {
                "coordinating_in_bytes": 0,
                "primary_in_bytes": 0,
                "replica_in_bytes": 0
              },
              "total": {
                "coordinating_in_bytes": 604,
                "primary_in_bytes": 604,
                "replica_in_bytes": 0
              }
            },
            "rejection": {
              "coordinating": {
                "coordinating_rejections": 0,
                "breakup": {
                  "node_limits": 0,
                  "no_successful_request_limits": 0,
                  "throughput_degradation_limits": 0
                }
              },
              "primary": {
                "primary_rejections": 0,
                "breakup": {
                  "node_limits": 0,
                  "no_successful_request_limits": 0,
                  "throughput_degradation_limits": 0
                }
              },
              "replica": {
                "replica_rejections": 0,
                "breakup": {
                  "node_limits": 0,
                  "no_successful_request_limits": 0,
                  "throughput_degradation_limits": 0
                }
              }
            },
            "last_successful_timestamp": {
              "coordinating_last_successful_request_timestamp_in_millis": 1613072194656,
              "primary_last_successful_request_timestamp_in_millis": 0,
              "replica_last_successful_request_timestamp_in_millis": 0
            },
            "indexing": {
              "coordinating_time_in_millis": 145,
              "coordinating_count": 2,
              "primary_time_in_millis": 0,
              "primary_count": 0,
              "replica_time_in_millis": 0,
              "replica_count": 0
            },
            "memory_allocation": {
              "current": {
                "current_coordinating_and_primary_bytes": 0,
                "current_replica_bytes": 0
              },
              "limit": {
                "current_coordinating_and_primary_limits_in_bytes": 51897,
                "current_replica_limits_in_bytes": 77845
              }
            }
          }
        },
        "total_rejections_breakup": {
          "node_limits": 0,
          "no_successful_request_limits": 0,
          "throughput_degradation_limits": 0
        },
        "enabled": true,
        "enforced": true
      }
    }
  }
}
```

To get only all the top-level aggregated stats, specify the `top` parameter (skips the per-shard stats).

#### Request

```json
GET _nodes/_local/stats/shard_indexing_pressure?top
```

If `enforced` is `true`:

#### Example response

```json
{
  "_nodes": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "cluster_name": "runTask",
  "nodes": {
    "q3e1dQjFSqyPSLAgpyQlfw": {
      "timestamp": 1613072382719,
      "name": "runTask-0",
      "transport_address": "127.0.0.1:9300",
      "host": "127.0.0.1",
      "ip": "127.0.0.1:9300",
      "roles": [
        "data",
        "ingest",
        "cluster_manager",
        "remote_cluster_client"
      ],
      "attributes": {
        "testattr": "test"
      },
      "shard_indexing_pressure": {
        "stats": {},
        "total_rejections_breakup": {
          "node_limits": 0,
          "no_successful_request_limits": 0,
          "throughput_degradation_limits": 0
        },
        "enabled": true,
        "enforced": true
      }
    }
  }
}
```

If `enforced` is `false`:

#### Example response

```json
{
  "_nodes": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "cluster_name": "runTask",
  "nodes": {
    "q3e1dQjFSqyPSLAgpyQlfw": {
      "timestamp": 1613072382719,
      "name": "runTask-0",
      "transport_address": "127.0.0.1:9300",
      "host": "127.0.0.1",
      "ip": "127.0.0.1:9300",
      "roles": [
        "data",
        "ingest",
        "cluster_manager",
        "remote_cluster_client"
      ],
      "attributes": {
        "testattr": "test"
      },
      "shard_indexing_pressure": {
        "stats": {},
        "total_rejections_breakup_shadow_mode": {
          "node_limits": 0,
          "no_successful_request_limits": 0,
          "throughput_degradation_limits": 0
        },
        "enabled": true,
        "enforced" : false
      }
    }
  }
}
```

To get the shard-level breakup of rejections for every node (only includes shards with active write operations):

#### Request

```json
GET _nodes/stats/shard_indexing_pressure
```

#### Example response

```json
{
  "_nodes": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "cluster_name": "runTask",
  "nodes": {
    "q3e1dQjFSqyPSLAgpyQlfw": {
      "timestamp": 1613072382719,
      "name": "runTask-0",
      "transport_address": "127.0.0.1:9300",
      "host": "127.0.0.1",
      "ip": "127.0.0.1:9300",
      "roles": [
        "data",
        "ingest",
        "cluster_manager",
        "remote_cluster_client"
      ],
      "attributes": {
        "testattr": "test"
      },
      "shard_indexing_pressure": {
        "stats": {},
        "total_rejections_breakup": {
          "node_limits": 0,
          "no_successful_request_limits": 0,
          "throughput_degradation_limits": 0
        },
        "enabled": true,
        "enforced": true
      }
    }
  }
}
```
