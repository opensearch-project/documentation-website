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
