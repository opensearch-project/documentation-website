---
layout: default
title: Dynamic templates
nav_order: 105
has_children: false
has_toc: false
---

# Dynamic templates

Dynamic templates define the mappings that OpenSearch applies to new fields that it adds through [dynamic mapping]({{site.url}}{{site.baseurl}}/mappings/#dynamic-mapping). Without a template, OpenSearch assigns each new field a default type based on its JSON value, for example, `text` with a `keyword` subfield for strings and `long` for whole numbers. A dynamic template replaces these defaults for the fields it matches.

Use dynamic templates when you cannot list every field in advance but know how certain groups of fields should be mapped. For example, you can map all fields whose names end in `_id` as `keyword`, store whole numbers as `integer` to save space, or copy every field in an object to a single search field.

A template selects fields by one or more of the following criteria:

- The JSON data type that OpenSearch detects for the value, specified in `match_mapping_type`
- The field name, specified in `match` and `unmatch`
- The location of the field within the document, such as `address.city`, specified in `path_match` and `path_unmatch`

Dynamic templates apply only to fields that are not yet in the mapping. They do not change fields that are already mapped. If you set the [`dynamic`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/dynamic/) parameter to `strict_allow_templates` or `false_allow_templates`, OpenSearch adds new fields only when they match a dynamic template.

## Template structure

Define dynamic templates in the `dynamic_templates` array of an index mapping. Each array element is an object containing a single named template:

```json
"dynamic_templates": [
  {
    "<template_name>": {
      "match_mapping_type": "<detected_type>",
      "match": "<field_name_pattern>",
      "mapping": {
        "type": "<field_type>"
      }
    }
  }
]
```

You choose the template name. OpenSearch uses it to identify the template when it returns the mapping and when it reports errors, so choose a name that describes the fields the template targets.

## Dynamic template parameters

The following table lists the template parameters.

Parameter | Description
:--- | :---
`match_mapping_type` | The detected JSON data type to match. Use `*` to match all types. For valid values, see [Matching data types](#matching-data-types).
`match` | A pattern that the field name must match. The pattern is applied to the field name only, not to the full path.
`unmatch` | A pattern that excludes field names selected by `match`.
`match_pattern` | Specifies how OpenSearch interprets the patterns in `match`, `unmatch`, `path_match`, and `path_unmatch`. Valid values are:<br> - `simple`: Patterns support the `*` wildcard. <br> - `regex`: Patterns are Java regular expressions. <br><br>Default is `simple`.
`path_match` | A pattern that the full dotted path to the field must match, for example, `address.*`.
`path_unmatch` | A pattern that excludes paths selected by `path_match`.
`mapping` | Required. The mapping to apply to matching fields. Can contain the `{name}` and `{dynamic_type}` [template variables](#template-variables).

## Dynamic template rules

Note the following rules for defining dynamic templates:

- Each template must contain at least one of `match_mapping_type`, `match`, or `path_match`. A template that contains only `unmatch` or `path_unmatch` is rejected.
- A template that contains an unrecognized parameter is rejected.
- OpenSearch checks templates in array order and applies the first template that matches a field. Place more specific templates before more general ones.
- OpenSearch adds a new field to the mapping the first time the field has a value. A field whose value is `null` or an empty array (`[]`) is not mapped, and no template is evaluated for it. If a template sets `null_value`, the setting has no effect on documents indexed before the field is first mapped.

OpenSearch checks the patterns in a template when you create or update the mapping, but it does not fully validate the contents of `mapping`. For example, a template that specifies a nonexistent field type is accepted, and OpenSearch writes a warning to the deprecation log. The template fails only when a matching field is indexed, at which point OpenSearch rejects the document. Templates that contain the `{name}` variable cannot be validated in advance because the field name is unknown. Test new templates by indexing a sample document before using them in production.
{: .note}

A template without `match_mapping_type` can receive values of any type, but its `mapping` might be valid for only some of them. OpenSearch accepts such a template if its mapping is valid for at least one detected type. For example, the following template omits `type`, so OpenSearch uses the detected type, and sets an `analyzer`, which only `text` fields accept:

```json
PUT /dt-no-type
{
  "mappings": {
    "dynamic_templates": [
      {
        "code_fields": {
          "match": "*_code",
          "mapping": {
            "analyzer": "simple"
          }
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}

A document containing `"country_code": "US"` is indexed, and `country_code` is mapped as `text` using the `simple` analyzer. A document containing `"zip_code": 97205` is rejected because a `long` field does not accept an analyzer. To apply the template only to string values, add `"match_mapping_type": "string"`.

## Updating dynamic templates

To change the templates of an existing index, send the complete `dynamic_templates` array using the [Create or Update Index Mappings API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/put-mapping/). The new array replaces all existing templates, so you can use this request to reorder or remove templates. To remove all templates, send an empty array. Fields that were already mapped by a previous template keep their mappings.

## Matching data types

The `match_mapping_type` parameter matches the data type that OpenSearch detects in the JSON value. Because JSON does not distinguish between integer sizes or floating-point precisions, OpenSearch detects the widest type. The following table lists the values that you can specify in `match_mapping_type`.

Value | Matches
:--- | :---
`string` | String values that are not detected as dates.
`long` | Numbers without a decimal part.
`double` | Numbers with a decimal part.
`boolean` | The values `true` and `false`.
`date` | Strings that match a format in `dynamic_date_formats`. Requires `date_detection` to be enabled, which is the default. For more information, see [Date detection]({{site.url}}{{site.baseurl}}/mappings/#date-detection).
`object` | JSON objects.
`binary` | Binary values. JSON cannot contain binary values, so this type applies only to binary content formats such as CBOR and SMILE.
`knn_vector` | Arrays of numbers that can be mapped as vectors. For more information, see [k-NN vector dynamic templates]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-vector/#dynamic-templates).
`*` | All data types.

The detected type does not determine the mapped type. For example, a template that matches `long` can map the field as `integer`, and a template that matches `string` can map the field as `long`.

### Example: Mapping whole numbers as integers

Create an index containing two templates. The first maps whole numbers as `integer` and the second maps strings as `text` with an `exact` keyword subfield:

```json
PUT /dt-orders
{
  "mappings": {
    "dynamic_templates": [
      {
        "whole_numbers": {
          "match_mapping_type": "long",
          "mapping": {
            "type": "integer"
          }
        }
      },
      {
        "strings_with_exact": {
          "match_mapping_type": "string",
          "mapping": {
            "type": "text",
            "fields": {
              "exact": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          }
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}

Index a document containing several types of values:

```json
PUT /dt-orders/_doc/1
{
  "item_count": 3,
  "customer_name": "Ana Rivera",
  "total": 42.5,
  "gift": true,
  "order_date": "2026-09-30",
  "empty_list": [],
  "note": null
}
```
{% include copy-curl.html %}

Retrieve the mapping:

```json
GET /dt-orders/_mapping
```
{% include copy-curl.html %}

In the response, `item_count` is mapped as `integer` and `customer_name` as `text` with an `exact` subfield. The `total`, `gift`, and `order_date` fields do not match a template, so they receive the default dynamic mappings. The `empty_list` and `note` fields are not added to the mapping because they contain no concrete value:

```json
{
  "dt-orders": {
    "mappings": {
      "dynamic_templates": [
        {
          "whole_numbers": {
            "match_mapping_type": "long",
            "mapping": {
              "type": "integer"
            }
          }
        },
        {
          "strings_with_exact": {
            "match_mapping_type": "string",
            "mapping": {
              "fields": {
                "exact": {
                  "ignore_above": 256,
                  "type": "keyword"
                }
              },
              "type": "text"
            }
          }
        }
      ],
      "properties": {
        "customer_name": {
          "type": "text",
          "fields": {
            "exact": {
              "type": "keyword",
              "ignore_above": 256
            }
          }
        },
        "gift": {
          "type": "boolean"
        },
        "item_count": {
          "type": "integer"
        },
        "order_date": {
          "type": "date"
        },
        "total": {
          "type": "float"
        }
      }
    }
  }
}
```

## Matching field names

The `match` parameter selects fields by name, and `unmatch` excludes fields from that selection. Both parameters are compared against the field name only. For example, `"match": "city"` matches both a top-level `city` field and a `store.city` field inside an object.

### Example: Mapping numeric strings by field name

Some sources send numbers as strings. Create an index that maps string fields whose names start with `reading_` as `double`, except for fields whose names end with `_label`:

```json
PUT /dt-sensor
{
  "mappings": {
    "dynamic_templates": [
      {
        "numeric_strings": {
          "match_mapping_type": "string",
          "match": "reading_*",
          "unmatch": "*_label",
          "mapping": {
            "type": "double"
          }
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}

Index a document containing both kinds of fields:

```json
PUT /dt-sensor/_doc/1
{
  "reading_temp": "21.7",
  "reading_label": "lobby"
}
```
{% include copy-curl.html %}

Retrieve the mapping:

```json
GET /dt-sensor/_mapping
```
{% include copy-curl.html %}

The `reading_temp` field is mapped as `double`. The `reading_label` field is excluded by `unmatch`, so it receives the default string mapping:

```json
{
  "dt-sensor": {
    "mappings": {
      ...
      "properties": {
        "reading_label": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword",
              "ignore_above": 256
            }
          }
        },
        "reading_temp": {
          "type": "double"
        }
      }
    }
  }
}
```

### Example: Matching field names using a regular expression

Set `match_pattern` to `regex` to write patterns as Java regular expressions. Create an index that maps only the fields `revenue_q1` through `revenue_q4` as `scaled_float`:

```json
PUT /dt-regex
{
  "mappings": {
    "dynamic_templates": [
      {
        "quarterly_revenue": {
          "match_pattern": "regex",
          "match": "^revenue_q[1-4]$",
          "mapping": {
            "type": "scaled_float",
            "scaling_factor": 100
          }
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}

Index a document containing three revenue fields:

```json
PUT /dt-regex/_doc/1
{
  "revenue_q1": 1250.75,
  "revenue_q5": 10.5,
  "revenue_total": 5000.1
}
```
{% include copy-curl.html %}

Retrieve the mapping:

```json
GET /dt-regex/_mapping
```
{% include copy-curl.html %}

Only `revenue_q1` matches the regular expression. The other two fields receive the default `float` mapping:

```json
{
  "dt-regex": {
    "mappings": {
      ...
      "properties": {
        "revenue_q1": {
          "type": "scaled_float",
          "scaling_factor": 100.0
        },
        "revenue_q5": {
          "type": "float"
        },
        "revenue_total": {
          "type": "float"
        }
      }
    }
  }
}
```

If a pattern is not a valid regular expression, OpenSearch rejects the mapping.

## Matching field paths

The `path_match` and `path_unmatch` parameters work like `match` and `unmatch` but compare the pattern against the names of all parent objects and the field, joined by periods. For example, the path of the `city` field in the `address` object is `address.city`. Use them to select fields inside a particular object.

### Example: Copying object fields to a single field

Create an index that maps every field in the `address` object as `text` and copies its value to a top-level `full_address` field. The `zip_code` field is excluded:

```json
PUT /dt-contacts
{
  "mappings": {
    "dynamic_templates": [
      {
        "address_lines": {
          "path_match": "address.*",
          "path_unmatch": "*.zip_code",
          "mapping": {
            "type": "text",
            "copy_to": "full_address"
          }
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}

Index a document containing an `address` object:

```json
PUT /dt-contacts/_doc/1?refresh=true
{
  "address": {
    "street": "221 Harbor Lane",
    "city": "Portland",
    "zip_code": "97205"
  }
}
```
{% include copy-curl.html %}

Retrieve the mapping:

```json
GET /dt-contacts/_mapping
```
{% include copy-curl.html %}

The `street` and `city` fields are mapped using the template, and `zip_code` receives the default string mapping. The `full_address` field does not appear in the document, so OpenSearch adds it to the mapping the first time a value is copied to it:

```json
{
  "dt-contacts": {
    "mappings": {
      ...
      "properties": {
        "address": {
          "properties": {
            "city": {
              "type": "text",
              "copy_to": [
                "full_address"
              ]
            },
            "street": {
              "type": "text",
              "copy_to": [
                "full_address"
              ]
            },
            "zip_code": {
              "type": "text",
              "fields": {
                "keyword": {
                  "type": "keyword",
                  "ignore_above": 256
                }
              }
            }
          }
        },
        "full_address": {
          "type": "text",
          "fields": {
            "keyword": {
              "type": "keyword",
              "ignore_above": 256
            }
          }
        }
      }
    }
  }
}
```

You can now search both address lines in a single query:

```json
GET /dt-contacts/_search
{
  "query": {
    "match": {
      "full_address": "harbor portland"
    }
  }
}
```
{% include copy-curl.html %}

The `path_match` pattern matches objects as well as leaf fields. In this example, `address.*` also matches an object nested in `address`, and OpenSearch tries to map the object as `text`. Index a document containing a `unit` object inside `address`:

```json
PUT /dt-contacts/_doc/2
{
  "address": {
    "street": "9 Elm Court",
    "unit": {
      "number": "4B",
      "floor": 2
    }
  }
}
```
{% include copy-curl.html %}

OpenSearch rejects the document because an object cannot be parsed as a `text` value. To keep the template from matching objects, add `"match_mapping_type": "string"`.

## Template variables

The `mapping` object can contain the following variables, which OpenSearch replaces when it applies the template to a field:

- `{name}`: The name of the field
- `{dynamic_type}`: The detected data type of the field, for example, `long` or `boolean`

### Example: Using field names and detected types in a mapping

Create an index containing two templates. The first maps each string field as `text` and uses the field name as the analyzer name. The second applies to all remaining fields, keeps the detected type, and disables doc values:

```json
PUT /dt-placeholders
{
  "mappings": {
    "dynamic_templates": [
      {
        "language_analyzers": {
          "match_mapping_type": "string",
          "match": "*",
          "mapping": {
            "type": "text",
            "analyzer": "{name}"
          }
        }
      },
      {
        "detected_type_without_doc_values": {
          "match_mapping_type": "*",
          "mapping": {
            "type": "{dynamic_type}",
            "doc_values": false
          }
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}

Index a document containing fields named after built-in [language analyzers]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/index/):

```json
PUT /dt-placeholders/_doc/1
{
  "english": "Running shoes for trail use",
  "french": "Chaussures de course",
  "views": 120
}
```
{% include copy-curl.html %}

Retrieve the mapping:

```json
GET /dt-placeholders/_mapping
```
{% include copy-curl.html %}

The `english` and `french` fields use the analyzers of the same name, and `views` is mapped as `long` with doc values disabled:

```json
{
  "dt-placeholders": {
    "mappings": {
      ...
      "properties": {
        "english": {
          "type": "text",
          "analyzer": "english"
        },
        "french": {
          "type": "text",
          "analyzer": "french"
        },
        "views": {
          "type": "long",
          "doc_values": false
        }
      }
    }
  }
}
```

Because the first template matches every string field, a string field whose name is not an analyzer name causes OpenSearch to reject the document. For example, a document containing a `description` field is rejected because no analyzer is named `description`.

## Common template patterns

The following examples show templates for common indexing requirements.

### Reducing index size for metrics

Metrics documents usually contain many numeric fields that are used in aggregations and dashboards but seldom appear in query filters. Mapping these fields with [`index`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/index-parameter/) set to `false` skips building the search index for them, which saves disk space and indexing time. Doc values are still written, so aggregations and sorting are unaffected. You can still query the fields because OpenSearch falls back to searching numeric doc values, but such queries run more slowly than queries on indexed fields:

```json
PUT /dt-metrics
{
  "mappings": {
    "dynamic_templates": [
      {
        "metric_counters": {
          "match_mapping_type": "long",
          "mapping": {
            "type": "long",
            "index": false
          }
        }
      },
      {
        "metric_gauges": {
          "match_mapping_type": "double",
          "mapping": {
            "type": "float",
            "index": false
          }
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}

The `metric_gauges` template uses `float`, the same type that dynamic mapping assigns to decimal numbers by default. A `float` takes 4 bytes per value compared to 8 bytes for a `double`, and its precision is sufficient for values such as load averages and percentages.

### Mapping identifier fields as keywords

Identifiers such as store numbers and order numbers are matched exactly and are never used in range queries or calculations, even when they are numeric. The following template maps every field whose name ends in `_id` as `keyword`, regardless of whether the value is a string or a number:

```json
PUT /dt-id-fields
{
  "mappings": {
    "dynamic_templates": [
      {
        "identifiers": {
          "match": "*_id",
          "mapping": {
            "type": "keyword"
          }
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}

A document containing `"store_id": 17` and `"order_id": "A-1001"` maps both fields as `keyword`. Without the template, `store_id` would be mapped as `long`. Because the template does not specify `match_mapping_type`, it also matches objects whose names end in `_id`. OpenSearch rejects a document containing such an object because an object cannot be mapped as `keyword`. If your documents contain such objects, define two templates containing the same `match` pattern, one with `"match_mapping_type": "string"` and one with `"match_mapping_type": "long"`. Objects then match neither template and are mapped as `object` fields.

### Mapping strings as keywords only

If you search string fields only for exact values and use them for filtering, sorting, and aggregations, you can skip full-text indexing by mapping them as `keyword` without a `text` field. A query must then match the complete indexed value, so a search for `Green` does not match the value `Forest Green`:

```json
PUT /dt-keyword-only
{
  "mappings": {
    "dynamic_templates": [
      {
        "exact_value_strings": {
          "match_mapping_type": "string",
          "mapping": {
            "type": "keyword"
          }
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}

### Mapping free-form objects as flat objects

When objects contain keys that vary from document to document, such as product attributes supplied by different sellers, each new key adds a field to the mapping and can lead to [mapping explosion]({{site.url}}{{site.baseurl}}/mappings/mapping-explosion/). The following template maps any object whose name ends in `_attributes` as a single [`flat_object`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/flat-object/) field. Other objects are mapped normally:

```json
PUT /dt-flat-attributes
{
  "mappings": {
    "dynamic_templates": [
      {
        "free_form_objects": {
          "match_mapping_type": "object",
          "match": "*_attributes",
          "mapping": {
            "type": "flat_object"
          }
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}

A `product_attributes` object is mapped as one `flat_object` field no matter how many keys it contains, and you can still query its subfields using dot notation, for example, `product_attributes.dimensions.width`.

### Disabling norms on string fields

[Norms]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/norms/) store field-length information that OpenSearch uses only for relevance scoring. For data such as log messages, where you filter and sort by other fields and do not rank results by score, disabling norms reduces index size. The following template maps strings as `text` without norms and keeps the `keyword` subfield that dynamic mapping adds by default:

```json
PUT /dt-no-norms
{
  "mappings": {
    "dynamic_templates": [
      {
        "unscored_text": {
          "match_mapping_type": "string",
          "mapping": {
            "type": "text",
            "norms": false,
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          }
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}
