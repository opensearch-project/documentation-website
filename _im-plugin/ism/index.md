---
layout: default
title: Index State Management
nav_order: 16
has_children: true
redirect_from:
  - /im-plugin/ism/
has_toc: false
---

# Index State Management

If you analyze time-series data, you likely prioritize new data over old data. You might periodically perform certain operations on older indexes, such as reducing replica count or deleting them.

Index State Management (ISM) is a plugin that lets you automate these periodic, administrative operations by triggering them based on changes in the index age, index size, or number of documents. Using the ISM plugin, you can define *policies* that automatically handle index rollovers or deletions to fit your use case.

For example, you can define a policy that moves your index into a `read_only` state after 30 days and then deletes it after a set period of 90 days. You can also set up the policy to send you a notification message when the index is deleted.

You might want to perform an index rollover after a certain amount of time or run a `force_merge` operation on an index during off-peak hours to improve search performance during peak hours.

To use the ISM plugin, your user role needs to be mapped to the `all_access` role that gives you full access to the cluster. To learn more, see [Users and roles]({{site.url}}{{site.baseurl}}/security/access-control/users-roles/).
{: .note }

## Get started with ISM

To get started, choose **Index Management** in OpenSearch Dashboards.

### Step 1: Set up policies

A policy is a set of rules that describes how an index should be managed. For information about creating a policy, see [Policies]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies/).

You can use the visual editor or JSON editor to create policies. Compared to the JSON editor, the visual editor offers a more structured way of defining policies by separating the process into creating error notifications, defining ISM templates, and adding states. We recommend using the visual editor if you want to see predefined fields, such as which actions you can assign to a state or under what conditions a state can transition into a destination state.

#### Visual editor

1. Choose the **Index Policies** tab.
2. Choose **Create policy**.
3. Choose **Visual editor**.
4. In the **Policy info** section, enter a policy ID and an optional description.
5. In the **Error notification** section, set up an optional error notification that gets sent whenever a policy execution fails. For more information, see [Error notifications]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies#error-notifications). If you're using auto rollovers in your policy, we recommend setting up error notifications, which notify you of unexpectedly large indexes if rollovers fail.
6. In **ISM templates**, enter any ISM template patterns to automatically apply this policy to future indexes. For example, if you specify a template of `sample-index*`, the ISM plugin automatically applies this policy to any indexes whose names start with `sample-index`. Your pattern cannot contain any of the following characters: `:`, `"`, `+`, `/`, `\`, `|`, `?`, `#`, `>`, and `<`.
7. In **States**, add any states you want to include in the policy. Each state has [actions]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies/#actions) the plugin executes when the index enters a certain state, and [transitions]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies/#transitions), which have conditions that, when met, transition the index into a destination state. The first state you create in a policy is automatically set as the initial state. Each policy must have at least one state, but actions and transitions are optional.
8. Choose **Create**.


#### JSON editor

1. Choose the **Index Policies** tab.
2. Choose **Create policy**.
3. Choose **JSON editor**.
4. In the **Name policy** section, enter a policy ID.
5. In the **Define policy** section, enter your policy.
6. Choose **Create**.

After you create a policy, your next step is to attach it to an index or indexes.
You can set up an `ism_template` in the policy so when an index that matches the ISM template pattern is created, the plugin automatically attaches the policy to the index.

The following example demonstrates how to create a policy that automatically gets attached to all indexes whose names start with `index_name-`.

```json
PUT _plugins/_ism/policies/policy_id
{
  "policy": {
    "description": "Example policy.",
    "default_state": "...",
    "states": [...],
    "ism_template": {
      "index_patterns": ["index_name-*"],
      "priority": 100
    }
  }
}
```

If you have more than one template that matches an index pattern, ISM uses the priority value to determine which template to apply.

For an example ISM template policy, see [Sample policy with ISM template for auto rollover]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies#sample-policy-with-ism-template-for-auto-rollover).

Older versions of the plugin include the `policy_id` in an index template, so when an index is created that matches the index template pattern, the index will have the policy attached to it:

```json
PUT _index_template/<template_name>
{
  "index_patterns": [
    "index_name-*"
  ],
  "template": {
    "settings": {
      "opendistro.index_state_management.policy_id": "policy_id"
    }
  }
}
```

The `opendistro.index_state_management.policy_id` setting is deprecated. You can continue to automatically manage newly created indexes with the ISM template field.
{: .note }

### Step 2: Attach policies to indexes

1. Choose **indexes**.
2. Choose the index or indexes that you want to attach your policy to.
3. Choose **Apply policy**.
4. From the **Policy ID** menu, choose the policy that you created.
You can see a preview of your policy.
5. If your policy includes a rollover operation, specify a rollover alias.
Make sure that the alias that you enter already exists. For more information about the rollover operation, see [rollover]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies#rollover).
6. Choose **Apply**.

