---
layout: default
title: Certificate APIs
parent: Security APIs
nav_order: 120
has_children: true
has_toc: false
redirect_from:
  - /security/api/certificates/
---

# Certificate APIs

The Certificate APIs return the certificates in use on the cluster and reload them without restarting a node.

| API | Method | Endpoint |
| :--- | :--- | :--- |
| [Get Certificates API]({{site.url}}{{site.baseurl}}/security/api/certificates/get-certificates/) | GET | `/_plugins/_security/api/ssl/certs` |
| [Get All Certificates API]({{site.url}}{{site.baseurl}}/security/api/certificates/get-all-certificates/) | GET | `/_plugins/_security/api/certificates` |
| [Get Node Certificates API]({{site.url}}{{site.baseurl}}/security/api/certificates/get-node-certificates/) | GET | `/_plugins/_security/api/certificates/{node_id}` |
| [Reload Transport Certificates API]({{site.url}}{{site.baseurl}}/security/api/certificates/reload-transport-certificates/) | PUT | `/_plugins/_security/api/ssl/transport/reloadcerts` |
| [Reload HTTP Certificates API]({{site.url}}{{site.baseurl}}/security/api/certificates/reload-http-certificates/) | PUT | `/_plugins/_security/api/ssl/http/reloadcerts` |
