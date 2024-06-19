---
layout: default
title: API
parent: Alerting
nav_order: 15
redirect_from:
  - /monitoring-plugins/alerting/api/
---

# Alerting API

Use the Alerting API to programmatically create, update, and manage monitors and alerts. For APIs that support the composite monitor specifically, see [Managing composite monitors with the API]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/composite-monitors/#managing-composite-monitors-with-the-api). 

## Create a query-level monitor

Query-level monitors run the query and determine whether or not the results should trigger an alert. Query-level monitors can only trigger one alert at a time. For more information about query-level and bucket-level monitors, see [Creating monitors]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/monitors/).

#### Example request
```json
POST _plugins/_alerting/monitors
{
  "type": "monitor",
  "name": "test-monitor",
  "monitor_type": "query_level_monitor",
  "enabled": true,
  "schedule": {
    "period": {
      "interval": 1,
      "unit": "MINUTES"
    }
  },
  "inputs": [{
    "search": {
      "indices": ["movies"],
      "query": {
        "size": 0,
        "aggregations": {},
        "query": {
          "bool": {
            "filter": {
              "range": {
                "@timestamp": {
                  "gte": {% raw %}"{{period_end}}||-1h"{% endraw %},
                  "lte": {% raw %}"{{period_end}}"{% endraw %},
                  "format": "epoch_millis"
                }
              }
            }
          }
        }
      }
    }
  }],
  "triggers": [{
    "name": "test-trigger",
    "severity": "1",
    "condition": {
      "script": {
        "source": "ctx.results[0].hits.total.value > 0",
        "lang": "painless"
      }
    },
    "actions": [{
      "name": "test-action",
      "destination_id": "ld7912sBlQ5JUWWFThoW",
      "message_template": {
        "source": "This is my message body."
      },
      "throttle_enabled": true,
      "throttle": {
        "value": 27,
        "unit": "MINUTES"
      },
      "subject_template": {
        "source": "TheSubject"
      }
    }]
  }]
}
```
{% include copy-curl.html %}


If you use a custom webhook for your destination and need to embed JSON in the message body, be sure to escape the quotation marks:
 
```json
{
  "message_template": {
    {% raw %}"source": "{ \"text\": \"Monitor {{ctx.monitor.name}} just entered alert status. Please investigate the issue. - Trigger: {{ctx.trigger.name}} - Severity: {{ctx.trigger.severity}} - Period start: {{ctx.periodStart}} - Period end: {{ctx.periodEnd}}\" }"{% endraw %}
  }
}
```
{% include copy-curl.html %}


Optionally, to specify a backend role, you can add the `rbac_roles` parameter and backend role names to the bottom of your create monitor request.

The following request creates a query-level monitor and provides two backend roles, `role1` and `role2`. The section at the bottom of the request shows the line that specifies the roles with this syntax: `"rbac_roles": ["role1", "role2"]`. To learn about using backend roles to limit access, see [(Advanced) Limit access by backend role]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/security/#advanced-limit-access-by-backend-role).
 
