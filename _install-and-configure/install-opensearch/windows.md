---
layout: default
title: Windows
parent: Installing OpenSearch
nav_order: 65
---

# Windows

The following sections describe installing OpenSearch on Windows from a zip archive.

Generally speaking, the installation of OpenSearch from a zip archive can be broken down into a few steps:

1. **Download and unpack OpenSearch.**
1. **(Optional) Test OpenSearch.**
   - Confirm that OpenSearch is able to run before you apply any custom configuration.
   - This can be done without any security (no password, no certificates) or with a demo security configuration that can be applied by a packaged script.
1. **Configure OpenSearch for your environment.**
   -  Apply basic settings to OpenSearch and start using it in your environment.

The Windows OpenSearch archive is a self-contained directory with everything needed to run OpenSearch, including an integrated Java Development Kit (JDK). If you have your own Java installation and set the environment variable `JAVA_HOME`, OpenSearch will use that installation if the `OPENSEARCH_JAVA_HOME` environment variable is not set. To learn how to set the `OPENSEARCH_JAVA_HOME` environment variable, see [Step 3: Set up OpenSearch in your environment](#step-3-set-up-opensearch-in-your-environment).

## Prerequisites

Make sure you have a zip utility installed.

## Step 1: Download and unpack OpenSearch

Perform the following steps to install OpenSearch on Windows.

1. Download the [`opensearch-{{site.opensearch_version}}-windows-x64.zip`](https://artifacts.opensearch.org/releases/bundle/opensearch/{{site.opensearch_version}}/opensearch-{{site.opensearch_version}}-windows-x64.zip){:target='\_blank'} archive.
1. To extract the archive contents, right-click to select **Extract All**.

## Step 2: (Optional) Test OpenSearch

Before proceeding with any configuration, you should test your installation of OpenSearch. Otherwise, it can be difficult to determine whether future problems are due to installation issues or custom settings you applied after installation. There are two quick methods for testing OpenSearch at this stage:

1. **(Security enabled)** Apply a generic configuration using the batch script included in the Windows archive. 
1. **(Security disabled)** Manually disable the Security plugin and test the instance before applying your own custom security settings.

The batch script will apply a generic configuration to your instance of OpenSearch. This configuration defines some environment variables and also applies self-signed TLS certificates. Alternatively, you can choose to configure these yourself.

If you only want to verify that the service is properly configured and you intend to configure security settings yourself, then you may want to disable the Security plugin and launch the service without encryption or authentication.

An OpenSearch node in its default configuration (with demo certificates and users with default passwords) is not suitable for a production environment. If you plan to use the node in a production environment, you should, at a minimum, replace the demo TLS certificates with your own TLS certificates and [update the list of internal users and passwords]({{site.url}}{{site.baseurl}}/security/configuration/yaml). See [Security configuration]({{site.url}}{{site.baseurl}}/security/configuration/index/) for additional guidance to ensure that your nodes are configured according to your security requirements.
{: .warning}

### Option 1: Test your OpenSearch settings with security enabled

1. Run the demo batch script.

   There are two ways of running the batch script:

   1. Run the batch script using the Windows UI:

      1. Navigate to the top directory of your OpenSearch installation and open the `opensearch-{{site.opensearch_version}}` folder.
      1. Run the batch script by double-clicking the `opensearch-windows-install.bat` file. This opens a command prompt with an OpenSearch instance running.

   1. Run the batch script from Command prompt or Powershell:

      1. Open Command Prompt by entering `cmd`, or Powershell by entering `powershell`, in the search box next to **Start** on the taskbar. 
      1. Change to the top directory of your OpenSearch installation.
         ```bat
         cd \path\to\opensearch-{{site.opensearch_version}}
         ```
         {% include copy.html %}

      1. Run the batch script.
         ```bat
         .\opensearch-windows-install.bat
         ```
         {% include copy.html %}

1. Open a new command prompt and send requests to the server to verify that OpenSearch is running. Note the use of the `--insecure` flag, which is required because the TLS certificates are self-signed.
   - Send a request to port 9200:
      ```bat
      curl.exe -X GET https://localhost:9200 -u "admin:admin" --insecure
      ```
      {% include copy.html %}

      You should get a response that looks like this:
      ```bat
      {
         "name" : "hostname-here",
         "cluster_name" : "opensearch",
         "cluster_uuid" : "7Nqtr0LrQTOveFcBb7Kufw",
         "version" : {
            "distribution" : "opensearch",
            "number" : <version>,
            "build_type" : <build-type>,
            "build_hash" : <build-hash>,
            "build_date" : <build-date>,
            "build_snapshot" : false,
            "lucene_version" : <lucene-version>,
            "minimum_wire_compatibility_version" : "7.10.0",
            "minimum_index_compatibility_version" : "7.0.0"
         },
         "tagline" : "The OpenSearch Project: https://opensearch.org/"
      }
      ```
   - Query the plugins endpoint:
      ```bat
      curl.exe -X GET https://localhost:9200/_cat/plugins?v -u "admin:admin" --insecure
      ```
      {% include copy.html %}

      The response should look like this:
      ```bat
      hostname opensearch-alerting                  {{site.opensearch_version}}
      hostname opensearch-anomaly-detection         {{site.opensearch_version}}
      hostname opensearch-asynchronous-search       {{site.opensearch_version}}
      hostname opensearch-cross-cluster-replication {{site.opensearch_version}}
      hostname opensearch-geospatial                {{site.opensearch_version}}
      hostname opensearch-index-management          {{site.opensearch_version}}
      hostname opensearch-job-scheduler             {{site.opensearch_version}}
      hostname opensearch-knn                       {{site.opensearch_version}}
      hostname opensearch-ml                        {{site.opensearch_version}}
      hostname opensearch-neural-search             {{site.opensearch_version}}
      hostname opensearch-notifications             {{site.opensearch_version}}
      hostname opensearch-notifications-core        {{site.opensearch_version}}
      hostname opensearch-observability             {{site.opensearch_version}}
      hostname opensearch-reports-scheduler         {{site.opensearch_version}}
      hostname opensearch-security                  {{site.opensearch_version}}
      hostname opensearch-security-analytics        {{site.opensearch_version}}
      hostname opensearch-sql                       {{site.opensearch_version}}
      ```

### Option 2: Test your OpenSearch settings with security disabled

1. Open the `opensearch-{{site.opensearch_version}}\config` folder.
1. Open the `opensearch.yml` file with a text editor.
1. Add the following line to disable the Security plugin:
   ```yaml
   plugins.security.disabled: true
   ```
   {% include copy.html %}

1. Save the change and close the file.
1. Navigate to the top directory of your OpenSearch installation and open the `opensearch-{{site.opensearch_version}}` folder.
1. Run the default by double-clicking the `opensearch-windows-install.bat` file. This opens a command prompt with an OpenSearch instance running.
1. Open a new command prompt and send requests to the server to verify that OpenSearch is running. Because the Security plugin has been disabled, you will be sending commands using `HTTP` rather than `HTTPS`.
   - Send a request to port 9200:
      ```bat
      curl.exe -X GET http://localhost:9200
      ```
      {% include copy.html %}

      You should get a response that looks like this:
      ```bat
      {
         "name" : "hostname-here",
         "cluster_name" : "opensearch",
         "cluster_uuid" : "7Nqtr0LrQTOveFcBb7Kufw",
         "version" : {
            "distribution" : "opensearch",
            "number" : "2.4.0",
            "build_type" : "zip",
            "build_hash" : "77ef9e304dd6ee95a600720a387a9735bbcf7bc9",
            "build_date" : "2022-11-05T05:50:15.404072800Z",
            "build_snapshot" : false,
            "lucene_version" : "9.4.1",
            "minimum_wire_compatibility_version" : "7.10.0",
            "minimum_index_compatibility_version" : "7.0.0"
         },
         "tagline" : "The OpenSearch Project: https://opensearch.org/"
      }
      ```
   - Query the plugins endpoint:
      ```bat
      curl.exe -X GET http://localhost:9200/_cat/plugins?v
      ```
      {% include copy.html %}

      The response should look like this:
      ```bat
      hostname opensearch-alerting                  {{site.opensearch_version}}
      hostname opensearch-anomaly-detection         {{site.opensearch_version}}
      hostname opensearch-asynchronous-search       {{site.opensearch_version}}
      hostname opensearch-cross-cluster-replication {{site.opensearch_version}}
      hostname opensearch-geospatial                {{site.opensearch_version}}
      hostname opensearch-index-management          {{site.opensearch_version}}
      hostname opensearch-job-scheduler             {{site.opensearch_version}}
      hostname opensearch-knn                       {{site.opensearch_version}}
      hostname opensearch-ml                        {{site.opensearch_version}}
      hostname opensearch-neural-search             {{site.opensearch_version}}
      hostname opensearch-notifications             {{site.opensearch_version}}
      hostname opensearch-notifications-core        {{site.opensearch_version}}
      hostname opensearch-observability             {{site.opensearch_version}}
      hostname opensearch-reports-scheduler         {{site.opensearch_version}}
      hostname opensearch-security                  {{site.opensearch_version}}
      hostname opensearch-security-analytics        {{site.opensearch_version}}
      hostname opensearch-sql                       {{site.opensearch_version}}
      ```

To stop OpenSearch, press `Ctrl+C` in Command Prompt or Powershell, or simply close the Command Prompt or Powershell window.
{: .tip} 

## Step 3: Set up OpenSearch in your environment

Users who do not have prior experience with OpenSearch may want a list of recommended settings in order to get started with the service. By default, OpenSearch is not bound to a network interface and cannot be reached by external hosts. Additionally, security settings are either undefined (greenfield install) or populated by default usernames and passwords if you ran the security demo script by invoking <span style="white-space: nowrap">`opensearch-windows-install.bat`.</span> The following recommendations will enable a user to bind OpenSearch to a network interface.

The following recommended settings will allow you to:

- Bind OpenSearch to an IP or network interface on the host.
- Set initial and maximum JVM heap sizes.
- Define an environment variable that points to the bundled JDK.

If you ran the security demo script, then you will need to manually reconfigure settings that were modified. Refer to [Security configuration]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/) for guidance before proceeding.
{:.note}

Before modifying any configuration files, it's always a good idea to save a backup copy before making changes. The backup file can be used to revert any issues caused by a bad configuration.
{:.tip}

1. Open the `opensearch-{{site.opensearch_version}}\config` folder.
1. Open the `opensearch.yml` file with a text editor.
1. Add the following lines:
   ```bash
   # Bind OpenSearch to the correct network interface. Use 0.0.0.0
   # to include all available interfaces or specify an IP address
   # assigned to a specific interface.
   network.host: 0.0.0.0

   # Unless you have already configured a cluster, you should set
   # discovery.type to single-node, or the bootstrap checks will
   # fail when you try to start the service.
   discovery.type: single-node

   # If you previously disabled the Security plugin in opensearch.yml,
   # be sure to re-enable it. Otherwise you can skip this setting.
   plugins.security.disabled: false
   ```
   {% include copy.html %}

1. Save your changes and close the file.
1. Specify initial and maximum JVM heap sizes.
   1.  Open the `opensearch-{{site.opensearch_version}}\config` folder.
   1.  Open the `jvm.options` file with a text editor.
   1. Modify the values for initial and maximum heap sizes. As a starting point, you should set these values to half of the available system memory. For dedicated hosts this value can be increased based on your workflow requirements.<br>
    As an example, if the host machine has 8 GB of memory, then you might want to set the initial and maximum heap sizes to 4 GB:
    ```bash
    -Xms4g
    -Xmx4g
    ```
    {% include copy.html %}

   1. Save your changes and close the file.
1. Specify the location of the included JDK. 
    1. In the search box next to **Start** on the taskbar, enter `edit environment variables for your account` or `edit the system environment variables`. To edit the system environment variables, you need admin rights. User environment variables take precedence over system environment variables.
    1. Select **Edit environment variables for your account** or **Edit the system environment variables**. 
    1. If the **System Properties** dialog opens, in the **Advanced** tab, select **Environment Variables**.
    1. Under **User variables** or **System variables**, select **New**.
    1. In **Variable name**, enter `OPENSEARCH_JAVA_HOME`.
    1. In **Variable value**, enter `\path\to\opensearch-{{site.opensearch_version}}\jdk`.
    1. Select **OK** to close all dialogs.

## Plugin compatibility

The Performance Analyzer plugin is not available on Windows. All other OpenSearch plugins, including the k-NN plugin, are available. For a complete list of plugins, see [Available plugins]({{site.url}}{{site.baseurl}}/opensearch/install/plugins/#available-plugins).

## Related links

- [OpenSearch configuration]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/)
- [OpenSearch plugin installation]({{site.url}}{{site.baseurl}}/opensearch/install/plugins/)
- [About the Security plugin]({{site.url}}{{site.baseurl}}/security/index/)
