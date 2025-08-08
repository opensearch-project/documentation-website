---
layout: default
title: Transform flattened to flat_object
nav_order: 3
parent: Migrate metadata
grand_parent: Migration phases
permalink: /migration-assistant/migration-phases/migrate-metadata/transform-flattened-flat-object/
---

# Transform flattened to flat_object fields

This guide explains how Migration Assistant automatically transforms the `flattened` field type during migration to OpenSearch.

## Overview

The `flattened` field type was introduced in Elasticsearch 7.3 as an X-Pack feature. It allows you to store an entire JSON object as a single field value, which can be useful for objects with a large or unknown number of unique keys.

When migrating to OpenSearch 2.7 or later, Migration Assistant automatically converts `flattened` field types to OpenSearch's equivalent `flat_object` type. This transformation requires no configuration or user intervention.

To determine whether an Elasticsearch cluster uses `flattened` field types, make a call to your source cluster's `GET /_mapping` API. In the migration console, run `console clusters curl source_cluster "/_mapping"`. If you see `"type":"flattened"`, then this transformation is applicable and these fields will be automatically transformed during migration.

## Compatibility

The `flattened` to `flat_object` field type transformation applies to:
- **Source clusters**: Elasticsearch 7.3+
- **Target clusters**: OpenSearch 2.7+
- **Automatic conversion**: No configuration required during metadata

## Automatic migration

When migrating to OpenSearch 2.7 or later, Migration Assistant automatically detects `flattened` field types and converts them to `flat_object` fields. During the migration process, you'll see this transformation in the output:

```
Transformations:
   flattened to flat_object:
      Convert field data type flattened to OpenSearch flat_object
```

### Example transformation

<table style="border-collapse: collapse; border: 1px solid #ddd;">
  <thead>
    <tr>
      <th style="border: 1px solid #ddd; padding: 8px;">Source field type</th>
      <th style="border: 1px solid #ddd; padding: 8px;">Target field type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">
        <pre><code>{
  "properties": {
    "labels": {
      "type": "flattened"
    },
    "title": {
      "type": "text"
    }
  }
}</code></pre>
      </td>
      <td style="border: 1px solid #ddd; padding: 8px;">
        <pre><code>{
  "properties": {
    "labels": {
      "type": "flat_object"
    },
    "title": {
      "type": "text"
    }
  }
}</code></pre>
      </td>
    </tr>
  </tbody>
</table>

## Transformation behavior across versions

Migration Assistant automatically converts all `flattened` fields to `flat_object` fields. No additional configuration is required.

If you're migrating to OpenSearch versions earlier than 2.7, indexes containing `flattened` field types will fail to migrate. You have several options:

1. **Upgrade target cluster**: Upgrade your target OpenSearch cluster to version 2.7 or later to support the automatic conversion.

2. **Custom transformation**: Use the [field type transformation framework]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/handling-field-type-breaking-changes/) to convert `flattened` to another supported type (for example, `object` or `nested`).

## Differences between flattened and flat_object

While `flat_object` in OpenSearch provides similar functionality to Elasticsearch's `flattened` type, there are some minor differences:

- **Query syntax**: Both support dot notation for accessing nested fields.
- **Performance**: Similar performance characteristics for indexing and searching.
- **Storage**: Both store the entire object as a single Lucene field.
- **Limitations**: Both have similar limitations on aggregations and sorting.

## Troubleshooting

If you encounter issues with `flattened` field migration:

1. **Verify target version** -- Ensure your target OpenSearch cluster is running version 2.7 or later.

2. **Check migration logs** -- Review the detailed migration logs for any warnings or errors:
   ```bash
   cat /shared-logs-output/migration-console-default/*/metadata/*.log
   ```

3. **Validate mappings** -- After migration, verify that the field types have been correctly converted:
   ```bash
   GET /your-index/_mapping
   ```

## Related documentation

For additional help with field type transformations, see:
- [Transform field types]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/handling-field-type-breaking-changes/) -- Configure custom field type transformations.
