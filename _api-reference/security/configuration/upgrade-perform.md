---
layout: default
title: Upgrade Perform API
parent: Configuration APIs
grand_parent: Security APIs
nav_order: 20
---

# Upgrade Perform API
**Introduced 1.0**
{: .label .label-purple }

The Upgrade Perform API allows you to upgrade your Security plugin configuration components. This API is typically used after identifying necessary upgrades with the [Upgrade Check API]({{site.url}}{{site.baseurl}}/api-reference/security/configuration/upgrade-check/). It updates your configuration components to ensure compatibility with the current version of the Security plugin.

<!-- spec_insert_start
api: security.config_upgrade_perform
component: endpoints
-->
## Endpoints
```json
POST /_plugins/_security/api/_upgrade_perform
```
<!-- spec_insert_end -->

## Request body fields

The request body is optional. It is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `config` | Array of Strings | A list of specific configuration components to upgrade. If omitted, all components requiring upgrades will be processed. Valid values include `roles`, `rolesmapping`, `actiongroups`, `config`, `internalusers`, and `tenants`. |

## Example request

The following example request performs upgrades on only the `roles` and `config` components:

<!-- spec_insert_start
component: example_code
rest: POST /_plugins/_security/api/_upgrade_perform
body: |
{
  "config": ["roles", "config"]
}
-->
{% capture step1_rest %}
POST /_plugins/_security/api/_upgrade_perform
{
  "config": [
    "roles",
    "config"
  ]
}
{% endcapture %}

{% capture step1_python %}


response = client.security.config_upgrade_perform(
  body =   {
    "config": [
      "roles",
      "config"
    ]
  }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

To upgrade all components requiring it, you can omit the request body.

## Example response

The response includes information about which components were upgraded and the specific changes that were made:

```json
{
  "status": "OK",
  "upgrades": {
    "roles": [
      "Added permissions for dashboard features to admin role",
      "Updated cluster monitor permissions"
    ],
    "config": [
      "Updated authentication configuration",
      "Added new security settings"
    ]
  }
}
```

If no components require upgrades, you'll receive a response similar to the following:

```json
{
  "status": "OK",
  "upgrades": {}
}
```

## Response body fields
