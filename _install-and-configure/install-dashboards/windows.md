---
layout: default
title: Windows
parent: Installing OpenSearch Dashboards
nav_order: 40
redirect_from: 
  - /dashboards/install/windows/
---

<!-- vale off -->
# Installing OpenSearch Dashboards on Windows
<!-- vale on -->

## Prerequisites

Before you install OpenSearch Dashboards, complete the following tasks:

- Install OpenSearch. For more information, see [Installing OpenSearch on Windows]({{site.url}}{{site.baseurl}}/install-and-configure/install-opensearch/windows/).
- Install a zip utility.

## Install OpenSearch Dashboards on Windows

To install OpenSearch Dashboards on Windows, follow these steps:

1. Download the [`opensearch-dashboards-{{site.opensearch_dashboards_version}}-windows-x64.zip`](https://artifacts.opensearch.org/releases/bundle/opensearch-dashboards/{{site.opensearch_dashboards_version}}/opensearch-dashboards-{{site.opensearch_dashboards_version}}-windows-x64.zip){:target='\_blank'} archive.

1. To extract the archive contents, right-click to select **Extract All**. The archive contains about 100,000 files, so extracting it this way can take a long time. Alternatively, extract the archive from Command Prompt or PowerShell using the `tar` command included with Windows, which is faster:

   ```bat
   tar -xf opensearch-dashboards-{{site.opensearch_dashboards_version}}-windows-x64.zip
   ```
   {% include copy.html %}

   **Note**: Some file paths in the archive are close to the 260-character path length limit of some versions of Windows. Extracting the archive to a short path, such as `C:\opensearch`, helps you avoid path-length errors. If you encounter a path-length-related error when unzipping the archive, perform the following steps to enable long path support:

   1. Open Powershell by entering `powershell` in the search box next to **Start** on the taskbar. 
   1. Run the following command in Powershell:
      ```powershell
      Set-ItemProperty -Path HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem LongPathsEnabled -Type DWORD -Value 1 -Force
      ```
      {% include copy.html %}
   1. Restart your computer.

1. Configure OpenSearch Dashboards.

    There are two ways to configure OpenSearch Dashboards, depending on whether OpenSearch is configured with security enabled or disabled.

    In order for any changes to the `opensearch_dashboards.yml` file to take effect, a restart of OpenSearch Dashboards is required.
    {: .note}

    1. Option 1 -- With security enabled:
  
        Configuration file `\path\to\opensearch-dashboards-{{site.opensearch_dashboards_version}}\config\opensearch_dashboards.yml` comes packaged with following basic settings:
        
        ```yaml
        opensearch.hosts: [https://localhost:9200]
        opensearch.ssl.verificationMode: none
        opensearch.username: kibanaserver
        opensearch.password: kibanaserver
        opensearch.requestHeadersWhitelist: [authorization, securitytenant]
        
        opensearch_security.multitenancy.enabled: true
        opensearch_security.multitenancy.tenants.preferred: [Private, Global]
        opensearch_security.readonly_mode.roles: [kibana_read_only]
        # Use this setting if you are running opensearch-dashboards without https
        opensearch_security.cookie.secure: false
        ```
    
    1. Option 2 -- With OpenSearch security disabled:

        If you are using OpenSearch with security disabled, remove the Security plugin from OpenSearch Dashboards using the following command:
        
        ```bat
        \path\to\opensearch-dashboards-{{site.opensearch_dashboards_version}}\bin\opensearch-dashboards-plugin.bat remove securityDashboards
        ```
        {% include copy.html %}
        
        Then replace the contents of the `opensearch_dashboards.yml` file with the following setting:
        
        ```yaml
        opensearch.hosts: [http://localhost:9200]
        ```
        {% include copy.html %}

        After you remove the Security plugin, OpenSearch Dashboards fails to start with an `Unknown configuration key(s)` error if `opensearch_dashboards.yml` still contains `opensearch_security` settings. Make sure to remove all of the packaged settings.
        {: .note}
         
        Note the plain `http` method, instead of `https`.
        {: .note}
    
1. Run OpenSearch Dashboards.

   There are two ways of running OpenSearch Dashboards:

   1. Run the batch script using the Windows UI:

      1. Navigate to the top directory of your OpenSearch Dashboards installation and open the `opensearch-dashboards-{{site.opensearch_dashboards_version}}` folder.
      1. Open the `bin` folder and run the batch script by double-clicking the `opensearch-dashboards.bat` file. This opens a command prompt with an OpenSearch Dashboards instance running.

   1. Run the batch script from Command Prompt or Powershell:

      1. Open Command Prompt by entering `cmd`, or Powershell by entering `powershell`, in the search box next to **Start** on the taskbar. 
      1. Change to the top directory of your OpenSearch Dashboards installation.
         ```bat
         cd \path\to\opensearch-dashboards-{{site.opensearch_dashboards_version}}
         ```
         {% include copy.html %}
      1. Run the batch script to start OpenSearch Dashboards.
         ```bat
         .\bin\opensearch-dashboards.bat
         ```
         {% include copy.html %}

1. In a web browser, go to `http://localhost:5601`. OpenSearch Dashboards can take about 2 minutes to start. If you configured OpenSearch Dashboards with security enabled, log in as the `admin` user using the custom admin password that you set when you installed OpenSearch. If OpenSearch Dashboards runs on a remote host, replace `localhost` with the IP address or DNS name of that host. For more information, see [Accessing OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/#accessing-opensearch-dashboards).

To stop OpenSearch Dashboards, press `Ctrl+C` in Command Prompt or Powershell, or close the Command Prompt or Powershell window.
{: .tip}

## Related documentation

- [Preparing OpenSearch Dashboards for production]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/#preparing-opensearch-dashboards-for-production)
