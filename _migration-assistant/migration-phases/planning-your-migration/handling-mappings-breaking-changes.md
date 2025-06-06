---
layout: default
title: Handling Breaking Changes in Type Mappings
nav_order: 60
parent: Planning your migration
grand_parent: Migration phases
---

# Handling Breaking Changes in Type Mappings

This guide explains how users of the Migration Console can apply transformations to type mappings in order to handle breaking changes during an OpenSearch migration.

## Configuring Migration Assistant to Use a Transformation Configuration

All migrated items run through Migration Assistant can be modified using a shared transformation configuration file.

### Transforming Metadata Items

1. Open the Migration Assistant console.
2. Create a file at `/shared-logs-output/transformation.json`.
3. Add your transformation configuration into this file. (For details on configuration options, see [Configuration options](#configuration-options).)
4. When you run the metadata migration, supply the transformer configuration by appending:

   ```bash
   console metadata migrate \
     --transformer-config-file /shared-logs-output/transformation.json
   ```

### Transforming Replayed and Backfilled Items

For replayed and backfilled items, the transformer configuration must be applied before deploying Migration Assistant. In addition to the metadata migration steps, follow these instructions:

1. Connect to the bootstrap machine, open the `cdk.context.json` file with Vim.
2. Add or update the key `reindexFromSnapshotExtraArgs` and include:

   ```
   --doc-transformer-config-file /shared-logs-output/transformation.json
   ```
3. Add or update the key `trafficReplayerExtraArgs` and include:

   ```
   --transformer-config-file /shared-logs-output/transformation.json
   ```
4. Redeploy the Migration Assistant so that both the reindex-from-snapshot and traffic replayer components pick up the new transformer configuration.

## Updating the Contents of transformation.json

Because Migration Assistant passes transformation code as a single-line string, you must remove all newline characters from your JavaScript code. Once you have a single-line version of the transformation function, insert it into `/shared-logs-output/transformation.json` as shown:

```json
[
  {
    "JsonJSTransformerProvider": {
      "initializationScript": "<single-line JavaScript code goes here>",
      "bindingsObject": "{}"
    }
  }
]
```

> **Tips:**
>
> 1. To collapse your JavaScript into a single line, you can use a tool like `tr` or an IDE’s “join lines” feature. Just make sure the code remains syntactically correct.
> 2. To add comments, use the multi-line syntax `/* ... */` to ensure they are not lost during compression.
> 3. For string literals, use backticks (`` ` ``) instead of double quotes so they don’t conflict with the surrounding JSON syntax.

## Example: Transformation Function for Common Mapping Changes

The following JavaScript function demonstrates how to handle two common mapping changes:

1. Deprecating the `string` type in favor of `text`.
2. Translating `flattened` to `flat_object` and removing the `index` property where necessary.

```javascript
function main(context) {
  const rules = [{
    when: { type: `string` }, /* Match all the key/value pairs here */
    set: { type: `text` }, /* Replace them with these key/value pairs */
  }, {
    when: { type: `flattened` }, /* Match all the key/value pairs here */
    set: { type: `flat_object` }, /* Replace them with these key/value pairs */
    remove: [`index`], /* Any sibling keys that should be removed */
  }];
  
  function applyRules(node, rules) {
    if (Array.isArray(node)) {
      node.forEach((child) => applyRules(child, rules));
    } else if (node instanceof Map) {
      for (const { when, set, remove = [] } of rules) {
        const matches = Object.entries(when).every(([k, v]) => node.get(k) === v);
        if (matches) {
          Object.entries(set).every(([k, v]) => node.set(k, v));
          remove.forEach((key) => node.delete(key));
        }
      }
      for (const child of node.values()) {
        applyRules(child, rules);
      }
    } else if (node && typeof node === `object`) {
      for (const { when, set, remove = [] } of rules) {
        const matches = Object.entries(when).every(([k, v]) => node[k] === v);
        if (matches) {
          Object.assign(node, set);
          remove.forEach((key) => delete node[key]);
        }
      }
      Object.values(node).forEach((child) => applyRules(child, rules));
    }
  }

  return (doc) => {
    if (doc && doc.type && doc.name && doc.body) {
      applyRules(doc, rules);
    }
    return doc;
  };
}
(() => main)();
```

### How This Works

1. The `rules` array defines one or more transformation rules. Each rule has:

   * `when`: an object of key/value pairs to match on the current node.
   * `set`: an object of key/value pairs to assign when a match occurs.
   * `remove` (optional): an array of property names to delete when the rule fires.

2. The `applyRules` function traverses the entire document recursively:

   * If the node is an array, it recurses into each element.
   * If the node is an ES6 `Map`, it checks for matching entries, applies setters or removals, then recurses on each value in the map.
   * If the node is a plain object, it checks for matching entries, applies setters or removals, then recurses into all child values.

3. Finally, `main` returns a function that accepts each document before it’s written to your target cluster (or before replay), applies all matching rules, and returns the modified document.

---


## Summary

By creating a transformation configuration and pointing both metadata migrations and data replay/backfill jobs to it, you can automatically rewrite deprecated or changed type mappings in flight. This approach ensures the target OpenSearch cluster only ever sees compatible mappings—even if your source cluster contained obsolete types like `string` or incompatible types like `flattened`.
