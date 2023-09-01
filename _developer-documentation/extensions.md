---
layout: default
title: Extensions
nav_order: 10
---

# Extensions

Extensions is an experimental feature. Therefore, we do not recommend the use of extensions in a production environment. For updates on the progress of extensions, or if you want leave feedback that could help improve the feature, refer to the [issue on GitHub](https://github.com/opensearch-project/OpenSearch/issues/2447).
{: .warning}

Until extensions were introduced, plugins were the only way to extend OpenSearch functionality. However, plugins have significant shortcomings: they require frequent updates to stay up to date with OpenSearch core, they pose a security risk because they run in the same process as OpenSearch, and updating or installing them requires a full cluster restart. Moreover, plugins can fatally impact the cluster in the event of failure.

Extensions provide an easier, more secure way to customize OpenSearch. Extensions support all plugin functionality and let you build additional modular features for OpenSearch. The [OpenSearch SDK for Java](https://github.com/opensearch-project/opensearch-sdk-java/) provides the library of classes and interfaces that you can use to develop extensions. Extensions are decoupled from OpenSearch core and do not need frequent updates. Additionally, they can run in a separate process or on another node and can be installed while a cluster is running.

## Getting started

Use the following documentation to get started with extensions:

### Step 1: Learn the basics

Read the [design documentation](https://opensearch-project.github.io/opensearch-sdk-java/DESIGN.html) to learn about extension architecture and how extensions work.

### Step 2: Try it out

Try running the sample Hello World extension by following detailed steps in the [Getting started section of the Developer Guide](https://opensearch-project.github.io/opensearch-sdk-java/DEVELOPER_GUIDE.html#getting-started).

### Step 3: Create your own extension

Develop a custom create, read, update, delete (CRUD) extension by following the instructions in [this tutorial](https://opensearch-project.github.io/opensearch-sdk-java/CREATE_YOUR_FIRST_EXTENSION.html).

### Step 4: Learn how to deploy your extension

For instructions on building, testing, and running an extension, see the [Developing your own extension section of the Developer Guide](https://opensearch-project.github.io/opensearch-sdk-java/DEVELOPER_GUIDE.html#developing-your-own-extension).

<!-- TODO: add the link after the release
## Extensions Javadoc

For a complete extensions class hierarchy, see the [Javadoc](Link TBD).
-->

## Plugin migration

The [Anomaly Detection plugin](https://github.com/opensearch-project/anomaly-detection) is now [implemented as an extension](https://github.com/opensearch-project/anomaly-detection/tree/feature/extensions). For details, see [this GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/3635). 

For tips on migrating an existing plugin to an extension, see the [plugin migration documentation](https://opensearch-project.github.io/opensearch-sdk-java/PLUGIN_MIGRATION.html).