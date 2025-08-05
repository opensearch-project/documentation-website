---
layout: default
title: Transform string to text/keyword
nav_order: 4
parent: Migrate metadata
grand_parent: Migration phases
permalink: /migration-assistant/migration-phases/migrate-metadata/transform-string-text-keyword/
---

# Transform string to text/keyword

Convert field data type string to text/keyword based on field data mappings.

This guide explains how the Migration Assistant automatically handles the deprecated `string` field type during migration from older Elasticsearch versions.

## Overview

The `string` field type was the primary text field type in early versions of Elasticsearch but was deprecated in Elasticsearch 5.x and completely removed in Elasticsearch 6.0. In Elasticsearch 5.x, it remained available in backward compatibility mode only.

When migrating from Elasticsearch 1.x through 5.x to newer versions, the Migration Assistant automatically converts `string` field types to their modern equivalents: `text` for analyzed fields and `keyword` for non-analyzed fields.

## Compatibility

The `string` to `text`/`keyword` field type transformation applies to:
- **Source clusters**: Elasticsearch 1.x - 5.x
- **Target clusters**: Elasticsearch 5.x+ or OpenSearch 1.x+
- **Automatic conversion**: No configuration required during metadata

## Automatic conversion logic

The Migration Assistant determines whether to convert a `string` field to `text` or `keyword` based on the field's `index` property:

### Conversion to `keyword`
Fields are converted to `keyword` when:
- `index: "not_analyzed"`
- `index: "no"`
- `index: false`

### Conversion to `text`
Fields are converted to `text` when:
- `index: "analyzed"` (default behavior)
- `index` property is not specified
- Any other `index` value

### Property cleanup

During conversion, the Migration Assistant also cleans up properties that are incompatible with the target field type:

**For `keyword` fields**, the following properties are removed:
- `analyzer`
- `search_analyzer`
- `position_increment_gap`
- `term_vector`
- `fielddata`

**For `text` fields**, the following properties are removed:
- `doc_values`
- `null_value` (if present)

Additionally, legacy `index` values are normalized:
- `index: "analyzed"` and `index: "not_analyzed"` are removed (ES 5.x default is `true`)
- `index: "no"` becomes `index: false`

## Migration output

During the migration process, you'll see this transformation in the output:

```
Transformations:
   string to text/keyword:
      Convert field type string to text/keyword based on field data mappings
```

## Example transformations

### String to keyword conversion

<table style="border-collapse: collapse; border: 1px solid #ddd;">
  <thead>
    <tr>
      <th style="border: 1px solid #ddd; padding: 8px;">Source Field Type</th>
      <th style="border: 1px solid #ddd; padding: 8px;">Target Field Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">
        <pre><code>{
  "properties": {
    "status": {
      "type": "string",
      "index": "not_analyzed",
      "doc_values": true
    },
    "category": {
      "type": "string",
      "index": "no"
    }
  }
}</code></pre>
      </td>
      <td style="border: 1px solid #ddd; padding: 8px;">
        <pre><code>{
  "properties": {
    "status": {
      "type": "keyword",
      "doc_values": true
    },
    "category": {
      "type": "keyword",
      "index": false
    }
  }
}</code></pre>
      </td>
    </tr>
  </tbody>
</table>


### String to text conversion

<table style="border-collapse: collapse; border: 1px solid #ddd;">
  <thead>
    <tr>
      <th style="border: 1px solid #ddd; padding: 8px;">Source Field Type</th>
      <th style="border: 1px solid #ddd; padding: 8px;">Target Field Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px;">
        <pre><code>{
  "properties": {
    "title": {
      "type": "string",
      "analyzer": "standard",
      "fielddata": true
    },
    "description": {
      "type": "string",
      "index": "analyzed",
      "term_vector": "with_positions"
    }
  }
}</code></pre>
      </td>
      <td style="border: 1px solid #ddd; padding: 8px;">
        <pre><code>{
  "properties": {
    "title": {
      "type": "text",
      "analyzer": "standard",
      "fielddata": true
    },
    "description": {
      "type": "text",
      "term_vector": "with_positions"
    }
  }
}</code></pre>
      </td>
    </tr>
  </tbody>
</table>

## Migration scenarios

### Migrating from Elasticsearch 1.x-5.x

The Migration Assistant automatically converts all `string` fields during metadata migration. No additional configuration is required.

### Mixed field types

If your source cluster already contains a mix of `string`, `text`, and `keyword` fields (common in Elasticsearch 5.x during the transition period), only the `string` fields will be converted. Existing `text` and `keyword` fields remain unchanged.

## Troubleshooting

If you encounter issues with string field conversion:

1. **Verify source version**: Ensure your source cluster is Elasticsearch 1.x through 5.x.

2. **Check migration logs**: Review the detailed migration logs for any warnings or errors:
   ```bash
   tail /shared-logs-output/migration-console-default/*/metadata/*.log
   ```

3. **Validate mappings**: After migration, verify that the field types have been correctly converted:
   ```bash
   GET /your-index/_mapping
   ```

4. **Review field usage**: Ensure that your application queries are compatible with the new field types. Queries that worked with `string` fields should continue to work with `text` and `keyword` fields, but some advanced features may behave differently.

## Related documentation

For additional help with field type transformations, see:
- [Transform field types]({{site.url}}{{site.baseurl}}/migration-assistant/migration-phases/migrate-metadata/handling-field-type-breaking-changes/) - Configure custom field type transformations
