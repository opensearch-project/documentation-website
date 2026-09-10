---
layout: default
title: Distinguished name APIs
parent: Security APIs
nav_order: 130
has_children: true
has_toc: false
redirect_from:
  - /security/api/distinguished-names/
---

# Distinguished name APIs

The distinguished name APIs let a super admin (or a user with sufficient permissions to access these APIs) add, retrieve, update, or delete any distinguished names from an allow list in order to enable communication between clusters or nodes.

Before you can use these APIs to configure the allow list, you must add the following line to `opensearch.yml`:

```yml
plugins.security.nodes_dn_dynamic_config_enabled: true
```
{% include copy.html %}

OpenSearch supports the following distinguished name APIs.

| API | Description |
| :--- | :--- |
| [Create or Update Distinguished Name API]({{site.url}}{{site.baseurl}}/security/api/distinguished-names/update-distinguished-name/) | Adds or updates the distinguished names in the specified cluster's or node's allow list. |
| [Patch Distinguished Names API]({{site.url}}{{site.baseurl}}/security/api/distinguished-names/patch-distinguished-names/) | Updates the distinguished names for one cluster or makes a bulk update across clusters. |
| [Get Distinguished Names API]({{site.url}}{{site.baseurl}}/security/api/distinguished-names/get-distinguished-names/) | Retrieves the distinguished names in the allow list for one cluster or node or for all clusters and nodes. |
| [Delete Distinguished Name API]({{site.url}}{{site.baseurl}}/security/api/distinguished-names/delete-distinguished-name/) | Deletes all distinguished names in the specified cluster's or node's allow list. |
