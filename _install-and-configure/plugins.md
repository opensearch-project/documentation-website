---
layout: default
title: Installing plugins
nav_order: 90
redirect_from:
   - /opensearch/install/plugins/
   - /install-and-configure/install-opensearch/plugins/
---

# Installing plugins

You can install individual plugins for OpenSearch based on your needs. For information about available plugins, see [Available plugins](#available-plugins).


For plugins to work properly with OpenSearch, all plugins must have the ability to access the data in the cluster, including metadata about cluster operations. Therefore, to protect your cluster's data and preserve its integrity, first be sure you understand the function of a plugin before installing it on your OpenSearch cluster. Second, when selecting a custom plugin, make sure the plugin's source is a reliable one.
{: .warning}

## Managing plugins

OpenSearch uses a command line tool called `opensearch-plugin` for managing plugins. This tool allows you to:

- [List](#list) installed plugins.
- [Install](#install) plugins.
- [Remove](#remove) an installed plugin.

Print help text by passing `-h` or `--help`. Depending on your host configuration, you might also need to run the command with `sudo` privileges.

If you are running OpenSearch in a Docker container, plugins must be installed, removed, and configured by modifying the Docker image. For information, see [Working with plugins]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/docker#working-with-plugins)
{: .note}

## List

Use `list` to see a list of plugins that have already been installed.

#### Usage:
```bash
bin/opensearch-plugin list
```

#### Example:
```bash
$ ./opensearch-plugin list
opensearch-alerting
opensearch-anomaly-detection
opensearch-asynchronous-search
opensearch-cross-cluster-replication
opensearch-geospatial
opensearch-index-management
opensearch-job-scheduler
opensearch-knn
opensearch-ml
opensearch-notifications
opensearch-notifications-core
opensearch-observability
opensearch-performance-analyzer
opensearch-reports-scheduler
opensearch-security
opensearch-sql
```

You can also list installed plugins by using the [CAT API]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-plugins/).

#### Path and HTTP method

```bash
GET _cat/plugins
```

#### Sample response

```bash
opensearch-node1 opensearch-alerting                  2.0.1.0
opensearch-node1 opensearch-anomaly-detection         2.0.1.0
opensearch-node1 opensearch-asynchronous-search       2.0.1.0
opensearch-node1 opensearch-cross-cluster-replication 2.0.1.0
opensearch-node1 opensearch-index-management          2.0.1.0
opensearch-node1 opensearch-job-scheduler             2.0.1.0
opensearch-node1 opensearch-knn                       2.0.1.0
opensearch-node1 opensearch-ml                        2.0.1.0
opensearch-node1 opensearch-notifications             2.0.1.0
opensearch-node1 opensearch-notifications-core        2.0.1.0
```

## Install

There are three ways to install plugins using the `opensearch-plugin`:

- [Install a plugin by name]({{site.url}}{{site.baseurl}}/opensearch/install/plugins#install-a-plugin-by-name)
- [Install a plugin by from a zip file]({{site.url}}{{site.baseurl}}/opensearch/install/plugins#install-a-plugin-from-a-zip-file)
- [Install a plugin using Maven coordinates]({{site.url}}{{site.baseurl}}/opensearch/install/plugins#install-a-plugin-using-maven-coordinates)

### Install a plugin by name:

For a list of plugins that can be installed by name, see [Additional plugins]({{site.url}}{{site.baseurl}}/opensearch/install/plugins#additional-plugins).

#### Usage:
```bash
bin/opensearch-plugin install <plugin-name>
```

#### Example:
```bash
$ sudo ./opensearch-plugin install analysis-icu
-> Installing analysis-icu
-> Downloading analysis-icu from opensearch
[=================================================] 100%   
-> Installed analysis-icu with folder name analysis-icu
```

### Install a plugin from a zip file:

Remote zip files can be installed by replacing `<zip-file>` with the URL of the hosted file. The tool only supports downloading over HTTP/HTTPS protocols. For local zip files, replace `<zip-file>` with `file:` followed by the absolute or relative path to the plugin zip file as in the second example below.

#### Usage:
```bash
bin/opensearch-plugin install <zip-file>
```

#### Example:
```bash
# Zip file is hosted on a remote server - in this case, Maven central repository.
$ sudo ./opensearch-plugin install https://repo1.maven.org/maven2/org/opensearch/plugin/opensearch-anomaly-detection/2.2.0.0/opensearch-anomaly-detection-2.2.0.0.zip
-> Installing https://repo1.maven.org/maven2/org/opensearch/plugin/opensearch-anomaly-detection/2.2.0.0/opensearch-anomaly-detection-2.2.0.0.zip
-> Downloading https://repo1.maven.org/maven2/org/opensearch/plugin/opensearch-anomaly-detection/2.2.0.0/opensearch-anomaly-detection-2.2.0.0.zip
[=================================================] 100%   
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@     WARNING: plugin requires additional permissions     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
* java.lang.RuntimePermission accessClassInPackage.sun.misc
* java.lang.RuntimePermission accessDeclaredMembers
* java.lang.RuntimePermission getClassLoader
* java.lang.RuntimePermission setContextClassLoader
* java.lang.reflect.ReflectPermission suppressAccessChecks
* java.net.SocketPermission * connect,resolve
* javax.management.MBeanPermission org.apache.commons.pool2.impl.GenericObjectPool#-[org.apache.commons.pool2:name=pool,type=GenericObjectPool] registerMBean
* javax.management.MBeanPermission org.apache.commons.pool2.impl.GenericObjectPool#-[org.apache.commons.pool2:name=pool,type=GenericObjectPool] unregisterMBean
* javax.management.MBeanServerPermission createMBeanServer
* javax.management.MBeanTrustPermission register
See http://docs.oracle.com/javase/8/docs/technotes/guides/security/permissions.html
for descriptions of what these permissions allow and the associated risks.

Continue with installation? [y/N]y
-> Installed opensearch-anomaly-detection with folder name opensearch-anomaly-detection

# Zip file in a local directory.
$ sudo ./opensearch-plugin install file:/home/user/opensearch-anomaly-detection-2.2.0.0.zip
-> Installing file:/home/user/opensearch-anomaly-detection-2.2.0.0.zip
-> Downloading file:/home/user/opensearch-anomaly-detection-2.2.0.0.zip
[=================================================] 100%   
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@     WARNING: plugin requires additional permissions     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
* java.lang.RuntimePermission accessClassInPackage.sun.misc
* java.lang.RuntimePermission accessDeclaredMembers
* java.lang.RuntimePermission getClassLoader
* java.lang.RuntimePermission setContextClassLoader
* java.lang.reflect.ReflectPermission suppressAccessChecks
* java.net.SocketPermission * connect,resolve
* javax.management.MBeanPermission org.apache.commons.pool2.impl.GenericObjectPool#-[org.apache.commons.pool2:name=pool,type=GenericObjectPool] registerMBean
* javax.management.MBeanPermission org.apache.commons.pool2.impl.GenericObjectPool#-[org.apache.commons.pool2:name=pool,type=GenericObjectPool] unregisterMBean
* javax.management.MBeanServerPermission createMBeanServer
* javax.management.MBeanTrustPermission register
See http://docs.oracle.com/javase/8/docs/technotes/guides/security/permissions.html
for descriptions of what these permissions allow and the associated risks.

Continue with installation? [y/N]y
-> Installed opensearch-anomaly-detection with folder name opensearch-anomaly-detection
```

### Install a plugin using Maven coordinates:

The `opensearch-plugin install` tool also accepts Maven coordinates for available artifacts and versions hosted on [Maven Central](https://search.maven.org/search?q=org.opensearch.plugin). `opensearch-plugin` will parse the Maven coordinates you provide and construct a URL. As a result, the host must be able to connect directly to [Maven Central](https://search.maven.org/search?q=org.opensearch.plugin). The plugin installation will fail if you pass coordinates to a proxy or local repository.

#### Usage:
```bash
bin/opensearch-plugin install <groupId>:<artifactId>:<version>
```

#### Example:
```bash
$ sudo ./opensearch-plugin install org.opensearch.plugin:opensearch-anomaly-detection:2.2.0.0
-> Installing org.opensearch.plugin:opensearch-anomaly-detection:2.2.0.0
-> Downloading org.opensearch.plugin:opensearch-anomaly-detection:2.2.0.0 from maven central
[=================================================] 100%   
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@     WARNING: plugin requires additional permissions     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
* java.lang.RuntimePermission accessClassInPackage.sun.misc
* java.lang.RuntimePermission accessDeclaredMembers
* java.lang.RuntimePermission getClassLoader
* java.lang.RuntimePermission setContextClassLoader
* java.lang.reflect.ReflectPermission suppressAccessChecks
* java.net.SocketPermission * connect,resolve
* javax.management.MBeanPermission org.apache.commons.pool2.impl.GenericObjectPool#-[org.apache.commons.pool2:name=pool,type=GenericObjectPool] registerMBean
* javax.management.MBeanPermission org.apache.commons.pool2.impl.GenericObjectPool#-[org.apache.commons.pool2:name=pool,type=GenericObjectPool] unregisterMBean
* javax.management.MBeanServerPermission createMBeanServer
* javax.management.MBeanTrustPermission register
See http://docs.oracle.com/javase/8/docs/technotes/guides/security/permissions.html
for descriptions of what these permissions allow and the associated risks.

Continue with installation? [y/N]y
-> Installed opensearch-anomaly-detection with folder name opensearch-anomaly-detection
```

Restart your OpenSearch node after installing a plugin.
{: .note}

## Remove

You can remove a plugin that has already been installed with the `remove` option. 

#### Usage:
```bash
bin/opensearch-plugin remove <plugin-name>
```

#### Example:
```bash
$ sudo $ ./opensearch-plugin remove opensearch-anomaly-detection
-> removing [opensearch-anomaly-detection]...
```

Restart your OpenSearch node after removing a plugin.
{: .note}

## Batch mode

When installing plugins that require additional privileges not included by default, the plugins will prompt the user for confirmation of the required privileges. To grant all requested privileges, use batch mode to skip the confirmation prompt.

To force batch mode when installing plugins, add the `-b` or `--batch` option:
```bash
bin/opensearch-plugin install --batch <plugin-name>
```

## Available plugins

Major, minor, and patch plugin versions must match OpenSearch major, minor, and patch versions in order to be compatible. For example, plugins versions 2.3.0.x work only with OpenSearch 2.3.0.
{: .warning}

### Bundled Plugins

The following plugins are bundled with all OpenSearch distributions except for minimum distribution packages.

| Plugin Name | Repository | Earliest Available Version |
| :--- | :--- | :--- |
| Alerting | [opensearch-alerting](https://github.com/opensearch-project/alerting) | 1.0.0 |
| Anomaly Detection | [opensearch-anomaly-detection](https://github.com/opensearch-project/anomaly-detection) | 1.0.0 |
| Asynchronous Search | [opensearch-asynchronous-search](https://github.com/opensearch-project/asynchronous-search) | 1.0.0 |
| Cross Cluster Replication | [opensearch-cross-cluster-replication](https://github.com/opensearch-project/cross-cluster-replication) | 1.1.0 |
| Custom Codecs | [opensearch-custom-codecs](https://github.com/opensearch-project/custom-codecs) | 2.10.0 |
| Notebooks<sup>1</sup> | [opensearch-notebooks](https://github.com/opensearch-project/dashboards-notebooks) | 1.0.0 to 1.1.0 |
| Notifications | [notifications](https://github.com/opensearch-project/notifications) | 2.0.0
| Reports Scheduler | [opensearch-reports-scheduler](https://github.com/opensearch-project/dashboards-reports) | 1.0.0 |
| Geospatial | [opensearch-geospatial](https://github.com/opensearch-project/geospatial) | 2.2.0 |
| Index Management | [opensearch-index-management](https://github.com/opensearch-project/index-management) | 1.0.0 |
| Job Scheduler | [opensearch-job-scheduler](https://github.com/opensearch-project/job-scheduler) | 1.0.0 |
| k-NN | [opensearch-knn](https://github.com/opensearch-project/k-NN) | 1.0.0 |
| ML Commons | [opensearch-ml](https://github.com/opensearch-project/ml-commons) | 1.3.0 |
| Neural Search | [neural-search](https://github.com/opensearch-project/neural-search) | 2.4.0 |
| Observability | [opensearch-observability](https://github.com/opensearch-project/observability) | 1.2.0 |
| Performance Analyzer<sup>2</sup> | [opensearch-performance-analyzer](https://github.com/opensearch-project/performance-analyzer) | 1.0.0 |
| Security | [opensearch-security](https://github.com/opensearch-project/security) | 1.0.0 |
| Security Analytics | [opensearch-security-analytics](https://github.com/opensearch-project/security-analytics) | 2.4.0 |
| SQL | [opensearch-sql](https://github.com/opensearch-project/sql) | 1.0.0 |

_<sup>1</sup>Dashboard Notebooks was merged in to the Observability plugin with the release of OpenSearch 1.2.0._<br>
_<sup>2</sup>Performance Analyzer is not available on Windows._


### Additional plugins

Members of the OpenSearch community have built countless plugins for the service. Although it isn't possible to build an exhaustive list of every plugin, since many plugins are not maintained within the OpenSearch GitHub repository, the following list of plugins are available to be installed by name using `bin/opensearch-plugin install <plugin-name>`.

| Plugin Name | Earliest Available Version |
| :--- | :--- |
| analysis-icu | 1.0.0 |
| analysis-kuromoji | 1.0.0 |
| analysis-nori | 1.0.0 |
| analysis-phonetic | 1.0.0 |
| analysis-smartcn | 1.0.0 |
| analysis-stempel | 1.0.0 |
| analysis-ukrainian | 1.0.0 |
| discovery-azure-classic | 1.0.0 |
| discovery-ec2 | 1.0.0 |
| discovery-gce | 1.0.0 |
| ingest-attachment | 1.0.0 |
| mapper-annotated-text | 1.0.0 |
| mapper-murmur3 | 1.0.0 |
| mapper-size | 1.0.0 |
| repository-azure | 1.0.0 |
| repository-gcs | 1.0.0 |
| repository-hdfs | 1.0.0 |
| repository-s3 | 1.0.0 |
| store-smb | 1.0.0 |
| transport-nio | 1.0.0 |

## Related links

- [About Observability]({{site.url}}{{site.baseurl}}/observability-plugin/index/)
- [About security analytics]({{site.url}}{{site.baseurl}}/security-analytics/index/)
- [About the Security plugin]({{site.url}}{{site.baseurl}}/security/index/)
- [Alerting]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/index/)
- [Anomaly detection]({{site.url}}{{site.baseurl}}/monitoring-plugins/ad/index/)
- [Asynchronous search]({{site.url}}{{site.baseurl}}/search-plugins/async/index/)
- [Cross-cluster replication]({{site.url}}{{site.baseurl}}/replication-plugin/index/)
- [Index State Management]({{site.url}}{{site.baseurl}}/im-plugin/ism/index/)
- [k-NN]({{site.url}}{{site.baseurl}}/search-plugins/knn/index/)
- [ML Commons plugin]({{site.url}}{{site.baseurl}}/ml-commons-plugin/index/)
- [Neural Search]({{site.url}}{{site.baseurl}}/neural-search-plugin/index/)
- [Notifications]({{site.url}}{{site.baseurl}}/notifications-plugin/index/)
- [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/index/)
- [Performance Analyzer]({{site.url}}{{site.baseurl}}/monitoring-plugins/pa/index/)
- [SQL]({{site.url}}{{site.baseurl}}/search-plugins/sql/index/)