#### Example request
```json
POST _plugins/_alerting/monitors
{
  "type": "monitor",
  "name": "test-monitor",
  "monitor_type": "query_level_monitor",
  "enabled": true,
  "schedule": {
    "period": {
      "interval": 1,
      "unit": "MINUTES"
    }
  },
  "inputs": [{
    "search": {
      "indices": ["movies"],
      "query": {
        "size": 0,
        "aggregations": {},
        "query": {
          "bool": {
            "filter": {
              "range": {
                "@timestamp": {
                  "gte": "{{period_end}}||-1h",
                  "lte": "{{period_end}}",
                  "format": "epoch_millis"
                }
              }
            }
          }
        }
      }
    }
  }],
  "triggers": [{
    "name": "test-trigger",
    "severity": "1",
    "condition": {
      "script": {
        "source": "ctx.results[0].hits.total.value > 0",
        "lang": "painless"
      }
    },
    "actions": [{
      "name": "test-action",
      "destination_id": "ld7912sBlQ5JUWWFThoW",
      "message_template": {
        "source": "This is my message body."
      },
      "throttle_enabled": true,
      "throttle": {
        "value": 27,
        "unit": "MINUTES"
      },
      "subject_template": {
        "source": "TheSubject"
      }
    }]
  }],
  "rbac_roles": ["role1", "role2"]
}
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}
  
#### Example response
```json
{
  "_id": "vd5k2GsBlQ5JUWWFxhsP",
  "_version": 1,
  "_seq_no": 7,
  "_primary_term": 1,
  "monitor": {
    "type": "monitor",
    "schema_version": 1,
    "name": "test-monitor",
    "enabled": true,
    "enabled_time": 1562703611363,
    "schedule": {
      "period": {
        "interval": 1,
        "unit": "MINUTES"
      }
    },
    "inputs": [{
      "search": {
        "indices": [
          "movies"
        ],
        "query": {
          "size": 0,
          "query": {
            "bool": {
              "filter": [{
                "range": {
                  "@timestamp": {
                    "from": {% raw %}"{{period_end}}||-1h"{% endraw %},
                    "to": {% raw %}"{{period_end}}"{% endraw %},
                    "include_lower": true,
                    "include_upper": true,
                    "format": "epoch_millis",
                    "boost": 1
                  }
                }
              }],
              "adjust_pure_negative": true,
              "boost": 1
            }
          },
          "aggregations": {}
        }
      }
    }],
    "triggers": [{
      "id": "ud5k2GsBlQ5JUWWFxRvi",
      "name": "test-trigger",
      "severity": "1",
      "condition": {
        "script": {
          "source": "ctx.results[0].hits.total.value > 0",
          "lang": "painless"
        }
      },
      "actions": [{
        "id": "ut5k2GsBlQ5JUWWFxRvj",
        "name": "test-action",
        "destination_id": "ld7912sBlQ5JUWWFThoW",
        "message_template": {
          "source": "This is my message body.",
          "lang": "mustache"
        },
        "throttle_enabled": false,
        "subject_template": {
          "source": "Subject",
          "lang": "mustache"
        }
      }]
    }],
    "last_update_time": 1562703611363
  }
}
```
{% include copy-curl.html %}

</details>


To specify a time zone, you can do so by including a [cron expression]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/cron/) with a time zone name in the `schedule` section of your request. The following example creates a monitor that runs at 12:10 PM Pacific Time on the first day of each month.

#### Example request
```json
{
  "type": "monitor",
  "name": "test-monitor",
  "monitor_type": "query_level_monitor",
  "enabled": true,
  "schedule": {
    "cron" : {
        "expression": "10 12 1 * *",
        "timezone": "America/Los_Angeles"
    }
  },
  "inputs": [{
    "search": {
      "indices": ["movies"],
      "query": {
        "size": 0,
        "aggregations": {},
        "query": {
          "bool": {
            "filter": {
              "range": {
                "@timestamp": {
                  "gte": {% raw %}"{{period_end}}||-1h"{% endraw %},
                  "lte": {% raw %}"{{period_end}}"{% endraw %},
                  "format": "epoch_millis"
                }
              }
            }
          }
        }
      }
    }
  }],
  "triggers": [{
    "name": "test-trigger",
    "severity": "1",
    "condition": {
      "script": {
        "source": "ctx.results[0].hits.total.value > 0",
        "lang": "painless"
      }
    },
    "actions": [{
      "name": "test-action",
      "destination_id": "ld7912sBlQ5JUWWFThoW",
      "message_template": {
        "source": "This is a message body."
      },
      "throttle_enabled": true,
      "throttle": {
        "value": 27,
        "unit": "MINUTES"
      },
      "subject_template": {
        "source": "Subject"
      }
    }]
  }]
}
```
{% include copy-curl.html %}


For a full list of time zone names, see [List of tz database time zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). The Alerting plugin uses the Java [TimeZone](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/TimeZone.html) class to convert a [`ZoneId`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/time/ZoneId.html) to a valid time zone.

---

## Bucket-level monitors

Bucket-level monitors categorize results into buckets separated by fields. The monitor then runs the script with each bucket's results and evaluates whether to trigger an alert. For more information about bucket-level and query-level monitors, see [Creating monitors]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/monitors/).

#### Example request
```json
POST _plugins/_alerting/monitors
{
  "type": "monitor",
  "name": "Demo bucket-level monitor",
  "monitor_type": "bucket_level_monitor",
  "enabled": true,
  "schedule": {
    "period": {
      "interval": 1,
      "unit": "MINUTES"
    }
  },
  "inputs": [
    {
      "search": {
        "indices": [
          "movies"
        ],
        "query": {
          "size": 0,
          "query": {
            "bool": {
              "filter": [
                {
                  "range": {
                    "order_date": {
                      "from": {% raw %}"{{period_end}}||-1h"{% endraw %},
                      "to": {% raw %}"{{period_end}}"{% endraw %},
                      "include_lower": true,
                      "include_upper": true,
                      "format": "epoch_millis"
                    }
                  }
                }
              ]
            }
          },
          "aggregations": {
            "composite_agg": {
              "composite": {
                "sources": [
                  {
                    "user": {
                      "terms": {
                        "field": "user"
                      }
                    }
                  }
                ]
              },
              "aggregations": {
                "avg_products_base_price": {
                  "avg": {
                    "field": "products.base_price"
                  }
                }
              }
            }
          }
        }
      }
    }
  ],
  "triggers": [
    {
      "bucket_level_trigger": {
        "name": "test-trigger",
        "severity": "1",
        "condition": {
          "buckets_path": {
            "_count": "_count",
            "avg_products_base_price": "avg_products_base_price"
          },
          "parent_bucket_path": "composite_agg",
          "script": {
            "source": "params._count > 50 || params.avg_products_base_price < 35",
            "lang": "painless"
          }
        },
        "actions": [
          {
            "name": "test-action",
            "destination_id": "E4o5hnsB6KjPKmHtpfCA",
            "message_template": {
              "source": {% raw %}"""Monitor {{ctx.monitor.name}} just entered alert status. Please investigate the issue.   - Trigger: {{ctx.trigger.name}}   - Severity: {{ctx.trigger.severity}}   - Period start: {{ctx.periodStart}}   - Period end: {{ctx.periodEnd}}    - Deduped Alerts:   {{ctx.dedupedAlerts}}     * {{id}} : {{bucket_keys}}   {{ctx.dedupedAlerts}}    - New Alerts:   {{ctx.newAlerts}}     * {{id}} : {{bucket_keys}}   {{ctx.newAlerts}}    - Completed Alerts:   {{ctx.completedAlerts}}     * {{id}} : {{bucket_keys}}   {{ctx.completedAlerts}}"""{% endraw %},
              "lang": "mustache"
            },
            "throttle_enabled": false,
            "throttle": {
              "value": 10,
              "unit": "MINUTES"
            },
            "action_execution_policy": {
              "action_execution_scope": {
                "per_alert": {
                  "actionable_alerts": [
                    "DEDUPED",
                    "NEW"
                  ]
                }
              }
            },
            "subject_template": {
              "source": "The Subject",
              "lang": "mustache"
            }
          }
        ]
      }
    }
  ]
}
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}
 
#### Example response
```json
{
  "_id" : "Dfxr63sBwex6DxEhHV5N",
  "_version" : 1,
  "_seq_no" : 3,
  "_primary_term" : 1,
  "monitor" : {
    "type" : "monitor",
    "schema_version" : 4,
    "name" : "Demo a bucket-level monitor",
    "monitor_type" : "bucket_level_monitor",
    "user" : {
      "name" : "",
      "backend_roles" : [ ],
      "roles" : [ ],
      "custom_attribute_names" : [ ],
      "user_requested_tenant" : null
    },
    "enabled" : true,
    "enabled_time" : 1631742270785,
    "schedule" : {
      "period" : {
        "interval" : 1,
        "unit" : "MINUTES"
      }
    },
    "inputs" : [
      {
        "search" : {
          "indices" : [
            "opensearch_dashboards_sample_data_flights"
          ],
          "query" : {
            "size" : 0,
            "query" : {
              "bool" : {
                "filter" : [
                  {
                    "range" : {
                      "order_date" : {
                        "from" : {% raw %}"{{period_end}}||-1h"{% endraw %},
                        "to" : {% raw %}"{{period_end}}"{% endraw %},
                        "include_lower" : true,
                        "include_upper" : true,
                        "format" : "epoch_millis",
                        "boost" : 1.0
                      }
                    }
                  }
                ],
                "adjust_pure_negative" : true,
                "boost" : 1.0
              }
            },
            "aggregations" : {
              "composite_agg" : {
                "composite" : {
                  "size" : 10,
                  "sources" : [
                    {
                      "user" : {
                        "terms" : {
                          "field" : "user",
                          "missing_bucket" : false,
                          "order" : "asc"
                        }
                      }
                    }
                  ]
                },
                "aggregations" : {
                  "avg_products_base_price" : {
                    "avg" : {
                      "field" : "products.base_price"
                    }
                  }
                }
              }
            }
          }
        }
      }
    ],
    "triggers" : [
      {
        "bucket_level_trigger" : {
          "id" : "C_xr63sBwex6DxEhHV5B",
          "name" : "test-trigger",
          "severity" : "1",
          "condition" : {
            "buckets_path" : {
              "_count" : "_count",
              "avg_products_base_price" : "avg_products_base_price"
            },
            "parent_bucket_path" : "composite_agg",
            "script" : {
              "source" : "params._count > 50 || params.avg_products_base_price < 35",
              "lang" : "painless"
            },
            "gap_policy" : "skip"
          },
          "actions" : [
            {
              "id" : "DPxr63sBwex6DxEhHV5B",
              "name" : "test-action",
              "destination_id" : "E4o5hnsB6KjPKmHtpfCA",
              "message_template" : {
                "source" : {% raw %}"Monitor {{ctx.monitor.name}} just entered alert status. Please investigate the issue.   - Trigger: {{ctx.trigger.name}}   - Severity: {{ctx.trigger.severity}}   - Period start: {{ctx.periodStart}}   - Period end: {{ctx.periodEnd}}    - Deduped Alerts:   {{ctx.dedupedAlerts}}     * {{id}} : {{bucket_keys}}   {{ctx.dedupedAlerts}}    - New Alerts:   {{ctx.newAlerts}}     * {{id}} : {{bucket_keys}}   {{ctx.newAlerts}}    - Completed Alerts:   {{ctx.completedAlerts}}     * {{id}} : {{bucket_keys}}   {{ctx.completedAlerts}}"{% endraw %},
                "lang" : "mustache"
              },
              "throttle_enabled" : false,
              "subject_template" : {
                "source" : "The Subject",
                "lang" : "mustache"
              },
              "throttle" : {
                "value" : 10,
                "unit" : "MINUTES"
              },
              "action_execution_policy" : {
                "action_execution_scope" : {
                  "per_alert" : {
                    "actionable_alerts" : [
                      "DEDUPED",
                      "NEW"
                    ]
                  }
                }
              }
            }
          ]
        }
      }
    ],
    "last_update_time" : 1631742270785
  }
}
```
{% include copy-curl.html %}

