---
layout: default
title: Auto-tagging Feature Overview
nav_order: 20
parent: Workload management
grand_parent: Availability and recovery
---

# Rule-based auto-tagging in OpenSearch

Rule-based auto-tagging is a versatile feature in OpenSearch that automatically assigns specific values to incoming requests based on predefined rules. Each OpenSearch feature can define its own attributes for matching and values to be assigned.

## What is rule-based auto-tagging

Rule-based auto-tagging automatically evaluates incoming requests against a set of predefined rules by matching request attributes. When a rule matches, it assigns a feature-specific value to the request. For example, the workload management feature uses index patterns as an attribute and assigns workload group IDs.

## Key concepts

Before diving into the details, let's understand the key components:

- **Rule**: Defines matching criteria (attributes) and the value to be assigned
- **Attributes**: Key-value pairs used for matching rules (e.g., index patterns, user roles, request types)
- **Feature-specific Value**: The value to be assigned when a rule matches
- **Pattern Matching**: How attribute values are matched (exact or pattern-based)

## Rule structure and management
Proper rule structure and management are crucial for effective auto-tagging Here we'll explore the rule schema and how to manage rules

### Rule schema

A rule is structured as follows:

```json
{
    "_id": "fwehf8302582mglfio349==",  // System-generated unique identifier
    "index_patterns": ["logs-prod-*"],  // Example attribute used by WLM
    "other_attribute": ["value1", "value2"],  // Other matching attributes
    "workload_group": "production_workload_id",  // Feature-specific value
    "updated_at": 1683256789000  // System-generated timestamp
}
```

### Managing rules

Here's how you can manage rules (using workload management as an example):

Create or update a rule:
```http
PUT /_rules/workload_group
{
    "index_patterns": ["prod-logs-*"],
    "other_attribute": ["value1"],
    "workload_group": "production_workload_id"
}
```

List rules:
```http
GET /_rules/workload_group
```

Delete a rule:
```http
DELETE /_rules/workload_group/{rule_id}
```

## How attribute matching works

The attribute matching system determines which rules apply to a given request. Different attributes can have different matching behaviors.

### Attribute matching types

Attributes can support various matching types depending on their nature:

1. Exact matching: Values must match exactly
2. Pattern matching: Values can match patterns (e.g., index patterns in WLM)
3. List matching: Values can match any item in a list
4. Range matching: Values can fall within defined ranges

For example, in workload management, index patterns support:
- Exact matches: `logs-2025-04`
- Prefix patterns: `logs-2025-*`

Note: The specific matching behavior depends on the attribute type and the feature using it.

### Rule precedence

When multiple rules match a request, precedence is determined by:

1. More specific attribute matches take priority
2. Feature-specific tie-breaking rules are applied

For example, in workload management with index patterns:
- `logs-prod-2025-*` is more specific than `logs-prod-*`
- `logs-prod-*` is more specific than `logs-*`

### Evaluation process

Here's how OpenSearch evaluates incoming requests:

1. OpenSearch receives a request
2. The system evaluates request attributes against defined rules
3. The most specific matching rule's feature value is assigned
4. If no rules match, no value is assigned

## Examples

Let's look at some examples using workload management, which uses index patterns as its primary attribute:

### Multiple attribute matching

```json
// Rule with multiple attributes
{
    "index_patterns": ["logs-prod-*"],
    "request_type": ["search", "count"], // it is used here just for demonstration purposes since WLM only supports index pattern at present
    "workload_group": "production_search_workload_id"
}

// Rule with single attribute
{
    "index_patterns": ["logs-prod-*"],
    "workload_group": "production_workload_id"
}
```

### Attribute specificity

```json
// Rule 1: General matching
{
    "index_patterns": ["logs-*"],
    "workload_group": "general_workload_id"
}

// Rule 2: More specific matching
{
    "index_patterns": ["logs-prod-service-*"],
    "workload_group": "prod_service_workload_id"
}
```

## Benefits of rule-based auto-tagging

Rule-based auto-tagging offers several advantages:

- Flexible attribute-based matching
- Support for feature-specific matching logic
- Consistent policy application
- Automated request classification
- Reduced administrative overhead
- Centralized rule management
- Easy policy updates

## Best practices

To get the most out of rule-based auto-tagging, consider these best practices:

### Designing rules

1. Identify the most relevant attributes for your use case
2. Use specific attribute values for precise control
3. Combine multiple attributes when needed
4. Use consistent naming conventions
5. Document attribute matching behavior

### Managing attributes

1. Understand each attribute's matching behavior
2. Start with the most specific criteria needed
3. Avoid overlapping rules unless intentional
4. Plan for future attribute value patterns

### Operations

1. Test new rules in a development environment
2. Monitor rule matches in your logs
3. Document rule configurations
4. Regularly review rule effectiveness
5. Clean up unused rules

## Troubleshooting

Common issues and their solutions:

1. **No value assigned**: Verify all attribute values are correct
2. **Unexpected value**: Check for more specific matching rules
3. **Rule not working**: Confirm attribute matching behavior

To validate your setup:

- Test rules with sample requests
- Use the list rules API to verify configurations
- Monitor rule evaluation in logs

## Learn more

Rule-based auto-tagging provides a flexible framework for implementing feature-specific request handling. While we've used workload management as an example, the attribute-based matching system can be adapted for various use cases.

