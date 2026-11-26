---
layout: default
title: Complex conditionals
parent: Conditional execution
nav_order: 50
---

# Complex conditionals

In ingest pipelines, the `if` parameter in processors can evaluate complex conditions using Painless scripts. These conditionals help fine-tune document processing, allowing advanced logic such as type checking, regular expressions, and combining multiple criteria. For more information, see [Painless scripting language]({{site.url}}{{site.baseurl}}/scripting/painless/).

OpenSearch evaluates the condition for every document that passes through the processor, so expensive conditions slow down ingestion. Keep conditions as simple as possible.
{: .tip}

## Writing multi-statement conditions

A condition can contain multiple Painless statements, such as variable declarations and loops, as long as it returns a Boolean value. Because JSON strings can't contain line breaks, write the entire script on one line and separate the statements using semicolons. In OpenSearch Dashboards Dev Tools, you can instead enclose a multi-line script in triple quotation marks (`"""`). For more information, see [Using triple quotation marks in queries]({{site.url}}{{site.baseurl}}/dashboards/dev-tools/console/#using-triple-quotation-marks-in-queries).

The following pipeline calculates the total value of an order from its `items` array and flags orders whose total exceeds `1000` for review. Orders without an `items` field aren't flagged:

```json
PUT _ingest/pipeline/flag_large_orders
{
  "processors": [
    {
      "set": {
        "field": "review_required",
        "value": true,
        "if": "if (ctx.items == null) { return false; } double total = 0; for (def item : ctx.items) { total += item.price * item.quantity; } return total > 1000;"
      }
    }
  ]
}
```
{% include copy-curl.html %}

Test the pipeline using the following `_simulate` request:

```json
POST _ingest/pipeline/flag_large_orders/_simulate
{
  "docs": [
    {
      "_source": {
        "order_id": "A-2001",
        "items": [
          { "name": "Laptop stand", "price": 45.0, "quantity": 2 },
          { "name": "Monitor", "price": 329.0, "quantity": 1 }
        ]
      }
    },
    {
      "_source": {
        "order_id": "A-2002",
        "items": [
          { "name": "Monitor", "price": 329.0, "quantity": 4 }
        ]
      }
    }
  ]
}
```
{% include copy-curl.html %}

The first order totals `419` and isn't flagged. The second order totals `1316`, so the `review_required` field is added:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "order_id": "A-2001",
          "items": [
            { "name": "Laptop stand", "price": 45.0, "quantity": 2 },
            { "name": "Monitor", "price": 329.0, "quantity": 1 }
          ]
        },
        "_ingest": {
          "timestamp": "2026-10-14T20:23:18.723081887Z"
        }
      }
    },
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "review_required": true,
          "order_id": "A-2002",
          "items": [
            { "name": "Monitor", "price": 329.0, "quantity": 4 }
          ]
        },
        "_ingest": {
          "timestamp": "2026-10-14T20:23:18.723092429Z"
        }
      }
    }
  ]
}
```

## Multiple condition checks

You can combine logical operators like `&&` (and), `||` (or), and `!` (not) to construct more complex conditions. The following pipeline tags documents as `spam` and drops them if they contain an `error_code` higher than `1000`:

```json
PUT _ingest/pipeline/spammy_error_handler
{
  "processors": [
    {
      "set": {
        "field": "tags",
        "value": ["spam"],
        "if": "ctx.message != null && ctx.message.contains('OutOfMemoryError')"
      }
    },
    {
      "drop": {
        "if": "ctx.tags != null && ctx.tags.contains('spam') && ctx.error_code != null && ctx.error_code > 1000"
      }
    }
  ]
}
```
{% include copy-curl.html %}

You can test the pipeline using the following `_simulate` request:

```json
POST _ingest/pipeline/spammy_error_handler/_simulate
{
  "docs": [
    { "_source": { "message": "OutOfMemoryError occurred", "error_code": 1200 } },
    { "_source": { "message": "OutOfMemoryError occurred", "error_code": 800 } },
    { "_source": { "message": "All good", "error_code": 200 } }
  ]
}
```
{% include copy-curl.html %}

The first document is dropped because it contains an `OutOfMemoryError` string and an `error_code` higher than `1000`:

```json
{
  "docs": [
    null,
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "error_code": 800,
          "message": "OutOfMemoryError occurred",
          "tags": [
            "spam"
          ]
        },
        "_ingest": {
          "timestamp": "2025-04-23T10:20:10.704359884Z"
        }
      }
    },
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "error_code": 200,
          "message": "All good"
        },
        "_ingest": {
          "timestamp": "2025-04-23T10:20:10.704369801Z"
        }
      }
    }
  ]
}
```

## Type-safe evaluations

Use `instanceof` to ensure you're working with the right data types before performing operations. The following pipeline is configured to add a `processed` field set to `true` only if `message` is of type `String` and longer than `10` characters:

```json
PUT _ingest/pipeline/string_message_check
{
  "processors": [
    {
      "set": {
        "field": "processed",
        "value": true,
        "if": "ctx.message != null && ctx.message instanceof String && ctx.message.length() > 10"
      }
    }
  ]
}
```
{% include copy-curl.html %}

Test the pipeline using the following `_simulate` request:

```json
POST _ingest/pipeline/string_message_check/_simulate
{
  "docs": [
    { "_source": { "message": "short" } },
    { "_source": { "message": "This is a longer message" } },
    { "_source": { "message": 1234567890 } }
  ]
}
```
{% include copy-curl.html %}

Only the second document has a new field added:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "message": "short"
        },
        "_ingest": {
          "timestamp": "2025-04-23T10:28:14.040115261Z"
        }
      }
    },
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "processed": true,
          "message": "This is a longer message"
        },
        "_ingest": {
          "timestamp": "2025-04-23T10:28:14.040141469Z"
        }
      }
    },
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "message": 1234567890
        },
        "_ingest": {
          "timestamp": "2025-04-23T10:28:14.040144844Z"
        }
      }
    }
  ]
}
```


