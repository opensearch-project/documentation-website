---
layout: default
title: Configuring CSP rules for `frame-ancestors`
nav_order: 140
has_children: false
canonical_url: https://docs.opensearch.org/latest/dashboards/csp/csp-dynamic-configuration/
---

# Configuring CSP rules for `frame-ancestors`
Introduced 2.13
{: .label .label-purple }

Content Security Policy (CSP) is a security standard intended to prevent cross-site scripting (XSS), `clickjacking`, and other code injection attacks resulting from the launch of malicious content in the trusted webpage context. OpenSearch Dashboards supports configuring CSP rules in the `opensearch_dashboards.yml` file by using the `csp.rules` key. A change in the YAML file requires a server restart, which may interrupt service availability. You can, however, dynamically configure the `frame-ancestors` directive in the CSP rules through the `applicationConfig` plugin without restarting the server. Support for other directives is evaluated based on security ramifications.

## Configuration

The `applicationConfig` plugin provides read and write APIs that allow OpenSearch Dashboards users to manage dynamic configurations as key-value pairs in an index. The `cspHandler` plugin registers a pre-response handler to `HttpServiceSetup`, which gets the `frame-ancestors` value from the dependent `applicationConfig` plugin and then rewrites it to the CSP header. Enable both plugins in your `opensearch_dashboards.yml` file to use this feature. The configuration is shown in the following example. Refer to [`cspHandler` plugin](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/src/plugins/csp_handler/README.md) for more information.

```
application_config.enabled: true
csp_handler.enabled: true
```

## Enable site embedding for OpenSearch Dashboards

To enable site embedding for OpenSearch Dashboards, update the `frame-ancestors` directive in the CSP rules using cURL. When using cURL commands with single quotation marks in the `data-raw` parameter, escape them with a backslash (`\`). For example, use `'\''` to represent `'`. The configuration is shown in the following example. Refer to [`applicationConfig` plugin](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/src/plugins/application_config/README.md) for more information.

```
curl '{osd endpoint}/api/appconfig/csp.rules.frame-ancestors' -X POST -H 'Accept: application/json' -H 'Content-Type: application/json' -H 'osd-xsrf: osd-fetch' -H 'Sec-Fetch-Dest: empty' --data-raw '{"newValue":"{new site}"}'
```

## Delete `frame-ancestors` in the CSP rules

Use the following cURL command to delete `frame-ancestors` in the CSP rules:

```
curl '{osd endpoint}/api/appconfig/csp.rules.frame-ancestors' -X DELETE -H 'osd-xsrf: osd-fetch' -H 'Sec-Fetch-Dest: empty'
```

## Get `frame-ancestors` in the CSP rules

Use the following cURL command to get `frame-ancestors` in the CSP rules:

```
curl '{osd endpoint}/api/appconfig/csp.rules.frame-ancestors'
```

## Precedence

Dynamic configurations override YAML configurations, except for empty CSP rules. To prevent `clickjacking`, a `frame-ancestors: self` directive is automatically added to YAML-defined rules when necessary.

## Fine-grained access control

When the Security plugin is enabled, only users with write permissions to the configuration index `.opensearch_dashboards_config` are able to call the mutating APIs. The API calls must have a valid cookie containing the security information. To construct the cURL command, you can use a `Copy as cURL` option from the network tab of a browser development tool. For GET APIs, you can find an existing GET XHR request with type `json` from the network tab, copy it as cURL, and then replace it with the `appconfig` API names. Similarly, for POST and DELETE APIs, you can find an existing POST XHR request and update the API name and the value of `--data-raw` accordingly. DELETE APIs must have their request method updated to `-X DELETE`.

An example of the `Copy as cURL` option in Firefox is shown in the following image.

![Copying as curl in Firefox]({{site.url}}{{site.baseurl}}/images/dashboards/copy-as-curl.png)