</details>

---

## Document-level monitors
Introduced 2.0
{: .label .label-purple }

Document-level monitors check whether individual documents in an index match trigger conditions. If so, the monitor generates an alert notification. When you run a query with a document-level monitor, the results are returned for each document that matches the trigger condition. You can create trigger conditions based on query names, query IDs, or tags that combine multiple queries.

To learn more about per document monitors that function similarly to the document-level monitor API, see [Monitors]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/monitors/).

### Search the findings index

You can use the Alerting search API operation to search the findings index `.opensearch-alerting-finding*` for available document findings with a GET request. By default, a GET request without path parameters returns all available findings. 

To retrieve any available findings, send a GET request without any path parameters as follows:

```json
GET /_plugins/_alerting/findings/_search?
```
{% include copy-curl.html %}

To retrieve metadata for an individual document finding entry, you can search for the finding by its `findingId` as follows:

```json
GET /_plugins/_alerting/findings/_search?findingId=gKQhj8WJit3BxjGfiOXC
```
{% include copy-curl.html %}

The response returns the number of individual finding entries in the `total_findings` field.

To get more specific results in a findings search, you can use any of the optional path parameters defined in the following table.

Path parameter | Description | Usage
:--- | :--- : :---
`findingId` | The identifier for the finding entry. | The finding ID is returned in the initial query response.
`sortString` | This field specifies which string the Alerting plugin uses to sort the findings. | The default value is `id`.
`sortOrder` | The order to sort the list of findings, either ascending or descending. | Use `sortOrder=asc` to indicate ascending, or `sortOrder=desc` for descending sort order.
`size` | An optional limit for the maximum number of results returned in the response. | There is no minimum or maximum values.
`startIndex` | The pagination indicator. | Default is `0`.
`searchString` | The finding attribute you want returned in the search. | To search in a specific index, specify the index name in the request path. For example, to search findings in the `indexABC` index, use `searchString=indexABC'.

### Create a document-level monitor

You can create a document-level monitor with a POST request that provides the monitor details in the request body. At a minimum, you need to provide the following details: specify the queries or combinations by tag with the `inputs` field, a valid trigger condition, and provide the notification message in the `action` field.

The following table provides the syntax to use for each trigger option.

Trigger options | Definition | Syntax
:--- | :--- : :---
Tag | Creates alerts for documents that match a multiple query with this tag applied. If you group multiple queries by a single tag, then you can set it to trigger an alert if the results are returned by this tag name.| `query[tag=<tag-name>]`
Query by name | Creates alerts for documents matched or returned by the named query.  | `query[name=<query-name>]`
Query by ID | Creates alerts for documents that were returned by the identified query. | `query[id=<query-id>]`


#### Example request
```json
POST _plugins/_alerting/monitors
{
  "type": "monitor",
  "monitor_type": "doc_level_monitor",
  "name": "Example document-level monitor",
  "enabled": true,
  "schedule": {
    "period": {
      "interval": 1,
      "unit": "MINUTES"
    }
  },
  "inputs": [
    {
      "doc_level_input": {
        "description": "Example document-level monitor for audit logs",
        "indices": [
          "audit-logs"
        ],
        "queries": [
        {
            "id": "nKQnFYABit3BxjGfiOXC",
            "name": "sigma-123",
            "query": "region:\"us-west-2\"",
            "tags": [
                "tag1"
            ]
        },
        {
            "id": "gKQnABEJit3BxjGfiOXC",
            "name": "sigma-456",
            "query": "region:\"us-east-1\"",
            "tags": [
                "tag2"
            ]
        },
        {
            "id": "h4J2ABEFNW3vxjGfiOXC",
            "name": "sigma-789",
            "query": "message:\"This is a SEPARATE error from IAD region\"",
            "tags": [
                "tag3"
            ]
        }
    ]
      }
    }
  ],
    "triggers": [ { "document_level_trigger": {
      "name": "test-trigger",
      "severity": "1",
      "condition": {
        "script": {
          "source": "(query[name=sigma-123] || query[tag=tag3]) && query[name=sigma-789]",
          "lang": "painless"
        }
      },
      "actions": [
        {
            "name": "test-action",
            "destination_id": "E4o5hnsB6KjPKmHtpfCA",
            "message_template": {
                "source": {% raw %}"""Monitor  just entered alert status. Please investigate the issue. Related Finding Ids: {{ctx.alerts.0.finding_ids}}, Related Document Ids: {{ctx.alerts.0.related_doc_ids}}"""{% endraw %},
                "lang": "mustache"
            },
            "action_execution_policy": {
                "action_execution_scope": {
                    "per_alert": {
                        "actionable_alerts": []
                    }
                }
            },
            "subject_template": {
                "source": "The Subject",
                "lang": "mustache"
            }
         }
      ]
  }}]
}

