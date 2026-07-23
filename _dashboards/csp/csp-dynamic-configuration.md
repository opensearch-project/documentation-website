---
layout: default
title: CSP rules
parent: Settings and administration
nav_order: 60
has_children: false
---

# CSP rules
Introduced 2.13
{: .label .label-purple }

Content Security Policy (CSP) is a security standard intended to prevent cross-site scripting (XSS), clickjacking, and other code injection attacks. OpenSearch Dashboards enforces CSP by sending a `Content-Security-Policy` response header on every page load.


## Configuration

To configure CSP, add the following keys to `opensearch_dashboards.yml`. All `allowed*Sources` values are appended to the strict policy defaults for that directive:

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
{% include copy.html %}

Then restart OpenSearch for the changes to take effect.

## CSP settings 

The following table describes the available CSP settings.

Setting | Type | Description
:--- | :--- | :---
`csp.enable` | Boolean | Enables strict CSP enforcement. Default is `true`.
`csp.allowedFrameAncestorSources` | Array of strings | Origins appended to the `frame-ancestors` directive. Use to allow embedding Dashboards in an iframe.
`csp.allowedConnectSources` | Array of strings | Origins appended to `connect-src`. Use to allow browser-initiated requests to external endpoints (fetch, XHR, or WebSocket).
`csp.allowedImgSources` | Array of strings | Origins appended to `img-src`. Use to allow images from external CDNs or tile servers.
`csp.loosenCspDirectives` | Array of strings | Directive names to relax back to their non-strict default values.

## Enabling site embedding

To embed OpenSearch Dashboards in an iframe on another site, add that site to `csp.allowedFrameAncestorSources`:

```yaml
csp.allowedFrameAncestorSources: ["https://portal.example.com"]
```
{% include copy.html %}

This produces the following `frame-ancestors` directive in the response header:

```
frame-ancestors 'self' https://portal.example.com
```

## Report-only mode

To audit a new CSP policy without enforcing it, enable the `Content-Security-Policy-Report-Only` header. Violations are reported but no content is blocked:

```yaml
csp-report-only.isEmitting: true
csp-report-only.allowedFrameAncestorSources: ["https://portal.example.com"]
csp-report-only.allowedConnectSources: ["https://api.example.com"]
csp-report-only.allowedImgSources: ["https://cdn.example.com"]
```
{% include copy.html %}

## Configuring CSP rules using applicationConfig (deprecated)

**Deprecated.** In OpenSearch Dashboards 2.13--2.16, you could set the `frame-ancestors` directive dynamically using a REST API using the `applicationConfig` and `cspHandler` plugins. This approach is no longer functional. Use the `csp.*` settings instead.
