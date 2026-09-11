---
layout: default
title: Get audit configuration
parent: Audit log APIs
grand_parent: Security APIs
nav_order: 30
---

# Get Audit Configuration API
**Introduced 1.0**
{: .label .label-purple }

Retrieves the audit logging and compliance configuration.

For details on using audit logging to track access to OpenSearch clusters, as well as information on further configurations, see [Audit logs]({{site.url}}{{site.baseurl}}/security/audit-logs/index/).

<!-- spec_insert_start
api: security.get_audit_configuration
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_security/api/audit
```
<!-- spec_insert_end -->

## Example request

```json
GET _plugins/_security/api/audit
```
{% include copy-curl.html security=true %}

## Example response

The response is abbreviated here:

```json
{
  "_readonly": [],
  ...
}
```

## Response body fields

The `_readonly` field lists the configuration paths that cannot be modified. Changes to these paths result in a 409 error. The `config` field contains the current audit and compliance settings. For descriptions of the individual settings, see [Update Audit Configuration API]({{site.url}}{{site.baseurl}}/security/api/audit/update-audit-configuration/#request-body-fields).
