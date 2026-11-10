---
layout: default
title: Advanced configurations
parent: Logstash
nav_order: 230
redirect_from:
 - /clients/logstash/advanced-config/
---

# Advanced configurations

Pipeline configurations can refer to the fields of each event. Use field references and string expansion to build values from event data, and use conditional statements to process events differently based on their contents. Filter plugins such as `date`, `useragent`, and `geoip` set event timestamps and add browser and location information to events.

## Referencing field values

To reference a field, enclose the field name in square brackets, for example, `[request]`. To reference a nested field, specify the path to the field, enclosing each level in square brackets.

For example, consider the following event:

```json
{
  "request": "/products/view/123",
  "verb": "GET",
  "response": 200,
  "http": {
    "method": "PUT"
  }
}
```

To reference the `request` field, use `[request]`. To reference the nested `method` field, use `[http][method]`.

To insert a field value into a string, use the `sprintf` format, also called _string expansion_: add a percent sign (`%`) and enclose the field reference in curly braces, for example, `%{[request]}`.

The `type` option is commonly used to apply filter plugins conditionally based on the type of event being processed. For example, the following pipeline adds a field named `type` with a value of `access` to each event. The `file` output uses string expansion to name the output file after the value of the `type` field:

```ruby
input {
  http {
    host => "127.0.0.1"
    port => 8080
    type => "access"
  }
}

output {
  stdout {
    codec => rubydebug
  }
  file {
    path => "%{[type]}.log"
  }
}
```
{% include copy.html %}

Start Logstash and send an HTTP request to port 8080. Logstash prints the event, which contains the `type` field, to the terminal and writes it to the `access.log` file in the Logstash directory.

## Conditional statements

Use conditional statements to apply filter or output plugins only to events that meet a condition. A conditional statement has the following syntax:

```ruby
if <expression> {
  ...
} else if <expression> {
  ...
} else {
  ...
}
```

Each `<expression>` must evaluate to a Boolean value. For example, the following statement writes events to different files depending on the value of the `type` field:

```ruby
output {
  if [type] == "access" {
    file { path => "access.log" }
  } else if [type] == "error" {
    file { path => "error.log" }
  } else {
    stdout { }
  }
}
```
{% include copy.html %}

To compare a field value to a number, use a comparison operator. If an event doesn't contain the field, the comparison fails and Logstash drops the event. To keep these events, first check that the field exists:

```ruby
if [amount] and [amount] >= 1000 {
  ...
}
```

To check whether a field value matches a regular expression, use the `=~` operator:

```ruby
if [some_field] =~ /^[0-9]+$/ {
  # some_field contains only digits
}
```

To check whether a field value is in an array, use the `in` operator:

```ruby
if [some_field] in ["one", "two", "three"] {
  # some_field is "one", "two", or "three"
}
```

To combine conditions, use the `and`, `or`, and `not` Boolean operators:

```ruby
if [type] == "access" or [type] == "error" {
  ...
}
```

## Formatting dates

To insert the event date into a string, use string expansion with a plus sign followed by a date format, for example, `%{+yyyy-MM-dd}`. Logstash formats the date stored in the event's `@timestamp` field.

For example, the following `file` output includes the event date in the file name:

```ruby
file {
  path => "%{[type]}_%{+yyyy_MM_dd}.log"
}
```
{% include copy.html %}

Use the same pattern in other outputs, for example, in the name of an OpenSearch index.

## Setting the event timestamp

When an input plugin receives an event, Logstash sets the event's `@timestamp` field to the current time. In some cases, you need a different timestamp. For example, if you process the previous day's orders at midnight, you might want each event's timestamp to be the time at which the order was placed, not the time at which Logstash received the event.

To set the event timestamp from a field in the event, use the `date` filter. The `match` setting specifies the source field and the date format of its value. In the following example, the date is stored in the `timestamp` field, and `Z` in the format represents the time zone offset:

```ruby
filter {
  date {
    match => [ "timestamp", "dd/MMM/yyyy:HH:mm:ss Z" ]
  }
}
```
{% include copy.html %}

For example, if an event's `timestamp` field contains `20/Sep/2017:13:22:22 +0200`, the filter sets `@timestamp` to `2017-09-20T11:22:22.000Z`. If you also use the `file` output from the preceding section, Logstash writes this event to the `access_2017_09_20.log` file.

If the filter can't parse the date, it adds the `_dateparsefailure` tag to the event.

After the filter sets the `@timestamp` field, you might not need the original `timestamp` field. To remove it, add the `remove_field` option:

```ruby
filter {
  date {
    match => [ "timestamp", "dd/MMM/yyyy:HH:mm:ss Z" ]
    remove_field => [ "timestamp" ]
  }
}
```
{% include copy.html %}

The `remove_field` option takes effect only if the filter parses the date successfully.

## Parsing user agents

A user agent string identifies the browser, browser version, operating system, and device that sent a request. Because the format of user agent strings varies widely, `grok` patterns can't reliably extract this information.

Use the `useragent` filter to parse a user agent string into separate fields. The `source` setting specifies the field containing the user agent string. By default, the filter adds the parsed fields to the `user_agent` field. To store the fields in a different field, specify the field name in the `target` setting:

```ruby
filter {
  useragent {
    source => "agent"
    target => "ua"
  }
}
```
{% include copy.html %}

For example, if the `agent` field contains `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36`, the filter adds the following `ua` object to the event:

```
"ua" => {
         "os" => {
           "name" => "Windows",
        "version" => "10",
           "full" => "Windows 10"
    },
       "name" => "Chrome",
     "device" => {
        "name" => "Other"
    },
    "version" => "120.0"
}
```

You can send these fields to OpenSearch and then aggregate them. For example, in OpenSearch Dashboards, create a pie chart that shows the proportion of visitors using each browser or operating system, or a bar chart of the most common browser versions.

## Enriching geographic data

Use the `geoip` filter to look up the geographic location of an IP address. The filter uses the GeoLite2 database from MaxMind.

The `source` setting specifies the field containing the IP address, and the `target` setting specifies the field in which to store the location information. To extract an IP address from a log line into a field, use a `grok` pattern such as `%{IP:clientip}`. For more information, see [grok]({{site.url}}{{site.baseurl}}/tools/logstash/common-filters/#grok). The `target` setting is required unless the `source` field is an `ip` subfield, such as `[client][ip]`:

```ruby
filter {
  geoip {
    source => "clientip"
    target => "client"
  }
}
```
{% include copy.html %}

The filter adds a `geo` object containing the location information, such as the country, continent, time zone, and coordinates, to the `target` field:

```
"client" => {
    "geo" => {
          "continent_code" => "NA",
            "country_name" => "United States",
        "country_iso_code" => "US",
                "timezone" => "America/Chicago",
                "location" => {
            "lon" => -97.822,
            "lat" => 37.751
        }
    },
     "ip" => "8.8.8.8"
}
```

To add only some of the location fields, list them in the `fields` setting, for example, `fields => ["country_name"]`.

Not all fields, such as the city name and region, are available for every IP address. If the filter can't find the location of an IP address, for example, because the address is private, it adds the `_geoip_lookup_failure` tag to the event.

The `location` object contains `lat` and `lon` fields, which is one of the formats that the OpenSearch `geo_point` field type accepts. To run geospatial queries on the location, map the `location` field as `geo_point` in your index. For more information, see [Geopoint field type]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/geo-point/).
