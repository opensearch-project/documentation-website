---
layout: default
title: lookup
parent: Commands
grand_parent: PPL
nav_order: 27
---

<!-- vale off -->

# lookup command

<!-- vale on -->

The `lookup` command enriches search results with fields from a second index, referred to as a _lookup index_ or _dimension table_. For each row in the search results, the `lookup` command finds the matching row in the lookup index and copies fields from that row into the result.

The `lookup` command functions like a left join: every row in the search results is kept, and matched fields from the lookup index are added or overwritten. If a row has no match, `replace` sets the copied fields to `null`, and `append` keeps any existing values. Compared with the `join` command, `lookup` is simpler and better suited for adding static reference data, such as region names, user departments, or product categories, to search results.

## Syntax

The `lookup` command has the following syntax:

```sql
lookup <lookupIndex> (<lookupMappingField> [as <sourceMappingField>])... [(replace | append | output) (<inputField> [as <outputField>])...]
```

The following table describes example `lookup` commands.

| Command | Description |
| --- | --- |
| `source = table1 | lookup table2 id` | Matches `table2.id` to `table1.id` and copies all other fields from `table2`. |
| `source = table1 | lookup table2 id, name` | Matches on both `id` and `name`. |
| `source = table1 | lookup table2 id as cid` | Matches `table2.id` to `table1.cid`. |
| `source = table1 | lookup table2 id as cid replace dept as department` | Matches `table2.id` to `table1.cid` and copies `table2.dept` into the `department` field, overwriting existing values. |
| `source = table1 | lookup table2 id as cid append dept as department` | Matches `table2.id` to `table1.cid` and copies `table2.dept` into the `department` field only where `department` is `null` or missing. |

## Parameters

The `lookup` command supports the following parameters.

