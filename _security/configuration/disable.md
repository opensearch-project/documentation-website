---
layout: default
title: Disabling security
parent: Configuration
nav_order: 40
redirect_from: 
 - /security-plugin/configuration/disable/
---

# Disabling security

You might want to temporarily disable the Security plugin to make testing or internal usage more straightforward. The Security plugin is actually two plugins: one for OpenSearch and one for OpenSearch Dashboards. You can use the OpenSearch plugin independently, but the OpenSearch Dashboards plugin requires a secured OpenSearch cluster. 

To disable the OpenSearch Security plugin, add the following line in `opensearch.yml`:

```yml
plugins.security.disabled: true
```

If you disable the Security plugin in `opensearch.yml` (or delete the plugin entirely) and still want to use OpenSearch Dashboards, you must remove the corresponding OpenSearch Dashboards plugin. For more information, see [OpenSearch Dashboards remove plugins]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/plugins/#remove-plugins).

## Remove OpenSearch plugin

A more permanent option is to remove the Security plugin entirely:

1. Delete the `plugins/opensearch-security` folder on all nodes.
1. Delete all `plugins.security.*` configuration entries from `opensearch.yml`.
1. Uninstall the security plugin with the following command.
```bash
/usr/share/opensearch/opensearch-plugin remove opensearch-security
```

To perform these steps on the Docker image, see [Working with plugins]({{site.url}}{{site.baseurl}}/opensearch/install/docker#working-with-plugins).

Disabling or removing the plugin exposes the configuration index for the Security plugin. If the index contains sensitive information, be sure to protect it through some other means. If you no longer need the index, delete it.
{: .warning }


## Remove OpenSearch Dashboards plugin

Refer to the following installation types to remove the OpenSearch Dashboards plugin:

### Docker

1. Remove all security plugin related configuration from `opensearch_dashboards.yml` or use the example file and place the file in the same folder as `Dockerfile`.

   ```yml
   ---
   server.name: opensearch-dashboards
   server.host: "0.0.0.0"
   opensearch.hosts: http://localhost:9200
   ```

1. Create a new `Dockerfile`:

   ```
   FROM opensearchproject/opensearch-dashboards:{{site.opensearch_dashboards_version}}
   RUN /usr/share/opensearch-dashboards/bin/opensearch-dashboards-plugin remove securityDashboards
   COPY --chown=opensearch-dashboards:opensearch-dashboards opensearch_dashboards.yml /usr/share/opensearch-dashboards/config/
   ```

1. To build the new Docker image, run the following command:

   ```bash
   docker build --tag=opensearch-dashboards-no-security .
   ```

1. In `docker-compose.yml`, change `opensearchproject/opensearch-dashboards:{{site.opensearch_dashboards_version}}` to `opensearch-dashboards-no-security`.
1. Change `OPENSEARCH_HOSTS` or `opensearch.hosts` to `http://` rather than `https://`.
1. Enter `docker-compose up`.

### Binary 

1. Stop the running instance of OpenSearch Dashboards (Ctrl+C).

1. Navigate to the uncompressed OpenSearch Dashboards folder and run the following command to uninstall the secruity plugin. 

   ```bash
   ./bin/opensearch-dashboards-plugin remove securityDashboards
   ```

1. Remove all security plugin related configuration from the opensearch_dashbaords.yml or use the example file. 

   ```yml
   ---
   server.name: opensearch-dashboards
   server.host: "0.0.0.0"
   opensearch.hosts: http://localhost:9200
   ```
1. Start OpenSearch Dashboards.
   ```bash
   ./bin/opensearch-dashboards
   ```
   
### Service 

1. Stop the running instance of OpenSearch Dashboards with the following command: 

   ```bash
   sudo systemctl stop opensearch-dashboards
   ```

1. Navigate to the OpenSearch Dashboards folder `/usr/share/opensearch-dashboards` and run the following command to uninstall the secruity plugin. 

   ```bash
   ./bin/opensearch-dashboards-plugin remove securityDashboards
   ```

1. Remove all security plugin related configuration from the opensearch_dashbaords.yml, or use the example file and place the file in the /etc/opensearch_dashboards folder.

   ```yml
   ---
   server.name: opensearch-dashboards
   server.host: "0.0.0.0"
   opensearch.hosts: http://localhost:9200
   ```
1. Start OpenSearch Dashboards.
   ```bash
   sudo systemctl start opensearch-dashboards
   ```