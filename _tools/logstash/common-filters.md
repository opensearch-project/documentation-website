---
layout: default
title: Common filter plugins
parent: Logstash
nav_order: 220
redirect_from:
 - /clients/logstash/common-filters/
---

# Common filter plugins

This page contains a list of common filter plugins.

## mutate

You can use the `mutate` filter to change the data type of a field. For example, you can use the `mutate` filter if you're sending events to OpenSearch and you need to change the data type of a field to match any existing mappings.

To convert the `quantity` field from a `string` type to an `integer` type:

```yml
input {
  http {
    host => "127.0.0.1"
    port => 8080
  }
}

filter {
  mutate {
   convert => {"quantity" => "integer"}
  }
}

output {
  file {
    path => "output.txt"
  }
}
```

#### Sample output

You can see that the type of the `quantity` field is changed from a `string` to an `integer`.

```yml
{
  "quantity" => 3,
  "host" => "127.0.0.1",
  "@timestamp" => 2021-05-23T19:02:08.026Z,
  "amount" => 10,
  "@version" => "1",
  "headers" => {
    "request_path" => "/",
    "connection" => "keep-alive",
    "content_length" => "41",
    "http_user_agent" => "PostmanRuntime/7.26.8",
    "request_method" => "PUT",
    "cache_control" => "no-cache",
    "http_accept" => "*/*",
    "content_type" => "application/json",
    "http_version" => "HTTP/1.1",
    "http_host" => "127.0.0.1:8080",
    "accept_encoding" => "gzip, deflate, br",
    "postman_token" => "ffd1cdcb-7a1d-4d63-90f8-0f2773069205"
   }
}
```

Other data types you can convert to are `float`, `string`, and `boolean` values. If you pass in an array, the `mutate` filter converts all the elements in the array. If you pass a `string` like "world" to cast to an `integer` type, the result is 0 and Logstash continues processing events.

Logstash supports a few common options for all filter plugins:

Option | Description
:--- | :---
`add_field` | Adds one or more fields to the event.
`remove_field` | Removes one or more events from the field.
`add_tag` | Adds one or more tags to the event. You can use tags to perform conditional processing on events depending on which tags they contain.
`remove_tag` | Removes one or more tags from the event.

For example, you can remove the `host` field from the event:

```yml
input {
  http {
    host => "127.0.0.1"
    port => 8080
  }
}

filter {
  mutate {
    remove_field => {"host"}
  }
}

output {
  file {
    path => "output.txt"
  }
}
```

## grok

With the `grok` filter, you can parse unstructured data and and structure it into fields. The `grok` filter uses text patterns to match text in your logs. You can think of text patterns as variables containing regular expressions.

The format of a text pattern is as follows:

```bash
%{SYNTAX:SEMANTIC}
```

`SYNTAX` is the format a piece of text should be in for the pattern to match. You can enter any of `grok`'s predefined patterns. For example, you can use the email identifier to match an email address from a given piece of text.

`SEMANTIC` is an arbitrary name for the matched text. For example, if you're using the email identifier syntax, you can name it “email.”

The following request consists of the IP address of the visitor, name of the visitor, the timestamp of the request, the HTTP verb and URL, the HTTP status code, and the number of bytes:

```bash
184.252.108.229 - joe [20/Sep/2017:13:22:22 +0200] GET /products/view/123 200 12798
```

To split this request into different fields:

```yml
filter {
  grok {
   match => { "message" => " %{IP: ip_address} %{USER:identity}
                             %{USER:auth} \[%{HTTPDATE:reg_ts}\]
                             \"%{WORD:http_verb}
                             %{URIPATHPARAM: req_path}
                             \" %{INT:http_status:int}
                             %{INT:num_bytes:int}"}
  }
}
```

where:

- `IP`: matches the IP address field.
- `USER`: matches the user name.
- `WORD`: matches the HTTP verb.
- `URIPATHPARAM`: matches the URI path.
- `INT`: matches the HTTP status field.
- `INT`: matches the number of bytes.

This is what the event looks like after the `grok` filter breaks it down into individual fields:

```yml
ip_address: 184.252.108.229
identity: joe
reg_ts: 20/Sep/2017:13:22:22 +0200
http_verb:GET
req_path: /products/view/123
http_status: 200
num_bytes: 12798
```

For common log formats, you use the predefined patterns defined here⁠---[Logstash patterns](https://github.com/logstash-plugins/logstash-patterns-core/blob/main/patterns/ecs-v1). You can make any adjustments to the results with the `mutate` filter.
