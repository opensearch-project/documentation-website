---
layout: default
title: Auto-tagging Feature Overview
nav_order: 20
parent: Workload management
grand_parent: Availability and recovery
---

# Rule-based auto-tagging in OpenSearch
In this guide we will walk you through how to use the rule based auto-tagging. Auto-tagging enriches the request with the target label which a consuming feature (such as workload-management) consumes.
## What is rule-based auto-tagging?

Rule-based Auto-tagging automatically assigns workload groups to incoming search requests in OpenSearch. This feature helps you implement automated feature policies without manual intervention.
throughout this guide I will take a sample feature which uses rule framework for auto-tagging i,e; workload-management

## Key concepts

- **Rule**: Defines criteria for tagging search requests
- **Attributes**: Prefix-based pattern matching for the given attribute value (e.g., attribute could be index pattern, security context values such as username, role, group etc.)
- **Label**: Label assigned to requests for the client feature (e,g; workload management feature will use 'workload_group' as label)
- **Auto-tagging**: Process of assigning workload groups based on rules
- **Pattern Specificity**: More specific patterns take precedence e,g; `logs-prod-2025` will match `logs-prod-*` pattern over `logs-*`

## How to set up rule-based auto-tagging
Now we will learn about how can we set up the auto-tagging in opensearch.

### Before you begin

- Ensure you have an OpenSearch cluster with the feature (e,g; workload-management uses this framework for autotagging) plugin installed
- Verify you have administrative access to the cluster

### Managing rules

Create or update a rule:
```http
PUT /_rules/workload_group
{
    "description": "Production Logs Rule",
    "index_pattern": ["prod-logs-*"],
    "workload_group": "production_workload"
}
```

List all rules:
```http
GET /_rules/workload_group
```

Delete a rule:
```http
DELETE /_rules/workload_group/{rule_id}
```

### Rule structure
```json
{
    "_id": "fwehf8302582mglfio349==",  // System-generated
    "description": "Assign Workload Group for Index Logs123",
    "index_pattern": ["logs123"],  // Exact match or prefix pattern only
    "workload_group": "dev_workload_group_id",
    "updated_at": "01-10-2025T21:23:21.456Z"  // System-generated timestamp
}
```

## How pattern matching works

### Supported pattern types

1. Exact matches: `logs-2025-04`
2. Prefix patterns: `logs-2025-*`

Note: This feature doesn't support suffix patterns (`*-logs`) or generic patterns (`*-logs-*`).

### Pattern precedence

1. Exact matches have highest priority
2. Longer prefix patterns take precedence over shorter ones
   Example: `logs-prod-2025-*` is more specific than `logs-prod-*`

### Evaluation process

1. OpenSearch receives a search request
2. The system compares request indices against defined rules
3. The most specific matching rule's workload group is applied
4. If no rules match, no workload group is assigned

## Examples

### Production vs development logs

```json
// Rule 1: Production Logs
{
    "description": "Production Logs",
    "index_pattern": ["logs-prod-*"],
    "workload_group": "production"
}

// Rule 2: Development Logs
{
    "description": "Development Logs",
    "index_pattern": ["logs-dev-*"],
    "workload_group": "development"
}

// Example: Production search
GET /logs-prod-2025/_search
// Result: Tagged with "production"

// Example: Development search
GET /logs-dev-2025/_search
// Result: Tagged with "development"
```

### Handling specificity

```json
// Rule 1: General Logs
{
    "description": "General Logs",
    "index_pattern": ["logs-*"],
    "workload_group": "general"
}

// Rule 2: Production Service Logs
{
    "description": "Production Service Logs",
    "index_pattern": ["logs-prod-service-*"],
    "workload_group": "prod_service"
}

// Example: Specific production service search
GET /logs-prod-service-2025/_search
// Result: Tagged with "prod_service" (more specific match wins)
```

## Benefits of rule-based auto-tagging

- Automates request tagging
- Ensures consistent policy application
- Scales to new attributes automatically
- Reduces administrative overhead
- Minimizes manual errors
- Allows easy policy updates

## Best practices
The following best practices will help you familiarize with correct usage and avoid common pitfalls

### Designing rules

1. Use specific prefix patterns for precise control
2. Clearly document each rule's purpose
3. Create a hierarchical pattern structure

### Creating patterns

1. Start with the most specific patterns needed
2. Use consistent delimiters in index names
3. Avoid unintended pattern overlaps
4. Plan for future index naming conventions

### Operations

1. Test new rules in a development environment
2. Monitor rule matches in your logs
3. Keep rule configurations documented
4. Regularly review rule effectiveness

## Troubleshooting

**Common issues and solutions:**

1. **No Label Assigned**: Ensure your index pattern is a valid prefix
2. **Unexpected Feature Label**: Look for more specific matching patterns
3. **Rule Not Working**: Verify the pattern follows the prefix-only format

**To validate your setup:**


- Test new rules with sample requests before production use
- Use the list rules API to verify pattern matching
- Check the consuming feature specific logs/stats to verify the correctness

