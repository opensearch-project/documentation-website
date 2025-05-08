---
layout: default
title: Configuration APIs
parent: Security APIs
has_children: true
nav_order: 20
---

# Configuration APIs
**Introduced 1.0**
{: .label .label-purple }

The Configuration APIs provide programmatic access for managing, validating, and upgrading Security plugin configuration components. These APIs help ensure that your security settings remain compatible and effective as your OpenSearch cluster evolves.

Security configurations may require updates in the following scenarios:

- Upgrading to a new version of OpenSearch or the Security plugin
- Enabling new features that require updated settings
- Migrating configurations between environments
- Troubleshooting security issues

## When to use

Use the Configuration APIs to perform the following actions:

- Identify outdated or incompatible configuration components.
- Perform automatic upgrades to maintain compatibility.
- Validate the structure and integrity of your security configuration.
- Manage versioning of security settings.

## Available APIs

- [Upgrade Check API]({{site.url}}{{site.baseurl}}/api-reference/security/configuration/upgrade-check/): Checks your current configuration for compatibility with your OpenSearch version and identifies components that need to be upgraded.

- [Upgrade Perform API]({{site.url}}{{site.baseurl}}/api-reference/security/configuration/upgrade-perform/): Applies updates to the security configuration, based on the results of the Upgrade Check API.

## Configuration components

These APIs manage the following configuration components:

- **Roles**: Define permissions for actions users can perform
- **Role mappings**: Associate users or backend roles with specific roles
- **Action groups**: Collections of permissions used to simplify role definitions
- **Internal users**: User credentials stored directly in OpenSearch
- **Tenants**: Isolated workspaces that support multi-tenancy
- **Security configuration**: Global security settings

## Best practices

When using the Configuration APIs, remember the following best practices:

- Always back up your security configuration before making changes.
- Run the Upgrade Check API before using the Upgrade Perform API.
- Test changes in a non-production environment before deploying to production.
- Integrate these APIs into your regular upgrade and maintenance workflows.
- Validate functionality after applying configuration changes.