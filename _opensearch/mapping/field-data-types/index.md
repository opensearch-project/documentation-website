---
layout: default
title: Field data types
parent: Mapping
has_children: true
---
# Field data types
Each field has a _field data type_, or _field type_. This type indicates the kind of data the field contains, such as strings or boolean values, and its intended use. For example, you can index strings to both `text` and `keyword` fields. However, `text` field values are analyzed for full-text search while `keyword` strings are left as-is for filtering and sorting.

Field types are grouped by _family_. Types in the same family support the same search functionality but may have different space usage or performance characteristics.

Currently, the only type family is `keyword`, which consists of the `keyword`, `constant_keyword`, and `wildcard` field types. Other type families have only a single field type. For example, the `boolean` type family consists of one field type: `boolean`.

## Common types
* **binary** - Binary value encoded as a Base64 string.
* **boolean** - `true` and `false` values.
* **Keywords** - The keyword family, including `keyword`, `constant_keyword`, and `wildcard`.
* **Numbers** - Numeric types, such as `long` and `double`, used to express amounts.
* **Dates** - Date types, including date and date_nanos.
* **alias** - Defines an alias for an existing field.

## Objects and relational types
* **object** - A JSON object.
* **flattened** - An entire JSON object as a single field value.
* **nested** - A JSON object that preserves the relationship between its subfields.
* **join** - Defines a parent/child relationship for documents in the same index.

## Structured data types
* **Range** - Range types, such as long_range, double_range, date_range, and ip_range.
* **ip** - IPv4 and IPv6 addresses.
* **version** - Software versions. Supports Semantic Versioning precedence rules.
* **murmur3** - Compute and stores hashes of values.

## Aggregate data types
* **aggregate_metric_double** - Pre-aggregated metric values.
* **histogram** - Pre-aggregated numerical values in the form of a histogram.

## Text search types
* **text** - Analyzed, unstructured text.
* **annotated-text** - Text containing special markup. Used for identifying named entities.
* **completion** - Used for auto-complete suggestions.
* **search_as_you_type** - text-like type for as-you-type completion.
* **token_count** - A count of tokens in a text.

## Document ranking types
* **dense_vector** - Records dense vectors of float values.
* **sparse_vector** - Records sparse vectors of float values.
* [rank_feature]({{site.url}}{{site.baseurl}}/opensearch/mapping/field-data-types/rank-feature-field-type/) - Records a numeric feature to boost hits at query time.
* [rank_features]({{site.url}}{{site.baseurl}}/opensearch/mapping/field-data-types/rank-features-field-type/) - Records numeric features to boost hits at query time.

## Spatial data types
* **geo_point** - Latitude and longitude points.
* **geo_shape** - Complex shapes, such as polygons.
* **point** - Arbitrary cartesian points.
* **shape** - Arbitrary cartesian geometries.

## Other types
* **percolator** - Indexes queries written in Query DSL.

## Arrays
In OpenSearch, arrays do not require a dedicated field data type. Any field can contain zero or more values by default, however, all values in the array must be of the same field type. See Arrays.

## Multi-fields
It is often useful to index the same field in different ways for different purposes. For instance, a string field could be mapped as a text field for full-text search, and as a keyword field for sorting or aggregations. Alternatively, you could index a text field with the standard analyzer, the english analyzer, and the french analyzer.

This is the purpose of multi-fields. Most field types support multi-fields via the fields parameter.

