---
layout: default
title: Getting started
parent: Threat intelligence
nav_order: 41
---

# Getting started

Use the following steps to get started with threat intelligence.

## Threat intelligence view

To access threat intelligence, log into OpenSearch Dashboards, and select **Security Analytics** > **Threat Intelligence**.

In the threat intelligence view, you can access the following by selecting the following tabs:

- **Threat intel sources**: Gives a list of all active and inactive threat intelligence sources. This includes the default IP reputation feed [AlienVault OTX](https://otx.alienvault.com/). This feed comes prepackaged when downloading OpenSearch.
- **Scan configuration**: Gives a quick overview of your scan configuration, including the **Log sources**, **Scan schedule**, and **Alert triggers** configured. From the **Actions** dropdown, you can also **Stop scan**, **Edit scan configuration**, or **Delete scan configuration**.


## Step 1: Set up threat intelligence sources

To add a threat intelligence source, select **Add threat intel source** from the threat intelligence page. The **Add custom threat intelligence source** page appears. 

On the threat intelligence source page, add the following information:

- **Name**: A name for the source.
- **Description**: An optional description for the source.
- **Threat intel source type**: The source type determines where the `STIX2` file is stored. You can choose one of the following options:
  - **Remote data store location**: Connects to a custom data store. As of OpenSearch 2.16, only the `S3_SOURCE` type is supported. This setting also gives you the ability to set a download schedule, where OpenSearch downloads the newest STIX2 file from the data store. For more information, see [S3_SOURCE connection details](#s3_source-connection-details)
  - **Local file upload**: Uploads a custom threat intelligence IoC file. Custom files cannot be set to download schedule and must be uploaded manually in order to update the IoCs. For more information, see  [Local file upload](#local-file-upload).
- **Types of malicious indicators**: Determines the malicious IoCs to pull from the STIX2 file. The following IoCs are supported:
  - IPV4-Address
  - IPV6-Address
  - Domains
  - File hash

After all the relevant information has been entered, select **Add threat intel source**.

### Local file upload

Local files uploaded as the threat intelligence source must use the following specifications:

- Upload as a JSON file in the STIX2 format. For an example STIX2 file, [download the following example].
- Be less than 500 kB.


### S3_SOURCE connection details 

When using the `S3_SOURCE` as a remote store, the following connection details must be provided:

- **IAM Role ARN**: The Amazon Resource Name (ARN) for an IAM role.
- **S3 bucket directory**: The S3 bucket name where the STIX2 file is stored.
- **Specify a directory or file**: The object key or directory path for STIX2 file inside the S3 bucket.
- **Region**: The region for the S3 bucket.

You can also set the **Download schedule** which determines where OpenSearch downloads an updated STIX2 file from the connect S3 bucket. The default interval is once a day. Only day intervals are supported. 

Alternatively, you can check the **Download on demand** option, which prevents new data from the bucket from being automatically downloaded.


## Step 2: Set up the scan for your log sources

You can configure threat intelligence monitors to scan your aliases and data streams. The monitor scans for newly ingested data from your indexes and matches tat data against any IoC's present in threat intelligence monitors. The scan applies to all threat intelligence source added to OpenSearch. By default, the scan runs every minute.

To add or a scan configuration:

1. From the threat intelligence view, select **Add scan configuration** or **Edit scan configuration**.
2. Select the indexes or alias to scan.
3. Select the **fields** from your indexes and alias to scan based on their IoC type. For example, if an alias has two fields called `src_ip` and `dst_ip` which contain `ipv4` addresses, those fields must be entered into the `ipv4-addr` section of the monitor request.
4. Determine a **Scan schedule**, which decides the frequency of the scan against the indicated indexes and aliases. By default, OpenSearch scans for IoCs every minute.
5. Set up any alert triggers and trigger conditions. You can add multiple triggers.
   1. Add a name for the trigger.
   2. Pick an indicator type. The indicator type matches the IoC types.
   3. Select a severity for the alert. 
   4. Select whether to send a notification when the alert triggers. When enabled, you can customize which channels the notification is sent to, and the notification message. Notification message can be customized using a [mustache template](https://mustache.github.io/mustache.5.html).
6. With your settings complete, select **Save and start monitoring**.

When malicious IoC's are found, OpenSearch creates **findings**, which gives information about the threat. You can also configure triggers with the monitors to create alerts, which sends notifications to configured webhooks or endpoints.

## Viewing active threat intelligence sources

From the **Threat intelligence** view, you can find any active or inactive threat intelligence sources in the **Threat int


## Viewing alerts and findings 

You can view the findings and alerts generated by threat intelligence monitors to analyze which malicious indicators have occurred in their security logs. To view alerts or findings, select **View findings** or **View alerts** from the Threat intelligence view.
