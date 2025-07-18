---
layout: default
title: Simulate index templates
parent: Index APIs
nav_order: 145
---

# Simulate index templates

You can use the Simulate Index Template API to preview how index templates will be applied to an index or simulate an index template before creating it.

## Endpoints

```json
POST /_index_template/_simulate
POST /_index_template/_simulate/<template_name>
POST /_index_template/_simulate_index/<index_name>
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `template_name` | String | The name of the index template to simulate. |
| `index_name` | String | The name of the index to use for simulating template resolution. |

## Request body fields

The following table lists the available request body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `index_patterns` | Array | The index patterns to which the template applies. |
| `template` | Object | The template definition. |
| `template.settings` | Object | The index settings to apply. |
| `template.mappings` | Object | The field mappings to apply. |
| `template.aliases` | Object | The aliases to apply. |
| `priority` | Integer | The template's priority value, used to determine which template is applied when multiple templates match an index. Higher values take precedence. |
| `version` | Integer | The template version. |
| `_meta` | Object | Metadata for the template. |

### Example request: Simulate a template

Use the following request to simulate a template without creating it:

```json
POST /_index_template/_simulate
{
  "index_patterns": ["log-*"],
  "template": {
    "settings": {
      "number_of_shards": 1
    },
    "mappings": {
      "properties": {
        "message": {
          "type": "text"
        }
      }
    }
  },
  "priority": 5
}
```
{% include copy-curl.html %}

### Example request: Simulate a named template

You can simulate a specific template by specifying the name of the template.

First, create a template named `template_for_simulation` using the following request:

```json
PUT /_index_template/template_for_simulation
{
  "index_patterns": ["logs-sim-*"],
  "template": {
    "settings": {
      "number_of_shards": 1,
      "number_of_replicas": 1
    },
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
        }
      }
    }
  },
  "priority": 10,
  "version": 1,
  "_meta": {
    "description": "Template used for simulation example",
    "owner": "Docs Team"
  }
}
```
{% include copy-curl.html %}

You can now simulate the template named `template_for_simulation`:

```json
POST /_index_template/_simulate/template_for_simulation
```
{% include copy-curl.html %}

### Example request: Simulate a template on a specific index

Simulating a template on a specific index name is particularly useful for resolving conflicts or debugging priority issues among templates.
The following request demonstrates how all applicable templates, with overlapping index patterns, will be applied to an index named `logs-sim-1`:

```json
POST /_index_template/_simulate_index/logs-sim-1
```
{% include copy-curl.html %}

## Example response

```json
{
  "template": {
    "settings": {
      "index": {
        "number_of_shards": "1",
        "number_of_replicas": "1"
      }
    },
    "mappings": {
      "properties": {
        "level": {
          "type": "keyword"
        },
        "message": {
          "type": "text"
        },
        "timestamp": {
          "type": "date"
        }
      }
    },
    "aliases": {}
  },
  "overlapping": []
}
```

## Response body fields

| Field | Data type | Description |
| :--- | :--- | :--- |
| `template` | Object | The template applied. |
| `template.settings` | Object | The resolved index settings. |
| `template.mappings` | Object | The resolved field mappings. |
| `template.aliases` | Object | The resolved aliases. |
| `overlapping` | Array | A list of other index templates that match the same index pattern but were not applied. |

## Required permissions

If you are using the Security plugin, make sure you have the appropriate permissions: `indices:admin/index_template/simulate`.
