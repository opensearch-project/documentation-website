---
layout: default
title: Configuring Content Security Policy rules dynamically
nav_order: 110
has_children: false
canonical_url: https://docs.opensearch.org/latest/dashboards/csp/csp-dynamic-configuration/
---

# Configuring Content Security Policy rules dynamically
Introduced 2.13
{: .label .label-purple }

Content Security Policy (CSP) is a security standard intended to prevent cross-site scripting (XSS), `clickjacking`, and other code injection attacks resulting from the execution of malicious content in the trusted webpage context. OpenSearch Dashboards supports configuring CSP rules in the `opensearch_dashboards.yml` file by using the `csp.rules` key. A change in the YAML file requires a server restart, which may interrupt service availability. You can, however, configure the CSP rules dynamically through the `applicationConfig` plugin without restarting the server.

## Configuration

The `applicationConfig` plugin provides read and write APIs that allow OpenSearch Dashboards users to manage dynamic configurations as key-value pairs in an index. The `cspHandler` plugin registers a pre-response handler to `HttpServiceSetup`, which gets CSP rules from the dependent `applicationConfig` plugin and then rewrites to the CSP header. Enable both plugins within your `opensearch_dashboards.yml` file to use this feature. The configuration is shown in the following example. Refer to the `cspHandler` plugin [README](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/src/plugins/csp_handler/README.md) for configuration details.

```
application_config.enabled: true
csp_handler.enabled: true
```

## Enable site embedding for OpenSearch Dashboards

To enable site embedding for OpenSearch Dashboards, update the CSP rules using CURL. When using CURL commands with single quotation marks inside the `data-raw` parameter, escape them with a backslash (`\`). For example, use `'\''` to represent `'`. The configuration is shown in the following example. Refer to the `applicationConfig` plugin [README](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/src/plugins/application_config/README.md) for configuration details.

```
curl '{osd endpoint}/api/appconfig/csp.rules' -X POST -H 'Accept: application/json' -H 'Content-Type: application/json' -H 'osd-xsrf: osd-fetch' -H 'Sec-Fetch-Dest: empty' --data-raw '{"newValue":"script-src '\''unsafe-eval'\'' '\''self'\''; worker-src blob: '\''self'\''; style-src '\''unsafe-inline'\'' '\''self'\''; frame-ancestors '\''self'\'' {new site}"}'
```

## Delete CSP rules

Use the following CURL command to delete CSP rules:

```
curl '{osd endpoint}/api/appconfig/csp.rules' -X DELETE -H 'osd-xsrf: osd-fetch' -H 'Sec-Fetch-Dest: empty'
```

## Get CSP rules

Use the following CURL command to get CSP rules:

```
curl '{osd endpoint}/api/appconfig/csp.rules'

```

## Precedence

Dynamic configurations override YAML configurations, except for empty CSP rules. To prevent `clickjacking`, a `frame-ancestors: self` directive is automatically added to YAML-defined rules when necessary.
