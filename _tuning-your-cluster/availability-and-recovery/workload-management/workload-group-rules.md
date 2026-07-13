---
layout: default
title: Workload group rules
nav_order: 25
parent: Workload management
grand_parent: Availability and recovery
redirect_from:
  - /tuning-your-cluster/availability-and-recovery/workload-management/create-workload-group-rules-api/
---

# Workload group rules

Workload group rules allow you to automatically assign workload group IDs to incoming queries. When a query matches the attributes specified in a rule, OpenSearch tags the query with the corresponding workload group ID. This eliminates the need for clients to manually include the workload group ID in each request. For more information about auto-tagging requests, see [Rule-based auto-tagging]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/rule-based-autotagging/autotagging/).

## Creating a rule

To create a rule for a workload group, provide the workload group ID in the `workload_group` parameter. The following example creates a rule that assigns the given workload group to requests matching both the `index_pattern` and `principal.username` attributes:

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

The `workload_group` feature type contains the following attributes. Each rule must contain at least one of these attributes.

The table lists the attributes in order of priority, from highest to lowest. This priority is predefined and cannot be changed by the user. When multiple rules match a request, the rule containing the highest-priority attribute is applied.

| Attribute            | Data type | Description                                                                                                                                                                                                                   |
|:---------------------|:----------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `principal.username` | List      | A list of usernames to be matched to this rule. This attribute is available only when the Security plugin is enabled on the domain. The attribute supports exact matching only.                                 |
| `principal.role`     | List      | A list of roles to be matched to this rule. This attribute is available only when the Security plugin is enabled on the domain. The attribute supports exact matching only.                                     |
| `index_pattern`      | List      | A list of target indexes for incoming queries. An element that is a full index name (for example, `logs-2025`) is matched exactly; an element ending in `*` (for example, `logs*`) is matched as a prefix.                                |

## Parameters

The `workload_group` feature type contains the following parameters.

| Parameter        | Data type | Description                                                                                             |
|:-----------------|:----------|:--------------------------------------------------------------------------------------------------------|
| attribute        | Object    | A rule must contain at least one attribute (`index_pattern`, `principal.username`, or `principal.role`). |
| `description`    | String    | A description of the rule.                                                                              |
| `workload_group` | String    | The workload group ID to apply to the requests matching this rule.                                      |

## Rule matching and precedence

A single request can match more than one rule. The following sections describe how a rule matches a request and how OpenSearch decides which workload group to assign when several rules match.

### Matching within a single rule

A rule matches a request only when *every* attribute in the rule matches, so multiple attributes in one rule form a logical AND. Within a single attribute, the listed values form a logical OR: the attribute matches when the request satisfies *any one* of its values. For example, a rule with `"principal": { "role": ["role1", "role2"] }` matches a request whose user has `role1` **or** `role2`; the request does not need both roles.

{: .note}
To match a request only when it carries a specific *combination* of values (a logical AND within a single attribute), model each required value as a separate attribute or combine the conditions upstream. Listing multiple values under one attribute always applies OR semantics.

### Choosing between multiple matching rules

When a request matches multiple rules that resolve to different workload groups, OpenSearch selects a single group in the following order:

1. **Attribute priority**: The workload group matched through the highest-priority attribute is preferred. Priority is fixed and follows the order shown in the [Attributes](#attributes) table (`principal.username`, then `principal.role`, then `index_pattern`).
2. **Match score**: If the choice is still ambiguous, OpenSearch compares match scores. An exact match scores higher than a shorter prefix (wildcard) match, and a workload group matched by *more* of the request's values receives a higher cumulative score. For example, if a request carries three roles and one group's rules match all three while another group's rules match only two, the group matching three roles is selected.
3. **No assignment on an unresolved tie**: If two or more workload groups remain tied after all attributes are compared (for example, two rules that each match the request through a single, equally specific role), then OpenSearch assigns no workload group. The request runs without a workload group rather than having one chosen arbitrarily.

If no rule matches, no workload group is assigned and the request runs without one.

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