## Using regular expressions

Painless scripting supports the `=~` operator to evaluate regular expressions. For more examples and the limits that apply to regular expressions, see [Regex conditionals]({{site.url}}{{site.baseurl}}/ingest-pipelines/regex-conditionals/). The following pipeline flags suspicious IP patterns beginning with `192.168.`:

```json
PUT _ingest/pipeline/flag_suspicious_ips
{
  "processors": [
    {
      "set": {
        "field": "alert",
        "value": "suspicious_ip",
        "if": "ctx.ip != null && ctx.ip =~ /^192\\.168\\.\\d+\\.\\d+$/"
      }
    }
  ]
}
```
{% include copy-curl.html %}

Test the pipeline using the following `_simulate` request:

```json
POST _ingest/pipeline/flag_suspicious_ips/_simulate
{
  "docs": [
    { "_source": { "ip": "192.168.0.1" } },
    { "_source": { "ip": "10.0.0.1" } }
  ]
}
```
{% include copy-curl.html %}

The first document has an `alert` field added:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "alert": "suspicious_ip",
          "ip": "192.168.0.1"
        },
        "_ingest": {
          "timestamp": "2025-04-23T10:32:45.367916428Z"
        }
      }
    },
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "ip": "10.0.0.1"
        },
        "_ingest": {
          "timestamp": "2025-04-23T10:32:45.36793772Z"
        }
      }
    }
  ]
}
```

## Combining fields and null checks

The following pipeline adds a `priority` field set to `high` if `level` is `critical` and `timestamp` is provided. The script also ensures that all fields are present and meet specific conditions before proceeding:

```json
PUT _ingest/pipeline/critical_log_handler
{
  "processors": [
    {
      "set": {
        "field": "priority",
        "value": "high",
        "if": "ctx.level != null && ctx.level == 'critical' && ctx.timestamp != null"
      }
    }
  ]
}
```
{% include copy-curl.html %}

Test the pipeline using the following `_simulate` request:

```json
POST _ingest/pipeline/critical_log_handler/_simulate
{
  "docs": [
    { "_source": { "level": "critical", "timestamp": "2025-04-01T00:00:00Z" } },
    { "_source": { "level": "info", "timestamp": "2025-04-01T00:00:00Z" } },
    { "_source": { "level": "critical" } }
  ]
}
```
{% include copy-curl.html %}

Only the first document has a `priority` field added:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "priority": "high",
          "level": "critical",
          "timestamp": "2025-04-01T00:00:00Z"
        },
        "_ingest": {
          "timestamp": "2025-04-23T10:39:25.46840371Z"
        }
      }
    },
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "level": "info",
          "timestamp": "2025-04-01T00:00:00Z"
        },
        "_ingest": {
          "timestamp": "2025-04-23T10:39:25.46843021Z"
        }
      }
    },
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "level": "critical"
        },
        "_ingest": {
          "timestamp": "2025-04-23T10:39:25.468434835Z"
        }
      }
    }
  ]
}
```

