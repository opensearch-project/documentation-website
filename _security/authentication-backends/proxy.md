---
layout: default
title: Proxy-based authentication
parent: Authentication backends
nav_order: 65
redirect_from:
 - /security-plugin/configuration/proxy/
---

# Proxy-based authentication

If you already have a single sign-on (SSO) solution in place, you might want to use it as an authentication backend.

Most solutions work as a proxy in front of OpenSearch and the Security plugin. If proxy authentication succeeds, the proxy adds the (verified) username and its (verified) roles in HTTP header fields. The names of these fields depend on the SSO solution you have in place.

The Security plugin then extracts these HTTP header fields from the request and uses the values to determine the user's permissions.


## Enable proxy detection

To enable proxy detection for OpenSearch, configure it in the `xff` section of `config.yml`:

```yml
---
_meta:
  type: "config"
  config_version: 2

config:
  dynamic:
    http:
      anonymous_auth_enabled: false
      xff:
        enabled: true
        internalProxies: '192\.168\.0\.10|192\.168\.0\.11'
        remoteIpHeader: 'x-forwarded-for'
```

You can configure the following settings:

Name | Description
:--- | :---
`enabled` | Enables or disables proxy support. Default is false.
`internalProxies` | A regular expression containing the IP addresses of all trusted proxies. The pattern `.*` trusts all internal proxies.
`remoteIpHeader` | Name of the HTTP header field that has the hostname chain. Default is `x-forwarded-for`.

To determine whether a request comes from a trusted internal proxy, the Security plugin compares the remote address of the HTTP request with the list of configured internal proxies.  If the remote address is not in the list, the plugin treats the request like a client request.


## Enable proxy authentication

Configure the names of the HTTP header fields that carry the authenticated username and role(s) in in the `proxy` HTTP authenticator section:

```yml
proxy_auth_domain:
  http_enabled: true
  transport_enabled: true
  order: 0
  http_authenticator:
    type: proxy
    challenge: false
    config:
      user_header: "x-proxy-user"
      roles_header: "x-proxy-roles"
  authentication_backend:
    type: noop
```

Name | Description
:--- | :---
`user_header` | The HTTP header field containing the authenticated username. Default is `x-proxy-user`.
`roles_header` | The HTTP header field containing the comma-separated list of authenticated role names. The Security plugin uses the roles found in this header field as backend roles. Default is `x-proxy-roles`.
`roles_separator` | The separator for roles. Default is `,`.


## Enable extended proxy authentication

The Security plugin has an extended version of the `proxy` type that lets you pass additional user attributes for use with document-level security. Aside from `type: extended-proxy` and `attr_header_prefix`, configuration is identical:

```yml
proxy_auth_domain:
  http_enabled: true
  transport_enabled: true
  order: 0
  http_authenticator:
    type: extended-proxy
    challenge: false
    config:
      user_header: "x-proxy-user"
      roles_header: "x-proxy-roles"
      attr_header_prefix: "x-proxy-ext-"
  authentication_backend:
    type: noop
```

Name | Description
:--- | :---
`attr_header_prefix` | The header prefix that the proxy uses to provide user attributes. For example, if the proxy provides `x-proxy-ext-namespace: my-namespace`, use `${attr.proxy.namespace}` in document-level security queries.


## Example

The following example uses an nginx proxy in front of a three-node OpenSearch cluster. For simplicity, we use hardcoded values for `x-proxy-user` and `x-proxy-roles`. In a real world example you would set these headers dynamically. The example also includes a commented header for use with the extended proxy.

```
events {
  worker_connections  1024;
}

http {

  upstream opensearch {
    server node1.example.com:9200;
    server node2.example.com:9200;
    server node3.example.com:9200;
    keepalive 15;
  }

  server {
    listen       8090;
    server_name  nginx.example.com;

    location / {
      proxy_pass https://opensearch;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header x-proxy-user test;
      proxy_set_header x-proxy-roles test;
      #proxy_set_header x-proxy-ext-namespace my-namespace;
    }
  }

}
```

The corresponding minimal `config.yml` looks like:

```yml
---
_meta:
  type: "config"
  config_version: 2

config:
  dynamic:
    http:
      xff:
        enabled: true
        internalProxies: '172.16.0.203' # the nginx proxy
    authc:
      proxy_auth_domain:
        http_enabled: true
        transport_enabled: true
        order: 0
        http_authenticator:
          type: proxy
          #type: extended-proxy
          challenge: false
          config:
            user_header: "x-proxy-user"
            roles_header: "x-proxy-roles"
            #attr_header_prefix: "x-proxy-ext-"
        authentication_backend:
          type: noop
```

The important part is to enable the `X-Forwarded-For (XFF)` resolution and set the IP(s) of the internal proxies correctly:

```yml
enabled: true
internalProxies: '172.16.0.203' # nginx proxy
```

In this case, `nginx.example.com` runs on `172.16.0.203`, so add this IP to the list of internal proxies. Be sure to set `internalProxies` to the minimum number of IP addresses so that the Security plugin only accepts requests from trusted IPs.


## OpenSearch Dashboards proxy authentication

To use proxy authentication with OpenSearch Dashboards, the most common configuration is to place the proxy in front of OpenSearch Dashboards and let OpenSearch Dashboards pass the user and role headers to the Security plugin.

In this case, the remote address of the HTTP call is the IP of OpenSearch Dashboards, because it sits directly in front of OpenSearch. Add the IP of OpenSearch Dashboards to the list of internal proxies:

```yml
---
_meta:
  type: "config"
  config_version: 2

config:
  dynamic:
    http:
      xff:
        enabled: true
        remoteIpHeader: "x-forwarded-for"
        internalProxies: '<opensearch-dashboards-ip-address>'
```

To pass the user and role headers that the authenticating proxy adds from OpenSearch Dashboards to the Security plugin, add them to the HTTP header allow list in `opensearch_dashboards.yml`:

```yml
opensearch.requestHeadersAllowlist: ["securitytenant","Authorization","x-forwarded-for","x-proxy-user","x-proxy-roles"]
```

You must also enable the authentication type in `opensearch_dashboards.yml`:

```yml
opensearch_security.auth.type: "proxy"
opensearch_security.proxycache.user_header: "x-proxy-user"
opensearch_security.proxycache.roles_header: "x-proxy-roles"
```
