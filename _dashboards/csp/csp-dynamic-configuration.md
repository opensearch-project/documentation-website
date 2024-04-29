---
layout: default
title: Configuring Content Security Policy directive `frame-ancestors` dynamically
nav_order: 110
has_children: false
---

# Configuring Content Security Policy directive `frame-ancestors` dynamically
Introduced 2.13
{: .label .label-purple }

Content Security Policy (CSP) is a security standard intended to prevent cross-site scripting (XSS), `clickjacking`, and other code injection attacks resulting from the execution of malicious content in the trusted webpage context. OpenSearch Dashboards supports configuring CSP rules in the `opensearch_dashboards.yml` file by using the `csp.rules` key. A change in the YAML file requires a server restart, which may interrupt service availability. You can, however, configure the directive `frame-ancestors` in the CSP rules dynamically through the `applicationConfig` plugin without restarting the server. The support for other directives is evaluated on a case-by-case basis due to security implications.

## Configuration

The `applicationConfig` plugin provides read and write APIs that allow OpenSearch Dashboards users to manage dynamic configurations as key-value pairs in an index. The `cspHandler` plugin registers a pre-response handler to `HttpServiceSetup`, which gets `frame-ancestors` value from the dependent `applicationConfig` plugin and then rewrites to the CSP header. Enable both plugins within your `opensearch_dashboards.yml` file to use this feature. The configuration is shown in the following example. Refer to [`cspHandler` plugin](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/src/plugins/csp_handler/README.md) for configuration details.

```
application_config.enabled: true
csp_handler.enabled: true
```

## Enable site embedding for OpenSearch Dashboards

To enable site embedding for OpenSearch Dashboards, update the directive `frame-ancestors` in the CSP rules using CURL. When using CURL commands with single quotation marks inside the `data-raw` parameter, escape them with a backslash (`\`). For example, use `'\''` to represent `'`. The configuration is shown in the following example. Refer to [`applicationConfig` plugin](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/src/plugins/application_config/README.md) for configuration details.

```
curl '{osd endpoint}/api/appconfig/csp.rules.frame-ancestors' -X POST -H 'Accept: application/json' -H 'Content-Type: application/json' -H 'osd-xsrf: osd-fetch' -H 'Sec-Fetch-Dest: empty' --data-raw '{"newValue":"{new site}"}'
```

## Delete `frame-ancestors` in CSP rules

Use the following cURL command to delete `frame-ancestors` in CSP rules:

```
curl '{osd endpoint}/api/appconfig/csp.rules.frame-ancestors' -X DELETE -H 'osd-xsrf: osd-fetch' -H 'Sec-Fetch-Dest: empty'
```

## Get `frame-ancestors` in CSP rules

Use the following cURL command to get `frame-ancestors` in CSP rules:

```
curl '{osd endpoint}/api/appconfig/csp.rules.frame-ancestors'

```

## Precedence

Dynamic configurations override YAML configurations, except for empty CSP rules. To prevent `clickjacking`, a `frame-ancestors: self` directive is automatically added to YAML-defined rules when necessary.

## Fine-grained access control

When the Security plugin is enabled, only users with write permission to the configuration index `.opensearch_dashboards_config` are able to call the mutating APIs. The API calls must have a valid cookie with the security information. To construct the cURL command, you can use a `Copy as cURL` option from the network tab of a browser development tool. For GET APIs, you can find an existing GET XHR request with type `json` from the network tab, copy it as cURL, and then replace it with the `appconfig` API names. Similarly, for POST and DELETE APIs, you can find an existing POST XHR request and update API name and the value of `--data-raw` accordingly. DELETE APIs must have their request method updated to `-X DELETE`.

An example of `Copy as cURL` in Firefox is shown in the following image.

![Copying as curl in Firefox]({{site.url}}{{site.baseurl}}/images/dashboards/copy-as-curl.png)