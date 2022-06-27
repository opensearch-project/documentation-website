---
layout: default
title: Snapshot management API
parent: Snapshots
nav_order: 30
has_children: false
---

# Snapshot management API

Use [snapshot management (SM)]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore#take-snapshots) API to automate [taking snapshots]({{site.url}}{{site.baseurl}}/opensearch/snapshots/snapshot-restore#take-snapshots). 

---

#### Table of contents
- TOC
{:toc}


---

## Create or update a policy
Introduced 2.1
{: .label .label-purple }

Creates or updates an SM policy.

#### Request

Create:

```json
POST _plugins/_sm/policies/<policy_name> 
```

Update:

```json
PUT _plugins/_sm/policies/<policy_name>?if_seq_no=0&if_primary_term=1
```

You must provide the `seq_no` and `primary_term` parameters for an update request.

You cannot update policy_name since it's used as an SM policy ID.
{: .note}

### Example

```json
POST _plugins/_sm/policies/daily-policy
{
	"description" : "Daily snapshot policy",
	"creation" : {
		"schedule" : {
			"cron" : {
				"expression" : "0 8 * * *",
				"timezone" : "UTC"
			}
		},
		"time_limit" : "1h"
	},
	"deletion" : {
		"schedule" : {
			"cron" : {
				"expression" : "0 1 * * *",
				"timezone" : "America/Los_Angeles"
			}
		},
		"condition" : {
			"max_age" : "7d",
			"max_count" : 21,
			"min_count" : 7
		},
		"time_limit" : "1h"
	},
	"snapshot_config" : {
		"date_format" : "yyyy-MM-dd-HH:mm",
		"indices" : "*",
		"repository" : "s3-repo",
		"ignore_unavailable" : "true",
		"include_global_state" : "false",
		"partial" : "true",
		"metadata" : {
			"any_key" : "any_value"
		}
	}
}
```

### Response

```json
{
  "_id" : "daily-policy-sm-policy",
  "_version" : 1,
  "_seq_no" : 44342,
  "_primary_term" : 19,
  "sm_policy" : {
    "name" : "daily-policy",
    "description" : "Daily snapshot policy",
    "schema_version" : 15,
    "creation" : {
      "schedule" : {
        "cron" : {
          "expression" : "0 8 * * *",
          "timezone" : "UTC"
        }
      },
      "time_limit" : "1h"
    },
    "deletion" : {
      "schedule" : {
        "cron" : {
          "expression" : "0 1 * * *",
          "timezone" : "America/Los_Angeles"
        }
      },
      "condition" : {
        "max_age" : "7d",
        "min_count" : 7,
        "max_count" : 21
      },
      "time_limit" : "1h"
    },
    "snapshot_config" : {
      "indices" : "*",
      "metadata" : {
        "any_key" : "any_value"
      },
      "ignore_unavailable" : "true",
      "include_global_state" : "false",
      "date_format" : "yyyy-MM-dd-HH:mm",
      "repository" : "s3-repo",
      "partial" : "true"
    },
    "schedule" : {
      "interval" : {
        "start_time" : 1656337332402,
        "period" : 1,
        "unit" : "Minutes"
      }
    },
    "enabled" : true,
    "last_updated_time" : 1656337332403,
    "enabled_time" : 1656337332402
  }
}
```

### Parameters

You can specify the following parameters to create/update an SM policy.

Parameter | Type | Description 
:--- | :--- |:--- |:--- |
`description` | String | The description of the SM policy. Required.
`enabled` | Boolean | Should this SM policy be enabled at creation. Optional.
`schedule` | String | The cron schedule to automatically create snapshots with this SM policy. Required.
`snapshot_config` | Object | The configuration options for snapshot creation. Required.
`snapshot_config.date_format` | String | Specifies the date format for the snapshot. Optional. Default is empty.
`snapshot_config.indices` | String | The names of the indices in the snapshot. Multiple index names are separated by `,`. Supports wildcards (`*`). Optional. Default is `*` (all indices).
`snapshot_config.repository` | String | The repository to store snapshots. Required.
`snapshot_config.ignore_unavailable` | Boolean | Ignore unavailable indices? Optional. Default is `false`.
`snapshot_config.include_global_state` | Boolean | Include cluster state? Optional. Default is `true`.
`snapshot_config.partial` | Boolean | Allow partial snapshots? Optional. Default is `false`.
`snapshot_config.metadata` | Object | Metadata in the form of key/value pairs. Optional.
`creation` | Object | Configuration for snapshot creation. Required.
`creation.schedule` | String | The cron schedule to create snapshots. Required.
`creation.time_limit` | String | If creating a snapshot takes longer than time_limit, retry at the next scheduled time. Optional. 
`deletion` | Object | Configuration for snapshot deletion. Optional. Default is to retain all snapshots.
`deletion.schedule` | String | The cron schedule to delete snapshots. Optional.
`deletion.time_limit` | String | If deleting a snapshot takes longer than time_limit, retry at the next scheduled time. Optional. 
`deletion.delete_condition` | Object | Conditions for snapshot deletion. 
`deletion.delete_condition.max_count` | Integer | The maximum number of snapshots to be retained. Optional.
`deletion.delete_condition.max_age` | String | The maximum time a snapshot is retained. Optional.
`deletion.delete_condition.min_count` | Integer | The minimum number of snapshots to be retained. Optional. Default is one.

