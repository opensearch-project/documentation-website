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

During a migration from Elasticsearch versions 6.x and before, you may have used the type mapping feature. This page provides a cookbook of different scenarios and templates that can be used to handle these deprecations.

## Understanding type mapping deprecation

Elasticsearch indices created prior to 6.x could contain multiple types per index. This feature has been deprecated and removed in newer versions of Elasticsearch and OpenSearch. Because of this, during migrations, you may need to specify the behavior to occur when migrating items that used type mappings. For more details, refer to [Elasticsearch's official documentation on the removal of mapping types](https://www.elastic.co/guide/en/elasticsearch/reference/7.10/removal-of-types.html).

## Handling type mapping deprecation

To handle type mapping deprecation, you can leverage the built in TypeMappingsSanitizationTransformer. This transformer can be used to transform the data (metadata, documents, requests) and update the behavior accordingly.

### Using the TypeMappingsSanitizationTransformer

1. Navigate to the bootstrap box and open the `cdk.context.json` with vim.
2. Add/Update the key `reindexFromSnapshotExtraArgs` to include `--doc-transformer-config-file /shared-logs-output/transformation.json`. [^1]
3. Add/Update the key `trafficReplayerExtraArgs` to include `--transformer-config-file /shared-logs-output/transformation.json`. [^1]
4. Deploy/redeploy the Migration Assistant.
5. Navigate to the Migration Assistant console.
6. Create a file with `vim /shared-logs-output/transformation.json`. [^1]
7. Add your transformation configuration to the file (see examples below).
8. When running metadata migration, run with the additional parameter `console metadata migrate --transformer-config-file /shared-logs-output/transformation.json`.[^1]
9. If the transformation configuration is updated, backfill/replayer will need to be stopped and restarted to apply the changes.

[^1]: The `/shared-logs-output` mount will soon be relocated with a new mountpoint on the container for the EFS volume.

### Configuration Options

The TypeMappingsSanitizationTransformer supports several strategies for handling type mappings:

1. **Route to Separate Indices**: Split different types into their own indices
2. **Merge Types**: Combine multiple types into a single index
3. **Drop Types**: Selectively migrate only specific types
4. **Keep Original Structure**: Maintain the same index name while conforming to new type standards

### Example Configurations

Here are some common scenarios and their corresponding configurations:

#### 1. Route Different Types to Separate Indices

If you have an index `activity` with types `user` and `post` that you want to split into separate indices:

```json
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

#### 2. Merge All Types into One Index

To combine multiple types into a single index:

```json
[
  {
    "TypeMappingsSanitizationTransformerProvider": {
      "staticMappings": {
        "activity": {
          "user": "combined_activity",
          "post": "combined_activity"
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

#### 3. Drop Specific Types

To migrate only specific types and drop others:

```json
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

```json
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

### Defaults

When no regex mappings are specified, the transformer will default to the following behavior:

```json
{
  "regexMappings": [
    ["(.+)", "_doc", "$1"],
    ["(.+)", "(.+)", "$1_$2"]
  ],
}
```

This has the effect of retaining the index name for es 6+ created indices while comibining the type and index name for es 5.x created indices. If you wish to retain the index name for es 5.x created indices, please use the `staticMappings` option or override the type mappings using the `regexMappings` option similar to the `Keep original structure`

### Limitations

- The transformer cannot be used prior to Elasticsearch 6.x.
- Within the replayer, the transformer only supports a subset of requests that may be replayed with types, in particular:
  - PUT/POST /{index}/{type}/{id} 
  - PUT/POST /{index}/{type}/
  - GET /{index}/{type}/{id}
  - PUT/POST /_bulk
  - PUT/POST /{index}
- Within the replayer, create index split is not supported.
  - Note: This is only impactful on ES 5.x since multi type index creation is not supported on ES 6.x.

### Important Notes

- After ES 6, documents either have no type or are forced to use the type `_doc`
- When migrating from ES 6, some type context might not be available (e.g., during RFS operations)
- The transformer can handle both explicit type mappings and pattern-based routing
- Changes to the transformation configuration require restarting backfill/replayer operations