---
layout: default
title: "spath"
parent: "Commands"
grand_parent: "PPL"
nav_order: 37
---
# spath


The `spath` command extracts fields from structured text data. It currently allows selecting from JSON data with JSON paths.

## Syntax

Use the following syntax:

`spath input=<field> [output=<field>] [path=]<path>`
* `input`: mandatory. The field to scan for JSON data.  
* `output`: optional. The destination field that the data will be loaded to. **Default:** value of `path`.  
* `path`: mandatory. The path of the data to load for the object. For more information about path syntax, see [json_extract]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/functions/json#json_extract).  
  

## Note  

The `spath` command currently does not support pushdown behavior for extraction. It will be slow on large datasets. It's generally better to index fields needed for filtering directly instead of using `spath` to filter nested fields.

## Example 1: Simple field Extraction  

The simplest spath is to extract a single field. This example extracts `n` from the `doc` field of type `text`.
  
```sql
source=structured
| spath input=doc_n n
| fields doc_n n
```
{% include copy.html %}
  
Expected output:
  
| doc_n | n |
| --- | --- |
| {"n": 1} | 1 |
| {"n": 2} | 2 |
| {"n": 3} | 3 |
  

## Example 2: Lists and nesting  

The following example PPL query demonstrates more JSON path uses, like traversing nested fields and extracting list elements.
  
```sql
source=structured
| spath input=doc_list output=first_element list{0}
| spath input=doc_list output=all_elements list{}
| spath input=doc_list output=nested nest_out.nest_in
| fields doc_list first_element all_elements nested
```
{% include copy.html %}
  
Expected output:
  
| doc_list | first_element | all_elements | nested |
| --- | --- | --- | --- |
| {"list": [1, 2, 3, 4], "nest_out": {"nest_in": "a"}} | 1 | [1,2,3,4] | a |
| {"list": [], "nest_out": {"nest_in": "a"}} | null | [] | a |
| {"list": [5, 6], "nest_out": {"nest_in": "a"}} | 5 | [5,6] | a |
  

## Example 3: Sum of inner elements  

The following example PPL query shows how to use `spath` to extract an inner field and do statistics on it, using the docs from example 1. It also demonstrates that `spath` always returns strings for inner types.
  
```sql
source=structured
| spath input=doc_n n
| eval n=cast(n as int)
| stats sum(n)
| fields `sum(n)`
```
{% include copy.html %}
  
Expected output:
  
| sum(n) |
| --- |
| 6 |
  

## Example 4: Escaped paths  

`spath` can escape paths with strings to accept any path that `json_extract` does. This includes escaping complex field names as array components.
  
```sql
source=structured
| spath output=a input=doc_escape "['a fancy field name']"
| spath output=b input=doc_escape "['a.b.c']"
| fields a b
```
{% include copy.html %}
  
Expected output:
  
| a | b |
| --- | --- |
| true | 0 |
| true | 1 |
| false | 2 |
  