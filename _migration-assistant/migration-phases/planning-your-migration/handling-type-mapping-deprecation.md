---
layout: default
title: Handling type mapping deprecation
nav_order: 60
parent: Planning your migration
grand_parent: Migration phases
redirect_from:
  - /migration-assistant/migration-phases/handling-type-mapping-deprecation/
---

# Handling type mapping deprecation

During a migration from Elasticsearch versions 6.x and before, you may have used the type mapping feature. This page provides a cookbook of different scenarios and templates that can be used to handle these deprecations when migrating to OpenSearch.

## Understanding type mapping deprecation

Elasticsearch indexes created prior to 6.x could contain multiple types per index. This feature has been deprecated and removed in newer versions of Elasticsearch and OpenSearch. Because of this, during migrations, you may need to specify the behavior to occur when migrating items that used type mappings. For more details, refer to [Elasticsearch's official documentation on the removal of mapping types](https://www.elastic.co/guide/en/elasticsearch/reference/7.10/removal-of-types.html).

## Handling type mapping deprecation

To handle type mapping deprecation, you can leverage the built in TypeMappingsSanitizationTransformer. This transformer can be used to transform the data (metadata, documents, requests) and update the behavior accordingly.

### Using the TypeMappingsSanitizationTransformer

1. Navigate to the bootstrap box and open the `cdk.context.json` with vim.
2. Add/Update the key `reindexFromSnapshotExtraArgs` to include `--doc-transformer-config-file /shared-logs-output/transformation.json`.
3. Add/Update the key `trafficReplayerExtraArgs` to include `--transformer-config-file /shared-logs-output/transformation.json`.
4. Deploy/redeploy the Migration Assistant.
5. Navigate to the Migration Assistant console.
6. Create a file with `vim /shared-logs-output/transformation.json`.
7. Add your transformation configuration to the file (see examples following).
8. When running metadata migration, run with the additional parameter `console metadata migrate --transformer-config-file /shared-logs-output/transformation.json`.
9. If the transformation configuration is updated, backfill/replayer will need to be stopped and restarted to apply the changes. Any already migrated data and metadata may need to be cleared to avoid an inconsistent state.

### Configuration options

The TypeMappingsSanitizationTransformer supports several strategies for handling type mappings:

1. **Route to Separate indexes**: Split different types into their own indexes
2. **Merge Types**: Combine multiple types into a single index
3. **Drop Types**: Selectively migrate only specific types
4. **Keep Original Structure**: Maintain the same index name while conforming to new type standards

### Example configurations

Here are some common scenarios and their corresponding configurations:

#### 1. Route different types to separate indexes

If you have an index `activity` with types `user` and `post` that you want to split into separate indexes:

```JSON
[
  {
    "TypeMappingsSanitizationTransformerProvider": {
      "staticMappings": {
        "activity": {
          "user": "new_users",
          "post": "new_posts"
        }
      },
      "sourceProperties": {
        "version": {
          "major": 6,
          "minor": 8
        }
      }
    }
  }
]
```

This will:
- Route documents with type `user` to the `new_users` index
- Route documents with type `post` to the `new_posts` index

#### 2. Merge all types into one index

To combine multiple types into a single index:

```JSON
[
  {
    "TypeMappingsSanitizationTransformerProvider": {
      "staticMappings": {
        "activity": {
          "user": "activity",
          "post": "activity"
        }
      },
      "sourceProperties": {
        "version": {
          "major": 6,
          "minor": 8
        }
      }
    }
  }
]
```

#### 3. Drop specific types

To migrate only specific types and drop others:

```JSON
[
  {
    "TypeMappingsSanitizationTransformerProvider": {
      "staticMappings": {
        "activity": {
          "user": "users_only",
        }
      },
      "sourceProperties": {
        "version": {
          "major": 6,
          "minor": 8
        }
      }
    }
  }
]
```
This configuration will only migrate documents of type `user` and ignore other types in the `activity` index.

### 4. Keep original structure

To migrate only specific types and keep the original structure:

```JSON
[
  {
    "TypeMappingsSanitizationTransformerProvider": {
      "regexMappings": [
        [
          "(.*)",
          ".*",
          "$1"
        ]
      ],
      "sourceProperties": {
        "version": {
          "major": 6,
          "minor": 8
        }
      }
    }
  }
]
```

This is equivalent to the merge all types into one index rule but using a pattern-based routing strategy.

### 5. Combining multiple strategies

You can combine both static and regex-based mappings to handle different indices or patterns in a single migration. For example, you might have one index that must use **staticMappings** and another that uses **regexMappings** to route all types by pattern.

When an index is included in staticMappings, no regexMappings will be applied. 

```json
[
  {
    "TypeMappingsSanitizationTransformerProvider": {
      "staticMappings": {
        "activity": {
          "user": "users_activity",
          "post": "posts_activity"
        },
        "logs": {
          "error": "logs_error",
          "info": "logs_info"
        }
      },
      "regexMappings": [
        [
          "orders.*",
          ".*",
          "all_orders"
        ]
      ],
      "sourceProperties": {
        "version": {
          "major": 6,
          "minor": 8
        }
      }
    }
  }
]
```

### Defaults

When `regexMappings` key is missing from the transformation config, `regexMappings` will default to the following:

```JSON
{
  "regexMappings": [
    ["(.+)", "_doc", "$1"],
    ["(.+)", "(.+)", "$1_$2"]
  ]
}
```

This has the effect of retaining the index name for es 6+ created indexes while combining the type and index name for es 5.x created indexes. If you wish to retain the index name for es 5.x created indexes, use the `staticMappings` option or override the type mappings using the `regexMappings` option similar to the `Keep original structure`

### Limitations

- For the replayer, **only a subset** of requests that include types is supported:

| **Operation**                | **HTTP Method(s)** | **Endpoint**           | **Description**                                                                                                                                                                                                                   |
|------------------------------|--------------------|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Index (by ID)**            | PUT / POST         | `/{index}/{type}/{id}` | Create or update a single document with an explicit ID.                                                                                                                                                                           |
| **Index (auto ID)**          | PUT / POST         | `/{index}/{type}/`     | Create a single document where the ID is auto-generated.                                                                                                                                                                          |
| **Get Document**             | GET                | `/{index}/{type}/{id}` | Retrieve a document by ID.                                                                                                                                                                                                        |
| **Bulk Index/Update/Delete** | PUT / POST         | `/_bulk`               | Perform multiple create/update/delete operations in a single request.                                                                                                                                                             |
| **Create/Update Index**      | PUT / POST         | `/{index}`             | Create or update an index. <br/><br/> **Split** behavior is not supported in the replayer. [See GitHub issue](https://github.com/opensearch-project/opensearch-migrations/issues/1305) to leave feedback or vote on this feature. |

- For Reindex-From-Snapshot, ES 6+ created indexes will use `_doc` as the type for all documents, even if a different type was specified on ES 6
