---
layout: default
title: Delete
parent: SQL
nav_order: 12
---


# Delete

The `DELETE` statement deletes documents that satisfy the predicates in the `WHERE` clause.
If you don't specify the `WHERE` clause, all documents are deleted.

### Syntax

Rule `singleDeleteStatement`:

![singleDeleteStatement](../../images/singleDeleteStatement.png)

### Example

SQL query:

```sql
DELETE FROM accounts
WHERE age > 30
```

Explain:

```json
{
  "size" : 1000,
  "query" : {
    "bool" : {
      "must" : [
        {
          "range" : {
            "age" : {
              "from" : 30,
              "to" : null,
              "include_lower" : false,
              "include_upper" : true,
              "boost" : 1.0
            }
          }
        }
      ],
      "adjust_pure_negative" : true,
      "boost" : 1.0
    }
  },
  "_source" : false
}
```

Result set:

```json
{
  "schema" : [
    {
      "name" : "deleted_rows",
      "type" : "long"
    }
  ],
  "total" : 1,
  "datarows" : [
    [
      3
    ]
  ],
  "size" : 1,
  "status" : 200
}
```

The `datarows` field shows the number of documents deleted.
