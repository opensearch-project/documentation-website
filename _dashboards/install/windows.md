---
layout: default
title: Windows
parent: Install OpenSearch Dashboards
nav_order: 37
---

# Run OpenSearch Dashboards on Windows

Follow the steps below to install OpenSearch Dashboards on Windows.

Make sure you have a zip utility installed.
{: .tip }

1. Download the [`opensearch-dashboards-{{site.opensearch_version}}-windows-x64.zip`](https://artifacts.opensearch.org/releases/bundle/opensearch-dashboards/{{site.opensearch_version}}/opensearch-dashboards-{{site.opensearch_version}}-windows-x64.zip){:target='\_blank'} archive.

1. To extract the archive contents, right-click to select **Extract All**.

1. Run OpenSearch Dashboards.

   There are two ways of running OpenSearch Dashboards:

   1. Run the batch script using the Windows UI:

      1. Navigate to the top directory of your OpenSearch Dashboards install and open the `opensearch-dashboards-{{site.opensearch_version}}` folder.
      1. If desired, modify `opensearch_dashboards.yml` located in the `config` folder.
      1. Open the `bin` folder and run the batch script by double-clicking the `opensearch-dashboards.bat` file. This opens a command prompt with an OpenSearch Dashboards instance running.

   1. Run the batch script from a command prompt or Powershell:

      1. Open command prompt by entering `cmd`, or Powershell by entering `powershell`, in the search box next to **Start** on the taskbar. 
      1. Change to the top directory of your OpenSearch Dashboards install.
         ```bat
         cd \path\to\opensearch-dashboards-{{site.opensearch_version}}
         ```
      1. If desired, modify `config\opensearch_dashboards.yml`.
      1. Run the batch script to start OpenSearch Dashboards.
         ```bat
         .\bin\opensearch-dashboards.bat
         ```

To stop OpenSearch Dashboards, press `Ctrl+C` in command prompt or Powershell, or simply close the command prompt or Powershell window.
{: .tip} 