## Get policies
Introduced 2.1
{: .label .label-purple }

Gets SM policies.

#### Request

Get all SM policies:

```json
GET _plugins/_sm/policies
```
You can use a [query string]({{site.url}}{{site.baseurl}}/opensearch//query-dsl/full-text/#query-string) and specify pagination, the field to be sorted by, and sort order:

```json
GET _plugins/_sm/policies?from=0&size=20&sortField=sm_policy.name&sortOrder=desc&queryString=*
```

Get a specific SM policy:

```
GET _plugins/_sm/policies/<policy_name>
```

### Example

```json
GET _plugins/_sm/policies/daily-policy
```

### Response

```json
{
  "_id" : "daily-policy-sm-policy",
  "_version" : 6,
  "_seq_no" : 44696,
  "_primary_term" : 19,
  "sm_policy" : {
    "name" : "daily-policy",
    "description" : "Daily snapshot policy",
    "schema_version" : 15,
    "creation" : {
      "schedule" : {
        "cron" : {
          "expression" : "0 8 * * *",
          "timezone" : "UTC"
        }
      },
      "time_limit" : "1h"
    },
    "deletion" : {
      "schedule" : {
        "cron" : {
          "expression" : "0 1 * * *",
          "timezone" : "America/Los_Angeles"
        }
      },
      "condition" : {
        "max_age" : "7d",
        "min_count" : 7,
        "max_count" : 21
      },
      "time_limit" : "1h"
    },
    "snapshot_config" : {
      "metadata" : {
        "any_key" : "any_value"
      },
      "ignore_unavailable" : "true",
      "include_global_state" : "false",
      "date_format" : "yyyy-MM-dd-HH:mm",
      "repository" : "s3-repo",
      "partial" : "true"
    },
    "schedule" : {
      "interval" : {
        "start_time" : 1656341042874,
        "period" : 1,
        "unit" : "Minutes"
      }
    },
    "enabled" : true,
    "last_updated_time" : 1656341042874,
    "enabled_time" : 1656341042874
  }
}
```

## Explain
Introduced 2.1
{: .label .label-purple }

Provides the enabled/disabled status and the metadata for all policies specified. Multiple policy names are separated with `,`. You can also specify desired policies with a wildcard pattern.  

#### Request

```json
GET _plugins/_sm/policies/<policy_names>/_explain
```

### Example

```json
GET _plugins/_sm/policies/daily*/_explain
```

### Response

```json
{
  "policies" : [
    {
      "name" : "daily-policy",
      "creation" : {
        "current_state" : "CREATION_START",
        "trigger" : {
          "time" : 1656403200000
        }
      },
      "deletion" : {
        "current_state" : "DELETION_START",
        "trigger" : {
          "time" : 1656403200000
        }
      },
      "policy_seq_no" : 44696,
      "policy_primary_term" : 19,
      "enabled" : true
    }
  ]
}
```

## Start a policy
Introduced 2.1
{: .label .label-purple }

Sets the `enabled` flag to `true` for an SM policy. The policy will run at the next scheduled time.

#### Request

```json
POST  _plugins/_sm/policies/<policy_name>/_start
```

### Example

```json
POST  _plugins/_sm/policies/daily-policy/_start
```

### Response

```json
{
  "acknowledged" : true
}
```

## Stop a policy
Introduced 2.1
{: .label .label-purple }

Sets the `enabled` flag to `false` for an SM policy. The policy will not run until you [start](#start-an-sm-policy) it.

#### Request

```json
POST  _plugins/_sm/policies/<policy_name>/_stop
```

### Example

```json
POST  _plugins/_sm/policies/daily-policy/_stop
```

### Response

```json
{
  "acknowledged" : true
}
```

## Delete a policy
Introduced 2.1
{: .label .label-purple }

Deletes the specified SM policy.

#### Request

```json
DELETE  _plugins/_sm/policies/<policy_name>
```

### Example

```json
DELETE _plugins/_sm/policies/daily-policy
```

### Response

```json
{
  "_index" : ".opendistro-ism-config",
  "_id" : "daily-policy-sm-policy",
  "_version" : 8,
  "result" : "deleted",
  "forced_refresh" : true,
  "_shards" : {
    "total" : 2,
    "successful" : 2,
    "failed" : 0
  },
  "_seq_no" : 45366,
  "_primary_term" : 20
}
```