---
layout: default
title: Configuring CSP rules
parent: Settings and administration
nav_order: 60
has_children: false
---

# Configuring CSP rules
Introduced 2.13
{: .label .label-purple }

Content Security Policy (CSP) is a security standard intended to prevent cross-site scripting (XSS), clickjacking, and other code injection attacks. OpenSearch Dashboards enforces CSP by sending a `Content-Security-Policy` response header on every page load.

You can configure CSP rules in `opensearch_dashboards.yml`. A server restart is required after any change.

## Configuration

Add the following keys to `opensearch_dashboards.yml` to configure CSP. All `allowed*Sources` values are appended to the strict policy defaults for that directive.

```yaml
# Enable strict CSP enforcement.
csp.enable: true

# Append trusted origins to frame-ancestors (controls iframe embedding).
csp.allowedFrameAncestorSources: ["https://portal.example.com"]

# Append trusted origins to connect-src (fetch/XHR calls from the browser).
csp.allowedConnectSources: ["https://api.example.com"]

# Append trusted origins to img-src.
csp.allowedImgSources: ["https://cdn.example.com"]

# Relax specific directives back to their non-strict defaults
# while keeping the rest of the policy strict.
csp.loosenCspDirectives: ["style-src"]
```

Setting | Type | Description
:--- | :--- | :---
`csp.enable` | Boolean | Enables strict CSP enforcement. Default: `true`.
`csp.allowedFrameAncestorSources` | Array of strings | Origins appended to the `frame-ancestors` directive. Use to allow embedding Dashboards in an iframe.
`csp.allowedConnectSources` | Array of strings | Origins appended to `connect-src`. Use to allow browser-initiated requests (fetch, XHR, WebSocket) to external endpoints.
`csp.allowedImgSources` | Array of strings | Origins appended to `img-src`. Use to allow images from external CDNs or tile servers.
`csp.loosenCspDirectives` | Array of strings | Directive names to relax back to their non-strict default values.

## Enable site embedding

To embed OpenSearch Dashboards in an iframe on another site, add that site to `csp.allowedFrameAncestorSources`:

```yaml
csp.allowedFrameAncestorSources: ["https://portal.example.com"]
```

This produces the following `frame-ancestors` directive in the response header:

```
frame-ancestors 'self' https://portal.example.com
```

## Report-only mode

To audit a new CSP policy without enforcing it, enable the `Content-Security-Policy-Report-Only` header. Violations are reported but no content is blocked.

```yaml
csp-report-only.isEmitting: true
csp-report-only.allowedFrameAncestorSources: ["https://portal.example.com"]
csp-report-only.allowedConnectSources: ["https://api.example.com"]
csp-report-only.allowedImgSources: ["https://cdn.example.com"]
```

## Fine-grained access control

CSP configuration is managed through `opensearch_dashboards.yml` and requires access to the server's file system. Only administrators with access to the server configuration should modify these settings.

When the Security plugin is enabled, ensure that any related index permissions are restricted to trusted administrator accounts.

## Deprecated: applicationConfig approach (2.13–2.16)

**Deprecated.** In OpenSearch Dashboards 2.13–2.16, the `frame-ancestors` directive could be set dynamically via a REST API using the `applicationConfig` and `cspHandler` plugins. This approach is no longer functional—the API still accepts values but they are not applied to the `Content-Security-Policy` header. Use the `csp.*` settings above instead.

The following is documented for reference only.

Enable the plugins in `opensearch_dashboards.yml`:

```yaml
application_config.enabled: true
csp_handler.enabled: true
```

Set, delete, or get `frame-ancestors` via cURL:

```bash
# Set
curl '{osd endpoint}/api/appconfig/csp.rules.frame-ancestors' \
  -X POST \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'osd-xsrf: osd-fetch' \
  --data-raw '{"newValue":"'\''self'\'' https://portal.example.com"}'

# Delete
curl '{osd endpoint}/api/appconfig/csp.rules.frame-ancestors' \
  -X DELETE -H 'osd-xsrf: osd-fetch'

# Get
curl '{osd endpoint}/api/appconfig/csp.rules.frame-ancestors'
```
