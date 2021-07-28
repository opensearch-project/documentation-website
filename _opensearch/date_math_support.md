---
layout: default
title: Date math support for index names
nav_order: 92
---

# Date math support for index names

Date math is shorthand arithmetic for finding relative dates.

If you're indexing time-series data with the dates mapped in the index names, you can use date math in your queries to filter index names and limit the number of searched indices.

## Date math syntax

The date math syntax for an index name is as follows:

```
<static_name{date_math_expr{date_format|time_zone}}>
```

- `static_name`: The unchanged or static portion of the index name. To use the characters `{` and `}` in the static part of an index name, escape them with a backslash `\`.
- `date_math_expr`: The changing or dynamic portion of the index name that’s computed by the date math expression. For example, `now+1h` adds one hour, `now-1d` subtracts one hour, and `now/d` rounds down to the nearest day, where `now` represents the current timestamp.
- `date_format`: (Optional) Specify the format for the computed date. The default value is `YYYY.MM.dd`. Make sure that you’re using the correct small or capital letters in the date format. For example, `mm` denotes minute of hour, while `MM` denotes month of year. Similarly, `hh` denotes the hour in the `1-12` range in combination with AM/PM, while `HH` denotes the hour in the `0-23` 24-hour range.
- `time_zone`: (Optional) Specify the timezone offset. The default value is UTC. For example, the UTC time offset for PST is `-08:00`.

## Date math example

You must enclose date math index names within angle brackets.

If today is 22nd March, 2024:

- `<logstash-{now/d}>` resolves to `logstash-2024.03.22`
- `<logstash-{now/M}>` resolves to `logstash-2024.03.01`
- `<logstash-{now/M{YYYY.MM}}>` resolves to `logstash-2024.03`
- `<logstash-{now/M-1M{YYYY.MM}}>` resolves to `logstash-2024.02`
- `<logstash-{now/d{yyyy.MM.dd|+12:00}}>` resolves to `logstash-2024.03.23`

You need to encode all special characters in URI format:

Special characters | URI format
:--- | :---
`<` | %3C
`>` | %3E
`/` | %2F
`{` | %7B
`}` | %7D
`|` | %7C
`+` | %2B
`:` | %3A
`,` | %2C
`\` | %5C

If you are searching for errors in your daily logs with the default Logstash index name format `logstash-YYYY.MM.dd`, you can use date math to restrict the search to indices of the past three days:

```
# GET <logstash-{now/d-2d}>,<logstash-{now/d-1d}>,<logstash-{now/d}>/_search
GET %3Clogstash-%7Bnow%2Fd-2d%7D%3E%2C%3Clogstash-%7Bnow%2Fd-1d%7D%3E%2C%3Clogstash-%7Bnow%2Fd%7D%3E/_search
```

This date math expression is evaluated at runtime.
