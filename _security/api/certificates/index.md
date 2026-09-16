---
layout: default
title: Certificate APIs
parent: Security APIs
nav_order: 140
has_children: true
has_toc: false
redirect_from:
  - /security/api/certificates/
---

# Certificate APIs

The certificate APIs return the certificates in use on the cluster and reload them without restarting a node.

OpenSearch supports the following certificate APIs.

| API | Description |
| :--- | :--- |
| [Get Certificates API]({{site.url}}{{site.baseurl}}/security/api/certificates/get-certificates/) | Returns the HTTP and transport certificates in use on the node that receives the request. |
| [Get All Certificates API]({{site.url}}{{site.baseurl}}/security/api/certificates/get-all-certificates/) | Returns the certificates in use on every node in the cluster. |
| [Get Node Certificates API]({{site.url}}{{site.baseurl}}/security/api/certificates/get-node-certificates/) | Returns the certificates in use on the specified node. |
| [Reload Transport Certificates API]({{site.url}}{{site.baseurl}}/security/api/certificates/reload-transport-certificates/) | Reloads the transport layer certificates without restarting the node. |
| [Reload HTTP Certificates API]({{site.url}}{{site.baseurl}}/security/api/certificates/reload-http-certificates/) | Reloads the HTTP layer certificates without restarting the node. |

## Required permissions

The certificate APIs are restricted to a super admin. Being mapped to a role listed in `plugins.security.restapi.roles_enabled` is not sufficient on its own: a user with the `all_access` role receives `403 Forbidden`. To call these APIs, use one of the following approaches:

- Authenticate with an admin certificate. For more information, see [Configuring an admin certificate]({{site.url}}{{site.baseurl}}/security/configuration/tls/#configuring-admin-certificates).
- Grant a role one of the following cluster permissions. The role must also be listed in `plugins.security.restapi.roles_enabled`, and `opensearch.yml` must set `plugins.security.restapi.admin.enabled` to `true`.

| Operation | Required permission |
| :--- | :--- |
| Retrieve certificates | `restapi:admin/ssl/certs/info` |
| Reload certificates | `restapi:admin/ssl/certs/reload` |

No built-in role includes these permissions. A role that contains any `restapi:admin` permission cannot be created or modified through the [Role APIs]({{site.url}}{{site.baseurl}}/security/api/roles/), so define the role in `roles.yml` and apply it with `securityadmin.sh`. For more information, see [Applying changes to configuration files]({{site.url}}{{site.baseurl}}/security/configuration/security-admin/).

To prevent a role from using these APIs, disable the `SSL` endpoint for that role using `plugins.security.restapi.endpoints_disabled`.
