---
layout: default
title: Rule lifecycle API for workload group
nav_order: 20
parent: Workload management
grand_parent: Availability and recovery
---

# Rule lifecycle API for workload group

The Rule Lifecycle API for the `workload_group` feature type enables users to define, update, retrieve, and delete rules that automatically assign workload group IDs to incoming queries.
When a query matches the attributes defined in a rule, OpenSearch automatically tags it with the corresponding workload group ID. This removes the need for clients to explicitly include the workload group in each request.

For the detailed description regarding the rule-based autotagging API usage, please refer to [this page]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/rule-based-autotagging/rule-lifecycle-api/).

## Supporting attributes

For the `workload_group` feature type, the following tables shows the supporting attributes

| Attribute       | Data type | Description                                                                                                                                                                          |
|:----------------|:----------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `index_pattern` | List      | A list of string used to match the target indices of incoming queries. Each string can be an exact index name or a prefix ending with * to support wildcard matching (e.g., "logs*") |


## Example requests

The following example demonstrates how to use the Rule Lifecycle API to create a rule for the `workload_group` feature type.

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

The following request retrieves a rule by ID under the feature type `workload_group`:

```json
GET /_rules/workload_group/{_id}
```
{% include copy-curl.html %}

The following request retrieves all rules for the feature type `workload_group`:

```json
GET /_rules/workload_group
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
