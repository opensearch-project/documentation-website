---
layout: default
title: Disabling and enabling the Security plugin
parent: Configuration
nav_order: 40
has_toc: true
redirect_from: 
 - /security-plugin/configuration/disable/
canonical_url: https://docs.opensearch.org/latest/security/configuration/disable-enable-security/
---

# Disabling and enabling the Security plugin

The Security plugin is installed by default with OpenSearch, but you can temporarily disable it or remove it altogether. Disabling the plugin involves a change to the `opensearch.yml` file; you may want to do this to streamline testing. A more substantive change is required to remove the Security plugin completely. You might want to remove it if, for example, you are using your own security solution or need to remove it for development purposes. 

Disabling or removing the plugin exposes the configuration index for the Security plugin. If the index contains sensitive information, make sure to protect it through some other means. If you no longer need the index, delete it.
{: .warning }

Disabling, removing, or installing the Security plugin requires a full cluster restart because during this process, the individual nodes are not able to communicate with each other.
{: .warning}

## Disabling/enabling the Security plugin

You can disable the Security plugin by editing the `opensearch.yml` file:

```yml
plugins.security.disabled: true
```
You can then enable the plugin by removing the `plugins.security.disabled` setting.

## Removing and adding the Security plugin

You can completely remove the Security plugin from your OpenSearch instance. Note that OpenSearch Dashboards can only run against a secure cluster, so if you uninstall the Security plugin, you'll also need to uninstall the OpenSearch Dashboards plugin. 

### Removing the Security plugin from OpenSearch

Do the following to remove the plugin from OpenSearch.

1. Disable shard allocation and stop all nodes so that shards don't move when the cluster is restarted:

   ```json
   curl -XPUT "https://localhost:9200/_cluster/settings" -u "admin:<password>" -H 'Content-Type: application/json' -d '{
      "transient": {
         "cluster.routing.allocation.enable": "none"
      }
   }'
   ```
   {% include copy.html %}
2. Delete all `plugins.security.*` configuration entries from `opensearch.yml`.
3. Uninstall the Security plugin by using the following command:

   ```bash
   ./bin/opensearch-plugin remove opensearch-security
   ```
4. Restart the nodes and enable shard allocation:
   ```json
   curl -XPUT "http://localhost:9200/_cluster/settings" -H 'Content-Type: application/json' -d '{
    "transient": {
      "cluster.routing.allocation.enable": "all"
      }
   }'
   ```

To perform these steps on the Docker image, see [Working with plugins]({{site.url}}{{site.baseurl}}/opensearch/install/docker#working-with-plugins).
{: .note }

### Removing the Security plugin from OpenSearch Dashboards 

If you disable the Security plugin in `opensearch.yml` and still want to use OpenSearch Dashboards, you must remove the corresponding OpenSearch Dashboards Security plugin. For more information, see [Remove plugins]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/plugins/#remove-plugins).

Refer to the following installation types to remove the OpenSearch Dashboards plugin.

#### Docker

1. Remove all Security plugin configuration settings from `opensearch_dashboards.yml` or move the example file to the same folder as the `Dockerfile`:

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
1. Enter `docker compose up`.

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
   
1. Start OpenSearch Dashboards:
   ```bash
   ./bin/opensearch-dashboards
   ```
   
#### RPM and Debian 

1. Stop the running instance of OpenSearch Dashboards by using the following command:

   ```bash
   sudo systemctl stop opensearch-dashboards
   ```

1. Navigate to the OpenSearch Dashboards folder `/usr/share/opensearch-dashboards` and run the following command to uninstall the Security plugin:

   ```bash
   ./bin/opensearch-dashboards-plugin remove securityDashboards
   ```

1. Remove all Security plugin configuration settings from the `opensearch_dashboards.yml` file or place the example file in the `/etc/opensearch_dashboards` folder:

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

### Installing the Security plugin

Use the following steps to reinstall the plugin:

1. Disable shard allocation and stop all nodes so that shards don't move when the cluster is restarted:

    ```json
    curl -XPUT "http://localhost:9200/_cluster/settings" -H 'Content-Type: application/json' -d '{
      "transient": {
        "cluster.routing.allocation.enable": "none"
        }
     }'
    ```
    {% include copy.html %}
 
2. Install the Security plugin on all nodes in your cluster using one of the [installation methods]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/#install):

    ```bash
    bin/opensearch-plugin install opensearch-security
    ```
    {% include copy.html %}
    
3. Add the necessary configuration to `opensearch.yml` for TLS encryption. See
[Configuration]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/) for information about the settings that need to be configured.

4. Create the `OPENSEARCH_INITIAL_ADMIN_PASSWORD` variable. For more information, see [Setting up a custom admin password]({{site.url}}{{site.baseurl}}/security/configuration/demo-configuration/#setting-up-a-custom-admin-password).
  
5. Restart the nodes and reenable shard allocation:

   ```json
   curl -XPUT "https://localhost:9200/_cluster/settings" -u "admin:<password>" -H 'Content-Type: application/json' -d '{
     "transient": {
      "cluster.routing.allocation.enable": "all"
     }
   }'
   ```
   {% include copy.html %}

### Installing the Security plugin on OpenSearch Dashboards

Use the following steps to reinstall the plugin on OpenSearch Dashboards:

1. Stop running your OpenSearch Dashboards cluster. 
2. Install the Security plugin:

   ```bash
      ./bin/opensearch-dashboards-plugin install securityDashboards
   ```
   
4. Add the necessary [configuration]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/tls/) settings in the `opensearch_dashboards.yml` file.
5. Start OpenSearch Dashboards. If the plugin was successfully installed, you'll be prompted to enter your login credentials.
