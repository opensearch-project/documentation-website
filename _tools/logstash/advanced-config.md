---
layout: default
title: Advanced configurations
parent: Logstash
nav_order: 230
redirect_from:
 - /clients/logstash/advanced-config/
---

# Advanced configurations

This section describes how to set up advanced configuration options, like referencing field values and conditional statements, for Logstash.

## Referencing field values

To get access to a field, use the `- field` syntax.
You can also surround the field name by square brackets `- [field]` which makes it more explicit that you're referring to a field.


For example, if you have the following event:

```bash
{
  "request": "/products/view/123",
  "verb": "GET",
  "response": 200,
  "headers": {
  "request_path" => "/"
  }
}
```

To access the `request` field, use `- request` or `- [request]`.

If you want to reference nested fields, use the square brackets syntax and specify the path to the field. With each level being enclosed within square brackets: `- [headers][request_path]`.

You can reference fields using the `sprintf` format. This is also called string expansion. You need to add a % sign and then wrap the field reference within curly brackets.

You need to reference field values when using conditional statements.

For example, you can make the file name dynamic and contain the type of the processed events - either `access` or `error`. The `type` option is mainly used for conditionally applying filter plugins based on the type of events being processed.

Let's add a `type` option and specify a value of `access`.


```yml
input {
  file {
    path => ""
  start_position => "beginning"
  type => "access"
  }
  http {
    type => "access"
  }
}

filter {
  mutate {
    remove_field => {"host"}
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

Start Logstash and send an HTTP request. The processed event is output in the terminal. The event now includes a field named `type`.

You'll see the `access.log` file created within the Logstash directory.

## Conditional statements

You can use conditional statements to control the flow of code execution based on some conditions.

Syntax:

```yml
if EXPR {
  ...
} else if EXPR {
  ...
} else {
  ...
}
```

`EXPR` is any valid Logstash syntax that evaluates to a Boolean value.
For example, you can check if an event type is set to `access` or `error` and perform some action based on that:

```yml
if [type] == "access" {
...
} else if [type] == "error" {
file { .. }
} else {
...
}
```

You can compare a field value to some arbitrary value:

```yml
if [headers][content_length] >= 1000 {
...
}
```

You can regex:

```yml
if [some_field =~ /[0-9]+/ {
  //some field only contains digits
}
```

You can use arrays:

```yml
if [some_field] in ["one", "two", "three"] {
  some field is either "one", "two", or "three"
}
```

You can use Boolean operators:

```yml
if [type] == "access" or [type] == "error" {
  ...
}
```


## Formatting dates

You can use the `sprintf` format or string expansion to format dates.
For example, you might want the current date to be part of the filename.

To format the date, add a plus sign in curly brackets followed by the date format - `%{+yyyy-MM-dd}`.

```yml
file {
  path => "%{[type]}_%{+yyyy_MM_dd}.log"
}
```

This is the date stored within the @timestamp fields, which is the time and date of the event.
Send a request to the pipeline and verify that a filename is outputted that contains the events date.

You can embed the date in other outputs as well, for example into the index name in OpenSearch.

## Sending time information

You can set the time of events.

Logstash already sets the time when the event is received by the input plugin within the @timestamp field.
In some scenarios, you might need to use a different timestamp.
For example, if you have an eCommerce store and you process the orders daily at midnight. When Logstash receives the events at midnight, it sets the timestamp to the current time.
But you want it to be the time when the order is placed and not when Logstash received the event.

Let's change the event timestamp to the date the request is received by the web server. You can do this using a filter plugin named `dates`.
The `dates` filter passes a `date` or `datetime` value from a field and uses the results as the event timestamp.

Add the `date` plugin at the bottom of the `filter` block:

```yml
date {
  match => [ "timestamp", "dd/MMM/yyyy:HH:mm:ss Z" ]
}
```

timestamp is the field that the `grok` pattern creates.
`Z` is the timezone. i.e., UTC offsets.

Start Logstash and send an HTTP request.

You can see that the filename contains the date of the request instead of the present date.

If the passing of the date fails, the `filter` plugin adds a tag named `_datepassfailure` to the text field.

After you have set the @timestamp field to a new value, you don't really need the other `timestamp` field anymore. You can remove it with the `remove_field` option.

```yml
date {
  match => [ "timestamp", "dd/MMM/yyyy:HH:mm:ss Z" ]
  remove_field => [ "timestamp" ]
}
```

## Parsing user agents

The user agent is the last part of a log entry that consists of the name of the browser, the browser version, and the OS of the device.

Users might be using a wide range of browsers, devices, and OS's. Doing this manually is hard.

You can't use `grok` patterns because the `grok` pattern only matches the usage in the string as whole and doesn't figure out which browser the visitor used, for instance.

Logstash ships with a file containing regular expressions for this purpose. This makes it really easy to extract user agent information, which you could send to OpenSearch and run aggregations on.

To do this, add a `source` option that contains the name of the field. In this case, that's the `agent` field.
By default the user agent plugin, adds a number of fields at the top-level of the event.
Since that can get pretty confusing, we can add an option named `target` with a value of `ua`, short for user agent. What this does is that it nests the fields within an object named `ua`, making things more organized.

```yml
useragent {
  source => "agent"
  target => "ua"
}
```

Start Logstash and send an HTTP request.

You can see a field named `ua` with a number of keys including the browser name and version, the OS, and the device.

You can use OpenSearch Dashboards to create a pie chart that shows how many visitors are using mobile devices and how many are desktop users. Or, you could get statistics on which browser versions are popular.

## Enriching geographical data

You can take an IP address and perform geographical lookup to resolve the geographical location of the user using the `geoip` filter.

The `geoip` filter plugin ships with a database called `geolite 2`, which is provided by a company named MaxMind. `geolite 2` is a popular source of geographical data and it's available for free.
Add the `geoip` plugin at the bottom of the `else` block.

The value of the `source` option is the name of the field containing the IP address, in this case that's `clientip`. You can make this field available using the `grok` pattern.

```yml
geoip {
  source => "clientip"
}
```

Start Logstash and send an HTTP request.

Within the terminal, you see a new field named `geoip` that contains information such as the time zone, country, continent, city, postal code, and the latitude/longitude pair.

If you only need the country name for instance, include an option named `fields` with an array of the field names that you want the `geoip` plugin to return.

Some of the fields, such as city name and region, are not always available because translating IP addresses into geographical locations is generally not that accurate. If the `geoip` plugin fails to look up the geographical location, it adds a tag named `geoip_lookup_failure`.

You can use the `geoip` plugin with the OpenSearch output because `location` object within the `geoip` object, is a standard format for representing geospatial data in JSON. This is the same format as OpenSearch uses for its `geo_point` data type.

You can use the powerful geospatial queries of OpenSearch for working with geographical data.
