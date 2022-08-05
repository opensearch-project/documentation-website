---
layout: default
title: Tarball
parent: Install OpenSearch
nav_order: 50
---

# Tarball

The tarball provides a self-contained directory with everything you need to run OpenSearch, including an integrated Java Development Kit (JDK). The tarball is a good option for testing and development.

After downloading and unpacking the archive, OpenSearch is ready to configure and use. Experienced OpenSearch users may have predefined configurations that they will apply to their host after downloading the tarball. A quickstart guide with basic recommended settings is included below for new users.

This installation method is supported by most Linux distributions including, but not limited to, CentOS 7, Amazon Linux 2, and Ubuntu 18.04. If you have your own Java installation and set the environment variable `JAVA_HOME` in the terminal, macOS works as well.

This document assumes that you are comfortable working from the Linux command line interface. You should understand how to input commands, navigate between directories, and edit text files using a text editor such as `vi`, `emacs`, or `nano`.
{: .note}

## Download OpenSearch

1. Download the appropriate tar.gz archive from the [OpenSearch downloads page](https://opensearch.org/downloads.html){:target='\_blank'} or using the command line (such as with `wget`):

   ```bash
   # x64
   wget https://artifacts.opensearch.org/releases/bundle/opensearch/{{site.opensearch_version}}/opensearch-{{site.opensearch_version}}-linux-x64.tar.gz

   # ARM64
   wget https://artifacts.opensearch.org/releases/bundle/opensearch/{{site.opensearch_version}}/opensearch-{{site.opensearch_version}}-linux-arm64.tar.gz
   ```

1. Extract the contents of the tarball:

   ```bash
   # x64
   tar -xvf opensearch-{{site.opensearch_version}}-linux-x64.tar.gz
   
   # ARM64
   tar -xvf opensearch-{{site.opensearch_version}}-linux-arm64.tar.gz
   ```

## Configure Important System Settings

Before launching OpenSearch you should review a some [important system settings]({{site.url}}{{site.baseurl}}/opensearch/install/important-settings/){:target='\_blank'}.

1. Disable memory paging and swapping performance on the host to improve performance.
   ```bash
   sudo swapoff -a
   ```
1. Increase the number of memory maps available to OpenSearch
   ```bash
   # Edit the sysctl config file
   sudo vi /etc/sysctl.conf

   # Add a line to define the desired value
   # or change the value if the key exists
   vm.max_map_count=262144

   # Save and quit (in vi you would use the command :wq!)
   # Reload the kernel parameters using sysctl
   sudo sysctl -p

   # Verify that the change was applied by checking the value
   cat /proc/sys/vm/max_map_count
   ```

## Run OpenSearch

You have downloaded OpenSearch, unpacked the archive in a directory of your choosing, and configured a couple important system settings in the host operating system. Before proceeding, you should verify that OpenSearch is able to run and respond to API requests. There are two quick methods to achieve this:

1. Apply a generic configuration using the bundled demo security script.
1. Manually disable the security plugin and test the instance before applying your own custom security settings.

The demo security script is included in the OpenSearch tarball and, when invoked, it will apply a generic configuration to your instance of OpenSearch. This configuration defines some environment variables relating to the install and JDK paths, `JAVA_OPTS`, and also applies self-signed TLS certificates. If you would like to configure these yourself, refer to the [quickstart guide](NEED LINK TO PAGE ANCHOR HERE) for basic settings guidance.

It is important to note that an OpenSearch node configured using the demo security script is not suitable for a production environment. If you plan to use the node in a production environment after running `opensearch-tar-install.sh` you should, at a minimum, replace the demo TLS certificates with your own TLS certificates and update the list of internal users and passwords. See the [Security configuration]({{site.url}}{{site.baseurl}}/security-plugin/configuration/index/) documentation for additional guidance to ensure that your nodes are configured according to your security requirements.
{: .warning}

If you only want to verify that the service is running and intend to configure security settings yourself, then you may wish to disable the security plugin and launch the service without encryption or authentication to verify that OpenSeach can run and respond to API requests.

### Option 1: Test Opensearch using the demo security configuration

1. Change to the top directory of your OpenSearch install:
   ```bash
   cd /path/to/opensearch-{{site.opensearch_version}}
   ```
1. Run the demo security script:
   ```bash
   ./opensearch-tar-install.sh
   ```
1. Open another terminal session and send requests to the server to verify that OpenSearch is up and running. Note the  use of the --insecure (or -k) flag which is required since the TLS certs are self-signed.
   - Send a request to port 9200:
      ```bash
      curl -XGET https://localhost:9200 -u 'admin:admin' --insecure
      ```
      You should get a response that looks like this:
      ```bash
      {
         "name" : "hostname",
         "cluster_name" : "opensearch",
         "cluster_uuid" : "6XNc9m2gTUSIoKDqJit0PA",
         "version" : {
            "distribution" : "opensearch",
            "number" : "2.1.0",
            "build_type" : "tar",
            "build_hash" : "388c80ad94529b1d9aad0a735c4740dce2932a32",
            "build_date" : "2022-06-30T21:31:04.823801692Z",
            "build_snapshot" : false,
            "lucene_version" : "9.2.0",
            "minimum_wire_compatibility_version" : "7.10.0",
            "minimum_index_compatibility_version" : "7.0.0"
         },
         "tagline" : "The OpenSearch Project: https://opensearch.org/"
      }
      ```
   - Query the plugins endpoint:
      ```bash
      curl -XGET https://localhost:9200/_cat/plugins?v -u 'admin:admin' --insecure
      ```

      The response should look like this:
      ```bash
      name     component                            version
      hostname opensearch-alerting                  2.1.0.0
      hostname opensearch-anomaly-detection         2.1.0.0
      hostname opensearch-asynchronous-search       2.1.0.0
      hostname opensearch-cross-cluster-replication 2.1.0.0
      hostname opensearch-index-management          2.1.0.0
      hostname opensearch-job-scheduler             2.1.0.0
      hostname opensearch-knn                       2.1.0.0
      hostname opensearch-ml                        2.1.0.0
      hostname opensearch-notifications             2.1.0.0
      hostname opensearch-notifications-core        2.1.0.0
      hostname opensearch-observability             2.1.0.0
      hostname opensearch-performance-analyzer      2.1.0.0
      hostname opensearch-reports-scheduler         2.1.0.0
      hostname opensearch-security                  2.1.0.0
      hostname opensearch-sql                       2.1.0.0
      ```
1. Return to the original terminal session and stop the process by pressing `CTRL + C`

### Option 2: Test OpenSearch without security enabled

1. Open `opensearch.yml`:
   ```bash
   vi /path/to/opensearch-{{site.opensearch_version}}/config/opensearch.yml
   ```
1. Add the following line to disable the security plugin:
   ```bash
   plugins.security.disabled: true
   ```
1. Save the change and close the file.
   ```bash
   :wq!
   ```
1. Open another terminal session and send requests to the server to verify that OpenSearch is up and running. Since the security plugin has been disabled you will be sending commands using `HTTP` rather than `HTTPS`
   - Send a request to port 9200:
      ```bash
      curl -XGET http://localhost:9200
      ```
      You should get a response that looks like this:
      ```bash
      {
         "name" : "hostname",
         "cluster_name" : "opensearch",
         "cluster_uuid" : "6XNc9m2gTUSIoKDqJit0PA",
         "version" : {
            "distribution" : "opensearch",
            "number" : "2.1.0",
            "build_type" : "tar",
            "build_hash" : "388c80ad94529b1d9aad0a735c4740dce2932a32",
            "build_date" : "2022-06-30T21:31:04.823801692Z",
            "build_snapshot" : false,
            "lucene_version" : "9.2.0",
            "minimum_wire_compatibility_version" : "7.10.0",
            "minimum_index_compatibility_version" : "7.0.0"
         },
         "tagline" : "The OpenSearch Project: https://opensearch.org/"
      }
      ```
   - Query the plugins endpoint:
      ```bash
      curl -XGET http://localhost:9200/_cat/plugins?v
      ```

      The response should look like this:
      ```bash
      name     component                            version
      hostname opensearch-alerting                  2.1.0.0
      hostname opensearch-anomaly-detection         2.1.0.0
      hostname opensearch-asynchronous-search       2.1.0.0
      hostname opensearch-cross-cluster-replication 2.1.0.0
      hostname opensearch-index-management          2.1.0.0
      hostname opensearch-job-scheduler             2.1.0.0
      hostname opensearch-knn                       2.1.0.0
      hostname opensearch-ml                        2.1.0.0
      hostname opensearch-notifications             2.1.0.0
      hostname opensearch-notifications-core        2.1.0.0
      hostname opensearch-observability             2.1.0.0
      hostname opensearch-performance-analyzer      2.1.0.0
      hostname opensearch-reports-scheduler         2.1.0.0
      hostname opensearch-security                  2.1.0.0
      hostname opensearch-sql                       2.1.0.0
      ```

## Quickstart Guide

By default, OpenSearch is not bound to a network interface and cannot be reached by external hosts. Furthermore, security settings are either undefined (greenfield) or are populated by default, known usernames and passwords if you ran the security demo script by invoking `opensearch-tar-install.sh`.

If you ran the security demo script then you will need to manually reconfigure settings that were modified. Refer to Security Plugin [Configuration]({{site.url}}{{site.baseurl}}/opensearch/configuration/) for guidance before proceeding.
{: .note}

1. Open `opensearch.yml`:
   ```bash
   vi /path/to/opensearch-{{site.opensearch_version}}/config/opensearch.yml
   ```
1. Add the following lines:
   ```bash
   # Bind OpenSearch to the correct network interface. Use 0.0.0.0
   # to include all available interfaces or specify an IP addresss
   # assigned to a specific interface.
   network.host: 0.0.0.0

   # Unless you have already configured a cluster, you should set
   # discovery.type to single-node or the bootstrap checks will
   # fail when you try to start the service.
   discovery.type: single-node

   # If you previously disabled the security plugin in opensearch.yml,
   # be sure to re-enable it.
   plugins.security.disabled: false
   ```
1. Save the change and close the file.
   ```bash
   :wq!
   ```

## Configuration

You can modify `config/opensearch.yml` or specify environment variables as arguments using `-E`:

```bash
./opensearch-tar-install.sh -Ecluster.name=opensearch-cluster -Enode.name=opensearch-node1 -Ehttp.host=0.0.0.0 -Ediscovery.type=single-node
```

For other settings, see [Important settings]({{site.url}}{{site.baseurl}}/opensearch/install/important-settings/).


### (Optional) Set up Performance Analyzer

In a tarball installation, Performance Analyzer collects data when it is enabled. But in order to read that data using the REST API on port 9600, you must first manually launch the associated reader agent process:

1. Make Performance Analyzer accessible outside of the host machine

   ```bash
   cd /usr/share/opensearch # navigate to the OpenSearch home directory
   cd config/opensearch-performance-analyzer/
   vi performance-analyzer.properties
   ```

   Uncomment the line `#webservice-bind-host` and set it to `0.0.0.0`:

   ```
   # ======================== OpenSearch performance analyzer plugin config =========================

   # NOTE: this is an example for Linux. Modify the config accordingly if you are using it under other OS.

   # WebService bind host; default to all interfaces
   webservice-bind-host = 0.0.0.0

   # Metrics data location
   metrics-location = /dev/shm/performanceanalyzer/

   # Metrics deletion interval (minutes) for metrics data.
   # Interval should be between 1 to 60.
   metrics-deletion-interval = 1

   # If set to true, the system cleans up the files behind it. So at any point, we should expect only 2
   # metrics-db-file-prefix-path files. If set to false, no files are cleaned up. This can be useful, if you are archiving
   # the files and wouldn't like for them to be cleaned up.
   cleanup-metrics-db-files = true

   # WebService exposed by App's port
   webservice-listener-port = 9600

   # Metric DB File Prefix Path location
   metrics-db-file-prefix-path = /tmp/metricsdb_

   https-enabled = false

   #Setup the correct path for certificates
   certificate-file-path = specify_path

   private-key-file-path = specify_path

   # Plugin Stats Metadata file name, expected to be in the same location
   plugin-stats-metadata = plugin-stats-metadata

   # Agent Stats Metadata file name, expected to be in the same location
   agent-stats-metadata = agent-stats-metadata
   ```

1. Make the CLI executable:

   ```bash
   sudo chmod +x ./bin/performance-analyzer-agent-cli
   ```

1. Launch the agent CLI:

   ```bash
   OPENSEARCH_HOME="$PWD" OPENSEARCH_PATH_CONF="$PWD/config" ./bin/performance-analyzer-agent-cli
   ```

1. In a separate window, enable the Performance Analyzer plugin:

   ```bash
   curl -XPOST localhost:9200/_plugins/_performanceanalyzer/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}'
   ```

   If you receive the `curl: (52) Empty reply from server` error, you are likely protecting your cluster with the security plugin and you need to provide credentials. Modify the following command to use your username and password:

   ```bash
   curl -XPOST https://localhost:9200/_plugins/_performanceanalyzer/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}' -u 'admin:admin' -k
   ```

1. Finally, enable the Root Cause Analyzer (RCA) framework

   ```bash
   curl -XPOST localhost:9200/_plugins/_performanceanalyzer/rca/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}'
   ```

   Similar to step 4, if you run into `curl: (52) Empty reply from server`, run the command below to enable RCA

   ```bash
   curl -XPOST https://localhost:9200/_plugins/_performanceanalyzer/rca/cluster/config -H 'Content-Type: application/json' -d '{"enabled": true}' -u 'admin:admin' -k
   ```

{% comment %}

### (Optional) Removing Performance Analyzer

See [Clean up Performance Analyzer files]({{site.url}}{{site.baseurl}}/plugins#optional-clean-up-performance-analyzer-files).

{% endcomment %}
