---
layout: default
title: Content Security Policy (CSP) Rules Dynamic Configuration
nav_order: 110
has_children: false
---

# Configuring content security policy rules dynamically

Content Security Policy (CSP) is a security standard introduced to help prevent cross-site scripting (XSS), `clickjacking`, and other code injection attacks resulting from the execution of malicious content in the trusted webpage context. OpenSearch Dashboards supports configuring CSP rules in OSD YML file with key `csp.rules`. A change in YML file requires a server restart which may interrupt service availability. This document introduces a dynamic way to configure the CSP rules through the plugin `applicationConfig` without restarting the server.

## Configuration

The plugin `applicationConfig` provides read and write APIs for OSD customers to manage their dynamic configurations as key value pairs in an index. Another plugin `cspHandler` registers a pre-response handler to `HttpServiceSetup` which can get CSP rules from the dependent plugin `applicationConfig` and then rewrite to CSP header. Customers who want to use this feature need to enable both plugins in OSD YML as follows.

```
application_config.enabled: true
csp_handler.enabled: true

```

For OSD users who want to make changes to allow a new site to embed OSD pages, they can update CSP rules through CURL. (See the README of `applicationConfig` for more details about the APIs.) **Note that use backslash as string wrapper for single quotes inside the `data-raw` parameter. E.g use `'\''` to represent `'`**
s
```
curl '{osd endpoint}/api/appconfig/csp.rules' -X POST -H 'Accept: application/json' -H 'Content-Type: application/json' -H 'osd-xsrf: osd-fetch' -H 'Sec-Fetch-Dest: empty' --data-raw '{"newValue":"script-src '\''unsafe-eval'\'' '\''self'\''; worker-src blob: '\''self'\''; style-src '\''unsafe-inline'\'' '\''self'\''; frame-ancestors '\''self'\'' {new site}"}'

```

Following is the CURL command to delete CSP rules.

```
curl '{osd endpoint}/api/appconfig/csp.rules' -X DELETE -H 'osd-xsrf: osd-fetch' -H 'Sec-Fetch-Dest: empty'
```

Following is the CURL command to get the CSP rules.

```
curl '{osd endpoint}/api/appconfig/csp.rules'

```

## Precedence

In general, the dynamic configurations will take precedence over the configurations in YML. Specifically, when there is non empty CSP rules configured in the index, the rules from the YML will be used. To prevent `clickjacking`, we will append the `frame-ancestors` directive with value `'self'` if the rules from YML will be used and do not already have the directive `frame-ancestors`.
