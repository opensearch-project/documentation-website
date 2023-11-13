---
layout: default
title: Experimental feature flags
parent: Configuring OpenSearch
nav_order: 120
---

# Experimental feature flags

OpenSearch releases may contain experimental features that you can enable or disable as needed. There are several methods for enabling feature flags, depending on the installation type. 

## Enable in opensearch.yml

If you are running an OpenSearch cluster and want to enable feature flags in the config file, add the following line to `opensearch.yml`:

```yaml
opensearch.experimental.feature.<feature_name>.enabled: true
```
{% include copy.html %}

## Enable on Docker containers

If you’re running Docker, add the following line to `docker-compose.yml` under the `opensearch-node` > `environment` section:

```bash
OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.<feature_name>.enabled=true"
```
{% include copy.html %}

## Enable on a tarball installation

To enable feature flags on a tarball installation, provide the new JVM parameter either in `config/jvm.options` or `OPENSEARCH_JAVA_OPTS`.

### Option 1: Modify jvm.options

Add the following lines to `config/jvm.options` before starting the `opensearch` process to enable the feature and its dependency:

```bash
-Dopensearch.experimental.feature.<feature_name>.enabled=true
```
{% include copy.html %}

Then run OpenSearch:

```bash
./bin/opensearch
```
{% include copy.html %}

### Option 2: Enable with an environment variable

As an alternative to directly modifying `config/jvm.options`, you can define the properties by using an environment variable. This can be done using a single command when you start OpenSearch or by defining the variable with `export`.

To add the feature flags inline when starting OpenSearch, run the following command:

```bash
OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.<feature_name>.enabled=true" ./opensearch-{{site.opensearch_version}}/bin/opensearch
```
{% include copy.html %}

If you want to define the environment variable separately prior to running OpenSearch, run the following commands:

```bash
export OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.<feature_name>.enabled=true"
```
{% include copy.html %}

```bash
./bin/opensearch
```
{% include copy.html %}

## Enable for OpenSearch development

To enable feature flags for development, you must add the correct properties to `run.gradle` before building OpenSearch. See the [Developer Guide](https://github.com/opensearch-project/OpenSearch/blob/main/DEVELOPER_GUIDE.md) for information about to use how Gradle to build OpenSearch.

Add the following properties to run.gradle to enable the feature:

```gradle
testClusters {
    runTask {
      testDistribution = 'archive'
      if (numZones > 1) numberOfZones = numZones
      if (numNodes > 1) numberOfNodes = numNodes
      systemProperty 'opensearch.experimental.feature.<feature_name>.enabled', 'true'
    }
  }
```
{% include copy.html %}