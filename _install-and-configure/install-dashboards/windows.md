---
layout: default
title: Windows
parent: Installing OpenSearch Dashboards
nav_order: 37
redirect_from: 
  - /dashboards/install/windows/
canonical_url: https://docs.opensearch.org/latest/install-and-configure/install-dashboards/windows/
---

# Run OpenSearch Dashboards on Windows

Perform the following steps to install OpenSearch Dashboards on Windows.

Make sure you have a zip utility installed.
{: .note }

1. Download the [`opensearch-dashboards-{{site.opensearch_dashboards_version}}-windows-x64.zip`](https://artifacts.opensearch.org/releases/bundle/opensearch-dashboards/{{site.opensearch_dashboards_version}}/opensearch-dashboards-{{site.opensearch_dashboards_version}}-windows-x64.zip){:target='\_blank'} archive.

1. To extract the archive contents, right-click to select **Extract All**.
   
   **Note**: Some versions of the Windows operating system limit the file path length. If you encounter a path-length-related error when unzipping the archive, perform the following steps to enable long path support:

   1. Open Powershell by entering `powershell` in the search box next to **Start** on the taskbar. 
   1. Run the following command in Powershell:
      ```bat
      Set-ItemProperty -Path HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem LongPathsEnabled -Type DWORD -Value 1 -Force
      ```
   1. Restart your computer.

1. Configure OpenSearch Dashboards.

    There are two ways to configure OpenSearch Dashboards, depending on whether OpenSearch is configured with security enabled or disabled.

    In order for any changes to the `opensearch_dashboards.yml` file to take effect, a restart of OpenSearch Dashboards is required.
    {: .note}

    1. Option 1 -- With security enabled:
  
        Configuration file `\path\to\opensearch-dashboards-{{site.opensearch_dashboards_version}}\config\opensearch_dashboards.yml` comes packaged with following basic settings:
        
        ```
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
        
        ```
        \path\to\opensearch-dashboards-{{site.opensearch_dashboards_version}}\bin\opensearch-dashboards-plugin.bat remove securityDashboards
        ```
        
        The basic `opensearch_dashboards.yml` file should contain:
        
        ```
        opensearch.hosts: [http://localhost:9200]
        ```
         
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
      1. Run the batch script to start OpenSearch Dashboards.
         ```bat
         .\bin\opensearch-dashboards.bat
         ```

To stop OpenSearch Dashboards, press `Ctrl+C` in Command Prompt or Powershell, or simply close the Command Prompt or Powershell window.
{: .tip} 
