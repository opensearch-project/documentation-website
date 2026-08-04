---
layout: default
title: Index aliases
nav_order: 5
redirect_from:
  - /opensearch/index-alias/
canonical_url: https://docs.opensearch.org/latest/im-plugin/index-alias/
---

# Index aliases

If your data is spread across multiple indexes, rather than keeping track of which indexes to query, you can create an _alias_ and query it instead. An alias is a virtual index name that can point to one or more indexes. Aliases provide a flexible way to manage your data without changing your application code.

Index aliases are useful in several scenarios. You can use them to maintain a consistent query endpoint while rotating daily or monthly log indexes, switch between different data sets for A/B testing, and manage environments with aliases such as `production-data` and `staging-data`. For example, if you're storing logs into indexes based on the month and you frequently query the logs for the previous two months, you can create a `last_2_months` alias and update the indexes it points to each month. Aliases also help during data migrations, allowing you to transition gradually from old to new index structures without interrupting queries. 

Because you can change the indexes an alias points to at any time, referring to indexes using aliases in your applications allows you to reindex your data without any downtime.

Aliases provide several key benefits:

- Switch between indexes without interrupting client applications, enabling zero-downtime operations.
- Group related indexes under a single logical name for flexible data organization.
- Use routing and filtering to optimize query performance.
- Applications can reference stable alias names instead of changing index names, simplifying application logic.

When working with aliases, keep in mind these important behaviors:

- All alias changes happen atomically—there's never a moment when an alias points to an unintended set of indexes.
- When using wildcard patterns, aliases capture indexes that match at creation time and don't automatically include new indexes created later.
- Writing to an alias that points to multiple indexes requires designating a write index.
- Filtered aliases automatically apply their filters to all search, count, and delete by query operations.

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
