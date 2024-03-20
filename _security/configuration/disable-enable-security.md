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

The Security plugin is installed by default with OpenSearch, but you can disable it temporarily if you want to make testing or internal usage more straightforward. You can then enable it once you're ready to configure security for your cluster. 

If you have your own security solution or need to remove the Security plugin for development purposes, you can uninstall the plugin completely. Note that OpenSearch Dashboards can run only against a secure cluster, so if you uninstall the OpenSearch Security plugin, you'll have to also uninstall the Dashboard plugin. 


## Disabling security

To disable the Security plugin for OpenSearch, add the following line in `opensearch.yml`:

```yml
plugins.security.disabled: true
```

## Removing the Security plugin

If you want to remove the Security plugin in your OpenSearch instance without changing your configuration settings in `opensearch.yml`, use the following steps.

1. Delete the `plugins/opensearch-security` folder on all nodes.
1. Delete all `plugins.security.*` configuration entries from `opensearch.yml`.
1. Uninstall the Security plugin by using the following command:

```bash
/usr/share/opensearch/opensearch-plugin remove opensearch-security
```

To perform these steps on the Docker image, see [Working with plugins]({{site.url}}{{site.baseurl}}/opensearch/install/docker#working-with-plugins).

Disabling or removing the plugin exposes the configuration index for the Security plugin. If the index contains sensitive information, be sure to protect it through some other means. If you no longer need the index, delete it.
{: .warning }


## Removing the OpenSearch Dashboards Security plugin

If you disable the Security plugin in `opensearch.yml` and still want to use OpenSearch Dashboards, you must remove the corresponding OpenSearch Dashboards Security plugin. For more information, see [OpenSearch Dashboards remove plugins]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/plugins/#remove-plugins).

Refer to the following installation types to remove the OpenSearch Dashboards plugin.

### Docker

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

### Tarball 

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
   
### RPM and Debian 

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

## Enabling security

The default version of OpenSearch comes with Security features pre-installed, however if the Security plugin was [disabled]({{site.url}}{{site.baseurl}}/security/configuration/disable-enable-security/) or OpenSearch was installed without security, such as when using the minimal distribution method, you can enable the plugin as follows.

A full cluster restart is necessary to enable security features.
{: .warning}

### Installing the OpenSearch plugin

Use the following steps to install the plugin if you previously uninstalled it. 

1. Disable shard allocation and stop all nodes in order to prevent shards from moving around when the cluster is restarted.

  ```json
  curl -XPUT "http://localhost:9200/_cluster/settings" -H 'Content-Type: application/json' -d '{
    "transient": {
      "cluster.routing.allocation.enable": "none"
      }
   }'
  ```
  {% include copy.html %}
 
2. Install the Security plugin on all nodes in your cluster

  ```bash
  bin/opensearch-plugin install opensearch-security
  ```
  {% include copy.html %}
  
3. Add the necessary configuration to opensearch.yml for TLS encryption.
[Configuration]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/) details different settings which need to be configured.

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

### Installing the OpenSearch Dashboards plugin

1. Stop running your OpenSearch Dashboards cluster. 
2. Install the Security plugin:

   ```bash
      ./bin/opensearch-dashboards-plugin install securityDashboards
   ```
   
4. Add necessary [Configuration]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/tls/) settings in the `opensearch_dashboards.yml`
5. Start OpenSearch Dashboards. You should be prompted to enter your log in credentials if the plugin was successfully installed.
