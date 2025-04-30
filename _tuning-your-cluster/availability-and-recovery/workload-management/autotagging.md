---
layout: default
title: Auto-tagging Feature Overview
nav_order: 20
parent: Workload management
grand_parent: Availability and recovery
---

# Rule-based Auto-tagging in OpenSearch

## What is Rule-based Auto-tagging?

Rule-based Auto-tagging automatically assigns workload groups to incoming search requests in OpenSearch. This feature helps you implement automated workload management policies without manual intervention.

## Key Concepts

- **Rule**: Defines criteria for tagging search requests
- **Index Pattern**: Prefix-based pattern matching target indices (e.g., "logs-*")
- **Workload Group**: Label assigned to requests for workload management
- **Auto-tagging**: Process of assigning workload groups based on rules
- **Pattern Specificity**: More specific patterns take precedence e,g; `logs-prod-2025` will match `logs-prod-*` pattern over `logs-*`

## How to Set Up Rule-based Auto-tagging

### Before You Begin

- Ensure you have an OpenSearch cluster with the workload-management plugin installed
- Verify you have administrative access to the cluster

### Managing Rules

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

### Rule Structure
```json
{
    "_id": "fwehf8302582mglfio349==",  // System-generated
    "description": "Assign Query Group for Index Logs123",
    "index_pattern": ["logs123"],  // Exact match or prefix pattern only
    "workload_group": "dev_workload_group_id",
    "updated_at": "01-10-2025T21:23:21.456Z"  // System-generated timestamp
}
```

## How Pattern Matching Works

### Supported Pattern Types

1. Exact matches: `logs-2025-04`
2. Prefix patterns: `logs-2025-*`

Note: OpenSearch doesn't support suffix patterns (`*-logs`) or generic patterns (`*-logs-*`).

### Pattern Precedence

1. Exact matches have highest priority
2. Longer prefix patterns take precedence over shorter ones
   Example: `logs-prod-2025-*` is more specific than `logs-prod-*`

### Evaluation Process

1. OpenSearch receives a search request
2. The system compares request indices against defined rules
3. The most specific matching rule's workload group is applied
4. If no rules match, no workload group is assigned

## Examples

### Production vs Development Logs

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

### Handling Specificity

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

## Benefits of Rule-based Auto-tagging

- Automates request tagging
- Ensures consistent policy application
- Scales to new indices automatically
- Reduces administrative overhead
- Minimizes manual errors
- Centralizes workload management
- Allows easy policy updates

## Best Practices

### Designing Rules

1. Use specific prefix patterns for precise control
2. Clearly document each rule's purpose
3. Use consistent workload group naming
4. Create a hierarchical pattern structure

### Creating Patterns

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

1. **No Workload Group Assigned**: Ensure your index pattern is a valid prefix
2. **Unexpected Workload Group**: Look for more specific matching patterns
3. **Rule Not Working**: Verify the pattern follows the prefix-only format

**To validate your setup:**


- Test new rules with sample requests before production use
- Use the list rules API to verify pattern matching
- Check your logs for rule evaluation results

