---
layout: default
title: Security APIs
nav_order: 84
---

# Security APIs

Security APIs provide information which can be very useful in troubleshooting connection issues and overall configuration.

API | Method | Description
:--- | :--- | :---
`/_plugins/_security/whoami` | GET/POST | Returns basic details about the logged in user.
`/_opendistro/_security/sslinfo` | GET | Returns details of the ssl connection when using certificate authentication.
`/_plugins/_security/api/permissionsinfo` | GET | Returns permission details for the logged in user.
`/_plugins/_security/authinfo` | GET/POST | Returns the backend roles and OpenSearch roles mapped to the logged in user.
`/_plugins/_security/api/ssl/certs` | GET | Displays details and expiration of the certificates used in OpenSearch HTTP and transport communication layers. Must be accessed called with `superadmin` certificate
`/_plugins/_security/api/ssl/transport/reloadcerts` | PUT | Reload the certificates on `transport` layer. More details are available in [Reload TLS certificates on the transport layer]({{site.url}}{{site.baseurl}}/security/configuration/tls/#reload-tls-certificates-on-the-transport-layer).
`/_plugins/_security/api/ssl/http/reloadcerts` | PUT | Reload the certificates on `http` layer. More details are available in [Reload TLS certificates on the http layer]({{site.url}}{{site.baseurl}}/security/configuration/tls/#reload-tls-certificates-on-the-http-layer).

