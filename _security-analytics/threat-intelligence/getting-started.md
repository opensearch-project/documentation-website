---
layout: default
title: Getting started
parent: Threat intelligence
nav_order: 41
---

# Getting started

To get started with threat intelligence, you'll need to set up your threat intelligence sources and set up monitors to scan your log sources. The following tutorial shows you how to get started using OpenSearch Dashboards. Alternatively, you can use the [API]({{site.url}}{{site.baseurl}}/security-analytics/threat-intelligence/api/threat-intel-api/). 

## Threat intelligence view

To access threat intelligence, log in to OpenSearch Dashboards and select **Security Analytics** > **Threat Intelligence**.

In the threat intelligence view, you can access the following tabs:

- **Threat intel sources**: Shows a list of all active and inactive threat intelligence sources, including the default IP reputation feed, [AlienVault OTX](https://otx.alienvault.com/), which comes prepackaged when downloading OpenSearch.
- **Scan configuration**: Shows an overview of your scan configuration, including the configured **Log sources**, **Scan schedule**, and **Alert triggers**. From the **Actions** dropdown list, you can also **Stop scan**, **Edit scan configuration**, or **Delete scan configuration**.


## Step 1: Set up threat intelligence sources

To add a threat intelligence source, select **Add threat intel source** from the threat intelligence page. The **Add custom threat intelligence source** page appears. 

On the threat intelligence source page, add the following information:

- **Name**: A name for the source.
- **Description**: An optional description of the source.
- **Threat intel source type**: The source type determines where the `STIX2` file is stored. You can choose one of the following options:
  - **Remote data store location**: Connects to a custom data store. As of OpenSearch 2.16, only the `S3_SOURCE` type is supported. This setting also gives you the ability to set a download schedule, where OpenSearch downloads the newest `STIX2` file from the data store. For more information, see [S3_SOURCE connection details](#s3_source-connection-information).
  - **Local file upload**: Uploads a custom threat intelligence IOC file. Custom files cannot be downloaded based on a schedule and must be uploaded manually in order to update the IOCs. For more information, see [Local file upload](#local-file-upload).
- **Types of malicious indicators**: Determines the types of malicious IOCs to pull from the `STIX2` file. The following IOCs are supported:
  - IPv4-Address
  - IPv6-Address
  - Domains
  - File hash

After all the relevant information has been entered, select **Add threat intel source**.

### Local file upload

Local files uploaded as the threat intelligence source must use the following specifications:

- Upload as a JSON file in the `STIX2` format. For an example `STIX2` file, download [this file]({{site.url}}{{site.baseurl}}/assets/examples/all-ioc-type-examples.json), which contains example formatting for all supported IOC types.
- Be less than 500 kB.


### S3_SOURCE connection information

When using the `S3_SOURCE` as a remote store, the following connection information must be provided:

- **IAM Role ARN**: The Amazon Resource Name (ARN) for an AWS Identity and Access Management (IAM) role. When using the AWS OpenSearch Service, the role ARN needs to be in the same account as the OpenSearch domain. For more information about adding a new role for the AWS OpenSearch Service, see [Add service ARN](#add-aws-opensearch-service-arn).
- **S3 bucket directory**: The name of the Amazon Simple Storage Service (Amazon S3) bucket in which the `STIX2` file is stored. To access an S3 bucket in a different AWS account, see the [Cross-account S3 bucket connection](#cross-account-s3-bucket-connection) section for more details.
- **Specify a file**: The object key for the `STIX2` file in the S3 bucket.
- **Region**: The AWS Region for the S3 bucket.

You can also set the **Download schedule**, which determines to where OpenSearch downloads an updated `STIX2` file from the connected S3 bucket. The default interval is once a day. Only daily intervals are supported. 

Alternatively, you can check the **Download on demand** option, which prevents new data from the bucket from being automatically downloaded.

#### Add AWS OpenSearch Service ARN

If you're using the AWS OpenSearch Service, create a new ARN role with a custom trust policy. For instructions on how to create the role, see [Creating a role for an AWS service](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-service.html#roles-creatingrole-service-console).

When creating the role, customize the following settings:

- Add the following custom trust policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": [
          "opensearchservice.amazonaws.com"
        ]
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```
      
- On the Permissions policies page, add the `AmazonS3ReadOnlyAccess` permission. 


#### Cross-account S3 bucket connection

Because the role ARN needs to be in the same account as the OpenSearch domain, a trust policy needs to be configured that allows the OpenSearch domain to download from S3 buckets from the same account.

To download from an S3 bucket in another account, the trust policy for that bucket needs to give the role ARN permission to read from the object, as shown in the following example:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:role/account-1-threat-intel-role"
      },
      "Action": "s3:*",
      "Resource": "arn:aws:s3:::account-2-threat-intel-bucket/*"
    }
  ]
}
```

## Step 2: Set up scanning for your log sources

You can configure threat intelligence monitors to scan your aliases and data streams. The monitor scans for newly ingested data from your indexes and matches that data against any IOCs present in the threat intelligence sources. The scan applies to all threat intelligence sources added to OpenSearch. By default, the scan runs once each minute.

To add or edit a scan configuration:

1. From the threat intelligence view, select **Add scan configuration** or **Edit scan configuration**.
2. Select the indexes or aliases to scan.
3. Select the **fields** from your indexes or aliases to scan based on their IOC type. For example, if an alias has two fields called `src_ip` and `dst_ip` that contain `ipv4` addresses, then those fields must be entered into the `ipv4-addr` section of the monitor request.
4. Determine a **Scan schedule** for the indicated indexes or aliases. By default, OpenSearch scans for IOCs once each minute.
5. Set up any alert triggers and trigger conditions. You can add multiple triggers:
   1. Add a name for the trigger.
   2. Choose an indicator type. The indicator type matches the IOC type.
   3. Select a severity for the alert. 
   4. Select whether to send a notification when the alert is triggered. When enabled, you can customize which channels the notification is sent to as well as the notification message. The notification message can be customized using a [Mustache template](https://mustache.github.io/mustache.5.html).
6. Once your settings have been entered, select **Save and start monitoring**.

When malicious IOCs are found, OpenSearch creates **findings**, which provide information about the threat. You can also configure triggers to create alerts, which send notifications to configured webhooks or endpoints.


## Viewing alerts and findings 

You can view the alerts and findings generated by threat intelligence monitors to analyze which malicious indicators have occurred in their security logs. To view alerts or findings, select **View findings** or **View alerts** from the threat intelligence view.
