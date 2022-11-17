---
layout: default
title: Configuration
nav_order: 5
has_children: true
has_toc: false
redirect_from:
  - /security-plugin/configuration/
---

# Security configuration

The plugin includes demo certificates so that you can get up and running quickly. To use OpenSearch in a production environment, you must configure it manually:

1. [Replace the demo certificates]({{site.url}}{{site.baseurl}}/opensearch/install/docker#configuring-basic-security-settings).
1. [Reconfigure `opensearch.yml` to use your certificates]({{site.url}}{{site.baseurl}}/security-plugin/configuration/tls).
1. [Reconfigure `config.yml` to use your authentication backend]({{site.url}}{{site.baseurl}}/security-plugin/configuration/configuration/) (if you don't plan to use the internal user database).
1. [Modify the configuration YAML files]({{site.url}}{{site.baseurl}}/security-plugin/configuration/yaml).
1. If you plan to use the internal user database, [set a password policy in `opensearch.yml`]({{site.url}}{{site.baseurl}}/security-plugin/configuration/yaml/#opensearchyml).
1. [Apply changes using the `securityadmin` script]({{site.url}}{{site.baseurl}}/security-plugin/configuration/security-admin).
1. Start OpenSearch.
1. [Add users, roles, role mappings, and tenants]({{site.url}}{{site.baseurl}}/security-plugin/access-control/index/).

If you don't want to use the plugin, see [Disable security]({{site.url}}{{site.baseurl}}/security-plugin/configuration/disable).

The security plugin has several default users, roles, action groups, permissions, and settings for OpenSearch Dashboards that use kibana in their names. We will change these names in a future release.
{: .note }
