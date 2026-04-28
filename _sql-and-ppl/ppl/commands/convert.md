---
layout: default
title: convert
parent: Commands
grand_parent: PPL
nav_order: 10
---

# convert

The `convert` command uses conversion functions to transform field values into numeric values. Original field values are overwritten unless the `AS` clause is used to create new fields with the converted values.

The `convert` command has the following properties:

- All conversion functions return `null` if a value cannot be converted to a number.
- All numeric conversion functions return double-precision values to support aggregations.
- Converted values are displayed using decimal notation (for example, `1234.0` or `1234.56`).

Use the `AS` clause to preserve the original field while creating a converted field. You can apply multiple conversions within a single command (see [Example 4](#example-4-converting-multiple-fields)).

## Syntax

The `convert` command has the following syntax:

```sql
convert <convert-function>(<field>) [AS <field>] [, <convert-function>(<field>) [AS <field>]]...
```

## Parameters

The `convert` command supports the following parameters.

| Parameter | Required/Optional | Description |
| --- | --- | --- |
| `<convert-function>` | Required | One of the conversion functions: `auto()`, `num()`, `rmcomma()`, `rmunit()`, `memk()`, or `none()`. |
| `<field>` | Required | A single field name to convert. |
| `AS <field>` | Optional | Creates a new field using the converted value and preserves the original field. |

## Conversion Functions

| Function | Description |
| --- | --- |
| `auto(field)` | Automatically converts fields to numbers using intelligent conversion. Supports units, including memory unit prefixes such as `k`, `m`, or `g`, commas, and scientific notation. Returns `null` for non-convertible values. |
| `num(field)` | Extracts leading numeric portion of a string. For strings without letters, commas are interpreted as thousands separators and removed. For strings containing letters, extraction stops at the first occurrence of a letter or comma. Returns `null` for non-convertible values. |
| `rmcomma(field)` | Removes commas (thousands separators) from numeric strings and converts the result to a number. Returns `null` if the value contains letters. |
| `rmunit(field)` | Extracts the leading numeric portion of a string. Stops at the first letter or comma. Returns `null` for non-convertible values. |
| `memk(field)` | Converts values containing memory unit suffixes to kilobytes. Accepts numbers containing optional unit suffixes such as `k`, `m`, or `g` (case insensitive). If the input is a numeric string with no unit suffix, the value is assumed to be in kilobytes. Returns `null` for invalid formats. |
| `none(field)` | A no-op function that preserves the original field value. Used for excluding specific fields from wildcard conversions. |

## Example 1: Converting a field automatically

The following query converts the `balance` field to a number using the `auto()` function:

```sql
source=accounts
| convert auto(balance)
| fields account_number, balance
| head 3
```
{% include copy.html %}

The query returns the following results:

| account_number | balance |
| --- | --- |
| 1 | 39225.0 |
| 6 | 5686.0 |
| 13 | 32838.0 |

## Example 2: Converting a field containing commas

The following query converts a field containing comma-separated numbers:

```sql
source=accounts
| eval price='1,234'
| convert num(price)
| fields price
```
{% include copy.html %}

The query returns the following results:

| price |
| --- |
| 1234.0 |

## Example 3: Converting a field containing memory units

The following query converts memory size strings to kilobytes:

```sql
source=system_metrics
| eval memory='100m'
| convert memk(memory)
| fields memory
```
{% include copy.html %}

The query returns the following results:

| memory |
| --- |
| 102400.0 |

## Example 4: Converting multiple fields

The following query converts multiple fields using different conversion functions:

```sql
source=accounts
| convert auto(balance), num(age)
| fields account_number, balance, age
| head 3
```
{% include copy.html %}

The query returns the following results:

| account_number | balance | age |
| --- | --- | --- |
| 1 | 39225.0 | 32.0 |
| 6 | 5686.0 | 36.0 |
| 13 | 32838.0 | 28.0 |

## Example 5: Using an AS clause to preserve original values

The following query creates a new field that contains the converted value while preserving the original field:

```sql
source=accounts
| convert auto(balance) AS balance_num
| fields account_number, balance, balance_num
| head 3
```
{% include copy.html %}

The query returns the following results:

| account_number | balance | balance_num |
| --- | --- | --- |
| 1 | 39225 | 39225.0 |
| 6 | 5686 | 5686.0 |
| 13 | 32838 | 32838.0 |

## Example 6: Extracting numbers from strings containing units

The following query extracts numeric values from strings containing units:

```sql
source=accounts
| head 1
| eval duration='2.000 sec'
| convert rmunit(duration)
| fields duration
```
{% include copy.html %}

The query returns the following results:

| duration |
| --- |
| 2.0 |

## Example 7: Using aggregation functions

The following query converts values and uses them in aggregations:

```sql
source=accounts
| convert auto(age)
| stats sum(age) by gender
```
{% include copy.html %}

The query returns the following results:

| sum(age) | gender |
| --- | --- |
| 28.0 | F |
| 101.0 | M |

## Example 8: Using none() to preserve field values

The `none()` function returns the unchanged field value. This is useful for explicitly preserving fields in multi-field conversions:

```sql
source=accounts
| convert auto(balance), num(age), none(account_number)
| fields account_number, balance, age
| head 3
```
{% include copy.html %}

The query returns the following results:

| account_number | balance | age |
| --- | --- | --- |
| 1 | 39225.0 | 32.0 |
| 6 | 5686.0 | 36.0 |
| 13 | 32838.0 | 28.0 |

### Using none() with an AS clause for field renaming

The `none()` function can be combined with the `AS` clause to rename a field without modifying its value:

```sql
source=accounts
| convert none(account_number) AS account_id
| fields account_id, firstname, lastname
| head 3
```
{% include copy.html %}

The query returns the following results:

| account_id | firstname | lastname |
| --- | --- | --- |
| 1 | Amber | Duke |
| 6 | Hattie | Bond |
| 13 | Nanette | Bates |

The `none()` function is useful with wildcard support, allowing you to exclude specific fields from bulk conversions.
{: .note}

## Limitations

The `convert` command requires `plugins.calcite.enabled` to be set to `true`.

If Apache Calcite is disabled, using any convert function results in an unsupported function error.