After you attach a policy to an index, ISM creates a job that runs every 5 minutes by default to perform policy actions, check conditions, and transition the index into different states. To change the default time interval for this job, see [Settings]({{site.url}}{{site.baseurl}}/im-plugin/ism/settings/).

ISM does not run jobs if the cluster state is red.

### Step 3: Manage indexes

1. Choose **Managed indexes**.
2. To change your policy, see [Change Policy]({{site.url}}{{site.baseurl}}/im-plugin/ism/managedindexes#change-policy).
3. To attach a rollover alias to your index, select your policy and choose **Add rollover alias**.
Make sure that the alias that you enter already exists. For more information about the rollover operation, see [rollover]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies#rollover).
4. To remove a policy, choose your policy, and then choose **Remove policy**.
5. To retry a policy, choose your policy, and then choose **Retry policy**.

For information about managing your policies, see [Managed indexes]({{site.url}}{{site.baseurl}}/im-plugin/ism/managedindexes/).

---

## Examples

To illustrate ISM's practical applications and use cases, the following examples demonstrate its capabilities and functionality in action.

In each of the following examples, the policy defines the different states an index can transition through based on age conditions. The actions specified in each state, like rollover, force merge, change replica counts, make indexes read-only or delete, are executed automatically by the ISM plugin.

The `ism_template` section specifies the index patterns to which this policy applies, so any newly created index matching that pattern will automatically have the policy attached.

You can attach these policies to existing indexes as well using the OpenSearch Dashboards user interface or APIs. The ISM plugin then runs periodic jobs to evaluate and execute the policies.

#### Log management

In log analytics, new data is constantly being generated and older logs become less relevant over time. You could create an ISM policy that:

- Rolls over the index every day/week to a new write index
- Transitions older indexes to read-only after 30 days
- Deletes indexes older than 90 days

```json
PUT _plugins/_ism/policies/metrics_management
{
  "policy": {
    "description": "Manage monthly metrics indices",
    "default_state": "hot",
    "states": [
      {
        "name": "hot",
        "actions": [
          {
            "rollover": {
              "min_size": "50GB"
            }
          }
        ],
        "transitions": [
          {
            "state_name": "warm",
            "conditions": {
              "min_index_age": "30d"
            }
          }
        ]
      },
      {
        "name": "warm",
        "actions": [
          {
            "force_merge": {
              "max_num_segments": 1
            }
          }
        ],
        "transitions": [
          {
            "state_name": "warm",
            "conditions": {
              "min_index_age": "30d"
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
        ]
      }
    ],
    "ism_template": {
      "index_patterns": [
        "metrics-*"
      ]
    }
  }
}
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand response 
  </summary>
  {: .text-delta}

```json
{
  "_id": "metrics_management",
  "_version": 1,
  "_primary_term": 1,
  "_seq_no": 0,
  "policy": {
    "policy": {
      "policy_id": "metrics_management",
      "description": "Manage monthly metrics indices",
      "last_updated_time": 1719870314383,
      "schema_version": 1,
      "error_notification": null,
      "default_state": "hot",
      "states": [
        {
          "name": "hot",
          "actions": [
            {
              "retry": {
                "count": 3,
                "backoff": "exponential",
                "delay": "1m"
              },
              "rollover": {
                "min_size": "50gb",
                "copy_alias": false
              }
            }
          ],
          "transitions": [
            {
              "state_name": "warm",
              "conditions": {
                "min_index_age": "30d"
              }
            }
          ]
        },
        {
          "name": "warm",
          "actions": [
            {
              "retry": {
                "count": 3,
                "backoff": "exponential",
                "delay": "1m"
              },
              "force_merge": {
                "max_num_segments": 1
              }
            }
          ],
          "transitions": [
            {
              "state_name": "warm",
              "conditions": {
                "min_index_age": "30d"
              }
            }
          ]
        },
        {
          "name": "delete",
          "actions": [
            {
              "retry": {
                "count": 3,
                "backoff": "exponential",
                "delay": "1m"
              },
              "delete": {}
            }
          ],
          "transitions": []
        }
      ],
      "ism_template": [
        {
          "index_patterns": [
            "metrics-*"
          ],
          "priority": 0,
          "last_updated_time": 1719870314383
        }
      ]
    }
  }
}
```

</details>


#### Time-series metrics

For an application that collects operational metrics (CPU, memory), the priority is usually on the newest data points for monitoring purposes. A policy could:

- Rollover the index monthly
- Force merge older indexes for better query performance
- Delete indexes older than 1 year

```json
PUT _plugins/_ism/policies/test_metrics_management
{
  "policy": {
    "description": "Manage monthly metrics indices",
    "default_state": "hot",
    "states": [
      {
        "name": "hot",
        "actions": [
          {
            "rollover": {
              "min_size": "50GB"
            }
          }
        ],
        "transitions": [
          {
            "state_name": "warm",
            "conditions": {
              "min_index_age": "30d"
            }
          }
        ]
      },
      {
        "name": "warm",
        "actions": [
          {
            "force_merge": {
              "max_num_segments": 1
            }
          }
        ],
        "transitions": [
          {
            "state_name": "delete",
            "conditions": {
              "min_index_age": "365d"
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
        ]
      }
    ],
    "ism_template": {
      "index_patterns": [
        "metrics-*"
      ],
      "priority": 100
    }
  }
}
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand response
  </summary>
  {: .text-delta}

```json
{
  "_id": "test_metrics_management",
  "_version": 1,
  "_primary_term": 1,
  "_seq_no": 88,
  "policy": {
    "policy": {
      "policy_id": "test_metrics_management",
      "description": "Manage monthly metrics indices",
      "last_updated_time": 1719874966725,
      "schema_version": 1,
      "error_notification": null,
      "default_state": "hot",
      "states": [
        {
          "name": "hot",
          "actions": [
            {
              "retry": {
                "count": 3,
                "backoff": "exponential",
                "delay": "1m"
              },
              "rollover": {
                "min_size": "50gb",
                "copy_alias": false
              }
            }
          ],
          "transitions": [
            {
              "state_name": "warm",
              "conditions": {
                "min_index_age": "30d"
              }
            }
          ]
        },
        {
          "name": "warm",
          "actions": [
            {
              "retry": {
                "count": 3,
                "backoff": "exponential",
                "delay": "1m"
              },
              "force_merge": {
                "max_num_segments": 1
              }
            }
          ],
          "transitions": [
            {
              "state_name": "delete",
              "conditions": {
                "min_index_age": "365d"
              }
            }
          ]
        },
        {
          "name": "delete",
          "actions": [
            {
              "retry": {
                "count": 3,
                "backoff": "exponential",
                "delay": "1m"
              },
              "delete": {}
            }
          ],
          "transitions": []
        }
      ],
      "ism_template": [
        {
          "index_patterns": [
            "metrics-*"
          ],
          "priority": 100,
          "last_updated_time": 1719874966725
        }
      ]
    }
  }
}
```

</details>


#### E-commerce data

An e-commerce site may want to keep order data hot/searchable for a certain period, then reduce operational overhead. You could implement:

- A policy that adds replica counts for recent orders (last 3 months)
- Transition older indexes to fewer replicas after 3 months
- Delete order data older than 2 years

```json
PUT _plugins/_ism/policies/orders_management
{
  "policy": {
    "description": "Manage e-commerce order indices",
    "default_state": "hot",
    "states": [
      {
        "name": "hot",
        "actions": [
          {
            "replica_count": {
              "number_of_replicas": 2
            }
          }
        ],
        "transitions": [
          {
            "state_name": "warm",
            "conditions": {
              "min_index_age": "90d"
            }
          }
        ]
      },
      {
        "name": "warm",
        "actions": [
          {
            "replica_count": {
              "number_of_replicas": 1
            }
          }
        ],
        "transitions": [
          {
            "state_name": "delete",
            "conditions": {
              "min_index_age": "730d"
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
        ]
      }
    ],
    "ism_template": {
      "index_patterns": [
        "orders-*"
      ]
    }
  }
}
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand response
  </summary>
  {: .text-delta}

```json
{
  "_id": "orders_management",
  "_version": 1,
  "_primary_term": 1,
  "_seq_no": 118,
  "policy": {
    "policy": {
      "policy_id": "orders_management",
      "description": "Manage e-commerce order indices",
      "last_updated_time": 1719875866391,
      "schema_version": 1,
      "error_notification": null,
      "default_state": "hot",
      "states": [
        {
          "name": "hot",
          "actions": [
            {
              "retry": {
                "count": 3,
                "backoff": "exponential",
                "delay": "1m"
              },
              "replica_count": {
                "number_of_replicas": 2
              }
            }
          ],
          "transitions": [
            {
              "state_name": "warm",
              "conditions": {
                "min_index_age": "90d"
              }
            }
          ]
        },
        {
          "name": "warm",
          "actions": [
            {
              "retry": {
                "count": 3,
                "backoff": "exponential",
                "delay": "1m"
              },
              "replica_count": {
                "number_of_replicas": 1
              }
            }
          ],
          "transitions": [
            {
              "state_name": "delete",
              "conditions": {
                "min_index_age": "730d"
              }
            }
          ]
        },
        {
          "name": "delete",
          "actions": [
            {
              "retry": {
                "count": 3,
                "backoff": "exponential",
                "delay": "1m"
              },
              "delete": {}
            }
          ],
          "transitions": []
        }
      ],
      "ism_template": [
        {
          "index_patterns": [
            "orders-*"
          ],
          "priority": 0,
          "last_updated_time": 1719875866390
        }
      ]
    }
  }
}
```

</details>
