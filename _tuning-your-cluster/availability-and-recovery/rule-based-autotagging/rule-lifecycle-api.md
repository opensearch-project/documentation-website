---
layout: default
title: Rule Lifecycle API
nav_order: 20
parent: Rule based autotagging
grand_parent: Availability and recovery
---

# Rule Lifecycle API

The Rule Lifecycle API allows you to create, update, retrieve, and delete rules.
Each rule is associated with a specific feature type and contains a feature value and at least one attribute.
These rules are designed to automatically assign feature values to incoming queries based on the specified attributes, helping to categorize and manage queries automatically.

## Endpoints

### Create a rule

```json
PUT /_rules/{feature_type}
POST /_rules/{feature_type}
```
### Update a rule

```json
PUT /_rules/{feature_type}/{_id}
POST /_rules/{feature_type}/{_id}
```

### Get a rule

```json
GET /_rules/{feature_type}/{_id}
GET /_rules/{feature_type}
```

### Delete a rule

```json
DELETE /_rules/{feature_type}/{_id}
```

## Example requests

The following example demonstrates how to use the Rule Lifecycle API to create a rule.

### Create a rule

```json
PUT _rules/{feature_type}
{
  "description": "description of the rule",
  "<attribute1>": ["value1", "value2", "..."],
  "<attribute2>": ["value1", "value2", "..."],
  "<feature_type_name>": "feature_value"
}
```
{% include copy-curl.html %}

In the example below, we create a rule for the feature type workload_group, which has one attribute named index_pattern. 
The rule resolves to the workload group with ID EITBzjFkQ6CA-semNWGtRQ.

```json
PUT _rules/workload_group
{
  "description": "description for rule",
  "index_pattern": ["log*", "event*"],
  "workload_group": "EITBzjFkQ6CA-semNWGtRQ"
}
```
{% include copy-curl.html %}

### Update a rule

The following example demonstrates how to use the Rule Lifecycle API to update a rule.

```json
PUT _rules/{feature_type}/{_id}
{
  "description": "updated description of the rule",
  "<attribute1>": ["updated_value1", "updated_value2", "..."],
  "<attribute2>": ["updated_value1", "updated_value2", "..."],
  "<feature_type_name>": "updated_feature_value"
}
```
{% include copy-curl.html %}

In the example below, we update a rule with _id 0A6RULxkQ9yLqn4r8LPrIg.
Note:
1. The feature type cannot be changed.
2. Fields that do not need to be updated can be omitted from the request body.

```json
PUT _rules/workload_group/0A6RULxkQ9yLqn4r8LPrIg
{
  "description": "updated_description for rule",
  "index_pattern": ["log*"],
  "workload_group": "EITBzjFkQ6CA-semNWGtRQ"
}
```
{% include copy-curl.html %}

### Get a rule
To get a single rule, use the endpoint:

```json
GET /_rules/{feature_type}/{_id}
```

To get all rules for a feature type, use the endpoint:
```json
GET /_rules/{feature_type}
```

To get all rules for a feature type with filtering based on attribute values, use the endpoint below.
This example returns all rules of the feature type 'workload_group' that contain the attribute index_pattern with values a or b.
```json
"GET /_rules/workload_group?index_pattern=a,b"
```

If the get request returns too many results to be included in one response, the system paginates the results and includes a `search_after` field in the response.
To get the next page of results, send another request using the same endpoint and filters, and add the search_after value from the previous response as a query parameter.

This example continues the search for all rules of the feature type 'workload_group' that contain the attribute index_pattern with values a or b.
```json
"GET /_rules/workload_group?index_pattern=a,b&search_after=z1MJApUB0zgMcDmz-UQq"
```

## Example responses

OpenSearch returns responses similar to the following.

### Create a rule

```json
{
  "_id": "wi6VApYBoX5wstmtU_8l",
  "description": "description for rule",
  "index_pattern": ["log*", "event*"],
  "workload_group": "EITBzjFkQ6CA-semNWGtRQ",
  "updated_at": "2025-04-04T20:54:22.406Z"
}
```

### Update a rule

```json
{
  "_id": "wi6VApYBoX5wstmtU_8l",
  "description": "updated description for rule",
  "index_pattern": ["log*"],
  "workload_group": "EITBzjFkQ6CA-semNWGtRQ",
  "updated_at": "2025-04-05T20:54:22.406Z"
}
```

### Get a rule

```json
{
  "rules": [
    {
      "_id": "z1MJApUB0zgMcDmz-UQq",
      "description": "Rule for tagging workload_group_id to index123",
      "index_pattern": ["index123"],
      "workload_group": "workload_group_id",
      "updated_at": "2025-02-14T01:19:22.589Z"
    },
    ...
  ],
  "search_after": ["z1MJApUB0zgMcDmz-UQq"]
}
```
If the `search_after` field is present in the response, it indicates that there are more results available; 
pass its value as a query parameter in the next GET request (`GET /_rules/{feature_type}/search_after=z1MJApUB0zgMcDmz-UQq`) to retrieve the next page of results.


## Fields description

| Field          | Description	                                                                                                                                                  |
|:---------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `feature_type` | The category of the rule that defines the type of feature it applies to (e.g., `workload_group`).                                                             |                                                                                                                                                                                                                                                                                            
| `_id`          | Rule id. Unique identifier of the rule                                                                                                                        |                                                                                                                                                                                                                                                                                               
| `description`  | A human-readable explanation or purpose of the rule.                                                                                                          |                                   
| `updated_at`   | Timestamp indicating when the rule was last modified.                                                                                                         |                                                                                                                                                                                                                 
| `search_after` | A token returned when there are more results available for pagination. Use it as a query parameter in the next request to retrieve the next page of results.  |
