---
layout: default
title: Create workload group rules
nav_order: 20
parent: Workload management
grand_parent: Availability and recovery
---

# Create workload group rules

The Create Workload Group Rules API for the `workload_group` feature type allows you to define, update, retrieve, and delete rules that automatically assign workload group IDs to incoming queries. When a query matches the attributes specified in a rule, OpenSearch tags the query with the corresponding workload group ID. This eliminates the need for clients to manually include the workload group ID in each request.


## Supported attributes

The following table lists the attributes supported by the `workload_group` feature type.

| Attribute  | Data type | Description  |
| :--- | :--- | :--- |
| `index_pattern` | List      | A list of strings used to match the target indexes of incoming queries. Each string can be an exact index name or a prefix ending in `*` to support wildcard matching, for example, `logs*`. |


## Example requests

The following example demonstrates how to use the Create Workload Group Rules API to create a rule for the `workload_group` feature type.

### Create a rule

The following request creates a rule that assigns a `workload_group` value when the `index_pattern` attribute matches:

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

The following request updates a rule with the ID `0A6RULxkQ9yLqn4r8LPrIg`:

```json
PUT _rules/workload_group/0A6RULxkQ9yLqn4r8LPrIg
{
  "description": "updated_description for rule",
  "index_pattern": ["log*"],
  "workload_group": "EITBzjFkQ6CA-semNWGtRQ"
}
```
{% include copy-curl.html %}

You can't change the `feature_type`. You can omit any fields that you don't want to update.
{: .note }

### Get a rule

You can retrieve rules created using the Create Workload Group Rules API by rule ID, by attribute filters, or by using pagination.

The following request retrieves a rule by ID for the `workload_group` feature type:

```json
GET /_rules/workload_group/{id}
```
{% include copy-curl.html %}

The following request retrieves all rules for the `workload_group` feature type:

```json
GET /_rules/workload_group
```
{% include copy-curl.html %}

The following request retrieves all rules for the `workload_group` feature type where the `index_pattern` attribute matches `a` or `b`:

```json
GET /_rules/workload_group?index_pattern=a,b
```
{% include copy-curl.html %}

If the response contains more results than can fit on a single page, OpenSearch paginates the results and includes a `search_after` value in the response.
To retrieve the next page, send another request to the same endpoint using the same filters and include the `search_after` value from the previous response as a query parameter.

The following request provides the next page of rules from the same workload group:

```json
"GET /_rules/workload_group?index_pattern=a,b&search_after=z1MJApUB0zgMcDmz-UQq"
```
{% include copy-curl.html %}

### Delete a rule

The following request deletes a rule with the specified id.

```json
DELETE /_rules/workload_group/{id}
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
  "id": "wi6VApYBoX5wstmtU_8l",
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
      "id": "z1MJApUB0zgMcDmz-UQq",
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


<details markdown="block"> 
  <summary> 
    Response: Delete rules 
  </summary> 
  {: .text-delta }

```json
{ "acknowledged": true }
```

</details>

