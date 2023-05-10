---
layout: default
title: Disabling security
parent: Configuration
nav_order: 40
redirect_from: 
 - /security-plugin/configuration/disable/
---

# Disabling security

You might want to temporarily disable the Security plugin to make testing or internal usage more straightforward. To disable the plugin, add the following line in `opensearch.yml`:

```yml
plugins.security.disabled: true
```

A more permanent option is to remove the Security plugin entirely:

1. Delete the `plugins/opensearch-security` folder on all nodes.
1. Delete all `plugins.security.*` configuration entries from `opensearch.yml`.

To perform these steps on the Docker image, see [Working with plugins]({{site.url}}{{site.baseurl}}/opensearch/install/docker#working-with-plugins).

Disabling or removing the plugin exposes the configuration index for the Security plugin. If the index contains sensitive information, be sure to protect it through some other means. If you no longer need the index, delete it.
{: .warning }


## Remove OpenSearch Dashboards plugin

The Security plugin is actually two plugins: one for OpenSearch and one for OpenSearch Dashboards. You can use the OpenSearch plugin independently, but the OpenSearch Dashboards plugin depends on a secured OpenSearch cluster.

If you disable the Security plugin in `opensearch.yml` (or delete the plugin entirely) and still want to use OpenSearch Dashboards, you must remove the corresponding OpenSearch Dashboards plugin. For more information, see [OpenSearch Dashboards remove plugins]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/plugins/#remove-plugins).


### Docker

1. Create a new `Dockerfile`:

   ```
   FROM opensearchproject/opensearch-dashboards:{{site.opensearch_dashboards_version}}
   RUN /usr/share/opensearch-dashboards/bin/opensearch-dashboards-plugin remove securityDashboards
   COPY --chown=opensearch-dashboards:opensearch-dashboards opensearch_dashboards.yml /usr/share/opensearch-dashboards/config/
   ```

   In this case, `opensearch_dashboards.yml` is a "vanilla" version of the file with no entries for the Security plugin. It might look like this:

   ```yml
   ---
   server.name: opensearch-dashboards
   server.host: "0.0.0.0"
   opensearch.hosts: http://localhost:9200
   ```


1. To build the new Docker image, run the following command:

   ```bash
   docker build --tag=opensearch-dashboards-no-security .
   ```

1. In `docker-compose.yml`, change `opensearchproject/opensearch-dashboards:{{site.opensearch_dashboards_version}}` to `opensearch-dashboards-no-security`.
1. Change `OPENSEARCH_HOSTS` or `opensearch.hosts` to `http://` rather than `https://`.
1. Enter `docker-compose up`.
