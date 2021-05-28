---
layout: default
title: Index templates
nav_order: 14
---

# Index templates

Index templates let you initialize new indices with predefined mappings and settings. For example, if you continuously index log data, you can define an index template so that all of these indices have the same number of shards and replicas.

---

#### Table of contents
1. TOC
{:toc}


---

## Create a template

To create an index template, use a POST request:

```json
POST _index_template
```

This command creates a template named `daily_logs` and applies it to any new index whose name matches the regular expression `logs-2020-01-*` and also adds it to the `my_logs` alias:

```json
PUT _index_template/daily_logs
{
  "index_patterns": [
    "logs-2020-01-*"
  ],
  "template": {
    "aliases": {
      "my_logs": {}
    },
    "settings": {
      "number_of_shards": 2,
      "number_of_replicas": 1
    },
    "mappings": {
      "properties": {
        "timestamp": {
          "type": "date",
          "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"
        },
        "value": {
          "type": "double"
        }
      }
    }
  }
}
```

You should see the following response:

```json
{
  "acknowledged": true
}
```

If you create an index named `logs-2020-01-01`, you can see that it has the mappings and settings from the template:

```json
PUT logs-2020-01-01
GET logs-2020-01-01
```

```json
{
  "logs-2020-01-01": {
    "aliases": {
      "my_logs": {}
    },
    "mappings": {
      "properties": {
        "timestamp": {
          "type": "date",
          "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"
        },
        "value": {
          "type": "double"
        }
      }
    },
    "settings": {
      "index": {
        "creation_date": "1578107970779",
        "number_of_shards": "2",
        "number_of_replicas": "1",
        "uuid": "U1vMDMOHSAuS2IzPcPHpOA",
        "version": {
          "created": "7010199"
        },
        "provided_name": "logs-2020-01-01"
      }
    }
  }
}
```

Any additional indices that match this pattern---`logs-2020-01-02`, `logs-2020-01-03`, and so on---will inherit the same mappings and settings.

## Retrieve a template

To list all index templates:

```json
GET _cat/templates
```

To find a template by its name:

```json
GET _index_template/daily_logs
```

To get a list of all your templates:

```json
GET _index_template/daily_logs
```

To get a list of all templates that match a pattern:

```json
GET _index_template/daily*
```

To check if a specific template exists:

```json
HEAD _index_template/<name>
```

## Configure multiple templates

You can create multiple index templates for your indices. If the index name matches more than one template, OpenSearch merges all mappings and settings from all matching templates and applies them to the index.

The settings from the more recently created index templates override the settings of older index templates. So, you can first define a few common settings in a generic template that can act as a catch-all and then add more specialized settings as required.

An even better approach is to explicitly specify template priority using the `order` parameter. OpenSearch applies templates with lower priority numbers first and then overrides them with templates with higher priority numbers.

For example, say you have the following two templates that both match the `logs-2020-01-02` index and there’s a conflict in the `number_of_shards` field:

#### Template 1

```json
PUT _index_template/template-01
{
  "index_patterns": [
    "logs*"
  ],
  "priority": 0,
  "template": {
    "settings": {
      "number_of_shards": 2
    }
  }
}
```

#### Template 2

```json
PUT _index_template/template-02
{
  "index_patterns": [
    "logs-2020-01-*"
  ],
  "priority": 1,
  "template": {
    "settings": {
      "number_of_shards": 3
    }
  }
}
```

Because `template-02` has a higher `priority` value, it takes precedence over `template-01` . The `logs-2020-01-02` index would have the `number_of_shards` value as 3.

## Delete a template

You can delete an index template using its name:

```json
DELETE _index_template/daily_logs
```

## Index template options

You can specify the following template options:

Option | Type | Description | Required
:--- | :--- | :--- | :---
`priority` | `Number` | The priority of the index template.  | No
`create` | `Boolean` | Whether this index template should replace an existing one. | No
