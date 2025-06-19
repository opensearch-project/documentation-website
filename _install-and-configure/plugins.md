---
layout: default
title: Installing plugins
nav_order: 90
has_children: true
redirect_from:
   - /opensearch/install/plugins/
   - /install-and-configure/install-opensearch/plugins/
---

# Installing plugins

OpenSearch includes a number of plugins that add features and capabilities to the core platform. The plugins available to you are dependent on how OpenSearch was installed and which plugins were subsequently added or removed. For example, the minimal distribution of OpenSearch enables only core functionality, such as indexing and search. Using the minimal distribution of OpenSearch is beneficial when you are working in a testing environment, have custom plugins, or are intending to integrate OpenSearch with other services.

The standard distribution of OpenSearch includes many more plugins offering much more functionality. You can choose to add additional plugins or remove any of the plugins you don't need. 

For a list of the available plugins, see [Available plugins](#available-plugins).

For a plugin to work properly with OpenSearch, it may request certain permissions as part of the installation process. Review the requested permissions and proceed accordingly. It is important that you understand a plugin's functionality before installation. When opting for a community-provided plugin, ensure that the source is trustworthy and reliable.
{: .warning}

## Managing plugins

To manage plugins in OpenSearch, you can use a command line tool called `opensearch-plugin`. This tool allows you to perform the following actions:

- [List](#list) installed plugins.
- [Install](#install) plugins.
- [Remove](#remove) an installed plugin.

You can print help text by passing `-h` or `--help`. Depending on your host configuration, you might also need to run the command with `sudo` privileges.

If you're running OpenSearch in a Docker container, plugins must be installed, removed, and configured by modifying the Docker image. For more information, see [Working with plugins]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/docker#working-with-plugins).
{: .note}

## List

Use `list` to see a list of plugins that have already been installed.

#### Usage
```bash
bin/opensearch-plugin list
```

#### Example
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

## List (with CAT API)
You can also list installed plugins by using the [CAT API]({{site.url}}{{site.baseurl}}/api-reference/cat/cat-plugins/).

#### Usage

```bash
GET _cat/plugins
```

#### Example response

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

There are three ways to install plugins using the `opensearch-plugin` tool:

- [Install a plugin by name](#install-a-plugin-by-name).
- [Install a plugin from a zip file](#install-a-plugin-from-a-zip-file).
- [Install a plugin using Maven coordinates](#install-a-plugin-using-maven-coordinates).

### Install a plugin by name

You can install plugins that aren't already preinstalled in your installation by using the plugin name. For a list of plugins that may not be preinstalled, see [Additional plugins](#additional-plugins).

#### Usage
```bash
bin/opensearch-plugin install <plugin-name>
```

#### Example
```bash
$ sudo ./opensearch-plugin install analysis-icu
-> Installing analysis-icu
-> Downloading analysis-icu from opensearch
[=================================================] 100%   
-> Installed analysis-icu with folder name analysis-icu
```

### Install a plugin from a zip file

You can install remote zip files by replacing `<zip-file>` with the URL of the hosted file. The tool supports downloading over HTTP/HTTPS protocols only. For local zip files, replace `<zip-file>` with `file:` followed by the absolute or relative path to the plugin zip file, as shown in the second example that follows.

#### Usage
```bash
bin/opensearch-plugin install <zip-file>
```

#### Example
<details markdown="block">
  <summary>
    Select to expand the example 
  </summary>
  {: .text-delta}
  
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
</details>

### Install a plugin using Maven coordinates

The `opensearch-plugin install` tool also allows you to specify Maven coordinates for available artifacts and versions hosted on [Maven Central](https://central.sonatype.com/namespace/org.opensearch.plugin). The tool parses the Maven coordinates you provide and constructs a URL. As a result, the host must be able to connect directly to the Maven Central site. The plugin installation fails if you pass coordinates to a proxy or local repository.

#### Usage
```bash
bin/opensearch-plugin install <groupId>:<artifactId>:<version>
```

#### Example

<details markdown="block">
  <summary>
    Select to expand the example 
  </summary>
  {: .text-delta}

```console
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
</details>

Restart your OpenSearch node after installing a plugin.
{: .note}

## Installing multiple plugins

Multiple plugins can be installed in a single invocation.

#### Usage
```bash
bin/opensearch-plugin install <plugin-name> <plugin-name> ... <plugin-name>
```

#### Example
```console
$ sudo ./opensearch-plugin install analysis-nori repository-s3
```

## Remove

You can remove a plugin that has already been installed with the `remove` option. 

#### Usage
```bash
bin/opensearch-plugin remove <plugin-name>
```

#### Example
```console
$ sudo ./opensearch-plugin remove opensearch-anomaly-detection
-> removing [opensearch-anomaly-detection]...
```

Restart your OpenSearch node after removing a plugin.
{: .note}

## Batch mode

When installing a plugin that requires additional privileges that are not included by default, the plugin will prompt you for confirmation of the required privileges. To grant all requested privileges, use batch mode to skip the confirmation prompt.

To force batch mode when installing plugins, add the `-b` or `--batch` option:
```bash
bin/opensearch-plugin install --batch <plugin-name>
```

## Available plugins

OpenSearch provides several bundled plugins that are available for immediate use with all OpenSearch distributions except for the minimal distribution. Additional plugins are available but must be installed separately using one of the installation options.  

### Bundled plugins

The following plugins are bundled with all OpenSearch distributions except for the minimal distribution. If you are using the minimal distribution, you can add these plugins by using one of the installation methods.

| Plugin name | Repository | Earliest available version |
| :--- | :--- | :--- |
| Alerting | [opensearch-alerting](https://github.com/opensearch-project/alerting) | 1.0.0 |
| Anomaly Detection | [opensearch-anomaly-detection](https://github.com/opensearch-project/anomaly-detection) | 1.0.0 |
| Asynchronous Search | [opensearch-asynchronous-search](https://github.com/opensearch-project/asynchronous-search) | 1.0.0 |
| Cross Cluster Replication | [opensearch-cross-cluster-replication](https://github.com/opensearch-project/cross-cluster-replication) | 1.1.0 |
| Custom Codecs | [opensearch-custom-codecs](https://github.com/opensearch-project/custom-codecs) | 2.10.0 |
| Flow Framework | [flow-framework](https://github.com/opensearch-project/flow-framework) | 2.12.0 |
| Notebooks<sup>1</sup> | [opensearch-notebooks](https://github.com/opensearch-project/dashboards-notebooks) | 1.0.0 to 1.1.0 |
| Notifications | [notifications](https://github.com/opensearch-project/notifications) | 2.0.0
| Reports Scheduler | [opensearch-reports-scheduler](https://github.com/opensearch-project/dashboards-reports) | 1.0.0 |
| Geospatial | [opensearch-geospatial](https://github.com/opensearch-project/geospatial) | 2.2.0 |
| Index Management | [opensearch-index-management](https://github.com/opensearch-project/index-management) | 1.0.0 |
| Job Scheduler | [opensearch-job-scheduler](https://github.com/opensearch-project/job-scheduler) | 1.0.0 |
| k-NN | [opensearch-knn](https://github.com/opensearch-project/k-NN) | 1.0.0 |
| Learning to Rank | [opensearch-ltr](https://github.com/opensearch-project/opensearch-learning-to-rank-base) | 2.19.0 |
| ML Commons | [opensearch-ml](https://github.com/opensearch-project/ml-commons) | 1.3.0 |
| Skills | [opensearch-skills](https://github.com/opensearch-project/skills) | 2.12.0 |
| Neural Search | [neural-search](https://github.com/opensearch-project/neural-search) | 2.4.0 |
| Observability | [opensearch-observability](https://github.com/opensearch-project/observability) | 1.2.0 |
| Performance Analyzer<sup>2</sup> | [opensearch-performance-analyzer](https://github.com/opensearch-project/performance-analyzer) | 1.0.0 |
| Security | [opensearch-security](https://github.com/opensearch-project/security) | 1.0.0 |
| Security Analytics | [opensearch-security-analytics](https://github.com/opensearch-project/security-analytics) | 2.4.0 |
| SQL | [opensearch-sql](https://github.com/opensearch-project/sql) | 1.0.0 |
| Learning to Rank Base | [opensearch-learning-to-rank-base](https://github.com/opensearch-project/opensearch-learning-to-rank-base) | 2.19.0 |
| Remote Metadata SDK | [opensearch-remote-metadata-sdk](https://github.com/opensearch-project/opensearch-remote-metadata-sdk) | 2.19.0 |
| Query Insights | [query-insights](https://github.com/opensearch-project/query-insights) | 2.16.0 |
| System Templates | [opensearch-system-templates](https://github.com/opensearch-project/opensearch-system-templates) | 2.17.0 |

_<sup>1</sup>Dashboard Notebooks was merged in to the Observability plugin with the release of OpenSearch 1.2.0._<br>
_<sup>2</sup>Performance Analyzer is not available on Windows._


#### Downloading bundled plugins for offline installation

Each bundled plugin can be downloaded and installed offline from a [zip file](#install-a-plugin-from-a-zip-file).

The URL for the corresponding plugin can be found in the `manifest.yml` file located in the root directory of the extracted bundle.

### Core plugins

A _core_ (or _native_) plugin in OpenSearch is a plugin that resides in the [OpenSearch core engine repository](https://github.com/opensearch-project/OpenSearch/tree/main/plugins). These plugins are tightly integrated with the OpenSearch engine, are versioned alongside core releases, and are not bundled by default in the standard OpenSearch distribution.


#### Downloading core plugins for offline installation

Each core plugins in [this list](https://github.com/opensearch-project/OpenSearch/tree/main/plugins) can be downloaded and installed offline from a [zip file](#install-a-plugin-from-a-zip-file) using the official `plugins` repository URL template:

```html
https://artifacts.opensearch.org/releases/plugins/<plugin-name>/<version>/<plugin-name>-<version>.zip
```

The `<plugin-name>` corresponds to the name of the bundled plugin (for example, `analysis-icu`). The `<version>` must match the version of the OpenSearch distribution (for example, `2.19.1`). 

For example, use the following URL to download the `analysis-icu` bundled plugin distribution for OpenSearch version `2.19.1`:

```
https://artifacts.opensearch.org/releases/plugins/analysis-icu/2.19.1/analysis-icu-2.19.1.zip
```

### Additional plugins

There are many more plugins available in addition to those provided by the default distribution. These additional plugins have been built by OpenSearch developers or members of the OpenSearch community. For a list of additional plugins you can install, see [Additional plugins]({{site.url}}{{site.baseurl}}/install-and-configure/additional-plugins/index/).

## Plugin compatibility

You can specify plugin compatibility with a particular OpenSearch version in the `plugin-descriptor.properties` file. For example, a plugin with the following property is compatible only with OpenSearch 2.3.0:

```properties
opensearch.version=2.3.0
```
Alternatively, you can specify a range of compatible OpenSearch versions by setting the `dependencies` property in the `plugin-descriptor.properties` file to one of the following notations:
- `dependencies={ opensearch: "2.3.0" }`: The plugin is compatible only with OpenSearch version 2.3.0.
- `dependencies={ opensearch: "=2.3.0" }`: The plugin is compatible only with OpenSearch version 2.3.0.
- `dependencies={ opensearch: "~2.3.0" }`: The plugin is compatible with all versions from 2.3.0 up to the next minor version, in this example, 2.4.0 (exclusive).
- `dependencies={ opensearch: "^2.3.0" }`: The plugin is compatible with all versions from 2.3.0 up to the next major version, in this example, 3.0.0 (exclusive).

You can specify only one of the `opensearch.version` or `dependencies` properties.
{: .note}

## Related links

- [Observability]({{site.url}}{{site.baseurl}}/observability-plugin/index/)
- [Security Analytics]({{site.url}}{{site.baseurl}}/security-analytics/index/)
- [Security]({{site.url}}{{site.baseurl}}/security/index/)
- [Alerting]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/index/)
- [Anomaly detection]({{site.url}}{{site.baseurl}}/monitoring-plugins/ad/index/)
- [Asynchronous search]({{site.url}}{{site.baseurl}}/search-plugins/async/index/)
- [Cross-cluster replication]({{site.url}}{{site.baseurl}}/replication-plugin/index/)
- [Index State Management]({{site.url}}{{site.baseurl}}/im-plugin/ism/index/)
- [k-NN search]({{site.url}}{{site.baseurl}}/search-plugins/knn/index/)
- [Learning to Rank]({{site.url}}{{site.baseurl}}/search-plugins/ltr/index/)
- [ML Commons]({{site.url}}{{site.baseurl}}/ml-commons-plugin/index/)
- [Neural search]({{site.url}}{{site.baseurl}}/neural-search-plugin/index/)
- [Notifications]({{site.url}}{{site.baseurl}}/notifications-plugin/index/)
- [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/index/)
- [Performance Analyzer]({{site.url}}{{site.baseurl}}/monitoring-plugins/pa/index/)
- [SQL]({{site.url}}{{site.baseurl}}/search-plugins/sql/index/)
