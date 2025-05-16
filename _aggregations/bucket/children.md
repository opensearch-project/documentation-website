---
layout: default
title: Children
parent: Bucket aggregations
nav_order: 15
redirect_from:
  - /query-dsl/aggregations/bucket/children/
---

# Children

The `children` aggregation is a bucket aggregation that creates one bucket of child documents based on parent-child relationships defined in your documents. 

The `children` aggregation works with the [join field type]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/join/) to aggregate child documents that are associated with parent documents.

The `children` aggregation provides inverse functionality to the [parent aggregation]({{site.url}}{{site.baseurl}}/aggregations/bucket/parent/). The parent aggregation identifies parent documents based on matching child documents; the children aggregation identifies child documents based on matching parent documents.


## Parameters

The `children` aggregation takes the following parameters:

| Parameter             | Required/Optional | Data type       | Description |
| :--                   | :--               | :--             | :--         |
| `type`                | Required          | String          | The name of the child type from the join field. This identifies the parent-child relationship to use. |


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

## Example: children relationship

The following example queries all the departments and then filters for the one named `Accounting`. It then uses the `children` aggregation to select the two documents that have a child relationship with the `Accounting` department. Finally, the `avg` sub-aggregation returns the average of the Accounting employees' salaries:

```json
GET /company/_search
{
  "size": 0,
  "query": {
    "bool": {
      "filter": [
        {
          "term": {
            "join_field": "department"
          }
        },
        {
          "term": {
            "department_name": "Accounting"
          }
        }
      ]
    }
  },
  "aggs": {
    "acc_employees": {
      "children": {
        "type": "employee"
      },
      "aggs": {
        "avg_salary": {
          "avg": {
            "field": "salary"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}


## Example result: children relationship

The result returns the selected department bucket, finds the `employee` type children of the department, and computes the `avg` of their salaries:

```json
{
  "took": 379,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "acc_employees": {
      "doc_count": 2,
      "avg_salary": {
        "value": 110000
      }
    }
  }
}
```