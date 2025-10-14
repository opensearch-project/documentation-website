---
layout: default
title: Rule-based auto-tagging
nav_order: 80
parent: Availability and recovery
has_children: true
canonical_url: https://docs.opensearch.org/latest/tuning-your-cluster/availability-and-recovery/rule-based-autotagging/autotagging/
---

# Rule-based auto-tagging

Rule-based auto-tagging automatically assigns feature-specific values to incoming requests and evaluates those requests against a set of predefined rules by matching request attributes.
For example, the workload management feature uses index patterns as an attribute and assigns workload group IDs.

Rule-based auto-tagging offers the following benefits:

* Flexible attribute-based matching
* Support for feature-specific matching logic
* Consistent policy application
* Automated request classification
* Reduced administrative overhead
* Centralized rule management
* Easy policy updates

Rule-based auto-tagging provides a flexible framework for implementing feature-specific request handling. Although this topic uses workload management as an example, the attribute-based matching system can be adapted for other OpenSearch features and use cases.
{: .tip }

## Key concepts

Before reviewing the rule configuration and behavior, it's important to understand the following key components of rule-based auto-tagging:

* **Rule**: Defines matching criteria (attributes) and the value to assign.
* **Attributes**: Key-value pairs used to match rules (such as index patterns, user roles, or request types).
* **Feature-specific value**: The value assigned when a rule matches.
* **Pattern matching**: The matching behavior (exact or pattern based) for attribute values.

## Rule structure and management

Proper rule structure and management are essential for effective auto-tagging. This section describes the rule schema and how to manage rules.

### Rule schema

The following rule schema includes matching attributes and a feature-specific value:

```json
{
  "_id": "fwehf8302582mglfio349==",  
  "index_pattern": ["logs-prod-*"],  
  "other_attribute": ["value1", "value2"],
  "workload_group": "production_workload_id",
  "updated_at": 1683256789000
}
```

### Managing rules

Use the [Rules API]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/rule-based-autotagging/rule-lifecycle-api/) to manage rules.

## Attribute matching

The attribute matching system determines which rules apply to a given request. Each attribute type can support different matching behaviors, based on the following attribute types:

1. **Exact matching**: Attribute values must match exactly.
2. **Pattern matching**: Supports wildcards (such as index patterns).
3. **List matching**: Matches any item in a list.
4. **Range matching**: Matches values within a defined range.

For example, in workload management, index patterns support:

* Exact match: `logs-2025-04`
* Prefix pattern: `logs-2025-*`

Note that matching behavior is determined by the feature and attribute type.

### Rule precedence

When multiple rules match a request, OpenSearch uses the following precedence rules:

1. Rules with more specific attribute matches are prioritized.
2. Feature-specific tie-breaking logic is applied.

For example, with index patterns:

* `logs-prod-2025-*` takes precedence over `logs-prod-*`.
* `logs-prod-*` takes precedence over `logs-*`.

### Evaluation process

OpenSearch evaluates incoming requests using the following process:

1. OpenSearch receives a request.
2. The system evaluates request attributes against defined rules.
3. The most specific matching rule's value is assigned.
4. If no rules match, no value is assigned.

## Examples

These examples demonstrate how rule-based auto-tagging works in workload management, which uses index patterns as its primary attribute.

### Multiple attribute matching

```json
{
  "index_pattern": ["logs-prod-*"],
  "request_type": ["search", "count"],
  "workload_group": "production_search_workload_id"
}

{
  "index_pattern": ["logs-prod-*"],
  "workload_group": "production_workload_id"
}
```

### Attribute specificity

```json
{
  "index_pattern": ["logs-*"],
  "workload_group": "general_workload_id"
}

{
  "index_pattern": ["logs-prod-service-*"],
  "workload_group": "prod_service_workload_id"
}
```

## Best practices

Follow these best practices for designing and operating rule-based auto-tagging.

### Designing rules

When creating rules, focus on building logical, specific configurations that support your workload and access patterns. Consider the following guidelines:

* Identify the most relevant attributes for your use case.
* Use specific attribute values for precise control.
* Combine multiple attributes when appropriate.
* Use consistent naming conventions.
* Document attribute matching behavior.

### Managing attributes

Attribute selection and configuration significantly influence rule effectiveness. To manage attributes successfully, perform the following actions:

* Understand each attribute's matching behavior.
* Start with the most specific criteria needed.
* Avoid overlapping rules unless intentional.
* Plan for future attribute value patterns.

### Operations

Ongoing operations and monitoring help maintain rule quality over time. Use the following best practices to ensure that your feature rules are reliable and effective:

* Test new rules in a development environment.
* Monitor rule matches in system logs.
* Document rule configurations.
* Regularly review rule effectiveness.
* Remove unused rules.

## Troubleshooting

When creating rules, the following issues can occur:

* **No value assigned**: This issue typically occurs when the request attributes do not match any existing rules.  
  For example, suppose `index_pattern` is a valid allowed attribute. If a request is made to search `logs_q1_2025` but no rule exists for that value, the request will not match any rule and will result in a missing assignment.

* **Unexpected value**: This can happen when multiple rules are defined with overlapping or conflicting conditions.  
  For example, consider the following rules:
  1. `{ "username": ["dev*"], "index_pattern": ["logs*"] }`
  2. `{ "index_pattern": ["logs*", "events*"] }`

  If a user with the username `dev_john` sends a search request to `logs_q1_25`, it will match the first rule based on the `username` and `index_pattern` attributes. The request will not match the second rule, even though the `index_pattern` also qualifies.

You can resolve both issues by validating your configuration using one of the following techniques:

- **Test rules with sample requests**: First, create a rule using the REST API, and then send a request that matches the rule's attributes. For example, for a rule with `"index_pattern": ["logs*", "events*"]`, you can send a request to a `logs` or `events` index. Then verify the workload management statistics by querying the [Workload Management Stats API]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/workload-management/wlm-feature-overview/#workload-management-stats-api).

- **Use the [Get Rule API]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/rule-based-autotagging/rule-lifecycle-api/#get-a-rule)** to confirm rule definitions.
