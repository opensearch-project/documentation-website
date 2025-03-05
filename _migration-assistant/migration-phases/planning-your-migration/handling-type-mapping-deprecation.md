---
layout: default
title: Managing type mapping deprecation
nav_order: 60
parent: Planning your migration
grand_parent: Migration phases
---

# Managing the type mapping deprecation

This guide provides solutions for handling the deprecation of the type mapping functionality when migrating from Elasticsearch 6.x and earlier versions to OpenSearch.

## Understanding type mapping deprecation

Elasticsearch indexes created before version 6.x could contain multiple types per index. This feature has been deprecated and removed in newer versions of Elasticsearch and OpenSearch. During migrations, you may need to specify how to handle items that used type mappings. For more information, see [Elasticsearch's official documentation on the removal of mapping types](https://www.elastic.co/guide/en/elasticsearch/reference/7.10/removal-of-types.html).

## Using the type mapping transformer

To address type mapping deprecation, use the `TypeMappingsSanitizationTransformer`. This transformer can modify data, including metadata, documents, and requests so that the previously mapped data can be used in OpenSearch. To being using the mapping transformer:

1. Navigate to the bootstrap box and open the `cdk.context.json` with vim.
2. Add or update the key `reindexFromSnapshotExtraArgs` to include `--doc-transformer-config-file /shared-logs-output/transformation.json`.
3. Add or update the key `trafficReplayerExtraArgs` to include `--transformer-config-file /shared-logs-output/transformation.json`.
4. Deploy the migration assistant.
5. Navigate to the Migration Assistant console.
6. Create a file called `/shared-logs-output/transformation.json`.
7. Add your transformation configuration to the file. For configuration options, see [Configuration options](#configuration-options).
8. When running the metadata migration, run the configuration with the transformer using the command, `console metadata migrate --transformer-config-file /shared-logs-output/transformation.json`.

  
Anytime the transformation configuration is updated, the backfill and replayer tools will need to be stopped and restarted to apply the changes. Any already migrated data and metadata may need to be cleared to avoid an inconsistent state.

### Configuration options

The `TypeMappingsSanitizationTransformer` supports several strategies for handling type mappings:

1. **Route to Separate indexes**: Split different types into their own indexes
2. **Merge Types**: Combine multiple types into a single index
3. **Drop Types**: Selectively migrate only specific types
4. **Keep Original Structure**: Maintain the same index name while conforming to new type standards

### Type mapping transformer configuration schema

The type mapping transformer uses the following configuration options:

| **Field**  | **Type** | **Required** | **Description** | 
| :--- | :--- | :--- | :--- |
| `staticMappings`   | `object` | No   | A map of `{ indexName: { typeName: targetIndex } }` to **statically** route specific types. <br/><br/> For any **index** listed on this page, types **not** included in its object are **dropped** (no data or requests migrated for those omitted types).   |
| `regexMappings`    | `array`  | No   | A list of **regex-based** rules for **dynamic** routing of source index/type names to a target index. <br/><br/> Each element in this array is itself an object with `sourceIndexPattern`, `sourceTypePattern`, and `targetIndexPattern` fields. <br/><br/> For more information about the **Default value**, see [Defaults](#Defaults). |
| `sourceProperties` | `object` | Yes  | Additional **metadata** about the source (for example, its Elasticsearch/OpenSearch version). Must include at least `"version"` with `"major"` and `"minor"` fields.   |

The following example JSON configuration provides a transformation schema:

<details>
<summary>Example JSON Configuration</summary>

```JSON
{
  "TypeMappingSanitizationTransformerProvider": {
    "staticMappings": {
      "{index-name-1}": {
        "{type-name-1}": "{target-index-name-1}",
        "{type-name-2}": "{target-index-name-2}"
      }
    },
    "regexMappings": [
      {
        "sourceIndexPattern": "{source-index-pattern}",
        "sourceTypePattern": "{source-type-pattern}",
        "targetIndexPattern": "{target-index-pattern}"
      }
    ],
    "sourceProperties": {
      "version": {
        "major": "NUMBER",
        "minor": "NUMBER"
      }
    }
  }
}
```
{% include copy.html %}

</details>


## Example configurations

The following example configurations show how to use the transformer for different mapping type scenarios:

### Route different types to separate indexes

If you have an index `activity` with types `user` and `post` that you want to split into separate indexes, use the following configuration:

```json
[
  {
    "TypeMappingSanitizationTransformerProvider": {
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
{% include copy.html %}
```

This transformer will perform the following:

- Route documents with type `user` to the `new_users` index
- Route documents with type `post` to the `new_posts` index

### Merge all types into one index

To combine multiple types into a single index, use the following configuration:

```json
[
  {
    "TypeMappingSanitizationTransformerProvider": {
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
{% include copy.html %}

### Drop specific types

To migrate only the `user` type within the `activity` index and drop all documents/requests with types not directly specified, use the following configuration:

```json
[
  {
    "TypeMappingSanitizationTransformerProvider": {
      "staticMappings": {
        "activity": {
          "user": "users_only"
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
{% include copy.html %}

This configuration only migrates documents of type `user` and ignore other types in the `activity` index.

### Keep original structure

To migrate only specific types and keep the original structure:

```JSON
[
  {
    "TypeMappingSanitizationTransformerProvider": {
      "regexMappings": [
        {
          "sourceIndexPattern": "(.*)",
          "sourceTypePattern": ".*",
          "targetIndexPattern": "$1"
        }
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
{% include copy.html %}

This is equivalent to the merge all types into one index rule but using a pattern-based routing strategy.

### Combining multiple strategies

You can combine both static and regex-based mappings to handle different indexes or patterns in a single migration. For example, you might have one index that must use `staticMappings` and another that uses `regexMappings` to route all types by pattern.

For each document, request, or metadata item (processed individually for bulk requests), the following steps are performed:

1. The index is checked to see if it matches an entry in the static mappings.
   - If matched, the type is checked against the index component of the static mappings entry.
     - If the type matches, the mapping is applied, and the resulting index is the value of the type key.
     - If the type doesn't match, the request/document/metadata is dropped and not migrated.
2. If the index is not matched in the static mappings, the index-type combination is checked against each item in the regex mappings list, in order from first to last. If a match is found, the mapping is applied, the resulting index becomes the value of the type key, and no further regex matching is performed.
3. Any request, document, or metadata that doesn't match the preceding cases is dropped, and the documents they contain are not migrated.

The following example demonstrates how to combine static and regex-based mappings for different indices:

```json
[
  {
    "TypeMappingSanitizationTransformerProvider": {
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
        {
          "sourceIndexPattern": "orders.*",
          "sourceTypePattern": ".*",
          "targetIndexPattern": "all_orders"
        }
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
{% include copy.html %}

### Defaults

When `regexMappings` key is missing from the transformation config, `regexMappings` will default to the following:

```JSON
{
  "regexMappings": [
    {
      "sourceIndexPattern": "(.+)",
      "sourceTypePattern": "_doc",
      "targetIndexPattern": "$1"
    },
    {
      "sourceIndexPattern": "(.+)",
      "sourceTypePattern": "(.+)",
      "targetIndexPattern": "$1_$2"
    }
  ]
}
```
{% include copy.html %}

This has the effect of retaining the index name for es 6+ created indexes while combining the type and index name for es 5.x created indexes. If you wish to retain the index name for es 5.x created indexes, use the `staticMappings` option or override the type mappings using the `regexMappings` option similar to the `Keep original structure`

## Limitations

### Traffic replayer

For the Traffic Replayer, **only a subset** of requests that include types is supported:

| **Operation**                | **HTTP method(s)** | **Endpoint**           | **Description**                                                                                                                                                                                                                   |
|------------------------------|--------------------|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Index (by ID)**            | PUT / POST         | `/{index}/{type}/{id}` | Create or update a single document with an explicit ID.                                                                                                                                                                           |
| **Index (auto ID)**          | PUT / POST         | `/{index}/{type}/`     | Create a single document where the ID is auto-generated.                                                                                                                                                                          |
| **Get Document**             | GET                | `/{index}/{type}/{id}` | Retrieve a document by ID.                                                                                                                                                                                                        |
| **Bulk Index/Update/Delete** | PUT / POST         | `/_bulk`               | Perform multiple create/update/delete operations in a single request.                                                                                                                                                             |
| **Create/Update Index**      | PUT / POST         | `/{index}`             | Create or update an index. <br/><br/> **Split** behavior is not supported in the replayer. [See GitHub issue](https://github.com/opensearch-project/opensearch-migrations/issues/1305) to leave feedback or vote on this feature. |

### Reindex-From_Shapshot
For `Reindex-From-Snapshot,` Elasticsearch 6+ created indexes will use `_doc` as the type for all documents, even if a different type was specified on Elasticsearch 6.
