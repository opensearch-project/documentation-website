---
layout: default
title: Index templates
nav_order: 6
redirect_from:
  - /opensearch/index-templates/
---

# Index templates

Index templates let you initialize new indexes with predefined mappings and settings. For example, if you continuously index log data, you can define an index template so that all of these indexes have the same number of shards and replicas.

### Create a template

To create an index template, use a PUT or POST request:

```json
PUT _index_template/<template name>
POST _index_template/<template name>
```

This command creates a template named `daily_logs` and applies it to any new index whose name matches the pattern `logs-2020-01-*` and also adds it to the `my_logs` alias:

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

Any additional indexes that match this pattern---`logs-2020-01-02`, `logs-2020-01-03`, and so on---will inherit the same mappings and settings.

Index patterns cannot contain any of the following characters: `:`, `"`, `+`, `/`, `\`, `|`, `?`, `#`, `>`, and `<`.

### Retrieve a template

To list all index templates:

```json
GET _cat/templates
GET /_index_template
```

To find a template by its name:

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

### Configure multiple templates

You can create multiple index templates for your indexes. If the index name matches more than one template, OpenSearch takes the mappings and settings from the template with the highest priority and applies it to the index.

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
      "number_of_shards": 2,
      "number_of_replicas": 2
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

Because `template-02` has a higher `priority` value, it takes precedence over `template-01` . The `logs-2020-01-02` index would have the `number_of_shards` value as 3 and the `number_of_replicas` as the default value 1.

### Delete a template

You can delete an index template using its name:

```json
DELETE _index_template/daily_logs
```

## Composable index templates

Managing multiple index templates has the following challenges:

- If you have duplication between index templates, storing these index templates results in a bigger cluster state.
- If you want to make a change across all your index templates, you have to manually make the change for each template.

You can use composable index templates to overcome these challenges. Composable index templates let you abstract common settings, mappings, and aliases into a reusable building block called a component template.

You can combine component templates to compose an index template.

Settings and mappings that you specify directly in the [create index]({{site.url}}{{site.baseurl}}/api-reference/index-apis/create-index/) request override any settings or mappings specified in an index template and its component templates.
{: .note }

### Create a component template

Let's define two component templates⁠---`component_template_1` and `component_template_2`:

#### Component template 1

```json
PUT _component_template/component_template_1
{
  "template": {
    "mappings": {
      "properties": {
        "@timestamp": {
          "type": "date"
        }
      }
    }
  }
}
```

#### Component template 2

```json
PUT _component_template/component_template_2
{
  "template": {
    "mappings": {
      "properties": {
        "ip_address": {
          "type": "ip"
        }
      }
    }
  }
}
```

### Use component templates to create an index template

When creating index templates, you need to include the component templates in a `composed_of` list.

OpenSearch applies the component templates in the order in which you specify them within the index template. The settings, mappings, and aliases that you specify inside the index template are applied last.

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
  },
  "priority": 200,
  "composed_of": [
    "component_template_1",
    "component_template_2"
  ],
  "version": 3,
  "_meta": {
    "description": "using component templates"
  }
}
```

If you create an index named `logs-2020-01-01`, you can see that it derives its mappings and settings from both the component templates:

```json
PUT logs-2020-01-01
GET logs-2020-01-01
```

#### Example response

```json
{
  "logs-2020-01-01": {
    "aliases": {
      "my_logs": {}
    },
    "mappings": {
      "properties": {
        "@timestamp": {
          "type": "date"
        },
        "ip_address": {
          "type": "ip"
        },
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
        "creation_date": "1625382479459",
        "number_of_shards": "2",
        "number_of_replicas": "1",
        "uuid": "rYUlpOXDSUSuZifQLPfa5A",
        "version": {
          "created": "7100299"
        },
        "provided_name": "logs-2020-01-01"
      }
    }
  }
}
```


## Index template options

You can specify the following template options:

Option | Type | Description | Required
:--- | :--- | :--- | :---
`template` | `Object` |  Specify index settings, mappings, and aliases. | No
`priority` | `Integer` | The priority of the index template.  | No
`composed_of` | `String array` |  The names of component templates applied on a new index together with the current template.  | No
`version` | `Integer` | Specify a version number to simplify template management. Default is `null`. | No
`_meta ` | `Object` | Specify meta information about the template. | No
