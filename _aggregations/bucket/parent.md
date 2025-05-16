---
layout: default
title: Parent
parent: Bucket aggregations
nav_order: 145
redirect_from:
  - /query-dsl/aggregations/bucket/parent/
---

# Parent aggregations

The `parent` aggregation is a bucket aggregation that creates one bucket of parent documents based on parent-child relationships defined in your documents. This aggregation enables you to perform analytics operations across parent documents that have the same matching child documents, allowing for powerful hierarchical data analysis.

The `parent` aggregation works with the [`join` field type]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/join/), which establishes parent-child relationships within documents in the same index.

The `parent` aggregation provides inverse functionality to the [children aggregation]({{site.url}}{{site.baseurl}}/aggregations/bucket/children/). The children aggregation identifies child documents based on matching parent documents; the parent aggregation identifies parent documents based on matching child documents.


## Parameters

The `parent` aggregation takes the following parameters:

| Parameter             | Required/Optional | Data type       | Description |
| :--                   | :--               |  :--            | :--         |
| `type`                | Required          | String          | The name of the child type from the `join` field. |

## Example

The following example builds a small company database with three employees. The employee records each have a child `join` relationship with a parent department record.

### Example: mappings

First, this `PUT` request creates a `company` index with a `join` field that maps departments (parents) to employees (children):

```json
PUT /company
{
  "mappings": {
    "properties": {
      "join_field": {
        "type": "join",
        "relations": {
          "department": "employee"
        }
      },
      "department_name": {
        "type": "keyword"
      },
      "employee_name": {
        "type": "keyword"
      },
      "salary": {
        "type": "double"
      },
      "hire_date": {
        "type": "date"
      }
    }
  }
}
```
{% include copy-curl.html %}

### Example: data

Next, this bulk `POST` request populates the data with three departments and three employees. The parent-child assignments are:

| Department (parent) | Employees (children) |
| :-- | :-- |
| `Accounting` | `Abel Anderson`, `Betty Billings` |
| `Engineering` | `Carl Carter` |
| `HR` | none |

```json
POST _bulk?routing=1
{ "create": { "_index": "company", "_id": "1" } }
{ "type": "department", "department_name": "Accounting", "join_field": "department" }
{ "create": { "_index": "company", "_id": "2" } }
{ "type": "department", "department_name": "Engineering", "join_field": "department" }
{ "create": { "_index": "company", "_id": "3" } }
{ "type": "department", "department_name": "HR", "join_field": "department" }
{ "create": { "_index": "company", "_id": "4" } }
{ "type": "employee", "employee_name": "Abel Anderson", "salary": 120000, "hire_date": "2024-04-04", "join_field": { "name": "employee",  "parent": "1" } }
{ "create": { "_index": "company", "_id": "5" } }
{ "type": "employee", "employee_name": "Betty Billings", "salary": 140000, "hire_date": "2023-05-05", "join_field": { "name": "employee",  "parent": "1" } }
{ "create": { "_index": "company", "_id": "6" } }
{ "type": "employee", "employee_name": "Carl Carter", "salary": 140000, "hire_date": "2020-06-06",  "join_field": { "name": "employee",  "parent": "2" } }
```
{% include copy-curl.html %}


## Example: parent relationship

The following example aggregates all the departments that have a parent relationship with one or more employees:

```json
GET /company/_search
{
  "size": 0,
  "aggs": {
    "all_departments": {
      "parent": {
        "type": "employee"
      },
      "aggs": {
        "departments": {
          "terms": {
            "field": "department_name"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example result: parent relationship

The `all_departments` parent aggregation returns all the departments with employee children documents. Note that the HR department is not represented:

```json
{
  "took": 3,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 6,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "all_departments": {
      "doc_count": 2,
      "departments": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 0,
        "buckets": [
          {
            "key": "Accounting",
            "doc_count": 1
          },
          {
            "key": "Engineering",
            "doc_count": 1
          }
        ]
      }
    }
  }
}
```