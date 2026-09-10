---
layout: default
title: Configuration APIs
parent: Security APIs
nav_order: 100
has_children: true
has_toc: false
redirect_from:
  - /api-reference/security/configuration/
  - /security/api/configuration/
---

# Configuration APIs

The Configuration APIs retrieve, replace, patch, and upgrade the Security plugin configuration.

| API | Method | Endpoint |
| :--- | :--- | :--- |
| [Get Configuration API]({{site.url}}{{site.baseurl}}/security/api/configuration/get-configuration/) | GET | `/_plugins/_security/api/securityconfig` |
| [Update Configuration API]({{site.url}}{{site.baseurl}}/security/api/configuration/update-configuration/) | PUT | `/_plugins/_security/api/securityconfig/config` |
| [Patch Configuration API]({{site.url}}{{site.baseurl}}/security/api/configuration/patch-configuration/) | PATCH | `/_plugins/_security/api/securityconfig` |
| [Upgrade Check API]({{site.url}}{{site.baseurl}}/security/api/configuration/upgrade-check/) | GET | `/_plugins/_security/api/_upgrade_check` |
| [Upgrade Perform API]({{site.url}}{{site.baseurl}}/security/api/configuration/upgrade-perform/) | POST | `/_plugins/_security/api/_upgrade_perform` |
