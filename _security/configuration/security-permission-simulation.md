---
layout: default
title: Simulating security permissions
parent: Configuration
nav_order: 60
---

# Security permission simulation

You can simulate security configuration permissions to improve safety, visibility, and operational confidence before applying changes using the Security Simulation API. This allows administrators to test permission configurations against current or proposed security configurations without applying those changes.

Administrators can perform the following operations using the Security Simulation API:
- Simulate user or role permissions across cluster and index levels
- Preview effects of proposed roles, role mappings, and action groups.
- Identify missing privileges or potential misconfigurations before saving changes

## Simulation types

The API supports two simulation types:

- Role-based simulation: Simulate permissions for a specific role name 
- User-based simulation: Simulate permissions for a specific user

Both simulation types support the following configurations:

- Current configuration — simulate against existing security configurations
- Proposed configuration — simulate against new configurations provided in the request

## Enabling Security Simulation API

The Security Simulation API is enabled by default. To disable it, add the following setting to your `opensearch.yml` file:

```yaml
plugins.security.simulation_api.enabled: false
```

## Endpoint

```json
POST /_plugins/_security/api/simulation
```

## Example request

```json
POST /_plugins/_security/api/simulation
```
{% include copy-curl.html %}

## Required permissions

Using this API requires admin or security manager permissions.