## Multi-conditional processing

The following pipeline:

- Adds an `env` field set to `production` if it doesn't already exist.
- Adds a `severity` field set to `major` if the value in the `status` field is greater than or equal to `500`.
- Drops the document if the `env` field is set to `test` and the `message` field contains `debug`.

```json
PUT _ingest/pipeline/advanced_log_pipeline
{
  "processors": [
    {
      "set": {
        "field": "env",
        "value": "production",
        "if": "!ctx.containsKey('env')"
      }
    },
    {
      "set": {
        "field": "severity",
        "value": "major",
        "if": "ctx.status != null && ctx.status >= 500"
      }
    },
    {
      "drop": {
        "if": "ctx.env == 'test' && ctx.message != null && ctx.message.contains('debug')"
      }
    }
  ]
}
```
{% include copy-curl.html %}

Use the following `_simulate` request to test the pipeline:

```json
POST _ingest/pipeline/advanced_log_pipeline/_simulate
{
  "docs": [
    {
      "_source": {
        "status": 503,
        "message": "Server unavailable"
      }
    },
    {
      "_source": {
        "env": "test",
        "message": "debug log output"
      }
    },
    {
      "_source": {
        "status": 200,
        "message": "OK"
      }
    }
  ]
}
```
{% include copy-curl.html %}

In the response, note that the first document has the `env: production` and `severity: major` fields added. The second document is dropped. The third document has an `env: production` field added:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "severity": "major",
          "message": "Server unavailable",
          "env": "production",
          "status": 503
        },
        "_ingest": {
          "timestamp": "2025-04-23T10:51:46.795026554Z"
        }
      }
    },
    null,
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "message": "OK",
          "env": "production",
          "status": 200
        },
        "_ingest": {
          "timestamp": "2025-04-23T10:51:46.795048304Z"
        }
      }
    }
  ]
}
```

## Null-safe notation

Use null-safe navigation notation (`?.`) to check whether the field is `null`. Note that this notation can return `null` silently; therefore, we recommend first checking whether the returned value is `null` and then using operations like `.contains` or `==`.

Unsafe syntax:

```
"if": "ctx.message?.contains('debug')"
```

If the `message` field does not exist in the document, this request returns a `null_pointer_exception` with the message `Cannot invoke "Object.getClass()" because "value" is null`.

Safe syntax:

```
"if": "ctx.message != null && ctx.message.contains('debug')"
```

## Debugging conditions

To check how each condition was evaluated, run the [Simulate Pipeline API]({{site.url}}{{site.baseurl}}/ingest-pipelines/simulate-ingest/) with the `verbose` parameter set to `true`. For each processor, the response contains a `status` field. If a processor's condition evaluates to `false`, the `status` is `skipped`, and the `if` object shows the condition and its result.

The following request simulates a processor whose condition evaluates to `false` for the provided document:

```json
POST _ingest/pipeline/_simulate?verbose=true
{
  "pipeline": {
    "processors": [
      {
        "set": {
          "field": "severity",
          "value": "major",
          "if": "ctx.status != null && ctx.status >= 500"
        }
      }
    ]
  },
  "docs": [
    { "_source": { "status": 200 } }
  ]
}
```
{% include copy-curl.html %}

The response shows that the `set` processor was skipped because the condition returned `false`:

```json
{
  "docs": [
    {
      "processor_results": [
        {
          "processor_type": "set",
          "status": "skipped",
          "if": {
            "condition": "ctx.status != null && ctx.status >= 500",
            "result": false
          }
        }
      ]
    }
  ]
}
```
