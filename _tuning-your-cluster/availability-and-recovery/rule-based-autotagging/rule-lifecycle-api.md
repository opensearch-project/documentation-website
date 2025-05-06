---
layout: default
title: Rule Lifecycle API
nav_order: 20
parent: Rule based autotagging
grand_parent: Availability and recovery
---

# Rule Lifecycle API

The Rule Lifecycle API allows you to create, update, retrieve, and delete rules. Each rule is associated with a specific feature type and contains a feature value and at least one attribute.
These rules are designed to automatically assign feature values to incoming queries based on the specified attributes, helping to categorize and manage queries automatically.

## Endpoints

The following sections describe the API endpoints available for managing rules across different feature types.

### Create a rule

Use the followiing endpoint to add a new rule for a specific feature type:

```json
PUT /_rules/{feature_type}
POST /_rules/{feature_type}
```

### Update a rule

Use the following endpoint to modify an existing rule by specifying both the feature type and rule ID in the path parameters:

```json
PUT /_rules/{feature_type}/{_id}
POST /_rules/{feature_type}/{_id}
```

### Get a rule

Use the following endpoint to retrieve either a specific rule by ID or list all rules for a feature type:

```json
GET /_rules/{feature_type}/{_id}
GET /_rules/{feature_type}
```

### Delete a rule

Use the following endpoint to remove a rule by specifying both the feature type and rule ID:

```json
DELETE /_rules/{feature_type}/{_id}
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description  |
| :--- | :--- | :--- |
| `feature_type` | String    | The category of the rule that defines the type of feature, such as `workload_group`. |
| `_id`          | String    | The unique identifier for the rule. Required for `UPDATE`, `GET`, and `DELETE` operations. |

## Query parameters

The following table lists the available query parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `search_after` | String | The token used to retrieve the next page of results for pagination. |
| `<attribute_key>` | String | Filters results to rules where `<attribute_key>` matches one of the specified values. |

## Request body fields

The following table lists the fields available in the request body.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `description` | String | The human-readable explanation or purpose of the rule. |
| `<attribute_key>` | Array | A list of attribute values that must match the query in order for the rule to apply. |
| `<feature_type>` | String | The feature value assigned when the rule matches. |


## Example requests

The following example demonstrates how to use the Rule Lifecycle API to create a rule.

### Create a rule

The following request creates a rule that assigns a `workload_group` value based on matching `index_pattern` attributes:

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

The following request updates a rule with ID `0A6RULxkQ9yLqn4r8LPrIg`:

```json
PUT _rules/workload_group/0A6RULxkQ9yLqn4r8LPrIg
{
  "description": "updated_description for rule",
  "index_pattern": ["log*"],
  "workload_group": "EITBzjFkQ6CA-semNWGtRQ"
}
```
{% include copy-curl.html %}

You can't change the `feature_type`. Fields that are not updated can be omitted.
{: .note }

### Get a rule

The following request retrieves a rule by ID:

```json
GET /_rules/{feature_type}/{_id}
```
{% include copy-curl.html %}

The following request retrieves all rules for a feature type:

```json
GET /_rules/{feature_type}
```
{% include copy-curl.html %}

The following request returns all rules of the feature type `workload_group` that contain the attribute `index_pattern` with values `a` or `b`:

```json
GET /_rules/workload_group?index_pattern=a,b
```
{% include copy-curl.html %}

If a `GET` request returns more results than can be included in a single response, the system paginates the results and includes a `search_after` field in the response.  
To retrieve the next page, send another request to the same endpoint using the same filters and include the `search_after` value from the previous response as a query parameter.

The following example continues the search for all rules of the `workload_group` feature type where the `index_pattern` attribute contains the values `a` or `b`:

```json
"GET /_rules/workload_group?index_pattern=a,b&search_after=z1MJApUB0zgMcDmz-UQq"
```
{% include copy-curl.html %}

## Example responses

<details open markdown="block"> 
  <summary> 
    Response: Create or update rule 
  </summary> 
  {: .text-delta }

```json
{
  "_id": "wi6VApYBoX5wstmtU_8l",
  "description": "description for rule",
  "index_pattern": ["log*", "event*"],
  "workload_group": "EITBzjFkQ6CA-semNWGtRQ",
  "updated_at": "2025-04-04T20:54:22.406Z"
}
```

</details>


<details markdown="block"> 
  <summary> 
    Response: Get rules 
  </summary> 
  {: .text-delta }

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

If the `search_after` field is present in the response, more results are available.  
To retrieve the next page, include the `search_after` value in the next `GET` request as a query parameter, such as `GET /_rules/{feature_type}?search_after=z1MJApUB0zgMcDmz-UQq`.

</details>


## Response body fields

| Field | Data type | Description |
| :--- | :--- | :--- |
| `_id` | String | The unique identifier for the rule. |
| `description` | String | The explanation or purpose of the rule. |
| `updated_at` | String | The timestamp of the most recent update to the rule in UTC format. |
| `<attribute_key>` | Array | The attribute values used to match incoming queries. |
| `<feature_type>` | String | The value assigned to the feature type if the rule matches. |
| `search_after` | Array | The token for paginating additional results. Present only if more results exist. |
                                                                                                                                                                                                            
