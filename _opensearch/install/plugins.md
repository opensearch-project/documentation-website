---
layout: default
title: OpenSearch plugins
parent: Install OpenSearch
nav_order: 90
---

# OpenSearch plugin installation

You can install individual plugins on an OpenSearch cluster based on your needs. For information about available plugins, see [Available plugins]({{site.url}}{{site.baseurl}}/opensearch/install/plugins#available-plugins).

---

#### Table of contents
1. TOC
{:toc}
  
---

## Managing plugins

OpenSearch uses a command line tool called `opensearch-plugin` for managing plugins. This tool can be used to `list` installed plugins, `install` a plugin using one of the methods outlined below, or `remove` plugins. Help is available by invoking the tool with the `-h` or `--help` option. Depending on your user privileges and installation method, you might also need run the command with `sudo`.

- [List installed plugins]({{site.url}}{{site.baseurl}}/opensearch/install/plugins#)
- [Install a plugin]({{site.url}}{{site.baseurl}}/opensearch/install/plugins#)
    - [Install a plugin by name]({{site.url}}{{site.baseurl}}/opensearch/install/plugins#install-a-plugin-by-name)
    - [Install a plugin by from a zip file]({{site.url}}{{site.baseurl}}/opensearch/install/plugins#install-a-plugin-from-a-zip-file)
    - [Install a plugin using Maven coordinates]({{site.url}}{{site.baseurl}}/opensearch/install/plugins#install-a-plugin-using-maven-coordinates)
- [Remove a plugin]({{site.url}}{{site.baseurl}}/opensearch/install/plugins#)

If you are running OpenSearch in a Docker container, plugins must be installed, removed, and configured by modifying the Docker image. For information, see [Install, configure or remove plugins]({{site.url}}{{site.baseurl}}/opensearch/install/docker#install-configure-or-remove-plugins)
{: .note}

### Install a plugin by name:

For a list of plugins that can be installed by name, see [Additional plugins]({{site.url}}{{site.baseurl}}/opensearch/install/plugins#additional-plugins)
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

#### Usage:
```bash
# zip-file can be a local path to the zip file, or
# a URL for a zip file hosted on a network.
bin/opensearch-plugin install <zip-file>
```

#### Example:
```bash
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
```

### Install a plugin using Maven coordinates:

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

## Batch mode

When installing plugins that require additional privileges not included by default, the plugins will prompt the user for confirmation of the required privileges. To grant all requested privileges, use batch mode to skip the confirmation prompt.

To force batch mode when installing plugins, add the `-b` or `--batch` option:
```bash
bin/opensearch-plugin install --batch <plugin-name>
```

## Remove a plugin

```bash
bin/opensearch-plugin remove <plugin-name>
```
Restart your OpenSearch node after removing a plugin.

## List installed plugins

To check which plugins are currently installed:

```bash
bin/opensearch-plugin list
```

## Available plugins

### Bundled Plugins

The following plugins are bundled with all OpenSearch distributions except for minimum distribution packages.

| Plugin Name | Repository | OpenSearch Compatible Versions |
| :--- | :--- | :--- |
| Alerting | [opensearch-alerting](https://github.com/opensearch-project/alerting) | 1.0.0 or newer |
| Anomaly Detection | [opensearch-anomaly-detection](https://github.com/opensearch-project/anomaly-detection) | 1.0.0 or newer |
| Asynchronous Search | [opensearch-asynchronous-search](https://github.com/opensearch-project/asynchronous-search) | 1.0.0 or newer |
| Cross Cluster Replication | [opensearch-cross-cluster-replication](https://github.com/opensearch-project/cross-cluster-replication) | 1.1.0 or newer |
| Dashboard Notebooks<sup>1</sup> | [opensearch-notebooks](https://github.com/opensearch-project/dashboards-notebooks) | 1.0.0 to 1.1.0 |
| Dashboard Reports | [opensearch-reports-scheduler](https://github.com/opensearch-project/dashboards-reports) | 1.0.0 or newer |
| Geospatial | [opensearch-geospatial](https://github.com/opensearch-project/geospatial) | 2.2.0 or newer |
| Index Management | [opensearch-index-management](https://github.com/opensearch-project/index-management) | 1.0.0 or newer |
| Job Scheduler | [opensearch-job-scheduler](https://github.com/opensearch-project/job-scheduler) | 1.0.0 or newer |
| k-NN | [opensearch-knn](https://github.com/opensearch-project/k-NN) | 1.0.0 or newer |
| ML Commons | [opensearch-ml](https://github.com/opensearch-project/ml-commons) | 1.3.0 or newer |
| Observability | [opensearch-observability](https://github.com/opensearch-project/observability) | 1.2.0 or newer |
| Performance Analyzer | [opensearch-performance-analyzer](https://github.com/opensearch-project/performance-analyzer) | 1.0.0 or newer |
| Security | [opensearch-security](https://github.com/opensearch-project/security) | 1.0.0 or newer |
| SQL | [opensearch-sql](https://github.com/opensearch-project/sql) | 1.0.0 or newer |

_<sup>1</sup>Dashboard Notebooks was merged in to the Observability plugin with the release of OpenSearch 1.2.0._

### Additional plugins

Members of the OpenSearch community have built countless plugins for the service. Although it isn't possible to build an exhaustive list of every plugin, since many plugins are not maintained within the OpenSearch GitHub repository, the following list of plugins are available to be installed by name using `bin/opensearch-plugin install <plugin-name>`.

| Plugin Name | OpenSearch Compatible Versions |
| :--- | :--- |
| analysis-icu | 1.0.0 or newer |
| analysis-kuromoji | 1.0.0 or newer |
| analysis-nori | 1.0.0 or newer |
| analysis-phonetic | 1.0.0 or newer |
| analysis-smartcn | 1.0.0 or newer |
| analysis-stempel | 1.0.0 or newer |
| analysis-ukrainian | 1.0.0 or newer |
| discovery-azure-classic | 1.0.0 or newer |
| discovery-ec2 | 1.0.0 or newer |
| discovery-gce | 1.0.0 or newer |
| ingest-attachment | 1.0.0 or newer |
| mapper-annotated-text | 1.0.0 or newer |
| mapper-murmur3 | 1.0.0 or newer |
| mapper-size | 1.0.0 or newer |
| repository-azure | 1.0.0 or newer |
| repository-gcs | 1.0.0 or newer |
| repository-hdfs | 1.0.0 or newer |
| repository-s3 | 1.0.0 or newer |
| store-smb | 1.0.0 or newer |
| transport-nio | 1.0.0 or newer |