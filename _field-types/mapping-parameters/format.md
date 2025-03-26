---
layout: default
title: Format
parent: Mapping parameters
grand_parent: Mapping and field types
nav_order: 50
has_children: false
has_toc: false
---

# Format

The `format` mapping parameter specifies the date formats that a date field can accept during indexing. By defining the expected date formats, you ensure that date values are correctly parsed and stored, facilitating accurate search and aggregation operations.

## Example: Defining a custom date format

Create index `events` with `event_date` field configured to a custom date format `yyyy-MM-dd HH:mm:ss` using following request:

```json
PUT events
{
  "mappings": {
    "properties": {
      "event_date": {
        "type": "date",
        "format": "yyyy-MM-dd HH:mm:ss"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document using matching format `"2025-03-26 15:30:00"` for the `event_date` field:

```
PUT events/_doc/1
{
  "event_name": "Conference",
  "event_date": "2025-03-26 15:30:00"
}
```
{% include copy-curl.html %}

## Example: Using multiple date formats

Create an index where `log_timestamp` field accepts both the custom date format `yyyy-MM-dd HH:mm:ss` and the `epoch_millis` format using the following request:

```json
PUT logs
{
  "mappings": {
    "properties": {
      "log_timestamp": {
        "type": "date",
        "format": "yyyy-MM-dd HH:mm:ss||epoch_millis"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index the first document using date-time string `"2025-03-26 08:45:00"`:

```json
PUT logs/_doc/1
{
  "message": "System rebooted",
  "log_timestamp": "2025-03-26 08:45:00"
}
```
{% include copy-curl.html %}

Index the second document using the millisecond representation `1711442700000`:

```json
PUT logs/_doc/2
{
  "message": "System updated",
  "log_timestamp": 1711442700000
}
```
{% include copy-curl.html %}

## Built-in date formats

The following table lists all built-in date formats:

| Format name | Description | Example |
|------------|-------------|---------|
| `epoch_millis` | A formatter for the number of milliseconds since the epoch. Note that this timestamp is subject to the limits of a Java Long.MIN_VALUE and Long.MAX_VALUE. | `1711442700000` |
| `epoch_second` | A formatter for the number of seconds since the epoch. This timestamp is subject to the limits of a Java `Long.MIN_VALUE` and `Long.MAX_VALUE` divided by `1000`. | `1711442700` |
| `date_optional_time` / `strict_date_optional_time` | A generic ISO `datetime` parser where the date must include the year at a minimum and the time (separated by "T") is optional. Note: `date_optional_time` is lenient and may parse unexpected values; use `strict_date_optional_time` when pairing with numeric formats. | `2025-03-26T10:00:00Z` or `2025-03-26` |
| `strict_date_optional_time_nanos` | Similar to `strict_date_optional_time` but with nanosecond resolution in the fractional seconds part. | `2025-03-26T10:00:00.123456789Z` |
| `basic_date` | A basic formatter for a full date as a four-digit year, two-digit month, and two-digit day (`yyyyMMdd`). | `20250326` |
| `basic_date_time` | Combines basic date and time with milliseconds, separated by "T" (`yyyyMMddTHHmmss.SSSZ`). | `20250326T103000.000Z` |
| `basic_date_time_no_millis` | Combines basic date and time without milliseconds, separated by "T" (`yyyyMMddTHHmmssZ`). | `20250326T103000Z` |
| `basic_ordinal_date` | Formatter for a full ordinal date using a four-digit year and three-digit day-of-year (`yyyyDDD`). | `2025075` |
| `basic_ordinal_date_time` | Formatter for a full ordinal date and time with milliseconds (`yyyyDDDTHHmmss.SSSZ`). | `2025075T103000.000Z` |
| `basic_ordinal_date_time_no_millis` | Formatter for a full ordinal date and time without milliseconds (`yyyyDDDTHHmmssZ`). | `2025075T103000Z` |
| `basic_time` | Formatter for time with two-digit hour, minute, second, three-digit milliseconds, and time zone offset (`HHmmss.SSSZ`). | `103000.000Z` |
| `basic_time_no_millis` | Formatter for time with two-digit hour, minute, and second with time zone offset (`HHmmssZ`). | `103000Z` |
| `basic_t_time` | Formatter for time prefixed by "T" with two-digit hour, minute, second, three-digit milliseconds, and time zone offset (`THHmmss.SSSZ`). | `T103000`.000Z |
| `basic_t_time_no_millis` | Formatter for time prefixed by "T" without milliseconds (`THHmmssZ`). | `T103000Z` |
| `basic_week_date` / `strict_basic_week_date` | Formatter for a full date as a four-digit `weekyear`, two-digit week of `weekyear`, and one-digit day of week (`xxxxWwwe`). | `2025W122` |
| `basic_week_date_time` / `strict_basic_week_date_time` | Combines basic week date and time with milliseconds (`xxxxWwweTHHmmss.SSSZ`). | `2025W122T103000.000Z` |
| `basic_week_date_time_no_millis` / `strict_basic_week_date_time_no_millis` | Combines basic week date and time without milliseconds (`xxxxWwweTHHmmssZ`). | `2025W122T103000Z` |
| `date` / `strict_date` | Formatter for a full date as a four-digit year, two-digit month, and two-digit day (`yyyy-MM-dd`). | `2025-03-26` |
| `date_hour` / `strict_date_hour` | Combines a full date and a two-digit hour (`yyyy-MM-ddTHH`). | `2025-03-26T10` |
| `date_hour_minute` / `strict_date_hour_minute` | Combines a full date, two-digit hour, and two-digit minute (`yyyy-MM-ddTHH:mm`). | `2025-03-26T10:30` |
| `date_hour_minute_second` / `strict_date_hour_minute_second` | Combines a full date, two-digit hour, minute, and second (`yyyy-MM-ddTHH:mm:ss`). | `2025-03-26T10:30:00` |
| `date_hour_minute_second_fraction` / `strict_date_hour_minute_second_fraction` | Combines a full date, two-digit hour, minute, second, and three-digit fraction (`yyyy-MM-ddTHH:mm:ss.SSS`). | `2025-03-26T10:30:00.123` |
| `date_hour_minute_second_millis` / `strict_date_hour_minute_second_millis` | Same as above, explicitly for millisecond precision (`yyyy-MM-ddTHH:mm:ss.SSS`). | `2025-03-26T10:30:00.123` |
| `date_time` / `strict_date_time` | Combines a full date and time with milliseconds (`yyyy-MM-ddTHH:mm:ss.SSSZ`). | `2025-03-26T10:30:00.000Z` |
| `date_time_no_millis` / `strict_date_time_no_millis` | Combines a full date and time without milliseconds (`yyyy-MM-ddTHH:mm:ssZ`). | `2025-03-26T10:30:00Z` |
| `hour` / `strict_hour` | Formatter for a two-digit hour (`HH`). | `10` |
| `hour_minute` / `strict_hour_minute` | Formatter for a two-digit hour and two-digit minute (`HH:mm`). | `10:30` |
| `hour_minute_second` / `strict_hour_minute_second` | Formatter for a two-digit hour, minute, and second (`HH:mm:ss`). | `10:30:00` |
| `hour_minute_second_fraction` / `strict_hour_minute_second_fraction` | Formatter for a two-digit hour, minute, second, and three-digit fraction (`HH:mm:ss.SSS`). | `10:30:00.123` |
| `hour_minute_second_millis` / `strict_hour_minute_second_millis` | Formatter for a two-digit hour, minute, second, and three-digit milliseconds (`HH:mm:ss.SSS`). | `10:30:00.123` |
| `ordinal_date` / `strict_ordinal_date` | Formatter for a full ordinal date using a four-digit year and three-digit day-of-year (`yyyy-DDD`). | `2025-085` |
| `ordinal_date_time` / `strict_ordinal_date_time` | Formatter for a full ordinal date and time with milliseconds (`yyyy-DDDTHH:mm:ss.SSSZ`). | `2025-085T10:30:00.000Z` |
| `ordinal_date_time_no_millis` / `strict_ordinal_date_time_no_millis` | Formatter for a full ordinal date and time without milliseconds (`yyyy-DDDTHH:mm:ssZ`). | `2025-085T10:30:00Z` |
| `time` / `strict_time` | Formatter for time with two-digit hour, minute, second, three-digit fraction, and time zone offset (`HH:mm:ss.SSSZ`). | `10:30:00.123Z` |
| `time_no_millis` / `strict_time_no_millis` | Formatter for time with two-digit hour, minute, and second with time zone offset (`HH:mm:ssZ`). | `10:30:00Z` |
| `t_time` / `strict_t_time` | Formatter for time prefixed with "T", including two-digit hour, minute, second, three-digit fraction, and time zone offset (`THH:mm:ss.SSSZ`). | `T10:30:00.123Z` |
| `t_time_no_millis` / `strict_t_time_no_millis` | Formatter for time prefixed with "T" without milliseconds (`THH:mm:ssZ`). | `T10:30:00Z` |
| `week_date` / `strict_week_date` | Formatter for a full date as a four-digit `weekyear`, two-digit week of `weekyear`, and one-digit day of week using ISO week-date (`YYYY-Www-e`). | `2025-W12-2` |
| `week_date_time` / `strict_week_date_time` | Combines a full `weekyear` date and time with milliseconds using ISO week-date (`YYYY-Www-eTHH:mm:ss.SSSZ`). | `2025-W12-2T10:30:00.000Z` |
| `week_date_time_no_millis` / `strict_week_date_time_no_millis` | Combines a full `weekyear` date and time without milliseconds using ISO week-date (`YYYY-Www-eTHH:mm:ssZ`). | `2025-W12-2T10:30:00Z` |
| ``weekyear`` / `strict_`weekyear`` | Formatter for a four-digit `weekyear` using ISO week-date (`YYYY`). | `2025` |
| ``weekyear`_week` / `strict_`weekyear`_week` | Formatter for a four-digit `weekyear` and two-digit week of `weekyear` using ISO week-date (`YYYY-Www`). | `2025-W12` |
| ``weekyear`_week_day` / `strict_`weekyear`_week_day` | Formatter for a four-digit `weekyear`, two-digit week, and one-digit day of week using ISO week-date (`YYYY-Www-e`). | `2025-W12-2` |
| `year` / `strict_year` | Formatter for a four-digit year (`yyyy`). | `2025` |
| `year_month` / `strict_year_month` | Formatter for a four-digit year and two-digit month (`yyyy-MM`). | `2025-03` |
| `year_month_day` / `strict_year_month_day` | Formatter for a four-digit year, two-digit month, and two-digit day (`yyyy-MM-dd`). | `2025-03-26` |
