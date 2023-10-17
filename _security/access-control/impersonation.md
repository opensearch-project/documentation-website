---
layout: default
title: User impersonation
parent: Access control
nav_order: 100
redirect_from:
 - /security/access-control/impersonation/
 - /security-plugin/access-control/impersonation/
---

# User impersonation

User impersonation allows specially privileged users to act as another user without knowledge of nor access to the impersonated user's credentials.

Impersonation can be useful for testing and troubleshooting, or for allowing system services to safely act as a user.

Impersonation can occur on either the REST interface or at the transport layer.


## REST interface

To allow one user to impersonate another, add the following to `opensearch.yml`:

```yml
plugins.security.authcz.rest_impersonation_user:
  <AUTHENTICATED_USER>:
    - <IMPERSONATED_USER_1>
    - <IMPERSONATED_USER_2>
```

The impersonated user field supports wildcards. Setting it to `*` allows `AUTHENTICATED_USER` to impersonate any user.


## Transport interface

In a similar fashion, add the following to enable transport layer impersonation:

```yml
plugins.security.authcz.impersonation_dn:
  "CN=spock,OU=client,O=client,L=Test,C=DE":
    - worf
```


## Impersonating Users

To impersonate another user, submit a request to the system with the HTTP header `opendistro_security_impersonate_as` set to the name of the user to be impersonated. A good test is to make a GET request to the `_plugins/_security/authinfo` URI:

```bash
curl -XGET -u 'admin:admin' -k -H "opendistro_security_impersonate_as: user_1" https://localhost:9200/_plugins/_security/authinfo?pretty
```
