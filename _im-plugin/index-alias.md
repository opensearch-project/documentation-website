---
layout: default
title: Index aliases
nav_order: 5
redirect_from:
  - /opensearch/index-alias/
---

# Index aliases

An alias is a virtual index name that can point to one or more indexes. Aliases provide a flexible way to manage your data without changing your application code.

## What are aliases?

If your data is spread across multiple indexes, rather than keeping track of which indexes to query, you can create an alias and query it instead. For example, if you're storing logs into indexes based on the month and you frequently query the logs for the previous two months, you can create a `last_2_months` alias and update the indexes it points to each month.

Because you can change the indexes an alias points to at any time, referring to indexes using aliases in your applications allows you to reindex your data without any downtime.

## Key benefits

- **Zero downtime**: Switch indexes behind an alias without interrupting applications
- **Simplified querying**: Use a single name to query multiple related indexes
- **Flexible data organization**: Group indexes logically without restructuring data
- **Easy maintenance**: Update which indexes are active without code changes

## Basic alias operations

### Create a simple alias

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

### Switch an alias to a different index

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

### Point an alias to multiple indexes

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

### Create an alias during index creation

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

## Advanced features

### Filtered aliases

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

### Write indexes for multi-index aliases

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

## Common use cases

- **Log rotation**: Maintain a consistent query endpoint while rotating daily/monthly log indexes
- **A/B testing**: Switch between different data sets for testing
- **Environment management**: Use aliases like `production-data` and `staging-data`
- **Data migration**: Gradually move from old to new index structures

## Quick reference

| Task | Command |
|------|---------|
| List all aliases | `GET /_cat/aliases?v` |
| Get specific alias | `GET /_alias/my-alias` |
| Check if alias exists | `HEAD /_alias/my-alias` |
| Query through alias | `GET /my-alias/_search` |

## API reference

For complete documentation of all alias operations, parameters, and advanced configurations, see the [Alias APIs]({{site.url}}{{site.baseurl}}/api-reference/alias/) reference section.
