---
layout: default
title: Common REST parameters
nav_order: 93
redirect_from:
  - /opensearch/common-parameters/
---

# Common REST parameters 
**Introduced 1.0**
{: .label .label-purple }

OpenSearch supports the following parameters for all REST operations:

## Human-readable output

To convert output units to human-readable values (for example, `1h` for 1 hour and `1kb` for 1,024 bytes), add `?human=true` to the request URL.  

#### Example request

The following request requires response values to be in human-readable format:

```json

GET {index_name}/_search?human=true
```

## Pretty result

To get back JSON responses in a readable format, add `?pretty=true` to the request URL.  

#### Example request

The following request requires the response to be displayed in pretty JSON format:

```json

GET {index_name}/_search?pretty=true
```

## Content type

To specify the type of content in the request body, use the `Content-Type` key name in the request header. Most operations support JSON, YAML, and CBOR formats.  

#### Example request

The following request specifies JSON format for the request body:

```json

curl -H "Content-type: application/json" -XGET localhost:9200/_scripts/<template_name>
```

## Request body in query string

If the client library does not accept a request body for non-POST requests, use the `source` query string parameter to pass the request body. Also, specify the `source_content_type` parameter with a supported media type such as `application/json`.  


#### Example request

The following request searches the documents in the `shakespeare` index for a specific field and value:

```json

GET shakespeare/search?source={"query":{"exists":{"field":"speaker"}}}&source_content_type=application/json
```

## Stack traces

To include the error stack trace in the response when an exception is raised, add `error_trace=true` to the request URL.  

#### Example request

The following request sets `error_trace` to `true` so that the response returns exception-triggered errors:

```json

GET {index_name}/_search?error_trace=true
```

## Filtered responses

To reduce the response size use the `filter_path` parameter to filter the fields that are returned. This parameter takes a comma-separated list of filters. It supports using wildcards to match any field or part of a field's name. You can also exclude fields with `-`.  

#### Example request

The following request specifies filters to limit the fields returned in the response:

```json

GET _search?filter_path={field_name}.*,-{field_name}
```

## Units

OpenSearch APIs support the following units.

### Time units

The following table lists all supported time units.

Units | Specify as
:--- | :---
Days | `d`
Hours | `h`
Minutes | `m`
Seconds | `s`
Milliseconds | `ms`
Microseconds | `micros`
Nanoseconds | `nanos`
 
### Distance units

The following table lists all supported distance units.

Units | Specify as
:--- | :---
Miles | `mi` or `miles`
Yards | `yd` or `yards`
Feet | `ft` or `feet`
Inches | `in` or `inch`
Kilometers | `km` or `kilometers`
Meters | `m` or `meters`
Centimeters | `cm` or `centimeters`
Millimeters | `mm` or `millimeters`
Nautical miles | `NM`, `nmi`, or `nauticalmiles` 

## Cron expressions

Several OpenSearch features accept cron expressions for scheduling, including [Index State Management]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies/), [alerting]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/monitors/), and [anomaly detection]({{site.url}}{{site.baseurl}}/observing-your-data/ad/index/). OpenSearch uses the Quartz cron parser, which extends standard UNIX cron with a seconds field and an optional year field. All schedule times are in UTC.

A cron expression has the following format, where angle brackets denote required fields and square brackets denote an optional field:

```
<seconds> <minutes> <hours> <day_of_month> <month> <day_of_week> [year]
```

The following table describes each field.

| Field | Required | Values | Special characters |
| :--- | :--- | :--- | :--- |
| Seconds | Yes | 0--59 | `, - * /` |
| Minutes | Yes | 0--59 | `, - * /` |
| Hours | Yes | 0--23 | `, - * /` |
| Day of month | Yes | 1--31 | `, - * / ? L W` |
| Month | Yes | 1--12 or JAN--DEC | `, - * /` |
| Day of week | Yes | 1--7 or SUN--SAT | `, - * / ? L #` |
| Year | No | 1970--2099 | `, - * /` |

The following table describes the special characters.

| Character | Description |
| :--- | :--- |
| `*` | Matches all values. For example, `*` in the hours field means every hour. |
| `?` | No specific value. Use in `day_of_month` or `day_of_week` when specifying the other. |
| `-` | Range. For example, `9-17` in hours means every hour from 9:00 to 17:00 UTC. |
| `,` | Multiple values. For example, `MON,WED,FRI` in `day_of_week`. |
| `/` | Increment. For example, `0/15` in minutes means every 15 minutes starting at minute 0. |
| `L` | Last. In `day_of_month`, the last day of the month. In `day_of_week`, the last occurrence of that day (for example, `6L` is the last Friday). |
| `W` | The nearest weekday to the given day. For example, `15W` triggers on the closest Monday--Friday to the 15th. |
| `#` | The Nth occurrence of a day in the month. For example, `6#1` is the first Friday of the month. |

### Examples

| Expression | Description |
| :--- | :--- |
| `0 5 9 * * ?` | 9:05 AM UTC every day |
| `0 0/15 9 * * ?` | Every 15 minutes from 9:00 to 9:45 AM UTC |
| `0 5 9 ? * MON-FRI` | 9:05 AM UTC Monday through Friday |
| `0 5 9 L * ?` | 9:05 AM UTC on the last day of every month |
| `0 5 9 ? * 6#1` | 9:05 AM UTC on the first Friday of every month |

For the full Quartz cron specification, see the [Quartz CronTrigger Tutorial](http://www.quartz-scheduler.org/documentation/quartz-2.2.x/tutorials/tutorial-lesson-06.html).

## `X-Opaque-Id` header

You can specify an opaque identifier for any request using the `X-Opaque-Id` header. This identifier is used to track tasks and deduplicate deprecation warnings in server-side logs. This identifier is used to differentiate between callers sending requests to your OpenSearch cluster. Do not specify a unique value per request.

#### Example request

The following request adds an opaque ID to the request:

```bash
curl -H "X-Opaque-Id: my-curl-client-1" -XGET localhost:9200/_tasks
```
{% include copy.html %}

## `X-Request-Id` header

You can specify a unique identifier for a search request using the `X-Request-Id` header. This identifier is used to track individual search requests and can be referenced in logs, such as slow logs, for troubleshooting and analysis. The value must be a 32-character hexadecimal string. 

#### Example request

The following request adds a request ID to a search request:

```bash
curl -X GET "http://localhost:9200/_search" \
  -H "Content-Type: application/json" \
  -H "X-Request-Id: 19d538d7c42d09240be001d1e4ff6201" \
  -d '{"query": {"match_all": {}}}'
```
{% include copy.html %}