```
{% include copy-curl.html %}


### Limitations

If you run a document-level query while the index is getting reindexed, the API response will not return the reindexed results. To get updates, wait until the reindexing process completes, then rerun the query.

---

## Update monitor

When updating a monitor, you can optionally include `seq_no` and `primary_term` as URL parameters. If these numbers do not match the existing monitor or the monitor does not exist, the Alerting plugin throws an error. OpenSearch increments the version number and the sequence number automatically (see the example response).

#### Example request
```json
PUT _plugins/_alerting/monitors/<monitor_id>
{
  "type": "monitor",
  "name": "test-monitor",
  "enabled": true,
  "enabled_time": 1551466220455,
  "schedule": {
    "period": {
      "interval": 1,
      "unit": "MINUTES"
    }
  },
  "inputs": [{
    "search": {
      "indices": [
        "*"
      ],
      "query": {
        "query": {
          "match_all": {
            "boost": 1
          }
        }
      }
    }
  }],
  "triggers": [{
    "id": "StaeOmkBC25HCRGmL_y-",
    "name": "test-trigger",
    "severity": "1",
    "condition": {
      "script": {
        "source": "return true",
        "lang": "painless"
      }
    },
    "actions": [{
      "name": "test-action",
      "destination_id": "RtaaOmkBC25HCRGm0fxi",
      "subject_template": {
        "source": "My Message Subject",
        "lang": "mustache"
      },
      "message_template": {
        "source": "This is my message body.",
        "lang": "mustache"
      }
    }]
  }],
  "last_update_time": 1551466639295
}

PUT _plugins/_alerting/monitors/<monitor_id>?if_seq_no=3&if_primary_term=1
{
  "type": "monitor",
  "name": "test-monitor",
  "enabled": true,
  "enabled_time": 1551466220455,
  "schedule": {
    "period": {
      "interval": 1,
      "unit": "MINUTES"
    }
  },
  "inputs": [{
    "search": {
      "indices": [
        "*"
      ],
      "query": {
        "query": {
          "match_all": {
            "boost": 1
          }
        }
      }
    }
  }],
  "triggers": [{
    "id": "StaeOmkBC25HCRGmL_y-",
    "name": "test-trigger",
    "severity": "1",
    "condition": {
      "script": {
        "source": "return true",
        "lang": "painless"
      }
    },
    "actions": [{
      "name": "test-action",
      "destination_id": "RtaaOmkBC25HCRGm0fxi",
      "subject_template": {
        "source": "My Message Subject",
        "lang": "mustache"
      },
      "message_template": {
        "source": "This is my message body.",
        "lang": "mustache"
      }
    }]
  }],
  "last_update_time": 1551466639295
}
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}

#### Example response
```json
{
  "_id": "Q9aXOmkBC25HCRGmzfw-",
  "_version": 4,
  "_seq_no": 4,
  "_primary_term": 1,
  "monitor": {
    "type": "monitor",
    "name": "test-monitor",
    "enabled": true,
    "enabled_time": 1551466220455,
    "schedule": {
      "period": {
        "interval": 1,
        "unit": "MINUTES"
      }
    },
    "inputs": [{
      "search": {
        "indices": [
          "*"
        ],
        "query": {
          "query": {
            "match_all": {
              "boost": 1
            }
          }
        }
      }
    }],
    "triggers": [{
      "id": "StaeOmkBC25HCRGmL_y-",
      "name": "test-trigger",
      "severity": "1",
      "condition": {
        "script": {
          "source": "return true",
          "lang": "painless"
        }
      },
      "actions": [{
        "name": "test-action",
        "destination_id": "RtaaOmkBC25HCRGm0fxi",
        "subject_template": {
          "source": "My Message Subject",
          "lang": "mustache"
        },
        "message_template": {
          "source": "This is my message body.",
          "lang": "mustache"
        }
      }]
    }],
    "last_update_time": 1551466761596
  }
}
```
{% include copy-curl.html %}

</details>

---

## Get monitor

Retrieve the details of a specific monitor using the following request.

#### Example request
```
GET _plugins/_alerting/monitors/<monitor_id>
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}

#### Example response
```json
{
  "_id": "Q9aXOmkBC25HCRGmzfw-",
  "_version": 3,
  "_seq_no": 3,
  "_primary_term": 1,
  "monitor": {
    "type": "monitor",
    "name": "test-monitor",
    "enabled": true,
    "enabled_time": 1551466220455,
    "schedule": {
      "period": {
        "interval": 1,
        "unit": "MINUTES"
      }
    },
    "inputs": [{
      "search": {
        "indices": [
          "*"
        ],
        "query": {
          "query": {
            "match_all": {
              "boost": 1
            }
          }
        }
      }
    }],
    "triggers": [{
      "id": "StaeOmkBC25HCRGmL_y-",
      "name": "test-trigger",
      "severity": "1",
      "condition": {
        "script": {
          "source": "return true",
          "lang": "painless"
        }
      },
      "actions": [{
        "name": "test-action",
        "destination_id": "RtaaOmkBC25HCRGm0fxi",
        "subject_template": {
          "source": "My Message Subject",
          "lang": "mustache"
        },
        "message_template": {
          "source": "This is my message body.",
          "lang": "mustache"
        }
      }]
    }],
    "last_update_time": 1551466639295
  }
}
```
{% include copy-curl.html %}

</details>

---

## Monitor stats

Returns statistics about the alerting feature. Use `_plugins/_alerting/stats` to find node IDs and metrics. Then you can drill down using those values.

#### Example request
```json
GET _plugins/_alerting/stats
GET _plugins/_alerting/stats/<metric>
GET _plugins/_alerting/<node-id>/stats
GET _plugins/_alerting/<node-id>/stats/<metric>
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}

