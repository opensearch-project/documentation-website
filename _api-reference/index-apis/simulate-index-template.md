---
layout: default
title: Simulate index templates
parent: Index APIs
nav_order: 29
---

# Simulate index templates

The Simulate Index Template API helps you preview how index templates will be applied to an index or simulate an index template definition before creating it.

## Endpoints

| Endpoint | Description |
|---------|-------------|
| `/_index_template/_simulate` | Simulates an index template using a definition provided in the request body. |
| `/_index_template/_simulate/<template-name>` | Simulates how a specific index template would be applied. |
| `/_index_template/_simulate_index/<index-name>` | Simulates how templates (including matching component templates) would apply to a real index. |


### Simulate a template

Use the following command to preview the outcome of a new template without actually storing it:

```json
POST _index_template/_simulate
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

Expected result:

```json
{
  "template": {
    "settings": {
      "index": {
        "number_of_shards": "1"
      }
    },
    "mappings": {
      "properties": {
        "message": {
          "type": "text"
        }
      }
    },
    "aliases": {}
  },
  "overlapping": []
}
```

### Simulate a named template

You can simulate specific template by specifying the name of the template.

The first step is to create a template named `template_for_simulation` using the following command:

```json
PUT _index_template/template_for_simulation
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

Use the following command to simulate template named `template_for_simulation`:

```json
POST /_index_template/_simulate/template_for_simulation
```
{% include copy-curl.html %}

Expected result:

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

### Simulate template on a specific index name

Simulating template on a specific index name is particularly useful for resolving conflicts or debugging priority issues among templates.
The following command demonstrates how all applicable templates, with overlapping index patterns, would apply to an index named `"logs-sim-1"`.

```json
POST /_index_template/_simulate_index/logs-sim-1
```
{% include copy-curl.html %}

Expected result:

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
