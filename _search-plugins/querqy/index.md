---
layout: default
title: Querqy plugin
has_children: false
redirect_from:
  - /search-plugins/querqy/
nav_order: 10
---

# Querqy plugin

## Querqy plugin installation

**Querqy is currently only compatible with OpenSearch 1.3.1**

The Querqy plugin code is located [here](https://github.com/querqy/querqy-opensearch). To download the plugin code ZIP file, select the green "Code" button, then select "Download ZIP"

First, JDK 11 will need to installed. On Amazon Linux 2, JDK 11 is intalled with the following command:

```bash
sudo yum install java-11-amazon-corretto
```

Uncompress the ZIP file:

```bash
unzip querqy-opensearch-main.zip
```

Change to the uncompressed Querqy directory:

```bash
cd querqy-opensearch-main
```

Compile the plugin: 

```bash
./gradlew build
```

The compiled plugin will be located at: 

```bash
/path/to/file/querqy-opensearch-main/build/distributions/opensearch-querqy-1.3.1.0.zip`
```

The compiled Querqy plugin is installed the same as [any OpenSearch plugin](https://opensearch.org/docs/latest/opensearch/install/plugins/#install-a-plugin): 

```bash
/path/to/opensearch/bin/opensearch-plugin install file:///path/to/file/opensearch-querqy-1.3.1.0.zip
```

Finally, reboot the OpenSearch node: 

```bash
sudo reboot
```

Afer instsalling the Querqy plugin, comprehensive documentation can be found [here](https://docs.querqy.org/querqy/index.html).