#### Example response
```json
{
  "_nodes": {
    "total": 9,
    "successful": 9,
    "failed": 0
  },
  "cluster_name": "475300751431:alerting65-dont-delete",
  "plugins.scheduled_jobs.enabled": true,
  "scheduled_job_index_exists": true,
  "scheduled_job_index_status": "green",
  "nodes_on_schedule": 9,
  "nodes_not_on_schedule": 0,
  "nodes": {
    "qWcbKbb-TVyyI-Q7VSeOqA": {
      "name": "qWcbKbb",
      "schedule_status": "green",
      "roles": [
        "MASTER"
      ],
      "job_scheduling_metrics": {
        "last_full_sweep_time_millis": 207017,
        "full_sweep_on_time": true
      },
      "jobs_info": {}
    },
    "Do-DX9ZcS06Y9w1XbSJo1A": {
      "name": "Do-DX9Z",
      "schedule_status": "green",
      "roles": [
        "DATA",
        "INGEST"
      ],
      "job_scheduling_metrics": {
        "last_full_sweep_time_millis": 230516,
        "full_sweep_on_time": true
      },
      "jobs_info": {}
    },
    "n5phkBiYQfS5I0FDzcqjZQ": {
      "name": "n5phkBi",
      "schedule_status": "green",
      "roles": [
        "MASTER"
      ],
      "job_scheduling_metrics": {
        "last_full_sweep_time_millis": 228406,
        "full_sweep_on_time": true
      },
      "jobs_info": {}
    },
    "Tazzo8cQSY-g3vOjgYYLzA": {
      "name": "Tazzo8c",
      "schedule_status": "green",
      "roles": [
        "DATA",
        "INGEST"
      ],
      "job_scheduling_metrics": {
        "last_full_sweep_time_millis": 211722,
        "full_sweep_on_time": true
      },
      "jobs_info": {
        "i-wsFmkB8NzS6aXjQSk0": {
          "last_execution_time": 1550864912882,
          "running_on_time": true
        }
      }
    },
    "Nyf7F8brTOSJuFPXw6CnpA": {
      "name": "Nyf7F8b",
      "schedule_status": "green",
      "roles": [
        "DATA",
        "INGEST"
      ],
      "job_scheduling_metrics": {
        "last_full_sweep_time_millis": 223300,
        "full_sweep_on_time": true
      },
      "jobs_info": {
        "NbpoFmkBeSe-hD59AKgE": {
          "last_execution_time": 1550864928354,
          "running_on_time": true
        },
        "-LlLFmkBeSe-hD59Ydtb": {
          "last_execution_time": 1550864732727,
          "running_on_time": true
        },
        "pBFxFmkBNXkgNmTBaFj1": {
          "last_execution_time": 1550863325024,
          "running_on_time": true
        },
        "hfasEmkBNXkgNmTBrvIW": {
          "last_execution_time": 1550862000001,
          "running_on_time": true
        }
      }
    },
    "oOdJDIBVT5qbbO3d8VLeEw": {
      "name": "oOdJDIB",
      "schedule_status": "green",
      "roles": [
        "DATA",
        "INGEST"
      ],
      "job_scheduling_metrics": {
        "last_full_sweep_time_millis": 227570,
        "full_sweep_on_time": true
      },
      "jobs_info": {
        "4hKRFmkBNXkgNmTBKjYX": {
          "last_execution_time": 1550864806101,
          "running_on_time": true
        }
      }
    },
    "NRDG6JYgR8m0GOZYQ9QGjQ": {
      "name": "NRDG6JY",
      "schedule_status": "green",
      "roles": [
        "MASTER"
      ],
      "job_scheduling_metrics": {
        "last_full_sweep_time_millis": 227652,
        "full_sweep_on_time": true
      },
      "jobs_info": {}
    },
    "URMrXRz3Tm-CB72hlsl93Q": {
      "name": "URMrXRz",
      "schedule_status": "green",
      "roles": [
        "DATA",
        "INGEST"
      ],
      "job_scheduling_metrics": {
        "last_full_sweep_time_millis": 231048,
        "full_sweep_on_time": true
      },
      "jobs_info": {
        "m7uKFmkBeSe-hD59jplP": {
          "running_on_time": true
        }
      }
    },
    "eXgt1k9oTRCLmx2HBGElUw": {
      "name": "eXgt1k9",
      "schedule_status": "green",
      "roles": [
        "DATA",
        "INGEST"
      ],
      "job_scheduling_metrics": {
        "last_full_sweep_time_millis": 229234,
        "full_sweep_on_time": true
      },
      "jobs_info": {
        "wWkFFmkBc2NG-PeLntxk": {
          "running_on_time": true
        },
        "3usNFmkB8NzS6aXjO1Gs": {
          "last_execution_time": 1550863959848,
          "running_on_time": true
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

</details>

---

## Delete monitor

Delete a monitor using the following request.

#### Example request
```
DELETE _plugins/_alerting/monitors/<monitor_id>
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}
  
#### Example response
```json
{
  "_index": ".opensearch-scheduled-jobs",
  "_id": "OYAHOmgBl3cmwnqZl_yH",
  "_version": 2,
  "result": "deleted",
  "forced_refresh": true,
  "_shards": {
    "total": 2,
    "successful": 2,
    "failed": 0
  },
  "_seq_no": 11,
  "_primary_term": 1
}
```
{% include copy-curl.html %}

</details>

---

## Search monitors

Query and retrieve information about existing monitors based on specific criteria, such as the monitor name, using the following request.

#### Example request
```json
GET _plugins/_alerting/monitors/_search
{
  "query": {
    "match" : {
      "monitor.name": "my-monitor-name"
    }
  }
}
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}
  
#### Example response
```json
{
  "took": 17,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": 1,
    "max_score": 0.6931472,
    "hits": [{
      "_index": ".opensearch-scheduled-jobs",
      "_type": "_doc",
      "_id": "eGQi7GcBRS7-AJEqfAnr",
      "_score": 0.6931472,
      "_source": {
        "type": "monitor",
        "name": "my-monitor-name",
        "enabled": true,
        "enabled_time": 1545854942426,
        "schedule": {
          "period": {
            "interval": 1,
            "unit": "MINUTES"
          }
        },
        "inputs": [{
          "search": {
            "indices": [
              "*"
            ],
            "query": {
              "size": 0,
              "query": {
                "bool": {
                  "filter": [{
                    "range": {
                      "@timestamp": {
                        "from": {% raw %}"{{period_end}}||-1h"{% endraw %},
                        "to": {% raw %}"{{period_end}}"{% endraw %},
                        "include_lower": true,
                        "include_upper": true,
                        "format": "epoch_millis",
                        "boost": 1
                      }
                    }
                  }],
                  "adjust_pure_negative": true,
                  "boost": 1
                }
              },
              "aggregations": {}
            }
          }
        }],
        "triggers": [{
          "id": "Sooi7GcB53a0ewuj_6MH",
          "name": "Over",
          "severity": "1",
          "condition": {
            "script": {
              "source": "_ctx.results[0].hits.total > 400000",
              "lang": "painless"
            }
          },
          "actions": []
        }],
        "last_update_time": 1545854975758
      }
    }]
  }
}
```
{% include copy-curl.html %}

</details>

---

## Run monitor

You can add the optional `?dryrun=true` parameter to the URL to show the results of a run without actions sending any message.

#### Example request
```json
POST _plugins/_alerting/monitors/<monitor_id>/_execute
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}

