---
layout: default
title: Aliases API
parent: Index aliases
nav_order: 20
---


# Using the Aliases API

This page presents the following examples of how to use the Aliases API to create and manage aliases:

- [Creating a simple alias](#creating-a-simple-alias)
- [Switching an alias to a different index](#switching-an-alias-to-a-different-index)
- [Pointing an alias to multiple indexes](#pointing-an-alias-to-multiple-indexes)
- [Creating an alias during index creation](#creating-a-simple-alias)
- [Filtered aliases](#filtered-aliases)
- [Write indexes for multi-index aliases](#write-indexes-for-multi-index-aliases)

For a complete description of every Alias API, see [Alias APIs]({{site.url}}{{site.baseurl}}/api-reference/alias/index/).


## Creating a simple alias

The most basic way to create an alias is to point it to a single index:

```json
POST /_aliases
{
  "actions": [
    {
      "add": {
        "index": "logs-2024-01",
        "alias": "current-logs"
      }
    }
  ]
}
```
{% include copy-curl.html %}


## Switching an alias to a different index

You can atomically switch an alias from one index to another:

```json
POST /_aliases
{
  "actions": [
    {
      "remove": {
        "index": "logs-2024-01",
        "alias": "current-logs"
      }
    },
    {
      "add": {
        "index": "logs-2024-02",
        "alias": "current-logs"
      }
    }
  ]
}
```
{% include copy-curl.html %}


## Pointing an alias to multiple indexes

An alias can point to multiple indexes for broader queries:

```json
POST /_aliases
{
  "actions": [
    {
      "add": {
        "indices": ["logs-2024-01", "logs-2024-02"],
        "alias": "recent-logs"
      }
    }
  ]
}
```
{% include copy-curl.html %}


## Creating an alias during index creation

You can add an alias when creating an index:

```json
PUT /logs-2024-03
{
  "aliases": {
    "current-logs": {},
    "all-logs": {}
  }
}
```
{% include copy-curl.html %}


## Filtered aliases

Create different "views" of the same data using filters:

```json
POST /_aliases
{
  "actions": [
    {
      "add": {
        "index": "application-logs",
        "alias": "error-logs",
        "filter": {
          "term": {
            "level": "ERROR"
          }
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}


## Write indexes for multi-index aliases

When an alias points to multiple indexes, designate one as the write index:

```json
POST /_aliases
{
  "actions": [
    {
      "add": {
        "index": "logs-2024-02",
        "alias": "active-logs",
        "is_write_index": true
      }
    },
    {
      "add": {
        "index": "logs-2024-01",
        "alias": "active-logs"
      }
    }
  ]
}
```
{% include copy-curl.html %}


## API reference

The following table provides commonly used alias commands.

| Task | Command |
|------|---------|
| List all aliases | `GET /_cat/aliases?v` |
| Get specific alias | `GET /_alias/my-alias` |
| Check if alias exists | `HEAD /_alias/my-alias` |
| Query through alias | `GET /my-alias/_search` |

For complete documentation of all alias operations, parameters, and advanced configurations, see the [Alias APIs]({{site.url}}{{site.baseurl}}/api-reference/alias/) reference section.
