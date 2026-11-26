---
layout: default
title: Schedule reports with the cron utility
nav_order: 20
parent: Reporting using the CLI
grand_parent: Reporting
redirect_from:
  - /reporting/rep-cli-cron/
  - /dashboards/reporting-cli/rep-cli-cron/
---

# Schedule reports with the cron utility

Use the cron command-line utility to run the Reporting CLI on a schedule. Each cron entry consists of a cron expression that specifies when to run, followed by the command to run.

To learn about the cron expression syntax, see [Cron expressions]({{site.url}}{{site.baseurl}}/api-reference/cron-expressions/). To get help with cron, open the man page by running the following command:

```bash
man crontab
```
{% include copy.html %}

## Prerequisites

- A machine with cron installed.
- The Reporting CLI. For instructions, see [Download and install the Reporting CLI tool]({{site.url}}{{site.baseurl}}/dashboards/reporting/rep-cli-install/).

## Specifying the schedule

Cron runs commands with a minimal `PATH` that usually contains only `/usr/bin` and `/bin`, so cron cannot find the `node` and `opensearch-reporting-cli` commands unless you set `PATH` in the crontab. To find the directories that contain these commands, run the following command:

```bash
dirname "$(command -v node)" "$(command -v opensearch-reporting-cli)"
```
{% include copy.html %}

Open the crontab editor by running the following command:

```bash
crontab -e
```
{% include copy.html %}

In the crontab editor, set `PATH` to include the directories returned by the preceding command, and then add the report request. The following example generates a report every day at 8:00 AM and sends it by email using Amazon SES:

```
PATH=/usr/local/bin:/usr/bin:/bin
0 8 * * * opensearch-reporting-cli -u '<dashboards-url>' -e ses -s <sender-email> -r <recipient-email>
```

Cron converts every `%` character in a command into a new line, and OpenSearch Dashboards URLs usually contain `%` characters. Enclose the URL in single quotes and escape each `%` character in the URL as `\%`. Alternatively, store the URL in a `.env` file as described in the following section.
{: .important}

If you specify a file name using the `-n` option, the Reporting CLI fails on the second run because a file with the same name already exists. Omit the file name to save each report with a timestamped file name, or delete the previous report before the next run.
{: .note}

## Storing report settings in a .env file

Instead of providing the URL and other options in the cron command, store them in a `.env` file. Values in a `.env` file do not need escaping. Cron runs commands from your home directory, so change to the directory that contains the `.env` file before running the Reporting CLI.

For example, create a `/home/<user>/reports/.env` file containing the following variables:

```
OPENSEARCH_URL="<dashboards-url>"
OPENSEARCH_TRANSPORT=smtp
OPENSEARCH_SMTP_HOST=<smtp-host>
OPENSEARCH_SMTP_PORT=<smtp-port>
OPENSEARCH_FROM=<sender-email>
OPENSEARCH_TO=<recipient-email>
```

Then add the following entry to the crontab:

```
PATH=/usr/local/bin:/usr/bin:/bin
0 8 * * * cd /home/<user>/reports && opensearch-reporting-cli
```

For more information, see [Use environment variables with the Reporting CLI]({{site.url}}{{site.baseurl}}/dashboards/reporting/rep-cli-env-var/).