#### Example response
```json
{
  "monitor_name": "logs",
  "period_start": 1547161872322,
  "period_end": 1547161932322,
  "error": null,
  "trigger_results": {
    "Sooi7GcB53a0ewuj_6MH": {
      "name": "Over",
      "triggered": true,
      "error": null,
      "action_results": {}
    }
  }
}
```
{% include copy-curl.html %}

</details>

---

## Get alerts

Return an array of all alerts.

#### Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description
| :--- | :--- | :---
| `sortString` | String | Defines how to sort the results. Default is `monitor_name.keyword`.
| `sortOrder` | String | Defines the order of the results. Options are `asc` or `desc`. Default is `asc`.
| `missing` | String | Specifies whether to include missing data in the response.
| `size` | String | Defines the size of the request to be returned. Default is `20`.
| `startIndex` | String | Defines the index to start from. Used for paginating results. Default is `0`.
| `searchString` | String | Defines the search string to use for searching a specific alert. Default is an empty string.
| `severityLevel` | String | Defines the severity level to filter for. Default is `ALL`.
| `alertState` | String | Defines the alert state to filter for. Default is `ALL`.
| `monitorId` | String | Filters by monitor ID.
| `workflowIds` | String | Allows for monitoring the status of chained alerts from multiple workflows within a single dashboard. Available in OpenSearch 2.9 or later.

#### Example request
```json
GET _plugins/_alerting/monitors/alerts
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}

#### Example response
```json
{
  "alerts": [
    {
      "id": "eQURa3gBKo1jAh6qUo49",
      "version": 300,
      "monitor_id": "awUMa3gBKo1jAh6qu47E",
      "schema_version": 2,
      "monitor_version": 2,
      "monitor_name": "Example_monitor_name",
      "monitor_user": {
        "name": "admin",
        "backend_roles": [
          "admin"
        ],
        "roles": [
          "all_access",
          "own_index"
        ],
        "custom_attribute_names": [],
        "user_requested_tenant": null
      },
      "trigger_id": "bQUQa3gBKo1jAh6qnY6G",
      "trigger_name": "Example_trigger_name",
      "state": "ACTIVE",
      "error_message": null,
      "alert_history": [
        {
          "timestamp": 1617314504873,
          "message": "Example error message"
        },
        {
          "timestamp": 1617312543925,
          "message": "Example error message"
        }
      ],
      "severity": "1",
      "action_execution_results": [
        {
          "action_id": "bgUQa3gBKo1jAh6qnY6G",
          "last_execution_time": 1617317979908,
          "throttled_count": 0
        }
      ],
      "start_time": 1616704000492,
      "last_notification_time": 1617317979908,
      "end_time": null,
      "acknowledged_time": null
    }
  ],
  "totalAlerts": 1
}
```
{% include copy-curl.html %}

</details>

---

## Acknowledge alert

[After getting your alerts](#get-alerts), you can acknowledge any number of active alerts in one call. If the alert is already in an `ERROR`, `COMPLETED`, or `ACKNOWLEDGED` state, it appears in the `failed` array.

#### Example request
```json
POST _plugins/_alerting/monitors/<monitor-id>/_acknowledge/alerts
{
  "alerts": ["eQURa3gBKo1jAh6qUo49"]
}
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}


#### Example response
```json
{
  "success": [
  "eQURa3gBKo1jAh6qUo49"
  ],
  "failed": []
}
```
{% include copy-curl.html %}

</details>

---

## Create destination

Define and configure various destinations for receiving alert notifications using the following request. These destinations can be of different types, such as Slack, custom webhooks, or email, and are used to specify where and how alerts should be delivered.

#### Example request
```json
POST _plugins/_alerting/destinations
{
  "name": "my-destination",
  "type": "slack",
  "slack": {
    "url": "http://www.example.com"
  }
}

POST _plugins/_alerting/destinations
{
  "type": "custom_webhook",
  "name": "my-custom-destination",
  "custom_webhook": {
    "path": "incomingwebhooks/123456-123456-XXXXXX",
    "header_params": {
      "Content-Type": "application/json"
    },
    "scheme": "HTTPS",
    "port": 443,
    "query_params": {
      "token": "R2x1UlN4ZHF8MXxxVFJpelJNVDgzdGNwXXXXXXXXX"
    },
    "host": "hooks.chime.aws"
  }
}

POST _plugins/_alerting/destinations
{
  "type": "email",
  "name": "my-email-destination",
  "email": {
    "email_account_id": "YjY7mXMBx015759_IcfW",
    "recipients": [
      {
        "type": "email_group",
        "email_group_id": "YzY-mXMBx015759_dscs"
      },
      {
        "type": "email",
        "email": "example@email.com"
      }
    ]
  }
}

// The email_account_id and email_group_id will be the document IDs of the email_account and email_group you have created.
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}

#### Example response
```json
{
  "_id": "nO-yFmkB8NzS6aXjJdiI",
  "_version" : 1,
  "_seq_no" : 3,
  "_primary_term" : 1,
  "destination": {
    "type": "slack",
    "name": "my-destination",
    "last_update_time": 1550863967624,
    "slack": {
      "url": "http://www.example.com"
    }
  }
}
```
{% include copy-curl.html %}

</details>

---

## Update destination

When updating a destination, you can optionally include `seq_no` and `primary_term` as URL parameters. If these numbers do not match the existing destination or the destination doesn't exist, the Alerting plugin throws an error. OpenSearch increments the version number and the sequence number automatically (see the example response).

#### Example request
```json
PUT _plugins/_alerting/destinations/<destination-id>
{
  "name": "my-updated-destination",
  "type": "slack",
  "slack": {
    "url": "http://www.example.com"
  }
}

PUT _plugins/_alerting/destinations/<destination-id>?if_seq_no=3&if_primary_term=1
{
  "name": "my-updated-destination",
  "type": "slack",
  "slack": {
    "url": "http://www.example.com"
  }
}
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}

#### Example response
```json
{
  "_id": "pe-1FmkB8NzS6aXjqvVY",
  "_version" : 2,
  "_seq_no" : 4,
  "_primary_term" : 1,
  "destination": {
    "type": "slack",
    "name": "my-updated-destination",
    "last_update_time": 1550864289375,
    "slack": {
      "url": "http://www.example.com"
    }
  }
}
```
{% include copy-curl.html %}

</details>

---

## Get destination

Retrieve one destination using the following request.

