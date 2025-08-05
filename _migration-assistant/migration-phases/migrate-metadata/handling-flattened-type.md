---
layout: default
title: Flattened type handling
nav_order: 3
parent: Migrate metadata
grand_parent: Migration phases
permalink: /migration-assistant/migration-phases/migrate-metadata/handling-flattened-type/
---

# Flattened type handling

This guide explains how the Migration Assistant automatically handles the `flattened` field type during migration to OpenSearch.

## Overview

The `flattened` field type was introduced in Elasticsearch 7.3 as an X-Pack feature. It allows you to store an entire JSON object as a single field value, which can be useful for objects with a large or unknown number of unique keys.

When migrating to OpenSearch 2.7 or later, the Migration Assistant automatically converts `flattened` field types to OpenSearch's equivalent `flat_object` type. This transformation requires no configuration or user intervention.

## Compatibility

The `flattened` field type is:
- **Supported in**: Elasticsearch 7.3+ with X-Pack
- **Not supported in**:
  - Elasticsearch versions without X-Pack
  - Any OpenSearch version prior to 2.7
  - Open source Elasticsearch distributions

## Automatic migration

When migrating to OpenSearch 2.7 or later, the Migration Assistant automatically detects and converts `flattened` field types to `flat_object`. During the migration process, you'll see this transformation in the output:

```
Transformations:
   flattened to flat_object:
      Convert field data type flattened to OpenSearch flat_object
```

### Example transformation

<table>
<tr>
<th>Source Field Type</th>
<th>Target Field Type</th>
</tr>
<tr>
<td>
<pre><code class="language-json">{
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
<td>
<pre><code class="language-json">{
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
</table>

## Migration scenarios

### Migrating to OpenSearch 2.7+

The Migration Assistant automatically converts all `flattened` fields to `flat_object`. No additional configuration is required.

### Migrating to OpenSearch versions before 2.7

If you're migrating to OpenSearch versions before 2.7, indexes containing `flattened` field types will fail to migrate. You have several options:

1. **Upgrade target cluster**: Upgrade your target OpenSearch cluster to version 2.7 or later to support the automatic conversion.

2. **Manual transformation**: Before migration, manually update your mappings to use a different field type such as `object` or `nested`.

3. **Custom transformation**: Use the [field type transformation framework]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/handling-field-type-breaking-changes/) to convert `flattened` to another supported type.

## Differences between flattened and flat_object

While `flat_object` in OpenSearch provides similar functionality to Elasticsearch's `flattened` type, there are some minor differences:

- **Query syntax**: Both support dot notation for accessing nested fields
- **Performance**: Similar performance characteristics for indexing and searching
- **Storage**: Both store the entire object as a single Lucene field
- **Limitations**: Both have similar limitations on aggregations and sorting

## Troubleshooting

If you encounter issues with flattened field migration:

1. **Verify target version**: Ensure your target OpenSearch cluster is version 2.7 or later.

2. **Check migration logs**: Review the detailed migration logs for any warnings or errors:
   ```bash
   cat /shared-logs-output/migration-console-default/*/metadata/*.log
   ```

3. **Validate mappings**: After migration, verify that the field types have been correctly converted:
   ```bash
   GET /your-index/_mapping
   ```

## Related documentation

For additional help with field type transformations, see:
- [Transform field types]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/handling-field-type-breaking-changes/) - Configure custom field type transformations
