---
layout: default
title: Simulate index templates
parent: Index APIs
nav_order: 29
---

# Simulate index templates

The Simulate Index Template API helps you preview how index templates will be applied to an index or simulate an index template definition before creating it.

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
| `template_name` | String | Name of the index template to simulate. |
| `index_name` | String | Name of the index to simulate template resolution on. |

## Request body fields

The following table lists the available request body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `index_patterns` | Array | Index patterns the template applies to. |
| `template` | Object | The template definition. |
| `template.settings` | Object | Index settings to apply. |
| `template.mappings` | Object | Field mappings to apply. |
| `template.aliases` | Object | Aliases to apply. |
| `priority` | Integer | Priority of the template. |
| `version` | Integer | Template version. |
| `_meta` | Object | Metadata for the template. |

### Example request: Simulate a template

You can use the following command to simulate a template without creating it:

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

You can simulate specific template by specifying the name of the template.

The first step is to create a template named `template_for_simulation` using the following command:

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

You can now use the following command to simulate template named `template_for_simulation`:

```json
POST /_index_template/_simulate/template_for_simulation
```
{% include copy-curl.html %}

### Example request: Simulate template on a specific index

Simulating template on a specific index name is particularly useful for resolving conflicts or debugging priority issues among templates.
The following command demonstrates how all applicable templates, with overlapping index patterns, would apply to an index named `"logs-sim-1"`.

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
| `template` | Object | The effective template applied. |
| `template.settings` | Object | The resolved index settings. |
| `template.mappings` | Object | The resolved field mappings. |
| `template.aliases` | Object | The resolved aliases. |
| `overlapping` | Array | A list of overlapping templates. |

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `indices:admin/index_template/simulate`.