#### Example request
```json
GET _plugins/_alerting/destinations/<destination-id>
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}

#### Example response
```json
{
  "totalDestinations": 1,
  "destinations": [{
      "id": "1a2a3a4a5a6a7a",
      "type": "slack",
      "name": "sample-destination",
      "user": {
        "name": "psantos",
        "backend_roles": [
          "human-resources"
        ],
        "roles": [
          "alerting_full_access",
          "hr-role"
        ],
        "custom_attribute_names": []
      },
      "schema_version": 3,
      "seq_no": 0,
      "primary_term": 6,
      "last_update_time": 1603943261722,
      "slack": {
        "url": "https://example.com"
      }
    }
  ]
}
```
{% include copy-curl.html %}

</details>

---

## Get destinations

Retrieve all destinations using the following request.

#### Example request
```json
GET _plugins/_alerting/destinations
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}

#### Example response
```json
{
  "totalDestinations": 1,
  "destinations": [{
      "id": "1a2a3a4a5a6a7a",
      "type": "slack",
      "name": "sample-destination",
      "user": {
        "name": "psantos",
        "backend_roles": [
          "human-resources"
        ],
        "roles": [
          "alerting_full_access",
          "hr-role"
        ],
        "custom_attribute_names": []
      },
      "schema_version": 3,
      "seq_no": 0,
      "primary_term": 6,
      "last_update_time": 1603943261722,
      "slack": {
        "url": "https://example.com"
      }
    }
  ]
}
```
{% include copy-curl.html %}

</details>

---

## Delete destination

Remove a specific destination from the alerting system using the following request.

#### Example request
```
DELETE _plugins/_alerting/destinations/<destination-id>
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}

#### Example response
```json
{
  "_index": ".opendistro-alerting-config",
  "_type": "_doc",
  "_id": "Zu-zFmkB8NzS6aXjLeBI",
  "_version": 2,
  "result": "deleted",
  "forced_refresh": true,
  "_shards": {
    "total": 2,
    "successful": 2,
    "failed": 0
  },
  "_seq_no": 8,
  "_primary_term": 1
}
```
{% include copy-curl.html %}

</details>

---

## Create email account

Set up a new email account for sending alert notifications using the following request.

#### Example request
```json
POST _plugins/_alerting/destinations/email_accounts
{
  "name": "example_account",
  "email": "example@email.com",
  "host": "smtp.email.com",
  "port": 465,
  "method": "ssl"
}
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}

#### Example response
```json
{
  "_id" : "email_account_id",
  "_version" : 1,
  "_seq_no" : 7,
  "_primary_term" : 2,
  "email_account" : {
    "schema_version" : 2,
    "name" : "example_account",
    "email" : "example@email.com",
    "host" : "smtp.email.com",
    "port" : 465,
    "method" : "ssl"
  }
}
```
{% include copy-curl.html %}

</details>

## Update email account

When updating an email account, you can optionally include `seq_no` and `primary_term` as URL parameters. If these numbers don't match the existing email account or the email account doesn't exist, the Alerting plugin throws an error. OpenSearch increments the version number and the sequence number automatically (see the example response).

#### Example request
```json
PUT _plugins/_alerting/destinations/email_accounts/<email_account_id>
{
  "name": "example_account",
  "email": "example@email.com",
  "host": "smtp.email.com",
  "port": 465,
  "method": "ssl"
}

PUT _plugins/_alerting/destinations/email_accounts/<email_account_id>?if_seq_no=18&if_primary_term=2
{
  "name": "example_account",
  "email": "example@email.com",
  "host": "smtp.email.com",
  "port": 465,
  "method": "ssl"
}
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}

#### Example response
```json
{
  "_id" : "email_account_id",
  "_version" : 3,
  "_seq_no" : 19,
  "_primary_term" : 2,
  "email_account" : {
    "schema_version" : 2,
    "name" : "example_account",
    "email" : "example@email.com",
    "host" : "smtp.email.com",
    "port" : 465,
    "method" : "ssl"
  }
}
```
{% include copy-curl.html %}

</details>

## Get email account

Retrieve the details of a specific email account configured for alerting purposes using the following request.

#### Example request
```json
GET _plugins/_alerting/destinations/email_accounts/<email_account_id>
{
  "name": "example_account",
  "email": "example@email.com",
  "host": "smtp.email.com",
  "port": 465,
  "method": "ssl"
}
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}

#### Example response
```json
{
  "_id" : "email_account_id",
  "_version" : 2,
  "_seq_no" : 8,
  "_primary_term" : 2,
  "email_account" : {
    "schema_version" : 2,
    "name" : "test_account",
    "email" : "test@email.com",
    "host" : "smtp.test.com",
    "port" : 465,
    "method" : "ssl"
  }
}
```
{% include copy-curl.html %}

</details>

## Delete email account

Remove an existing email account configuration from the alerting system using the following request.

#### Example request
```
DELETE _plugins/_alerting/destinations/email_accounts/<email_account_id>
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}

#### Example response
```json
{
  "_index" : ".opendistro-alerting-config",
  "_type" : "_doc",
  "_id" : "email_account_id",
  "_version" : 1,
  "result" : "deleted",
  "forced_refresh" : true,
  "_shards" : {
    "total" : 2,
    "successful" : 2,
    "failed" : 0
  },
  "_seq_no" : 12,
  "_primary_term" : 2
}
```
{% include copy-curl.html %}

</details>

## Search email account

Retrieve information about the configured email accounts used for email-based alerting using the following request.

#### Example request
```json
POST _plugins/_alerting/destinations/email_accounts/_search
{
  "from": 0,
  "size": 20,
  "sort": { "email_account.name.keyword": "desc" },
  "query": {
    "bool": {
      "must": {
        "match_all": {}
      }
    }
  }
}
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}

#### Example response
```json
{
  "took" : 8,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [
      {
        "_index" : ".opendistro-alerting-config",
        "_type" : "_doc",
        "_id" : "email_account_id",
        "_seq_no" : 8,
        "_primary_term" : 2,
        "_score" : null,
        "_source" : {
          "schema_version" : 2,
          "name" : "example_account",
          "email" : "example@email.com",
          "host" : "smtp.email.com",
          "port" : 465,
          "method" : "ssl"
        },
        "sort" : [
          "example_account"
        ]
      },
      ...
    ]
  }
}
```
{% include copy-curl.html %}

</details>

---

## Create email group

Define a new group of email recipients for alerts using the following request.

#### Example request
```json
POST _plugins/_alerting/destinations/email_groups
{
  "name": "example_email_group",
  "emails": [{
    "email": "example@email.com"
  }]
}
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}

#### Example response
```json
{
  "_id" : "email_group_id",
  "_version" : 1,
  "_seq_no" : 9,
  "_primary_term" : 2,
  "email_group" : {
    "schema_version" : 2,
    "name" : "example_email_group",
    "emails" : [
      {
        "email" : "example@email.com"
      }
    ]
  }
}
```
{% include copy-curl.html %}

</details>

## Update email group

When updating an email group, you can optionally include `seq_no` and `primary_term` as URL parameters. If these numbers don't match the existing email group or the email group doesn't exist, the Alerting plugin throws an error. OpenSearch increments the version number and the sequence number automatically (see the example response).

#### Example request
```json
PUT _plugins/_alerting/destinations/email_groups/<email_group_id>
{
  "name": "example_email_group",
  "emails": [{
    "email": "example@email.com"
  }]
}

