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

---

<details closed markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
- TOC
{:toc}
</details>

---

## Create a query-level monitor
Introduced 1.0
{: .label .label-purple }

Query-level monitors run the query and check whether or not the results should trigger an alert. Query-level monitors can only trigger one alert at a time. For more information about query-level monitors and bucket-level monitors, see [Creating monitors]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/monitors/).

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

If you use a custom webhook for your destination and need to embed JSON in the message body, be sure to escape your quotes:

```json
{
  "message_template": {
    {% raw %}"source": "{ \"text\": \"Monitor {{ctx.monitor.name}} just entered alert status. Please investigate the issue. - Trigger: {{ctx.trigger.name}} - Severity: {{ctx.trigger.severity}} - Period start: {{ctx.periodStart}} - Period end: {{ctx.periodEnd}}\" }"{% endraw %}
  }
}
```

Optionally, to specify a backend role, you can add the `rbac_roles` parameter and backend role names to the bottom of your create monitor request.

#### Example request

The following request creates a query-level monitor and provides two backend roles, `role1` and `role2`. The section at the bottom of the request shows the line that specifies the roles with this syntax: `"rbac_roles": ["role1", "role2"]`.

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

To learn more about using backend roles to limit access, see [(Advanced) Limit access by backend role]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/security/#advanced-limit-access-by-backend-role).

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

If you want to specify a timezone, you can do so by including a [cron expression]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/cron/) with a timezone name in the `schedule` section of your request.

The following example creates a monitor that runs at 12:10 PM Pacific Time on the 1st day of every month.

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

For a full list of time zone names, refer to [Wikipedia](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). The alerting plugin uses the Java [TimeZone](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/TimeZone.html) class to convert a [`ZoneId`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/time/ZoneId.html) to a valid time zone.

---

## Bucket-level monitors

Bucket-level monitors categorize results into buckets separated by fields. The monitor then runs your script with each bucket's results and evaluates whether to trigger an alert. For more information about bucket-level and query-level monitors, see [Creating monitors]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/monitors/).

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


To retrieve metadata for an individual document finding entry, you can search for the finding by its `findingId` as follows:

```json
GET /_plugins/_alerting/findings/_search?findingId=gKQhj8WJit3BxjGfiOXC
```

The response returns the number of individual finding entries in the `total_findings` field.

To get more specific results in a findings search, you can use any of the optional path parameters that are defined in the following table:

