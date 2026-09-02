---
layout: default
title: Policy examples
nav_order: 20
parent: Policies
grand_parent: Index State Management
has_children: false
---

# Policy examples

This page contains several examples of complete policies in JSON format.

For a description of the components of a policy, see [Policies]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies/).

To find out how to manage policies from OpenSearch Dashboards, see [ISM with OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/im-plugin/ism/dash-ism/).

To find out how to manage policies using APIs, see [ISM API]({{site.url}}{{site.baseurl}}/im-plugin/ism/api-ism/).


## Sample policy with ISM template for auto rollover

The following sample template policy is for a rollover use case.

If you want to skip rollovers for an index, set `index.plugins.index_state_management.rollover_skip` to `true` in the settings of that index.

1. Create a policy with an `ism_template` field:

   ```json
   PUT _plugins/_ism/policies/rollover_policy
   {
     "policy": {
       "description": "Example rollover policy.",
       "default_state": "rollover",
       "states": [
         {
           "name": "rollover",
           "actions": [
             {
               "rollover": {
                 "min_doc_count": 1
               }
             }
           ],
           "transitions": []
         }
       ],
       "ism_template": {
         "index_patterns": ["log*"],
         "priority": 100
       }
     }
   }
   ```
   {% include copy-curl.html %}

   You need to specify the `index_patterns` field. If you don't specify a value for `priority`, it defaults to 0.

2. Set up a template with the `rollover_alias` as `log` :

   ```json
   PUT _index_template/ism_rollover
   {
     "index_patterns": ["log*"],
     "template": {
      "settings": {
       "plugins.index_state_management.rollover_alias": "log"
      }
    }
   }
   ```
   {% include copy-curl.html %}

3. Create an index with the `log` alias:

   ```json
   PUT log-000001
   {
     "aliases": {
       "log": {
         "is_write_index": true
       }
     }
   }
   ```
   {% include copy-curl.html %}

4. Index a document to trigger the rollover condition:

   ```json
   POST log/_doc
   {
     "message": "dummy"
   }
   ```
   {% include copy-curl.html %}

5. Verify if the policy is attached to the `log-000001` index:

   ```json
   GET _plugins/_ism/explain/log-000001?pretty
   ```
   {% include copy-curl.html %}

## Example policy with ISM templates for the alias action

The following example policy is for an alias action use case.

In the following example, the first job will trigger the rollover action, and a new index will be created. Next, another document is added to the two indexes. The new job will then cause the second index to point to the log alias, and the older index will be removed due to the alias action.

First, create an ISM policy:

```json
PUT /_plugins/_ism/policies/rollover_policy?pretty
{
  "policy": {
    "description": "Example rollover policy.",
    "default_state": "rollover",
    "states": [
      {
        "name": "rollover",
        "actions": [
          {
            "rollover": {
              "min_doc_count": 1
            }
          }
        ],
        "transitions": [{
            "state_name": "alias",
            "conditions": {
              "min_doc_count": "2"
            }
          }]
      },
      {
        "name": "alias",
        "actions": [
          {
            "alias": {
              "actions": [
                {
                  "remove": {
                      "alias": "log"
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    "ism_template": {
      "index_patterns": ["log*"],
      "priority": 100
    }
  }
}
```
{% include copy-curl.html %}

Next, create an index template on which to enable the policy:

```json
PUT /_index_template/ism_rollover?
{
  "index_patterns": ["log*"],
  "template": {
   "settings": {
    "plugins.index_state_management.rollover_alias": "log"
   }
 }
}
```
{% include copy-curl.html %}

Next, change the cluster settings to trigger jobs every minute:

```json
PUT /_cluster/settings?pretty=true
{
  "persistent" : {
    "plugins.index_state_management.job_interval" : 1
  }
}
```
{% include copy-curl.html %}

Next, create a new index:

```json
PUT /log-000001
{
  "aliases": {
    "log": {
      "is_write_index": true
    }
  }
}
```
{% include copy-curl.html %}

Finally, add a document to the index to trigger the job:

```json
POST /log-000001/_doc
{
  "message": "dummy"
}
```
{% include copy-curl.html %}

You can verify these steps using the Alias and Index API:

```json
GET /_cat/indices?pretty
```
{% include copy-curl.html %}

```json
GET /_cat/aliases?pretty
```
{% include copy-curl.html %}

Note: The `index` and `remove_index` parameters are not allowed with alias action policies. Only the `add` and `remove` alias action parameters are allowed.
{: .warning }

## Example policy

The following example policy implements a `hot`, `warm`, and `delete` workflow. You can use this policy as a template to prioritize resources to your indexes based on their levels of activity.

In this case, an index is initially in a `hot` state. After 7 days, it changes to a `warm` state, where the number of replicas is reduced to 1 and the indexes are moved to nodes with the `warm` attribute.

After 30 days, the policy moves this index into a `delete` state. The service sends a notification to a Chime room that the index is being deleted, and then permanently deletes it.

```json
{
  "policy": {
    "description": "hot warm delete workflow",
    "default_state": "hot",
    "schema_version": 1,
    "states": [
      {
        "name": "hot",
        "actions": [
          {
            "rollover": {
              "min_index_age": "7d",
              "min_primary_shard_size": "30gb"
            }
          }
        ],
        "transitions": [
          {
            "state_name": "warm"
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
          },
          {
            "allocation": {
              "require": {
                "temp": "warm"
              }
            }
          }
        ],
        "transitions": [
          {
            "state_name": "delete",
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
            "notification": {
              "destination": {
                "chime": {
                  "url": "<URL>"
                }
              },
              "message_template": {
                "source": "The index {% raw %}{{ctx.index}}{% endraw %} is being deleted"
              }
            }
          },
          {
            "delete": {}
          }
        ]
      }
    ],
    "ism_template": {
      "index_patterns": ["log*"],
      "priority": 100
    }
  }
}
```

This diagram shows the `states`, `transitions`, and `actions` of the preceding policy as a finite-state machine. For more information about finite-state machines, see [Wikipedia](https://en.wikipedia.org/wiki/Finite-state_machine).

![Policy State Machine]({{site.url}}{{site.baseurl}}/images/ism.png)
