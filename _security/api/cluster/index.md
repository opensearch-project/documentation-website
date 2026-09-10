---
layout: default
title: Cluster Utility APIs
parent: Security APIs
nav_order: 170
has_children: true
has_toc: false
redirect_from:
  - /security/api/cluster/
---

# Cluster Utility APIs

The cluster utility APIs report Security plugin health and validate or migrate the security configuration index.

| API | Method | Endpoint |
| :--- | :--- | :--- |
| [Health API]({{site.url}}{{site.baseurl}}/security/api/cluster/health/) | GET/POST | `/_plugins/_security/health` |
| [Validate API]({{site.url}}{{site.baseurl}}/security/api/cluster/validate/) | GET | `/_plugins/_security/api/validate` |
| [Migrate API]({{site.url}}{{site.baseurl}}/security/api/cluster/migrate/) | POST | `/_plugins/_security/api/migrate` |
