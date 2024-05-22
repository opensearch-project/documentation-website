---
layout: default
title: date
parent: Processors
grand_parent: Pipelines
nav_order: 50
---

# date


The `date` processor adds a default timestamp to an event, parses timestamp fields, and converts timestamp information to the International Organization for Standardization (ISO) 8601 format. This timestamp information can be used as an event timestamp.

## Configuration

The following table describes the options you can use to configure the `date` processor.

<!-- vale off -->
Option | Required | Type | Description
:--- | :--- | :--- | :---
`match` | Conditionally | [Match](#Match) | The date match configuration. This option cannot be defined at the same time as `from_time_received`. There is no default value.
`from_time_received` | Conditionally | Boolean | When `true`, the timestamp from the event metadata, which is the time at which the source receives the event, is added to the event data. This option cannot be defined at the same time as `match`. Default is `false`.
`date_when` | No | String | Specifies under what condition the `date` processor should perform matching. Default is no condition.
`to_origination_metadata` | No | Boolean | When `true`, the matched time is also added to the event's metadata as an instance of `Instant`. Default is `false`.
`destination` | No | String | The field used to store the timestamp parsed by the date processor. Can be used with both `match` and `from_time_received`. Default is `@timestamp`.
`output_format` | No | String | Determines the format of the timestamp added to an event. Default is `yyyy-MM-dd'T'HH:mm:ss.SSSXXX`.
`source_timezone` | No | String | The time zone used to parse dates, including when the zone or offset cannot be extracted from the value. If the zone or offset are part of the value, then the time zone is ignored. A list of all the available time zones is contained in the **TZ database name** column of [the list of database time zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List).
`destination_timezone` | No | String | The time zone used for storing the timestamp in the `destination` field. A list of all the available time zones is contained in the **TZ database name** column of [the list of database time zones](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List).
`locale` | No | String | The location used for parsing dates. Commonly used for parsing month names (`MMM`). The value can contain language, country, or variant fields in IETF BCP 47, such as `en-US`, or a string representation of the [locale](https://docs.oracle.com/javase/8/docs/api/java/util/Locale.html) object, such as `en_US`. A full list of locale fields, including language, country, and variant, can be found in [the language subtag registry](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry). Default is `Locale.ROOT`.
<!-- vale on -->

### Match

Option | Required | Type | Description
:--- | :--- | :--- | :---
`key` | Yes | String | Represents the event key against which to match patterns. Required if `match` is configured. 
`patterns` | Yes | List | A list of possible patterns that the timestamp value of the key can have. The patterns are based on a sequence of letters and symbols. The `patterns` support all the patterns listed in the Java [DatetimeFormatter](https://docs.oracle.com/javase/8/docs/api/java/time/format/DateTimeFormatter.html) reference. The timestamp value also supports `epoch_second`, `epoch_milli`, and `epoch_nano` values, which represent the timestamp as the number of seconds, milliseconds, and nanoseconds since the epoch. Epoch values always use the UTC time zone.

## Metrics

The following table describes common [Abstract processor](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-api/src/main/java/org/opensearch/dataprepper/model/processor/AbstractProcessor.java) metrics.

| Metric name | Type | Description |
| ------------- | ---- | -----------|
| `recordsIn` | Counter | Metric representing the ingress of records to a pipeline component. |
| `recordsOut` | Counter | Metric representing the egress of records from a pipeline component. |
| `timeElapsed` | Timer | Metric representing the time elapsed during execution of a pipeline component. |

The `date` processor includes the following custom metrics.

* `dateProcessingMatchSuccessCounter`: Returns the number of records that match at least one pattern specified by the `match configuration` option.
* `dateProcessingMatchFailureCounter`: Returns the number of records that did not match any of the patterns specified by the `patterns match` configuration option.

## Example: Add the default timestamp to an event
The following `date` processor configuration can be used to add a default timestamp in the `@timestamp` filed applied to all events:

```yaml
- date:
    from_time_received: true
    destination: "@timestamp"
```

## Example: Parse a timestamp to convert its format and time zone
The following `date` processor configuration can be used to parse the value of the timestamp applied to `dd/MMM/yyyy:HH:mm:ss` and write it in `yyyy-MM-dd'T'HH:mm:ss.SSSXXX` format:

```yaml
- date:
    match:
      - key: timestamp
        patterns: ["dd/MMM/yyyy:HH:mm:ss"] 
    destination: "@timestamp"
    output_format: "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
    source_timezone: "America/Los_Angeles"
    destination_timezone: "America/Chicago"
    locale: "en_US"
```