| Parameter | Required/Optional | Description |
| --- | --- | --- |
| `<lookupIndex>` | Required | The lookup index (dimension table) from which to copy fields. |
| `<lookupMappingField>` | Required | A field in the lookup index used for matching. If you do not specify `<sourceMappingField>`, the search results must contain a field with the same name. Specify multiple fields as a comma-separated list. A row matches only when all of the fields are equal. See [Matching rows by field](#matching-rows-by-field). |
| `<sourceMappingField>` | Optional | The field in the search results that is matched against `<lookupMappingField>`. Default is the `<lookupMappingField>` name. See [Matching rows by field](#matching-rows-by-field). |
| `<inputField>` | Optional | A field in the lookup index whose matched value is copied into the search results. Specify multiple fields as a comma-separated list. If not specified, all fields in the lookup index except the match fields are copied. See [Selecting fields to copy](#selecting-fields-to-copy). |
| `<outputField>` | Optional | The name of the field in the search results into which the copied value is placed. Default is the `<inputField>` name. If the field does not exist, it is added to the search results. See [Selecting fields to copy](#selecting-fields-to-copy). |
| `(replace | append | output)` | Optional | Specifies how copied values are applied. `replace` overwrites existing values. `append` sets only values that are `null` or missing. `output` is a synonym for `replace`. Default is `replace`. See [Handling existing fields](#handling-existing-fields). |

## Matching rows by field

The `<lookupMappingField>` and `<sourceMappingField>` parameters use the format `<lookupMappingField> AS <sourceMappingField>`. The field to the left of `AS` is in the lookup index, and the field to the right of `AS` is in the search results.

For example, `lookup work_information uid AS id` matches each row in the search results whose `id` equals the `uid` of a row in `work_information`. If both indexes use the same field name, omit `AS`. For example, `lookup work_information id` matches `id` in the search results to `id` in the lookup index.

To match on multiple fields, specify them as a comma-separated list. A row matches only when all of the fields are equal. You can combine renamed and same-name fields in one list. For example, `lookup work_information uid AS id, name` matches when `uid` equals `id` and the `name` values are equal.

## Selecting fields to copy

The `<inputField>` and `<outputField>` parameters follow the match fields and use the format `<inputField> AS <outputField>`. The field to the left of `AS` is in the lookup index and supplies the value. The field to the right of `AS` is the name of the field in the search results. For example, `replace department AS dept` copies `department` from the lookup index into a field named `dept` in the search results.

If you omit `AS`, the field keeps its name from the lookup index. If you omit `<inputField>`, `lookup` copies all fields from the lookup index except the match fields.

## Handling existing fields

The `replace`, `append`, and `output` keywords specify the replacement strategy, which determines how a copied value is applied when the output field already exists in the result row. The following table compares the `replace` and `append` strategies.

| Keyword | If the output field has a value | If the output field is `null` or missing |
| --- | --- | --- |
| `replace` (default) | Overwrites the value with the value from the lookup index. If the row has no match, the value is overwritten with `null`. | Sets the value from the lookup index. |
| `append` | Keeps the existing value. | Sets the value from the lookup index. |

If the output field does not exist in the search results, both strategies add it. The `output` keyword is a synonym for `replace`.

## Examples

The following examples enrich a `worker` index using a `work_information` lookup index.

The `worker` index contains the following documents.

<!-- vale off -->

| id | name | occupation | country | salary |
| --- | --- | --- | --- | --- |
| 1000 | Jake | Engineer | England | 100000 |
| 1001 | Hello | Artist | USA | 70000 |
| 1002 | John | Doctor | Canada | 120000 |
| 1003 | David | Doctor | null | 120000 |
| 1004 | David | null | Canada | 0 |
| 1005 | Jane | Scientist | Canada | 90000 |

<!-- vale on -->

The `work_information` index contains the following documents. Its key field is `uid`, and it contains no rows for workers `1001` and `1004`.

<!-- vale off -->

| uid | name | department | occupation |
| --- | --- | --- | --- |
| 1000 | Jake | IT | Engineer |
| 1002 | John | DATA | Scientist |
| 1003 | David | HR | Doctor |
| 1005 | Jane | DATA | Engineer |
| 1006 | Tom | SALES | Artist |

<!-- vale on -->

### Example 1: Copying one field using differently named match fields

The following query matches each worker whose `id` equals a `uid` in `work_information` and copies `department` into the results. Because `worker` does not contain a `department` field, `replace` adds it. Rows without a match contain `null`:

```sql
source = worker
  | lookup work_information uid AS id REPLACE department
  | fields id, name, occupation, country, salary, department
  | sort id
```
{% include copy.html %}

The query returns the following results:

<!-- vale off -->

| id | name | occupation | country | salary | department |
| --- | --- | --- | --- | --- | --- |
| 1000 | Jake | Engineer | England | 100000 | IT |
| 1001 | Hello | Artist | USA | 70000 | null |
| 1002 | John | Doctor | Canada | 120000 | DATA |
| 1003 | David | Doctor | null | 120000 | HR |
| 1004 | David | null | Canada | 0 | null |
| 1005 | Jane | Scientist | Canada | 90000 | DATA |

<!-- vale on -->

### Example 2: Comparing replace and append for an existing field

The `replace` and `append` strategies produce different results only when the output field already contains values. The following queries copy `department` from the lookup index into the existing `country` field.

Using `replace`, the lookup value overwrites `country` in every matched row. In rows without a match, `country` is overwritten with `null`:

```sql
source = worker
  | lookup work_information uid AS id REPLACE department AS country
  | fields id, name, occupation, salary, country
  | sort id
```
{% include copy.html %}

The query returns the following results:

<!-- vale off -->

| id | name | occupation | salary | country |
| --- | --- | --- | --- | --- |
| 1000 | Jake | Engineer | 100000 | IT |
| 1001 | Hello | Artist | 70000 | null |
| 1002 | John | Doctor | 120000 | DATA |
| 1003 | David | Doctor | 120000 | HR |
| 1004 | David | null | 0 | null |
| 1005 | Jane | Scientist | 90000 | DATA |

<!-- vale on -->

Using `append`, existing `country` values are kept, and the lookup value is set only in rows in which `country` is `null`:

```sql
source = worker
  | lookup work_information uid AS id APPEND department AS country
  | fields id, name, occupation, salary, country
  | sort id
```
{% include copy.html %}

The query returns the following results:

<!-- vale off -->

| id | name | occupation | salary | country |
| --- | --- | --- | --- | --- |
| 1000 | Jake | Engineer | 100000 | England |
| 1001 | Hello | Artist | 70000 | USA |
| 1002 | John | Doctor | 120000 | Canada |
| 1003 | David | Doctor | 120000 | HR |
| 1004 | David | null | 0 | Canada |
| 1005 | Jane | Scientist | 90000 | Canada |

<!-- vale on -->

Only the row for worker `1003` changed: its `country` was `null`, so `append` set it to `HR`.

### Example 3: Copying all fields

If you omit `<inputField>`, `lookup` copies every field in the lookup index except the match fields. The following query matches on both `uid AS id` and `name`, so `department` and `occupation` are copied:

```sql
source = worker
  | lookup work_information uid AS id, name
  | fields id, name, occupation, country, salary, department
  | sort id
```
{% include copy.html %}

The query returns the following results:

<!-- vale off -->

| id | name | occupation | country | salary | department |
| --- | --- | --- | --- | --- | --- |
| 1000 | Jake | Engineer | England | 100000 | IT |
| 1001 | Hello | null | USA | 70000 | null |
| 1002 | John | Scientist | Canada | 120000 | DATA |
| 1003 | David | Doctor | null | 120000 | HR |
| 1004 | David | null | Canada | 0 | null |
| 1005 | Jane | Engineer | Canada | 90000 | DATA |

<!-- vale on -->

Because `worker` already contains an `occupation` field and the default strategy is `replace`, the `occupation` value from the lookup index overwrites it. For example, `Doctor` becomes `Scientist` for worker `1002`, and `Artist` becomes `null` for worker `1001`.

### Example 4: Copying a field into a new field

If the output field does not exist in the search results, `lookup` adds it and leaves the existing fields unchanged. The following query matches on `name` and copies `occupation` from the lookup index into a new `new_col` field:

```sql
source = worker
  | lookup work_information name REPLACE occupation AS new_col
  | fields id, name, occupation, country, salary, new_col
  | sort id
```
{% include copy.html %}

The query returns the following results:

<!-- vale off -->

| id | name | occupation | country | salary | new_col |
| --- | --- | --- | --- | --- | --- |
| 1000 | Jake | Engineer | England | 100000 | Engineer |
| 1001 | Hello | Artist | USA | 70000 | null |
| 1002 | John | Doctor | Canada | 120000 | Scientist |
| 1003 | David | Doctor | null | 120000 | Doctor |
| 1004 | David | null | Canada | 0 | Doctor |
| 1005 | Jane | Scientist | Canada | 90000 | Engineer |

<!-- vale on -->

Both rows for David (`1003` and `1004`) contain `Doctor` in `new_col` because both match the same lookup row by `name`.

### Example 5: Using the output keyword

The `output` keyword is a synonym for `replace`. The following query returns the same results as Example 1:

```sql
source = worker
  | lookup work_information uid AS id OUTPUT department
  | fields id, name, occupation, country, salary, department
  | sort id
```
{% include copy.html %}
