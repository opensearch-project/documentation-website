---
layout: default
title: ISM API
parent: Index State Management
nav_order: 20
---

# ISM API

Use the index state management operations to programmatically work with policies and managed indexes.

---

#### Table of contents
- TOC
{:toc}


---


## Create policy
Introduced 1.0
{: .label .label-purple }

Creates a policy.

#### Example request

```json
PUT _plugins/_ism/policies/policy_1
{
  "policy": {
    "description": "ingesting logs",
    "default_state": "ingest",
    "states": [
      {
        "name": "ingest",
        "actions": [
          {
            "rollover": {
              "min_doc_count": 5
            }
          }
        ],
        "transitions": [
          {
            "state_name": "search"
          }
        ]
      },
      {
        "name": "search",
        "actions": [],
        "transitions": [
          {
            "state_name": "delete",
            "conditions": {
              "min_index_age": "5m"
            }
          }
        ]
      },
      {
        "name": "delete",
        "actions": [
          {
            "delete": {}
          }
        ],
        "transitions": []
      }
    ]
  }
}
```


#### Example response

```json
{
  "_id": "policy_1",
  "_version": 1,
  "_primary_term": 1,
  "_seq_no": 7,
  "policy": {
    "policy": {
      "policy_id": "policy_1",
      "description": "ingesting logs",
      "last_updated_time": 1577990761311,
      "schema_version": 1,
      "error_notification": null,
      "default_state": "ingest",
      "states": [
        {
          "name": "ingest",
          "actions": [
            {
              "rollover": {
                "min_doc_count": 5
              }
            }
          ],
          "transitions": [
            {
              "state_name": "search"
            }
          ]
        },
        {
          "name": "search",
          "actions": [],
          "transitions": [
            {
              "state_name": "delete",
              "conditions": {
                "min_index_age": "5m"
              }
            }
          ]
        },
        {
          "name": "delete",
          "actions": [
            {
              "delete": {}
            }
          ],
          "transitions": []
        }
      ]
    }
  }
}
```


---

## Add policy
Introduced 1.0
{: .label .label-purple }

Adds a policy to an index. This operation does not change the policy if the index already has one.

#### Example request

```json
POST _plugins/_ism/add/index_1
{
  "policy_id": "policy_1"
}
```

#### Example response

```json
{
  "updated_indices": 1,
  "failures": false,
  "failed_indices": []
}
```

If you use a wildcard `*` while adding a policy to an index, the ISM plugin interprets `*` as all indexes, including system indexes like `.opendistro-security`, which stores users, roles, and tenants. A delete action in your policy might accidentally delete all user roles and tenants in your cluster.
Don't use the broad `*` wildcard, and instead add a prefix, such as `my-logs*`, when specifying indexes with the `_ism/add` API.
{: .warning }

---


## Update policy
Introduced 1.0
{: .label .label-purple }

Updates a policy. Use the `seq_no` and `primary_term` parameters to update an existing policy. If these numbers don't match the existing policy or the policy doesn't exist, ISM throws an error.