PUT _plugins/_alerting/destinations/email_groups/<email_group_id>?if_seq_no=16&if_primary_term=2
{
  "name": "example_email_group",
  "emails": [{
    "email": "example@email.com"
  }]
}
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}
  
#### Example response
```json
{
  "_id" : "email_group_id",
  "_version" : 4,
  "_seq_no" : 17,
  "_primary_term" : 2,
  "email_group" : {
    "schema_version" : 2,
    "name" : "example_email_group",
    "emails" : [
      {
        "email" : "example@email.com"
      }
    ]
  }
}
```
{% include copy-curl.html %}

</details>

## Get email group

Retrieve the details of a specific email group destination using the following request, passing the ID of the email group you want to fetch.

#### Example request
```json
GET _plugins/_alerting/destinations/email_groups/<email_group_id>
{
  "name": "example_email_group",
  "emails": [{
    "email": "example@email.com"
  }]
}
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}
  
#### Example response
```json
{
  "_id" : "email_group_id",
  "_version" : 4,
  "_seq_no" : 17,
  "_primary_term" : 2,
  "email_group" : {
    "schema_version" : 2,
    "name" : "example_email_group",
    "emails" : [
      {
        "email" : "example@email.com"
      }
    ]
  }
}
```
{% include copy-curl.html %}

</details>

## Delete email group

Remove an existing email group from the list of destinations for alerts using the following request.

#### Example request
```
DELETE _plugins/_alerting/destinations/email_groups/<email_group_id>
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}
  
#### Example response
```json
{
  "_index" : ".opendistro-alerting-config",
  "_type" : "_doc",
  "_id" : "email_group_id",
  "_version" : 1,
  "result" : "deleted",
  "forced_refresh" : true,
  "_shards" : {
    "total" : 2,
    "successful" : 2,
    "failed" : 0
  },
  "_seq_no" : 11,
  "_primary_term" : 2
}
```
{% include copy-curl.html %}

</details>

## Search email group

Query and retrieve information about existing email groups used for alerting purposes, enabling you to filter and sort the results based on various criteria. An example is shown in the following request.

#### Example request
```json
POST _plugins/_alerting/destinations/email_groups/_search
{
  "from": 0,
  "size": 20,
  "sort": { "email_group.name.keyword": "desc" },
  "query": {
    "bool": {
      "must": {
        "match_all": {}
      }
    }
  }
}
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}
  
#### Example response
```json
{
  "took" : 7,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 5,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [
      {
        "_index" : ".opendistro-alerting-config",
        "_type" : "_doc",
        "_id" : "email_group_id",
        "_seq_no" : 10,
        "_primary_term" : 2,
        "_score" : null,
        "_source" : {
          "schema_version" : 2,
          "name" : "example_email_group",
          "emails" : [
            {
              "email" : "example@email.com"
            }
          ]
        },
        "sort" : [
          "example_email_group"
        ]
      },
      ...
    ]
  }
}
```
{% include copy-curl.html %}

</details>

## Create comment
This is an experimental feature and is not recommended for use in a production environment.   
{: .warning}

Add comments to a specific alert, providing additional context or notes related to that alert, using the following request.

#### Example request
```json
POST _plugins/_alerting/comments/<alert-id>
{
  "content": "sample comment"
}
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}
  
#### Example response
```json
{
  "_id": "0U6aBJABVWc3FrmWer9s",
  "_seq_no": 7,
  "_primary_term": 2,
  "comment": {
    "entity_id": "vCZkA5ABWTh3kzuBEL_9",
    "entity_type": "alert",
    "content": "sample comment",
    "created_time": 1718064151148,
    "last_updated_time": null,
    "user": "admin"
  }
}
```
{% include copy-curl.html %}

</details>

## Update comment
This is an experimental feature and is not recommended for use in a production environment.   
{: .warning}

Modify the content of a previously added comment associated with an alert using the following request.

#### Example request

```json
PUT _plugins/_alerting/comments/<comment-id>
{
  "content": "sample updated comment"
}
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}
  
#### Example response
```json
{
  "_id": "0U6aBJABVWc3FrmWer9s",
  "_seq_no": 8,
  "_primary_term": 3,
  "comment": {
    "entity_id": "vCZkA5ABWTh3kzuBEL_9",
    "entity_type": "alert",
    "content": "sample updated comment",
    "created_time": 1718064151148,
    "last_updated_time": 1718064745485,
    "user": "admin"
  }
}
```
{% include copy-curl.html %}

</details>

## Search comment
This is an experimental feature and is not recommended for use in a production environment.   
{: .warning}

Query and retrieve existing comments associated with alerts using the following request.

#### Example request
```json
GET _plugins/_alerting/comments/_search
{
  "query": {
    "match_all" : {}
  }
}
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}
  
#### Example response
```json
{
  "took": 14,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": ".opensearch-alerting-comments-history-2024.06.10-1",
        "_id": "xE5tBJABVWc3FrmWRL5i",
        "_version": 1,
        "_seq_no": 3,
        "_primary_term": 2,
        "_score": 1,
        "_source": {
          "entity_id": "vCZkA5ABWTh3kzuBEL_9",
          "entity_type": "alert",
          "content": "a different sample comment",
          "created_time": 1718061188191,
          "last_updated_time": null,
          "user": "admin"
        }
      },
      {
        "_index": ".opensearch-alerting-comments-history-2024.06.10-1",
        "_id": "0U6aBJABVWc3FrmWer9s",
        "_version": 3,
        "_seq_no": 9,
        "_primary_term": 3,
        "_score": 1,
        "_source": {
          "entity_id": "vCZkA5ABWTh3kzuBEL_9",
          "entity_type": "alert",
          "content": "sample updated comment",
          "created_time": 1718064151148,
          "last_updated_time": 1718064745485,
          "user": "admin"
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}

</details>

## Delete comment
This is an experimental feature and is not recommended for use in a production environment.   
{: .warning}

Remove a specific comment associated with an alert using the following request.

#### Example request
```json
DELETE _plugins/_alerting/comments/<comment-id>
```
{% include copy-curl.html %}


<details markdown="block">
  <summary>
    Select to expand example response
  </summary>
  {: .text-delta}

#### Example response
```json
{
  "_id": "0U6aBJABVWc3FrmWer9s"
}
```
{% include copy-curl.html %}

</details>

