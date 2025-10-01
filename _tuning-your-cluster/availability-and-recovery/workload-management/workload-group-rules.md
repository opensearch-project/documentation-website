---
layout: default
title: Workload group rules
nav_order: 30
parent: Workload management
grand_parent: Availability and recovery
redirect_from:
  - /tuning-your-cluster/availability-and-recovery/workload-management/create-workload-group-rules-api/
---

# Workload group rules

Workload group rules allow you to automatically assign workload group IDs to incoming queries. When a query matches the attributes specified in a rule, OpenSearch tags the query with the corresponding workload group ID. This eliminates the need for clients to manually include the workload group ID in each request. For more information about auto-tagging requests, see [Rule-based auto-tagging]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/rule-based-autotagging/autotagging/).

## Creating a rule

To create a rule for a workload group, provide the workload group ID in the `workload_group` parameter. The following request creates a rule that assigns the specified workload group to requests for the matching `index_pattern` and `principal.username`:

```json
PUT _rules/workload_group
{
  "description": "description for rule",
  "index_pattern": ["test*"],
  "principal": {
    "username": ["admin"]
  },
  "workload_group": "wfbdJoDAS0mYiLbEAjd1sA"
}
```
{% include copy-curl.html %}

The response contains the rule ID:

```json
{
  "id": "176fd554-43e7-39eb-92cc-56615d287eae",
  "description": "description for rule",
  "index_pattern": ["test*"],
  "principal": {
    "username": ["admin"]
  },
  "workload_group": "wfbdJoDAS0mYiLbEAjd1sA",
  "updated_at": "2025-08-06T15:12:44.791Z"
}
```

## Attributes

The `workload_group` feature type contains the following attributes. Each rule should contain as least one of the attributes below.
The table lists the attributes in order of priority, from highest to lowest. The priority here is implicit and can't be modified by the user. 
When multiple rules match a single request, the rule with the higher-priority attributes is selected.

| Attribute            | Data type | Description                                                                                                                                                                                                                   |
|:---------------------|:----------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `principal.username` | List      | A list of strings used to specify the usernames that should be matched to this rule. This attribute can only be used when the domain enables security plugin and only support exact matching.                                 |
| `principal.role`     | List      | A list of strings used to specify the roles that should be matched to this rule. This attribute can only be used when the domain enables security plugin and only support exact matching.                                     |
| `index_pattern`      | List      | A list of strings used to specify the target indexes of incoming queries. Each string can be an exact index name or a prefix ending in `*` to support wildcard matching, for example, `logs*`.                                |

## Parameters

The `workload_group` feature type contains the following parameters.

| Parameter        | Data type | Description                                                                                             |
|:-----------------|:----------|:--------------------------------------------------------------------------------------------------------|
| attribute        | Object    | A rule should contain at least one attributes (`index_pattern`, `principal.username`, `principal.role`) |
| `description`    | String    | A description of the rule.                                                                              |
| `workload_group` | String    | The workload group ID to apply to the requests matching this rule.                                      |

## Updating a rule

To update a rule, provide its ID in the path parameter and the updated fields in the request body. When you update a rule, only the parameters you specify are changed; all others stay the same. The following request updates a rule description and index pattern for the rule with the ID `176fd554-43e7-39eb-92cc-56615d287eae`:

```json
PUT _rules/workload_group/176fd554-43e7-39eb-92cc-56615d287eae
{
  "description": "updated description for rule",
  "index_pattern": ["log*", "event*"]
}
```
{% include copy-curl.html %}

The response shows the updated fields:

```json
{
  "id": "176fd554-43e7-39eb-92cc-56615d287eae",
  "description": "updated description for rule",
  "index_pattern": [
    "log*",
    "event*"
  ],
  "workload_group": "wfbdJoDAS0mYiLbEAjd1sA",
  "updated_at": "2025-08-06T15:14:09.935879339Z"
}
```

## Retrieving a rule

You can retrieve rules by rule ID or attribute filters. You can paginate through the list of returned rules.

The following request retrieves all rules for the `workload_group` feature type:

```json
GET /_rules/workload_group
```
{% include copy-curl.html %}

The following request retrieves a rule by ID for the `workload_group` feature type:

```json
GET /_rules/workload_group/{rule_id}
```
{% include copy-curl.html %}

The following request retrieves all `workload_group` rules matching the specified `index_pattern` and `principal.username`:

```json
GET /_rules/workload_group?index_pattern=log*,event*&principal.username=admin
```
{% include copy-curl.html %}

If the response contains more results than can fit on a single page, OpenSearch paginates the results and includes a `search_after` value in the response:

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

To retrieve the next page, send another request to the same endpoint using the same filters and include the `search_after` value from the previous response as a query parameter.

The following request provides the next page of rules from the same workload group:

```json
GET /_rules/workload_group?index_pattern=log*,event*&search_after=z1MJApUB0zgMcDmz-UQq
```
{% include copy-curl.html %}

## Deleting a rule

To delete a rule, provide the rule's ID:

```json
DELETE /_rules/workload_group/{rule_id}
```
{% include copy-curl.html %}

