---
layout: default
title: Querqy
has_children: false
redirect_from:
  - /search-plugins/querqy/
nav_order: 210
---

# Querqy

Querqy is a community plugin for query rewriting that helps to solve relevance issues, making search engines more precise regarding matching and scoring.

## Querqy plugin installation

Querqy is currently only compatible with OpenSearch 1.3.1
{: .note }

1. The Querqy plugin code is located here: [querqy-opensearch](https://github.com/querqy/querqy-opensearch). To download the plugin code ZIP file, select the green "Code" button, then select "Download ZIP"

1. Install JDK 11. On Amazon Linux 2, install JDK11 with the following command:

   ```bash
   sudo yum install java-11-amazon-corretto
   ```

1. Uncompress the ZIP file:

   ```bash
   unzip querqy-opensearch-main.zip
   ```

1. Change to the uncompressed Querqy directory:

   ```bash
   cd querqy-opensearch-main
   ```

1. Compile the plugin: 

   ```bash
   ./gradlew build
   ```

1. The compiled plugin is stored in this directory:

   ```bash
   /path/to/file/querqy-opensearch-main/build/distributions/opensearch-querqy-1.3.1.0.zip`
   ```

1. The compiled Querqy plugin is installed the same as [any OpenSearch plugin](https://opensearch.org/docs/latest/opensearch/install/plugins/#install-a-plugin): 

   ```bash
   /path/to/opensearch/bin/opensearch-plugin install file:///path/to/file/opensearch-querqy-1.3.1.0.zip
   ```

1. Reboot the OpenSearch node: 

   ```bash
   sudo reboot
   ```

After installing the Querqy plugin you can find comprehensive documentation on the Querqy.org site: [Querqy](https://docs.querqy.org/querqy/index.html)