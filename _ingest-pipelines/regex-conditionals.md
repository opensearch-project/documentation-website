---
layout: default
title: Regex conditionals
parent: Conditional execution
nav_order: 70
---

# Regex conditionals

Ingest pipelines support conditional logic using regular expressions (regex) with the Painless scripting language. This allows fine-grained control over which documents get processed based on the structure and contents of text fields. Regex can be used within the `if` parameter to evaluate string patterns. This is especially useful for matching IP formats, validating email addresses, identifying UUIDs, or processing logs with specific keywords.

## Example: Email domain filtering

The following pipeline uses regex to identify users from the `@example.com` email domain and tag those documents accordingly:

```json
PUT _ingest/pipeline/tag_example_com_users
{
  "processors": [
    {
      "set": {
        "field": "user_domain",
        "value": "example.com",
        "if": "ctx.email != null && ctx.email =~ /@example.com$/"
      }
    }
  ]
}
```
{% include copy-curl.html %}

Use the following request to simulate the pipeline:

```json
POST _ingest/pipeline/tag_example_com_users/_simulate
{
  "docs": [
    { "_source": { "email": "alice@example.com" } },
    { "_source": { "email": "bob@another.com" } }
  ]
}
```
{% include copy-curl.html %}

Only the first document has `user_domain` added:

```json
{
  "docs": [
    {
      "doc": {
        "_source": {
          "email": "alice@example.com",
          "user_domain": "example.com"
        }
      }
    },
    {
      "doc": {
        "_source": {
          "email": "bob@another.com"
        }
      }
    }
  ]
}
```

## Example: Detect IPv6 addresses

The following pipeline uses regex to identify and flag IPv6-formatted addresses:

```json
PUT _ingest/pipeline/ipv6_flagger
{
  "processors": [
    {
      "set": {
        "field": "ip_type",
        "value": "IPv6",
        "if": "ctx.ip != null && ctx.ip =~ /^[a-fA-F0-9:]+$/ && ctx.ip.contains(':')"
      }
    }
  ]
}
```
{% include copy-curl.html %}

Use the following request to simulate the pipeline:

```json
POST _ingest/pipeline/ipv6_flagger/_simulate
{
  "docs": [
    { "_source": { "ip": "2001:0db8:85a3:0000:0000:8a2e:0370:7334" } },
    { "_source": { "ip": "192.168.0.1" } }
  ]
}
```
{% include copy-curl.html %}

The first document contains an added `ip_type` field set to `IPv6`:

```json
{
  "docs": [
    {
      "doc": {
        "_source": {
          "ip": "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
          "ip_type": "IPv6"
        }
      }
    },
    {
      "doc": {
        "_source": {
          "ip": "192.168.0.1"
        }
      }
    }
  ]
}
```

## Example: Validate UUID strings

The following pipeline uses regex to verify whether a `session_id` field contains a valid UUID:

```json
PUT _ingest/pipeline/uuid_checker
{
  "processors": [
    {
      "set": {
        "field": "valid_uuid",
        "value": true,
        "if": "ctx.session_id != null && ctx.session_id =~ /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/"
      }
    }
  ]
}
```
{% include copy-curl.html %}

Use the following request to simulate the pipeline:

```json
POST _ingest/pipeline/uuid_checker/_simulate
{
  "docs": [
    { "_source": { "session_id": "550e8400-e29b-41d4-a716-446655440000" } },
    { "_source": { "session_id": "invalid-uuid-1234" } }
  ]
}
```
{% include copy-curl.html %}

The first document is tagged with a new `valid_uuid` field:

```json
{
  "docs": [
    {
      "doc": {
        "_source": {
          "session_id": "550e8400-e29b-41d4-a716-446655440000",
          "valid_uuid": true
        }
      }
    },
    {
      "doc": {
        "_source": {
          "session_id": "invalid-uuid-1234"
        }
      }
    }
  ]
}
```