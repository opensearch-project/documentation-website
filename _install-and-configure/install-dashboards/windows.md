---
layout: default
title: Windows
parent: Installing OpenSearch Dashboards
nav_order: 37
redirect_from: 
  - /dashboards/install/windows/
---

# Run OpenSearch Dashboards on Windows

Perform the following steps to install OpenSearch Dashboards on Windows.

Make sure you have a zip utility installed.
{: .note }

1. Download the [`opensearch-dashboards-{{site.opensearch_version}}-windows-x64.zip`](https://artifacts.opensearch.org/releases/bundle/opensearch-dashboards/{{site.opensearch_version}}/opensearch-dashboards-{{site.opensearch_version}}-windows-x64.zip){:target='\_blank'} archive.

1. To extract the archive contents, right-click to select **Extract All**.
   
   **Note**: Some versions of the Windows operating system limit the file path length. If you encounter a path-length-related error when unzipping the archive, perform the following steps to enable long path support:

   1. Open Powershell by entering `powershell` in the search box next to **Start** on the taskbar. 
   1. Run the following command in Powershell:
      ```bat
      Set-ItemProperty -Path HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem LongPathsEnabled -Type DWORD -Value 1 -Force
      ```
   1. Restart your computer.

1. Run OpenSearch Dashboards.

   There are two ways of running OpenSearch Dashboards:

   1. Run the batch script using the Windows UI:

      1. Navigate to the top directory of your OpenSearch Dashboards installation and open the `opensearch-dashboards-{{site.opensearch_version}}` folder.
      1. If desired, modify `opensearch_dashboards.yml` located in the `config` folder, to change the default OpenSearch Dashboards settings.
      1. Open the `bin` folder and run the batch script by double-clicking the `opensearch-dashboards.bat` file. This opens a command prompt with an OpenSearch Dashboards instance running.

   1. Run the batch script from Command Prompt or Powershell:

      1. Open Command Prompt by entering `cmd`, or Powershell by entering `powershell`, in the search box next to **Start** on the taskbar. 
      1. Change to the top directory of your OpenSearch Dashboards installation.
         ```bat
         cd \path\to\opensearch-dashboards-{{site.opensearch_version}}
         ```
      1. If desired, modify `config\opensearch_dashboards.yml`.
      1. Run the batch script to start OpenSearch Dashboards.
         ```bat
         .\bin\opensearch-dashboards.bat
         ```

To stop OpenSearch Dashboards, press `Ctrl+C` in Command Prompt or Powershell, or simply close the Command Prompt or Powershell window.
{: .tip} 