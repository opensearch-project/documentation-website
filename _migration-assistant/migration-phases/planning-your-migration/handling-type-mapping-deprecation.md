---
layout: default
title: Managing type mapping deprecation
nav_order: 60
parent: Planning your migration
grand_parent: Migration phases
---

# Managing type mapping deprecation

This guide provides solutions for managing the deprecation of the type mapping functionality when migrating from Elasticsearch 6.x or earlier to OpenSearch.

In versions of Elasticsearch prior to 6.x, an index could contain multiple types, each with its own mapping. These types allowed you to store and query different kinds of documents—such as books and movies—in a single index. For example, both `book` and `movie` types could have a shared field like `title`, while each had additional fields specific to that type.

Newer versions of Elasticsearch and OpenSearch no longer support multiple mapping types. Each index now supports only a single mapping type. During migration, you must define how to transform or restructure data that used multiple types. The following example shows multiple mapping types:


```JSON
GET /library/_mappings
{
  "library": {
    "mappings": {
      "book": {
        "properties": {
          "title":      { "type": "text" },
          "pageCount":  { "type": "integer" }
        }
      },
      "movie": {
        "properties": {
          "title":      { "type": "text" },
          "runTime":    { "type": "integer" }
        }
      }
    }
  }
}
```

For more information, see the [official Elasticsearch documentation on the removal of mapping types](https://www.elastic.co/guide/en/elasticsearch/reference/7.10/removal-of-types.html). 

## Using the type mapping transformer

To address type mapping deprecation, use the `TypeMappingsSanitizationTransformer`. This transformer can modify data, including metadata, documents, and requests, so that the previously mapped data can be used in OpenSearch. To use the mapping transformer:

1. Navigate to the bootstrap box and open the `cdk.context.json` file with Vim.
2. Add or update the key `reindexFromSnapshotExtraArgs` to include `--doc-transformer-config-file /shared-logs-output/transformation.json`.
3. Add or update the key `trafficReplayerExtraArgs` to include `--transformer-config-file /shared-logs-output/transformation.json`.
4. Deploy Migration Assistant.
5. Navigate to the Migration Assistant console.
6. Create a file named `/shared-logs-output/transformation.json`.
7. Add your transformation configuration to the file. For configuration options, see [Configuration options](#configuration-options).
8. When running the metadata migration, run the configuration with the transformer using the command `console metadata migrate --transformer-config-file /shared-logs-output/transformation.json`.

Whenever the transformation configuration is updated, the backfill and replayer tools need to be stopped and restarted in order to apply the changes. Any previously migrated data and metadata may need to be cleared in order to avoid an inconsistent state.

### Configuration options

The `TypeMappingsSanitizationTransformer` supports several strategies for managing type mappings:

1. **Route different types to separate indexes**: Split different types into their own indexes.
2. **Merge all types into one index**: Combine multiple types into a single index.
3. **Drop specific types**: Selectively migrate only specific types.
4. **Keep the original structure**: Maintain the same index name while conforming to the new type standards.

### Type mapping transformer configuration schema

The type mapping transformer uses the following configuration options.

| **Field**  | **Type** | **Required** | **Description** | 
| :--- | :--- | :--- | :--- |
| `staticMappings`   | `object` | No   | A map of `{ indexName: { typeName: targetIndex } }` used to **statically** route specific types. <br/><br/> For any **index** listed on this page, types **not** included in its object are **dropped** (no data or requests are migrated for those omitted types).   |
| `regexMappings`    | `array`  | No   | A list of **regex-based** rules for **dynamic** routing of source index/type names to a target index. <br/><br/> Each element in this array is itself an object with `sourceIndexPattern`, `sourceTypePattern`, and `targetIndexPattern` fields. <br/><br/> For information about the **default value**, see [Defaults](#Defaults). |
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

The following example configurations show you how to use the transformer for different mapping type scenarios.

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

- Route documents with type `user` to the `new_users` index.
- Route documents with type `post` to the `new_posts` index.

### Merge all types into one index

To merge all types into one index, use the following configuration:

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

This configuration only migrates documents of type `user` and ignores other document types in the `activity` index.

### Keep the original structure

To migrate only specific types and keep the original structure, use the following configuration:

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

This is equivalent to the strategy of merging all types into one index but also uses a pattern-based routing strategy.

### Combining multiple strategies

You can combine both static and regex-based mappings to manage different indexes or patterns in a single migration. For example, you might have one index that must use `staticMappings` and another that uses `regexMappings` to route all types by pattern.

For each document, request, or metadata item (processed individually for bulk requests), the following steps are performed:

1. The index is checked to determine whether it matches an entry in the static mappings.
   - If matched, the type is checked against the index component of the static mappings entry.
     - If the type matches, the mapping is applied, and the resulting index includes the value of the type key.
     - If the type doesn't match, the request/document/metadata is dropped and not migrated.
2. If the index is not matched in the static mappings, the index-type combination is checked against each item in the regex mappings list, in order from first to last. If a match is found, the mapping is applied, the resulting index includes the value of the type key, and no further regex matching is performed.
3. Any request, document, or metadata that doesn't match the preceding cases is dropped, and the documents they contain are not migrated.

The following example demonstrates how to combine static and regex-based mappings for different indexes:

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

When the `regexMappings` key is missing from the transformation configuration, `regexMappings` will default to the following:

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

This has the effect of retaining the index name for indexes created in Elasticsearch 6.x or later while combining the type and index name for indexes created in Elasticsearch 5.x. If you want to retain the index name for indexes created in Elasticsearch 5.x, use the `staticMappings` option or override the type mappings using the `regexMappings` option.

## Limitations

When using the transformer, remember the following limitations.
When using the transformer, remember the following limitations.
### Traffic Replayer

For the Traffic Replayer, **only a subset** of requests that include types is supported. These requests are listed in the following table.

| **Operation** | **HTTP method(s)** | **Endpoint**   | **Description**  |
| :--- | :--- | :--- | :--- |
| **Index (by ID)**  | PUT/POST           | `/{index}/{type}/{id}`  | Create or update a single document with an explicit ID.   |
| **Index (auto ID)**          | PUT/POST           | `/{index}/{type}/`      | Create a single document for which the ID is automatically generated.  |
| **Get Document**             | GET                | `/{index}/{type}/{id}`  | Retrieve a document by ID.  |
| **Bulk Index/Update/Delete** | PUT/POST           | `/_bulk`                | Perform multiple create/update/delete operations in a single request. |
| **Bulk Index/Update/Delete** | PUT/POST           | `/{index}/_bulk`        | Perform multiple create/update/delete operations in a single request with default index assignment.                                                                                                                                                 |
| **Bulk Index/Update/Delete** | PUT/POST           | `/{index}/{type}/_bulk` | Perform multiple create/update/delete operations in a single request with default index and type assignment.                                                                                                                                        |
| **Create/Update Index**      | PUT/POST           | `/{index}`              | Create or update an index. <br/><br/> **Split** behavior is not supported in the Traffic Replayer. See [this GitHub issue](https://github.com/opensearch-project/opensearch-migrations/issues/1305) to provide feedback or to vote on this feature. |

### Reindex-From_Shapshot
For `Reindex-From-Snapshot,` indexes created in Elasticsearch 6.x or later will use `_doc` as the type for all documents, even if a different type was specified in Elasticsearch 6.
