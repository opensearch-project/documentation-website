---
layout: default
title: Complex conditionals
nav_order: 50
---

# Complex conditionals

In ingest pipelines, the `if` parameter in processors can evaluate complex conditions using Painless scripts. These conditionals help to fine-tune document processing, allowing advanced logic such as type checking, regular expressions, and combining multiple criteria.

## Multiple condition checks

You can combine logical operators like `&&` (and), `||` (or), and `!` (not) to construct more complex conditions. The following pipeline tags documents with a `spam` and drops them if they also contain an `error_code` higher than `1000`:

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

The first document is dropped, as it contains "OutOfMemoryError" string and the `error_code` higher than `1000`:

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

Use `instanceof` to ensure you’re working with the right data types before performing operations. The following pipeline is configured to add a field `processed` set to `true` only if `message` is of type `String` and longer than `10` characters:

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

Only the second document has new field added:

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

Painless supports the `=~` operator to evaluate regular expressions. The following pipeline flags suspicious IP patterns beginning with `192.168.`:

```json
PUT _ingest/pipeline/flag_suspicious_ips
{
  "processors": [
    {
      "set": {
        "field": "alert",
        "value": "suspicious_ip",
        "if": "ctx.ip != null && ctx.ip =~ /^192\.168\.\d+\.\d+$/"
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

The first document has `alert` field added:

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

Ensure all fields are present and meet specific conditions before proceeding. The following pipeline adds a `priority` field set to `high` if `level` is `critical` and `timestamp` is provided:

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

Only the first document has `priority` field added:

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

- adds a field `env` set to `production` if field `env` doesn't already exist.
- adds a field `severity` set to `major` if `status` field is higher or equal to `500`.
- drops the document if `env` field is set to `test` and `message` field contains `debug`.

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
        "if": "ctx.env == 'test' && ctx.message?.contains('debug')"
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

Expected output:
- First document has fields `env: production` and `severity: major` added.
- Second document is dropped.
- Third document has field `env: production` added.

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

Null-safe navigation notation (`?.`) should be used to check if the field is `null`, however, this notation can return `null` silently, therefore it is recommended to first check if the returned value is `null` and then use operations like `.contains` or `==`.

Not safe syntax:

```
"if": "ctx.message?.contains('debug')"
```

If the field `message` does not exist in the document, this will return `null_pointer_exception` with error `Cannot invoke "Object.getClass()" because "value" is null`

Safe syntax:

```
"if": "ctx.message != null && ctx.message.contains('debug')"
```