# Simulation API for Security Configuration Permissions

## Overview

OpenSearch now supports simulation of security configuration permissions to improve safety, visibility, and operational confidence before applying changes. 
The Simulation API allows administrators to test permission configurations against current or proposed security configurations — without applying those changes..

This documentation covers:

- How simulation API works
- How to use the Simulation API to test configurations
- Supported simulation scenarios

---

## 1. Purpose

Administrators can:
- Simulate user or role permissions across cluster and index levels
- Preview effects of proposed roles, role mappings, and action groups.
- Identify missing privileges or potential misconfigurations before saving changes


---

## 2. API Endpoints

### Endpoint:
```
POST /_plugins/_security/api/simulation
```

Access Control: Admin/Security Manager permissions required


## 3. Supported Scenarios
**The API supports two simulation modes:**
- Role-based Simulation

  Simulate permissions for a specific role name 
- User-based Simulation

  Simulate permissions for a specific user

Both simulation types support:

- Current configuration — simulate against existing security configurations
- Proposed configuration — simulate against new configurations provided in the request


## 4. Feature Configuration
This feature is enabled by default.

- To disable this feature, add the following setting to your `opensearch.yml` file:
```
plugins.security.simulation_api.enabled: false
```
