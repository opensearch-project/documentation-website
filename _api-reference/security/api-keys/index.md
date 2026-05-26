---
layout: default
title: API Key APIs
grand_parent: Security APIs
parent: Security APIs
nav_order: 50
has_children: true
has_toc: false
---

# API Key APIs
**Introduced 3.7**
{: .label .label-purple }

The API Key APIs let security administrators create, list, and revoke API keys for programmatic access to OpenSearch.

## Endpoints

The API Key APIs support the following endpoints:

- [Create an API key]({{site.url}}{{site.baseurl}}/api-reference/security/api-keys/create/)
- [List API keys]({{site.url}}{{site.baseurl}}/api-reference/security/api-keys/list/)
- [Revoke an API key]({{site.url}}{{site.baseurl}}/api-reference/security/api-keys/revoke/)

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:admin/plugins/security/api_token`.
