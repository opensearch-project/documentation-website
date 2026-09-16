---
layout: default
title: Allow list APIs
parent: Security APIs
nav_order: 100
has_children: true
has_toc: false
redirect_from:
  - /security/api/allowlist/
---

# Allow list APIs

The allow list APIs control which APIs a user without administrator privileges can access.

OpenSearch supports the following allow list APIs.

| API | Description |
| :--- | :--- |
| [Create or Update Allow List API]({{site.url}}{{site.baseurl}}/security/api/allowlist/create-allowlist/) | Creates or replaces the allow list configuration. |
| [Patch Allow List API]({{site.url}}{{site.baseurl}}/security/api/allowlist/patch-allowlist/) | Updates individual fields in the allow list configuration. |
| [Get Allow List API]({{site.url}}{{site.baseurl}}/security/api/allowlist/get-allowlist/) | Retrieves the current allow list configuration. |

## Required permissions

The allow list APIs are restricted to a super admin. Being mapped to a role listed in `plugins.security.restapi.roles_enabled` is not sufficient on its own: a user with the `all_access` role receives `403 Forbidden`. To call these APIs, use one of the following approaches:

- Authenticate with an admin certificate. For more information, see [Configuring an admin certificate]({{site.url}}{{site.baseurl}}/security/configuration/tls/#configuring-admin-certificates).
- Grant a role the `restapi:admin/allowlist` cluster permission. The role must also be listed in `plugins.security.restapi.roles_enabled`, and `opensearch.yml` must set `plugins.security.restapi.admin.enabled` to `true`.

No built-in role includes `restapi:admin/allowlist`. A role that contains any `restapi:admin` permission cannot be created or modified through the [Role APIs]({{site.url}}{{site.baseurl}}/security/api/roles/), so define the role in `roles.yml` and apply it with `securityadmin.sh`. For more information, see [Applying changes to configuration files]({{site.url}}{{site.baseurl}}/security/configuration/security-admin/).

To prevent a role from using these APIs, disable the `ALLOWLIST` endpoint for that role using `plugins.security.restapi.endpoints_disabled`.
