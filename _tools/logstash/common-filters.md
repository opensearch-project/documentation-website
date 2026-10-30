---
layout: default
title: Common filter plugins
parent: Logstash
nav_order: 220
redirect_from:
 - /clients/logstash/common-filters/
---

# Common filter plugins

Filter plugins modify events as they pass through the pipeline. Use the `mutate` filter to change field values and types and the `grok` filter to parse unstructured text into fields. All filter plugins also support a set of common options for adding and removing fields and tags.

<!-- vale off -->
## mutate
<!-- vale on -->

Use the `mutate` filter to rename, remove, replace, and modify fields. For example, if you send events to OpenSearch and a field's data type doesn't match the existing index mapping, use the `mutate` filter to convert the field to the mapped type.

The following pipeline converts the `quantity` field to an integer:

```ruby
input {
  http {
    host => "127.0.0.1"
    port => 8080
  }
}

filter {
  mutate {
    convert => { "quantity" => "integer" }
  }
}

output {
  stdout { }
}
```
{% include copy.html %}

To test the pipeline, start Logstash and send a request in which `quantity` is a string:

```bash
curl -XPUT -H "Content-Type: application/json" -d '{"amount": 10, "quantity": "3"}' http://localhost:8080
```
{% include copy.html %}

In the resulting event, `quantity` is an integer:

```
{
      "quantity" => 3,
        "amount" => 10,
    "@timestamp" => 2026-10-16T17:57:09.851542204Z,
      "@version" => "1",
    ...
}
```

You can also convert fields to the `float`, `string`, and `boolean` types. If the field contains an array, the filter converts each element of the array. If a value can't be converted, for example, if you convert the string `world` to an integer, the filter leaves the value unchanged, adds the `_mutate_error` tag to the event, and Logstash continues processing the event.

## Common options

All filter plugins support the following options.

Option | Description
:--- | :---
`add_field` | Adds one or more fields to the event.
`remove_field` | Removes one or more fields from the event.
`add_tag` | Adds one or more tags to the event. Use tags to process events conditionally based on the tags they contain.
`remove_tag` | Removes one or more tags from the event.

The following pipeline removes the `host` field from each event:

```ruby
input {
  http {
    host => "127.0.0.1"
    port => 8080
  }
}

filter {
  mutate {
    remove_field => ["host"]
  }
}

output {
  stdout { }
}
```
{% include copy.html %}

<!-- vale off -->
## grok
<!-- vale on -->

Use the `grok` filter to parse unstructured text into fields. The `grok` filter matches text using patterns, which are named regular expressions.

A `grok` pattern has the following format:

```
%{SYNTAX:SEMANTIC}
```

The pattern consists of the following elements:

- `SYNTAX`: The name of the pattern that the text must match. Use any of the predefined `grok` patterns. For example, the `EMAILADDRESS` pattern matches an email address.
- `SEMANTIC`: The name of the field in which to store the matched text. For example, if you match an email address, you can name the field `email`.

To convert the matched text to a number, add `:int` or `:float` after the field name, for example, `%{INT:http_status:int}`.

The following access log line contains the IP address of the client, the identity and user name of the client, the time of the request, the HTTP method and path, the HTTP status code, and the size of the response in bytes:

```bash
184.252.108.229 - joe [20/Sep/2017:13:22:22 +0200] GET /products/view/123 200 12798
```

The following `grok` filter parses this line into fields:

```ruby
filter {
  grok {
    match => { "message" => "%{IP:ip_address} %{USER:identity} %{USER:auth} \[%{HTTPDATE:reg_ts}\] %{WORD:http_verb} %{URIPATHPARAM:req_path} %{INT:http_status:int} %{INT:num_bytes:int}" }
  }
}
```
{% include copy.html %}

The pattern doesn't contain spaces inside the `%{...}` expressions. The spaces between expressions must match the spaces in the log line exactly.

The filter uses the following patterns.

Pattern | Matches
:--- | :---
`IP` | The client IP address.
`USER` | The identity of the client (`-` in this example) and the user name.
`HTTPDATE` | The time of the request.
`WORD` | The HTTP method.
`URIPATHPARAM` | The request path.
`INT` | The HTTP status code and the response size.

The filter adds the following fields to the event:

```
{
     "ip_address" => "184.252.108.229",
       "identity" => "-",
           "auth" => "joe",
         "reg_ts" => "20/Sep/2017:13:22:22 +0200",
      "http_verb" => "GET",
       "req_path" => "/products/view/123",
    "http_status" => 200,
      "num_bytes" => 12798,
    ...
}
```

If the text doesn't match the pattern, the filter adds the `_grokparsefailure` tag to the event.

Logstash includes predefined patterns for common log formats. For the list of patterns, see [Logstash patterns](https://github.com/logstash-plugins/logstash-patterns-core/tree/main/patterns/ecs-v1). To modify the parsed fields, use the `mutate` filter.
