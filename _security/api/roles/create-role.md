---
layout: default
title: Create Role API
parent: Role APIs
grand_parent: Security APIs
nav_order: 30
---

# Create Role API
**Introduced 1.0**
{: .label .label-purple }

Creates or replaces the specified role.

<!-- spec_insert_start
api: security.create_role
component: endpoints
-->
## Endpoints
```json
PUT /_plugins/_security/api/roles/{role}
```
<!-- spec_insert_end -->

## Example request

```json
PUT _plugins/_security/api/roles/{role}
{
  "cluster_permissions": [
    "cluster_composite_ops",
    "indices_monitor"
  ],
  "index_permissions": [{
    "index_patterns": [
      "movies*"
    ],
    "dls": "",
    "fls": [],
    "masked_fields": [],
    "allowed_actions": [
      "read"
    ]
  }],
  "tenant_permissions": [{
    "tenant_patterns": [
      "human_resources"
    ],
    "allowed_actions": [
      "kibana_all_read"
    ]
  }]
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "status": "OK",
  "message": "'test-role' updated."
}
```

>Due to word boundaries associated with Unicode special characters, the Unicode standard analyzer cannot index a [text field type]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/text/) value as a whole value when it includes one of these special characters. As a result, a text field value that includes a special character is parsed by the standard analyzer as multiple values separated by the special character, effectively tokenizing the different elements on either side of it.
>
>For example, since the values in the fields ```"user.id": "User-1"``` and ```"user.id": "User-2"``` contain the hyphen/minus sign, this special character will prevent the analyzer from distinguishing between the two different users for `user.id` and interpret them as one and the same. This can lead to unintentional filtering of documents and potentially compromise control over their access.
>
>To avoid this circumstance, you can use a custom analyzer or map the field as `keyword`, which performs an exact-match search. See [Keyword field type]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/keyword/) for the latter option.
>
>For a list of characters that should be avoided when field type is `text`, see [Word Boundaries](https://unicode.org/reports/tr29/#Word_Boundaries).
{: .warning}
