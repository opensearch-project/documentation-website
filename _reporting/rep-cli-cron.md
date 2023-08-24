---
layout: default
title: Schedule reports with the cron utility
nav_order: 20
parent: Reporting using the CLI
grand_parent: Reporting
redirect_from:
  - /dashboards/reporting-cli/rep-cli-cron/
---

# Schedule reports with the cron utility

You can use the cron command-line utility to initiate a report request with the Reporting CLI that runs periodically at any date or time interval. Follow the cron expression syntax to specify the date and time that precedes the command that you want to initiate.

To learn about the cron expression syntax, see [Cron expression reference]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/cron/). To get help with cron, open the man page by running the following command:

```
man cron
```

### Prerequisites

- You need a machine with cron installed.
- You need to install the Reporting CLI. See [Downloading and installing the Reporting CLI tool]({{site.url}}{{site.baseurl}}/dashboards/reporting-cli/rep-cli-install/)

## Specifying the report details

Open the crontab editor by running the following command:

```
crontab -e
```
In the crontab editor, enter the report request. The following example shows a cron report that runs every day at 8:00 AM:

```
0 8 * * * opensearch-reporting-cli -u https://playground.opensearch.org/app/dashboards#/view/084aed50-6f48-11ed-a3d5-1ddbf0afc873 -e ses -s <sender_email> -r <recipient_email>
```