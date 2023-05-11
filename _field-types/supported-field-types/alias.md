---
layout: default
title: Alias
nav_order: 10
has_children: false
parent: Supported field types
redirect_from:
  - /opensearch/supported-field-types/alias/
  - /field-types/alias/
---

# Alias field type

An alias field type creates another name for an existing field. You can use aliases in the[search](#using-aliases-in-search-api-operations) and [field capabilities](#using-aliases-in-field-capabilities-api-operations) API operations, with some [exceptions](#exceptions). To set up an [alias](#alias-field), you need to specify the [original field](#original-field) name in the `path` parameter.

## Example

```json
PUT movies 
{
  "mappings" : {
    "properties" : {
      "year" : {
        "type" : "date"
      },
      "release_date" : {
        "type" : "alias",
        "path" : "year"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Parameters

Parameter | Description 
:--- | :--- 
`path` | The full path to the original field, including all parent objects. For example, parent.child.field_name. Required.

## Alias field

Alias fields must obey the following rules:

- An alias field can only have one original field.
- In nested objects, the alias must have the same nesting level as the original field.

To change the field that the alias references, update the mappings. Note that aliases in any previously stored percolator queries will still reference the original field.
{: .note }

## Original field

The original field for an alias must obey the following rules:
- The original field must be created before the alias is created.
- The original field cannot be an object or another alias.

## Using aliases in search API operations

You can use aliases in the following read operations of the search API:
- Queries
- Sorts
- Aggregations
- `stored_fields`
- `docvalue_fields`
- Suggestions
- Highlights
- Scripts that access field values

## Using aliases in field capabilities API operations

To use an alias in the field capabilities API, specify it in the fields parameter.

```json
GET movies/_field_caps?fields=release_date
```
{% include copy-curl.html %}

## Exceptions

You cannot use aliases in the following situations:
- In write requests, such as update requests.
- In multi-fields or as a target of `copy_to`.
- As a _source parameter for filtering results.
- In APIs that take field names, such as term vectors.
- In `terms`, `more_like_this`, and `geo_shape` queries (aliases are not supported when retrieving documents).

## Wildcards

In search and field capabilities wildcard queries, both the original field and the alias are matched against the wildcard pattern. 

```json
GET movies/_field_caps?fields=release*
```
{% include copy-curl.html %}