It's possible that the policy currently applied to your index isn't the most up-to-date policy available. To see what policy is currently applied to your index, see [Explain index]({{site.url}}{{site.baseurl}}/im-plugin/ism/api/#explain-index). To get the most up-to-date version of a policy, see [Get policy]({{site.url}}{{site.baseurl}}/im-plugin/ism/api/#get-policy).

#### Example request

```json
PUT _plugins/_ism/policies/policy_1?if_seq_no=7&if_primary_term=1
{
  "policy": {
    "description": "ingesting logs",
    "default_state": "ingest",
    "states": [
      {
        "name": "ingest",
        "actions": [
          {
            "rollover": {
              "min_doc_count": 5
            }
          }
        ],
        "transitions": [
          {
            "state_name": "search"
          }
        ]
      },
      {
        "name": "search",
        "actions": [],
        "transitions": [
          {
            "state_name": "delete",
            "conditions": {
              "min_index_age": "5m"
            }
          }
        ]
      },
      {
        "name": "delete",
        "actions": [
          {
            "delete": {}
          }
        ],
        "transitions": []
      }
    ]
  }
}
```


#### Example response

```json
{
  "_id": "policy_1",
  "_version": 2,
  "_primary_term": 1,
  "_seq_no": 10,
  "policy": {
    "policy": {
      "policy_id": "policy_1",
      "description": "ingesting logs",
      "last_updated_time": 1577990934044,
      "schema_version": 1,
      "error_notification": null,
      "default_state": "ingest",
      "states": [
        {
          "name": "ingest",
          "actions": [
            {
              "rollover": {
                "min_doc_count": 5
              }
            }
          ],
          "transitions": [
            {
              "state_name": "search"
            }
          ]
        },
        {
          "name": "search",
          "actions": [],
          "transitions": [
            {
              "state_name": "delete",
              "conditions": {
                "min_index_age": "5m"
              }
            }
          ]
        },
        {
          "name": "delete",
          "actions": [
            {
              "delete": {}
            }
          ],
          "transitions": []
        }
      ]
    }
  }
}
```


---

## Get policy
Introduced 1.0
{: .label .label-purple }

Gets the policy by `policy_id`.

#### Example request

```json
GET _plugins/_ism/policies/policy_1
```


#### Example response

```json
{
  "_id": "policy_1",
  "_version": 2,
  "_seq_no": 10,
  "_primary_term": 1,
  "policy": {
    "policy_id": "policy_1",
    "description": "ingesting logs",
    "last_updated_time": 1577990934044,
    "schema_version": 1,
    "error_notification": null,
    "default_state": "ingest",
    "states": [
      {
        "name": "ingest",
        "actions": [
          {
            "rollover": {
              "min_doc_count": 5
            }
          }
        ],
        "transitions": [
          {
            "state_name": "search"
          }
        ]
      },
      {
        "name": "search",
        "actions": [],
        "transitions": [
          {
            "state_name": "delete",
            "conditions": {
              "min_index_age": "5m"
            }
          }
        ]
      },
      {
        "name": "delete",
        "actions": [
          {
            "delete": {}
          }
        ],
        "transitions": []
      }
    ]
  }
}
```

---

## Remove policy from index
Introduced 1.0
{: .label .label-purple }

Removes any ISM policy from the index.

#### Example request

```json
POST _plugins/_ism/remove/index_1
```


#### Example response

```json
{
  "updated_indices": 1,
  "failures": false,
  "failed_indices": []
}
```

---

## Update managed index policy
Introduced 1.0
{: .label .label-purple }

Updates the managed index policy to a new policy (or to a new version of the policy). You can use an index pattern to update multiple indexes at once. When updating multiple indexes, you might want to include a state filter to only affect certain managed indexes. The change policy filters out all the existing managed indexes and only applies the change to the ones in the state that you specify. You can also explicitly specify the state that the managed index transitions to after the change policy takes effect.

A policy change is an asynchronous background process. The changes are queued and are not executed immediately by the background process. This delay in execution protects the currently running managed indexes from being put into a broken state. If the policy you are changing to has only some small configuration changes, then the change takes place immediately. For example, if the policy changes the `min_index_age` parameter in a rollover condition from `1000d` to `100d`, this change takes place immediately in its next execution. If the change modifies the state, actions, or the order of actions of the current state the index is in, then the change happens at the end of its current state before transitioning to a new state.

In this example, the policy applied on the `index_1` index is changed to `policy_1`, which could either be a completely new policy or an updated version of its existing policy. The process only applies the change if the index is currently in the `searches` state. After this change in policy takes place, `index_1` transitions to the `delete` state.

#### Example request

```json
POST _plugins/_ism/change_policy/index_1
{
  "policy_id": "policy_1",
  "state": "delete",
  "include": [
    {
      "state": "searches"
    }
  ]
}
```


#### Example response

```json
{
  "updated_indices": 0,
  "failures": false,
  "failed_indices": []
}
```

---

## Retry failed index
Introduced 1.0
{: .label .label-purple }

Retries the failed action for an index. For the retry call to succeed, ISM must manage the index, and the index must be in a failed state. You can use index patterns (`*`) to retry multiple failed indexes.

#### Example request

```json
POST _plugins/_ism/retry/index_1
{
  "state": "delete"
}
```


#### Example response

```json
{
  "updated_indices": 0,
  "failures": false,
  "failed_indices": []
}
```

---

## Explain index
Introduced 1.0
{: .label .label-purple }

Gets the current state of the index. You can use index patterns to get the status of multiple indexes.

#### Example request

```json
GET _plugins/_ism/explain/index_1
```


#### Example response

```json
{
  "index_1": {
    "index.plugins.index_state_management.policy_id": "policy_1"
  }
}
```

Optionally, you can add the `show_policy` parameter to your request's path to get the policy that is currently applied to your index, which is useful for seeing whether the policy applied to your index is the latest one. To get the most up-to-date policy, see [Get Policy API]({{site.url}}{{site.baseurl}}/im-plugin/ism/api/#get-policy).

#### Example request

```json
GET _plugins/_ism/explain/index_1?show_policy=true
```

#### Example response

```json
{
  "index_1": {
    "index.plugins.index_state_management.policy_id": "sample-policy",
    "index.opendistro.index_state_management.policy_id": "sample-policy",
    "index": "index_1",
    "index_uuid": "gCFlS_zcTdih8xyxf3jQ-A",
    "policy_id": "sample-policy",
    "enabled": true,
    "policy": {
      "policy_id": "sample-policy",
      "description": "ingesting logs",
      "last_updated_time": 1647284980148,
      "schema_version": 13,
      "error_notification": null,
      "default_state": "ingest",
      "states": [...],
      "ism_template": null
    }
  },
  "total_managed_indices": 1
}
```

The `plugins.index_state_management.policy_id` setting is deprecated starting from ODFE version 1.13.0. We retain this field in the response API for consistency.

---

## Delete policy
Introduced 1.0
{: .label .label-purple }

Deletes the policy by `policy_id`.

#### Example request

```json
DELETE _plugins/_ism/policies/policy_1
```


#### Example response

```json
{
  "_index": ".opendistro-ism-config",
  "_id": "policy_1",
  "_version": 3,
  "result": "deleted",
  "forced_refresh": true,
  "_shards": {
    "total": 2,
    "successful": 2,
    "failed": 0
  },
  "_seq_no": 15,
  "_primary_term": 1
}
```

## Error prevention validation
Introduced 2.4
{: .label .label-purple }

ISM allows you to run an action automatically. However, running an action can fail for a variety of reasons. You can use error prevention validation to test an action in order to rule out failures.

To enable error prevention validation, set the `plugins.index_state_management.validation_service.enabled` setting to `true`:

```bash
PUT _cluster/settings
{
   "persistent":{
      "plugins.index_state_management.validation_action.enabled": true
   }
}
```

#### Example response

```json
{
  "acknowledged" : true,
  "persistent" : {
    "plugins" : {
      "index_state_management" : {
        "validation_action" : {
          "enabled" : "true"
        }
      }
    }
  },
  "transient" : { }
}
```

To check an error prevention validation status and message, pass `validate_action=true` to the `_plugins/_ism/explain` endpoint:

```bash
GET _plugins/_ism/explain/test-000001?validate_action=true
```

#### Example response

The response contains an additional validate object with a validation message and status:

```json
{
  "test-000001" : {
    "index.plugins.index_state_management.policy_id" : "test_rollover",
    "index.opendistro.index_state_management.policy_id" : "test_rollover",
    "index" : "test-000001",
    "index_uuid" : "CgKsxFmQSIa8dWqpbSJmyA",
    "policy_id" : "test_rollover",
    "policy_seq_no" : -2,
    "policy_primary_term" : 0,
    "rolled_over" : false,
    "index_creation_date" : 1667410460649,
    "state" : {
      "name" : "rollover",
      "start_time" : 1667410766045
    },
    "action" : {
      "name" : "rollover",
      "start_time" : 1667411127803,
      "index" : 0,
      "failed" : false,
      "consumed_retries" : 0,
      "last_retry_time" : 0
    },
    "step" : {
      "name" : "attempt_rollover",
      "start_time" : 1667411127803,
      "step_status" : "starting"
    },
    "retry_info" : {
      "failed" : true,
      "consumed_retries" : 0
    },
    "info" : {
      "message" : "Previous action was not able to update IndexMetaData."
    },
    "enabled" : false,
    "validate" : {
      "validation_message" : "Missing rollover_alias index setting [index=test-000001]",
      "validation_status" : "re_validating"
    }
  },
  "total_managed_indices" : 1
}
```

If you pass `validate_action=false` or do not pass a `validate_action` value to the `_plugins/_ism/explain` endpoint, the response will not contain an error prevention validation status and message:

```bash
GET _plugins/_ism/explain/test-000001?validate_action=false
```

Or:

```bash
GET _plugins/_ism/explain/test-000001
```

#### Example response

```json
{
  "test-000001" : {
    "index.plugins.index_state_management.policy_id" : "test_rollover",
    "index.opendistro.index_state_management.policy_id" : "test_rollover",
    "index" : "test-000001",
    "index_uuid" : "CgKsxFmQSIa8dWqpbSJmyA",
    "policy_id" : "test_rollover",
    "policy_seq_no" : -2,
    "policy_primary_term" : 0,
    "rolled_over" : false,
    "index_creation_date" : 1667410460649,
    "state" : {
      "name" : "rollover",
      "start_time" : 1667410766045
    },
    "action" : {
      "name" : "rollover",
      "start_time" : 1667411127803,
      "index" : 0,
      "failed" : false,
      "consumed_retries" : 0,
      "last_retry_time" : 0
    },
    "step" : {
      "name" : "attempt_rollover",
      "start_time" : 1667411127803,
      "step_status" : "starting"
    },
    "retry_info" : {
      "failed" : true,
      "consumed_retries" : 0
    },
    "info" : {
      "message" : "Previous action was not able to update IndexMetaData."
    },
    "enabled" : false
  },
  "total_managed_indices" : 1
}
```