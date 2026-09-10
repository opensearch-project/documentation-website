---
layout: default
title: Distinguished Name APIs
parent: Security APIs
nav_order: 110
has_children: true
has_toc: false
redirect_from:
  - /security/api/distinguished-names/
---

# Distinguished Name APIs

The Distinguished Name APIs let a super admin (or a user with sufficient permissions to access these APIs) add, retrieve, update, or delete any distinguished names from an allow list in order to enable communication between clusters or nodes.

Before you can use these APIs to configure the allow list, you must add the following line to `opensearch.yml`:

```yml
plugins.security.nodes_dn_dynamic_config_enabled: true
```
{% include copy.html %}

| API | Method | Endpoint |
| :--- | :--- | :--- |
| [Get Distinguished Names API]({{site.url}}{{site.baseurl}}/security/api/distinguished-names/get-distinguished-names/) | GET | `/_plugins/_security/api/nodesdn` |
| [Get Distinguished Name API]({{site.url}}{{site.baseurl}}/security/api/distinguished-names/get-distinguished-name/) | GET | `/_plugins/_security/api/nodesdn/{cluster_name}` |
| [Update Distinguished Name API]({{site.url}}{{site.baseurl}}/security/api/distinguished-names/update-distinguished-name/) | PUT | `/_plugins/_security/api/nodesdn/{cluster_name}` |
| [Patch Distinguished Name API]({{site.url}}{{site.baseurl}}/security/api/distinguished-names/patch-distinguished-name/) | PATCH | `/_plugins/_security/api/nodesdn/{cluster_name}` |
| [Patch Distinguished Names API]({{site.url}}{{site.baseurl}}/security/api/distinguished-names/patch-distinguished-names/) | PATCH | `/_plugins/_security/api/nodesdn` |
| [Delete Distinguished Name API]({{site.url}}{{site.baseurl}}/security/api/distinguished-names/delete-distinguished-name/) | DELETE | `/_plugins/_security/api/nodesdn/{cluster_name}` |
