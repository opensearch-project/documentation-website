---
layout: default
title: Transform field types
nav_order: 2
parent: Migrate metadata
grand_parent: Migration phases
permalink: /migration-assistant/migration-phases/migrate-metadata/handling-field-type-breaking-changes/
redirect_from:
  - /migration-assistant/migration-phases/assessment/handling-field-type-breaking-changes/
---

# Transform field types

{: .note }
These transformations may not apply to your use case, but the framework for creating a transformation is designed to handle mutations, data enrichments, and other modifications when modifying workloads or moving them to a new target.

This guide explains how to use Migration Assistant to transform field types that are deprecated or incompatible during a migration to OpenSearch.

Field types define how data is stored and queried in an index. Each field in a document is mapped to a data type, which determines how it is indexed and what operations can be performed on it.

For example, the following index mapping for a library's book collection defines three fields, each with a different type:

```json
GET /library-books/_mappings
{
  "library-books": {
    "mappings": {
      "properties": {
        "title":          { "type": "text" },
        "publishedDate":  { "type": "date" },
        "pageCount":      { "type": "integer" }
      }
    }
  }
}
```

For more information, see [Mappings and field types]({{site.url}}{{site.baseurl}}/field-types/).

## Configure item transformations

You can customize how field types are transformed during metadata and data migrations by supplying a transformation configuration file using the following steps:

1. Open the Migration Assistant console.
2. Create a JavaScript file to define your transformation logic using the following command:

   ```bash
   vim /shared-logs-output/field-type-converter.js
   ```
   {% include copy.html %}

3. Write any JavaScript rules that perform the desired field type conversions. For an example of how the rules can be implemented, see the [example `field-type-converter.js` implementation](#example-field-type-converterjs-implementation).
4. Create a transformation descriptor file using the following command:

   ```bash
   vim /shared-logs-output/transformation.json
   ```
   {% include copy.html %}

5. Add a reference to your JavaScript file in `transformation.json`.
6. Run the metadata migration and supply the transformation configuration using a command similar to the following:

   ```bash
   console metadata migrate \
     --transformer-config-file /shared-logs-output/transformation.json
   ```
   {% include copy.html %}

### Example `field-type-converter.js` implementation

The following script demonstrates how to perform common field type conversions, including:

* Replacing the deprecated `string` type with `text`.
* Converting `flattened` to `flat_object` and removing the `index` property if present.


```javascript
function main(context) {
  const rules = [
    {
      when: { type: "string" },
      set: { type: "text" }
    },
    {
      when: { type: "flattened" },
      set: { type: "flat_object" },
      remove: ["index"]
    }
  ];

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
    } else if (node && typeof node === "object") {
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
{% include copy.html %}

The script contains the following elements:

1. The `rules` array defines transformation logic:

   * `when`: Key-value conditions to match on a node
   * `set`: Key-value pairs to apply when the `when` clause matches
   * `remove` (optional): Keys to delete from the node when matched

2. The `applyRules` function recursively traverses the input:

   * Arrays are recursively processed element by element.
   * `Map` objects are matched and mutated using the defined rules.
   * Plain objects are checked for matches and transformed accordingly.

3. The `main` function returns a transformation function that:

   * Applies the rules to each document.
   * Returns the modified document for migration or replay.

### Example `transformation.json`

The following JSON file references your transformation script and initializes the JavaScript engine with your custom rules:

```json
[
  {
    "JsonJSTransformerProvider": {
      "initializationScriptFile": "/shared-logs-output/field-type-converter.js",
      "bindingsObject": "{}"
    }
  }
]
```
{% include copy.html %}

## Summary

By using a transformation configuration, you can rewrite deprecated or incompatible field types during metadata migration or data replay. This ensures that your target OpenSearch cluster only receives compatible mappings—even if the source cluster includes outdated types like `string` or features like `flattened` that need conversion.
