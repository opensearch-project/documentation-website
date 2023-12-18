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


## Removing the OpenSearch plugin

A more permanent option is to remove the Security plugin entirely:

1. Delete the `plugins/opensearch-security` folder on all nodes.
1. Delete all `plugins.security.*` configuration entries from `opensearch.yml`.
1. Uninstall the Security plugin by using the following command:
```bash
/usr/share/opensearch/opensearch-plugin remove opensearch-security
```

To perform these steps on the Docker image, see [Working with plugins]({{site.url}}{{site.baseurl}}/opensearch/install/docker#working-with-plugins).

Disabling or removing the plugin exposes the configuration index for the Security plugin. If the index contains sensitive information, be sure to protect it through some other means. If you no longer need the index, delete it.
{: .warning }


## Removing the OpenSearch Dashboards plugin

If you disable the Security plugin in `opensearch.yml` (or delete the plugin entirely) and still want to use OpenSearch Dashboards, you must remove the corresponding OpenSearch Dashboards plugin. For more information, see [OpenSearch Dashboards remove plugins]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/plugins/#remove-plugins).

Refer to the following installation types to remove the OpenSearch Dashboards plugin.

### Docker

1. Remove all Security plugin related configuration from `opensearch_dashboards.yml` or use the example file and place the file in the same folder as the `Dockerfile`.

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

### Tarball 

1. Navigate to the `/bin` directory in your OpenSearch Dashboards installation folder and stop the running OpenSearch Dashboards instance by pressing `Ctrl + C`.

1. Run the following command to uninstall the Security plugin:

   ```bash
   ./bin/opensearch-dashboards-plugin remove securityDashboards
   ```

1. Remove all Security plugin related configuration from the opensearch_dashbaords.yml file or use the following example file. 

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
   
### RPM and Debian 

1. Stop the running instance of OpenSearch Dashboards by using the following command: 

   ```bash
   sudo systemctl stop opensearch-dashboards
   ```

1. Navigate to the OpenSearch Dashboards folder `/usr/share/opensearch-dashboards` and run the following command to uninstall the Security plugin:

   ```bash
   ./bin/opensearch-dashboards-plugin remove securityDashboards
   ```

1. Remove all Security plugin related configuration from the opensearch_dashbaords.yml file, or use the example file and place the file in the `/etc/opensearch_dashboards` folder.

   ```yml
   ---
   server.name: opensearch-dashboards
   server.host: "0.0.0.0"
   opensearch.hosts: http://localhost:9200
   ```
1. Start OpenSearch Dashboards:
   ```bash
   sudo systemctl start opensearch-dashboards
   ```
