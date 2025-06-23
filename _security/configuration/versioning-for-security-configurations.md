# Security Configuration Versioning and Rollback API

## Overview

OpenSearch now supports **versioning of security configurations** to improve traceability, auditability, and operational safety. Each update to critical security configurations is tracked as a new version, and users can view or roll back to any previous version via the dedicated APIs.

This documentation covers:
- How versioning works
- How to use the View API to inspect past versions
- How to use the Rollback API to restore configurations

---

## 1. Versioning Overview

### What is versioned?

Any supported security configuration update is captured as a new version. A version includes:
- Snapshot of the full security configuration at that time
- A unique version ID (e.g., `v1`, `v2`, ...)
- Timestamp of creation
- User who performed the update

### When is a new version created?

A new version is created **only when a change is detected** compared to the latest saved version. This prevents redundant versions and ensures meaningful version history.

---

## 2. View Version API

Purpose: View the complete history of security configuration changes, or any specific version of the security configurations.

### Endpoint:
- To view all the versions : GET /_plugins/_security/api/versions
- To view a specific version : GET /_plugins/_security/api/version/{versionId}

Access Control: Admin/Security Manager permissions required

## 3. Rollback Version API

Purpose : Allows rollback to immediate or any desired version of security

### Endpoint:
- To rollback to immediate previous version : POST /_plugins/_security/api/version/rollback
- To rollback to a specific version : POST /_plugins/_security/api/version/rollback/{versionID}

Access Control: Admin/Security Manager permissions required

## 4. Enabling the Feature

* To enable this feature, add the following setting to your `opensearch.yml` file:
```bash
plugins.security.configurations_versions.enabled: true
```
* Optional: Control how many versions are retained using:
```bash
plugins.security.config_version.retention_count: 10
```