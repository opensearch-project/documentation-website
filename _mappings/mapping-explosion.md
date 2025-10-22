---
layout: default
title: Mapping explosion
nav_order: 110
has_children: false
redirect_from:
  - /mappings/mapping-explosion/
---

# Mapping explosion

Mapping explosion occurs when an index accumulates an excessive number of fields, which can lead to performance degradation, memory issues, and cluster instability. This situation commonly arises when using dynamic mapping with highly variable document structures, where each new document introduces additional fields that are automatically added to the index mapping.

When OpenSearch encounters new fields in documents, it automatically creates mappings for these fields through dynamic mapping. While this feature provides flexibility, it can become problematic in scenarios such as:

- **Log data with varying structures**: Different log sources may include unique fields, leading to rapid field proliferation.
- **User-generated content**: Applications that allow users to define custom fields or attributes.
- **Nested object structures**: Documents with deeply nested objects that contain many subfields.
- **Time-series data**: Metrics or events that include dynamic field names based on timestamps or identifiers.

As the number of fields grows, several issues can emerge:

- Increased memory consumption for storing field mappings
- Slower query performance due to larger mapping structures
- Potential out-of-memory errors during indexing or searching
- Difficulty in cluster recovery scenarios

## Mapping limit settings

OpenSearch provides several index-level settings to prevent mapping explosion by limiting various aspects of mapping growth. These settings can be configured when creating an index or updated on existing indexes:

```json
PUT /my-index/_settings
{
  "index.mapping.total_fields.limit": 2000
}
```
{% include copy-curl.html %}

The following table lists all available mapping limit settings. All settings are dynamic. For more information, see [Dynamic settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#dynamic-settings).

| Setting | Default | Valid values | Description |
|:--- |:--- |:--- |:--- |:--- |
| `index.mapping.total_fields.limit` | `1000` | [0, ∞) | Sets the maximum number of fields allowed in an index, including regular fields, object mappings, and field aliases. Increasing this limit requires careful consideration of cluster resources. When raising this setting, consider also adjusting the `indices.query.bool.max_clause_count` setting to accommodate larger queries. |
| `index.mapping.depth.limit` | `20` | [1, 100] | Controls the maximum nesting depth for field mappings. Depth is calculated by counting the levels of nested objects, starting from the root level (depth 1 for root-level fields, depth 2 for fields within one level of object nesting, and so on). |
| `index.mapping.nested_fields.limit` | `50` | [0, ∞) | Limits the number of distinct `nested` field types in an index. Since nested fields require special handling and additional memory, this setting helps prevent excessive resource consumption. |
| `index.mapping.nested_objects.limit` | `10000` | [0, ∞) | Restricts the total number of nested JSON objects that a single document can contain across all nested field types. This prevents individual documents from consuming excessive memory during indexing. |
| `index.mapping.field_name_length.limit` | `50000` | [1, 50000] | Sets the maximum allowed length for field names. This setting can help maintain reasonable mapping sizes by preventing extremely long field names. |
| `index.mapper.dynamic` | `true` | `true`,`false` | Determines whether new fields should be dynamically added to a mapping. Setting this to `false` can prevent uncontrolled field growth. |

## Best practices

To avoid mapping explosion, follow these guidelines.

### Use explicit mappings

Define explicit mappings whenever possible instead of relying on dynamic mapping:

```json
PUT /logs
{
  "mappings": {
    "properties": {
      "timestamp": {
        "type": "date"
      },
      "message": {
        "type": "text"
      },
      "level": {
        "type": "keyword"
      },
      "source": {
        "type": "keyword"
      }
    }
  }
}
```
{% include copy-curl.html %}

### Configure dynamic mapping templates

Use dynamic templates to control how new fields are mapped:

```json
PUT /logs
{
  "mappings": {
    "dynamic_templates": [
      {
        "strings_as_keywords": {
          "match_mapping_type": "string",
          "mapping": {
            "type": "keyword"
          }
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}

### Consider flat object field type

For documents with arbitrary key-value pairs, use the [`flat_object` field type]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/flat-object/) instead of allowing dynamic mapping:

```json
PUT /products
{
  "mappings": {
    "properties": {
      "name": {
        "type": "text"
      },
      "attributes": {
        "type": "flat_object"
      }
    }
  }
}
```
{% include copy-curl.html %}

### Disable dynamic mapping

For indexes with well-defined schemas, disable dynamic mapping entirely:

```json
PUT /structured-data
{
  "mappings": {
    "dynamic": "strict",
    "properties": {
      "id": {
        "type": "keyword"
      },
      "value": {
        "type": "double"
      }
    }
  }
}
```
{% include copy-curl.html %}


## Monitoring and maintenance

Regular monitoring helps you detect mapping growth early and take action before it affects cluster performance. You can monitor field mappings in the following ways.

### Check current field count

Monitor the number of fields in your indexes:

```json
GET /my-index/_mapping
```
{% include copy-curl.html %}

You can also use the Cluster Stats API to get field count information:

```json
GET /_cluster/stats
```
{% include copy-curl.html %}

### Identify problematic indexes

Use index statistics to find indexes with high field counts:

```json
GET /_cat/indices?v&h=index,docs.count,store.size,pri.store.size&s=store.size:desc
```
{% include copy-curl.html %}

### Clean up unused fields

For indexes with dynamic mapping enabled, regularly review and clean up fields that are no longer needed by reindexing with a more restrictive mapping.

## Recovery from mapping explosion

If an index has already experienced mapping explosion:

1. Determine which fields are actually needed.
2. Create a new index with explicit mappings and appropriate limits.
3. Reindex the data using the Reindex API, filtering out unnecessary fields.
4. Update aliases to point to the new index.
5. Delete the old index once the migration is complete:

```json
POST /_reindex
{
  "source": {
    "index": "old-index"
  },
  "dest": {
    "index": "new-index"
  },
  "script": {
    "source": "ctx._source.remove('unwanted_field')"
  }
}
```
{% include copy-curl.html %}
