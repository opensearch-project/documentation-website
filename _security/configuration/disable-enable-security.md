---
layout: default
title: Disabling and enabling the Security plugin
parent: Configuration
nav_order: 40
has_toc: true
redirect_from: 
 - /security-plugin/configuration/disable/
---

# Disabling and enabling the Security plugin

The Security plugin is installed by default with OpenSearch, but you can temporarily disable it or remove it altogether. Disabling the plugin involves a change to the `opensearch.yml` file, and you may want to do this to streamline testing. A more substantive change is to remove the Security plugin completely. You might want to remove it if, for example, you have your own security solution or need to remove it for development purposes. 

Disabling or removing the plugin exposes the configuration index for the Security plugin. If the index contains sensitive information, be sure to protect it through some other means. If you no longer need the index, delete it.
{: .warning }

## Disabling/Enabling the Security plugin

You can disable the Security plugin by editing the `opensearch.yml` file.   

```yml
plugins.security.disabled: true
```
You can then enable the plugin by removing the `plugins.security.disabled` setting.

## Removing/Adding the Security plugin

We recommend that you take advantage of the rich features of the Security plugin, but you can completely remove the Security plugin from your OpenSearch instance. Note that OpenSearch Dashboards can only run against a secure cluster, so if you uninstall the OpenSearch Security plugin, you'll have to also uninstall the Dashboard plugin. 

### Removing the Security plugin from OpenSearch

Do the following to remove the plugin from the OpenSearch core.

1. Delete the `plugins/opensearch-security` folder on all nodes.
1. Delete all `plugins.security.*` configuration entries from `opensearch.yml`.
1. Uninstall the Security plugin by using the following command:

```bash
/usr/share/opensearch/opensearch-plugin remove opensearch-security
```

To perform these steps on the Docker image, see [Working with plugins]({{site.url}}{{site.baseurl}}/opensearch/install/docker#working-with-plugins).
{: .note }

### Removing the Security plugin from OpenSearch Dashboards 

If you disable the Security plugin in `opensearch.yml` and still want to use OpenSearch Dashboards, you must remove the corresponding OpenSearch Dashboards Security plugin. For more information, see [OpenSearch Dashboards remove plugins]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/plugins/#remove-plugins).

Refer to the following installation types to remove the OpenSearch Dashboards plugin.

#### Docker

1. Remove all Security plugin configuration settings from `opensearch_dashboards.yml` or place the example file in the same folder as the `Dockerfile`:

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

#### Tarball 

1. Navigate to the `/bin` directory in your OpenSearch Dashboards installation folder and stop the running OpenSearch Dashboards instance by pressing `Ctrl + C`.

1. Run the following command to uninstall the Security plugin:

   ```bash
   ./bin/opensearch-dashboards-plugin remove securityDashboards
   ```

1. Remove all Security plugin configuration settings from the `opensearch_dashboards.yml` file or use the following example file: 

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
   
#### RPM and Debian 

1. Stop the running instance of OpenSearch Dashboards by using the following command. 

   ```bash
   sudo systemctl stop opensearch-dashboards
   ```

1. Navigate to the OpenSearch Dashboards folder `/usr/share/opensearch-dashboards` and run the following command to uninstall the Security plugin.

   ```bash
   ./bin/opensearch-dashboards-plugin remove securityDashboards
   ```

1. Remove all Security plugin configuration settings from the `opensearch_dashboards.yml` file or place the example file in the `/etc/opensearch_dashboards` folder.

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

### Installing the Security plugin

Use the following steps to reinstall the plugin. 

After installing the Security plugin, a full cluster restart is necessary to enable security features.
{: .warning}

1. Disable shard allocation and stop all nodes so that you prevent shards from moving when the cluster is restarted.

  ```json
  curl -XPUT "http://localhost:9200/_cluster/settings" -H 'Content-Type: application/json' -d '{
    "transient": {
      "cluster.routing.allocation.enable": "none"
      }
   }'
  ```
  {% include copy.html %}
 
2. Install the Security plugin on all nodes in your cluster.

  ```bash
  bin/opensearch-plugin install opensearch-security
  ```
  {% include copy.html %}
  
3. Add the necessary configuration to opensearch.yml for TLS encryption. See
[Configuration]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/) for details on the settings that need to be configured.

4. Create the `OPENSEARCH_INITIAL_ADMIN_PASSWORD` variable. For more information, see [Setting up a custom admin password](https://opensearch.org/docs/latest/security/configuration/demo-configuration/#setting-up-a-custom-admin-password).
  
5. Restart the nodes and reenable shard allocation.

   ```json
   curl -XPUT "http://localhost:9200/_cluster/settings" -H 'Content-Type: application/json' -d '{
     "transient": {
      "cluster.routing.allocation.enable": "all"
     }
   }'
   ```
   {% include copy.html %}

### Installing the Security plugin on OpenSearch Dashboards

Use the following steps to reinstall the plugin on OpenSearch Dashboards. 

1. Stop running your OpenSearch Dashboards cluster. 
2. Install the Security plugin:

   ```bash
      ./bin/opensearch-dashboards-plugin install securityDashboards
   ```
   
4. Add the necessary [Configuration]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/tls/) settings in the `opensearch_dashboards.yml` file.
5. Start OpenSearch Dashboards. If the plugin was successfully installed, you'll be prompted to enter your log in credentials.
