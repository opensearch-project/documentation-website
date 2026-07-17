---
layout: default
title: Data types
nav_order: 7
redirect_from:
  - /search-plugins/sql/datatypes/
---

# Data types

The following table shows the data types supported by the SQL plugin and how each one maps to SQL and OpenSearch data types:

| OpenSearch SQL type | OpenSearch type | SQL type
:--- | :--- | :---
`boolean` |	Boolean |	`BOOLEAN`
`byte` |	Byte |	`TINYINT`
`short` |	Byte |	`SMALLINT`
`integer` |	Integer |	`INTEGER`
`long` | Long |	`BIGINT`
`float` |	Float |	`REAL`
`half_float` | Float | `FLOAT`
`scaled_float` | Float | `DOUBLE`
`double` | Double | `DOUBLE`
`keyword` |	String | `VARCHAR`
`text` | Text | `VARCHAR`
`date` | Timestamp | `TIMESTAMP`
`date_nanos` | Timestamp | `TIMESTAMP`
`ip` | IP | `VARCHAR`
`binary` | Binary | `VARBINARY`
`object` | Struct | `STRUCT`
`nested` | Array | `STRUCT`

In addition to this list, the SQL plugin also supports the `datetime` type, though it doesn't have a corresponding mapping with OpenSearch or SQL.
To use a function without a corresponding mapping, you must explicitly convert the data type to one that does.


## Date and time types

The date and time types represent a time period: `DATE`, `TIME`, `DATETIME`, `TIMESTAMP`, and `INTERVAL`. By default, the OpenSearch DSL uses the `date` type as the only date-time related type that contains all information of an absolute time point.

To integrate with SQL, each type other than the `timestamp` type holds part of the time period information. To use date-time functions, see [Date and time]({{site.url}}{{site.baseurl}}/sql-and-ppl/functions#date-and-time). Some functions might have restrictions for the input argument type.


### Date

The `date` type represents the calendar date regardless of the time zone. A given date value is a 24-hour period, but this period varies in different timezones and might have flexible hours during daylight saving programs. The `date` type doesn't contain time information and it only supports a range of `1000-01-01` to `9999-12-31`.

| Type | Syntax | Range
:--- | :--- | :---
`date` | `yyyy-MM-dd` | `0001-01-01` to `9999-12-31`

### Time

The `time` type represents the time of a clock regardless of its time zone. The `time` type doesn't contain date information.

| Type | Syntax | Range
:--- | :--- | :---
`time` | `hh:mm:ss[.fraction]` | `00:00:00.0000000000` to `23:59:59.9999999999`

### Date and time

The `datetime` type is a combination of date and time. It doesn't contain time zone information. For an absolute time point that contains date, time, and time zone information, see [Timestamp](#timestamp).

| Type | Syntax | Range
:--- | :--- | :---
`datetime` | `yyyy-MM-dd hh:mm:ss[.fraction]` | `0001-01-01 00:00:00.0000000000` to `9999-12-31 23:59:59.9999999999`

### Timestamp

The `timestamp` type is an absolute instance independent of time zone or convention. For example, for a given point of time, if you change the timestamp to a different time zone, its value changes accordingly.

The `timestamp` type is stored differently from the other types. It's converted from its current time zone to UTC for storage and converted back to its set time zone from UTC when it's retrieved.

| Type | Syntax | Range
:--- | :--- | :---
`timestamp` | `yyyy-MM-dd hh:mm:ss[.fraction]` | `0001-01-01 00:00:01.9999999999` UTC to `9999-12-31 23:59:59.9999999999`

### Interval

The `interval` type represents a temporal duration or a period.

| Type | Syntax
:--- | :---
`interval` | `INTERVAL expr unit`

The `expr` unit is any expression that eventually iterates to a quantity value. It represents a unit for interpreting the quantity, including `MICROSECOND`, `SECOND`, `MINUTE`, `HOUR`, `DAY`, `WEEK`, `MONTH`, `QUARTER`, and `YEAR`. The `INTERVAL` keyword and the unit specifier are not case sensitive.

The `interval` type has two classes of intervals: year-week intervals and day-time intervals.

- Year-week intervals store years, quarters, months, and weeks.
- Day-time intervals store days, hours, minutes, seconds, and microseconds.


### Convert between date and time types

Apart from the `interval` type, all date and time types can be converted to each other. The conversion might alter the value or cause some information loss. For example, when extracting the `time` value from a `datetime` value, or converting a `date` value to a `datetime` value, and so on.

The SQL plugin supports the following conversion rules for each of the types:

**Convert from date**

- Because the `date` value doesn't have any time information, conversion to the `time` type isn't useful and always returns a zero time value of `00:00:00`.
- Converting from `date` to `datetime` has a data fill-up due to the lack of time information. It attaches the time `00:00:00` to the original date by default and forms a `datetime` instance. For example, conversion of `2020-08-17` to a `datetime` type is `2020-08-17 00:00:00`.
- Converting to `timestamp` type alternates both the `time` value and the time zone information. It attaches the zero time value `00:00:00` and the session time zone (UTC by default) to the date. For example, conversion of `2020-08-17` to a `datetime` type with a session time zone UTC is `2020-08-17 00:00:00 UTC`.

**Convert from time**

- You cannot convert the `time` type to any other date and time types because it doesn't contain any date information.

**Convert from `datetime`**

- Converting `datetime` to `date` extracts the date value from the `datetime` value. For example, conversion of `2020-08-17 14:09:00` to a `date` type is `2020-08-08`.
- Converting `datetime` to `time` extracts the time value from the `datetime` value. For example, conversion of `2020-08-17 14:09:00` to a `time` type is `14:09:00`.
- Because the `datetime` type doesn't contain time zone information, converting to `timestamp` type fills up the time zone value with the session time zone. For example, conversion of `2020-08-17 14:09:00` (UTC) to a `timestamp` type is `2020-08-17 14:09:00 UTC`.

**Convert from timestamp**

- Converting from a `timestamp` type to a `date` type extracts the date value and converting to a `time` type extracts the time value. Converting from a `timestamp` type to `datetime` type extracts only the `datetime` value and leaves out the time zone value. For example, conversion of `2020-08-17 14:09:00` UTC to a `date` type is `2020-08-17`, to a `time` type is `14:09:00`, and to a `datetime` type is `2020-08-17 14:09:00`.