Path parameter | Description | Usage
:--- | :--- : :---
`findingId` | The identifier for the finding entry. | The finding ID is returned in the initial query response.
`sortString` | This field specifies which string the Alerting plugin uses to sort the findings. | The default value is `id`.
`sortOrder` | The order to sort the list of findings, either ascending or descending. | Use `sortOrder=asc` to indicate ascending, or `sortOrder=desc` for descending sort order.
`size` | An optional limit for the maximum number of results returned in the response. | There is no minimum or maximum values.
`startIndex` | The pagination indicator. | Default is `0`.
`searchString` | The finding attribute you want returned in the search. | To search in a specific index, specify the index name in the request path. For example, to search findings in the `indexABC` index, use `searchString=indexABC'.

### Create a document-level monitor

You can create a document-level monitor with a POST request that provides the monitor details in the request body.
At a minimum, you need to provide the following details: specify the queries or combinations by tag with the `inputs` field, a valid trigger condition, and provide the notification message in the `action` field.

The following table shows the syntax to use for each trigger option:

Trigger options | Definition | Syntax
:--- | :--- : :---
Tag | Creates alerts for documents that match a multiple query with this tag applied. If you group multiple queries by a single tag, then you can set it to trigger an alert if the results are returned by this tag name.| `query[tag=<tag-name>]`
Query by name | Creates alerts for documents matched or returned by the named query.  | `query[name=<query-name>]`
Query by ID | Creates alerts for documents that were returned by the identified query. | `query[id=<query-id>]`

#### Example request

The following example shows how to create a document-level monitor:

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

### Limitations

If you run a document-level query while the index is getting reindexed, the API response will not return the reindexed results. To get updates, wait until the reindexing process completes, then rerun the query.
{: .tip}

## Update monitor
Introduced 1.0
{: .label .label-purple }

When updating a monitor, you can optionally include `seq_no` and `primary_term` as URL parameters. If these numbers don't match the existing monitor or the monitor doesn't exist, the alerting plugin throws an error. OpenSearch increments the version number and the sequence number automatically (see the example response).

#### Request

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


---

## Get monitor
Introduced 1.0
{: .label .label-purple }

#### Request

```
GET _plugins/_alerting/monitors/<monitor_id>
```

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


---

## Monitor stats
Introduced 1.0
{: .label .label-purple }

Returns statistics about the alerting feature. Use `_plugins/_alerting/stats` to find node IDs and metrics. Then you can drill down using those values.

#### Request

```json
GET _plugins/_alerting/stats
GET _plugins/_alerting/stats/<metric>
GET _plugins/_alerting/<node-id>/stats
GET _plugins/_alerting/<node-id>/stats/<metric>
```

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


---

## Delete monitor
Introduced 1.0
{: .label .label-purple }

#### Request

```
DELETE _plugins/_alerting/monitors/<monitor_id>
```

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


---

## Search monitors
Introduced 1.0
{: .label .label-purple }

#### Request

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


---

## Run monitor
Introduced 1.0
{: .label .label-purple }

You can add the optional `?dryrun=true` parameter to the URL to show the results of a run without actions sending any message.


#### Request

```json
POST _plugins/_alerting/monitors/<monitor_id>/_execute
```

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

---

## Get alerts
Introduced 1.0
{: .label .label-purple }

Returns an array of all alerts.

#### Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description
| :--- | :--- | :---
| `sortString` | String | Determines how to sort the results. Defaults to `monitor_name.keyword`.
| `sortOrder` | String | Determines the order of the results. Options are `asc` or `desc`. Defaults to `asc`.
| `missing` | String | Optional.
| `size` | String | Determines the size of the request to be returned. Defaults to `20`.
| `startIndex` | String | The index to start from. Used for paginating results. Defaults to `0`.
| `searchString` | String | A search string used to look for a specific alert. Defaults to an empty string.
| `severityLevel` | String | The severity level to filter for. Defaults to `ALL`.
| `alertState` | String | The alert state to filter for. Defaults to `ALL`.
| `monitorId` | String | Filters by monitor ID.

#### Request

```json
GET _plugins/_alerting/monitors/alerts
```

#### Response

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

---

## Acknowledge alert
Introduced 1.0
{: .label .label-purple }

[After getting your alerts](#get-alerts), you can acknowledge any number of active alerts in one call. If the alert is already in an ERROR, COMPLETED, or ACKNOWLEDGED state, it appears in the `failed` array.


#### Request

```json
POST _plugins/_alerting/monitors/<monitor-id>/_acknowledge/alerts
{
  "alerts": ["eQURa3gBKo1jAh6qUo49"]
}
```

#### Example response

```json
{
  "success": [
  "eQURa3gBKo1jAh6qUo49"
  ],
  "failed": []
}
```

---

## Create destination
Introduced 1.0
{: .label .label-purple }

#### Requests

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


---

## Update destination
Introduced 1.0
{: .label .label-purple }

When updating a destination, you can optionally include `seq_no` and `primary_term` as URL parameters. If these numbers don't match the existing destination or the destination doesn't exist, the alerting plugin throws an error. OpenSearch increments the version number and the sequence number automatically (see the example response).

#### Request

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


---

## Get destination
Introduced 1.0
{: .label .label-purple }

Retrieve one destination.

#### Requests

```json
GET _plugins/_alerting/destinations/<destination-id>
```

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


---

## Get destinations
Introduced 1.0
{: .label .label-purple }

Retrieve all destinations.

#### Requests

```json
GET _plugins/_alerting/destinations
```

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


---

## Delete destination
Introduced 1.0
{: .label .label-purple }

#### Request

```
DELETE _plugins/_alerting/destinations/<destination-id>
```

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
---

## Create email account
Introduced 1.0
{: .label .label-purple }

#### Request
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

## Update email account
Introduced 1.0
{: .label .label-purple }

When updating an email account, you can optionally include `seq_no` and `primary_term` as URL parameters. If these numbers don't match the existing email account or the email account doesn't exist, the alerting plugin throws an error. OpenSearch increments the version number and the sequence number automatically (see the example response).

#### Request
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

## Get email account
Introduced 1.0
{: .label .label-purple }

#### Request
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

## Delete email account
Introduced 1.0
{: .label .label-purple }

#### Request
```
DELETE _plugins/_alerting/destinations/email_accounts/<email_account_id>
```
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

## Search email account
Introduced 1.0
{: .label .label-purple }

#### Request

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

---

## Create email group
Introduced 1.0
{: .label .label-purple }

#### Request

```json
POST _plugins/_alerting/destinations/email_groups
{
  "name": "example_email_group",
  "emails": [{
    "email": "example@email.com"
  }]
}
```

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

## Update email group
Introduced 1.0
{: .label .label-purple }

When updating an email group, you can optionally include `seq_no` and `primary_term` as URL parameters. If these numbers don't match the existing email group or the email group doesn't exist, the alerting plugin throws an error. OpenSearch increments the version number and the sequence number automatically (see the example response).

#### Request

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

## Get email group
Introduced 1.0
{: .label .label-purple }

#### Request
```json
GET _plugins/_alerting/destinations/email_groups/<email_group_id>
{
  "name": "example_email_group",
  "emails": [{
    "email": "example@email.com"
  }]
}
```
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

## Delete email group
Introduced 1.0
{: .label .label-purple }

#### Request
```
DELETE _plugins/_alerting/destinations/email_groups/<email_group_id>
```
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

## Search email group
Introduced 1.0
{: .label .label-purple }

#### Request

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
---
